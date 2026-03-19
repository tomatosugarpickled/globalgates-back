// 페이지의 상호작용을 DOM 로드 이후에만 초기화한다.
window.addEventListener("load", () => {
    // 단일 요소 조회를 짧게 쓰기 위한 헬퍼다.
    const q = (selector, scope = document) => scope.querySelector(selector);
    // 복수 요소 조회 결과를 배열로 받기 위한 헬퍼다.
    const qAll = (selector, scope = document) =>
        Array.from(scope.querySelectorAll(selector));

    // 상단 탭 버튼들을 모은다.
    const tabButtons = qAll("[data-inquiry-tab]");
    // 탭과 연결된 패널들을 모은다.
    const panels = qAll("[data-inquiry-panel]");
    // 필터 드롭다운 트리거를 찾는다.
    const filterTrigger = q("[data-activity-filter-trigger]");
    // 필터 메뉴 본문을 찾는다.
    const filterMenu = q("[data-activity-filter-menu]");
    // 현재 선택된 필터 라벨 영역을 찾는다.
    const filterLabel = q("[data-activity-filter-label]");
    // 필터 메뉴 안의 모든 옵션을 모은다.
    const filterItems = qAll("[data-activity-filter-item]");
    // 빠른 기간 버튼들을 모은다.
    const periodChips = qAll("[data-period-chip]");
    // 목록 카드들을 모은다.
    const cards = qAll("[data-estimation-card]");
    // 시작 날짜 입력을 찾는다.
    const startInput = q("[data-activity-date-start]");
    // 종료 날짜 입력을 찾는다.
    const endInput = q("[data-activity-date-end]");
    // 상세 모달 루트를 찾는다.
    const detailModal = q("[data-estimation-detail-modal]");
    // 상세 모달 안의 각 패널을 모은다.
    const detailPanels = qAll("[data-estimation-detail-panel]");
    // 상세 모달 닫기 역할을 하는 요소들을 모은다.
    const detailCloseButtons = qAll("[data-estimation-detail-close]");
    // 승인/거절 버튼들을 모은다.
    const decisionButtons = qAll("[data-estimation-decision]");
    // 목록 카드 더보기 버튼들을 모은다.
    const moreTriggers = qAll("[data-estimation-more-trigger]");
    // 승인 확인 모달 관련 요소다.
    const confirmModal = q("[data-estimation-confirm-modal]");
    const confirmCloseButtons = qAll("[data-estimation-confirm-close]");
    const confirmSubmitButton = q("[data-estimation-confirm-submit]");
    const confirmTitle = q("[data-estimation-confirm-title]");
    // 탭 프리뷰 애니메이션 지속 시간이다.
    const PREVIEW_DURATION_MS = 280;
    // 기간칩별 일 수 매핑이다.
    const PERIOD_DAYS = {"7D": 7, "2W": 14, "4W": 28, "3M": 90};
    // 모달을 연 마지막 버튼을 기억한다.
    let activeDetailTrigger = null;
    // 확인 대기 중인 버튼 영역이다.
    let pendingDecision = null;

    // 선택된 탭만 활성 상태로 만든다.
    const setActiveTab = (name) => {
        // 모든 탭을 순회한다.
        tabButtons.forEach((tab) => {
            // 현재 탭이 활성 탭인지 계산한다.
            const isActive = tab.dataset.inquiryTab === name;
            // 활성 클래스를 상태에 맞게 토글한다.
            tab.classList.toggle("inquiry-tab--active", isActive);
            // 접근성 선택 상태도 같이 반영한다.
            tab.setAttribute("aria-selected", String(isActive));
        });

        // 모든 패널을 순회한다.
        panels.forEach((panel) => {
            // 선택된 이름과 다르면 숨긴다.
            panel.hidden = panel.dataset.inquiryPanel !== name;
        });
    };

    // 탭 클릭 시 짧은 프리뷰 애니메이션을 준다.
    const previewTab = (tab) => {
        // 이전 프리뷰 클래스를 제거한다.
        tab.classList.remove("inquiry-tab--preview");
        // 리플로우를 강제로 일으켜 애니메이션을 다시 시작한다.
        void tab.offsetWidth;
        // 프리뷰 클래스를 다시 붙인다.
        tab.classList.add("inquiry-tab--preview");
        // 일정 시간이 지나면 프리뷰 클래스를 제거한다.
        window.setTimeout(() => {
            // 프리뷰 상태를 원복한다.
            tab.classList.remove("inquiry-tab--preview");
        }, PREVIEW_DURATION_MS);
    };

    // 필터 메뉴를 닫는다.
    const closeFilterMenu = () => {
        // 트리거 또는 메뉴가 없으면 종료한다.
        if (!filterTrigger || !filterMenu) {
            // 더 이상 할 일이 없다.
            return;
        }

        // 메뉴를 숨긴다.
        filterMenu.hidden = true;
        // 트리거의 펼침 상태를 닫힘으로 돌린다.
        filterTrigger.setAttribute("aria-expanded", "false");
    };

    // 더보기 버튼 옆에 붙은 메뉴를 읽는다.
    const getMoreMenu = (button) => {
        // 버튼 다음 형제 요소를 메뉴 후보로 잡는다.
        const menu = button.nextElementSibling;
        // 메뉴가 HTMLElement면 그대로 반환한다.
        if (menu instanceof HTMLElement) {
            // 찾은 메뉴를 돌려준다.
            return menu;
        }

        // 메뉴가 없으면 null을 반환한다.
        return null;
    };

    // 목록 카드 더보기 메뉴를 모두 닫는다.
    const closeMoreMenus = () => {
        // 모든 더보기 버튼을 순회한다.
        moreTriggers.forEach((button) => {
            // 버튼을 감싼 더보기 래퍼를 찾는다.
            const wrapper = button.closest(".estimation-more");
            // 버튼 펼침 상태를 닫힘으로 돌린다.
            button.setAttribute("aria-expanded", "false");
            // 래퍼가 있으면 열린 클래스를 제거한다.
            if (wrapper instanceof HTMLElement) {
                wrapper.classList.remove("is-open");
            }
        });
    };

    // 선택된 상태에 따라 카드를 필터링한다.
    const applyFilter = (value) => {
        // 모든 카드를 순회한다.
        cards.forEach((card) => {
            // 전체가 아니면 상태가 같은 카드만 보이게 한다.
            card.hidden = value !== "all" && card.dataset.filterState !== value;
        });
    };

    // 필터 옵션 선택을 반영한다.
    const setFilter = (item) => {
        // 선택한 옵션 값을 읽는다.
        const value = item.dataset.activityFilterItem;
        // 표시용 라벨 요소를 읽는다.
        const label = item.querySelector(".activity-filter-menu__label");

        // 모든 옵션을 순회한다.
        filterItems.forEach((button) => {
            // 현재 옵션이 선택된 옵션인지 계산한다.
            const isSelected = button === item;
            // 선택 클래스를 상태에 맞게 토글한다.
            button.classList.toggle(
                "activity-filter-menu__item--selected",
                isSelected,
            );
            // 접근성 선택 상태도 갱신한다.
            button.setAttribute("aria-checked", String(isSelected));
        });

        // 라벨과 표시 영역이 있으면 텍스트를 바꾼다.
        if (filterLabel && label) {
            // 현재 선택된 필터 이름을 버튼에 보여 준다.
            filterLabel.textContent = label.textContent.trim();
        }

        // 실제 카드 목록에 필터를 적용한다.
        applyFilter(value);
        // 선택 후 필터 메뉴를 닫는다.
        closeFilterMenu();
    };

    // 날짜 객체를 input type=date 형식으로 변환한다.
    const formatDate = (date) => {
        // 연도를 구한다.
        const year = date.getFullYear();
        // 월을 두 자리 문자열로 만든다.
        const month = String(date.getMonth() + 1).padStart(2, "0");
        // 일을 두 자리 문자열로 만든다.
        const day = String(date.getDate()).padStart(2, "0");
        // yyyy-mm-dd 형식으로 반환한다.
        return `${year}-${month}-${day}`;
    };

    // 기간칩 선택 시 시작일을 계산한다.
    const syncPeriod = (chip) => {
        // 칩에 대응하는 일 수를 찾는다.
        const days = PERIOD_DAYS[chip.dataset.periodChip];
        // 필수 값이 없으면 종료한다.
        if (!days || !startInput || !endInput) {
            // 더 이상 진행하지 않는다.
            return;
        }

        // 종료일 기준 날짜를 만든다.
        const end = new Date(endInput.value || new Date());
        // 시작일 계산용 복사본을 만든다.
        const start = new Date(end);
        // 시작일을 기간 길이에 맞게 뒤로 민다.
        start.setDate(end.getDate() - (days - 1));
        // 계산한 값을 시작일 입력에 반영한다.
        startInput.value = formatDate(start);
    };

    // 상세 패널을 모두 숨긴다.
    const hideDetailPanels = () => {
        // 모든 상세 패널을 순회한다.
        detailPanels.forEach((panel) => {
            // 전부 숨김 처리한다.
            panel.hidden = true;
        });
    };

    // 상세 모달을 닫는다.
    const closeDetailModal = () => {
        // 모달이 없으면 종료한다.
        if (!detailModal) {
            // 더 이상 할 일이 없다.
            return;
        }

        // 모달을 숨긴다.
        detailModal.hidden = true;
        // 스크롤 잠금을 해제한다.
        document.body.classList.remove("modal-open");
        // 내부 패널도 같이 숨긴다.
        hideDetailPanels();
        // 마지막 트리거가 있으면 포커스를 돌려준다.
        activeDetailTrigger?.focus();
        // 저장한 트리거를 비운다.
        activeDetailTrigger = null;
    };

    // 승인 확인 모달을 닫는다.
    const closeConfirmModal = () => {
        if (!confirmModal) return;
        confirmModal.hidden = true;
        pendingDecision = null;
    };

    // 승인 확인 모달을 연다.
    const openConfirmModal = (slot, type) => {
        if (!confirmModal || !(slot instanceof HTMLElement) || !type) return;
        pendingDecision = {slot, type};
        if (confirmTitle) {
            confirmTitle.textContent =
                type === "approve"
                    ? "정말 승인하시겠습니까?"
                    : "거절하시겠습니까?";
        }
        confirmSubmitButton?.classList.toggle("is-reject", type === "reject");
        confirmModal.hidden = false;
    };

    // 버튼 자리를 결과 상태로 바꾼다.
    const applyDecisionState = (slot, type) => {
        q("[data-estimation-decision-group]", slot)?.setAttribute("hidden", "");
        q("[data-estimation-approved-state]", slot)?.setAttribute("hidden", "");
        q("[data-estimation-rejected-state]", slot)?.setAttribute("hidden", "");

        if (type === "approve") {
            q("[data-estimation-approved-state]", slot)?.removeAttribute("hidden");
            return;
        }

        q("[data-estimation-rejected-state]", slot)?.removeAttribute("hidden");
    };

    // 같은 견적 요청의 승인/거절 버튼 상태를 동기화한다.
    const syncDecisionButtons = (decisionId, selectedDecision) => {
        // 같은 요청을 가리키는 버튼만 순회한다.
        decisionButtons
            .filter(
                (button) => button.dataset.estimationDecisionId === decisionId,
            )
            .forEach((button) => {
                // 현재 버튼이 선택된 종류인지 계산한다.
                const isActive =
                    button.dataset.estimationDecision === selectedDecision;
                // 활성 클래스를 상태에 맞게 반영한다.
                button.classList.toggle("is-active", isActive);
                // 접근성 상태도 같이 갱신한다.
                button.setAttribute("aria-pressed", String(isActive));
            });
    };

    // 요청 상세 모달을 연다.
    const openDetailModal = (target, trigger) => {
        // 상세 대상이 없거나 모달이 없으면 종료한다.
        if (!target || !detailModal) {
            // 더 이상 진행하지 않는다.
            return;
        }

        // 모든 패널을 먼저 숨긴다.
        hideDetailPanels();
        // 대상 ID와 같은 패널을 찾는다.
        const panel = q(`[data-estimation-detail-panel="${target}"]`);
        // 대상 패널이 없으면 종료한다.
        if (!panel) {
            // 더 이상 진행하지 않는다.
            return;
        }

        // 마지막 트리거를 저장한다.
        activeDetailTrigger = trigger;
        // 대상 패널만 보이게 한다.
        panel.hidden = false;
        // 모달을 노출한다.
        detailModal.hidden = false;
        // 배경 스크롤을 잠근다.
        document.body.classList.add("modal-open");
    };

    // 상세 버튼에서 대상 ID를 읽어 모달을 연다.
    const handleDetailTrigger = (button) => {
        // 버튼에 연결된 상세 ID를 읽는다.
        const target =
            button.dataset.estimationDetailTarget ||
            button.closest("[data-estimation-card]")?.dataset
                .estimationDetailTarget;
        // 대상 ID를 기준으로 모달을 연다.
        openDetailModal(target, button);
    };

    // 탭 버튼마다 클릭 이벤트를 붙인다.
    tabButtons.forEach((tab) => {
        // 탭 클릭 시 동작을 등록한다.
        tab.addEventListener("click", () => {
            // 클릭 프리뷰 애니메이션을 실행한다.
            previewTab(tab);
            // 해당 이름의 패널을 활성화한다.
            setActiveTab(tab.dataset.inquiryTab || "quotes");
        });
    });

    // 필터 트리거가 있으면 클릭 이벤트를 붙인다.
    filterTrigger?.addEventListener("click", () => {
        // 현재 메뉴가 열린 상태인지 확인한다.
        const isExpanded =
            filterTrigger.getAttribute("aria-expanded") === "true";
        // 다음 상태를 트리거에 반영한다.
        filterTrigger.setAttribute("aria-expanded", String(!isExpanded));
        // 메뉴가 있으면 hidden 상태를 토글한다.
        if (filterMenu) {
            // 현재 상태의 반대로 노출한다.
            filterMenu.hidden = isExpanded;
        }
    });

    // 각 필터 옵션에 클릭 이벤트를 붙인다.
    filterItems.forEach((item) => {
        // 옵션 클릭 시 필터를 적용한다.
        item.addEventListener("click", () => {
            // 현재 옵션을 선택 상태로 반영한다.
            setFilter(item);
        });
    });

    // 각 기간칩에 클릭 이벤트를 붙인다.
    periodChips.forEach((chip) => {
        // 칩 클릭 시 동작을 등록한다.
        chip.addEventListener("click", () => {
            // 모든 칩을 순회한다.
            periodChips.forEach((button) => {
                // 현재 칩만 활성 클래스를 갖게 한다.
                button.classList.toggle("period-chip--active", button === chip);
            });
            // 선택된 기간에 맞게 시작일을 갱신한다.
            syncPeriod(chip);
        });
    });

    // 상세 열기 버튼들에 클릭 이벤트를 붙인다.
    qAll(
        ".estimation-preview-card__body[data-estimation-detail-target]",
    ).forEach((button) => {
        // 버튼 클릭 시 동작을 등록한다.
        button.addEventListener("click", () => {
            // 현재 버튼 기준으로 상세 모달을 연다.
            handleDetailTrigger(button);
        });
    });

    // 닫기 역할 요소들에 클릭 이벤트를 붙인다.
    detailCloseButtons.forEach((button) => {
        // 클릭 시 상세 모달을 닫는다.
        button.addEventListener("click", closeDetailModal);
    });

    // 취소나 배경 클릭이면 확인 모달을 닫는다.
    confirmCloseButtons.forEach((button) => {
        button.addEventListener("click", closeConfirmModal);
    });

    // 확인을 누르면 같은 자리만 결과 상태로 바꾼다.
    confirmSubmitButton?.addEventListener("click", () => {
        if (!pendingDecision) return;
        applyDecisionState(pendingDecision.slot, pendingDecision.type);
        closeConfirmModal();
    });

    // 더보기 버튼들에 클릭 이벤트를 붙인다.
    moreTriggers.forEach((button) => {
        // 버튼을 감싼 더보기 래퍼를 찾는다.
        const wrapper = button.closest(".estimation-more");
        // 버튼에 연결된 메뉴를 미리 찾는다.
        const menu = getMoreMenu(button);
        // 래퍼나 메뉴가 없으면 이 버튼은 건너뛴다.
        if (!(wrapper instanceof HTMLElement) || !menu) {
            // 더 이상 할 일이 없다.
            return;
        }

        // 메뉴 자체 클릭은 카드 클릭으로 번지지 않게 막는다.
        menu.addEventListener("click", (event) => {
            // 더보기 영역 바깥으로 이벤트가 퍼지지 않게 한다.
            event.stopPropagation();
        });

        // 버튼 클릭 시 동작을 등록한다.
        button.addEventListener("click", (event) => {
            // 카드 상세 열기와 충돌하지 않게 전파를 막는다.
            event.stopPropagation();
            // 현재 열린 상태를 읽는다.
            const isExpanded = wrapper.classList.contains("is-open");
            // 다른 메뉴를 먼저 닫는다.
            closeMoreMenus();
            // 기존에 닫혀 있었다면 현재 메뉴만 연다.
            if (!isExpanded) {
                wrapper.classList.add("is-open");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });

    // 승인/거절 버튼 동작이다.
    decisionButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();

            // 승인과 거절은 모두 확인 모달을 거친다.
            if (
                button.dataset.estimationDecision === "approve" ||
                button.dataset.estimationDecision === "reject"
            ) {
                openConfirmModal(
                    button.closest(".estimation-action-slot"),
                    button.dataset.estimationDecision,
                );
                return;
            }
        });
    });

    // 문서 전체 클릭을 감시한다.
    document.addEventListener("click", (event) => {
        // 이벤트 타깃을 읽는다.
        const target = event.target;
        // Element가 아니면 종료한다.
        if (!(target instanceof Element)) {
            // 더 이상 진행하지 않는다.
            return;
        }

        // 필터 메뉴가 열려 있고 바깥 클릭이면 메뉴를 닫는다.
        if (
            filterMenu &&
            !filterMenu.hidden &&
            !target.closest("[data-activity-filter-menu]") &&
            !target.closest("[data-activity-filter-trigger]")
        ) {
            // 필터 메뉴를 닫는다.
            closeFilterMenu();
        }

        // 더보기 메뉴 바깥 클릭이면 메뉴를 닫는다.
        if (
            !target.closest("[data-estimation-more-trigger]") &&
            !target.closest(".estimation-dropdown-menu")
        ) {
            // 모든 더보기 메뉴를 닫는다.
            closeMoreMenus();
        }

        // 삭제 메뉴 클릭이면 목록 카드와 상세 패널을 함께 제거한다.
        const deleteAction = target.closest("[data-estimation-delete]");
        if (deleteAction instanceof HTMLElement) {
            // 삭제 대상 ID를 읽는다.
            const targetId = deleteAction.dataset.estimationDelete || "";
            // 연결된 카드와 상세 패널을 찾는다.
            const card = q(
                `[data-estimation-card][data-estimation-detail-target="${targetId}"]`,
            );
            const panel = q(`[data-estimation-detail-panel="${targetId}"]`);

            // 상세 모달이 현재 대상이면 먼저 닫는다.
            if (detailModal && !detailModal.hidden) {
                const activePanel = q(
                    `[data-estimation-detail-panel="${targetId}"]:not([hidden])`,
                );
                if (activePanel) {
                    closeDetailModal();
                }
            }

            // 카드와 패널을 DOM에서 제거한다.
            card?.remove();
            panel?.remove();
            // 메뉴도 닫는다.
            closeMoreMenus();
        }
    });

    // 키보드 ESC 입력을 감시한다.
    document.addEventListener("keydown", (event) => {
        // ESC가 아니면 종료한다.
        if (event.key !== "Escape") {
            // 더 이상 진행하지 않는다.
            return;
        }

        // 필터 메뉴가 열려 있으면 먼저 닫는다.
        if (filterMenu && !filterMenu.hidden) {
            // 필터 메뉴를 닫는다.
            closeFilterMenu();
        }

        // 상세 모달이 열려 있으면 닫는다.
        if (detailModal && !detailModal.hidden) {
            // 상세 모달을 닫는다.
            closeDetailModal();
        }

        // 승인 확인 모달이 열려 있으면 닫는다.
        if (confirmModal && !confirmModal.hidden) {
            // 승인 확인 모달을 닫는다.
            closeConfirmModal();
        }

        // 더보기 메뉴가 열려 있으면 닫는다.
        closeMoreMenus();
    });

    // 초기 로드시 quotes 탭을 보이게 한다.
    setActiveTab("quotes");
    // 초기 로드시 전체 필터를 적용한다.
    applyFilter("all");
});
