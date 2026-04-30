// 마이페이지(mypage/event.js)도 window.onload를 사용하므로,
// 두 핸들러가 공존할 수 있도록 addEventListener를 쓴다.
window.addEventListener("load", function () {

    // ╔══════════════════════════════════════════════════╗
    // ║ 1. DOM Refs                                       ║
    // ╚══════════════════════════════════════════════════╝
    // 모달 컨테이너
    const overlay = document.getElementById("composerModalOverlay");
    const section = document.getElementById("composerSection");
    const composerModalClose = document.getElementById("composerModalClose");
    const createPostButton = document.getElementById("createPostButton");
    const composeView = document.getElementById("composerComposeView");

    // 폼 필드 — 마이페이지의 상품 등록 폼이 동일한 name(postName/postPrice/postContent)을
    // 사용해서 전역 querySelector를 쓰면 mypage 폼의 input을 잡아버린다.
    // composerForm 범위 안에서만 찾도록 한다.
    const composerForm = document.getElementById("postComposerForm");
    const submitButton = document.getElementById("postSubmitButton");
    const titleInput = composerForm?.querySelector('input[name="postName"]');
    const summaryInput = composerForm?.querySelector('input[name="postPrice"]');
    const contentInput = composerForm?.querySelector('textarea[name="postContent"]');
    const tagsHiddenInput = composerForm?.querySelector('input[name="tags"]');
    const locationHiddenInput = composerForm?.querySelector('input[name="location"]');

    // 카테고리 / 태그 — 마이페이지의 상품 등록 폼이 동일한 ID(categoryScroll, scrollLeft,
    // scrollRight, composerTagToggle, composerTagEditor, productTag)를 사용하므로
    // getElementById는 마이페이지 폼의 element를 잡아버린다.
    // composerSection 범위 안에서 찾도록 querySelector를 쓴다.
    const categoryScroll = section?.querySelector("#categoryScroll");
    const categoryLeftButton = section?.querySelector("#scrollLeft");
    const categoryRightButton = section?.querySelector("#scrollRight");
    const composerTagToggle = section?.querySelector("#composerTagToggle");
    const composerTagEditor = section?.querySelector("#composerTagEditor");
    const productTagInput = section?.querySelector("#productTag");
    const tagInput = document.getElementById("composerTagInput");

    // 상품 선택 서브 모달
    const productSelectButton = document.getElementById("productSelectButton");
    const productSelectModal = document.getElementById("productSelectModal");
    const productSelectBackdrop = document.getElementById("productSelectBackdrop");
    const productSelectClose = document.getElementById("productSelectClose");
    const productSelectConfirm = document.getElementById("productSelectConfirm");
    const productSelectList = document.getElementById("productSelectList");
    const selectedProductPreview = document.getElementById("selectedProductPreview");
    const selectedProductImage = document.getElementById("selectedProductImage");
    const selectedProductName = document.getElementById("selectedProductName");
    const selectedProductMeta = document.getElementById("selectedProductMeta");
    const selectedProductRemove = document.getElementById("selectedProductRemove");

    // 전문가 공유 시트 + 연결된 프로필
    const userLinkButton = document.getElementById("composerUserLinkButton");
    const linkedProfile = document.getElementById("composerLinkedProfile");
    const linkedProfileAvatar = document.getElementById("composerLinkedProfileAvatar");
    const linkedProfileEmail = document.getElementById("composerLinkedProfileEmail");
    const shareChatSheet = document.getElementById("estimationShareChatSheet");
    const shareChatSearch = document.getElementById("estimationShareChatSearch");
    const shareChatUserList = document.getElementById("estimationShareChatUserList");
    const shareChatCloseButtons = Array.from(
        document.querySelectorAll("[data-estimation-share-close]")
    );

    // 위치 / Maps
    const locationDisplayButton = document.getElementById("composerLocation");
    const locationName = document.getElementById("composerLocationName");
    const locationView = document.getElementById("composerLocationView");
    const locationCloseButton = document.getElementById("composerLocationClose");
    const locationDeleteButton = document.getElementById("composerLocationDelete");
    const locationCompleteButton = document.getElementById("composerLocationComplete");
    const locationSearchInput = document.getElementById("composerLocationSearch");
    const locationSearchButton = document.getElementById("composerLocationSearchButton");
    const locationGuide = document.getElementById("composerLocationGuide");
    const locationMapElement = document.getElementById("composerLocationMap");

    // 폼이 없으면 견적 모달이 마운트 안 된 페이지 → 초기화 중단
    if (!composerForm) return;

    const requiredFields = [titleInput, summaryInput, contentInput].filter(Boolean);

    // ╔══════════════════════════════════════════════════╗
    // ║ 2. State (모달 닫혀도 살아 있는 클로저 변수)          ║
    // ╚══════════════════════════════════════════════════╝
    const state = {
        selectedProductId: "",
        // 견적 받는 회원의 ID. 마이페이지에서는 페이지 주인이 default,
        // share-sheet에서 다른 회원을 고르면 그 ID로 갱신된다.
        selectedMemberId: window.mypageContext?.pageMemberId
            ? String(window.mypageContext.pageMemberId)
            : "",
        selectedReceiverEmail: "",
        selectedLocation: "",
        pendingLocation: "",
        lastExpertSearchKeyword: "",
        // 무한 스크롤 페이징 상태 (전문가 검색 시트)
        expertSearchPage: 1,
        isLoadingExperts: false,
        hasMoreExperts: true,
        mapInstance: null,
        mapMarker: null,
        geocoder: null,
        mapsLoaderPromise: null,
        productItems: [],
        isTagEditorOpen: false,
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 3. Helpers + Cross-cutting Syncs                  ║
    // ╚══════════════════════════════════════════════════╝
    const safeText = (value, fallback = "") => (value || fallback).trim();
    const specialCharRegex = /[\{\}\[\]\?.,;:|\)*~`!^\-_+<>@\#$%&\\=\(\'\"]/;

    // 제목 / 가격 / 내용 / 상품 다 차야 제출 버튼 활성화.
    const syncSubmitState = () => {
        if (!submitButton) return;
        const hasRequired = requiredFields.every((f) => f.value.trim());
        submitButton.disabled = !hasRequired || !state.selectedProductId;
    };

    // 태그 hidden input + 태그 영역 hidden 토글 + 토글 버튼 라벨 갱신.
    const syncTagDock = () => {
        if (!tagInput) return;
        const tagDivs = Array.from(tagInput.querySelectorAll(".tagDiv"));
        tagInput.hidden = tagDivs.length === 0;
        if (tagsHiddenInput) {
            tagsHiddenInput.value = tagDivs
                .map((el) => el.textContent.replace(/^#/, "").trim())
                .filter(Boolean)
                .join(", ");
        }
        if (composerTagToggle) {
            composerTagToggle.textContent = state.isTagEditorOpen ? "태그 닫기" : "태그 추가";
        }
    };

    const syncTagEditor = () => {
        if (composerTagEditor) composerTagEditor.hidden = !state.isTagEditorOpen;
        if (state.isTagEditorOpen) {
            window.requestAnimationFrame(() => productTagInput?.focus());
        }
    };

    // 위치 표시/삭제 버튼 + hidden input 동기화.
    const syncLocationUI = () => {
        const has = Boolean(state.selectedLocation);
        if (locationName) {
            locationName.textContent = has ? state.selectedLocation : "위치 추가";
        }
        if (locationDisplayButton) {
            locationDisplayButton.hidden = false;
            locationDisplayButton.setAttribute(
                "aria-label",
                has ? `위치 ${state.selectedLocation}` : "위치 태그하기"
            );
        }
        if (locationDeleteButton) locationDeleteButton.hidden = !has;
        if (locationCompleteButton) locationCompleteButton.disabled = !state.pendingLocation;
        if (locationHiddenInput) locationHiddenInput.value = state.selectedLocation;
    };

    // 태그 검증 + #composerTagInput에 .tagDiv 추가.
    // 카테고리 클릭과 직접 입력 두 경로에서 사용한다.
    const addTag = (rawTag, { alertOnFail = false } = {}) => {
        if (!tagInput) return false;

        const tag = (rawTag || "").trim();
        if (!tag || tag === "전체") return false;

        const existing = Array.from(tagInput.querySelectorAll(".tagDiv"));
        if (existing.length >= 5) {
            if (alertOnFail) alert("태그는 최대 5개까지 추가할 수 있어요");
            return false;
        }
        if (specialCharRegex.test(tag)) {
            if (alertOnFail) alert("특수문자는 입력 못해요");
            return false;
        }
        const normalized = `#${tag}`;
        if (existing.some((el) => el.textContent.trim() === normalized)) {
            if (alertOnFail) alert("중복된 태그가 있어요");
            return false;
        }

        const span = document.createElement("span");
        span.className = "tagDiv";
        span.textContent = normalized;
        tagInput.appendChild(span);
        state.isTagEditorOpen = false;
        if (productTagInput) productTagInput.value = "";
        syncTagEditor();
        syncTagDock();
        return true;
    };

    // 미리보기 영역(#selectedProductPreview)의 이미지/이름/가격 갱신.
    const renderSelectedProduct = () => {
        if (!selectedProductPreview) return;
        const item = state.productItems.find(
            (i) => i.dataset.productId === state.selectedProductId
        );
        if (!item || !selectedProductImage || !selectedProductName || !selectedProductMeta) {
            selectedProductPreview.hidden = true;
            syncSubmitState();
            return;
        }
        selectedProductPreview.hidden = false;
        selectedProductImage.src = item.dataset.productImage || "";
        selectedProductImage.alt = item.dataset.productName || "";
        selectedProductName.textContent = item.dataset.productName || "";
        selectedProductMeta.textContent = item.dataset.productMeta || "";
        syncSubmitState();
    };

    // 모달 항목의 is-selected/aria-pressed 동기화 + 확인 버튼 활성화.
    const syncProductSelection = () => {
        if (!productSelectConfirm) return;
        state.productItems.forEach((item) => {
            const isSelected = item.dataset.productId === state.selectedProductId;
            item.classList.toggle("is-selected", isSelected);
            item.setAttribute("aria-pressed", String(isSelected));
        });
        productSelectConfirm.disabled = !state.selectedProductId;
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 4. subPanel 팩토리                                 ║
    // ║   상품 모달, 전문가 시트, 위치 패널 공통 흐름           ║
    // ╚══════════════════════════════════════════════════╝
    // mode = "overlay": panel.hidden 토글만 (상품 모달, 전문가 시트)
    // mode = "view-swap": composeView를 숨기고 panel을 보여줌 (위치 패널)
    const subPanel = ({ panel, mode = "overlay", onOpen, onClose }) => {
        if (mode === "overlay") {
            return {
                open() {
                    panel.hidden = false;
                    onOpen?.();
                },
                close() {
                    panel.hidden = true;
                    onClose?.();
                },
            };
        }
        return {
            open() {
                if (composeView) composeView.hidden = true;
                panel.hidden = false;
                onOpen?.();
            },
            close() {
                panel.hidden = true;
                if (composeView) composeView.hidden = false;
                onClose?.();
            },
        };
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 5. setupModal — 모달 열기/닫기 + 스크롤 잠금 + ESC    ║
    // ╚══════════════════════════════════════════════════╝
    // 작성 중 내용이 있으면 닫기 전 확인. 제출 성공 후엔 resetForm() 이후
    // close 버튼을 프로그래밍 클릭하므로 hasContent가 false라 confirm 안 뜬다.
    const setupModal = () => {
        if (!overlay || !section || !createPostButton) return;

        const hasContent = () => {
            if (requiredFields.some((f) => f.value.trim())) return true;
            if (state.selectedProductId) return true;
            if (state.selectedLocation) return true;
            if (tagInput?.querySelector(".tagDiv")) return true;
            return false;
        };

        const open = () => {
            overlay.hidden = false;
            section.hidden = false;
            document.body.classList.add("modal-open");
        };

        const close = () => {
            if (hasContent() && !window.confirm("작성 중인 내용이 있어요. 닫으시겠어요?")) return;
            overlay.hidden = true;
            section.hidden = true;
            document.body.classList.remove("modal-open");
        };

        createPostButton.addEventListener("click", open);
        composerModalClose?.addEventListener("click", close);
        overlay.addEventListener("click", close);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !overlay.hidden) close();
        });
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 6. setupForm — 필수 검증 + 폼 제출                  ║
    // ╚══════════════════════════════════════════════════╝
    const setupForm = () => {
        if (!composerForm) return;

        requiredFields.forEach((field) => {
            field.addEventListener("input", syncSubmitState);
        });

        const buildPayload = () => {
            const tagDivs = tagInput ? Array.from(tagInput.querySelectorAll(".tagDiv")) : [];
            const descriptionParts = [
                safeText(summaryInput?.value),
                safeText(contentInput?.value),
            ].filter(Boolean);
            return {
                requesterId: 1,
                receiverId: state.selectedMemberId ? Number(state.selectedMemberId) : null,
                productId: state.selectedProductId ? Number(state.selectedProductId) : null,
                title: safeText(titleInput?.value),
                content: descriptionParts.join("\n"),
                location: state.selectedLocation || null,
                deadLine: null,
                status: "requesting",
                receiverEmail: state.selectedReceiverEmail || null,
                tags: tagDivs.map((el) => ({
                    tagName: el.textContent.replace(/^#/, "").trim(),
                })),
            };
        };

        const resetForm = () => {
            composerForm.reset();
            state.selectedProductId = "";
            // 마이페이지에서 진입했으면 다시 페이지 주인을 default receiver로.
            state.selectedMemberId = window.mypageContext?.pageMemberId
                ? String(window.mypageContext.pageMemberId)
                : "";
            state.selectedReceiverEmail = "";
            state.selectedLocation = "";
            state.pendingLocation = "";
            state.isTagEditorOpen = false;
            if (tagInput) {
                tagInput.innerHTML = "";
                tagInput.hidden = true;
            }
            if (productTagInput) productTagInput.value = "";
            if (tagsHiddenInput) tagsHiddenInput.value = "";
            if (locationHiddenInput) locationHiddenInput.value = "";
            if (linkedProfile) {
                linkedProfile.hidden = true;
                linkedProfile.setAttribute("aria-hidden", "true");
            }
            if (selectedProductPreview) selectedProductPreview.hidden = true;
            syncSubmitState();
            syncLocationUI();
        };

        composerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const payload = buildPayload();
            if (!payload.title || !payload.content || !payload.productId) {
                alert("제목, 내용, 상품을 먼저 입력해 주세요.");
                return;
            }

            if (submitButton) submitButton.disabled = true;
            try {
                await estimationService.writeEstimation(payload);
                alert("견적 요청이 등록되었습니다.");
                resetForm();
                // 마이페이지: 모달만 닫기. 독립 페이지: 목록으로 이동.
                if (window.location.pathname.startsWith("/mypage")) {
                    composerModalClose?.click();
                } else {
                    window.location.href = "/estimation/list";
                }
            } catch (error) {
                console.error(error);
                alert("견적 요청 저장 중 오류가 발생했습니다.");
                syncSubmitState();
            }
        });
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 7. setupCategory — 좌우 스크롤 + 칩 클릭             ║
    // ╚══════════════════════════════════════════════════╝
    const setupCategory = () => {
        if (!categoryScroll) return;

        const originalChipsHTML = categoryScroll.innerHTML;

        const checkScroll = () => {
            if (!categoryLeftButton || !categoryRightButton) return;
            const { scrollLeft, scrollWidth, clientWidth } = categoryScroll;
            categoryLeftButton.style.display = scrollLeft > 4 ? "flex" : "none";
            categoryRightButton.style.display = scrollLeft + clientWidth < scrollWidth - 4 ? "flex" : "none";
        };

        categoryScroll.addEventListener("scroll", checkScroll);
        categoryLeftButton?.addEventListener("click", () => {
            categoryScroll.scrollBy({ left: -200, behavior: "smooth" });
        });
        categoryRightButton?.addEventListener("click", () => {
            categoryScroll.scrollBy({ left: 200, behavior: "smooth" });
        });

        categoryScroll.addEventListener("click", (event) => {
            // 뒤로가기 → 원본 마크업 복원
            if (event.target.closest(".cat-back-btn")) {
                categoryScroll.innerHTML = originalChipsHTML;
                categoryScroll.scrollLeft = 0;
                window.setTimeout(checkScroll, 50);
                return;
            }

            const chip = event.target.closest(".cat-chip");
            if (!chip) return;

            // has-subs → 서브 메뉴로 전환
            if (chip.classList.contains("has-subs")) {
                const catName = chip.dataset.cat;
                const subs = (chip.dataset.subs || "").split(",").map((s) => s.trim()).filter(Boolean);
                if (!catName || !subs.length) return;

                const backButton =
                    `<button class="cat-back-btn" title="대카테고리로 돌아가기" type="button">` +
                    `<svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(270 12 12)"/></svg>` +
                    `</button>`;
                const parentChip = `<button class="cat-chip parent-highlight" type="button">${catName}</button>`;
                const subChips = subs
                    .map((s) => `<button class="cat-chip" data-cat="${s}" data-is-sub="true" type="button">${s}</button>`)
                    .join("");
                categoryScroll.innerHTML = backButton + parentChip + subChips;
                categoryScroll.scrollLeft = 0;
                window.setTimeout(checkScroll, 50);
                return;
            }

            // 일반 칩 → 태그 추가
            const chipText = (chip.dataset.cat || chip.textContent).trim();
            if (chipText === "전체") return;
            if (!addTag(chipText)) return;

            categoryScroll
                .querySelectorAll(".cat-chip:not(.parent-highlight)")
                .forEach((c) => c.classList.remove("active", "sub-active"));
            chip.classList.add(chip.dataset.isSub ? "sub-active" : "active");
        });

        checkScroll();
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 8. setupTagInput — 직접 입력 + 칩 X 삭제 + 토글        ║
    // ╚══════════════════════════════════════════════════╝
    const setupTagInput = () => {
        if (!tagInput) return;

        // 칩 X 클릭 → 칩 제거
        tagInput.addEventListener("click", (event) => {
            const tagEl = event.target.closest(".tagDiv");
            if (!tagEl) return;
            tagEl.remove();
            syncTagDock();
        });

        // "태그 추가" 버튼 → 에디터 토글
        composerTagToggle?.addEventListener("click", () => {
            state.isTagEditorOpen = !state.isTagEditorOpen;
            syncTagEditor();
            syncTagDock();
        });

        // 입력창 Enter → 태그 추가
        productTagInput?.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            addTag(productTagInput.value, { alertOnFail: true });
        });
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 9. setupProductSelect — 상품 선택 서브 모달            ║
    // ╚══════════════════════════════════════════════════╝
    const setupProductSelect = () => {
        if (!productSelectButton || !productSelectModal) return;

        const panel = subPanel({
            panel: productSelectModal,
            onOpen: async () => {
                // 견적 요청은 선택한 회원의 상품을 대상으로 한다.
                if (!state.selectedMemberId) {
                    estimationLayout.showProductList([]);
                    state.productItems = [];
                    const empty = document.getElementById("productSelectEmpty");
                    if (empty) empty.textContent = "먼저 회원을 선택해 주세요";
                    syncProductSelection();
                    return;
                }
                try {
                    const products = await estimationService.getProducts(state.selectedMemberId);
                    estimationLayout.showProductList(products);
                    state.productItems = Array.from(
                        productSelectList?.querySelectorAll(".productSelectModal__item") ?? []
                    );
                } catch (error) {
                    console.error(error);
                    // 실패 시 빈 목록으로 처리 → layout이 #productSelectEmpty 자동 표시
                    estimationLayout.showProductList([]);
                    state.productItems = [];
                }
                syncProductSelection();
            },
        });

        // 트리거: "상품 추가" 버튼 → 모달 열기 + fetch
        productSelectButton.addEventListener("click", panel.open);

        // 닫기: X, backdrop
        productSelectClose?.addEventListener("click", panel.close);
        productSelectBackdrop?.addEventListener("click", panel.close);

        // 항목 클릭 → 임시 선택 토글 (확인 누르기 전까지는 미리보기 안 바뀜)
        productSelectList?.addEventListener("click", (event) => {
            const item = event.target.closest(".productSelectModal__item");
            if (!item) return;
            state.selectedProductId = item.dataset.productId || "";
            syncProductSelection();
        });

        // 확인 버튼 → 미리보기 갱신 + 모달 닫기
        productSelectConfirm?.addEventListener("click", () => {
            renderSelectedProduct();
            panel.close();
        });

        // 미리보기 X 버튼 → 선택 해제
        selectedProductRemove?.addEventListener("click", () => {
            state.selectedProductId = "";
            syncProductSelection();
            renderSelectedProduct();
        });
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 10. setupExpertShare — 전문가 검색 시트 + 프로필 연결    ║
    // ╚══════════════════════════════════════════════════╝
    const setupExpertShare = () => {
        if (!userLinkButton || !shareChatSheet) return;

        // append=false (기본): 새 검색 → page 1로 리셋 후 fetch
        // append=true: 무한 스크롤로 다음 페이지 fetch
        const fetchAndShowExperts = async ({ append = false } = {}) => {
            if (!shareChatUserList) return;
            if (state.isLoadingExperts) return;
            if (append && !state.hasMoreExperts) return;

            const keyword = shareChatSearch?.value.trim() || "";
            if (!append) {
                state.lastExpertSearchKeyword = keyword;
                state.expertSearchPage = 1;
                state.hasMoreExperts = true;
            }
            const page = state.expertSearchPage;

            const emptyEl = document.getElementById("estimationShareChatEmpty");
            if (page === 1 && emptyEl) emptyEl.textContent = "검색된 전문가가 없습니다.";

            state.isLoadingExperts = true;
            try {
                const experts = await estimationService.getExperts(keyword, page);
                // 늦게 도착한 응답이 최신 keyword와 다르면 무시 (race 방지)
                if (keyword !== state.lastExpertSearchKeyword) return;

                const items = Array.isArray(experts) ? experts : [];
                // 페이지 크기(20)보다 적게 오면 더 이상 없음.
                if (items.length < 20) state.hasMoreExperts = false;
                estimationLayout.showExpertList(items, page);
                if (items.length > 0) state.expertSearchPage = page + 1;
            } catch (error) {
                if (keyword !== state.lastExpertSearchKeyword) return;
                console.error(error);
                if (page === 1) {
                    estimationLayout.showExpertList([], 1);
                    if (emptyEl) emptyEl.textContent = "전문가 목록을 불러오지 못했습니다.";
                }
            } finally {
                state.isLoadingExperts = false;
            }
        };

        const panel = subPanel({
            panel: shareChatSheet,
            onOpen: () => {
                if (shareChatSearch) shareChatSearch.value = "";
                void fetchAndShowExperts();
            },
        });

        // 트리거: 사용자 찾기 아이콘 → 시트 열기 + 초기 fetch
        userLinkButton.addEventListener("click", panel.open);

        // 닫기: data-estimation-share-close 속성 가진 모든 버튼
        shareChatCloseButtons.forEach((btn) => {
            btn.addEventListener("click", panel.close);
        });

        // 검색: 입력 중 + Enter — 새 검색은 page 1부터 다시.
        // 함수 시그니처가 옵션 객체를 받으므로 이벤트 객체를 그대로 전달하지 않게 wrap.
        shareChatSearch?.addEventListener("input", () => void fetchAndShowExperts());
        shareChatSearch?.addEventListener("change", () => void fetchAndShowExperts());

        // 무한 스크롤: 리스트 하단 근접 시 다음 페이지 append.
        shareChatUserList?.addEventListener("scroll", () => {
            const el = shareChatUserList;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
                void fetchAndShowExperts({ append: true });
            }
        });

        // 카드 클릭 → 정적 요소(#composerLinkedProfile) 갱신 + 시트 닫기
        shareChatUserList?.addEventListener("click", (event) => {
            const button = event.target.closest(".share-sheet__user");
            if (!button) return;

            // 다른 회원으로 바뀌면 이전에 고른 상품도 무효화 — 그 회원의 상품이 아닐 수 있다.
            const newMemberId = button.dataset.shareUserId || "";
            if (newMemberId !== state.selectedMemberId) {
                state.selectedProductId = "";
                state.productItems = [];
                if (selectedProductPreview) selectedProductPreview.hidden = true;
            }
            state.selectedMemberId = newMemberId;
            state.selectedReceiverEmail = button.dataset.shareUserEmail || "";
            if (linkedProfile) {
                linkedProfile.hidden = false;
                linkedProfile.setAttribute("aria-hidden", "false");
            }
            if (linkedProfileAvatar) {
                linkedProfileAvatar.src = button.dataset.shareUserAvatar || "";
                linkedProfileAvatar.alt = button.dataset.shareUserName || "";
            }
            if (linkedProfileEmail) {
                linkedProfileEmail.textContent = state.selectedReceiverEmail || "unknown";
            }
            panel.close();
        });
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 11. setupLocation — Google Maps + 위치 검색          ║
    // ╚══════════════════════════════════════════════════╝
    const setupLocation = () => {
        if (!locationDisplayButton || !locationView) return;

        // Google Maps 스크립트를 한 번만 로드한다.
        // API key: body 또는 fragment wrapper의 data-google-maps-api-key.
        const loadGoogleMaps = () => {
            if (window.google?.maps) return Promise.resolve(window.google.maps);
            if (state.mapsLoaderPromise) return state.mapsLoaderPromise;

            const apiKey = (
                document.body.dataset.googleMapsApiKey ||
                document.querySelector("[data-google-maps-api-key]")?.dataset.googleMapsApiKey ||
                ""
            ).trim();
            if (!apiKey) return Promise.reject(new Error("Google Maps API key is missing."));

            state.mapsLoaderPromise = new Promise((resolve, reject) => {
                const callbackName = "__initEstimationLocationMap";
                window[callbackName] = () => {
                    delete window[callbackName];
                    resolve(window.google.maps);
                };
                const script = document.createElement("script");
                script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&callback=${callbackName}`;
                script.async = true;
                script.defer = true;
                script.onerror = () => {
                    delete window[callbackName];
                    reject(new Error("Failed to load Google Maps script."));
                };
                document.head.appendChild(script);
            });
            return state.mapsLoaderPromise;
        };

        // pendingLocation 갱신 + 안내 메시지/완료 버튼 동기화.
        const updatePending = (text) => {
            state.pendingLocation = safeText(text);
            if (locationGuide) {
                locationGuide.textContent = state.pendingLocation
                    ? `선택된 위치: ${state.pendingLocation}`
                    : "지도를 클릭하거나 주소를 검색해서 위치를 선택하세요.";
            }
            if (locationCompleteButton) {
                locationCompleteButton.disabled = !state.pendingLocation;
            }
        };

        // Maps 인스턴스 + 마커 + Geocoder 최초 1회 생성.
        const ensureMap = async () => {
            const maps = await loadGoogleMaps();
            if (!locationMapElement) return;

            if (!state.mapInstance) {
                state.mapInstance = new maps.Map(locationMapElement, {
                    center: { lat: 37.5665, lng: 126.9780 },
                    zoom: 14,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });
                state.geocoder = new maps.Geocoder();
                state.mapMarker = new maps.Marker({ map: state.mapInstance });

                state.mapInstance.addListener("click", (event) => {
                    const latLng = event.latLng;
                    if (!latLng) return;
                    state.mapMarker.setPosition(latLng);
                    state.geocoder.geocode({ location: latLng }, (results, status) => {
                        if (status === "OK" && results?.length) {
                            updatePending(results[0].formatted_address);
                        } else {
                            updatePending(`${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`);
                        }
                    });
                });
            }

            // 패널이 열린 직후 지도가 0px일 수 있어 resize + 마커 위치로 center 보정.
            window.setTimeout(() => {
                maps.event.trigger(state.mapInstance, "resize");
                state.mapInstance.setCenter(
                    state.mapMarker?.getPosition() || { lat: 37.5665, lng: 126.9780 }
                );
            }, 0);
        };

        // 주소 검색 → 지도 이동 + 마커 + pendingLocation 갱신.
        const searchByKeyword = async () => {
            const keyword = safeText(locationSearchInput?.value);
            if (!keyword) {
                updatePending("");
                return;
            }
            await ensureMap();
            if (!state.geocoder || !state.mapMarker || !state.mapInstance) return;

            state.geocoder.geocode({ address: keyword }, (results, status) => {
                if (status !== "OK" || !results?.length) {
                    updatePending("");
                    if (locationGuide) {
                        locationGuide.textContent = "검색 결과를 찾지 못했습니다. 다른 주소로 시도해 주세요.";
                    }
                    return;
                }
                const result = results[0];
                state.mapInstance.setCenter(result.geometry.location);
                state.mapInstance.setZoom(15);
                state.mapMarker.setPosition(result.geometry.location);
                updatePending(result.formatted_address);
            });
        };

        const panel = subPanel({
            panel: locationView,
            mode: "view-swap",
            onOpen: async () => {
                state.pendingLocation = state.selectedLocation;
                syncLocationUI();
                try {
                    await ensureMap();
                } catch (error) {
                    console.error(error);
                    alert("Google Maps 설정이 없어 위치 기능을 바로 열 수 없습니다.");
                    panel.close();
                }
            },
            onClose: () => {
                state.pendingLocation = state.selectedLocation;
                if (locationSearchInput) locationSearchInput.value = "";
                syncLocationUI();
            },
        });

        // 위치 표시 버튼 → 패널 열기
        locationDisplayButton.addEventListener("click", panel.open);
        locationCloseButton?.addEventListener("click", panel.close);

        // 삭제 → selectedLocation/pendingLocation 모두 초기화
        locationDeleteButton?.addEventListener("click", () => {
            state.selectedLocation = "";
            state.pendingLocation = "";
            if (locationSearchInput) locationSearchInput.value = "";
            if (locationGuide) {
                locationGuide.textContent = "지도를 클릭하거나 주소를 검색해서 위치를 선택하세요.";
            }
            syncLocationUI();
            syncSubmitState();
        });

        // 적용 → pendingLocation을 selectedLocation으로 commit + 패널 닫기
        locationCompleteButton?.addEventListener("click", () => {
            state.selectedLocation = state.pendingLocation;
            syncLocationUI();
            panel.close();
        });

        // 검색 버튼 / Enter
        locationSearchButton?.addEventListener("click", () => void searchByKeyword());
        locationSearchInput?.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            void searchByKeyword();
        });
    };

    // ╔══════════════════════════════════════════════════╗
    // ║ 12. 초기화                                         ║
    // ╚══════════════════════════════════════════════════╝
    setupModal();
    setupForm();
    setupCategory();
    setupTagInput();
    setupProductSelect();
    setupExpertShare();
    setupLocation();

    // 초기 상태 동기화
    syncSubmitState();
    syncLocationUI();
    syncTagDock();
    syncTagEditor();
    renderSelectedProduct();
    syncProductSelection();

    // 독립 페이지(/estimation/regist) 진입 시 모달 자동 오픈.
    // 마이페이지 fragment에서는 트리거 클릭 시에만 열린다.
    if (window.location.pathname.startsWith("/estimation/regist")) {
        window.setTimeout(() => createPostButton?.click(), 0);
    }
});
