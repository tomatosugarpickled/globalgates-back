window.addEventListener("DOMContentLoaded", setupPostDetailPage);

// 게시물 상세 화면의 액션 바 초기화만 연결한다.
function setupPostDetailPage() {
    setupInlineReplyComposer();
    setupPostDetailActions();
    setupCardReplyModal();
}

// 메인 게시글 모달의 답글 작성 기능 중 상세 화면에 필요한 것만 가볍게 다시 묶는다.
function setupInlineReplyComposer() {
    const composer = document.querySelector(".post-detail-inline-reply");
    if (!composer) {
        return;
    }

    const q = (selector) => composer.querySelector(selector);
    const qAll = (selector) => Array.from(composer.querySelectorAll(selector));
    const editor = q("[data-testid='tweetTextarea_0']");
    const footerBottom = composer.querySelector(".tweet-modal__footer-bottom");
    const context = q(".post-detail-inline-reply-context");
    const emojiButton = q("[data-testid='emojiButton']");
    let emojiLibraryPicker = null;
    const mediaUploadButton = q("[data-testid='mediaUploadButton']");
    const fileInput = q("[data-testid='fileInput']");
    const attachmentPreview = q("[data-attachment-preview]");
    const attachmentMedia = q("[data-attachment-media]");
    const attachmentMetaButtons = qAll(".tweet-modal__attachment-meta-btn");
    const geoButton = q("[data-testid='geoButton']");
    const geoButtonPath = geoButton?.querySelector("path");
    const locationView = q(".tweet-modal__location-view");
    const locationCloseButton = q("[data-testid='location-back']");
    const locationSearchInput = q("[data-location-search]");
    const locationList = q("[data-location-list]");
    const locationItems = qAll(".tweet-modal__location-item");
    const locationDisplay = q("[data-location-display]");
    const locationName = q("[data-location-name]");
    const locationDeleteButton = q("[data-location-delete]");
    const locationCompleteButton = q("[data-location-complete]");
    const submitButton = q("[data-testid='tweetButton']");
    const gauge = q("#replyGauge");
    const gaugeText = q("#replyGaugeText");
    const productButton = q("[data-testid='productSelectButton']");
    const productView = q("[data-product-select-modal]");
    const productSelectClose = productView?.querySelector("[data-product-select-close]");
    const productSelectList = productView?.querySelector("[data-product-select-list]");
    const productSelectComplete = productView?.querySelector("[data-product-select-complete]");
    const selectedProductCard = q("[data-selected-product]");
    const userTagTrigger = q("[data-user-tag-trigger]");
    const userTagLabel = q("[data-user-tag-label]");
    const tagView = q("[data-tag-modal]");
    const tagCloseButton = tagView?.querySelector("[data-tag-back]");
    const tagCompleteButton = tagView?.querySelector("[data-tag-complete]");
    const tagSearchForm = tagView?.querySelector("[data-tag-search-form]");
    const tagSearchInput = tagView?.querySelector("[data-tag-search]");
    const tagChipList = tagView?.querySelector("[data-tag-chip-list]");
    const tagResults = tagView?.querySelector("[data-tag-results]");
    const mediaAltTrigger = q("[data-media-alt-trigger]");
    const mediaAltLabel = q("[data-media-alt-label]");
    const mediaView = q("[data-media-alt-modal]");
    const mediaBackButton = mediaView?.querySelector("[data-media-back]");
    const mediaPrevButton = mediaView?.querySelector("[data-media-prev]");
    const mediaNextButton = mediaView?.querySelector("[data-media-next]");
    const mediaSaveButton = mediaView?.querySelector("[data-media-save]");
    const mediaPreviewImage = mediaView?.querySelector("[data-media-preview-image]");
    const mediaAltInput = mediaView?.querySelector("[data-media-alt-input]");
    const mediaAltCount = mediaView?.querySelector("[data-media-alt-count]");
    const maxMediaAltLength = 1000;
    const maxLength = 500;
    const maxAttachments = 4;
    let selectedLocation = null;
    let pendingLocation = null;
    let selectedProduct = null;
    let selectedTaggedUsers = [], pendingTaggedUsers = [];
    let mediaEdits = [], pendingMediaEdits = [], activeMediaIndex = 0;
    let currentTagResults = [];
    let pendingAttachmentEditIndex = null;
    let attachedFiles = [];
    let attachmentPreviewUrls = [];
    let savedSelection = null;
    const formatButtons = qAll("[data-format]");

    function getEditorLength() {
        return editor?.textContent?.replace(/\u00a0/g, " ").trim().length ?? 0;
    }

    function resetEditorIfEmpty() {
        if (!editor || getEditorLength() > 0) {
            return;
        }
        editor.innerHTML = "";
    }

    function syncFormatButtons() {
        formatButtons.forEach((btn) => {
            const fmt = btn.getAttribute("data-format");
            if (fmt) btn.classList.toggle("tweet-modal__tool-btn--active", document.queryCommandState(fmt));
        });
    }

    function applyFormat(format) {
        if (!editor) return;
        editor.focus();
        restoreEditorSelection();
        document.execCommand(format, false);
        saveEditorSelection();
        syncFormatButtons();
    }

    // 입력 상태, 첨부 상태, 글자 수를 한 번에 맞춰 submit 활성화와 게이지를 갱신한다.
    function syncInlineReplySubmitState() {
        const currentLength = getEditorLength();
        const remaining = maxLength - currentLength;
        const canSubmit =
            remaining >= 0 && (currentLength > 0 || attachedFiles.length > 0);

        if (gauge) {
            gauge.setAttribute(
                "aria-valuenow",
                String(Math.max(0, currentLength)),
            );
            gauge.style.setProperty(
                "--gauge-progress",
                `${Math.max(0, Math.min(360, (currentLength / maxLength) * 360))}deg`,
            );
        }
        if (gaugeText) {
            gaugeText.textContent = String(remaining);
            gaugeText.style.color = remaining < 0 ? "#f4212e" : "#536471";
        }
        if (submitButton) {
            submitButton.disabled = !canSubmit;
            submitButton.setAttribute("aria-disabled", String(!canSubmit));
        }
    }

    function hasDraftContent() {
        return (
            getEditorLength() > 0 ||
            attachedFiles.length > 0 ||
            Boolean(selectedLocation)
        );
    }

    function setExpanded() {
        composer.classList.toggle("has-draft", hasDraftContent());
        if (footerBottom) {
            footerBottom.hidden = false;
        }
        if (context) {
            context.hidden = false;
        }
    }

    function syncExpandedState() {
        setExpanded();
    }

    function saveEditorSelection() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !editor) {
            return;
        }
        const range = selection.getRangeAt(0);
        if (editor.contains(range.commonAncestorContainer)) {
            savedSelection = range.cloneRange();
        }
    }

    function restoreEditorSelection() {
        if (!savedSelection) {
            return false;
        }
        const selection = window.getSelection();
        if (!selection) {
            return false;
        }
        selection.removeAllRanges();
        selection.addRange(savedSelection);
        return true;
    }

    function placeCaretAtEnd() {
        if (!editor) {
            return;
        }
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        saveEditorSelection();
    }

    function insertNodeAtSelection(node) {
        if (!editor) {
            return;
        }
        const selection = window.getSelection();
        if (!selection?.rangeCount) {
            placeCaretAtEnd();
        }
        const range = window.getSelection()?.rangeCount
            ? window.getSelection().getRangeAt(0)
            : null;
        if (!range || !editor.contains(range.commonAncestorContainer)) {
            return;
        }

        range.deleteContents();
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
        saveEditorSelection();
    }

    function insertEmoji(emoji) {
        if (!editor) return;
        editor.focus();
        if (!restoreEditorSelection()) placeCaretAtEnd();
        insertNodeAtSelection(document.createTextNode(emoji));
        saveEditorSelection();
        syncInlineReplySubmitState();
    }

    function getOrCreateEmojiPicker() {
        if (!emojiButton || !editor || typeof window.EmojiButton !== "function") return null;
        if (emojiLibraryPicker) return emojiLibraryPicker;
        emojiLibraryPicker = new window.EmojiButton({position: "bottom-start", zIndex: 9999});
        emojiLibraryPicker.on("emoji", (sel) => {
            const emoji = typeof sel === "string" ? sel : sel?.emoji;
            if (emoji) insertEmoji(emoji);
        });
        emojiLibraryPicker.on("hidden", () => {
            emojiButton?.setAttribute("aria-expanded", "false");
        });
        return emojiLibraryPicker;
    }

    function hideEmojiPicker() {
        if (emojiLibraryPicker?.pickerVisible) emojiLibraryPicker.hidePicker();
        emojiButton?.setAttribute("aria-expanded", "false");
    }

    function openProductPanel() {
        if (!productView) return;
        hideEmojiPicker();
        toggleLocationPanel(false);
        productView.hidden = false;
    }

    function closeProductPanel() {
        if (!productView) return;
        productView.hidden = true;
    }

    function syncSelectedProductCard() {
        if (!selectedProductCard) return;
        if (!selectedProduct) {
            selectedProductCard.hidden = true;
            return;
        }
        selectedProductCard.querySelector("[data-selected-product-image]").src = selectedProduct.image;
        selectedProductCard.querySelector("[data-selected-product-image]").alt = selectedProduct.name;
        selectedProductCard.querySelector("[data-selected-product-name]").textContent = selectedProduct.name;
        selectedProductCard.querySelector("[data-selected-product-price]").textContent = selectedProduct.price;
        selectedProductCard.hidden = false;
    }

    function isImageSet() {
        return attachedFiles.some((f) => f.type.startsWith("image/"));
    }

    function getPageUsers() {
        const seen = new Set();
        return Array.from(document.querySelectorAll("[data-post-card]")).map((card, i) => {
            const name = card.querySelector(".postName")?.textContent?.trim();
            const handle = card.querySelector(".postHandle")?.textContent?.trim();
            if (!name || !handle || seen.has(handle)) return null;
            seen.add(handle);
            return {id: `${handle.replace("@", "")}-${i}`, name, handle, avatar: ""};
        }).filter(Boolean);
    }

    function syncUserTagTrigger() {
        const can = isImageSet();
        if (userTagTrigger) {
            userTagTrigger.hidden = !can;
            userTagTrigger.disabled = !can;
        }
        if (userTagLabel) userTagLabel.textContent = selectedTaggedUsers.length === 0 ? "사용자 태그하기" : selectedTaggedUsers.map((u) => u.name).join(", ");
        if (!can && tagView && !tagView.hidden) closeTagPanel();
    }

    function renderTagChipList() {
        if (!tagChipList) return;
        tagChipList.innerHTML = pendingTaggedUsers.map((u) =>
            `<button type="button" class="tweet-modal__tag-chip" data-tag-remove-id="${escapeAttachmentText(u.id)}">` +
            `<span class="tweet-modal__tag-chip-avatar">${u.avatar ? `<img src="${escapeAttachmentText(u.avatar)}" alt="">` : ""}</span>` +
            `<span class="tweet-modal__tag-chip-name">${escapeAttachmentText(u.name)}</span>` +
            `<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__tag-chip-icon"><g><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg>` +
            `</button>`
        ).join("");
    }

    function renderTagResults(users) {
        if (!tagResults) return;
        currentTagResults = users;
        if (!tagSearchInput?.value.trim()) {
            tagResults.innerHTML = "";
            return;
        }
        if (users.length === 0) {
            tagResults.innerHTML = '<p class="tweet-modal__tag-empty">일치하는 사용자를 찾지 못했습니다.</p>';
            return;
        }
        tagResults.innerHTML = users.map((u) => {
            const sel = pendingTaggedUsers.some((t) => t.id === u.id);
            return `<div role="option" class="tweet-modal__tag-option">` +
                `<div role="checkbox" aria-checked="${sel}" aria-disabled="${sel}" class="tweet-modal__tag-checkbox">` +
                `<button type="button" class="tweet-modal__tag-user" data-tag-user-id="${escapeAttachmentText(u.id)}" ${sel ? "disabled" : ""}>` +
                `<span class="tweet-modal__tag-avatar"></span>` +
                `<span class="tweet-modal__tag-user-body">` +
                `<span class="tweet-modal__tag-user-name">${escapeAttachmentText(u.name)}</span>` +
                `<span class="tweet-modal__tag-user-handle">${escapeAttachmentText(u.handle)}${sel ? " 이미 태그됨" : ""}</span>` +
                `</span></button></div></div>`;
        }).join("");
    }

    function runTagSearch() {
        const term = tagSearchInput?.value.trim().toLowerCase() ?? "";
        renderTagResults(term ? getPageUsers().filter((u) => `${u.name} ${u.handle}`.toLowerCase().includes(term)).slice(0, 6) : []);
    }

    function openTagPanel() {
        if (!tagView) return;
        hideEmojiPicker();
        toggleLocationPanel(false);
        closeProductPanel();
        closeMediaEditor({discardChanges: true});
        pendingTaggedUsers = selectedTaggedUsers.map((u) => ({...u}));
        if (tagSearchInput) tagSearchInput.value = "";
        renderTagChipList();
        renderTagResults([]);
        tagView.hidden = false;
        window.requestAnimationFrame(() => tagSearchInput?.focus());
    }

    function closeTagPanel() {
        if (!tagView) return;
        tagView.hidden = true;
        pendingTaggedUsers = selectedTaggedUsers.map((u) => ({...u}));
        if (tagSearchInput) tagSearchInput.value = "";
        renderTagChipList();
        renderTagResults([]);
    }

    function syncMediaAltTrigger() {
        const can = isImageSet();
        if (mediaAltTrigger) {
            mediaAltTrigger.hidden = !can;
            mediaAltTrigger.disabled = !can;
        }
        if (mediaAltLabel) mediaAltLabel.textContent = mediaEdits.some((e) => e.alt.trim().length > 0) ? "설명 수정" : "설명 추가";
        if (!can && mediaView && !mediaView.hidden) closeMediaEditor({discardChanges: true});
    }

    function syncMediaEditsToAttachments() {
        if (!isImageSet()) {
            mediaEdits = [];
            pendingMediaEdits = [];
            activeMediaIndex = 0;
            syncMediaAltTrigger();
            return;
        }
        mediaEdits = attachedFiles.map((_, i) => mediaEdits[i] ?? {alt: ""});
        if (pendingMediaEdits.length !== mediaEdits.length) pendingMediaEdits = mediaEdits.map((e) => ({alt: e.alt}));
        activeMediaIndex = Math.min(activeMediaIndex, Math.max(mediaEdits.length - 1, 0));
        syncMediaAltTrigger();
    }

    function renderMediaEditor() {
        if (!mediaView || pendingMediaEdits.length === 0) return;
        const edit = pendingMediaEdits[activeMediaIndex] ?? {alt: ""};
        const url = attachmentPreviewUrls[activeMediaIndex] ?? "";
        const alt = edit.alt ?? "";
        if (mediaPrevButton) mediaPrevButton.disabled = activeMediaIndex === 0;
        if (mediaNextButton) mediaNextButton.disabled = activeMediaIndex >= pendingMediaEdits.length - 1;
        if (mediaPreviewImage) {
            mediaPreviewImage.src = url;
            mediaPreviewImage.alt = alt;
        }
        if (mediaAltInput) mediaAltInput.value = alt;
        if (mediaAltCount) mediaAltCount.textContent = `${alt.length} / ${maxMediaAltLength.toLocaleString()}`;
    }

    function openMediaEditor() {
        if (!mediaView || !isImageSet()) return;
        hideEmojiPicker();
        toggleLocationPanel(false);
        closeProductPanel();
        closeTagPanel();
        pendingMediaEdits = mediaEdits.map((e) => ({alt: e.alt}));
        activeMediaIndex = 0;
        mediaView.hidden = false;
        renderMediaEditor();
        window.requestAnimationFrame(() => mediaAltInput?.focus());
    }

    function closeMediaEditor({discardChanges = true} = {}) {
        if (!mediaView) return;
        if (discardChanges) pendingMediaEdits = mediaEdits.map((e) => ({alt: e.alt}));
        mediaView.hidden = true;
    }

    function saveMediaEdits() {
        mediaEdits = pendingMediaEdits.map((e) => ({alt: e.alt}));
        syncMediaAltTrigger();
        closeMediaEditor({discardChanges: false});
    }

    function revokeAttachmentPreviewUrls() {
        attachmentPreviewUrls.forEach((url) => {
            URL.revokeObjectURL(url);
        });
        attachmentPreviewUrls = [];
    }

    function escapeAttachmentText(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }

    function buildAttachmentCell(file, index, className) {
        const fileUrl = attachmentPreviewUrls[index] || "";
        const safeUrl = escapeAttachmentText(fileUrl);
        const safeName = escapeAttachmentText(file.name);
        const mediaMarkup = file.type.startsWith("image/")
            ? `<img class="media-img" src="${safeUrl}" alt="${safeName}">`
            : `<video class="tweet-modal__attachment-video" controls preload="metadata"><source src="${safeUrl}" type="${file.type}"></video>`;
        const background = file.type.startsWith("image/")
            ? `<div class="media-bg" style="background-image:url('${safeUrl}')"></div>`
            : "";

        const editBtn = file.type.startsWith("image/")
            ? `<div class="media-btn-row"><button type="button" class="media-btn" data-attachment-edit-index="${index}"><span>수정</span></button></div>`
            : "";
        return `<div class="media-cell ${className}"><div class="media-cell-inner"><div class="media-img-container">${background}${mediaMarkup}</div>${editBtn}<button type="button" class="media-btn-delete" data-attachment-remove-index="${index}" aria-label="첨부 삭제"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg></button></div></div>`;
    }

    function buildAttachmentLayout() {
        if (attachedFiles.length === 0) {
            return "";
        }
        if (attachedFiles.length === 1) {
            return `<div class="media-aspect-ratio media-aspect-ratio--single"><div class="media-absolute-layer">${buildAttachmentCell(attachedFiles[0], 0, "media-cell--single")}</div></div>`;
        }
        if (attachedFiles.length === 2) {
            return `<div class="media-aspect-ratio"><div class="media-absolute-layer"><div class="media-row">${buildAttachmentCell(attachedFiles[0], 0, "media-cell--left")}${buildAttachmentCell(attachedFiles[1], 1, "media-cell--right")}</div></div></div>`;
        }
        if (attachedFiles.length === 3) {
            return `<div class="media-aspect-ratio"><div class="media-absolute-layer"><div class="media-row">${buildAttachmentCell(attachedFiles[0], 0, "media-cell--left-tall")}<div class="media-col">${buildAttachmentCell(attachedFiles[1], 1, "media-cell--right-top")}${buildAttachmentCell(attachedFiles[2], 2, "media-cell--right-bottom")}</div></div></div></div>`;
        }
        return `<div class="media-aspect-ratio"><div class="media-absolute-layer"><div class="media-row"><div class="media-col">${buildAttachmentCell(attachedFiles[0], 0, "media-cell--top-left")}${buildAttachmentCell(attachedFiles[2], 2, "media-cell--bottom-left")}</div><div class="media-col">${buildAttachmentCell(attachedFiles[1], 1, "media-cell--top-right")}${buildAttachmentCell(attachedFiles[3], 3, "media-cell--bottom-right")}</div></div></div></div>`;
    }

    function renderAttachments() {
        if (!attachmentPreview || !attachmentMedia || !mediaUploadButton) {
            return;
        }

        attachmentPreview.hidden = attachedFiles.length === 0;
        attachmentMedia.innerHTML = buildAttachmentLayout();
        attachmentMetaButtons.forEach((button) => {
            button.hidden = attachedFiles.length === 0;
        });
        mediaUploadButton.disabled = attachedFiles.length >= maxAttachments;
        composer.classList.toggle("has-draft", hasDraftContent());
        syncInlineReplySubmitState();
        syncMediaEditsToAttachments();
        syncUserTagTrigger();
    }

    function setAttachments(files) {
        attachedFiles = files.slice(0, maxAttachments);
        revokeAttachmentPreviewUrls();
        attachmentPreviewUrls = attachedFiles.map((file) =>
            URL.createObjectURL(file),
        );
        renderAttachments();
    }

    function syncLocationUI() {
        const hasLocation = Boolean(selectedLocation);
        composer.classList.toggle("has-draft", hasDraftContent());
        if (locationDisplay) {
            locationDisplay.hidden = !hasLocation;
        }
        if (locationName) {
            locationName.textContent = selectedLocation ?? "";
        }
        if (geoButtonPath) {
            geoButtonPath.setAttribute(
                "d",
                hasLocation
                    ? geoButtonPath.dataset.pathActive ||
                    geoButtonPath.getAttribute("d")
                    : geoButtonPath.dataset.pathInactive ||
                    geoButtonPath.getAttribute("d"),
            );
        }
        if (locationDeleteButton) {
            locationDeleteButton.hidden = !hasLocation;
        }
        if (locationCompleteButton) {
            locationCompleteButton.disabled = !pendingLocation;
        }
    }

    // main 쪽 정적 위치 리스트를 그대로 쓰고, 필터링과 체크 표시만 바꿔서 JS를 줄인다.
    function renderInlineReplyLocationList() {
        if (locationItems.length === 0) {
            return;
        }
        const query = locationSearchInput?.value.trim() ?? "";
        locationItems.forEach((item) => {
            const label = item
                .querySelector(".tweet-modal__location-item-label")
                ?.textContent?.trim();
            const check = item.querySelector(
                ".tweet-modal__location-item-check",
            );
            const isVisible = !query || Boolean(label?.includes(query));
            const isActive = label === pendingLocation;

            item.hidden = !isVisible;
            if (check) {
                check.innerHTML = isActive
                    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></svg>'
                    : "";
            }
        });
    }

    function toggleLocationPanel(forceOpen) {
        if (!locationView) {
            return;
        }
        const willOpen =
            typeof forceOpen === "boolean" ? forceOpen : locationView.hidden;
        locationView.hidden = !willOpen;
        if (willOpen) {
            pendingLocation = selectedLocation;
            renderInlineReplyLocationList();
            syncLocationUI();
            window.requestAnimationFrame(() => {
                locationSearchInput?.focus();
            });
            return;
        }
        if (locationSearchInput) {
            locationSearchInput.value = "";
        }
        renderInlineReplyLocationList();
    }

    setExpanded();
    syncInlineReplySubmitState();
    syncLocationUI();

    editor?.addEventListener("input", () => {
        resetEditorIfEmpty();
        saveEditorSelection();
        syncFormatButtons();
        composer.classList.toggle("has-draft", hasDraftContent());
        syncInlineReplySubmitState();
    });

    editor?.addEventListener("keyup", () => {
        saveEditorSelection();
        syncFormatButtons();
    });
    editor?.addEventListener("mouseup", () => {
        saveEditorSelection();
        syncFormatButtons();
    });
    editor?.addEventListener("focus", syncFormatButtons);

    editor?.addEventListener("keydown", (event) => {
        if (!event.ctrlKey && !event.metaKey) return;
        const key = event.key.toLowerCase();
        if (key !== "b" && key !== "i") return;
        event.preventDefault();
        applyFormat(key === "b" ? "bold" : "italic");
    });

    formatButtons.forEach((btn) => {
        btn.addEventListener("mousedown", (e) => e.preventDefault());
        btn.addEventListener("click", () => applyFormat(btn.getAttribute("data-format")));
    });

    composer.addEventListener("focusin", () => {
        setExpanded();
    });

    composer.addEventListener("focusout", () => {
        window.setTimeout(() => {
            resetEditorIfEmpty();
            syncExpandedState();
        }, 0);
    });

    emojiButton?.addEventListener("mousedown", (event) => event.preventDefault());
    emojiButton?.addEventListener("click", (event) => {
        event.preventDefault();
        saveEditorSelection();
        toggleLocationPanel(false);
        const picker = getOrCreateEmojiPicker();
        if (!picker) return;
        if (picker.pickerVisible) {
            picker.hidePicker();
        } else {
            emojiButton.setAttribute("aria-expanded", "true");
            picker.showPicker(emojiButton);
        }
    });

    mediaUploadButton?.addEventListener("click", (event) => {
        event.preventDefault();
        pendingAttachmentEditIndex = null;
        if (fileInput) fileInput.value = "";
        fileInput?.click();
    });

    fileInput?.addEventListener("change", (event) => {
        const nextFiles = Array.from(event.target.files ?? []);
        if (nextFiles.length === 0) {
            pendingAttachmentEditIndex = null;
            return;
        }
        if (pendingAttachmentEditIndex !== null) {
            const rep = nextFiles[0];
            if (rep && rep.type.startsWith("image/")) {
                const edited = [...attachedFiles];
                edited[pendingAttachmentEditIndex] = rep;
                pendingAttachmentEditIndex = null;
                setAttachments(edited.slice(0, maxAttachments));
            } else {
                pendingAttachmentEditIndex = null;
            }
            fileInput.value = "";
            return;
        }
        const imageAndVideoFiles = nextFiles.filter(
            (file) =>
                file.type.startsWith("image/") ||
                file.type.startsWith("video/"),
        );
        setAttachments([...attachedFiles, ...imageAndVideoFiles]);
        fileInput.value = "";
    });

    attachmentMedia?.addEventListener("click", (event) => {
        const editBtn = event.target.closest("[data-attachment-edit-index]");
        if (editBtn) {
            pendingAttachmentEditIndex = Number.parseInt(
                editBtn.getAttribute("data-attachment-edit-index") ?? "-1",
                10,
            );
            if (fileInput) fileInput.value = "";
            fileInput?.click();
            return;
        }
        const removeBtn = event.target.closest("[data-attachment-remove-index]");
        const index = Number.parseInt(
            removeBtn?.getAttribute("data-attachment-remove-index") || "",
            10,
        );
        if (Number.isNaN(index)) {
            return;
        }
        setAttachments(
            attachedFiles.filter((_, fileIndex) => fileIndex !== index),
        );
    });

    geoButton?.addEventListener("click", (event) => {
        event.preventDefault();
        hideEmojiPicker();
        toggleLocationPanel();
    });

    locationDisplay?.addEventListener("click", (event) => {
        event.preventDefault();
        hideEmojiPicker();
        toggleLocationPanel(true);
    });

    locationSearchInput?.addEventListener("input", () => {
        renderInlineReplyLocationList();
    });

    locationList?.addEventListener("click", (event) => {
        const button = event.target.closest(".tweet-modal__location-item");
        const location = button
            ?.querySelector(".tweet-modal__location-item-label")
            ?.textContent?.trim();
        if (!location) {
            return;
        }
        pendingLocation = location;
        renderInlineReplyLocationList();
        syncLocationUI();
    });

    locationCloseButton?.addEventListener("click", () => {
        pendingLocation = selectedLocation;
        toggleLocationPanel(false);
        syncLocationUI();
    });

    locationDeleteButton?.addEventListener("click", () => {
        selectedLocation = null;
        pendingLocation = null;
        toggleLocationPanel(false);
        syncLocationUI();
    });

    locationCompleteButton?.addEventListener("click", () => {
        selectedLocation = pendingLocation;
        toggleLocationPanel(false);
        syncLocationUI();
    });

    productButton?.addEventListener("click", (event) => {
        event.preventDefault();
        openProductPanel();
    });

    productSelectClose?.addEventListener("click", () => {
        closeProductPanel();
    });

    productSelectList?.addEventListener("click", (event) => {
        const item = event.target.closest(".draft-panel__item");
        if (!item) return;
        const wasSelected = item.classList.contains("draft-panel__item--selected");
        productSelectList.querySelectorAll(".draft-panel__item--selected").forEach((el) => {
            el.classList.remove("draft-panel__item--selected");
            el.setAttribute("aria-pressed", "false");
            el.querySelector(".draft-panel__checkbox")?.classList.remove("draft-panel__checkbox--checked");
        });
        if (!wasSelected) {
            item.classList.add("draft-panel__item--selected");
            item.setAttribute("aria-pressed", "true");
            item.querySelector(".draft-panel__checkbox")?.classList.add("draft-panel__checkbox--checked");
        }
        if (productSelectComplete) {
            productSelectComplete.disabled = !productSelectList.querySelector(".draft-panel__item--selected");
        }
    });

    productSelectComplete?.addEventListener("click", () => {
        const checkedItem = productSelectList?.querySelector(".draft-panel__item--selected");
        if (checkedItem) {
            selectedProduct = {
                name: checkedItem.dataset.productName ?? "",
                price: checkedItem.dataset.productPrice ?? "",
                image: checkedItem.dataset.productImage ?? "",
                id: checkedItem.dataset.productId ?? "",
            };
            syncSelectedProductCard();
            if (productButton) productButton.disabled = true;
        }
        closeProductPanel();
    });

    selectedProductCard?.querySelector("[data-product-remove]")?.addEventListener("click", () => {
        selectedProduct = null;
        syncSelectedProductCard();
        if (productButton) productButton.disabled = false;
    });

    userTagTrigger?.addEventListener("click", (e) => {
        e.preventDefault();
        openTagPanel();
    });

    mediaAltTrigger?.addEventListener("click", (e) => {
        e.preventDefault();
        openMediaEditor();
    });

    tagSearchForm?.addEventListener("submit", (e) => e.preventDefault());
    tagSearchInput?.addEventListener("input", () => runTagSearch());

    tagCloseButton?.addEventListener("click", () => closeTagPanel());
    tagCompleteButton?.addEventListener("click", () => {
        selectedTaggedUsers = pendingTaggedUsers.map((u) => ({...u}));
        syncUserTagTrigger();
        closeTagPanel();
    });

    tagChipList?.addEventListener("click", (e) => {
        const cb = e.target.closest("[data-tag-remove-id]");
        if (!cb) return;
        const uid = cb.getAttribute("data-tag-remove-id");
        pendingTaggedUsers = pendingTaggedUsers.filter((u) => u.id !== uid);
        renderTagChipList();
        runTagSearch();
        tagSearchInput?.focus();
    });

    tagResults?.addEventListener("click", (e) => {
        const ub = e.target.closest("[data-tag-user-id]");
        if (!ub || ub.hasAttribute("disabled")) return;
        const uid = ub.getAttribute("data-tag-user-id");
        const user = currentTagResults.find((u) => u.id === uid);
        if (!user || pendingTaggedUsers.some((u) => u.id === user.id)) return;
        pendingTaggedUsers = [...pendingTaggedUsers, {...user}];
        renderTagChipList();
        if (tagSearchInput) tagSearchInput.value = "";
        renderTagResults([]);
        tagSearchInput?.focus();
    });

    mediaBackButton?.addEventListener("click", () => closeMediaEditor());
    mediaSaveButton?.addEventListener("click", () => saveMediaEdits());
    mediaPrevButton?.addEventListener("click", () => {
        if (activeMediaIndex === 0) return;
        activeMediaIndex -= 1;
        renderMediaEditor();
    });
    mediaNextButton?.addEventListener("click", () => {
        if (activeMediaIndex >= pendingMediaEdits.length - 1) return;
        activeMediaIndex += 1;
        renderMediaEditor();
    });
    mediaAltInput?.addEventListener("input", () => {
        const edit = pendingMediaEdits[activeMediaIndex];
        if (!edit) return;
        edit.alt = mediaAltInput.value.slice(0, maxMediaAltLength);
        if (mediaAltCount) mediaAltCount.textContent = `${edit.alt.length} / ${maxMediaAltLength.toLocaleString()}`;
    });

    submitButton?.addEventListener("click", (event) => {
        event.preventDefault();
        if (submitButton.disabled || !editor) {
            return;
        }
        editor.innerHTML = "";
        setAttachments([]);
        fileInput.value = "";
        selectedLocation = null;
        pendingLocation = null;
        selectedProduct = null;
        syncSelectedProductCard();
        if (productButton) productButton.disabled = false;
        selectedTaggedUsers = [];
        pendingTaggedUsers = [];
        pendingAttachmentEditIndex = null;
        mediaEdits = [];
        pendingMediaEdits = [];
        activeMediaIndex = 0;
        syncUserTagTrigger();
        syncMediaAltTrigger();
        closeTagPanel();
        closeMediaEditor({discardChanges: true});
        syncLocationUI();
        syncInlineReplySubmitState();
        hideEmojiPicker();
        toggleLocationPanel(false);
        closeProductPanel();
        resetEditorIfEmpty();
        placeCaretAtEnd();
        setExpanded();
    });

    document.addEventListener("click", (event) => {
        if (!composer.contains(event.target) && !productView?.contains(event.target) && !tagView?.contains(event.target) && !mediaView?.contains(event.target)) {
            hideEmojiPicker();
            toggleLocationPanel(false);
            closeProductPanel();
            closeTagPanel();
            closeMediaEditor({discardChanges: true});
            syncExpandedState();
        }
    });
    window.addEventListener("beforeunload", revokeAttachmentPreviewUrls);
}

// 메인 피드의 게시글 액션 중 상세 화면에 필요한 최소 동작만 옮긴다.
function setupPostDetailActions() {
    const layersRoot = document.getElementById("layers");
    const moreDropdown = document.getElementById("postDetailMoreDropdown");
    const moreMenu = document.getElementById("postDetailMoreMenu");
    const moreFollowButton = document.getElementById("postDetailMoreFollow");
    const moreFollowLabel = document.getElementById(
        "postDetailMoreFollowLabel",
    );
    const moreFollowIconPath = document.getElementById(
        "postDetailMoreFollowIconPath",
    );
    const moreBlockButton = document.getElementById("postDetailMoreBlock");
    const moreBlockLabel = document.getElementById("postDetailMoreBlockLabel");
    const moreReportButton = document.getElementById("postDetailMoreReport");
    const moreToast = document.getElementById("postDetailMoreToast");
    const blockDialog = document.getElementById("postDetailBlockDialog");
    const blockTitle = document.getElementById("postDetailBlockTitle");
    const blockDesc = document.getElementById("postDetailBlockDesc");
    const reportDialog = document.getElementById("postDetailReportDialog");
    let activeShareDropdown = null;
    let activeShareButton = null;
    let activeShareToast = null;
    let activeShareToastTimer = null;
    let activeShareModal = null;
    let activeMoreButton = null;
    let activeMoreMeta = null;
    let moreToastTimer = null;
    const moreFollowState = new Map();
    const shareMenuIcons = {
        copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></g></svg>',
        chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path></g></svg>',
        bookmark:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18 3V0h2v3h3v2h-3v3h-2V5h-3V3zm-7.5 1a.5.5 0 00-.5.5V7h3.5A2.5 2.5 0 0116 9.5v3.48l3 2.1V11h2v7.92l-5-3.5v7.26l-6.5-3.54L3 22.68V9.5A2.5 2.5 0 015.5 7H8V4.5A2.5 2.5 0 0110.5 2H12v2zm-5 5a.5.5 0 00-.5.5v9.82l4.5-2.46 4.5 2.46V9.5a.5.5 0 00-.5-.5z"></path></g></svg>',
    };
    const moreIcons = {
        follow: "M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm4 7c-3.053 0-5.563 1.193-7.443 3.596l1.548 1.207C5.573 15.922 7.541 15 10 15s4.427.922 5.895 2.803l1.548-1.207C15.563 14.193 13.053 13 10 13zm8-6V5h-3V3h-2v2h-3v2h3v3h2V7h3z",
        unfollow:
            "M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm12.586 3l-2.043-2.04 1.414-1.42L20 7.59l2.043-2.05 1.414 1.42L21.414 9l2.043 2.04-1.414 1.42L20 10.41l-2.043 2.05-1.414-1.42L18.586 9zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z",
    };

    function escapeHtml(value) {
        return String(value).replace(
            /[&<>"']/g,
            (char) =>
                ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                })[char] ?? char,
        );
    }

    function syncBodyModalLock() {
        document.body.classList.toggle(
            "modal-open",
            Boolean(activeShareModal) ||
            blockDialog?.hidden === false ||
            reportDialog?.hidden === false,
        );
    }

    // 좋아요와 북마크 아이콘은 path data를 바꿔 활성 상태를 맞춘다.
    function syncButtonPath(button, isActive) {
        const path = button?.querySelector("path");
        if (!path) {
            return;
        }

        path.setAttribute(
            "d",
            isActive
                ? path.dataset.pathActive || path.getAttribute("d")
                : path.dataset.pathInactive || path.getAttribute("d"),
        );
    }

    // 북마크 버튼은 시각 상태와 접근성 속성을 같이 갱신한다.
    function setBookmarkButtonState(button, isActive) {
        if (!button) {
            return;
        }

        button.classList.toggle("active", isActive);
        button.setAttribute(
            "data-testid",
            isActive ? "removeBookmark" : "bookmark",
        );
        button.setAttribute(
            "aria-label",
            isActive ? "북마크에 추가됨" : "북마크",
        );
        syncButtonPath(button, isActive);
    }

    // 공유 링크는 현재 게시글의 핸들, 포스트 id, 북마크 버튼 참조를 묶어서 만든다.
    function getSharePostMeta(button) {
        const postCard = button.closest(".postCard, [data-post-card]");
        const handle =
            postCard?.querySelector(".postHandle")?.textContent?.trim() ||
            "@user";
        const postId = postCard?.dataset.postId || "1";
        const bookmarkButton =
            postCard?.querySelector(".tweet-action-btn--bookmark") ?? null;
        const url = new URL(window.location.href);

        url.pathname = `/${handle.replace("@", "") || "user"}/status/${postId}`;
        url.search = "";
        url.hash = "";

        return {
            bookmarkButton,
            permalink: url.toString(),
        };
    }

    // 상세 화면 공통 피드백은 짧은 토스트 하나로만 보여 준다.
    function showShareToast(message) {
        if (activeShareToastTimer) {
            window.clearTimeout(activeShareToastTimer);
            activeShareToastTimer = null;
        }

        activeShareToast?.remove();
        activeShareToast = document.createElement("div");
        activeShareToast.className = "share-toast";
        activeShareToast.textContent = message;
        document.body.appendChild(activeShareToast);

        activeShareToastTimer = window.setTimeout(() => {
            activeShareToast?.remove();
            activeShareToast = null;
            activeShareToastTimer = null;
        }, 2200);
    }

    function closeShareModal() {
        if (!activeShareModal) {
            return;
        }

        activeShareModal.remove();
        activeShareModal = null;
        syncBodyModalLock();
    }

    // 공유 드롭다운은 하나만 열리도록 유지하고 열림 상태도 같이 정리한다.
    function closeShareDropdown() {
        if (!activeShareDropdown) {
            return;
        }

        activeShareDropdown.remove();
        activeShareDropdown = null;
        if (activeShareButton) {
            activeShareButton.setAttribute("aria-expanded", "false");
            activeShareButton = null;
        }
    }

    // 메인 게시글처럼 공유 메뉴에서 현재 상세 게시글 링크를 복사한다.
    function copyShareLink(button) {
        const {permalink} = getSharePostMeta(button);
        closeShareDropdown();
        if (!navigator.clipboard?.writeText) {
            showShareToast("링크를 복사하지 못했습니다");
            return;
        }

        navigator.clipboard
            .writeText(permalink)
            .then(() => showShareToast("클립보드로 복사함"))
            .catch(() => showShareToast("링크를 복사하지 못했습니다"));
    }

    function getCurrentPageTagUsers() {
        const users = [];
        const seen = new Set();
        const cards = Array.from(
            document.querySelectorAll(".postCard, [data-post-card]"),
        );

        cards.forEach((card, index) => {
            const handle =
                card.querySelector(".postHandle")?.textContent?.trim() ||
                "@user";
            if (seen.has(handle)) {
                return;
            }

            const name =
                card.querySelector(".postName")?.textContent?.trim() ||
                "사용자";
            const avatar =
                card
                    .querySelector(".post-detail-avatar img")
                    ?.getAttribute("src") ||
                document
                    .querySelector(".post-detail-inline-reply-avatar img")
                    ?.getAttribute("src") ||
                "";

            seen.add(handle);
            users.push({
                id: `${handle.replace("@", "") || "user"}-${index}`,
                name,
                handle,
                avatar,
            });
        });

        return users;
    }

    function getShareUserRows() {
        const users = getCurrentPageTagUsers();
        if (users.length === 0) {
            return `<div class="share-sheet__empty"><p>전송할 수 있는 사용자가 없습니다.</p></div>`;
        }

        return users
            .map(
                (user) =>
                    `<button type="button" class="share-sheet__user" data-share-user-id="${escapeHtml(user.id)}"><span class="share-sheet__user-avatar">${user.avatar ? `<img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" />` : ""}</span><span class="share-sheet__user-body"><span class="share-sheet__user-name">${escapeHtml(user.name)}</span><span class="share-sheet__user-handle">${escapeHtml(user.handle)}</span></span></button>`,
            )
            .join("");
    }

    function createShareMenuItemMarkup(type, label) {
        return `<button type="button" role="menuitem" class="menu-item share-menu-item share-menu-item--${type}"><span class="menu-item__icon share-menu-item__icon">${shareMenuIcons[type] ?? ""}</span><span class="menu-item__label">${label}</span></button>`;
    }

    function openShareModal(markup, onClick) {
        closeShareDropdown();
        closeShareModal();

        const modal = document.createElement("div");
        modal.className = "share-sheet";
        modal.innerHTML = markup;
        modal.addEventListener("click", onClick);

        document.body.appendChild(modal);
        activeShareModal = modal;
        syncBodyModalLock();
        return modal;
    }

    function getMoreMeta(button) {
        const postCard = button.closest(".postCard, [data-post-card]");
        const handle =
            postCard?.querySelector(".postHandle")?.textContent?.trim() ||
            "@user";
        return {button, handle};
    }

    function closeMoreDropdown() {
        if (!moreDropdown) {
            return;
        }
        moreDropdown.hidden = true;
        moreMenu?.style.removeProperty("top");
        moreMenu?.style.removeProperty("left");
        activeMoreButton?.setAttribute("aria-expanded", "false");
        activeMoreButton = null;
        activeMoreMeta = null;
    }

    function showMoreToast(message) {
        if (!moreToast) {
            return;
        }
        moreToast.textContent = message;
        moreToast.hidden = false;
        window.clearTimeout(moreToastTimer);
        moreToastTimer = window.setTimeout(() => {
            moreToast.hidden = true;
        }, 3000);
    }

    function closeMoreDialog() {
        if (blockDialog) {
            blockDialog.hidden = true;
        }
        if (reportDialog) {
            reportDialog.hidden = true;
        }
        syncBodyModalLock();
    }

    function openBlockDialog(meta) {
        if (!blockDialog || !blockTitle || !blockDesc) {
            return;
        }
        closeMoreDropdown();
        activeMoreMeta = meta;
        blockTitle.textContent = `${meta.handle} 님을 차단할까요?`;
        blockDesc.textContent = `내 공개 게시물을 볼 수 있지만 더 이상 게시물에 참여할 수 없습니다. 또한 ${meta.handle} 님은 나를 팔로우하거나 쪽지를 보낼 수 없으며, 이 계정과 관련된 알림도 내게 표시되지 않습니다.`;
        blockDialog.hidden = false;
        syncBodyModalLock();
    }

    function openReportDialog(meta) {
        if (!reportDialog) {
            return;
        }
        closeMoreDropdown();
        activeMoreMeta = meta;
        reportDialog.hidden = false;
        syncBodyModalLock();
    }

    function openMoreDropdown(button) {
        if (!moreDropdown || !moreMenu) {
            return;
        }
        const meta = getMoreMeta(button);
        const isFollowing = moreFollowState.get(meta.handle) ?? false;
        const rect = button.getBoundingClientRect();
        const menuRect = moreMenu.getBoundingClientRect();
        const top = Math.min(
            rect.bottom + 8,
            window.innerHeight - menuRect.height - 16,
        );
        const left = Math.min(
            Math.max(16, rect.right - Math.max(menuRect.width, 240)),
            window.innerWidth - Math.max(menuRect.width, 240) - 16,
        );
        if (moreFollowLabel) {
            moreFollowLabel.textContent = isFollowing
                ? `${meta.handle} 님 언팔로우하기`
                : `${meta.handle} 님 팔로우하기`;
        }
        if (moreBlockLabel) {
            moreBlockLabel.textContent = `${meta.handle} 님 차단하기`;
        }
        if (moreFollowIconPath) {
            moreFollowIconPath.setAttribute(
                "d",
                isFollowing ? moreIcons.unfollow : moreIcons.follow,
            );
        }
        closeMoreDropdown();
        activeMoreButton = button;
        activeMoreMeta = meta;
        moreDropdown.hidden = false;
        moreMenu.style.top = `${top}px`;
        moreMenu.style.left = `${left}px`;
        button.setAttribute("aria-expanded", "true");
    }

    function openShareChatModal() {
        openShareModal(
            `<div class="share-sheet__backdrop" data-share-close="true"></div><div class="share-sheet__card" role="dialog" aria-modal="true" aria-labelledby="share-chat-title"><div class="share-sheet__header"><button type="button" class="share-sheet__icon-btn" data-share-close="true" aria-label="돌아가기"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg></button><h2 id="share-chat-title" class="share-sheet__title">공유하기</h2><span class="share-sheet__header-spacer"></span></div><div class="share-sheet__search"><input type="text" class="share-sheet__search-input" placeholder="검색" aria-label="검색" /></div><div class="share-sheet__list">${getShareUserRows()}</div></div>`,
            (e) => {
                if (
                    e.target.closest("[data-share-close='true']") ||
                    e.target.classList.contains("share-sheet__backdrop") ||
                    e.target.closest(".share-sheet__user")
                ) {
                    e.preventDefault();
                    closeShareModal();
                }
            },
        );
    }

    function openShareBookmarkModal(button) {
        const {bookmarkButton} = getSharePostMeta(button);
        const isBookmarked =
            bookmarkButton?.classList.contains("active") ?? false;
        openShareModal(
            `
            <div class="share-sheet__backdrop" data-share-close="true"></div>
            <div class="share-sheet__card share-sheet__card--bookmark" role="dialog" aria-modal="true" aria-labelledby="share-bookmark-title">
                <div class="share-sheet__header">
                    <button type="button" class="share-sheet__icon-btn" data-share-close="true" aria-label="닫기">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                        </svg>
                    </button>
                    <h2 id="share-bookmark-title" class="share-sheet__title">폴더에 추가</h2>
                    <span class="share-sheet__header-spacer"></span>
                </div>
                <button type="button" class="share-sheet__create-folder">새 북마크 폴더 만들기</button>
                <button type="button" class="share-sheet__folder" data-share-folder="all-bookmarks">
                    <span class="share-sheet__folder-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M2.998 8.5c0-1.38 1.119-2.5 2.5-2.5h9c1.381 0 2.5 1.12 2.5 2.5v14.12l-7-3.5-7 3.5V8.5zM18.5 2H8.998v2H18.5c.275 0 .5.224.5.5V15l2 1.4V4.5c0-1.38-1.119-2.5-2.5-2.5z"></path>
                        </svg>
                    </span>
                    <span class="share-sheet__folder-name">모든 북마크</span>
                    <span class="share-sheet__folder-check${isBookmarked ? " share-sheet__folder-check--active" : ""}">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                        </svg>
                    </span>
                </button>
            </div>
        `,
            (event) => {
                if (
                    event.target.closest("[data-share-close='true']") ||
                    event.target.classList.contains("share-sheet__backdrop")
                ) {
                    event.preventDefault();
                    closeShareModal();
                    return;
                }

                if (event.target.closest(".share-sheet__create-folder")) {
                    event.preventDefault();
                    closeShareModal();
                    return;
                }

                if (
                    event.target.closest("[data-share-folder='all-bookmarks']")
                ) {
                    event.preventDefault();
                    setBookmarkButtonState(bookmarkButton, !isBookmarked);
                    closeShareModal();
                }
            },
        );
    }

    // 상세 화면 공유 버튼은 드롭다운 하나만 띄우고 다시 누르면 닫는다.
    function openShareDropdown(button) {
        if (!layersRoot) {
            return;
        }

        closeShareDropdown();
        const rect = button.getBoundingClientRect();
        const top = rect.bottom + 8;
        const lc = document.createElement("div");
        lc.className = "layers-dropdown-container";
        lc.innerHTML = `<div class="layers-overlay"></div><div class="layers-dropdown-inner"><div role="menu" class="dropdown-menu"><div><div class="dropdown-inner">${createShareMenuItemMarkup("copy", "링크 복사하기")}${createShareMenuItemMarkup("chat", "Chat으로 전송하기")}${createShareMenuItemMarkup("bookmark", "폴더에 북마크 추가하기")}</div></div></div></div>`;
        layersRoot.appendChild(lc);

        const menu = lc.querySelector(".dropdown-menu");
        if (menu) {
            const menuWidth = menu.offsetWidth || 0;
            const left = Math.min(
                Math.max(16, rect.right - menuWidth + 20),
                Math.max(16, window.innerWidth - menuWidth - 16),
            );
            menu.style.top = `${top}px`;
            menu.style.left = `${left}px`;
            menu.style.right = "auto";
        }

        lc.addEventListener("click", (e) => {
            const ab = e.target.closest(".share-menu-item");
            if (!ab || !activeShareButton) {
                e.stopPropagation();
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (ab.classList.contains("share-menu-item--copy")) {
                copyShareLink(activeShareButton);
                return;
            }
            if (ab.classList.contains("share-menu-item--chat")) {
                openShareChatModal();
                return;
            }
            if (ab.classList.contains("share-menu-item--bookmark")) {
                openShareBookmarkModal(activeShareButton);
            }
        });
        activeShareDropdown = lc;
        activeShareButton = button;
        activeShareButton.setAttribute("aria-expanded", "true");
    }

    document.querySelectorAll(".tweet-action-btn--like").forEach((button) => {
        const countElement = button.querySelector(".tweet-action-count");
        let baseCount = Number.parseInt(countElement?.textContent || "0", 10);

        if (Number.isNaN(baseCount)) {
            baseCount = 0;
        }

        button.addEventListener("click", (event) => {
            event.preventDefault();
            const isActive = button.classList.toggle("active");

            if (countElement) {
                countElement.textContent = String(
                    isActive ? baseCount + 1 : baseCount,
                );
            }

            syncButtonPath(button, isActive);
        });
    });

    document
        .querySelectorAll(".tweet-action-btn--bookmark")
        .forEach((button) => {
            const path = button.querySelector("path");
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const isActive = button.classList.toggle("active");

                button.setAttribute(
                    "data-testid",
                    isActive ? "removeBookmark" : "bookmark",
                );
                button.setAttribute(
                    "aria-label",
                    isActive ? "북마크에 추가됨" : "북마크",
                );

                if (path) {
                    path.setAttribute(
                        "d",
                        isActive
                            ? path.dataset.pathActive || path.getAttribute("d")
                            : path.dataset.pathInactive ||
                            path.getAttribute("d"),
                    );
                }
            });
        });

    document.querySelectorAll(".tweet-action-btn--share").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (activeShareButton === button) {
                closeShareDropdown();
                return;
            }

            openShareDropdown(button);
        });
    });

    document.querySelectorAll(".post-detail-more-trigger").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (activeMoreButton === button && moreDropdown?.hidden === false) {
                closeMoreDropdown();
                return;
            }
            openMoreDropdown(button);
        });
    });

    moreFollowButton?.addEventListener("click", (event) => {
        event.preventDefault();
        if (!activeMoreMeta) {
            return;
        }
        const handle = activeMoreMeta.handle;
        const isFollowing = moreFollowState.get(handle) ?? false;
        moreFollowState.set(handle, !isFollowing);
        closeMoreDropdown();
        if (!isFollowing) {
            showMoreToast(`${handle} 님을 팔로우함`);
        }
    });

    moreBlockButton?.addEventListener("click", (event) => {
        event.preventDefault();
        if (activeMoreMeta) {
            openBlockDialog(activeMoreMeta);
        }
    });

    moreReportButton?.addEventListener("click", (event) => {
        event.preventDefault();
        if (activeMoreMeta) {
            openReportDialog(activeMoreMeta);
        }
    });

    blockDialog?.addEventListener("click", (event) => {
        if (event.target.closest("[data-post-detail-block-close='true']")) {
            closeMoreDialog();
            return;
        }
        if (event.target.closest("[data-post-detail-block-confirm='true']")) {
            closeMoreDialog();
        }
    });

    reportDialog?.addEventListener("click", (event) => {
        if (
            event.target.closest("[data-post-detail-report-close='true']") ||
            event.target.closest(".post-detail-notification-report__item")
        ) {
            closeMoreDialog();
        }
    });

    document
        .querySelectorAll(".tweet-action-btn[data-testid='reply']")
        .forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
            });
        });

    document.addEventListener("click", (event) => {
        if (
            moreDropdown &&
            !moreDropdown.hidden &&
            !moreDropdown.contains(event.target) &&
            !activeMoreButton?.contains(event.target)
        ) {
            closeMoreDropdown();
        }
        if (
            activeShareDropdown &&
            !activeShareDropdown.contains(event.target) &&
            !activeShareButton?.contains(event.target)
        ) {
            closeShareDropdown();
        }
    });

    window.addEventListener(
        "scroll",
        () => {
            closeMoreDropdown();
            closeShareDropdown();
        },
        {passive: true},
    );

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMoreDialog();
            closeMoreDropdown();
            closeShareModal();
            closeShareDropdown();
        }
    });
}

// 답글/댓글 카드의 말풍선 버튼 클릭 시 열리는 답글 모달을 초기화한다.
function setupCardReplyModal() {
    const overlay = document.querySelector("[data-reply-modal]");
    if (!overlay) return;

    const q = (selector) => overlay.querySelector(selector);
    const qAll = (selector) => Array.from(overlay.querySelectorAll(selector));
    const composeView = q(".tweet-modal__compose-view");
    const editor = q("[data-testid='tweetTextarea_0']");
    const submitBtn = q("[data-testid='tweetButton']");
    const gauge = q("[data-reply-gauge]");
    const gaugeText = q("[data-reply-gauge-text]");
    const closeButton = q("[data-testid='app-bar-close']");
    const contextButton = q(".tweet-modal__context-button");
    const sourceAvatar = q("[data-reply-source-avatar]");
    const sourceInitial = q("[data-reply-source-initial]");
    const sourceName = q("[data-reply-source-name]");
    const sourceHandle = q("[data-reply-source-handle]");
    const sourceTime = q("[data-reply-source-time]");
    const sourceText = q("[data-reply-source-text]");
    const draftButton = q(".tweet-modal__draft");
    const draftView = q(".tweet-modal__draft-view");
    const draftBackButton = draftView?.querySelector("[data-draft-back]");
    const draftList = draftView?.querySelector("[data-draft-list]");
    const draftEmpty = draftView?.querySelector("[data-draft-empty]");
    const mediaUploadButton = q("[data-testid='mediaUploadButton']");
    const fileInput = q("[data-testid='fileInput']");
    const emojiButton = q("[data-testid='emojiButton']");
    const geoButton = q("[data-testid='geoButton']");
    const geoButtonPath = geoButton?.querySelector("path");
    const formatButtons = qAll("[data-format]");
    const attachmentPreview = q("[data-attachment-preview]");
    const attachmentMedia = q("[data-attachment-media]");
    const attachmentMetaButtons = qAll(".tweet-modal__attachment-meta-btn");
    const locationView = q(".tweet-modal__location-view");
    const locationCloseButton = q("[data-testid='location-back']");
    const locationSearchInput = q("[data-location-search]");
    const locationList = q("[data-location-list]");
    const locationItems = qAll(".tweet-modal__location-item");
    const locationDisplay = q("[data-location-display]");
    const locationName = q("[data-location-name]");
    const locationDeleteButton = q("[data-location-delete]");
    const locationCompleteButton = q("[data-location-complete]");
    const productButton = q("[data-testid='productSelectButton']");
    const productView = q("[data-product-select-modal]");
    const productSelectClose = productView?.querySelector(
        "[data-product-select-close]",
    );
    const productSelectList = productView?.querySelector(
        "[data-product-select-list]",
    );
    const productSelectComplete = productView?.querySelector(
        "[data-product-select-complete]",
    );
    const selectedProductCard = q("[data-selected-product]");
    const userTagTrigger = q("[data-user-tag-trigger]");
    const userTagLabel = q("[data-user-tag-label]");
    const tagView = q("[data-tag-modal]");
    const tagCloseButton = tagView?.querySelector("[data-tag-back]");
    const tagCompleteButton = tagView?.querySelector("[data-tag-complete]");
    const tagSearchForm = tagView?.querySelector("[data-tag-search-form]");
    const tagSearchInput = tagView?.querySelector("[data-tag-search]");
    const tagChipList = tagView?.querySelector("[data-tag-chip-list]");
    const tagResults = tagView?.querySelector("[data-tag-results]");
    const mediaAltTrigger = q("[data-media-alt-trigger]");
    const mediaAltLabel = q("[data-media-alt-label]");
    const mediaView = q("[data-media-alt-modal]");
    const mediaBackButton = mediaView?.querySelector("[data-media-back]");
    const mediaPrevButton = mediaView?.querySelector("[data-media-prev]");
    const mediaNextButton = mediaView?.querySelector("[data-media-next]");
    const mediaSaveButton = mediaView?.querySelector("[data-media-save]");
    const mediaPreviewImage = mediaView?.querySelector("[data-media-preview-image]");
    const mediaAltInput = mediaView?.querySelector("[data-media-alt-input]");
    const mediaAltCount = mediaView?.querySelector("[data-media-alt-count]");
    const maxLength = 500;
    const maxAttachments = 4;
    const maxMediaAltLength = 1000;
    const drafts = [];
    let draftSequence = 0;
    let emojiPicker = null;
    let attachedFiles = [];
    let attachmentPreviewUrls = [];
    let pendingAttachmentEditIndex = null;
    let selectedLocation = null;
    let pendingLocation = null;
    let selectedProduct = null;
    let selectedTaggedUsers = [];
    let pendingTaggedUsers = [];
    let mediaEdits = [];
    let pendingMediaEdits = [];
    let activeMediaIndex = 0;
    let currentTagResults = [];

    function syncState() {
        if (!editor) {
            return;
        }
        let content = editor.textContent?.replace(/\u00a0/g, " ") ?? "";
        if (content.length > maxLength) {
            content = content.slice(0, maxLength);
            editor.textContent = content;
            placeCaretAtEnd(editor);
        }
        const currentLength = content.length;
        const remaining = maxLength - currentLength;
        if (gauge) {
            gauge.setAttribute("aria-valuenow", String(currentLength));
            gauge.style.setProperty(
                "--gauge-progress",
                `${Math.min(360, (currentLength / maxLength) * 360)}deg`,
            );
        }
        if (gaugeText) {
            gaugeText.textContent = String(remaining);
            gaugeText.style.color = remaining < 0 ? "#f4212e" : "#536471";
        }
        if (submitBtn) {
            submitBtn.disabled =
                content.trim().length === 0 && attachedFiles.length === 0;
        }
    }

    function syncLocationUI() {
        const hasLocation = Boolean(selectedLocation);
        if (locationDisplay) {
            locationDisplay.hidden = !hasLocation;
        }
        if (locationName) {
            locationName.textContent = selectedLocation ?? "";
        }
        if (geoButton) {
            geoButton.classList.toggle("tweet-modal__tool-btn--active", hasLocation);
        }
        if (geoButtonPath) {
            geoButtonPath.setAttribute(
                "d",
                hasLocation
                    ? geoButtonPath.dataset.pathActive ||
                    geoButtonPath.getAttribute("d")
                    : geoButtonPath.dataset.pathInactive ||
                    geoButtonPath.getAttribute("d"),
            );
        }
        if (locationDeleteButton) {
            locationDeleteButton.hidden = !hasLocation;
        }
        if (locationCompleteButton) {
            locationCompleteButton.disabled = !pendingLocation;
        }
    }

    function renderLocationList() {
        if (locationItems.length === 0) {
            return;
        }
        const query = locationSearchInput?.value.trim() ?? "";
        locationItems.forEach((item) => {
            const label = item
                .querySelector(".tweet-modal__location-item-label")
                ?.textContent?.trim();
            const check = item.querySelector(".tweet-modal__location-item-check");
            const isVisible = !query || Boolean(label?.includes(query));
            const isActive = label === pendingLocation;

            item.hidden = !isVisible;
            if (check) {
                check.innerHTML = isActive
                    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></svg>'
                    : "";
            }
        });
    }

    function closeProductPanel() {
        if (productView) {
            productView.hidden = true;
        }
    }

    function closeLocationPanel({resetPending = true} = {}) {
        if (!locationView) {
            return;
        }
        locationView.hidden = true;
        if (resetPending) {
            pendingLocation = selectedLocation;
        }
        if (locationSearchInput) {
            locationSearchInput.value = "";
        }
        renderLocationList();
        syncLocationUI();
    }

    function openLocationPanel() {
        if (!locationView) {
            return;
        }
        if (emojiPicker?.pickerVisible) {
            emojiPicker.hidePicker();
        }
        closeProductPanel();
        closeTagPanel();
        closeMediaEditor({discardChanges: true});
        pendingLocation = selectedLocation;
        renderLocationList();
        syncLocationUI();
        locationView.hidden = false;
        window.requestAnimationFrame(() => locationSearchInput?.focus());
    }

    function syncSelectedProductCard() {
        if (!selectedProductCard) {
            return;
        }
        if (!selectedProduct) {
            selectedProductCard.hidden = true;
            return;
        }
        selectedProductCard.querySelector("[data-selected-product-image]").src =
            selectedProduct.image;
        selectedProductCard.querySelector("[data-selected-product-image]").alt =
            selectedProduct.name;
        selectedProductCard.querySelector("[data-selected-product-name]").textContent =
            selectedProduct.name;
        selectedProductCard.querySelector("[data-selected-product-price]").textContent =
            selectedProduct.price;
        selectedProductCard.hidden = false;
    }

    function openProductPanel() {
        if (!productView) {
            return;
        }
        if (emojiPicker?.pickerVisible) {
            emojiPicker.hidePicker();
        }
        closeLocationPanel();
        closeTagPanel();
        closeMediaEditor({discardChanges: true});
        productView.hidden = false;
    }

    function syncProductListSelection() {
        if (!productSelectList) {
            return;
        }
        const selectedId = selectedProduct?.id ?? "";
        productSelectList
            .querySelectorAll(".draft-panel__item")
            .forEach((item) => {
                const isSelected = item.dataset.productId === selectedId;
                item.classList.toggle("draft-panel__item--selected", isSelected);
                item.setAttribute("aria-pressed", String(isSelected));
                item.querySelector(".draft-panel__checkbox")?.classList.toggle(
                    "draft-panel__checkbox--checked",
                    isSelected,
                );
            });
        if (productSelectComplete) {
            productSelectComplete.disabled = !selectedId;
        }
    }

    function escapeAttachmentText(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }

    function revokeAttachmentPreviewUrls() {
        attachmentPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
        attachmentPreviewUrls = [];
    }

    function buildAttachmentCell(file, index, className) {
        const fileUrl = attachmentPreviewUrls[index] || "";
        const safeUrl = escapeAttachmentText(fileUrl);
        const safeName = escapeAttachmentText(file.name);
        const mediaMarkup = file.type.startsWith("image/")
            ? `<img class="media-img" src="${safeUrl}" alt="${safeName}">`
            : `<video class="tweet-modal__attachment-video" controls preload="metadata"><source src="${safeUrl}" type="${file.type}"></video>`;
        const background = file.type.startsWith("image/")
            ? `<div class="media-bg" style="background-image:url('${safeUrl}')"></div>`
            : "";
        const editButton = file.type.startsWith("image/")
            ? `<div class="media-btn-row"><button type="button" class="media-btn" data-attachment-edit-index="${index}"><span>수정</span></button></div>`
            : "";

        return `<div class="media-cell ${className}"><div class="media-cell-inner"><div class="media-img-container">${background}${mediaMarkup}</div>${editButton}<button type="button" class="media-btn-delete" data-attachment-remove-index="${index}" aria-label="첨부 삭제"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg></button></div></div>`;
    }

    function buildAttachmentLayout() {
        if (attachedFiles.length === 0) {
            return "";
        }
        if (attachedFiles.length === 1) {
            return `<div class="media-aspect-ratio media-aspect-ratio--single"><div class="media-absolute-layer">${buildAttachmentCell(attachedFiles[0], 0, "media-cell--single")}</div></div>`;
        }
        if (attachedFiles.length === 2) {
            return `<div class="media-aspect-ratio"><div class="media-absolute-layer"><div class="media-row">${buildAttachmentCell(attachedFiles[0], 0, "media-cell--left")}${buildAttachmentCell(attachedFiles[1], 1, "media-cell--right")}</div></div></div>`;
        }
        if (attachedFiles.length === 3) {
            return `<div class="media-aspect-ratio"><div class="media-absolute-layer"><div class="media-row">${buildAttachmentCell(attachedFiles[0], 0, "media-cell--left-tall")}<div class="media-col">${buildAttachmentCell(attachedFiles[1], 1, "media-cell--right-top")}${buildAttachmentCell(attachedFiles[2], 2, "media-cell--right-bottom")}</div></div></div></div>`;
        }
        return `<div class="media-aspect-ratio"><div class="media-absolute-layer"><div class="media-row"><div class="media-col">${buildAttachmentCell(attachedFiles[0], 0, "media-cell--top-left")}${buildAttachmentCell(attachedFiles[2], 2, "media-cell--bottom-left")}</div><div class="media-col">${buildAttachmentCell(attachedFiles[1], 1, "media-cell--top-right")}${buildAttachmentCell(attachedFiles[3], 3, "media-cell--bottom-right")}</div></div></div></div>`;
    }

    function isImageSet() {
        return attachedFiles.some((file) => file.type.startsWith("image/"));
    }

    function syncUserTagTrigger() {
        const canTag = isImageSet();
        if (userTagTrigger) {
            userTagTrigger.hidden = !canTag;
            userTagTrigger.disabled = !canTag;
        }
        if (userTagLabel) {
            userTagLabel.textContent =
                selectedTaggedUsers.length === 0
                    ? "사용자 태그하기"
                    : selectedTaggedUsers.map((user) => user.name).join(", ");
        }
        if (!canTag && tagView && !tagView.hidden) {
            closeTagPanel();
        }
    }

    function syncMediaAltTrigger() {
        const canEditAlt = isImageSet();
        if (mediaAltTrigger) {
            mediaAltTrigger.hidden = !canEditAlt;
            mediaAltTrigger.disabled = !canEditAlt;
        }
        if (mediaAltLabel) {
            mediaAltLabel.textContent = mediaEdits.some(
                (edit) => edit.alt.trim().length > 0,
            )
                ? "설명 수정"
                : "설명 추가";
        }
        if (!canEditAlt && mediaView && !mediaView.hidden) {
            closeMediaEditor({discardChanges: true});
        }
    }

    function syncMediaEditsToAttachments() {
        if (!isImageSet()) {
            mediaEdits = [];
            pendingMediaEdits = [];
            activeMediaIndex = 0;
            syncMediaAltTrigger();
            return;
        }
        mediaEdits = attachedFiles.map(
            (_, index) => mediaEdits[index] ?? {alt: ""},
        );
        if (pendingMediaEdits.length !== mediaEdits.length) {
            pendingMediaEdits = mediaEdits.map((edit) => ({alt: edit.alt}));
        }
        activeMediaIndex = Math.min(
            activeMediaIndex,
            Math.max(mediaEdits.length - 1, 0),
        );
        syncMediaAltTrigger();
    }

    function renderAttachments() {
        if (!attachmentPreview || !attachmentMedia) {
            return;
        }
        attachmentPreview.hidden = attachedFiles.length === 0;
        attachmentMedia.innerHTML = buildAttachmentLayout();
        attachmentMetaButtons.forEach((button) => {
            button.hidden = attachedFiles.length === 0;
        });
        syncMediaEditsToAttachments();
        syncUserTagTrigger();
        syncState();
    }

    function setAttachments(files) {
        attachedFiles = files.slice(0, maxAttachments);
        revokeAttachmentPreviewUrls();
        attachmentPreviewUrls = attachedFiles.map((file) =>
            URL.createObjectURL(file),
        );
        renderAttachments();
    }

    function getPageUsers() {
        const seen = new Set();
        return Array.from(document.querySelectorAll("[data-post-card]"))
            .map((card, index) => {
                const name = card.querySelector(".postName")?.textContent?.trim();
                const handle = card.querySelector(".postHandle")?.textContent?.trim();
                const avatarMarkup =
                    card.querySelector(".post-detail-avatar")?.innerHTML ?? "";
                if (!name || !handle || seen.has(handle)) {
                    return null;
                }
                seen.add(handle);
                return {
                    id: `${handle.replace("@", "")}-${index}`,
                    name,
                    handle,
                    avatarMarkup,
                };
            })
            .filter(Boolean);
    }

    function renderTagChipList() {
        if (!tagChipList) {
            return;
        }
        tagChipList.innerHTML = pendingTaggedUsers
            .map(
                (user) =>
                    `<button type="button" class="tweet-modal__tag-chip" data-tag-remove-id="${escapeAttachmentText(user.id)}"><span class="tweet-modal__tag-chip-avatar">${user.avatarMarkup ?? ""}</span><span class="tweet-modal__tag-chip-name">${escapeAttachmentText(user.name)}</span><svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__tag-chip-icon"><g><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></button>`,
            )
            .join("");
    }

    function renderTagResults(users) {
        if (!tagResults) {
            return;
        }
        currentTagResults = users;
        if (!tagSearchInput?.value.trim()) {
            tagResults.innerHTML = "";
            return;
        }
        if (users.length === 0) {
            tagResults.innerHTML =
                '<p class="tweet-modal__tag-empty">일치하는 사용자를 찾지 못했습니다.</p>';
            return;
        }
        tagResults.innerHTML = users
            .map((user) => {
                const isSelected = pendingTaggedUsers.some(
                    (target) => target.id === user.id,
                );
                return `<div role="option" class="tweet-modal__tag-option"><div role="checkbox" aria-checked="${isSelected}" aria-disabled="${isSelected}" class="tweet-modal__tag-checkbox"><button type="button" class="tweet-modal__tag-user" data-tag-user-id="${escapeAttachmentText(user.id)}" ${isSelected ? "disabled" : ""}><span class="tweet-modal__tag-avatar">${user.avatarMarkup ?? ""}</span><span class="tweet-modal__tag-user-body"><span class="tweet-modal__tag-user-name">${escapeAttachmentText(user.name)}</span><span class="tweet-modal__tag-user-handle">${escapeAttachmentText(user.handle)}${isSelected ? " 이미 태그됨" : ""}</span></span></button></div></div>`;
            })
            .join("");
    }

    function runTagSearch() {
        const term = tagSearchInput?.value.trim().toLowerCase() ?? "";
        renderTagResults(
            term
                ? getPageUsers()
                    .filter((user) =>
                        `${user.name} ${user.handle}`
                            .toLowerCase()
                            .includes(term),
                    )
                    .slice(0, 6)
                : [],
        );
    }

    function openTagPanel() {
        if (!tagView || !isImageSet()) {
            return;
        }
        closeLocationPanel();
        closeProductPanel();
        closeMediaEditor({discardChanges: true});
        pendingTaggedUsers = selectedTaggedUsers.map((user) => ({...user}));
        if (tagSearchInput) {
            tagSearchInput.value = "";
        }
        renderTagChipList();
        renderTagResults([]);
        tagView.hidden = false;
        window.requestAnimationFrame(() => tagSearchInput?.focus());
    }

    function closeTagPanel() {
        if (!tagView) {
            return;
        }
        tagView.hidden = true;
        pendingTaggedUsers = selectedTaggedUsers.map((user) => ({...user}));
        if (tagSearchInput) {
            tagSearchInput.value = "";
        }
        renderTagChipList();
        renderTagResults([]);
    }

    function renderMediaEditor() {
        if (!mediaView || pendingMediaEdits.length === 0) {
            return;
        }
        const edit = pendingMediaEdits[activeMediaIndex] ?? {alt: ""};
        const url = attachmentPreviewUrls[activeMediaIndex] ?? "";
        if (mediaPrevButton) {
            mediaPrevButton.disabled = activeMediaIndex === 0;
        }
        if (mediaNextButton) {
            mediaNextButton.disabled =
                activeMediaIndex >= pendingMediaEdits.length - 1;
        }
        if (mediaPreviewImage) {
            mediaPreviewImage.src = url;
            mediaPreviewImage.alt = edit.alt;
        }
        if (mediaAltInput) {
            mediaAltInput.value = edit.alt;
        }
        if (mediaAltCount) {
            mediaAltCount.textContent = `${edit.alt.length} / ${maxMediaAltLength.toLocaleString()}`;
        }
    }

    function openMediaEditor() {
        if (!mediaView || !isImageSet()) {
            return;
        }
        closeLocationPanel();
        closeProductPanel();
        closeTagPanel();
        pendingMediaEdits = mediaEdits.map((edit) => ({alt: edit.alt}));
        activeMediaIndex = 0;
        mediaView.hidden = false;
        renderMediaEditor();
        window.requestAnimationFrame(() => mediaAltInput?.focus());
    }

    function closeMediaEditor({discardChanges = true} = {}) {
        if (!mediaView) {
            return;
        }
        if (discardChanges) {
            pendingMediaEdits = mediaEdits.map((edit) => ({alt: edit.alt}));
        }
        mediaView.hidden = true;
    }

    function saveMediaEdits() {
        mediaEdits = pendingMediaEdits.map((edit) => ({alt: edit.alt}));
        syncMediaAltTrigger();
        closeMediaEditor({discardChanges: false});
    }

    function formatDraftDate(date) {
        return new Intl.DateTimeFormat("ko-KR", {
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    }

    function buildDraftSnapshot() {
        return {
            id: `draft-${++draftSequence}`,
            context: contextButton?.textContent?.trim() ?? "",
            sourceName: sourceName?.textContent?.trim() ?? "",
            sourceHandle: sourceHandle?.textContent?.trim() ?? "",
            sourceTime: sourceTime?.textContent?.trim() ?? "",
            sourceText: sourceText?.textContent?.trim() ?? "",
            sourceAvatarClass: sourceAvatar?.className ?? "",
            sourceAvatarMarkup: sourceAvatar?.innerHTML ?? "",
            text: editor?.textContent ?? "",
            files: [...attachedFiles],
            location: selectedLocation,
            product: selectedProduct ? {...selectedProduct} : null,
            taggedUsers: selectedTaggedUsers.map((user) => ({...user})),
            mediaAlt: mediaEdits.map((edit) => ({alt: edit.alt})),
            savedAt: new Date(),
        };
    }

    function renderDraftList() {
        if (!draftList || !draftEmpty) {
            return;
        }
        draftEmpty.hidden = drafts.length !== 0;
        draftList.innerHTML = drafts
            .map(
                (draft) =>
                    `<button type="button" class="draft-panel__item" data-draft-id="${draft.id}" aria-pressed="false"><span class="draft-panel__checkbox" hidden></span><span class="draft-panel__avatar draft-panel__avatar--reply">${draft.sourceAvatarMarkup || "<span>답</span>"}</span><span class="draft-panel__item-body"><span class="draft-panel__meta">${escapeAttachmentText(draft.context || `${draft.sourceHandle}님에게 보내는 답글`)}</span><span class="draft-panel__text">${escapeAttachmentText(draft.text || "이미지 초안")}</span><span class="draft-panel__date">${escapeAttachmentText(formatDraftDate(draft.savedAt))}</span></span><span class="draft-panel__item-remove" data-draft-remove-id="${draft.id}" aria-label="초안 삭제"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></span></button>`,
            )
            .join("");
    }

    function openDraftPanel() {
        if (!composeView || !draftView) {
            return;
        }
        renderDraftList();
        composeView.hidden = true;
        draftView.hidden = false;
    }

    function closeDraftPanel() {
        if (!composeView || !draftView) {
            return;
        }
        draftView.hidden = true;
        composeView.hidden = false;
    }

    function saveDraftAndOpenPanel() {
        if (
            editor?.textContent?.trim() ||
            attachedFiles.length > 0 ||
            selectedTaggedUsers.length > 0
        ) {
            drafts.unshift(buildDraftSnapshot());
        }
        openDraftPanel();
    }

    function loadDraft(draftId) {
        const draft = drafts.find((item) => item.id === draftId);
        if (!draft || !editor) {
            return;
        }
        editor.textContent = draft.text;
        selectedTaggedUsers = draft.taggedUsers.map((user) => ({...user}));
        pendingTaggedUsers = selectedTaggedUsers.map((user) => ({...user}));
        selectedLocation = draft.location ?? null;
        pendingLocation = selectedLocation;
        selectedProduct = draft.product ? {...draft.product} : null;
        mediaEdits = draft.mediaAlt.map((edit) => ({alt: edit.alt}));
        pendingMediaEdits = mediaEdits.map((edit) => ({alt: edit.alt}));
        setAttachments(draft.files);
        if (sourceAvatar) {
            sourceAvatar.className =
                draft.sourceAvatarClass || sourceAvatar.className;
            sourceAvatar.innerHTML = draft.sourceAvatarMarkup;
        }
        if (contextButton) {
            contextButton.textContent = draft.context;
            contextButton.hidden = !draft.context;
        }
        if (sourceName) {
            sourceName.textContent = draft.sourceName;
        }
        if (sourceHandle) {
            sourceHandle.textContent = draft.sourceHandle;
        }
        if (sourceTime) {
            sourceTime.textContent = draft.sourceTime;
        }
        if (sourceText) {
            sourceText.textContent = draft.sourceText;
        }
        syncLocationUI();
        syncSelectedProductCard();
        syncProductListSelection();
        syncUserTagTrigger();
        syncMediaAltTrigger();
        syncState();
        closeDraftPanel();
        window.requestAnimationFrame(() => editor.focus());
    }

    function resetComposerState() {
        if (editor) {
            editor.textContent = "";
        }
        pendingAttachmentEditIndex = null;
        selectedLocation = null;
        pendingLocation = null;
        selectedProduct = null;
        selectedTaggedUsers = [];
        pendingTaggedUsers = [];
        mediaEdits = [];
        pendingMediaEdits = [];
        activeMediaIndex = 0;
        setAttachments([]);
        if (fileInput) {
            fileInput.value = "";
        }
        closeLocationPanel();
        closeProductPanel();
        closeTagPanel();
        closeMediaEditor({discardChanges: true});
        closeDraftPanel();
        syncLocationUI();
        syncSelectedProductCard();
        syncProductListSelection();
        syncUserTagTrigger();
        syncMediaAltTrigger();
        syncState();
    }

    // Spring 서버에서 렌더링한 댓글/답글 카드 메타 정보를 모달 상단에 주입한다.
    function populate(card) {
        const name = card.querySelector(".postName")?.textContent?.trim() ?? "";
        const handle = card.querySelector(".postHandle")?.textContent?.trim() ?? "";
        const spans = Array.from(
            card.querySelectorAll(".post-detail-reply-identity > span"),
        );
        const time = spans[spans.length - 1]?.textContent?.trim() ?? "";
        const text = card.querySelector(".post-detail-reply-text")?.textContent?.trim() ?? "";
        const cardAvatar = card.querySelector(".post-detail-avatar");

        if (contextButton) {
            contextButton.textContent = handle
                ? `${handle}님에게 보내는 답글`
                : `${name}님에게 보내는 답글`;
            contextButton.hidden = false;
        }
        if (sourceAvatar && cardAvatar) {
            sourceAvatar.className = cardAvatar.className;
            sourceAvatar.setAttribute("data-reply-source-avatar", "");
            sourceAvatar.innerHTML = cardAvatar.innerHTML;
        }
        if (sourceInitial && !cardAvatar) {
            sourceInitial.textContent = name.charAt(0) || "?";
        }
        if (sourceName) {
            sourceName.textContent = name;
        }
        if (sourceHandle) {
            sourceHandle.textContent = handle;
        }
        if (sourceTime) {
            sourceTime.textContent = time;
        }
        if (sourceText) {
            sourceText.textContent = text;
        }
    }

    function open(btn) {
        const card = btn.closest(".post-detail-reply-card");
        if (!card) return;
        resetComposerState();
        populate(card);
        overlay.hidden = false;
        document.body.classList.add("modal-open");
        syncLocationUI();
        syncSelectedProductCard();
        syncProductListSelection();
        syncState();
        requestAnimationFrame(() => editor?.focus());
    }

    function close() {
        overlay.hidden = true;
        document.body.classList.remove("modal-open");
        if (emojiPicker?.pickerVisible) emojiPicker.hidePicker();
        resetComposerState();
    }

    document
        .querySelectorAll(".post-detail-reply-card [data-testid='reply']")
        .forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                open(button);
            });
        });

    closeButton?.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            close();
        }
    });

    editor?.addEventListener("input", () => {
        if (editor && !editor.textContent.trim()) {
            editor.innerHTML = "";
        }
        syncState();
    });
    editor?.addEventListener("keydown", (event) => {
        if (
            (!event.ctrlKey && !event.metaKey) ||
            (event.key !== "b" && event.key !== "i")
        ) {
            return;
        }
        event.preventDefault();
        document.execCommand(event.key === "b" ? "bold" : "italic");
    });

    formatButtons.forEach((button) => {
        button.addEventListener("mousedown", (event) => event.preventDefault());
        button.addEventListener("click", () => {
            editor?.focus();
            const format = button.getAttribute("data-format");
            if (format) {
                document.execCommand(format);
            }
        });
    });

    mediaUploadButton?.addEventListener("click", (event) => {
        event.preventDefault();
        closeLocationPanel();
        closeProductPanel();
        if (fileInput) {
            fileInput.value = "";
            fileInput.click();
        }
    });

    emojiButton?.addEventListener("click", (event) => {
        event.preventDefault();
        if (!editor || typeof window.EmojiButton !== "function") return;
        closeLocationPanel();
        closeProductPanel();
        closeTagPanel();
        closeMediaEditor({discardChanges: true});
        if (!emojiPicker) {
            emojiPicker = new window.EmojiButton({
                position: "bottom-start",
                zIndex: 9999,
            });
            emojiPicker.on("emoji", (sel) => {
                const emoji = typeof sel === "string" ? sel : sel?.emoji;
                if (!emoji || !editor) return;
                editor.focus();
                const s = window.getSelection();
                if (s?.rangeCount) {
                    const r = s.getRangeAt(0);
                    r.deleteContents();
                    r.insertNode(document.createTextNode(emoji));
                    r.collapse(false);
                } else {
                    editor.append(document.createTextNode(emoji));
                }
                syncState();
            });
            emojiPicker.on("hidden", () =>
                emojiButton?.setAttribute("aria-expanded", "false"),
            );
        }
        if (emojiPicker.pickerVisible) {
            emojiPicker.hidePicker();
        } else {
            event.currentTarget.setAttribute("aria-expanded", "true");
            emojiPicker.showPicker(event.currentTarget);
        }
    });

    fileInput?.addEventListener("change", (event) => {
        const nextFiles = Array.from(event.target.files ?? []);
        if (nextFiles.length === 0) {
            pendingAttachmentEditIndex = null;
            return;
        }
        if (pendingAttachmentEditIndex !== null) {
            const replacement = nextFiles[0];
            if (replacement?.type.startsWith("image/")) {
                const editedFiles = [...attachedFiles];
                editedFiles[pendingAttachmentEditIndex] = replacement;
                setAttachments(editedFiles);
            }
            pendingAttachmentEditIndex = null;
            fileInput.value = "";
            return;
        }
        setAttachments(
            [...attachedFiles, ...nextFiles].filter(
                (file) =>
                    file.type.startsWith("image/") ||
                    file.type.startsWith("video/"),
            ),
        );
        fileInput.value = "";
    });

    attachmentMedia?.addEventListener("click", (event) => {
        const editButton = event.target.closest("[data-attachment-edit-index]");
        if (editButton) {
            pendingAttachmentEditIndex = Number.parseInt(
                editButton.getAttribute("data-attachment-edit-index") ?? "-1",
                10,
            );
            if (fileInput) {
                fileInput.value = "";
                fileInput.click();
            }
            return;
        }

        const removeButton = event.target.closest(
            "[data-attachment-remove-index]",
        );
        const index = Number.parseInt(
            removeButton?.getAttribute("data-attachment-remove-index") ?? "-1",
            10,
        );
        if (index < 0) {
            return;
        }
        setAttachments(
            attachedFiles.filter((_, fileIndex) => fileIndex !== index),
        );
    });

    geoButton?.addEventListener("click", (event) => {
        event.preventDefault();
        openLocationPanel();
    });
    locationDisplay?.addEventListener("click", (event) => {
        event.preventDefault();
        openLocationPanel();
    });
    locationSearchInput?.addEventListener("input", () => {
        renderLocationList();
    });
    locationList?.addEventListener("click", (event) => {
        const item = event.target.closest(".tweet-modal__location-item");
        const location = item
            ?.querySelector(".tweet-modal__location-item-label")
            ?.textContent?.trim();
        if (!location) {
            return;
        }
        pendingLocation = location;
        renderLocationList();
        syncLocationUI();
    });
    locationCloseButton?.addEventListener("click", () => {
        closeLocationPanel();
    });
    locationDeleteButton?.addEventListener("click", () => {
        selectedLocation = null;
        pendingLocation = null;
        closeLocationPanel({resetPending: false});
    });
    locationCompleteButton?.addEventListener("click", () => {
        selectedLocation = pendingLocation;
        closeLocationPanel({resetPending: false});
        syncLocationUI();
    });

    productButton?.addEventListener("click", (event) => {
        event.preventDefault();
        openProductPanel();
    });
    productSelectClose?.addEventListener("click", () => {
        closeProductPanel();
    });
    productSelectList?.addEventListener("click", (event) => {
        const item = event.target.closest(".draft-panel__item");
        if (!item) {
            return;
        }
        const isSameItem = selectedProduct?.id === (item.dataset.productId ?? "");
        selectedProduct = isSameItem
            ? null
            : {
                id: item.dataset.productId ?? "",
                name: item.dataset.productName ?? "",
                price: item.dataset.productPrice ?? "",
                image: item.dataset.productImage ?? "",
            };
        syncSelectedProductCard();
        syncProductListSelection();
    });
    productSelectComplete?.addEventListener("click", () => {
        if (!selectedProduct) {
            return;
        }
        syncSelectedProductCard();
        closeProductPanel();
    });
    selectedProductCard
        ?.querySelector("[data-product-remove]")
        ?.addEventListener("click", () => {
            selectedProduct = null;
            syncSelectedProductCard();
            syncProductListSelection();
        });

    draftButton?.addEventListener("click", (event) => {
        event.preventDefault();
        saveDraftAndOpenPanel();
    });
    draftBackButton?.addEventListener("click", (event) => {
        event.preventDefault();
        closeDraftPanel();
    });
    draftList?.addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-draft-remove-id]");
        if (removeButton) {
            const draftId = removeButton.getAttribute("data-draft-remove-id");
            const draftIndex = drafts.findIndex((draft) => draft.id === draftId);
            if (draftIndex >= 0) {
                drafts.splice(draftIndex, 1);
                renderDraftList();
            }
            return;
        }

        const draftItem = event.target.closest("[data-draft-id]");
        const draftId = draftItem?.getAttribute("data-draft-id");
        if (draftId) {
            loadDraft(draftId);
        }
    });

    userTagTrigger?.addEventListener("click", (event) => {
        event.preventDefault();
        openTagPanel();
    });
    tagSearchForm?.addEventListener("submit", (event) => event.preventDefault());
    tagSearchInput?.addEventListener("input", () => runTagSearch());
    tagCloseButton?.addEventListener("click", () => closeTagPanel());
    tagCompleteButton?.addEventListener("click", () => {
        selectedTaggedUsers = pendingTaggedUsers.map((user) => ({...user}));
        syncUserTagTrigger();
        closeTagPanel();
    });
    tagChipList?.addEventListener("click", (event) => {
        const chip = event.target.closest("[data-tag-remove-id]");
        if (!chip) {
            return;
        }
        const userId = chip.getAttribute("data-tag-remove-id");
        pendingTaggedUsers = pendingTaggedUsers.filter(
            (user) => user.id !== userId,
        );
        renderTagChipList();
        runTagSearch();
        tagSearchInput?.focus();
    });
    tagResults?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-tag-user-id]");
        if (!button || button.hasAttribute("disabled")) {
            return;
        }
        const userId = button.getAttribute("data-tag-user-id");
        const user = currentTagResults.find((item) => item.id === userId);
        if (!user) {
            return;
        }
        pendingTaggedUsers = [...pendingTaggedUsers, {...user}];
        renderTagChipList();
        if (tagSearchInput) {
            tagSearchInput.value = "";
        }
        renderTagResults([]);
    });

    mediaAltTrigger?.addEventListener("click", (event) => {
        event.preventDefault();
        openMediaEditor();
    });
    mediaBackButton?.addEventListener("click", () =>
        closeMediaEditor({discardChanges: true}),
    );
    mediaSaveButton?.addEventListener("click", () => saveMediaEdits());
    mediaPrevButton?.addEventListener("click", () => {
        if (activeMediaIndex === 0) {
            return;
        }
        activeMediaIndex -= 1;
        renderMediaEditor();
    });
    mediaNextButton?.addEventListener("click", () => {
        if (activeMediaIndex >= pendingMediaEdits.length - 1) {
            return;
        }
        activeMediaIndex += 1;
        renderMediaEditor();
    });
    mediaAltInput?.addEventListener("input", () => {
        const edit = pendingMediaEdits[activeMediaIndex];
        if (!edit) {
            return;
        }
        edit.alt = mediaAltInput.value.slice(0, maxMediaAltLength);
        renderMediaEditor();
    });

    submitBtn?.addEventListener("click", () => {
        if (!submitBtn.disabled) {
            close();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !overlay.hidden) {
            close();
        }
    });
    window.addEventListener("beforeunload", revokeAttachmentPreviewUrls);
}
