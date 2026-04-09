// inquiry_active_list 페이지 전체 상호작용 스크립트
// 탭 전환, 기간 필터, 게시물 카드 액션, 댓글/공유/신고/차단,
// 위치, 태그, 미디어, 이모지, 임시저장, 상품선택 패널을 함께 다룹니다.
// 위치, 태그, 미디어, 이모지, 임시저장, 상품선택 패널을 함께 다룹니다.
window.onload = () => {

    // DOM 참조 모음

    // 탭, 패널, 기간 필터처럼 상단 고정 UI 참조
    // 탭, 패널, 기간 필터처럼 상단 고정 UI 참조
    const tabButtons = Array.from(
        document.querySelectorAll("[data-inquiry-tab]"),
    );
    const panels = Array.from(
        document.querySelectorAll("[data-inquiry-panel]"),
    );
    const periodChips = Array.from(
        document.querySelectorAll("[data-period-chip]"),
    );
    const filterTrigger = document.querySelector(
        "[data-activity-filter-trigger]",
    );
    const filterMenu = document.querySelector("[data-activity-filter-menu]");
    const filterLabel = document.querySelector("[data-activity-filter-label]");
    const filterItems = Array.from(
        document.querySelectorAll("[data-activity-filter-item]"),
    );

    // 댓글 모달과 그 안의 주요 요소 참조
    // 댓글 모달과 그 안의 주요 요소 참조
    // 모달은 HTML에 이미 존재하며 hidden 상태를 열고 닫는 방식으로 제어합니다.
    const replyModalOverlay = document.querySelector("[data-reply-modal]");
    const replyModal = replyModalOverlay?.querySelector(".tweet-modal");
    const replyCloseButton = replyModalOverlay?.querySelector(
        ".tweet-modal__close",
    );
    const replyEditor = replyModalOverlay?.querySelector("[data-reply-editor]");
    const replySubmitButton = replyModalOverlay?.querySelector(
        "[data-reply-submit]",
    );
    const replySourceAvatar = replyModalOverlay?.querySelector(
        "[data-reply-source-avatar]",
    );
    const replyAvatar = replyModalOverlay?.querySelector("[data-reply-avatar]");
    const replySourceName = replyModalOverlay?.querySelector(
        "[data-reply-source-name]",
    );
    const replySourceHandle = replyModalOverlay?.querySelector(
        "[data-reply-source-handle]",
    );
    const replySourceTime = replyModalOverlay?.querySelector(
        "[data-reply-source-time]",
    );
    const replySourceText = replyModalOverlay?.querySelector(
        "[data-reply-source-text]",
    );

    // 댓글 모달 글자 수 게이지
    const replyGauge = replyModalOverlay?.querySelector("[data-reply-gauge]");
    const replyGaugeText = replyModalOverlay?.querySelector("[data-reply-gauge-text]");
    // 댓글 모달 첨부 버튼
    const replyMediaUploadButton = replyModalOverlay?.querySelector("[data-testid='mediaUploadButton']");
    const replyFileInput = replyModalOverlay?.querySelector("[data-testid='fileInput']");
    // 서식 버튼 목록
    const replyFormatButtons = replyModalOverlay?.querySelectorAll("[data-format]") ?? [];
    // 이모지 피커 관련 요소
    const replyEmojiButton = replyModalOverlay?.querySelector("[data-testid='emojiButton']");
    const replyEmojiPicker = replyModalOverlay?.querySelector(".tweet-modal__emoji-picker");
    const replyEmojiSearchInput = replyModalOverlay?.querySelector("[data-testid='emojiSearchInput']");
    const replyEmojiTabs = replyModalOverlay?.querySelectorAll(".tweet-modal__emoji-tab") ?? [];
    const replyEmojiContent = replyModalOverlay?.querySelector("[data-testid='emojiPickerContent']");
    // 첨부파일 미리보기 영역
    const replyAttachmentPreview = replyModalOverlay?.querySelector("[data-attachment-preview]");
    const replyAttachmentMedia = replyModalOverlay?.querySelector("[data-attachment-media]");
    // 댓글 모달 내부 보조 뷰 참조
    // 작성 뷰 래퍼
    const composeView = replyModalOverlay?.querySelector(".tweet-modal__compose-view");
    // 위치 선택 뷰
    const replyGeoButton = replyModalOverlay?.querySelector("[data-testid='geoButton']");
    const replyGeoButtonPath = replyGeoButton?.querySelector("path");
    const replyLocationView = replyModalOverlay?.querySelector(".tweet-modal__location-view");
    const replyLocationCloseButton = replyLocationView?.querySelector(".tweet-modal__location-close");
    const replyLocationDeleteButton = replyLocationView?.querySelector("[data-location-delete]");
    const replyLocationCompleteButton = replyLocationView?.querySelector("[data-location-complete]");
    const replyLocationSearchInput = replyLocationView?.querySelector("[data-location-search]");
    const replyLocationList = replyLocationView?.querySelector("[data-location-list]");
    const replyLocationDisplayButton = replyModalOverlay?.querySelector("[data-location-display]");
    const replyLocationName = replyModalOverlay?.querySelector("[data-location-name]");
    const replyFooterMeta = replyModalOverlay?.querySelector(".tweet-modal__footer-meta");
    // 상품 선택 버튼
    const replyProductButton = replyModalOverlay?.querySelector("[data-testid='productSelectButton']");
    // 상품 선택 뷰
    const replyProductView = replyModalOverlay?.querySelector("[data-product-select-modal]");
    const productSelectClose = replyProductView?.querySelector("[data-product-select-close]");
    const productSelectList = replyProductView?.querySelector("[data-product-select-list]");
    const productSelectComplete = replyProductView?.querySelector("[data-product-select-complete]");
    const productSelectEmpty = replyProductView?.querySelector("[data-product-empty]");

    // 댓글 대상 게시물 컨텍스트 버튼
    const replyContextButton = replyModalOverlay?.querySelector(".tweet-modal__context-button");

    // 사용자 태그 뷰
    const replyUserTagTrigger = replyModalOverlay?.querySelector("[data-user-tag-trigger]");
    const replyUserTagLabel = replyModalOverlay?.querySelector("[data-user-tag-label]");
    const replyTagView = replyModalOverlay?.querySelector(".tweet-modal__tag-view");
    const replyTagCloseButton = replyModalOverlay?.querySelector("[data-testid='tag-back']");
    const replyTagCompleteButton = replyModalOverlay?.querySelector("[data-tag-complete]");
    const replyTagSearchForm = replyModalOverlay?.querySelector("[data-tag-search-form]");
    const replyTagSearchInput = replyModalOverlay?.querySelector("[data-tag-search]");
    const replyTagChipList = replyModalOverlay?.querySelector("[data-tag-chip-list]");
    const replyTagResults = replyModalOverlay?.querySelector("[data-tag-results]");
    // 미디어 설명(ALT) 편집 뷰
    const replyMediaAltTrigger = replyModalOverlay?.querySelector("[data-media-alt-trigger]");
    const replyMediaAltLabel = replyModalOverlay?.querySelector("[data-media-alt-label]");
    const replyMediaView = replyModalOverlay?.querySelector(".tweet-modal__media-view");
    const replyMediaBackButton = replyModalOverlay?.querySelector("[data-testid='media-back']");
    const replyMediaPrevButton = replyModalOverlay?.querySelector("[data-media-prev]");
    const replyMediaNextButton = replyModalOverlay?.querySelector("[data-media-next]");
    const replyMediaSaveButton = replyModalOverlay?.querySelector("[data-media-save]");
    const replyMediaTitle = replyModalOverlay?.querySelector("[data-media-title]");
    const replyMediaPreviewImages = replyModalOverlay?.querySelectorAll("[data-media-preview-image]") ?? [];
    const replyMediaAltInput = replyModalOverlay?.querySelector("[data-media-alt-input]");
    const replyMediaAltCount = replyModalOverlay?.querySelector("[data-media-alt-count]");

    // --- ?듦? 紐⑤떖 ?꾩떆???Draft) ?쒕툕酉??붿냼 李몄“ ---
    // ?듦? 紐⑤떖 ?대? 珥덉븞 ?쒕툕酉?(.tweet-modal__draft-view)
    const draftView = replyModalOverlay?.querySelector(".tweet-modal__draft-view");
    // ?꾩떆????⑤꼸 ?닿린 踰꾪듉
    const draftButton = replyModalOverlay?.querySelector(".tweet-modal__draft");
    // ?꾩떆????⑤꼸 ?ㅻ줈媛湲?踰꾪듉
    const draftBackButton = draftView?.querySelector(".draft-panel__back");
    // ?꾩떆????⑤꼸 ?섏젙/?꾨즺 ?좉? 踰꾪듉
    const draftActionButton = draftView?.querySelector(".draft-panel__action");
    // ?꾩떆???紐⑸줉 而⑦뀒?대꼫
    const draftList = draftView?.querySelector(".draft-panel__list");
    // ?꾩떆???鍮꾩뼱?덉쓬 ?덈궡 ?곸뿭
    const draftEmpty = draftView?.querySelector(".draft-panel__empty");
    // ?꾩떆???鍮꾩뼱?덉쓬 ?쒕ぉ
    const draftEmptyTitle = draftView?.querySelector(
        ".draft-panel__empty-title",
    );
    // ?꾩떆???鍮꾩뼱?덉쓬 ?ㅻ챸
    const draftEmptyBody = draftView?.querySelector(".draft-panel__empty-body");
    // ?꾩떆????몄쭛 紐⑤뱶 ?섎떒 ?곸뿭
    const draftFooter = draftView?.querySelector(".draft-panel__footer");
    // ?꾩떆????꾩껜 ?좏깮/?댁젣 踰꾪듉
    const draftSelectAllButton = draftView?.querySelector(
        ".draft-panel__select-all",
    );
    // ?꾩떆????좏깮 ??ぉ ??젣 踰꾪듉
    const draftDeleteButton = draftView?.querySelector(
        ".draft-panel__footer-delete",
    );
    // ?꾩떆?????젣 ?뺤씤 ?ㅻ쾭?덉씠
    const draftConfirmOverlay = draftView?.querySelector(
        ".draft-panel__confirm-overlay",
    );
    // ?꾩떆?????젣 ?뺤씤 諛곌꼍
    const draftConfirmBackdrop = draftView?.querySelector(
        ".draft-panel__confirm-backdrop",
    );
    // ?꾩떆?????젣 ?뺤씤 ?쒕ぉ
    const draftConfirmTitle = draftView?.querySelector(
        ".draft-panel__confirm-title",
    );
    // ?꾩떆?????젣 ?뺤씤 ?ㅻ챸
    const draftConfirmDesc = draftView?.querySelector(
        ".draft-panel__confirm-desc",
    );
    // ?꾩떆?????젣 ?뺤씤????젣 踰꾪듉
    const draftConfirmDeleteButton = draftView?.querySelector(
        ".draft-panel__confirm-primary",
    );
    // ?꾩떆?????젣 ?뺤씤??痍⑥냼 踰꾪듉
    const draftConfirmCancelButton = draftView?.querySelector(
        ".draft-panel__confirm-secondary",
    );

    // --- ?숈쟻 ?덉씠??留덉슫??吏??---
    // 怨듭쑀 ?쒕∼?ㅼ슫怨??붾낫湲??쒕∼?ㅼ슫? HTML??#layers 猷⑦듃???숈쟻?쇰줈 異붽??쒕떎.
    // appendChild濡?異붽??섍퀬, ?レ쓣 ??remove()濡?DOM?먯꽌 ?쒓굅?쒕떎.
    const layersRoot = document.getElementById("layers");

    // ===== ?곹깭 蹂???뱀뀡 =====

    // --- ?곸닔 ---
    // ??誘몃━蹂닿린 ?좊땲硫붿씠???쒓컙怨?寃뚯떆臾?蹂몃Ц 異뺤빟 湲곗? 湲몄씠??
    const PREVIEW_DURATION_MS = 280;
    const MAX_POST_TEXT_LENGTH = 140;
    // ?듦? 理쒕? 湲?먯닔 (main 寃뚯떆?섍린? ?숈씪)
    const REPLY_MAX_LENGTH = 500;

    // --- ?쒖꽦 UI 異붿쟻 ?곹깭 ---
    // ?꾩옱 ?대젮 ?덈뒗 UI? 留덉?留됱쑝濡??뚮┛ ?몃━嫄곕? 異붿쟻?댁꽌 以묐났 ?ㅽ뵂怨?蹂듦? ?ъ빱?ㅻ? 愿由ы븳??
    let activeReplyTrigger = null;
    let activeShareDropdown = null;
    let activeShareButton = null;
    let activeShareModal = null;
    let activePostMoreMenu = null;
    let activePostMoreButton = null;
    // ?붾낫湲??쒕∼?ㅼ슫(?숈쟻 #layers) 諛?李⑤떒/?좉퀬 紐⑤떖 ?곹깭
    let activeMoreDropdown = null;
    let activeMoreButton = null;
    let activeNotificationModal = null;
    let activeNotificationToast = null;
    // ?ъ슜?먮퀎 ?붾줈???곹깭瑜???ν븯??Map
    const followState = new Map();
    // --- ?듦? ?먮뵒???쒖떇/?좏깮/?대え吏/泥⑤? ?곹깭 ---
    let pendingReplyFormats = new Set();
    let savedReplySelection = null;
    let savedReplySelectionOffsets = null;
    let isInsertingReplyEmoji = false;
    let shouldRestoreReplyEditorAfterEmojiInsert = false;
    let replyEmojiLibraryPicker = null;
    let attachedReplyFiles = [];
    let attachedReplyFileUrls = [];
    let pendingAttachmentEditIndex = null;
    let selectedProduct = null;
    let selectedLocation = null;
    let pendingLocation = null;
    const cachedLocationNames = ["대한민국 서초구", "대한민국 강남구", "대한민국 송파구", "대한민국 광진구", "대한민국 동작구", "대한민국 중구"];
    const maxReplyImages = 4;
    const maxReplyMediaAltLength = 1000;
    let activeEmojiCategory = "recent";
    // 태그 / 미디어 ALT 편집 상태
    let selectedTaggedUsers = [];
    let pendingTaggedUsers = [];
    let replyMediaEdits = [];
    let pendingReplyMediaEdits = [];
    let activeReplyMediaIndex = 0;
    let currentTagResults = [];
    // --- ?좉퀬 ?ъ쑀 紐⑸줉 (李⑤떒/?좉퀬 紐⑤떖?먯꽌 ?ъ슜) ---
    const reportReasons = [
        "?ㅻⅨ ?뚯궗 ?쒗뭹 ?꾩슜 ?좉퀬",
        "?ㅼ젣 議댁옱?섏? ?딅뒗 ?쒗뭹 ?깅줉 ?좉퀬",
        "?ㅽ럺쨌?먯궛吏 ?덉쐞 ?쒓린 ?좉퀬",
        "?뱁뿀 ?쒗뭹 臾대떒 ?먮ℓ ?좉퀬",
        "?섏텧???쒗븳 ?덈ぉ ?좉퀬",
        "諛섎났?곸씤 ?숈씪 寃뚯떆臾??좉퀬",
    ];

    // ===== 怨듯넻 ?좏떥由ы떚 ?⑥닔 ?뱀뀡 =====
    // DOM ?띿뒪?몃? ?뺣━?댁꽌 鍮꾧탳/?쒖떆???덉쟾??臾몄옄?대줈 留뚮뱺??
    const getTextContent = (element) =>
        element?.textContent?.replace(/\s+/g, " ").trim() ?? "";

    // ?숈쟻?쇰줈 innerHTML??留뚮뱾 ???ъ슜?섎뒗 理쒖냼 HTML ?댁뒪耳?댄봽 ?좏떥?대떎.
    const escapeHtml = (value) =>
        String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");

    // 기본 프로필 이미지가 없을 때 사용할 원형 아바타 SVG를 data URL로 만듭니다.
    const buildAvatarDataUrl = (label) => {
        const safeLabel = escapeHtml(String(label || "나").slice(0, 2));
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><rect width="72" height="72" rx="36" fill="#1d9bf0"></rect><text x="36" y="43" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" fill="#ffffff">${safeLabel}</text></svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    };

    // ?대깽?멸? 諛쒖깮??踰꾪듉 湲곗??쇰줈 媛??媛源뚯슫 寃뚯떆臾?移대뱶瑜?李얜뒗??
    const getPostCard = (element) => element?.closest(".postCard") ?? null;

    // 寃뚯떆臾?移대뱶?먯꽌 ?꾨줈???대?吏瑜??쎄퀬, ?놁쑝硫??앹꽦???꾨컮?瑜?諛섑솚?쒕떎.
    const getPostAvatarSrc = (postCard) => {
        const avatarImage = postCard?.querySelector(".postAvatarImage");
        return (
            avatarImage?.getAttribute("src") ||
            buildAvatarDataUrl(
                getTextContent(postCard?.querySelector(".postAvatar")),
            )
        );
    };

    // ===== ???쒖떆 ?쒖뼱 =====
    // inquiry_active_list??activity ?⑤꼸留??ㅼ젣 肄섑뀗痢좊? 蹂댁뿬 二쇰룄濡?怨좎젙?쒕떎.
    const ensureActivityPanelVisible = () => {
        panels.forEach((panel) => {
            panel.hidden = panel.dataset.inquiryPanel !== "activity";
        });
    };

    // ?좏깮????뿉留??쒖꽦 ?대옒?ㅼ? aria-selected瑜?諛섏쁺?쒕떎.
    const setActiveTabVisual = (tabName) => {
        tabButtons.forEach((tab) => {
            const isActive = tab.dataset.inquiryTab === tabName;
            tab.classList.toggle("inquiry-tab--active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
        });
    };

    // ?ㅼ젣 ?⑤꼸 ?대룞 ?놁씠 ??踰꾪듉?먮쭔 吏㏃? ?뚮┝ ?꾨━酉??좊땲硫붿씠?섏쓣 以??
    const togglePreviewState = (tab) => {
        tab.classList.remove("inquiry-tab--preview");
        void tab.offsetWidth;
        tab.classList.add("inquiry-tab--preview");
        window.setTimeout(() => {
            tab.classList.remove("inquiry-tab--preview");
        }, PREVIEW_DURATION_MS);
    };

    // ===== ?대┛ UI ?リ린 ?ы띁 ?뱀뀡 =====
    // ?꾪꽣 ?쒕∼?ㅼ슫???リ퀬 ?몃━嫄곗쓽 aria ?곹깭瑜??먮났?쒕떎.
    const closeFilterMenu = () => {
        if (!filterTrigger || !filterMenu) {
            return;
        }

        filterMenu.hidden = true;
        filterTrigger.setAttribute("aria-expanded", "false");
    };

    // (湲곗〈 ?뺤쟻 硫붾돱 ?リ린 ???섏쐞 ?명솚)
    const closePostMoreMenu = () => {
        if (!activePostMoreMenu) return;
        activePostMoreMenu.hidden = true;
        activePostMoreButton?.setAttribute("aria-expanded", "false");
        activePostMoreMenu = null;
        activePostMoreButton = null;
    };

    // ?붾낫湲??숈쟻 ?쒕∼?ㅼ슫(#layers)???ル뒗??
    // ?쒕∼?ㅼ슫? #layers???숈쟻?쇰줈 異붽???寃껋씠誘濡?remove()濡?DOM?먯꽌 ?꾩쟾???쒓굅?쒕떎.
    const closeMoreDropdown = () => {
        if (!activeMoreDropdown) return;
        activeMoreDropdown.remove();
        activeMoreDropdown = null;
        if (activeMoreButton) {
            activeMoreButton.setAttribute("aria-expanded", "false");
            activeMoreButton = null;
        }
    };

    // 李⑤떒/?좉퀬 紐⑤떖???ル뒗??
    // ??紐⑤떖? document.body???숈쟻?쇰줈 異붽???寃껋씠誘濡?remove()濡?DOM?먯꽌 ?꾩쟾???쒓굅?쒕떎.
    const closeNotificationModal = () => {
        if (!activeNotificationModal) return;
        activeNotificationModal.remove();
        activeNotificationModal = null;
        document.body.classList.remove("modal-open");
    };

    // ===== ?좎뒪???쒖떆 ?⑥닔 ?뱀뀡 =====
    // ?좎뒪??div瑜?document.body???숈쟻?쇰줈 異붽??섍퀬 3珥????먮룞?쇰줈 remove()?쒕떎.
    const showNotificationToast = (message) => {
        activeNotificationToast?.remove();
        const toast = document.createElement("div");
        toast.className = "notification-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.textContent = message;
        document.body.appendChild(toast);
        activeNotificationToast = toast;
        window.setTimeout(() => {
            if (activeNotificationToast === toast) activeNotificationToast = null;
            toast.remove();
        }, 3000);
    };

    // ===== ?붾낫湲??쒕∼?ㅼ슫 ?⑥닔 ?뱀뀡 =====
    // ?붾낫湲??쒕∼?ㅼ슫? #layers ?붿냼???숈쟻?쇰줈 ?앹꽦(appendChild)?섍퀬, ?レ쓣 ??remove()濡??쒓굅?쒕떎.
    // ?붾줈??李⑤떒/?좉퀬 硫붾돱 ??ぉ???ы븿?쒕떎.
    const getMoreDropdownItems = (button) => {
        const postCard = getPostCard(button);
        const handle = getTextContent(postCard?.querySelector(".postHandle")) || "@user";
        const isF = followState.get(handle) ?? false;
        return [
            {
                actionClass: "menu-item--follow-toggle",
                label: isF ? `${handle} 님 언팔로우하기` : `${handle} 님 팔로우하기`,
                icon: isF
                    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm12.586 3l-2.043-2.04 1.414-1.42L20 7.59l2.043-2.05 1.414 1.42L21.414 9l2.043 2.04-1.414 1.42L20 10.41l-2.043 2.05-1.414-1.42L18.586 9zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z"></path></g></svg>'
                    : '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm4 7c-3.053 0-5.563 1.193-7.443 3.596l1.548 1.207C5.573 15.922 7.541 15 10 15s4.427.922 5.895 2.803l1.548-1.207C15.563 14.193 13.053 13 10 13zm8-6V5h-3V3h-2v2h-3v2h3v3h2V7h3z"></path></g></svg>',
            },
            {
                actionClass: "menu-item--block",
                label: `${handle} 님 차단하기`,
                icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path></g></svg>',
            },
            {
                actionClass: "menu-item--report",
                label: "게시물 신고하기",
                icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"></path></g></svg>',
            },
        ];
    };

    // ===== 李⑤떒/?좉퀬 紐⑤떖 ?⑥닔 ?뱀뀡 =====
    // 李⑤떒/?좉퀬 紐⑤떖(.notification-dialog)? document.body???숈쟻?쇰줈 ?앹꽦(appendChild)?섍퀬,
    // ?レ쓣 ??closeNotificationModal()?먯꽌 remove()濡?DOM?먯꽌 ?꾩쟾???쒓굅?쒕떎.
    const openBlockModal = (button) => {
        const postCard = getPostCard(button);
        const handle = getTextContent(postCard?.querySelector(".postHandle")) || "@user";
        closeMoreDropdown();
        closeNotificationModal();
        const modal = document.createElement("div");
        modal.className = "notification-dialog notification-dialog--block";
        modal.innerHTML = `<div class="notification-dialog__backdrop"></div><div class="notification-dialog__card notification-dialog__card--small" role="alertdialog" aria-modal="true"><h2 class="notification-dialog__title">${escapeHtml(handle)} ?섏쓣 李⑤떒?좉퉴??</h2><p class="notification-dialog__description">??怨듦컻 寃뚯떆臾쇱쓣 蹂????덉?留????댁긽 寃뚯떆臾쇱뿉 李몄뿬?????놁뒿?덈떎. ?먰븳 ${escapeHtml(handle)} ?섏? ?섎? ?붾줈?고븯嫄곕굹 履쎌?瑜?蹂대궪 ???놁쑝硫? ??怨꾩젙怨?愿?⑤맂 ?뚮┝???닿쾶 ?쒖떆?섏? ?딆뒿?덈떎.</p><div class="notification-dialog__actions"><button type="button" class="notification-dialog__danger notification-dialog__confirm-block">李⑤떒</button><button type="button" class="notification-dialog__secondary notification-dialog__close">痍⑥냼</button></div></div>`;
        modal.addEventListener("click", (e) => {
            if (e.target.classList.contains("notification-dialog__backdrop") || e.target.closest(".notification-dialog__close")) {
                e.preventDefault();
                closeNotificationModal();
                return;
            }
            if (e.target.closest(".notification-dialog__confirm-block")) {
                e.preventDefault();
                showNotificationToast(`${handle} ?섏쓣 李⑤떒?덉뒿?덈떎`);
                closeNotificationModal();
            }
        });
        document.body.appendChild(modal);
        document.body.classList.add("modal-open");
        activeNotificationModal = modal;
    };

    // ?좉퀬 紐⑤떖???닿린 (Notification怨??숈씪 ???좉퀬 ?ъ쑀 紐⑸줉 ?ы븿)
    const openReportModal = (button) => {
        closeMoreDropdown();
        closeNotificationModal();
        const modal = document.createElement("div");
        modal.className = "notification-dialog notification-dialog--report";
        modal.innerHTML = `<div class="notification-dialog__backdrop"></div><div class="notification-dialog__card notification-dialog__card--report" role="dialog" aria-modal="true"><div class="notification-dialog__header"><button type="button" class="notification-dialog__icon-btn notification-dialog__close" aria-label="돌아가기"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg></button><h2 class="notification-dialog__title">신고하기</h2></div><div class="notification-dialog__body"><p class="notification-dialog__question">이 게시물에 어떤 문제가 있나요?</p><ul class="notification-report__list">${reportReasons.map((r) => `<li><button type="button" class="notification-report__item"><span>${escapeHtml(r)}</span><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.293 6.293 10.707 4.88 17.828 12l-7.121 7.12-1.414-1.413L14.999 12z"></path></g></svg></button></li>`).join("")}</ul></div></div>`;
        modal.addEventListener("click", (e) => {
            if (e.target.classList.contains("notification-dialog__backdrop") || e.target.closest(".notification-dialog__close")) {
                e.preventDefault();
                closeNotificationModal();
                return;
            }
            if (e.target.closest(".notification-report__item")) {
                e.preventDefault();
                showNotificationToast("신고가 접수되었습니다.");
                closeNotificationModal();
            }
        });
        document.body.appendChild(modal);
        document.body.classList.add("modal-open");
        activeNotificationModal = modal;
    };

    // 더보기 드롭다운 메뉴 클릭 시 해당 액션을 처리합니다
    const handleMoreDropdownAction = (button, actionClass) => {
        const postCard = getPostCard(button);
        const handle = getTextContent(postCard?.querySelector(".postHandle")) || "@user";
        if (actionClass === "menu-item--follow-toggle") {
            const isF = followState.get(handle) ?? false;
            followState.set(handle, !isF);
            closeMoreDropdown();
            showNotificationToast(isF ? `${handle} 님 팔로우를 취소했습니다` : `${handle} 님을 팔로우했습니다`);
            return;
        }
        if (actionClass === "menu-item--block") {
            openBlockModal(button);
            return;
        }
        if (actionClass === "menu-item--report") openReportModal(button);
    };

    // 더보기 드롭다운을 #layers 영역에 동적으로 생성합니다
    const openMoreDropdown = (button) => {
        if (!layersRoot) return;
        closeShareDropdown();
        closeMoreDropdown();
        const rect = button.getBoundingClientRect();
        const top = rect.bottom + window.scrollY + 8;
        const items = getMoreDropdownItems(button);
        const right = Math.max(16, window.innerWidth - rect.right);
        const lc = document.createElement("div");
        lc.className = "layers-dropdown-container";
        lc.innerHTML = `<div class="layers-overlay"></div><div class="layers-dropdown-inner"><div role="menu" class="dropdown-menu" style="top: ${top}px; right: ${right}px;"><div><div class="dropdown-inner">${items.map((it) => `<button type="button" role="menuitem" class="menu-item ${it.actionClass}"><span class="menu-item__icon">${it.icon}</span><span class="menu-item__label">${it.label}</span></button>`).join("")}</div></div></div></div>`;
        lc.addEventListener("click", (e) => {
            const item = e.target.closest(".menu-item");
            if (item) {
                e.preventDefault();
                e.stopPropagation();
                if (activeMoreButton) {
                    const ac = Array.from(item.classList).find((c) => c.startsWith("menu-item--")) ?? "";
                    handleMoreDropdownAction(activeMoreButton, ac);
                }
                return;
            }
            e.stopPropagation();
        });
        layersRoot.appendChild(lc);
        activeMoreDropdown = lc;
        activeMoreButton = button;
        activeMoreButton.setAttribute("aria-expanded", "true");
    };

    // ===== 怨듭쑀 ?쒕∼?ㅼ슫 ?⑥닔 ?뱀뀡 =====
    // 怨듭쑀 ?쒕∼?ㅼ슫? #layers ?붿냼???숈쟻?쇰줈 ?앹꽦(appendChild)?섍퀬, ?レ쓣 ??remove()濡??쒓굅?쒕떎.
    const closeShareDropdown = () => {
        if (!activeShareDropdown) {
            return;
        }

        activeShareDropdown.remove();
        activeShareDropdown = null;
        activeShareButton?.setAttribute("aria-expanded", "false");
        activeShareButton = null;
    };

    // 怨듭쑀 諛뷀??쒗듃(.share-sheet)??document.body???숈쟻?쇰줈 異붽??섎?濡?remove()濡??쒓굅?쒕떎.
    const closeShareModal = () => {
        if (!activeShareModal) {
            return;
        }

        activeShareModal.remove();
        activeShareModal = null;
        document.body.classList.remove("modal-open");
    };

    // ?듦? 紐⑤떖???レ쓣 ???덈뒗吏 ?뺤씤?쒕떎 (?묒꽦 以묒씠硫??뺤씤 ??붿긽???쒖떆)
    const canCloseReplyModal = () => {
        const hasAttachment = attachedReplyFiles.length > 0;
        if (!replyEditor) return !hasAttachment || window.confirm("寃뚯떆臾쇱쓣 ??젣?섏떆寃좎뼱??");
        const hasDraft = replyEditor.textContent.replace(/\u00a0/g, " ").trim().length > 0;
        return (!hasDraft && !hasAttachment) || window.confirm("寃뚯떆臾쇱쓣 ??젣?섏떆寃좎뼱??");
    };

    // ===== ?듦? 紐⑤떖 ?⑥닔 ?뱀뀡 =====
    // ?듦? 紐⑤떖? HTML???대? 議댁옱?섎뒗 [data-reply-modal] 怨④꺽??hidden ?띿꽦?쇰줈 ?좉??댁꽌 ?ъ궗?⑺븳??
    // ?숈쟻 ?앹꽦/??젣媛 ?꾨땲???쒖떆/?④? ?꾪솚 諛⑹떇?대떎.
    const closeReplyModal = (options = {}) => {
        const {skipConfirm = false, restoreFocus = true} = options;
        if (!replyModalOverlay || replyModalOverlay.hidden) {
            return;
        }
        if (!skipConfirm && !canCloseReplyModal()) return;

        shouldRestoreReplyEditorAfterEmojiInsert = false;
        replyModalOverlay.hidden = true;
        document.body.classList.remove("modal-open");
        closeEmojiPicker();
        closeLocationPanel({restoreFocus: false});
        closeTagPanel({restoreFocus: false});
        closeMediaEditor({restoreFocus: false, discardChanges: true});
        closeDraftPanel({restoreFocus: false});
        if (replyProductView) replyProductView.hidden = true;
        if (replyEditor) replyEditor.textContent = "";

        savedReplySelection = null;
        savedReplySelectionOffsets = null;
        pendingReplyFormats = new Set();
        selectedLocation = null;
        pendingLocation = null;
        selectedTaggedUsers = [];
        pendingTaggedUsers = [];
        selectedProduct = null;
        if (replyProductButton) replyProductButton.disabled = false;
        const existingProductCard2 = replyModalOverlay?.querySelector("[data-selected-product]");
        if (existingProductCard2) existingProductCard2.remove();
        resetReplyAttachment();
        renderLocationList();
        syncLocationUI();
        syncUserTagTrigger();
        syncReplyMediaEditsToAttachments();
        syncReplySubmitState();
        syncReplyFormatButtons();

        if (restoreFocus) activeReplyTrigger?.focus();
        activeReplyTrigger = null;
    };

    // ===== 踰꾪듉 ?곹깭 / 移댁슫??/ 怨듭쑀 ?좎뒪???뱀뀡 =====
    // 遺곷쭏??踰꾪듉???꾩씠肄?寃쎈줈? ?쇰꺼???꾩옱 ?곹깭??留욊쾶 諛붽씔??
    const setBookmarkButtonState = (button, isActive) => {
        const path = button?.querySelector("path");
        if (!button || !path) {
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
        path.setAttribute(
            "d",
            isActive
                ? path.dataset.pathActive || path.getAttribute("d")
                : path.dataset.pathInactive || path.getAttribute("d"),
        );
    };

    // ?≪뀡 踰꾪듉 ?レ옄瑜?利앷컧?쒖폒 ?붾㈃??諛붾줈 諛섏쁺?쒕떎.
    const updateCount = (button, delta) => {
        const countElement = button?.querySelector(".tweet-action-count");
        if (!countElement) {
            return 0;
        }

        const currentCount =
            Number.parseInt(getTextContent(countElement) || "0", 10) || 0;
        const nextCount = Math.max(0, currentCount + delta);
        countElement.textContent = String(nextCount);
        return nextCount;
    };

    // 怨듭쑀 ?좎뒪??.share-toast)??HTML??誘몃━ ?녾퀬, document.body ?앹뿉 ?좉퉸 異붽??덈떎媛 3珥????먮룞 remove()?쒕떎.
    const showShareToast = (message) => {
        document.querySelector(".share-toast")?.remove();
        const toast = document.createElement("div");
        toast.className = "share-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.textContent = message;
        document.body.appendChild(toast);
        window.setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    // 怨듭쑀 ????ъ슜??紐⑸줉? ?섎떒 異붿쿇 移대뱶(.user-card)?먯꽌 ?쎌뼱? ?ъ궗?⑺븳??
    const getShareUsers = () =>
        Array.from(document.querySelectorAll(".user-card")).map((card) => ({
            id:
                card.dataset.handle ||
                getTextContent(card.querySelector(".user-handle")),
            name: getTextContent(card.querySelector(".user-name")),
            handle:
                card.dataset.handle ||
                getTextContent(card.querySelector(".user-handle")),
            avatar: buildAvatarDataUrl(
                getTextContent(card.querySelector(".user-avatar")) ||
                getTextContent(card.querySelector(".user-name")),
            ),
        }));

    // 怨듭쑀 愿???≪뀡?먯꽌 怨듯넻?쇰줈 ?곕뒗 寃뚯떆臾?硫뷀??곗씠?곕? 臾띠뼱 諛섑솚?쒕떎.
    const getSharePostMeta = (button) => {
        const postCard = getPostCard(button);
        const bookmarkButton =
            postCard?.querySelector(".tweet-action-btn--bookmark") ?? null;
        const postId = postCard?.dataset.postId || "";
        const url = new URL(window.location.href);
        url.hash = postId ? `post-${postId}` : "";
        return {bookmarkButton, permalink: url.toString()};
    };

    // 留곹겕 蹂듭궗???쒕∼?ㅼ슫???レ? ???꾩옱 寃뚯떆臾쇱쓽 ?댁떆 URL???대┰蹂대뱶??湲곕줉?쒕떎.
    const copyShareLink = (button) => {
        const {permalink} = getSharePostMeta(button);
        closeShareDropdown();

        if (!navigator.clipboard?.writeText) {
            showShareToast("링크를 복사하지 못했습니다.");
            return;
        }

        navigator.clipboard
            .writeText(permalink)
            .then(() => {
                showShareToast("클립보드로 복사됨");
            })
            .catch(() => {
                showShareToast("링크를 복사하지 못했습니다.");
            });
    };

    // ===== 怨듭쑀 諛뷀??쒗듃 ?숈쟻 ?앹꽦 ?뱀뀡 =====
    // 怨듭쑀??諛뷀??쒗듃(.share-sheet)??HTML???뺤쟻 留덊겕?낆씠 ?놁뼱??
    // document.body???덈줈 留뚮뱾??appendChild?섍퀬, closeShareModal()?먯꽌 remove()濡??쒓굅?쒕떎.

    // --- Chat ?꾩넚 諛뷀??쒗듃 ---
    const openShareChatModal = () => {
        const users = getShareUsers();
        closeShareDropdown();
        closeShareModal();

        const modal = document.createElement("div");
        modal.className = "share-sheet";
        modal.innerHTML = `<div class="share-sheet__backdrop" data-share-close="true"></div><div class="share-sheet__card" role="dialog" aria-modal="true" aria-labelledby="share-chat-title"><div class="share-sheet__header"><button type="button" class="share-sheet__icon-btn" data-share-close="true" aria-label="?뚯븘媛湲?><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg></button><h2 id="share-chat-title" class="share-sheet__title">怨듭쑀?섍린</h2><span class="share-sheet__header-spacer"></span></div><div class="share-sheet__search"><input type="text" class="share-sheet__search-input" placeholder="寃?? aria-label="寃?? /></div><div class="share-sheet__list">${users.length === 0 ? '<div class="share-sheet__empty"><p>?꾩넚?????덈뒗 ?ъ슜?먭? ?놁뒿?덈떎.</p></div>' : users.map((user) => `<button type="button" class="share-sheet__user" data-share-user-name="${escapeHtml(user.name)}"><span class="share-sheet__user-avatar"><img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" /></span><span class="share-sheet__user-body"><span class="share-sheet__user-name">${escapeHtml(user.name)}</span><span class="share-sheet__user-handle">${escapeHtml(user.handle)}</span></span></button>`).join("")}</div></div>`;
        modal.addEventListener("click", (event) => {
            const userButton = event.target.closest(".share-sheet__user");
            if (
                event.target.closest("[data-share-close='true']") ||
                event.target.classList.contains("share-sheet__backdrop")
            ) {
                event.preventDefault();
                closeShareModal();
                return;
            }

            if (userButton) {
                event.preventDefault();
                showShareToast(
                    `${userButton.getAttribute("data-share-user-name") || "사용자"}님에게 전송됨`, 
                );
                closeShareModal();
            }
        });
        // body에 직접 붙여 전체 화면 시트처럼 사용합니다.
        document.body.appendChild(modal);
        document.body.classList.add("modal-open");
        activeShareModal = modal;
    };

    // --- 遺곷쭏???대뜑 諛뷀??쒗듃 (document.body???숈쟻 異붽?) ---
    const openShareBookmarkModal = (button) => {
        const {bookmarkButton} = getSharePostMeta(button);
        const isBookmarked =
            bookmarkButton?.classList.contains("active") ?? false;
        closeShareDropdown();
        closeShareModal();

        const modal = document.createElement("div");
        modal.className = "share-sheet";
        modal.innerHTML = `<div class="share-sheet__backdrop" data-share-close="true"></div><div class="share-sheet__card share-sheet__card--bookmark" role="dialog" aria-modal="true" aria-labelledby="share-bookmark-title"><div class="share-sheet__header"><button type="button" class="share-sheet__icon-btn" data-share-close="true" aria-label="?リ린"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></button><h2 id="share-bookmark-title" class="share-sheet__title">?대뜑??異붽?</h2><span class="share-sheet__header-spacer"></span></div><button type="button" class="share-sheet__create-folder">??遺곷쭏???대뜑 留뚮뱾湲?/button><button type="button" class="share-sheet__folder" data-share-folder="all-bookmarks"><span class="share-sheet__folder-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M2.998 8.5c0-1.38 1.119-2.5 2.5-2.5h9c1.381 0 2.5 1.12 2.5 2.5v14.12l-7-3.5-7 3.5V8.5zM18.5 2H8.998v2H18.5c.275 0 .5.224.5.5V15l2 1.4V4.5c0-1.38-1.119-2.5-2.5-2.5z"></path></g></svg></span><span class="share-sheet__folder-name">紐⑤뱺 遺곷쭏??/span><span class="share-sheet__folder-check${isBookmarked ? " share-sheet__folder-check--active" : ""}"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg></span></button></div>`;
        modal.addEventListener("click", (event) => {
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
                showShareToast("???대뜑 留뚮뱾湲곕뒗 以鍮?以묒엯?덈떎");
                closeShareModal();
                return;
            }

            if (event.target.closest("[data-share-folder='all-bookmarks']")) {
                event.preventDefault();
                setBookmarkButtonState(bookmarkButton, !isBookmarked);
                showShareToast(isBookmarked ? "북마크가 해제되었습니다" : "북마크에 추가되었습니다");
                closeShareModal();
            }
        });
        // HTML에 미리 선언된 모달이 없어서 body에 직접 붙입니다.
        document.body.appendChild(modal);
        document.body.classList.add("modal-open");
        activeShareModal = modal;
    };

    // --- 怨듭쑀 ?쒕∼?ㅼ슫 (#layers???숈쟻 異붽?) ---
    // 寃뚯떆臾?踰꾪듉 ?꾩튂瑜?湲곗??쇰줈 怨꾩궛?댁꽌 #layers ?덉뿉 appendChild?섍퀬, ?レ쓣 ??remove()濡??쒓굅?쒕떎.
    const openShareDropdown = (button) => {
        if (!layersRoot) {
            return;
        }

        closeShareDropdown();

        const rect = button.getBoundingClientRect();
        const top = rect.bottom + window.scrollY + 8;
        const right = Math.max(16, window.innerWidth - rect.right);
        const dropdown = document.createElement("div");
        dropdown.className = "layers-dropdown-container";
        dropdown.innerHTML = `<div class="layers-overlay"></div><div class="layers-dropdown-inner"><div role="menu" class="dropdown-menu" style="top: ${top}px; right: ${right}px;"><div><div class="dropdown-inner"><button type="button" role="menuitem" class="menu-item share-menu-item share-menu-item--copy"><span class="menu-item__icon share-menu-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></g></svg></span><span class="menu-item__label">留곹겕 蹂듭궗?섍린</span></button><button type="button" role="menuitem" class="menu-item share-menu-item share-menu-item--chat"><span class="menu-item__icon share-menu-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path></g></svg></span><span class="menu-item__label">Chat?쇰줈 ?꾩넚?섍린</span></button><button type="button" role="menuitem" class="menu-item share-menu-item share-menu-item--bookmark"><span class="menu-item__icon share-menu-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18 3V0h2v3h3v2h-3v3h-2V5h-3V3zm-7.5 1a.5.5 0 00-.5.5V7h3.5A2.5 2.5 0 0116 9.5v3.48l3 2.1V11h2v7.92l-5-3.5v7.26l-6.5-3.54L3 22.68V9.5A2.5 2.5 0 015.5 7H8V4.5A2.5 2.5 0 0110.5 2H12v2zm-5 5a.5.5 0 00-.5.5v9.82l4.5-2.46 4.5 2.46V9.5a.5.5 0 00-.5-.5z"></path></g></svg></span><span class="menu-item__label">?대뜑??遺곷쭏??異붽??섍린</span></button></div></div></div></div>`;
        dropdown.addEventListener("click", (event) => {
            const actionButton = event.target.closest(".share-menu-item");
            if (!actionButton || !activeShareButton) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (actionButton.classList.contains("share-menu-item--copy")) {
                copyShareLink(activeShareButton);
                return;
            }

            if (actionButton.classList.contains("share-menu-item--chat")) {
                openShareChatModal(activeShareButton);
                return;
            }

            if (actionButton.classList.contains("share-menu-item--bookmark")) {
                openShareBookmarkModal(activeShareButton);
            }
        });
        // inquiry_active_list.html??#layers媛 ???쒕∼?ㅼ슫???ㅼ젣 留덉슫??吏?먯씠??
        layersRoot.appendChild(dropdown);
        activeShareDropdown = dropdown;
        activeShareButton = button;
        activeShareButton.setAttribute("aria-expanded", "true");
    };

    // ===== 珥덇린 ?대깽??諛붿씤???뱀뀡 =====
    // ???대┃? ?쒓컖???쒖꽦?붿? 吏㏃? ?꾨━酉곕쭔 泥섎━?섍퀬, ?ㅼ젣 肄섑뀗痢좊뒗 activity ?⑤꼸???좎??쒕떎.
    const initializeTabs = () => {
        ensureActivityPanelVisible();
        tabButtons.forEach((tab) => {
            tab.addEventListener("click", () => {
                setActiveTabVisual(tab.dataset.inquiryTab);
                togglePreviewState(tab);
                ensureActivityPanelVisible();
            });
        });
    };

    // 鍮좊Ⅸ 湲곌컙 移⑹? ?⑥씪 ?좏깮 ?곹깭留??좎??쒕떎.
    const initializePeriodChips = () => {
        periodChips.forEach((chip) => {
            chip.addEventListener("click", () => {
                periodChips.forEach((item) => {
                    item.classList.toggle("period-chip--active", item === chip);
                });
            });
        });
    };

    // ?꾪꽣 踰꾪듉/硫붾돱???대┝ ?곹깭? ?좏깮 ?쇰꺼???숆린?뷀븳??
    const initializeFilterDropdown = () => {
        if (!filterTrigger || !filterMenu || !filterLabel) {
            return;
        }

        filterTrigger.addEventListener("click", (event) => {
            event.preventDefault();
            const willOpen = filterMenu.hidden;
            filterMenu.hidden = !willOpen;
            filterTrigger.setAttribute("aria-expanded", String(willOpen));
        });

        filterItems.forEach((item) => {
            item.addEventListener("click", () => {
                const label = item.querySelector(
                    ".activity-filter-menu__label",
                );
                filterItems.forEach((entry) => {
                    const isSelected = entry === item;
                    entry.classList.toggle(
                        "activity-filter-menu__item--selected",
                        isSelected,
                    );
                    entry.setAttribute("aria-checked", String(isSelected));
                });
                filterLabel.textContent = getTextContent(label);
                closeFilterMenu();
            });
        });
    };

    // 湲?寃뚯떆臾?蹂몃Ц? 140??湲곗??쇰줈 ?묎퀬, ?붾낫湲??묎린 ?좉????숈쟻?쇰줈 ?ｋ뒗??
    const initializePostTextToggles = () => {
        document.querySelectorAll(".postText").forEach((textElement) => {
            const originalText = getTextContent(textElement);
            if (!originalText) {
                return;
            }

            textElement.dataset.fullText = originalText;

            if (originalText.length <= MAX_POST_TEXT_LENGTH) {
                textElement.innerHTML = `<span class="postTextContent">${escapeHtml(originalText)}</span>`;
                return;
            }

            const collapsedText = `${originalText.slice(0, MAX_POST_TEXT_LENGTH).trimEnd()}...`;
            textElement.dataset.collapsedText = collapsedText;
            textElement.dataset.expanded = "false";
            textElement.innerHTML = `<span class="postTextContent">${escapeHtml(collapsedText)}</span><button type="button" class="postTextToggle">?붾낫湲?/button>`;
        });

        document.querySelectorAll(".postTextToggle").forEach((button) => {
            button.addEventListener("click", () => {
                const textElement = button.closest(".postText");
                if (!textElement) {
                    return;
                }

                const content = textElement.querySelector(".postTextContent");
                const isExpanded = textElement.dataset.expanded === "true";
                textElement.dataset.expanded = String(!isExpanded);
                content.textContent = isExpanded
                    ? textElement.dataset.collapsedText ||
                    textElement.dataset.fullText ||
                    ""
                    : textElement.dataset.fullText || "";
                button.textContent = isExpanded ? "더보기" : "접기";
            });
        });
    };

    // 移대뱶 ?ㅻ뜑??????媛?踰꾪듉? ?숈쟻 ?쒕∼?ㅼ슫(#layers)???닿굅???ル뒗??(Notification怨??숈씪).
    const initializePostMoreMenus = () => {
        document.querySelectorAll(".postMoreButton").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                // 媛숈? 踰꾪듉???ㅼ떆 ?꾨Ⅴ硫??リ린
                if (activeMoreButton === button) {
                    closeMoreDropdown();
                    return;
                }
                openMoreDropdown(button);
            });
        });
    };

    // 醫뗭븘?붾뒗 ?꾩씠肄?path, ?쒖꽦 ?대옒?? ?レ옄, aria-label???④퍡 媛깆떊?쒕떎.
    const initializeLikeButtons = () => {
        document
            .querySelectorAll(".tweet-action-btn--like")
            .forEach((button) => {
                button.addEventListener("click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const isActive = button.classList.toggle("active");
                    const path = button.querySelector("path");
                    const nextCount = updateCount(button, isActive ? 1 : -1);

                    if (path) {
                        path.setAttribute(
                            "d",
                            isActive
                                ? path.dataset.pathActive ||
                                path.getAttribute("d")
                                : path.dataset.pathInactive ||
                                path.getAttribute("d"),
                        );
                    }

                    button.setAttribute(
                        "aria-label",
                        `留덉쓬???ㅼ뼱??${nextCount}`,
                    );
                });
            });
    };

    // 遺곷쭏?щ뒗 怨듯넻 ?곹깭 諛섏쁺 ?⑥닔留??몄텧?쒕떎.
    const initializeBookmarkButtons = () => {
        document
            .querySelectorAll(".tweet-action-btn--bookmark")
            .forEach((button) => {
                button.addEventListener("click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setBookmarkButtonState(
                        button,
                        !button.classList.contains("active"),
                    );
                });
            });
    };

    // 怨듭쑀 踰꾪듉? 媛숈? 踰꾪듉???ㅼ떆 ?꾨Ⅴ硫??リ퀬, ?꾨땲硫?#layers ?쒕∼?ㅼ슫???곕떎.
    const initializeShareButtons = () => {
        document
            .querySelectorAll(".tweet-action-btn--share")
            .forEach((button) => {
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
    };

    // 이모지 데이터와 서식 버튼 라벨
    const emojiRecentsKey = "inquiry_reply_recent_emojis";
    const maxRecentEmojis = 18;
    const emojiCategoryMeta = {
        recent: {
            label: "최근",
            sectionTitle: "최근",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 1.75A10.25 10.25 0 112.75 12 10.26 10.26 0 0112 1.75zm0 1.5A8.75 8.75 0 1020.75 12 8.76 8.76 0 0012 3.25zm.75 3.5v5.19l3.03 1.75-.75 1.3-3.78-2.18V6.75h1.5z"></path></g></svg>',
        },
        smileys: {
            label: "스마일",
            sectionTitle: "스마일과 감정",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20c-5.109 0-9.25 4.141-9.25 9.25s4.141 9.25 9.25 9.25 9.25-4.141 9.25-9.25S17.109 2.75 12 2.75z"></path></g></svg>',
        },
        animals: {
            label: "동물",
            sectionTitle: "동물과 자연",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 3.5c3.77 0 6.75 2.86 6.75 6.41 0 3.17-1.88 4.94-4.15 6.28-.74.44-1.54.9-1.6 1.86-.02.38-.33.68-.71.68h-.6a.71.71 0 01-.71-.67c-.07-.95-.86-1.42-1.6-1.85C7.13 14.85 5.25 13.08 5.25 9.91 5.25 6.36 8.23 3.5 12 3.5z"></path></g></svg>',
        },
        food: {
            label: "음식",
            sectionTitle: "음식과 음료",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M17.5 2a5.5 5.5 0 00-5.5 5.5c0 .51.07 1.01.2 1.48L4 17.18V21h3.82l8.2-8.2c.47.13.97.2 1.48.2a5.5 5.5 0 000-11z"></path></g></svg>',
        },
        activities: {
            label: "활동",
            sectionTitle: "활동",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z"></path></g></svg>',
        },
        travel: {
            label: "여행",
            sectionTitle: "여행과 장소",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z"></path></g></svg>',
        },
        objects: {
            label: "사물",
            sectionTitle: "사물",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z"></path></g></svg>',
        },
        symbols: {
            label: "기호",
            sectionTitle: "기호",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z"></path></g></svg>',
        },
        flags: {
            label: "깃발",
            sectionTitle: "깃발",
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__emoji-tab-icon"><g><path d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"></path></g></svg>',
        },
    };
    const emojiCategoryData = {
        smileys: ["😀", "😄", "😁", "😆", "😊", "😍", "😘", "😎", "🤗", "🤔", "😭", "😡", "🥲", "😴", "🤩", "🥳"],
        animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧"],
        food: ["🍎", "🍐", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🥝", "🍅", "🥑", "🍔", "🍕", "🍜", "☕"],
        activities: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎳", "🏓", "🎮", "🎯", "🎤", "🎧", "🎹", "🎸", "🎲", "🧩"],
        travel: ["🚗", "🚕", "🚌", "🚎", "🚓", "🚑", "🚒", "🚚", "✈️", "🚆", "🚢", "🚀", "🗺️", "🏝️", "🏙️", "🏠"],
        objects: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "📷", "🎥", "📺", "🔦", "💡", "📦", "🧰", "📌", "✏️", "📎"],
        symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "✔️", "❗", "❓", "⭐", "🔥", "💯", "✅", "➕"],
        flags: ["🇰🇷", "🇺🇸", "🇯🇵", "🇨🇳", "🇬🇧", "🇫🇷", "🇩🇪", "🇪🇸", "🇮🇹", "🇨🇦", "🇦🇺", "🇸🇬", "🇻🇳", "🇹🇭"],
    };
    const formatButtonLabels = {
        bold: { inactive: "굵게 (Ctrl+B)", active: "굵게 활성 상태 (Ctrl+B)" },
        italic: { inactive: "기울임 (Ctrl+I)", active: "기울임 활성 상태 (Ctrl+I)" },
    };

    // ===== ?대え吏 ?좏떥 ?⑥닔 =====
    function getRecentEmojis() {
        try {
            const s = window.localStorage.getItem(emojiRecentsKey);
            const p = s ? JSON.parse(s) : [];
            return Array.isArray(p) ? p : [];
        } catch {
            return [];
        }
    }

    function saveRecentEmoji(emoji) {
        const recent = getRecentEmojis().filter((i) => i !== emoji);
        recent.unshift(emoji);
        try {
            window.localStorage.setItem(emojiRecentsKey, JSON.stringify(recent.slice(0, maxRecentEmojis)));
        } catch {
            return;
        }
    }

    function clearRecentEmojis() {
        try {
            window.localStorage.removeItem(emojiRecentsKey);
        } catch {
            return;
        }
    }

    function getEmojiSearchTerm() {
        return replyEmojiSearchInput?.value.trim().toLowerCase() ?? "";
    }

    function getEmojiEntriesForCategory(category) {
        if (category === "recent") return getRecentEmojis().map((emoji) => ({emoji, keywords: [emoji]}));
        return (emojiCategoryData[category] ?? []).map((emoji) => ({
            emoji,
            keywords: [emoji, emojiCategoryMeta[category]?.label ?? ""]
        }));
    }

    function getFilteredEmojiEntries(category) {
        const entries = getEmojiEntriesForCategory(category);
        const term = getEmojiSearchTerm();
        if (!term) return entries;
        return entries.filter((e) => e.keywords.some((k) => k.toLowerCase().includes(term)));
    }

    function buildEmojiSection(title, emojis, {clearable = false, emptyText = ""} = {}) {
        const headerAction = clearable ? '<button type="button" class="tweet-modal__emoji-clear" data-action="clear-recent">모두 지우기</button>' : "";
        const body = emojis.length
            ? `<div class="tweet-modal__emoji-grid">${emojis.map((e) => `<button type="button" class="tweet-modal__emoji-option" data-emoji="${e}" role="menuitem">${e}</button>`).join("")}</div>`
            : `<p class="tweet-modal__emoji-empty">${emptyText}</p>`;
        return `<section class="tweet-modal__emoji-section"><div class="tweet-modal__emoji-section-header"><h3 class="tweet-modal__emoji-section-title">${title}</h3>${headerAction}</div>${body}</section>`;
    }

    function renderEmojiTabs() {
        replyEmojiTabs.forEach((tab) => {
            const cat = tab.getAttribute("data-emoji-category");
            const meta = cat ? emojiCategoryMeta[cat] : null;
            const active = cat === activeEmojiCategory;
            tab.classList.toggle("tweet-modal__emoji-tab--active", active);
            tab.setAttribute("aria-selected", String(active));
            if (meta) tab.innerHTML = meta.icon;
        });
    }

    function renderEmojiPickerContent() {
        if (!replyEmojiContent) return;
        const searchTerm = getEmojiSearchTerm();
        if (searchTerm) {
            const sections = Object.keys(emojiCategoryData).map((cat) => {
                const entries = getFilteredEmojiEntries(cat);
                return entries.length === 0 ? "" : buildEmojiSection(emojiCategoryMeta[cat].sectionTitle, entries.map((e) => e.emoji));
            }).join("");
            replyEmojiContent.innerHTML = sections || buildEmojiSection("검색 결과", [], {emptyText: "일치하는 이모지가 없습니다."});
            return;
        }
        if (activeEmojiCategory === "recent") {
            const recent = getRecentEmojis();
            replyEmojiContent.innerHTML = buildEmojiSection("최근", recent, {
                clearable: recent.length > 0,
                emptyText: "최근 사용한 이모지가 없습니다."
            }) + buildEmojiSection(emojiCategoryMeta.smileys.sectionTitle, getEmojiEntriesForCategory("smileys").map((e) => e.emoji));
            return;
        }
        replyEmojiContent.innerHTML = buildEmojiSection(emojiCategoryMeta[activeEmojiCategory].sectionTitle, getEmojiEntriesForCategory(activeEmojiCategory).map((e) => e.emoji));
    }

    function renderEmojiPicker() {
        renderEmojiTabs();
        renderEmojiPickerContent();
    }

    // ===== ?듦? ?먮뵒???ы띁 ?⑥닔 ?뱀뀡 (?쒖떇/?좏깮 ?곸뿭) =====
    function hasReplyEditorText() {
        return replyEditor ? replyEditor.textContent.replace(/\u00a0/g, " ").trim().length > 0 : false;
    }

    function hasReplyAttachment() {
        return attachedReplyFiles.length > 0;
    }

    function togglePendingReplyFormat(fmt) {
        pendingReplyFormats.has(fmt) ? pendingReplyFormats.delete(fmt) : pendingReplyFormats.add(fmt);
    }

    function applyPendingReplyFormatsToContent() {
        if (!replyEditor || pendingReplyFormats.size === 0 || !hasReplyEditorText()) return;
        let span;
        if (replyEditor.childNodes.length === 1 && replyEditor.firstElementChild?.tagName === "SPAN") {
            span = replyEditor.firstElementChild;
        } else {
            span = document.createElement("span");
            while (replyEditor.firstChild) span.appendChild(replyEditor.firstChild);
            replyEditor.appendChild(span);
        }
        span.style.fontWeight = pendingReplyFormats.has("bold") ? "bold" : "";
        span.style.fontStyle = pendingReplyFormats.has("italic") ? "italic" : "";
        // DOM???쒖떇??諛섏쁺????pending ?곹깭瑜?鍮꾩슫??
        // ?댄썑 ?쒖떇 ?곹깭??queryCommandState濡??먮떒?섎?濡?以묐났 ?곸슜??諛⑹??쒕떎.
        pendingReplyFormats = new Set();
        const range = document.createRange();
        range.selectNodeContents(span);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        saveReplySelection();
    }

    function saveReplySelection() {
        if (!replyEditor || isInsertingReplyEmoji) return;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        if (!replyEditor.contains(range.commonAncestorContainer)) return;
        savedReplySelection = range.cloneRange();
        savedReplySelectionOffsets = getReplySelectionOffsets(range);
    }

    function getReplySelectionOffsets(range) {
        if (!replyEditor) return null;
        const pre = range.cloneRange();
        pre.selectNodeContents(replyEditor);
        pre.setEnd(range.startContainer, range.startOffset);
        const start = pre.toString().length;
        return {start, end: start + range.toString().length};
    }

    function resolveReplySelectionPosition(targetOffset) {
        if (!replyEditor) return null;
        const walker = document.createTreeWalker(replyEditor, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        let remaining = Math.max(0, targetOffset);
        let lastTextNode = null;
        while (node) {
            lastTextNode = node;
            const length = node.textContent?.length ?? 0;
            if (remaining <= length) return {node, offset: remaining};
            remaining -= length;
            node = walker.nextNode();
        }
        if (lastTextNode) return {node: lastTextNode, offset: lastTextNode.textContent?.length ?? 0};
        return {node: replyEditor, offset: replyEditor.childNodes.length};
    }

    function buildReplySelectionRangeFromOffsets(offsets) {
        if (!replyEditor || !offsets) return null;
        const startPos = resolveReplySelectionPosition(offsets.start);
        const endPos = resolveReplySelectionPosition(offsets.end);
        if (!startPos || !endPos) return null;
        const range = document.createRange();
        range.setStart(startPos.node, startPos.offset);
        range.setEnd(endPos.node, endPos.offset);
        return range;
    }

    function restoreReplySelection() {
        if (!replyEditor) return false;
        const sel = window.getSelection();
        if (!sel) return false;
        const range = buildReplySelectionRangeFromOffsets(savedReplySelectionOffsets) ?? savedReplySelection;
        if (!range) return false;
        sel.removeAllRanges();
        sel.addRange(range);
        return true;
    }

    function isSelectionInsideEditor() {
        if (!replyEditor) return false;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return false;
        return replyEditor.contains(sel.getRangeAt(0).commonAncestorContainer);
    }

    function syncReplyFormatButtons() {
        if (!replyEditor) return;
        // selection???먮뵒??諛뽰뿉 ?덉쑝硫?queryCommandState媛 ?섎せ??寃곌낵瑜?諛섑솚?섎?濡?
        // ?먮뵒???덉뿉 ?덉쓣 ?뚮쭔 ?ㅼ젣 DOM ?곹깭瑜??쎄퀬, 諛뽰씠硫?pending ?곹깭留?諛섏쁺?쒕떎
        const selInEditor = isSelectionInsideEditor();
        replyFormatButtons.forEach((btn) => {
            const fmt = btn.getAttribute("data-format");
            if (!fmt) return;
            let active;
            if (!hasReplyEditorText()) {
                active = pendingReplyFormats.has(fmt);
            } else if (selInEditor) {
                active = document.queryCommandState(fmt);
            } else {
                return; // ?먮뵒??諛???踰꾪듉 ?곹깭瑜?蹂寃쏀븯吏 ?딆쓬
            }
            const labels = formatButtonLabels[fmt];
            btn.classList.toggle("tweet-modal__tool-btn--active", active);
            if (labels) btn.setAttribute("aria-label", active ? labels.active : labels.inactive);
        });
    }

    function applyReplyFormat(format) {
        if (!replyEditor) return;
        replyEditor.focus();
        if (!hasReplyEditorText()) {
            togglePendingReplyFormat(format);
            syncReplyFormatButtons();
            return;
        }
        if (!restoreReplySelection()) {
            const range = document.createRange();
            range.selectNodeContents(replyEditor);
            range.collapse(false);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
        document.execCommand(format, false);
        saveReplySelection();
        syncReplySubmitState();
        syncReplyFormatButtons();
    }

    // ===== ?ъ슜???쒓렇 ?쒕툕酉??⑥닔 ?뱀뀡 =====
    function cloneTaggedUsers(users) {
        return users.map((u) => ({...u}));
    }

    function isTagModalOpen() {
        return Boolean(replyTagView && !replyTagView.hidden);
    }

    function getTagSearchTerm() {
        return replyTagSearchInput?.value.trim() ?? "";
    }

    function getTaggedUserSummary(users) {
        return users.length === 0 ? "?ъ슜???쒓렇?섍린" : users.map((u) => u.name).join(", ");
    }

    function syncUserTagTrigger() {
        const can = isReplyImageSet();
        const label = getTaggedUserSummary(selectedTaggedUsers);
        if (replyUserTagTrigger) {
            replyUserTagTrigger.hidden = !can;
            replyUserTagTrigger.disabled = !can;
            replyUserTagTrigger.setAttribute("aria-label", label);
        }
        if (replyUserTagLabel) replyUserTagLabel.textContent = label;
        if (!can && isTagModalOpen()) closeTagPanel({restoreFocus: false});
    }

    function getCurrentPageTagUsers() {
        const items = document.querySelectorAll(".postCard");
        const seen = new Set();
        return Array.from(items).map((item, i) => {
            const name = getTextContent(item.querySelector(".postName"));
            const handle = getTextContent(item.querySelector(".postHandle"));
            const avatar = item.querySelector(".postAvatar")?.getAttribute("src") ?? "";
            if (!name || !handle || seen.has(handle)) return null;
            seen.add(handle);
            return {id: `${handle.replace("@", "") || "user"}-${i}`, name, handle, avatar};
        }).filter(Boolean);
    }

    function getFilteredTagUsers(query) {
        const nq = query.trim().toLowerCase();
        if (!nq) return [];
        return getCurrentPageTagUsers().filter((u) => `${u.name} ${u.handle}`.toLowerCase().includes(nq)).slice(0, 6);
    }

    function renderTagChipList() {
        if (!replyTagChipList) return;
        if (pendingTaggedUsers.length === 0) {
            replyTagChipList.innerHTML = "";
            return;
        }
        replyTagChipList.innerHTML = pendingTaggedUsers.map((u) => {
            const av = u.avatar ? `<span class="tweet-modal__tag-chip-avatar"><img src="${escapeHtml(u.avatar)}" alt="${escapeHtml(u.name)}" /></span>` : '<span class="tweet-modal__tag-chip-avatar"></span>';
            return `<button type="button" class="tweet-modal__tag-chip" data-tag-remove-id="${escapeHtml(u.id)}">${av}<span class="tweet-modal__tag-chip-name">${escapeHtml(u.name)}</span><svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-modal__tag-chip-icon"><g><path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></button>`;
        }).join("");
    }

    function renderTagResults(users) {
        if (!replyTagResults || !replyTagSearchInput) return;
        currentTagResults = users;
        const hasQuery = getTagSearchTerm().length > 0;
        if (!hasQuery) {
            replyTagSearchInput.setAttribute("aria-expanded", "false");
            replyTagResults.innerHTML = "";
            return;
        }
        replyTagSearchInput.setAttribute("aria-expanded", "true");
        if (users.length === 0) {
            replyTagResults.innerHTML = '<p class="tweet-modal__tag-empty">일치하는 사용자를 찾지 못했습니다.</p>';
            return;
        }
        replyTagResults.innerHTML = users.map((u) => {
            const sel = pendingTaggedUsers.some((t) => t.id === u.id);
            const sub = sel ? `${u.handle} 이미 태그됨` : u.handle;
            const av = u.avatar ? `<span class="tweet-modal__tag-avatar"><img src="${escapeHtml(u.avatar)}" alt="${escapeHtml(u.name)}" /></span>` : '<span class="tweet-modal__tag-avatar"></span>';
            return `<div role="option" class="tweet-modal__tag-option"><div role="checkbox" aria-checked="${sel}" aria-disabled="${sel}" class="tweet-modal__tag-checkbox"><button type="button" class="tweet-modal__tag-user" data-tag-user-id="${escapeHtml(u.id)}" ${sel ? "disabled" : ""}>${av}<span class="tweet-modal__tag-user-body"><span class="tweet-modal__tag-user-name">${escapeHtml(u.name)}</span><span class="tweet-modal__tag-user-handle">${escapeHtml(sub)}</span></span></button></div></div>`;
        }).join("");
    }

    function runTagSearch() {
        const tq = getTagSearchTerm();
        renderTagResults(tq ? getFilteredTagUsers(tq) : []);
    }

    function openTagPanel() {
        if (!composeView || !replyTagView || !isReplyImageSet()) return;
        closeEmojiPicker();
        pendingTaggedUsers = cloneTaggedUsers(selectedTaggedUsers);
        composeView.hidden = true;
        replyTagView.hidden = false;
        if (replyTagSearchInput) replyTagSearchInput.value = "";
        renderTagChipList();
        renderTagResults([]);
        window.requestAnimationFrame(() => {
            replyTagSearchInput?.focus();
        });
    }

    function closeTagPanel({restoreFocus = true} = {}) {
        if (!composeView || !replyTagView || replyTagView.hidden) return;
        replyTagView.hidden = true;
        composeView.hidden = false;
        pendingTaggedUsers = cloneTaggedUsers(selectedTaggedUsers);
        if (replyTagSearchInput) replyTagSearchInput.value = "";
        renderTagChipList();
        renderTagResults([]);
        if (restoreFocus) window.requestAnimationFrame(() => {
            replyUserTagTrigger && !replyUserTagTrigger.hidden ? replyUserTagTrigger.focus() : replyEditor?.focus();
        });
    }

    function applyPendingTaggedUsers() {
        selectedTaggedUsers = cloneTaggedUsers(pendingTaggedUsers);
        syncUserTagTrigger();
    }

    function resetTaggedUsers() {
        selectedTaggedUsers = [];
        pendingTaggedUsers = [];
        if (replyTagSearchInput) replyTagSearchInput.value = "";
        renderTagChipList();
        renderTagResults([]);
        syncUserTagTrigger();
    }

    // ===== 誘몃뵒??ALT ?몄쭛 ?쒕툕酉??⑥닔 ?뱀뀡 =====
    function createDefaultReplyMediaEdit() {
        return {alt: ""};
    }

    function cloneReplyMediaEdits(edits) {
        return edits.map((e) => ({alt: e.alt}));
    }

    function isMediaEditorOpen() {
        return Boolean(replyMediaView && !replyMediaView.hidden);
    }

    function getReplyMediaTriggerLabel() {
        return replyMediaEdits.some((e) => e.alt.trim().length > 0) ? "?ㅻ챸 ?섏젙" : "?ㅻ챸 異붽?";
    }

    function syncReplyMediaEditsToAttachments() {
        if (!isReplyImageSet()) {
            replyMediaEdits = [];
            pendingReplyMediaEdits = [];
            activeReplyMediaIndex = 0;
            syncMediaAltTrigger();
            return;
        }
        replyMediaEdits = attachedReplyFiles.map((_, i) => {
            const ex = replyMediaEdits[i];
            return ex ? {alt: ex.alt ?? ""} : createDefaultReplyMediaEdit();
        });
        if (pendingReplyMediaEdits.length !== replyMediaEdits.length) pendingReplyMediaEdits = cloneReplyMediaEdits(replyMediaEdits);
        activeReplyMediaIndex = Math.min(activeReplyMediaIndex, Math.max(replyMediaEdits.length - 1, 0));
        syncMediaAltTrigger();
    }

    function syncMediaAltTrigger() {
        const can = isReplyImageSet();
        const label = getReplyMediaTriggerLabel();
        if (replyMediaAltTrigger) {
            replyMediaAltTrigger.hidden = !can;
            replyMediaAltTrigger.disabled = !can;
            replyMediaAltTrigger.setAttribute("aria-label", label);
        }
        if (replyMediaAltLabel) replyMediaAltLabel.textContent = label;
        if (!can && isMediaEditorOpen()) closeMediaEditor({restoreFocus: false, discardChanges: true});
    }

    function getCurrentReplyMediaUrl() {
        return attachedReplyFileUrls[activeReplyMediaIndex] ?? "";
    }

    function getCurrentPendingReplyMediaEdit() {
        return pendingReplyMediaEdits[activeReplyMediaIndex] ?? createDefaultReplyMediaEdit();
    }

    function renderMediaEditor() {
        if (!replyMediaView || pendingReplyMediaEdits.length === 0) return;
        const edit = getCurrentPendingReplyMediaEdit();
        const url = getCurrentReplyMediaUrl();
        const alt = edit.alt ?? "";
        if (replyMediaTitle) replyMediaTitle.textContent = "?대?吏 ?ㅻ챸 ?섏젙";
        if (replyMediaPrevButton) replyMediaPrevButton.disabled = activeReplyMediaIndex === 0;
        if (replyMediaNextButton) replyMediaNextButton.disabled = activeReplyMediaIndex >= pendingReplyMediaEdits.length - 1;
        replyMediaPreviewImages.forEach((img) => {
            img.src = url;
            img.alt = alt;
        });
        if (replyMediaAltInput) replyMediaAltInput.value = alt;
        if (replyMediaAltCount) replyMediaAltCount.textContent = `${alt.length} / ${maxReplyMediaAltLength.toLocaleString()}`;
    }

    function openMediaEditor() {
        if (!composeView || !replyMediaView || !isReplyImageSet()) return;
        closeEmojiPicker();
        pendingReplyMediaEdits = cloneReplyMediaEdits(replyMediaEdits);
        activeReplyMediaIndex = 0;
        composeView.hidden = true;
        replyMediaView.hidden = false;
        renderMediaEditor();
        window.requestAnimationFrame(() => {
            replyMediaAltInput?.focus();
        });
    }

    function closeMediaEditor({restoreFocus = true, discardChanges = true} = {}) {
        if (!composeView || !replyMediaView || replyMediaView.hidden) return;
        if (discardChanges) pendingReplyMediaEdits = cloneReplyMediaEdits(replyMediaEdits);
        replyMediaView.hidden = true;
        composeView.hidden = false;
        if (restoreFocus) window.requestAnimationFrame(() => {
            replyMediaAltTrigger && !replyMediaAltTrigger.hidden ? replyMediaAltTrigger.focus() : replyEditor?.focus();
        });
    }

    function saveReplyMediaEdits() {
        replyMediaEdits = cloneReplyMediaEdits(pendingReplyMediaEdits);
        renderReplyAttachment();
        syncMediaAltTrigger();
        closeMediaEditor({discardChanges: false});
    }

    // ===== ?대え吏 ?쇱빱 ?⑥닔 ?뱀뀡 =====
    function hasEmojiButtonLibrary() {
        return typeof window.EmojiButton === "function";
    }

    function restoreReplyEditorAfterEmojiInsert() {
        if (!shouldRestoreReplyEditorAfterEmojiInsert || !replyEditor || replyModalOverlay?.hidden) return;
        shouldRestoreReplyEditorAfterEmojiInsert = false;
        window.requestAnimationFrame(() => {
            isInsertingReplyEmoji = true;
            replyEditor.focus();
            isInsertingReplyEmoji = false;
            restoreReplySelection();
            saveReplySelection();
            syncReplyFormatButtons();
        });
    }

    function ensureReplyEmojiLibraryPicker() {
        if (!replyEmojiButton || !replyEditor || !hasEmojiButtonLibrary()) return null;
        if (replyEmojiLibraryPicker) return replyEmojiLibraryPicker;
        replyEmojiLibraryPicker = new window.EmojiButton({
            position: "bottom-start",
            rootElement: replyModalOverlay ?? undefined,
            zIndex: 1400,
        });
        replyEmojiLibraryPicker.on("emoji", (selection) => {
            const emoji = typeof selection === "string" ? selection : selection?.emoji;
            if (!emoji) return;
            shouldRestoreReplyEditorAfterEmojiInsert = true;
            insertReplyEmoji(emoji);
            closeEmojiPicker();
            restoreReplyEditorAfterEmojiInsert();
        });
        replyEmojiLibraryPicker.on("hidden", () => {
            replyEmojiButton?.setAttribute("aria-expanded", "false");
            if (shouldRestoreReplyEditorAfterEmojiInsert) {
                restoreReplyEditorAfterEmojiInsert();
                return;
            }
            saveReplySelection();
        });
        if (replyEmojiPicker) replyEmojiPicker.hidden = true;
        return replyEmojiLibraryPicker;
    }

    function closeEmojiPicker() {
        const libraryPicker = replyEmojiLibraryPicker;
        if (libraryPicker) {
            if (libraryPicker.pickerVisible) libraryPicker.hidePicker();
            replyEmojiButton?.setAttribute("aria-expanded", "false");
            restoreReplyEditorAfterEmojiInsert();
            return;
        }
        if (!replyEmojiPicker || !replyEmojiButton) return;
        replyEmojiPicker.hidden = true;
        replyEmojiButton.setAttribute("aria-expanded", "false");
        restoreReplyEditorAfterEmojiInsert();
    }

    function updateEmojiPickerPosition() {
        if (!replyEmojiPicker || !replyEmojiButton) return;
        const rect = replyEmojiButton.getBoundingClientRect();
        const pw = Math.min(565, window.innerWidth - 32);
        const ml = Math.max(16, window.innerWidth - pw - 16);
        const left = Math.min(Math.max(16, rect.left), ml);
        const top = Math.min(rect.bottom + 8, window.innerHeight - 24);
        const mh = Math.max(220, window.innerHeight - top - 16);
        replyEmojiPicker.style.left = `${left}px`;
        replyEmojiPicker.style.top = `${top}px`;
        replyEmojiPicker.style.maxHeight = `${mh}px`;
    }

    function openEmojiPicker() {
        const libraryPicker = ensureReplyEmojiLibraryPicker();
        if (libraryPicker && replyEmojiButton) {
            saveReplySelection();
            replyEmojiButton.setAttribute("aria-expanded", "true");
            libraryPicker.showPicker(replyEmojiButton);
            return;
        }
        if (!replyEmojiPicker || !replyEmojiButton) return;
        renderEmojiPicker();
        replyEmojiPicker.hidden = false;
        replyEmojiButton.setAttribute("aria-expanded", "true");
        updateEmojiPickerPosition();
    }

    function toggleEmojiPicker() {
        const libraryPicker = ensureReplyEmojiLibraryPicker();
        if (libraryPicker && replyEmojiButton) {
            saveReplySelection();
            if (libraryPicker.pickerVisible) {
                libraryPicker.hidePicker();
                replyEmojiButton.setAttribute("aria-expanded", "false");
            } else {
                replyEmojiButton.setAttribute("aria-expanded", "true");
                libraryPicker.showPicker(replyEmojiButton);
            }
            return;
        }
        if (!replyEmojiPicker) return;
        replyEmojiPicker.hidden ? openEmojiPicker() : closeEmojiPicker();
    }

    function insertReplyEmoji(emoji) {
        if (!replyEditor) return;
        isInsertingReplyEmoji = true;
        replyEditor.focus();
        if (!restoreReplySelection()) {
            const range = document.createRange();
            range.selectNodeContents(replyEditor);
            range.collapse(false);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
        const sel = window.getSelection();
        if (!sel) {
            isInsertingReplyEmoji = false;
            return;
        }
        let range;
        if (sel.rangeCount === 0) {
            range = document.createRange();
            range.selectNodeContents(replyEditor);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            range = sel.getRangeAt(0);
        }
        if (!replyEditor.contains(range.commonAncestorContainer)) {
            range = document.createRange();
            range.selectNodeContents(replyEditor);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        const emojiNode = document.createTextNode(emoji);
        range.deleteContents();
        range.insertNode(emojiNode);
        const nextRange = document.createRange();
        nextRange.setStartAfter(emojiNode);
        nextRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(nextRange);
        isInsertingReplyEmoji = false;
        applyPendingReplyFormatsToContent();
        saveRecentEmoji(emoji);
        saveReplySelection();
        syncReplySubmitState();
        syncReplyFormatButtons();
        if (replyEmojiPicker && !replyEmojiPicker.hidden) renderEmojiPicker();
    }

    // ===== 泥⑤??뚯씪 泥섎━ ?⑥닔 ?뱀뀡 =====
    function getReplyMediaImageAlt(index) {
        return replyMediaEdits[index]?.alt ?? "";
    }

    function clearAttachedReplyFileUrls() {
        if (attachedReplyFileUrls.length === 0) return;
        attachedReplyFileUrls.forEach((u) => URL.revokeObjectURL(u));
        attachedReplyFileUrls = [];
    }

    function createReplyAttachmentUrls() {
        clearAttachedReplyFileUrls();
        attachedReplyFileUrls = attachedReplyFiles.map((f) => URL.createObjectURL(f));
    }

    function isReplyImageSet() {
        return attachedReplyFiles.length > 0 && attachedReplyFiles.every((f) => f.type.startsWith("image/"));
    }

    function isReplyVideoSet() {
        return attachedReplyFiles.length === 1 && attachedReplyFiles[0].type.startsWith("video/");
    }

    function resetReplyAttachment() {
        clearAttachedReplyFileUrls();
        attachedReplyFiles = [];
        pendingAttachmentEditIndex = null;
        if (replyFileInput) replyFileInput.value = "";
        if (replyAttachmentMedia) replyAttachmentMedia.innerHTML = "";
        if (replyAttachmentPreview) replyAttachmentPreview.hidden = true;
        resetTaggedUsers();
        syncReplyMediaEditsToAttachments();
    }

    function getReplyImageCell(index, url, cls) {
        const alt = getReplyMediaImageAlt(index);
        return `<div class="media-cell ${cls}"><div class="media-cell-inner"><div class="media-img-container" aria-label="誘몃뵒?? role="group"><div class="media-bg" style="background-image: url('${url}');"></div><img alt="${escapeHtml(alt)}" draggable="false" src="${url}" class="media-img"></div><div class="media-btn-row"><button type="button" class="media-btn" data-attachment-edit-index="${index}"><span>?섏젙</span></button></div><button type="button" class="media-btn-delete" aria-label="誘몃뵒????젣?섍린" data-attachment-remove-index="${index}"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></button></div></div>`;
    }

    function renderReplyImageGrid() {
        const n = attachedReplyFiles.length, urls = attachedReplyFileUrls;
        if (!replyAttachmentMedia || n === 0) return;
        if (n === 1) {
            replyAttachmentMedia.innerHTML = `<div class="media-aspect-ratio media-aspect-ratio--single"></div><div class="media-absolute-layer">${getReplyImageCell(0, urls[0], "media-cell--single")}</div>`;
            return;
        }
        if (n === 2) {
            replyAttachmentMedia.innerHTML = `<div class="media-aspect-ratio"></div><div class="media-absolute-layer"><div class="media-row"><div class="media-col">${getReplyImageCell(0, urls[0], "media-cell--left")}</div><div class="media-col">${getReplyImageCell(1, urls[1], "media-cell--right")}</div></div></div>`;
            return;
        }
        if (n === 3) {
            replyAttachmentMedia.innerHTML = `<div class="media-aspect-ratio"></div><div class="media-absolute-layer"><div class="media-row"><div class="media-col">${getReplyImageCell(0, urls[0], "media-cell--left-tall")}</div><div class="media-col">${getReplyImageCell(1, urls[1], "media-cell--right-top")}${getReplyImageCell(2, urls[2], "media-cell--right-bottom")}</div></div></div>`;
            return;
        }
        replyAttachmentMedia.innerHTML = `<div class="media-aspect-ratio"></div><div class="media-absolute-layer"><div class="media-row"><div class="media-col">${getReplyImageCell(0, urls[0], "media-cell--top-left")}${getReplyImageCell(2, urls[2], "media-cell--bottom-left")}</div><div class="media-col">${getReplyImageCell(1, urls[1], "media-cell--top-right")}${getReplyImageCell(3, urls[3], "media-cell--bottom-right")}</div></div></div>`;
    }

    function renderReplyVideoAttachment() {
        if (!replyAttachmentMedia || attachedReplyFiles.length === 0) return;
        const [file] = attachedReplyFiles, [fileUrl] = attachedReplyFileUrls;
        replyAttachmentMedia.innerHTML = `<div class="media-aspect-ratio media-aspect-ratio--single"></div><div class="media-absolute-layer"><div class="media-cell media-cell--single"><div class="media-cell-inner"><div class="media-img-container" aria-label="誘몃뵒?? role="group"><video class="tweet-modal__attachment-video" controls preload="metadata"><source src="${fileUrl}" type="${file.type}"></video></div><div class="media-btn-row"><button type="button" class="media-btn" data-attachment-edit-index="0"><span>?섏젙</span></button></div><button type="button" class="media-btn-delete" aria-label="誘몃뵒????젣?섍린" data-attachment-remove-index="0"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></button></div></div></div>`;
    }

    function renderReplyAttachment() {
        if (!replyAttachmentPreview || !replyAttachmentMedia) return;
        if (attachedReplyFiles.length === 0) {
            replyAttachmentMedia.innerHTML = "";
            replyAttachmentPreview.hidden = true;
            syncReplyMediaEditsToAttachments();
            syncUserTagTrigger();
            return;
        }
        replyAttachmentPreview.hidden = false;
        createReplyAttachmentUrls();
        syncReplyMediaEditsToAttachments();
        syncUserTagTrigger();
        if (isReplyImageSet()) {
            renderReplyImageGrid();
            return;
        }
        if (isReplyVideoSet()) {
            renderReplyVideoAttachment();
            return;
        }
        replyAttachmentMedia.innerHTML = "";
        const fp = document.createElement("div");
        const fi = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const fg = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const fpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const fn = document.createElement("span");
        fp.className = "tweet-modal__attachment-file";
        fi.setAttribute("viewBox", "0 0 24 24");
        fi.setAttribute("width", "22");
        fi.setAttribute("height", "22");
        fi.setAttribute("aria-hidden", "true");
        fpath.setAttribute("d", "M14 2H7.75C5.68 2 4 3.68 4 5.75v12.5C4 20.32 5.68 22 7.75 22h8.5C18.32 22 20 20.32 20 18.25V8l-6-6zm0 2.12L17.88 8H14V4.12zm2.25 15.88h-8.5c-.97 0-1.75-.78-1.75-1.75V5.75C6 4.78 6.78 4 7.75 4H12v5.25c0 .41.34.75.75.75H18v8.25c0 .97-.78 1.75-1.75 1.75z");
        fn.className = "tweet-modal__attachment-file-name";
        fn.textContent = attachedReplyFiles[0]?.name ?? "";
        fg.appendChild(fpath);
        fi.appendChild(fg);
        fp.appendChild(fi);
        fp.appendChild(fn);
        replyAttachmentMedia.appendChild(fp);
    }

    function removeReplyAttachment(index) {
        attachedReplyFiles = attachedReplyFiles.filter((_, i) => i !== index);
        replyMediaEdits = replyMediaEdits.filter((_, i) => i !== index);
        pendingAttachmentEditIndex = null;
        renderReplyAttachment();
        syncReplyMediaEditsToAttachments();
        syncUserTagTrigger();
    }

    function handleReplyFileChange(e) {
        const next = Array.from(e.target.files ?? []);
        if (next.length === 0) {
            pendingAttachmentEditIndex = null;
            syncReplySubmitState();
            return;
        }
        const rep = next[0];
        const vid = next.find((f) => f.type.startsWith("video/"));
        const imgs = next.filter((f) => f.type.startsWith("image/"));
        if (pendingAttachmentEditIndex !== null) {
            if (!rep) {
                pendingAttachmentEditIndex = null;
                return;
            }
            if (rep.type.startsWith("video/")) {
                attachedReplyFiles = [rep];
            } else {
                const ed = isReplyVideoSet() ? [] : [...attachedReplyFiles];
                attachedReplyFiles = ed.length === 0 ? [rep] : ((ed[pendingAttachmentEditIndex] = rep), ed.slice(0, maxReplyImages));
            }
            pendingAttachmentEditIndex = null;
            renderReplyAttachment();
            syncReplySubmitState();
            return;
        }
        if (vid) {
            attachedReplyFiles = [vid];
            renderReplyAttachment();
            syncReplySubmitState();
            return;
        }
        if (imgs.length > 0) {
            attachedReplyFiles = [...(isReplyImageSet() ? [...attachedReplyFiles] : []), ...imgs].slice(0, maxReplyImages);
            renderReplyAttachment();
            syncReplySubmitState();
            return;
        }
        attachedReplyFiles = [rep];
        renderReplyAttachment();
        syncReplySubmitState();
    }

    // ===== ?듦? 紐⑤떖 ?숆린???⑥닔 ?뱀뀡 =====
    function syncReplySubmitState() {
        if (!replyEditor) return;
        let content = replyEditor.textContent?.replace(/\u00a0/g, " ") ?? "";
        if (content.length > REPLY_MAX_LENGTH) {
            content = content.slice(0, REPLY_MAX_LENGTH);
            replyEditor.textContent = content;
            placeCaretAtEnd(replyEditor);
            saveReplySelection();
        }
        const currentLength = content.length;
        const remaining = Math.max(REPLY_MAX_LENGTH - currentLength, 0);
        const canSubmit = content.trim().length > 0 || hasReplyAttachment();
        const progress = `${Math.min(currentLength / REPLY_MAX_LENGTH, 1) * 360}deg`;
        if (replySubmitButton) replySubmitButton.disabled = !canSubmit;
        if (replyGauge) {
            replyGauge.style.setProperty("--gauge-progress", progress);
            replyGauge.setAttribute("aria-valuenow", String(currentLength));
        }
        if (replyGaugeText) replyGaugeText.textContent = String(remaining);
    }

    // 紐⑤떖 ?댁뿉??Tab ???ъ빱?ㅻ? 媛?먯뼱 ?묎렐?깆쓣 蹂댁옣?쒕떎
    function trapFocus(e) {
        if (!replyModal || e.key !== "Tab") return;
        const focusable = Array.from(
            replyModal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        ).filter((el) => !el.hasAttribute("hidden"));
        if (focusable.length === 0) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    // ===== ?꾩튂 ?좏깮 ?쒕툕酉??⑥닔 ?뱀뀡 =====
    // ?꾩튂 寃???꾪꽣
    function getFilteredLocations() {
        const q = replyLocationSearchInput?.value?.trim().toLowerCase() ?? "";
        if (!q) return cachedLocationNames;
        return cachedLocationNames.filter((l) => l.toLowerCase().includes(q));
    }

    // ?꾩튂 UI ?숆린??
    function syncLocationUI() {
        const has = Boolean(selectedLocation);
        if (replyFooterMeta) replyFooterMeta.hidden = !has;
        if (replyLocationName) replyLocationName.textContent = selectedLocation ?? "";
        if (replyLocationDisplayButton) {
            replyLocationDisplayButton.hidden = !has;
        }
        if (replyGeoButtonPath) {
            const np = has ? (replyGeoButtonPath.dataset.pathActive || replyGeoButtonPath.getAttribute("d")) : (replyGeoButtonPath.dataset.pathInactive || replyGeoButtonPath.getAttribute("d"));
            if (np) replyGeoButtonPath.setAttribute("d", np);
        }
        if (replyLocationDeleteButton) replyLocationDeleteButton.hidden = !has;
        if (replyLocationCompleteButton) replyLocationCompleteButton.disabled = !pendingLocation;
    }

    // ?꾩튂 紐⑸줉 ?뚮뜑留?
    function renderLocationList() {
        if (!replyLocationList) return;
        const locs = getFilteredLocations();
        if (locs.length === 0) {
            replyLocationList.innerHTML = '<p class="tweet-modal__location-empty">?쇱튂?섎뒗 ?꾩튂瑜?李얠? 紐삵뻽?듬땲??</p>';
            return;
        }
        replyLocationList.innerHTML = locs.map((loc) => {
            const sel = pendingLocation === loc;
            return `<button type="button" class="tweet-modal__location-item" role="menuitem"><span class="tweet-modal__location-item-label">${escapeHtml(loc)}</span><span class="tweet-modal__location-item-check">${sel ? '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg>' : ""}</span></button>`;
        }).join("");
    }

    // ?꾩튂 ?⑤꼸 ?닿린
    function openLocationPanel() {
        if (!composeView || !replyLocationView) return;
        closeEmojiPicker();
        pendingLocation = selectedLocation;
        composeView.hidden = true;
        replyLocationView.hidden = false;
        if (replyLocationSearchInput) replyLocationSearchInput.value = "";
        renderLocationList();
        syncLocationUI();
        window.requestAnimationFrame(() => {
            replyLocationSearchInput?.focus();
        });
    }

    // ?꾩튂 ?⑤꼸 ?リ린
    function closeLocationPanel({restoreFocus = true} = {}) {
        if (!composeView || !replyLocationView || replyLocationView.hidden) return;
        replyLocationView.hidden = true;
        composeView.hidden = false;
        if (replyLocationSearchInput) replyLocationSearchInput.value = "";
        pendingLocation = selectedLocation;
        renderLocationList();
        syncLocationUI();
        if (restoreFocus) window.requestAnimationFrame(() => {
            replyEditor?.focus();
        });
    }

    function applyLocation(loc) {
        selectedLocation = loc;
        pendingLocation = loc;
        syncLocationUI();
    }

    function resetLocationState() {
        selectedLocation = null;
        pendingLocation = null;
        if (replyLocationSearchInput) replyLocationSearchInput.value = "";
        renderLocationList();
        syncLocationUI();
    }

    // ===== ?꾩떆???Draft) ?쒕툕酉??⑥닔 ?뱀뀡 =====
    // ?꾩떆????⑤꼸???몄쭛 紐⑤뱶, ?뺤씤 ??붿긽?? ?좏깮 ??ぉ ?곹깭
    const draftPanelState = {
        isEditMode: false,
        confirmOpen: false,
        selectedItems: new Set(),
    };

    // ?꾩떆?????ぉ DOM ?붿냼 諛곗뿴??諛섑솚?쒕떎
    function getDraftItems() {
        return draftList
            ? Array.from(draftList.querySelectorAll(".draft-panel__item"))
            : [];
    }

    // ?꾩떆????좏깮 ?곹깭瑜?珥덇린?뷀븳??
    function clearDraftSelection() {
        draftPanelState.selectedItems.clear();
        draftPanelState.confirmOpen = false;
    }

    // ?꾩떆????몄쭛 紐⑤뱶瑜?醫낅즺?쒕떎
    function exitDraftEditMode() {
        draftPanelState.isEditMode = false;
        clearDraftSelection();
    }

    // ?꾩떆????몄쭛 紐⑤뱶瑜??쒖옉?쒕떎
    function enterDraftEditMode() {
        if (getDraftItems().length === 0) return;
        draftPanelState.isEditMode = true;
        draftPanelState.confirmOpen = false;
    }

    // ?대떦 ?붿냼媛 ?좏슚???꾩떆?????ぉ?몄? ?뺤씤?쒕떎
    function hasDraftItem(item) {
        return item instanceof HTMLElement && getDraftItems().includes(item);
    }

    // ?꾩떆?????ぉ???좏깮 ?곹깭瑜??좉??쒕떎
    function toggleDraftSelection(item) {
        if (!draftPanelState.isEditMode || !hasDraftItem(item)) return;
        draftPanelState.selectedItems.has(item)
            ? draftPanelState.selectedItems.delete(item)
            : draftPanelState.selectedItems.add(item);
        draftPanelState.confirmOpen = false;
    }

    // 紐⑤뱺 ?꾩떆?????ぉ???좏깮?섏뼱 ?덈뒗吏 ?뺤씤?쒕떎
    function areAllDraftItemsSelected() {
        const items = getDraftItems();
        return (
            items.length > 0 &&
            items.every((i) => draftPanelState.selectedItems.has(i))
        );
    }

    // ?꾩떆????꾩껜 ?좏깮/?댁젣瑜??좉??쒕떎
    function toggleDraftSelectAll() {
        if (!draftPanelState.isEditMode) return;
        const items = getDraftItems();
        if (items.length === 0) return;
        areAllDraftItemsSelected()
            ? draftPanelState.selectedItems.clear()
            : (draftPanelState.selectedItems = new Set(items));
        draftPanelState.confirmOpen = false;
    }

    // ?좏깮???꾩떆?????ぉ???덈뒗吏 ?뺤씤?쒕떎
    function hasDraftSelection() {
        return draftPanelState.selectedItems.size > 0;
    }

    // ?꾩떆?????젣 ?뺤씤 ??붿긽?먮? ?곕떎
    function openDraftConfirm() {
        if (draftPanelState.isEditMode && hasDraftSelection())
            draftPanelState.confirmOpen = true;
    }

    // ?꾩떆?????젣 ?뺤씤 ??붿긽?먮? ?ル뒗??
    function closeDraftConfirm() {
        draftPanelState.confirmOpen = false;
    }

    // ?좏깮???꾩떆?????ぉ??DOM?먯꽌 ??젣?쒕떎
    function deleteSelectedDrafts() {
        if (!hasDraftSelection()) return;
        getDraftItems().forEach((i) => {
            if (draftPanelState.selectedItems.has(i)) i.remove();
        });
        exitDraftEditMode();
    }

    // ?꾩떆????⑤꼸 ?곹깭瑜?珥덇린?뷀븳??
    function resetDraftPanel() {
        exitDraftEditMode();
        closeDraftConfirm();
    }

    // ?꾩떆????⑤꼸???대젮 ?덈뒗吏 ?뺤씤?쒕떎
    function isDraftPanelOpen() {
        return Boolean(draftView && !draftView.hidden);
    }

    // ?꾩떆?????젣 ?뺤씤 ??붿긽?먭? ?대젮 ?덈뒗吏 ?뺤씤?쒕떎
    function isDraftConfirmOpen() {
        return draftPanelState.confirmOpen;
    }

    // ?꾩떆???鍮꾩뼱?덉쓬 ?덈궡 臾멸뎄瑜?諛섑솚?쒕떎
    function getDraftEmptyCopy() {
        return {
            title: "임시 저장된 게시물이 없습니다.",
            body: "아직 게시물 준비가 되지 않았나요? 임시 저장해 두고 나중에 이어서 작성해보세요.",
        };
    }

    // ?꾩떆?????젣 ?뺤씤 臾멸뎄瑜?諛섑솚?쒕떎
    function getDraftConfirmCopy() {
        return {
            title: "전송하지 않은 게시물 삭제하기",
            body: "이 작업은 취소할 수 없으며, 선택한 전송하지 않은 게시물이 삭제됩니다.",
        };
    }

    // ?꾩떆?????ぉ??泥댄겕諛뺤뒪 ?붿냼瑜??앹꽦?쒕떎
    function buildDraftCheckbox(sel) {
        const cb = document.createElement("span");
        cb.className = `draft-panel__checkbox${sel ? " draft-panel__checkbox--checked" : ""}`;
        cb.setAttribute("aria-hidden", "true");
        cb.innerHTML =
            '<svg viewBox="0 0 24 24"><g><path d="M9.86 18a1 1 0 01-.73-.31l-3.9-4.11 1.45-1.38 3.2 3.38 7.46-8.1 1.47 1.36-8.19 8.9A1 1 0 019.86 18z"></path></g></svg>';
        return cb;
    }

    // ?꾩떆?????ぉ?ㅼ쓽 ?좏깮 ?곹깭? 泥댄겕諛뺤뒪瑜??뚮뜑留곹븳??
    function renderDraftItems() {
        if (!draftList) return;
        getDraftItems().forEach((item) => {
            const sel = draftPanelState.selectedItems.has(item);
            const old = item.querySelector(".draft-panel__checkbox");
            if (old) old.remove();
            item.className = [
                "draft-panel__item",
                draftPanelState.isEditMode
                    ? "draft-panel__item--selectable"
                    : "",
                sel ? "draft-panel__item--selected" : "",
            ]
                .filter(Boolean)
                .join(" ");
            item.setAttribute(
                "aria-pressed",
                draftPanelState.isEditMode ? String(sel) : "false",
            );
            if (draftPanelState.isEditMode)
                item.prepend(buildDraftCheckbox(sel));
        });
    }

    // HTML??.draft-panel__list / .draft-panel__empty / .draft-panel__confirm-overlay 瑜??곹깭??留욊쾶 媛깆떊?쒕떎.
    function renderDraftPanel() {
        if (!draftView) return;
        const hasItems = getDraftItems().length > 0;
        const ec = getDraftEmptyCopy(),
            cc = getDraftConfirmCopy();
        if (draftActionButton) {
            draftActionButton.textContent = draftPanelState.isEditMode
                ? "?꾨즺"
                : "?섏젙";
            draftActionButton.disabled = !hasItems;
            draftActionButton.classList.toggle(
                "draft-panel__action--done",
                draftPanelState.isEditMode,
            );
        }
        renderDraftItems();
        if (draftEmpty) draftEmpty.hidden = hasItems;
        if (draftEmptyTitle) draftEmptyTitle.textContent = ec.title;
        if (draftEmptyBody) draftEmptyBody.textContent = ec.body;
        if (draftFooter) draftFooter.hidden = !draftPanelState.isEditMode;
        if (draftSelectAllButton)
            draftSelectAllButton.textContent = areAllDraftItemsSelected()
                ? "紐⑤몢 ?좏깮 ?댁젣"
                : "紐⑤몢 ?좏깮";
        if (draftDeleteButton)
            draftDeleteButton.disabled = !hasDraftSelection();
        if (draftConfirmOverlay)
            draftConfirmOverlay.hidden = !draftPanelState.confirmOpen;
        if (draftConfirmTitle) draftConfirmTitle.textContent = cc.title;
        if (draftConfirmDesc) draftConfirmDesc.textContent = cc.body;
    }

    // 湲곗〈 HTML ?쒕툕酉??꾪솚: .tweet-modal__compose-view 瑜??④린怨?.tweet-modal__draft-view 瑜?蹂댁뿬以??
    function openDraftPanel() {
        if (!composeView || !draftView) return;
        renderDraftPanel();
        composeView.hidden = true;
        draftView.hidden = false;
    }

    // 湲곗〈 HTML ?쒕툕酉??꾪솚: .tweet-modal__draft-view 瑜??④린怨?.tweet-modal__compose-view 濡?蹂듦??쒕떎.
    function closeDraftPanel({restoreFocus = true} = {}) {
        if (!composeView || !draftView) return;
        resetDraftPanel();
        renderDraftPanel();
        draftView.hidden = true;
        composeView.hidden = false;
        if (restoreFocus) draftButton?.focus();
    }

    // ?대┃ ??곸뿉??媛??媛源뚯슫 ?꾩떆?????ぉ ?붿냼瑜?李얜뒗??
    function getDraftItemByElement(target) {
        return target.closest(".draft-panel__item");
    }

    // ?꾩떆?????ぉ???띿뒪?몃? ?먮뵒?곗뿉 遺덈윭?⑤떎
    function loadDraftIntoComposer(item) {
        if (!item || !replyEditor) return;
        replyEditor.textContent = getTextContent(
            item.querySelector(".draft-panel__text"),
        );
        closeDraftPanel({restoreFocus: false});
        syncReplySubmitState();
        saveReplySelection();
        window.requestAnimationFrame(() => {
            replyEditor.focus();
        });
    }

    // ===== ?듦? 紐⑤떖 ?대깽??諛붿씤???뱀뀡 =====
    // ?듦? 踰꾪듉, ?먮뵒???낅젰, ?쒖떇 踰꾪듉, ?대え吏 ?쇱빱, 誘몃뵒???낅줈??
    // ?꾩튂/?쒓렇/誘몃뵒?퀮LT/?꾩떆????먮ℓ湲 ?쒕툕酉? 紐⑤떖 ?リ린 ??紐⑤뱺 ?대깽?몃? 諛붿씤?⑺븳??
    const initializeReplyModal = () => {
        if (
            !replyModalOverlay ||
            !replyModal ||
            !replyEditor ||
            !replySubmitButton
        ) {
            return;
        }

        // ?뚮┛ 寃뚯떆臾?移대뱶???묒꽦??蹂몃Ц??紐⑤떖 ?곷떒 ?붿빟 ?곸뿭??蹂듭궗?쒕떎.
        const openReplyModal = (button) => {
            const postCard = getPostCard(button);
            const avatarSrc = getPostAvatarSrc(postCard);
            const postText = postCard?.querySelector(".postText");
            activeReplyTrigger = button;
            shouldRestoreReplyEditorAfterEmojiInsert = false;

            if (replySourceAvatar) {
                replySourceAvatar.src = avatarSrc;
                replySourceAvatar.alt = getTextContent(
                    postCard?.querySelector(".postName"),
                );
            }

            if (replyAvatar) {
                replyAvatar.src = avatarSrc;
            }

            if (replySourceName) {
                replySourceName.textContent = getTextContent(
                    postCard?.querySelector(".postName"),
                );
            }

            if (replySourceHandle) {
                replySourceHandle.textContent = getTextContent(
                    postCard?.querySelector(".postHandle"),
                );
            }

            if (replySourceTime) {
                replySourceTime.textContent = getTextContent(
                    postCard?.querySelector(".postTime"),
                );
            }

            if (replySourceText) {
                replySourceText.textContent =
                    postText?.dataset.fullText || getTextContent(postText);
            }

            replyEditor.textContent = "";
            savedReplySelection = null;
            savedReplySelectionOffsets = null;
            pendingReplyFormats = new Set();
            activeEmojiCategory = "recent";
            selectedLocation = null;
            pendingLocation = null;
            selectedTaggedUsers = [];
            pendingTaggedUsers = [];
            selectedProduct = null;
            if (replyProductButton) replyProductButton.disabled = false;
            const existingProductCard = replyModalOverlay?.querySelector("[data-selected-product]");
            if (existingProductCard) existingProductCard.remove();
            closeEmojiPicker();
            resetReplyAttachment();
            if (replyEmojiSearchInput) replyEmojiSearchInput.value = "";
            if (replyLocationSearchInput) replyLocationSearchInput.value = "";
            if (composeView) composeView.hidden = false;
            if (replyLocationView) replyLocationView.hidden = true;
            if (replyTagView) replyTagView.hidden = true;
            if (replyMediaView) replyMediaView.hidden = true;
            if (replyProductView) replyProductView.hidden = true;
            closeDraftPanel({restoreFocus: false});
            renderDraftPanel();
            renderLocationList();
            syncLocationUI();
            syncUserTagTrigger();
            syncReplyMediaEditsToAttachments();
            syncReplySubmitState();
            syncReplyFormatButtons();
            replyModalOverlay.hidden = false;
            document.body.classList.add("modal-open");
            window.requestAnimationFrame(() => {
                replyEditor.focus();
            });
        };

        // 移대뱶 ?섎떒???듦? ?≪뀡 踰꾪듉? 癒쇱? ?ㅻⅨ 怨듭쑀 UI瑜??リ퀬 ?듦? 紐⑤떖???곕떎.
        document.querySelectorAll("[data-testid='reply']").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                closeShareDropdown();
                closeShareModal();
                openReplyModal(button);
            });
        });

        // ?먮뵒???낅젰 ???쒖떇 ?곸슜, ?곹깭 ?숆린??
        replyEditor.addEventListener("input", () => {
            applyPendingReplyFormatsToContent();
            if (!hasReplyEditorText()) {
                pendingReplyFormats = new Set();
                // ?띿뒪?몃? 紐⑤몢 吏?좎쓣 ???⑥븘 ?덈뒗 ?쒖떇 span???쒓굅?댁꽌
                // ?ㅼ쓬 ?낅젰???댁쟾 ?쒖떇???곸슜?섏? ?딅룄濡??쒕떎
                replyEditor.innerHTML = "";
                // 釉뚮씪?곗????대? ?쒖떇 ?곹깭(?ㅼ쓬 ?낅젰???곸슜??bold/italic)??珥덇린?뷀븳??
                replyEditor.focus();
                if (document.queryCommandState("bold")) document.execCommand("bold", false);
                if (document.queryCommandState("italic")) document.execCommand("italic", false);
            }
            syncReplySubmitState();
            syncReplyFormatButtons();
        });
        // ?먮뵒?곗뿉????留덉슦???ъ빱???대깽?????좏깮 ?곸뿭 ???諛??쒖떇 ?숆린??
        replyEditor.addEventListener("keyup", saveReplySelection);
        replyEditor.addEventListener("keyup", syncReplyFormatButtons);
        replyEditor.addEventListener("mouseup", saveReplySelection);
        replyEditor.addEventListener("mouseup", syncReplyFormatButtons);
        replyEditor.addEventListener("focus", saveReplySelection);
        replyEditor.addEventListener("focus", syncReplyFormatButtons);
        replyEditor.addEventListener("click", syncReplyFormatButtons);

        // Ctrl+B/I ?⑥텞?ㅻ줈 援듦쾶/湲곗슱???쒖떇???곸슜?쒕떎
        replyEditor.addEventListener("keydown", (e) => {
            if (!e.ctrlKey) return;
            const key = e.key.toLowerCase();
            if (key !== "b" && key !== "i") return;
            e.preventDefault();
            applyReplyFormat(key === "b" ? "bold" : "italic");
        });

        // ?쒖떇 踰꾪듉 ?대┃ ???대떦 ?쒖떇???곸슜?쒕떎
        replyFormatButtons.forEach((btn) => {
            btn.addEventListener("mousedown", (e) => e.preventDefault());
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const fmt = btn.getAttribute("data-format");
                if (fmt) {
                    applyReplyFormat(fmt);
                    syncReplyFormatButtons();
                }
            });
        });

        // ?대え吏 踰꾪듉 ?대┃ ???대え吏 ?쇱빱瑜??좉??쒕떎
        replyEmojiButton?.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            saveReplySelection();
        });
        replyEmojiButton?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleEmojiPicker();
        });

        // 誘몃뵒???낅줈??踰꾪듉 ?대┃ ???뚯씪 ?좏깮 ??붿긽?먮? ?곕떎
        replyMediaUploadButton?.addEventListener("click", (e) => {
            e.preventDefault();
            pendingAttachmentEditIndex = null;
            if (replyFileInput) replyFileInput.value = "";
            replyFileInput?.click();
        });

        // ?뚯씪 ?좏깮 ??泥⑤??뚯씪??泥섎━?쒕떎
        replyFileInput?.addEventListener("change", handleReplyFileChange);

        // 泥⑤? 誘몃뵒???곸뿭?먯꽌 ??젣/?섏젙 踰꾪듉 ?대┃??泥섎━?쒕떎
        replyAttachmentMedia?.addEventListener("click", (e) => {
            const rm = e.target.closest("[data-attachment-remove-index]");
            if (rm) {
                const ri = Number.parseInt(rm.getAttribute("data-attachment-remove-index") ?? "-1", 10);
                if (ri >= 0) removeReplyAttachment(ri);
                syncReplySubmitState();
                return;
            }
            const eb = e.target.closest("[data-attachment-edit-index]");
            if (eb) {
                pendingAttachmentEditIndex = Number.parseInt(eb.getAttribute("data-attachment-edit-index") ?? "-1", 10);
                if (replyFileInput) replyFileInput.value = "";
                replyFileInput?.click();
            }
        });

        // ?띿뒪???좏깮 蹂寃????좏깮 ?곸뿭????ν븯怨??쒖떇 踰꾪듉???숆린?뷀븳??
        document.addEventListener("selectionchange", () => {
            if (replyModalOverlay?.hidden || !replyEditor) return;
            if (!isSelectionInsideEditor()) return;
            saveReplySelection();
            syncReplyFormatButtons();
        });

        // ?대え吏 ?쇱빱 ?대? ?대┃ ???대깽???꾪뙆瑜?留됰뒗??
        replyEmojiPicker?.addEventListener("click", (e) => e.stopPropagation());
        // ?대え吏 寃???낅젰 ???쇱빱 肄섑뀗痢좊? 媛깆떊?쒕떎
        replyEmojiSearchInput?.addEventListener("input", () => renderEmojiPickerContent());
        // ?대え吏 移댄뀒怨좊━ ???대┃ ???대떦 移댄뀒怨좊━瑜??쒖꽦?뷀븳??
        replyEmojiTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const cat = tab.getAttribute("data-emoji-category");
                if (cat) {
                    activeEmojiCategory = cat;
                    renderEmojiPicker();
                }
            });
        });
        // ?대え吏 ?듭뀡/吏?곌린 踰꾪듉 mousedown ???ъ빱???대룞??諛⑹??쒕떎
        replyEmojiContent?.addEventListener("mousedown", (e) => {
            if (e.target.closest(".tweet-modal__emoji-option, .tweet-modal__emoji-clear")) e.preventDefault();
        });
        // ?대え吏 ?대┃ ???먮뵒?곗뿉 ?쎌엯?섍퀬, 吏?곌린 ?대┃ ??理쒓렐 紐⑸줉??珥덇린?뷀븳??
        replyEmojiContent?.addEventListener("click", (e) => {
            if (e.target.closest("[data-action='clear-recent']")) {
                clearRecentEmojis();
                activeEmojiCategory = "recent";
                renderEmojiPicker();
                return;
            }
            const eb2 = e.target.closest(".tweet-modal__emoji-option");
            if (!eb2) return;
            const emoji = eb2.getAttribute("data-emoji");
            if (emoji) {
                insertReplyEmoji(emoji);
                closeEmojiPicker();
            }
        });

        // ?꾩튂 ?쒓렇 踰꾪듉 ?대┃ ???꾩튂 ?좏깮 ?⑤꼸???곕떎
        replyGeoButton?.addEventListener("click", (e) => {
            e.preventDefault();
            openLocationPanel();
        });
        // ?꾩튂 ?⑤꼸 ?リ린 踰꾪듉
        replyLocationCloseButton?.addEventListener("click", () => closeLocationPanel());
        // ?꾩튂 ??젣 踰꾪듉
        replyLocationDeleteButton?.addEventListener("click", () => {
            resetLocationState();
            closeLocationPanel();
        });
        // ?꾩튂 ?꾨즺 踰꾪듉
        replyLocationCompleteButton?.addEventListener("click", () => {
            if (pendingLocation) {
                applyLocation(pendingLocation);
                closeLocationPanel();
            }
        });
        // ?꾩튂 寃???낅젰
        replyLocationSearchInput?.addEventListener("input", () => renderLocationList());
        // ?꾩튂 ??ぉ ?대┃
        replyLocationList?.addEventListener("click", (e) => {
            const item = e.target.closest(".tweet-modal__location-item");
            if (!item) return;
            const loc = item.querySelector(".tweet-modal__location-item-label")?.textContent;
            if (loc) {
                pendingLocation = pendingLocation === loc ? null : loc;
                renderLocationList();
                if (replyLocationCompleteButton) replyLocationCompleteButton.disabled = !pendingLocation;
            }
        });
        // ?꾩튂 ?쒖떆 踰꾪듉 ?대┃ ???꾩튂 ?⑤꼸 ?닿린
        replyLocationDisplayButton?.addEventListener("click", (e) => {
            e.preventDefault();
            openLocationPanel();
        });

        // ===== ?먮ℓ湲 ?좏깮 ?쒕툕酉?=====
        replyProductButton?.addEventListener("click", (e) => {
            e.preventDefault();
            openProductSelectPanel();
        });

        productSelectClose?.addEventListener("click", () => {
            closeProductSelectPanel();
        });

        productSelectComplete?.addEventListener("click", () => {
            const checkedItem = productSelectList?.querySelector(".draft-panel__item--selected");
            if (checkedItem) {
                selectedProduct = {
                    name: checkedItem.querySelector(".draft-panel__text")?.textContent ?? "",
                    price: checkedItem.querySelector(".draft-panel__date")?.textContent ?? "",
                    image: checkedItem.querySelector(".draft-panel__avatar")?.src ?? "",
                    id: checkedItem.dataset.productId ?? "",
                };
                renderSelectedProduct();
                if (replyProductButton) replyProductButton.disabled = true;
            }
            closeProductSelectPanel();
        });

        // ?먮ℓ湲 ?좏깮 ?쒕툕酉??닿린 (compose view瑜??④린怨?product view瑜??쒖떆)
        function openProductSelectPanel() {
            if (!replyProductView) return;
            renderProductList();
            if (composeView) composeView.hidden = true;
            replyProductView.hidden = false;
        }

        // ?먮ℓ湲 ?좏깮 ?쒕툕酉??リ린 (product view瑜??④린怨?compose view瑜?蹂듭썝)
        function closeProductSelectPanel() {
            if (!replyProductView) return;
            replyProductView.hidden = true;
            if (composeView) composeView.hidden = false;
        }

        // 상품 목록을 draft-panel 스타일에 맞춰 렌더링합니다.
        function renderProductList() {
            if (!productSelectList) return;
            // TODO: REST API - GET /api/products/my 로 실제 데이터를 가져옵니다.
            const sampleProducts = [
                {
                    id: "1",
                    name: "상품 이름 1",
                    price: "₩10,000",
                    stock: "100개",
                    image: "../../static/images/main/global-gates-logo.png",
                    tags: ["#부품", "#전자"]
                },
                {
                    id: "2",
                    name: "상품 이름 2",
                    price: "₩20,000",
                    stock: "50개",
                    image: "../../static/images/main/global-gates-logo.png",
                    tags: ["#부품", "#기계"]
                },
                {
                    id: "3",
                    name: "상품 이름 3",
                    price: "₩30,000",
                    stock: "200개",
                    image: "../../static/images/main/global-gates-logo.png",
                    tags: ["#부품", "#자재"]
                },
            ];

            if (sampleProducts.length === 0) {
                productSelectList.innerHTML = "";
                if (productSelectEmpty) productSelectEmpty.hidden = false;
                return;
            }
            if (productSelectEmpty) productSelectEmpty.hidden = true;

            productSelectList.innerHTML = sampleProducts.map((p) => `
                <button type="button" class="draft-panel__item draft-panel__item--selectable" data-product-id="${escapeHtml(p.id)}" aria-pressed="false">
                    <span class="draft-panel__checkbox">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9 20c-.264 0-.518-.104-.707-.293l-4.785-4.785 1.414-1.414L9 17.586 19.072 7.5l1.42 1.416L9.708 19.7c-.188.19-.442.3-.708.3z"></path></g></svg>
                    </span>
                    <img class="draft-panel__avatar" alt="" src="${escapeHtml(p.image)}">
                    <span class="draft-panel__item-body">
                        <span class="draft-panel__text">${escapeHtml(p.name)}</span>
                        <span class="draft-panel__meta">${p.tags.join(" ")}</span>
                        <span class="draft-panel__date">${escapeHtml(p.price)} · ${escapeHtml(p.stock)}</span>
                    </span>
                </button>
            `).join("");
        }

        // 상품 클릭 시 단일 선택 상태를 반영합니다.
        productSelectList?.addEventListener("click", (e) => {
            const item = e.target.closest(".draft-panel__item");
            if (!item) return;
            const wasSelected = item.classList.contains("draft-panel__item--selected");
            productSelectList.querySelectorAll(".draft-panel__item--selected").forEach((el) => {
                el.classList.remove("draft-panel__item--selected");
                el.setAttribute("aria-pressed", "false");
                const cb = el.querySelector(".draft-panel__checkbox");
                if (cb) cb.classList.remove("draft-panel__checkbox--checked");
            });
            if (!wasSelected) {
                item.classList.add("draft-panel__item--selected");
                item.setAttribute("aria-pressed", "true");
                const cb = item.querySelector(".draft-panel__checkbox");
                if (cb) cb.classList.add("draft-panel__checkbox--checked");
            }
            if (productSelectComplete) {
                productSelectComplete.disabled = !productSelectList.querySelector(".draft-panel__item--selected");
            }
        });

        // ?좏깮???먮ℓ湲???먮뵒???꾨옒???쒖떆
        function renderSelectedProduct() {
            const existing = replyModalOverlay?.querySelector("[data-selected-product]");
            if (existing) existing.remove();
            if (!selectedProduct || !replyEditor) return;

            const card = document.createElement("div");
            card.setAttribute("data-selected-product", "");
            card.className = "tweet-modal__selected-product";
            card.innerHTML = `
                <div class="selected-product__card">
                    <img class="selected-product__image" src="${escapeHtml(selectedProduct.image)}" alt="${escapeHtml(selectedProduct.name)}">
                    <div class="selected-product__info">
                        <strong class="selected-product__name">${escapeHtml(selectedProduct.name)}</strong>
                        <span class="selected-product__price">${escapeHtml(selectedProduct.price)}</span>
                    </div>
                    <button type="button" class="selected-product__remove" aria-label="?먮ℓ湲 ?쒓굅">
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                            <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                        </svg>
                    </button>
                </div>
            `;
            card.querySelector(".selected-product__remove")?.addEventListener("click", () => {
                selectedProduct = null;
                card.remove();
                if (replyProductButton) replyProductButton.disabled = false;
            });
            replyEditor.parentElement?.appendChild(card);
        }

        // ===== ?ъ슜???쒓렇 ?쒕툕酉?=====
        replyUserTagTrigger?.addEventListener("click", (e) => {
            e.preventDefault();
            openTagPanel();
        });
        replyTagCloseButton?.addEventListener("click", (e) => {
            e.preventDefault();
            closeTagPanel();
        });
        replyTagCompleteButton?.addEventListener("click", (e) => {
            e.preventDefault();
            applyPendingTaggedUsers();
            closeTagPanel();
        });
        replyTagSearchForm?.addEventListener("submit", (e) => e.preventDefault());
        replyTagSearchInput?.addEventListener("input", () => runTagSearch());
        replyTagResults?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-tag-user-id]");
            if (!btn || btn.disabled) return;
            e.preventDefault();
            const uid = btn.getAttribute("data-tag-user-id");
            const user = currentTagResults.find((u) => u.id === uid);
            if (user && !pendingTaggedUsers.some((t) => t.id === uid)) {
                pendingTaggedUsers.push({...user});
                renderTagChipList();
                runTagSearch();
            }
        });
        replyTagChipList?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-tag-remove-id]");
            if (!btn) return;
            e.preventDefault();
            const rid = btn.getAttribute("data-tag-remove-id");
            pendingTaggedUsers = pendingTaggedUsers.filter((u) => u.id !== rid);
            renderTagChipList();
            runTagSearch();
        });

        // ===== 誘몃뵒??ALT ?몄쭛 ?쒕툕酉?=====
        replyMediaAltTrigger?.addEventListener("click", (e) => {
            e.preventDefault();
            openMediaEditor();
        });
        replyMediaBackButton?.addEventListener("click", (e) => {
            e.preventDefault();
            closeMediaEditor();
        });
        replyMediaSaveButton?.addEventListener("click", (e) => {
            e.preventDefault();
            saveReplyMediaEdits();
        });
        replyMediaPrevButton?.addEventListener("click", (e) => {
            e.preventDefault();
            if (activeReplyMediaIndex > 0) {
                activeReplyMediaIndex--;
                renderMediaEditor();
            }
        });
        replyMediaNextButton?.addEventListener("click", (e) => {
            e.preventDefault();
            if (activeReplyMediaIndex < pendingReplyMediaEdits.length - 1) {
                activeReplyMediaIndex++;
                renderMediaEditor();
            }
        });
        replyMediaAltInput?.addEventListener("input", () => {
            const edit = getCurrentPendingReplyMediaEdit();
            edit.alt = replyMediaAltInput.value;
            if (replyMediaAltCount) replyMediaAltCount.textContent = `${edit.alt.length} / ${maxReplyMediaAltLength.toLocaleString()}`;
        });

        // ===== Draft Panel ?대깽??諛붿씤??=====
        // ?꾩떆???踰꾪듉 ?대┃ ???꾩떆????⑤꼸???곕떎
        draftButton?.addEventListener("click", (e) => {
            e.preventDefault();
            openDraftPanel();
        });
        // ?꾩떆????ㅻ줈媛湲??대┃ ???⑤꼸???ル뒗??
        draftBackButton?.addEventListener("click", (e) => {
            e.preventDefault();
            closeDraftPanel();
        });
        // ?섏젙/?꾨즺 踰꾪듉 ?대┃ ???몄쭛 紐⑤뱶瑜??좉??쒕떎
        draftActionButton?.addEventListener("click", (e) => {
            e.preventDefault();
            draftPanelState.isEditMode ? exitDraftEditMode() : enterDraftEditMode();
            renderDraftPanel();
        });
        // ?꾩껜 ?좏깮 踰꾪듉 ?대┃ ??紐⑤뱺 ??ぉ ?좏깮/?댁젣瑜??좉??쒕떎
        draftSelectAllButton?.addEventListener("click", (e) => {
            e.preventDefault();
            toggleDraftSelectAll();
            renderDraftPanel();
        });
        // ??젣 踰꾪듉 ?대┃ ????젣 ?뺤씤 ??붿긽?먮? ?곕떎
        draftDeleteButton?.addEventListener("click", (e) => {
            e.preventDefault();
            openDraftConfirm();
            renderDraftPanel();
        });
        // ??젣 ?뺤씤 踰꾪듉 ?대┃ ???좏깮????ぉ????젣?쒕떎
        draftConfirmDeleteButton?.addEventListener("click", (e) => {
            e.preventDefault();
            deleteSelectedDrafts();
            renderDraftPanel();
        });
        // ??젣 痍⑥냼 踰꾪듉 ?대┃ ???뺤씤 ??붿긽?먮? ?ル뒗??
        draftConfirmCancelButton?.addEventListener("click", (e) => {
            e.preventDefault();
            closeDraftConfirm();
            renderDraftPanel();
        });
        // ??젣 ?뺤씤 諛곌꼍 ?대┃ ???뺤씤 ??붿긽?먮? ?ル뒗??
        draftConfirmBackdrop?.addEventListener("click", (e) => {
            e.preventDefault();
            closeDraftConfirm();
            renderDraftPanel();
        });

        // ?꾩떆?????ぉ ?대┃ ???몄쭛 紐⑤뱶硫??좏깮?섍퀬, ?꾨땲硫??먮뵒?곗뿉 遺덈윭?⑤떎
        draftList?.addEventListener("click", (e) => {
            const item = getDraftItemByElement(e.target);
            if (!item) return;
            if (draftPanelState.isEditMode) {
                toggleDraftSelection(item);
                renderDraftPanel();
                return;
            }
            loadDraftIntoComposer(item);
        });

        // ?듦? 紐⑤떖 ?リ린 踰꾪듉 ?대┃ ??紐⑤떖???ル뒗??
        replyCloseButton?.addEventListener("click", () => closeReplyModal());
        // ?듦? 紐⑤떖 ?ㅻ쾭?덉씠 ?대┃ ??紐⑤떖???ル뒗??
        replyModalOverlay.addEventListener("click", (event) => {
            if (event.target === replyModalOverlay) {
                closeReplyModal();
            }
        });

        // Escape ?ㅻ줈 ?대┛ ?⑤꼸/紐⑤떖???쒖꽌?濡??リ퀬 Tab?쇰줈 ?ъ빱?ㅻ? 媛?붾떎
        replyModalOverlay.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                if (isMediaEditorOpen()) {
                    closeMediaEditor();
                    return;
                }
                if (isTagModalOpen()) {
                    closeTagPanel();
                    return;
                }
                if (replyLocationView && !replyLocationView.hidden) {
                    closeLocationPanel();
                    return;
                }
                if (replyProductView && !replyProductView.hidden) {
                    closeProductSelectPanel();
                    return;
                }
                if (isDraftConfirmOpen()) {
                    closeDraftConfirm();
                    renderDraftPanel();
                    return;
                }
                if (isDraftPanelOpen()) {
                    closeDraftPanel();
                    return;
                }
                closeReplyModal();
                return;
            }
            trapFocus(e);
        });

        // ?듦? ?쒖텧 踰꾪듉 ?대┃ ???듦? ?섎? 利앷??쒗궎怨?紐⑤떖???ル뒗??
        replySubmitButton.addEventListener("click", () => {
            if (!activeReplyTrigger || replySubmitButton.disabled) {
                return;
            }

            const nextCount = updateCount(activeReplyTrigger, 1);
            activeReplyTrigger.setAttribute("aria-label", `?듦? ${nextCount}`);
            closeReplyModal({skipConfirm: true});
        });

        // ?몃? ?대┃?쇰줈 ?대え吏 ?쇱빱瑜??ル뒗??
        document.addEventListener("click", (e) => {
            if (
                replyEmojiPicker &&
                !replyEmojiPicker.hidden &&
                !replyEmojiPicker.contains(e.target) &&
                !replyEmojiButton?.contains(e.target)
            )
                closeEmojiPicker();
        });
    };

    // ===== 珥덇린???ㅽ뻾 ?뱀뀡 =====
    // ?붾㈃???꾩슂??紐⑤뱺 ?곹샇?묒슜????踰덉뿉 ?곌껐?쒕떎.
    initializeTabs();
    initializePeriodChips();
    initializeFilterDropdown();
    initializePostTextToggles();
    initializePostMoreMenus();
    initializeLikeButtons();
    initializeBookmarkButtons();
    initializeShareButtons();
    initializeReplyModal();

    // 珥덇린 UI ?곹깭 ?ㅼ젙
    renderLocationList();
    syncLocationUI();
    syncUserTagTrigger();

    // ?몃? ?쇱씠釉뚮윭由ш? ?덉쑝硫?湲곗〈 ?대え吏 踰꾪듉怨??곌껐?쒕떎
    ensureReplyEmojiLibraryPicker();

    // 李??ш린 蹂寃????대え吏 ?쇱빱 ?꾩튂瑜??ш퀎?고븳??
    window.addEventListener(
        "resize",
        () => {
            if (replyEmojiPicker && !replyEmojiPicker.hidden)
                updateEmojiPickerPosition();
        },
        {passive: true},
    );
    // ?ㅽ겕濡????대え吏 ?쇱빱 ?꾩튂瑜??ш퀎?고븳??
    window.addEventListener(
        "scroll",
        () => {
            if (replyEmojiPicker && !replyEmojiPicker.hidden)
                updateEmojiPickerPosition();
        },
        {passive: true},
    );

    // ===== ?꾩뿭 ?リ린 ?몃뱾???뱀뀡 =====
    // 諛붽묑 ?곸뿭 ?대┃ ???대젮 ?덈뒗 ?쒕∼?ㅼ슫/硫붾돱留??ル뒗??
    // Escape ?ㅻ줈 ?꾩옱 ?대젮 ?덈뒗 蹂댁“ UI瑜?紐⑤몢 ?ル뒗??
    document.addEventListener("click", (event) => {
        if (
            filterMenu &&
            !filterMenu.hidden &&
            !filterMenu.contains(event.target) &&
            !filterTrigger?.contains(event.target)
        ) {
            closeFilterMenu();
        }

        if (
            activePostMoreMenu &&
            !activePostMoreMenu.contains(event.target) &&
            !activePostMoreButton?.contains(event.target)
        ) {
            closePostMoreMenu();
        }

        // ?숈쟻 ?붾낫湲??쒕∼?ㅼ슫 諛붽묑 ?대┃ ???リ린
        if (
            activeMoreDropdown &&
            !activeMoreDropdown.contains(event.target) &&
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

    // Escape???꾩옱 ?대젮 ?덈뒗 蹂댁“ UI瑜?紐⑤몢 ?ル뒗 怨듯넻 ?⑥텞?ㅻ떎.
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        closeNotificationModal();
        closeShareModal();
        closeShareDropdown();
        closeMoreDropdown();
        closePostMoreMenu();
        closeFilterMenu();
    });
};

// ===== ?꾩뿭 ?좏떥由ы떚 ?⑥닔 =====
// contenteditable??怨듯넻?쇰줈 ?곕뒗 而ㅼ꽌 ?대룞 ?좏떥?대떎.
function placeCaretAtEnd(element) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}

window.addEventListener("load", () => {
    const activityPanel = document.querySelector('[data-inquiry-panel="activity"]');
    if (!activityPanel) return;

    const toolbarBottom = activityPanel.querySelector(".activity-toolbar-bottom");
    if (!toolbarBottom) return;
    const startDateInput = activityPanel.querySelector("[data-activity-date-start]");
    const endDateInput = activityPanel.querySelector("[data-activity-date-end]");
    const quickPeriodChips = Array.from(activityPanel.querySelectorAll("[data-period-chip]"));

    const escapeHtml = (value) =>
        String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");

    const getInitial = (nickname, handle) => {
        const base = nickname?.trim() || handle?.replace("@", "")?.trim() || "?";
        return escapeHtml(base.slice(0, 1).toUpperCase());
    };

    const staticCards = Array.from(activityPanel.querySelectorAll(".postCard"));
    staticCards.forEach((card) => card.remove());

    let listElement = activityPanel.querySelector("[data-activity-post-list]");
    if (!listElement) {
        listElement = document.createElement("section");
        listElement.className = "activity-post-list";
        listElement.setAttribute("data-activity-post-list", "");
        toolbarBottom.insertAdjacentElement("afterend", listElement);
    }

    let emptyElement = activityPanel.querySelector("[data-activity-empty]");
    if (!emptyElement) {
        emptyElement = document.createElement("section");
        emptyElement.className = "draft-panel__empty";
        emptyElement.hidden = true;
        emptyElement.setAttribute("data-activity-empty", "");
        emptyElement.innerHTML = `
            <strong class="draft-panel__empty-title">嫄곕옒泥??쒕룞???꾩쭅 ?놁뒿?덈떎.</strong>
            <p class="draft-panel__empty-body">?붾줈?고븳 嫄곕옒泥섍? ?묒꽦??寃뚯떆湲???앷린硫??닿납???쒖떆?⑸땲??</p>
        `;
        listElement.insertAdjacentElement("afterend", emptyElement);
    }

    let moreWrap = activityPanel.querySelector("[data-activity-more-wrap]");
    if (!moreWrap) {
        moreWrap = document.createElement("div");
        moreWrap.setAttribute("data-activity-more-wrap", "");
        moreWrap.style.display = "flex";
        moreWrap.style.justifyContent = "center";
        moreWrap.style.margin = "24px 0 8px";
        emptyElement.insertAdjacentElement("afterend", moreWrap);
    }

    let moreButton = activityPanel.querySelector("[data-activity-more]");
    if (!moreButton) {
        moreButton = document.createElement("button");
        moreButton.type = "button";
        moreButton.className = "draft-panel__action";
        moreButton.hidden = true;
        moreButton.textContent = "??蹂닿린";
        moreButton.setAttribute("data-activity-more", "");
        moreWrap.appendChild(moreButton);
    }

    const countLabel = activityPanel.querySelector("[data-activity-count-text]") || activityPanel.querySelector(".activity-filter-button span[data-activity-filter-label]");
    let currentPage = 1;
    let totalLoaded = 0;
    let isLoading = false;
    let activePeriod = "7D";

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const applyPeriodRange = (period) => {
        const end = new Date();
        const start = new Date(end);

        if (period === "7D") start.setDate(end.getDate() - 6);
        if (period === "2W") start.setDate(end.getDate() - 13);
        if (period === "4W") start.setDate(end.getDate() - 27);
        if (period === "3M") start.setMonth(end.getMonth() - 3);

        if (startDateInput) startDateInput.value = formatDate(start);
        if (endDateInput) endDateInput.value = formatDate(end);
    };

    const syncPeriodChipState = (period) => {
        quickPeriodChips.forEach((chip) => {
            chip.classList.toggle("period-chip--active", chip.dataset.periodChip === period);
        });
    };

    const renderHashtags = (hashtags = []) => {
        if (!hashtags.length) return "";
        return `
            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:14px;">
                ${hashtags.map((tag) => `<span class="period-chip">#${escapeHtml(tag.tagName)}</span>`).join("")}
            </div>
        `;
    };

    const renderMedia = (post) => {
        if (!post.fileUrls || post.fileUrls.length === 0) return "";
        const firstUrl = post.fileUrls[0];
        if (!firstUrl || !/^https?:\/\//.test(firstUrl)) return "";

        return `
            <div class="postMedia">
                <img src="${escapeHtml(firstUrl)}" alt="게시글 이미지" class="postMediaImage"/>
            </div>
        `;
    };

    const renderCard = (post) => `
        <article class="postCard" data-post-id="${post.id}">
            <div class="postAvatar">${getInitial(post.memberNickname, post.memberHandle)}</div>
            <div class="postBody">
                <header class="postHeader">
                    <div class="postIdentity">
                        <strong class="postName">${escapeHtml(post.memberNickname || "이름 없는 거래처")}</strong>
                        <span class="postHandle">${escapeHtml(post.memberHandle || "")}</span>
                        <span class="postTime">${escapeHtml(post.createdDatetime || "")}</span>
                    </div>
                </header>
                <p class="postText">${escapeHtml(post.postContent || "")}</p>
                ${renderMedia(post)}
                ${renderHashtags(post.hashtags)}
                <footer class="postFooter" style="display:flex; gap:18px; color:#536471; font-size:14px; margin-top:14px;">
                    <span>좋아요 ${post.likeCount ?? 0}</span>
                    <span>댓글 ${post.replyCount ?? 0}</span>
                    <span>북마크 ${post.bookmarkCount ?? 0}</span>
                </footer>
            </div>
        </article>
    `;

    const updateSummary = () => {
        if (!countLabel) return;
        countLabel.textContent = totalLoaded > 0 ? `활동 ${totalLoaded}건` : "거래처 활동";
    };

    const toggleEmpty = (hasPosts) => {
        emptyElement.hidden = hasPosts;
        listElement.hidden = !hasPosts;
    };

    const fetchPage = async (page) => {
        const params = new URLSearchParams();
        if (startDateInput?.value) params.set("startDate", startDateInput.value);
        if (endDateInput?.value) params.set("endDate", endDateInput.value);

        const response = await fetch(`/api/inquiry/activity/list/${page}?${params.toString()}`, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`嫄곕옒泥??쒕룞 紐⑸줉 議고쉶 ?ㅽ뙣: ${response.status}`);
        }

        return response.json();
    };

    const loadPage = async (page) => {
        if (isLoading) return;

        isLoading = true;
        moreButton.disabled = true;

        try {
            const data = await fetchPage(page);
            const posts = data.posts ?? [];
            const hasMore = Boolean(data.criteria?.hasMore);

            if (page === 1) {
                listElement.innerHTML = "";
                totalLoaded = 0;
            }

            if (posts.length > 0) {
                listElement.insertAdjacentHTML("beforeend", posts.map(renderCard).join(""));
                totalLoaded += posts.length;
            }

            toggleEmpty(totalLoaded > 0);
            updateSummary();
            moreButton.hidden = !hasMore;
            currentPage = page;
        } catch (error) {
            console.error(error);
            toggleEmpty(false);
            if (countLabel) {
                countLabel.textContent = "議고쉶 ?ㅽ뙣";
            }
            moreButton.hidden = true;
        } finally {
            isLoading = false;
            moreButton.disabled = false;
        }
    };

    moreButton.addEventListener("click", () => {
        loadPage(currentPage + 1);
    });

    quickPeriodChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            activePeriod = chip.dataset.periodChip || "7D";
            syncPeriodChipState(activePeriod);
            applyPeriodRange(activePeriod);
            loadPage(1);
        });
    });

    startDateInput?.addEventListener("change", () => {
        activePeriod = "";
        syncPeriodChipState(activePeriod);
        loadPage(1);
    });

    endDateInput?.addEventListener("change", () => {
        activePeriod = "";
        syncPeriodChipState(activePeriod);
        loadPage(1);
    });

    syncPeriodChipState(activePeriod);
    applyPeriodRange(activePeriod);
    loadPage(1);
});
