document.addEventListener("DOMContentLoaded", () => {
    /*
     * 이 파일은 setting.html 안의 설정 페이지 전체 상호작용을 담당한다.
     * 사용 위치:
     * - 좌측 설정 메뉴(`#settingsNavigationList`)
     * - 우측 상세 패널(`#settingsDetailTitle`, `#settingsDetailSummary`, `#settingsDetailList`)
     * - 표시 모달(`#appearanceModal`)
     * - 키보드 단축키 모달(`#shortcutModal`)
     *
     * 동작 구조:
     * 1. 문서에서 필요한 DOM을 한 번에 찾는다.
     * 2. 분석 문서 기준의 설정 데이터와 SVG path를 JS 데이터로 선언한다.
     * 3. 좌측 메뉴와 우측 상세 항목을 이 데이터로 렌더링한다.
     * 4. 검색, 섹션 선택, 모달 열기/닫기, 표시 테마 변경을 이벤트로 연결한다.
     */

    const settingsShell = document.querySelector(".settings-shell");
    const navigationList = document.getElementById("settingsNavigationList");
    const searchInput = document.getElementById("settingsSearchInput");
    const detailBackButton = document.getElementById(
        "settingsDetailBackButton",
    );
    const detailTitle = document.getElementById("settingsDetailTitle");
    const detailActionButton = document.getElementById(
        "settingsDetailActionButton",
    );
    const detailContent = document.getElementById("settingsDetailContent");
    const detailRoutes = document.getElementById("settingsDetailRoutes");
    const modalLayer = document.getElementById("settingsModalLayer");
    const appearanceModal = document.getElementById("appearanceModal");
    const shortcutModal = document.getElementById("shortcutModal");
    const languageSelectionModal = document.getElementById(
        "languageSelectionModal",
    );
    const languageSelectionModalTitle = document.getElementById(
        "languageSelectionModalTitle",
    );
    const languageSelectionBackButton = document.getElementById(
        "languageSelectionBackButton",
    );
    const languageSelectionSummary = document.getElementById(
        "languageSelectionSummary",
    );
    const languageSelectionSearch = document.getElementById(
        "languageSelectionSearch",
    );
    const languageSelectionSearchInput = document.getElementById(
        "languageSelectionSearchInput",
    );
    const languageSelectionList = document.getElementById(
        "languageSelectionList",
    );
    const languageSelectionMoreButton = document.getElementById(
        "languageSelectionMoreButton",
    );
    const languageSelectionNextButton = document.getElementById(
        "languageSelectionNextButton",
    );
    const languageSelectionSkipButton = document.getElementById(
        "languageSelectionSkipButton",
    );
    const phoneAddModal = document.getElementById("phoneAddModal");
    const phoneVerifyModal = document.getElementById("phoneVerifyModal");
    const phoneAddInput = document.getElementById("phoneAddInput");
    const phoneAddCloseButton = document.getElementById("phoneAddCloseButton");
    const phoneAddActionButton = document.getElementById(
        "phoneAddActionButton",
    );
    const phoneAddStep = document.getElementById("phoneAddStep");
    const phoneCodeStep = document.getElementById("phoneCodeStep");
    const phoneCodeNumber = document.getElementById("phoneCodeNumber");
    const phoneCodeInput = document.getElementById("phoneCodeInput");
    const phoneCodeHelp = document.getElementById("phoneCodeHelp");
    const phoneCodeHelpButton = document.getElementById("phoneCodeHelpButton");
    const phoneCodeHelpMenu = document.getElementById("phoneCodeHelpMenu");
    const phoneCodeResendButton = document.getElementById(
        "phoneCodeResendButton",
    );
    const phoneCodeActionButton = document.getElementById(
        "phoneCodeActionButton",
    );
    const phoneVerifyNumber = document.getElementById("phoneVerifyNumber");
    const phoneVerifyConfirmButton = document.getElementById(
        "phoneVerifyConfirmButton",
    );
    const phoneVerifyEditButton = document.getElementById(
        "phoneVerifyEditButton",
    );
    const emailAddModal = document.getElementById("emailAddModal");
    const emailVerifyModal = document.getElementById("emailVerifyModal");
    const emailAddInput = document.getElementById("emailAddInput");
    const emailAddCloseButton = document.getElementById("emailAddCloseButton");
    const emailAddActionButton = document.getElementById(
        "emailAddActionButton",
    );
    const emailAddStep = document.getElementById("emailAddStep");
    const emailCodeStep = document.getElementById("emailCodeStep");
    const emailCodeAddress = document.getElementById("emailCodeAddress");
    const emailCodeInput = document.getElementById("emailCodeInput");
    const emailCodeHelp = document.getElementById("emailCodeHelp");
    const emailCodeHelpButton = document.getElementById("emailCodeHelpButton");
    const emailCodeHelpMenu = document.getElementById("emailCodeHelpMenu");
    const emailCodeResendButton = document.getElementById(
        "emailCodeResendButton",
    );
    const emailCodeActionButton = document.getElementById(
        "emailCodeActionButton",
    );
    const emailVerifyAddress = document.getElementById("emailVerifyAddress");
    const emailVerifyConfirmButton = document.getElementById(
        "emailVerifyConfirmButton",
    );
    const emailVerifyEditButton = document.getElementById(
        "emailVerifyEditButton",
    );
    const appearanceFontRange = document.getElementById("appearanceFontRange");
    const appearanceAccentList = document.getElementById(
        "appearanceAccentList",
    );
    const appearanceSurfaceList = document.getElementById(
        "appearanceSurfaceList",
    );
    const appearanceCompleteButton = document.getElementById(
        "appearanceCompleteButton",
    );

    if (
        !settingsShell ||
        !navigationList ||
        !searchInput ||
        !detailBackButton ||
        !detailTitle ||
        !detailActionButton ||
        !detailContent ||
        !detailRoutes ||
        !modalLayer ||
        !appearanceModal ||
        !shortcutModal ||
        !languageSelectionModal ||
        !languageSelectionModalTitle ||
        !languageSelectionBackButton ||
        !languageSelectionSummary ||
        !languageSelectionSearch ||
        !languageSelectionSearchInput ||
        !languageSelectionList ||
        !languageSelectionMoreButton ||
        !languageSelectionNextButton ||
        !languageSelectionSkipButton ||
        !phoneAddModal ||
        !phoneVerifyModal ||
        !phoneAddInput ||
        !phoneAddCloseButton ||
        !phoneAddActionButton ||
        !phoneAddStep ||
        !phoneCodeStep ||
        !phoneCodeNumber ||
        !phoneCodeInput ||
        !phoneCodeHelp ||
        !phoneCodeHelpButton ||
        !phoneCodeHelpMenu ||
        !phoneCodeResendButton ||
        !phoneCodeActionButton ||
        !phoneVerifyNumber ||
        !phoneVerifyConfirmButton ||
        !phoneVerifyEditButton ||
        !emailAddModal ||
        !emailVerifyModal ||
        !emailAddInput ||
        !emailAddCloseButton ||
        !emailAddActionButton ||
        !emailAddStep ||
        !emailCodeStep ||
        !emailCodeAddress ||
        !emailCodeInput ||
        !emailCodeHelp ||
        !emailCodeHelpButton ||
        !emailCodeHelpMenu ||
        !emailCodeResendButton ||
        !emailCodeActionButton ||
        !emailVerifyAddress ||
        !emailVerifyConfirmButton ||
        !emailVerifyEditButton ||
        !appearanceFontRange ||
        !appearanceAccentList ||
        !appearanceSurfaceList ||
        !appearanceCompleteButton
    ) {
        return;
    }

    /*
     * SVG path 데이터는 분석 문서에 정리된 아이콘을 그대로 사용한다.
     * 오른쪽 상세 패널의 각 항목은 왼쪽 아이콘 + 텍스트 + 오른쪽 화살표 구조를 공통으로 공유한다.
     */
    const icons = {
        arrow: "M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z",
        external: "M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z",
        account:
            "M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z",
        key: "M13 9.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9.14 1.77l-5.83 5.84-4-1L6.41 22H2v-4.41l5.89-5.9-1-4 5.84-5.83 7.06 2.35 2.35 7.06zm-12.03 1.04L4 18.41V20h1.59l6.1-6.11 4 1 4.17-4.16-1.65-4.94-4.94-1.65-4.16 4.17 1 4z",
        download:
            "M2.01 17.5l-.11-1.1c-.26-2.66-1.16-4.89-2.63-6.46l-.01-.01C.64 8.35 2.65 7.5 5.01 7.5s4.37.85 5.86 2.44c1.48 1.58 2.37 3.8 2.63 6.46l.11 1.1h-11.6zM5.01 1c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm17 6.72L17.59 9.3l-4.42 4.42L17.59 18.14l4.42-4.42zM17.59 7.89l5.13 5.13-5.13 5.13-5.13-5.13 5.13-5.13z",
        deactivate:
            "M8.28 21.634l.496.278a.15.15 0 00.187-.026l1.043-1.09c.052-.055.04-.143-.023-.184l-1.782-1.15c-.064-.042-.153-.012-.178.061l-.42 1.219c-.026.075.01.152.083.186l.594.306zM21.078 3.48c-1.583-1.58-4.03-1.88-5.933-.9l-.32.165-2.723 7.53L3.72 18.66l3.72 2.4L21.08 7.42c.977-1.9.677-4.36-.903-5.94zM3.44 19.466l-.402-.26a.318.318 0 01-.1-.434l1.166-1.94 1.572 1.015-1.805 1.698a.315.315 0 01-.43-.079z",
        filter: "M14 6V3h2v8h-2V8H3V6h11zm7 2h-3.5V6H21v2zM8 16v-3h2v8H8v-3H3v-2h5zm13 2h-9.5v-2H21v2z",
        preferences:
            "M7 17h6v2H7v-2zm7.5-15C15.88 2 17 3.12 17 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-9C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h9zM5 19.5c0 .28.22.5.5.5h9c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-9c-.28 0-.5.22-.5.5v15zm15.74-3.49l1.64 1.15C23.4 15.7 24 13.92 24 12s-.6-3.7-1.62-5.16l-1.64 1.15C21.53 9.13 22 10.51 22 12s-.47 2.87-1.26 4.01zm-.82-7.45l-1.64 1.15c.45.65.72 1.43.72 2.29 0 .85-.27 1.64-.72 2.29l1.64 1.15C20.6 14.47 21 13.28 21 12s-.4-2.47-1.08-3.44z",
        accessibility:
            "M14.828 9.172c-1.315-1.315-3.326-1.522-4.86-.618L3.707 2.293 2.293 3.707l2.428 2.429c-2.478 2.421-3.606 5.376-3.658 5.513L.932 12l.131.351C1.196 12.704 4.394 21 12 21c2.063 0 3.989-.622 5.737-1.849l2.556 2.556 1.414-1.414-6.261-6.261c.904-1.534.698-3.545-.618-4.86zm-1.414 1.414c.522.522.695 1.264.518 1.932l-2.449-2.449c.669-.177 1.409-.005 1.931.517zM3.085 11.999c.107-.24.272-.588.497-1.002l7.993 7.992c-5.14-.279-7.85-5.563-8.489-6.989zm13.21 5.71c-.695.448-1.422.781-2.175.996L4.672 9.258c.412-.57.899-1.158 1.464-1.708l10.16 10.16h-.001zm6.772-5.71l-.131.352c-.062.164-.801 2.055-2.33 4.027l-1.438-1.438c.917-1.217 1.494-2.378 1.746-2.941-.658-1.467-3.5-7-8.915-7-.712 0-1.376.1-2 .27V3.223c.633-.131 1.291-.223 2-.223 7.605 0 10.804 8.296 10.937 8.648l.131.352z",
        display:
            "M18.36 2.62c-.14-.14-.32-.21-.5-.21h-.01c-.19 0-.37.08-.51.22l-1.76 1.82-3.18-1.49L6 9.36l3.66 3.66-6.36 6.36 1.42 1.42 6.36-6.36 3.66 3.66 6.4-6.4-1.49-3.18 1.82-1.76c.14-.14.22-.32.22-.51v-.01c0-.19-.07-.37-.21-.5l-3.12-3.12zM17 14.25L9.75 7l4.19-4.19 2.53 1.19-2.11 2.18 3.47 3.47 2.18-2.11 1.19 2.53L17 14.25z",
        language:
            "M11.999 22.25c-5.652 0-10.25-4.598-10.25-10.25S6.347 1.75 11.999 1.75 22.249 6.348 22.249 12s-4.598 10.25-10.25 10.25zm0-18.5c-4.549 0-8.25 3.701-8.25 8.25s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25-3.701-8.25-8.25-8.25zM13.21 6.134c.57 1.242.928 2.726 1.027 4.366H9.762c.1-1.64.457-3.124 1.027-4.366.526-1.148 1.134-1.822 1.71-1.884.058-.006.166-.006.224 0 .577.062 1.185.736 1.711 1.884h-.224zm-4.451 4.366c.103-1.775.497-3.39 1.13-4.674C7.573 6.636 5.877 8.711 5.38 10.5h3.38zm5.481 0H17.62c-.497-1.789-2.193-3.864-4.508-4.674.633 1.284 1.027 2.899 1.13 4.674h-.002zm-4.478 2c.103 1.775.497 3.39 1.13 4.674-2.316-.81-4.012-2.885-4.508-4.674h3.38-.002zm1.027 4.366c-.57-1.242-.928-2.726-1.027-4.366h4.476c-.1 1.64-.457 3.124-1.027 4.366-.526 1.148-1.134 1.822-1.71 1.884-.058.006-.166.006-.224 0-.577-.062-1.185-.736-1.711-1.884h.224-.001zm4.451-4.366c-.103 1.775-.497 3.39-1.13 4.674 2.316-.81 4.012-2.885 4.508-4.674h-3.38.002z",
        add: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z",
        mute: "M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z",
        data: "M2 3v18h20v-2H4V3H2zm5 14h2V9H7v8zm4 0h2V6h-2v11zm4 0h2v-5h-2v5z",
        shortcuts:
            "M11.999 22.25c-5.652 0-10.25-4.598-10.25-10.25S6.347 1.75 11.999 1.75 22.249 6.348 22.249 12s-4.598 10.25-10.25 10.25zm0-18.5c-4.549 0-8.25 3.701-8.25 8.25s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25-3.701-8.25-8.25-8.25zm.445 6.992c1.747-.096 3.748-.689 3.768-.695l.575 1.916c-.077.022-1.616.48-3.288.689v.498c.287 1.227 1.687 2.866 2.214 3.405l-1.428 1.4c-.188-.191-1.518-1.576-2.286-3.144-.769 1.568-2.098 2.952-2.286 3.144l-1.428-1.4c.527-.54 1.927-2.178 2.214-3.405v-.498c-1.672-.209-3.211-.667-3.288-.689l.575-1.916c.02.006 2.021.6 3.768.695m0 0c.301.017.59.017.891 0M12 6.25c-.967 0-1.75.78-1.75 1.75s.783 1.75 1.75 1.75 1.75-.78 1.75-1.75-.784-1.75-1.75-1.75z",
    };


    const accentOptions = [
        {id: "blue", label: "기본", color: "#1d9bf0"},
        {id: "yellow", label: "노랑", color: "#ffd400"},
        {id: "pink", label: "핑크", color: "#f91880"},
        {id: "purple", label: "보라", color: "#7856ff"},
        {id: "orange", label: "주황", color: "#ff7a00"},
        {id: "green", label: "초록", color: "#00ba7c"},
    ];

    const surfaceOptions = [
        {id: "light", label: "기본", color: "#ffffff"},
        {id: "dim", label: "어두운", color: "#15202b"},
        {id: "lights-out", label: "완전 어두운", color: "#000000"},
    ];
    const languageSelectionOptions = [
        {id: "ko", label: "한국어 - 한국어"},
        {id: "en", label: "영어 - English"},
        {id: "en-gb", label: "영어(영국) - British English"},
        {id: "ja", label: "일본어 - 日本語"},
        {id: "es", label: "스페인어 - Español"},
        {id: "fr", label: "프랑스어 - Français"},
    ];
    const countryOptionMarkup = `
        <option value="gh">가나</option><option value="ga">가봉</option><option value="gy">가이아나</option><option value="gm">감비아</option><option value="gg">건지</option><option value="gp">과들루프</option><option value="gt">과테말라</option><option value="gu">괌</option><option value="gd">그레나다</option><option value="gr">그리스</option><option value="gl">그린란드</option><option value="gn">기니</option><option value="gw">기니비사우</option><option value="na">나미비아</option><option value="nr">나우루</option><option value="ng">나이지리아</option><option value="za">남아프리카</option><option value="nl">네덜란드</option><option value="bq">네덜란드령 카리브</option><option value="np">네팔</option><option value="no">노르웨이</option><option value="nf">노퍽섬</option><option value="nz">뉴질랜드</option><option value="nc">뉴칼레도니아</option><option value="nu">니우에</option><option value="ne">니제르</option><option value="ni">니카라과</option><option value="tw">대만</option><option value="kr">대한민국</option><option value="dk">덴마크</option><option value="dm">도미니카</option><option value="do">도미니카 공화국</option><option value="de">독일</option><option value="tl">동티모르</option><option value="la">라오스</option><option value="lr">라이베리아</option><option value="lv">라트비아</option><option value="ru">러시아</option><option value="lb">레바논</option><option value="ls">레소토</option><option value="ro">루마니아</option><option value="lu">룩셈부르크</option><option value="rw">르완다</option><option value="ly">리비아</option><option value="re">리유니온</option><option value="lt">리투아니아</option><option value="li">리히텐슈타인</option><option value="mg">마다가스카르</option><option value="mq">마르티니크</option><option value="mh">마셜 제도</option><option value="yt">마요트</option><option value="mo">마카오(중국 특별행정구)</option><option value="mk">마케도니아</option><option value="mw">말라위</option><option value="my">말레이시아</option><option value="ml">말리</option><option value="im">맨 섬</option><option value="mx">멕시코</option><option value="mc">모나코</option><option value="ma">모로코</option><option value="mu">모리셔스</option><option value="mr">모리타니</option><option value="mz">모잠비크</option><option value="me">몬테네그로</option><option value="ms">몬트세라트</option><option value="md">몰도바</option><option value="mv">몰디브</option><option value="mt">몰타</option><option value="mn">몽골</option><option value="us">미국</option><option value="vi">미국령 버진아일랜드</option><option value="fm">미크로네시아</option><option value="vu">바누아투</option><option value="bh">바레인</option><option value="bb">바베이도스</option><option value="va">바티칸 시국</option><option value="bs">바하마</option><option value="bd">방글라데시</option><option value="bm">버뮤다</option><option value="bj">베냉</option><option value="ve">베네수엘라</option><option value="vn">베트남</option><option value="be">벨기에</option><option value="by">벨라루스</option><option value="bz">벨리즈</option><option value="ba">보스니아 헤르체고비나</option><option value="bw">보츠와나</option><option value="bo">볼리비아</option><option value="bi">부룬디</option><option value="bf">부르키나파소</option><option value="bv">부베섬</option><option value="bt">부탄</option><option value="mp">북마리아나제도</option><option value="bg">불가리아</option><option value="br">브라질</option><option value="bn">브루나이</option><option value="ws">사모아</option><option value="sa">사우디아라비아</option><option value="gs">사우스조지아 사우스샌드위치 제도</option><option value="sm">산마리노</option><option value="st">상투메 프린시페</option><option value="mf">생마르탱</option><option value="bl">생바르텔레미</option><option value="pm">생피에르 미클롱</option><option value="sn">세네갈</option><option value="rs">세르비아</option><option value="sc">세이셸</option><option value="lc">세인트루시아</option><option value="vc">세인트빈센트그레나딘</option><option value="kn">세인트키츠 네비스</option><option value="sh">세인트헬레나</option><option value="so">소말리아</option><option value="sb">솔로몬 제도</option><option value="sr">수리남</option><option value="lk">스리랑카</option><option value="sz">스와질란드</option><option value="se">스웨덴</option><option value="ch">스위스</option><option value="es">스페인</option><option value="sk">슬로바키아</option><option value="si">슬로베니아</option><option value="sl">시에라리온</option><option value="sx">신트마르턴</option><option value="sg">싱가포르</option><option value="ae">아랍에미리트</option><option value="aw">아루바</option><option value="am">아르메니아</option><option value="ar">아르헨티나</option><option value="as">아메리칸 사모아</option><option value="is">아이슬란드</option><option value="ht">아이티</option><option value="ie">아일랜드</option><option value="az">아제르바이잔</option><option value="af">아프가니스탄</option><option value="ad">안도라</option><option value="al">알바니아</option><option value="dz">알제리</option><option value="ao">앙골라</option><option value="ag">앤티가 바부다</option><option value="ai">앵귈라</option><option value="er">에리트리아</option><option value="ee">에스토니아</option><option value="ec">에콰도르</option><option value="et">에티오피아</option><option value="sv">엘살바도르</option><option value="gb">영국</option><option value="io">영국령 인도양 식민지</option><option value="ye">예멘</option><option value="om">오만</option><option value="au">오스트레일리아</option><option value="at">오스트리아</option><option value="hn">온두라스</option><option value="ax">올란드 제도</option><option value="wf">왈리스-푸투나 제도</option><option value="jo">요르단</option><option value="ug">우간다</option><option value="uy">우루과이</option><option value="uz">우즈베키스탄</option><option value="ua">우크라이나</option><option value="iq">이라크</option><option value="ir">이란</option><option value="il">이스라엘</option><option value="eg">이집트</option><option value="it">이탈리아</option><option value="in">인도</option><option value="id">인도네시아</option><option value="jp">일본</option><option value="jm">자메이카</option><option value="zm">잠비아</option><option value="je">저지</option><option value="gq">적도 기니</option><option value="ge">조지아</option><option value="cf">중앙 아프리카 공화국</option><option value="dj">지부티</option><option value="gi">지브롤터</option><option value="zw">짐바브웨</option><option value="td">차드</option><option value="cz">체코</option><option value="cl">칠레</option><option value="cm">카메룬</option><option value="cv">카보베르데</option><option value="kz">카자흐스탄</option><option value="qa">카타르</option><option value="kh">캄보디아</option><option value="ca">캐나다</option><option value="ke">케냐</option><option value="ky">케이맨 제도</option><option value="km">코모로</option><option value="xk">코소보</option><option value="cr">코스타리카</option><option value="cc">코코스 제도</option><option value="ci">코트디부아르</option><option value="co">콜롬비아</option><option value="cg">콩고-브라자빌</option><option value="cd">콩고-킨샤사</option><option value="cu">쿠바</option><option value="kw">쿠웨이트</option><option value="ck">쿡 제도</option><option value="cw">퀴라소</option><option value="hr">크로아티아</option><option value="cx">크리스마스섬</option><option value="kg">키르기스스탄</option><option value="ki">키리바시</option><option value="cy">키프로스</option><option value="tj">타지키스탄</option><option value="tz">탄자니아</option><option value="th">태국</option><option value="tc">터크스 케이커스 제도</option><option value="tr">터키</option><option value="tg">토고</option><option value="tk">토켈라우</option><option value="to">통가</option><option value="tm">투르크메니스탄</option><option value="tv">투발루</option><option value="tn">튀니지</option><option value="tt">트리니다드 토바고</option><option value="pa">파나마</option><option value="py">파라과이</option><option value="pk">파키스탄</option><option value="pg">파푸아뉴기니</option><option value="pw">팔라우</option><option value="ps">팔레스타인 지구</option><option value="fo">페로 제도</option><option value="pe">페루</option><option value="pt">포르투갈</option><option value="fk">포클랜드 제도</option><option value="pl">폴란드</option><option value="pr">푸에르토리코</option><option value="fr">프랑스</option><option value="tf">프랑스 남부 지방</option><option value="gf">프랑스령 기아나</option><option value="pf">프랑스령 폴리네시아</option><option value="fj">피지</option><option value="fi">핀란드</option><option value="ph">필리핀</option><option value="pn">핏케언 섬</option><option value="hu">헝가리</option><option value="hk">홍콩(중국 특별행정구)</option>
    `;

    /*
     * Spring이 계정 기본 정보를 내려줄 1차 데이터 영역.
     * 권장 방식:
     * - 서버에서 ModelAttribute로 내려준 값을 data-* 또는 script JSON으로 주입
     * - 이 배열은 그 값을 화면 공통 포맷으로 정리한 뒤 넣는 용도
     * - id 값은 아래 syncAccountInfoListRoute / syncPhoneRoute / syncEmailRoute에서 키로 사용
     */
    const accountInfoItems = [
        {
            id: "username",
            label: "사용자 아이디",
            value: "tmtsugar",
        },
        {
            id: "phone",
            label: "휴대폰",
            value: "",
        },
        {
            id: "email",
            label: "이메일",
            value: "tjdgh1851@gmail.com",
        },
        {
            id: "createdAt",
            label: "계정 생성",
            value: "2025. 2. 3. 오후 5:02:45",
            description: "211.234.227.8 (South Korea)",
            showArrow: false,
        },
        {
            id: "country",
            label: "국가",
            value: "대한민국",
        },
        {
            id: "language",
            label: "언어",
            value: "한국어, 영어, 언어 관련 내용 없음",
        },
    ];

    /*
     * 화면 전역 UI 상태.
     * - activeSectionId: 좌측 1차 메뉴 선택 상태
     * - activeDetailRoute: 우측 상세 패널에 어떤 세부 화면을 보여줄지 결정
     * - activeModal: 현재 열린 모달 종류
     *
     * Spring 연동 시:
     * - 첫 진입 경로에 맞춰 서버에서 초기 섹션/라우트를 정해 내려줄 수 있다.
     */
    let activeSectionId = "account";
    let activeDetailRoute = "";
    let activeModal = "";
    // 표시 설정은 서버 저장 전까지 프론트 임시 상태로 유지한다.
    const appearanceState = {
        fontScale: "2",
        accent: "blue",
        surface: "light",
    };
    // 사용자 아이디 수정 화면에서 현재값/입력값/추천 노출 여부를 관리한다.
    const usernameState = {
        current: "tmtsugar",
        draft: "tmtsugar",
        isMarketplaceVisible: true,
    };
    // 비밀번호 변경 폼 입력 상태. 서버 검증 전 프론트 입력값만 담는다.
    const passwordChangeState = {
        currentPassword: "",
        nextPassword: "",
        confirmPassword: "",
    };
    // 알림 필터 상세 화면의 체크 상태. Spring이 boolean 값으로 내려주기 가장 쉬운 구조다.
    const notificationFilterState = {
        isQualityFilterEnabled: true,
        mutedNotificationOptions: {
            nonFollowing: false,
            notFollowingYou: false,
            newAccount: false,
            defaultProfile: false,
            unverifiedEmail: false,
            unverifiedPhone: false,
        },
    };
    /*
     * 푸시 알림 환경설정 상태.
     * Spring 연동 시 예시:
     * notificationPreferenceState = {
     *   isPushEnabled: dto.isPushEnabled,
     *   pushAlerts: dto.pushAlerts
     * }
     *
     * pushAlerts의 key는 HTML의 data-notification-push-check 값과 반드시 같아야 한다.
     */
    const notificationPreferenceState = {
        isPushEnabled: false,
        pushAlerts: {
            connect: true,
            expert: true,
            likes: true,
            posts: true,
            comments: true,
            chatMessages: true,
            quotes: true,
            system: true,
            mentions: true,
        },
    };
    // 내 게시물 관련 개인정보 설정 상태.
    const privacyPostsState = {
        isSensitiveMediaMarked: false,
        isLocationEnabled: true,
    };
    // 채팅 권한/필터 상태.
    const privacyChatState = {
        allow: "everyone",
        isLowQualityFilterEnabled: true,
        areReadReceiptsEnabled: true,
    };
    // 계정찾기 및 연락처 허용 상태.
    const privacyDiscoverabilityState = {
        isEmailDiscoverable: true,
        isPhoneDiscoverable: true,
    };
    // 뮤트 단어 추가 폼 상태. 저장 전 입력값을 유지하기 위한 프론트 상태다.
    const mutedWordFormState = {
        value: "",
        muteFromTimeline: true,
        muteNotifications: true,
        notificationAudience: "non-following",
        duration: "until-unmuted",
    };
    // 현재 로그인 계정 요약 정보. 비활성화 화면/헤더 등 공통 영역에서 사용한다.
    const currentAccountState = {
        displayName: "tmt",
        handle: "@tmtsugar",
        avatarUrl:
            "https://pbs.twimg.com/profile_images/1886326200253202432/j2j1wUY3_x96.jpg",
    };
    // 휴대폰 추가/인증 모달 상태. 서버 인증 API 연결 시 request body와 거의 같은 형태로 쓰기 좋다.
    const phoneModalState = {
        phoneNumber: "",
        code: "",
        step: "add",
        isHelpMenuOpen: false,
    };
    // 계정 이메일 변경 모달 상태. 알림 이메일과는 별개다.
    const emailModalState = {
        emailAddress: "",
        code: "",
        step: "add",
        isHelpMenuOpen: false,
    };
    // 언어 선택 모달 상태. 서버 저장 전 선택값을 임시로 들고 있는다.
    const languageSelectionState = {
        step: "choices",
        query: "",
        showAll: false,
        selectedIds: new Set(["ko", "en"]),
        appLanguageId: "ko",
    };

    function buildIcon(path, extraClass = "") {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="${extraClass}">
                <g><path d="${path}"></path></g>
            </svg>
        `;
    }

    function getUsernameValidationMessage(value) {
        if (/^[A-Za-z0-9_]{3,15}$/.test(value)) {
            return "";
        }

        return "사용자 아이디는 문자, 숫자, 밑줄을 포함할 수 있으며, 3~15자 사이여야 합니다.";
    }

    function buildUsernameSuggestions(value) {
        const suffixes = ["zxsc", "ph", "aby"];
        const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
        const fallbackBase = usernameState.current
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "");
        let base = sanitizedValue || fallbackBase || "user";

        if (base.length < 3) {
            base = `${base}${fallbackBase}`.slice(0, 8) || "user";
        }

        base = base.slice(0, 11);

        return suffixes.map((suffix) => `${base}${suffix}`.slice(0, 15));
    }

    function renderLanguageSelectionModal() {
        const isAppStep = languageSelectionState.step === "app";
        const normalizedQuery = languageSelectionState.query
            .trim()
            .toLowerCase();
        const filteredOptions = languageSelectionOptions.filter((option) =>
            option.label.toLowerCase().includes(normalizedQuery),
        );
        const selectedOptions = languageSelectionOptions.filter((option) =>
            languageSelectionState.selectedIds.has(option.id),
        );
        const visibleOptions = isAppStep
            ? selectedOptions
            : !normalizedQuery && !languageSelectionState.showAll
                ? filteredOptions.slice(0, 3)
                : filteredOptions;

        languageSelectionBackButton.hidden = !isAppStep;
        languageSelectionModalTitle.textContent = isAppStep
            ? "앱 언어 선택"
            : "언어 선택";
        languageSelectionSummary.textContent = isAppStep
            ? "앱의 기본 언어가 이 언어로 설정됩니다. Twitter에서 추천하는 내가 좋아할 만한 콘텐츠는 내가 선택한 다른 언어로도 표시됩니다."
            : "X 환경을 맞춤 설정하는 데 사용할 언어를 선택하세요.";
        languageSelectionSearch.hidden = isAppStep;
        languageSelectionMoreButton.hidden =
            isAppStep ||
            Boolean(normalizedQuery) ||
            filteredOptions.length <= 3 ||
            languageSelectionState.showAll;
        languageSelectionSkipButton.hidden = isAppStep;
        languageSelectionNextButton.textContent = "다음";
        languageSelectionSearchInput.value = languageSelectionState.query;
        languageSelectionList.innerHTML = visibleOptions.length
            ? visibleOptions
                .map((option) => {
                    const isChecked = isAppStep
                        ? languageSelectionState.appLanguageId === option.id
                        : languageSelectionState.selectedIds.has(option.id);
                    const boxClass = isAppStep
                        ? "language-selection__item-box language-selection__item-box--radio"
                        : "language-selection__item-box";
                    const itemClass = isAppStep
                        ? "language-selection__item language-selection__item--app"
                        : "language-selection__item";
                    const inputType = isAppStep ? "radio" : "checkbox";
                    const inputName = isAppStep
                        ? 'name="appLanguageOption"'
                        : "";

                    return `
                            <label class="${itemClass}">
                                <span class="language-selection__item-label">
                                    ${option.label}
                                </span>
                                <span class="language-selection__item-control">
                                    <input
                                        type="${inputType}"
                                        class="language-selection__item-checkbox"
                                        data-language-option-id="${option.id}"
                                        ${inputName}
                                        ${isChecked ? "checked" : ""}
                                    />
                                    <span class="${boxClass}" aria-hidden="true">
                                        ${buildIcon(
                        "M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z",
                    )}
                                    </span>
                                </span>
                            </label>
                        `;
                })
                .join("")
            : '<p class="language-selection__empty">검색 결과가 없습니다.</p>';

        languageSelectionSearchInput.disabled = isAppStep;
        const footerClassName = isAppStep
            ? "language-selection__footer language-selection__footer--compact"
            : "language-selection__footer";
        languageSelectionNextButton.parentElement.className = footerClassName;
        languageSelectionNextButton.textContent = "다음";
    }

    function getLanguagePreferenceLabel() {
        const labels = languageSelectionOptions
            .filter((option) =>
                languageSelectionState.selectedIds.has(option.id),
            )
            .map((option) => option.label.split(" - ")[0]);

        if (!labels.length) {
            return "언어를 선택하세요";
        }

        if (
            labels.length === 2 &&
            labels[0] === "한국어" &&
            labels[1] === "영어"
        ) {
            return "한국어 및 영어";
        }

        return labels.join(", ");
    }

    function getAppLanguageLabel() {
        const selectedOption = languageSelectionOptions.find(
            (option) => option.id === languageSelectionState.appLanguageId,
        );

        return selectedOption?.label.split(" - ")[0] || "한국어";
    }

    function getCombinedLanguageLabel() {
        const preferenceLabel = getLanguagePreferenceLabel();
        const appLanguageLabel = getAppLanguageLabel();

        if (preferenceLabel === "언어를 선택하세요") {
            return appLanguageLabel;
        }

        if (preferenceLabel.includes(appLanguageLabel)) {
            return preferenceLabel;
        }

        return `${appLanguageLabel}, ${preferenceLabel}`;
    }

    function resetDetailHeaderAction() {
        detailActionButton.hidden = true;
        detailActionButton.textContent = "";
        detailActionButton.innerHTML = "";
        detailActionButton.removeAttribute("data-detail-action");
        detailActionButton.removeAttribute("aria-label");
    }

    function setDetailHeaderAction({
                                       label = "",
                                       iconPath = "",
                                       ariaLabel,
                                       action,
                                   }) {
        detailActionButton.hidden = false;
        detailActionButton.textContent = label;
        detailActionButton.innerHTML = iconPath
            ? buildIcon(iconPath, "panel-header__action-icon")
            : label;
        detailActionButton.dataset.detailAction = action;
        detailActionButton.setAttribute("aria-label", ariaLabel);
    }

    /*
     * 우측 상세 패널에는 "섹션 기본 목록" 외에 하위 라우트 화면이 들어올 수 있다.
     * 현재는 사용자가 요청한 `계정 > 계정 정보` 비밀번호 확인 화면만 구현한다.
     */
    function hideDetailRouteViews() {
        detailRoutes?.querySelectorAll("[data-detail-route-view]").forEach((routeView) => {
            if (!(routeView instanceof HTMLElement)) {
                return;
            }

            routeView.hidden = true;
            routeView.setAttribute("aria-hidden", "true");
        });
    }

    function showDetailRouteView(routeName) {
        const nextRouteView = detailRoutes?.querySelector(
            `[data-detail-route-view="${routeName}"]`,
        );

        detailRoutes?.querySelectorAll("[data-detail-route-view]").forEach((routeView) => {
            if (!(routeView instanceof HTMLElement)) {
                return;
            }

            routeView.hidden = routeView !== nextRouteView;
            routeView.setAttribute("aria-hidden", String(routeView !== nextRouteView));
        });

        return nextRouteView instanceof HTMLElement ? nextRouteView : null;
    }

    function bindRouteOnce(routeRoot, datasetKey, setup) {
        if (!(routeRoot instanceof HTMLElement)) {
            return;
        }

        if (routeRoot.dataset[datasetKey] === "true") {
            return;
        }

        setup(routeRoot);
        routeRoot.dataset[datasetKey] = "true";
    }

    // buildAccountInfoListMarkup은 HTML에 정적으로 삽입되어 삭제됨

    function buildUsernameSuggestionMarkup(value) {
        return buildUsernameSuggestions(value)
            .map(
                (suggestion) => `
                    <button
                        type="button"
                        class="username-suggestion__item"
                        data-username-suggestion="${suggestion}"
                    >
                        ${suggestion}
                    </button>
                `,
            )
            .join("");
    }

    function applyAccountInfoAuthState(routeRoot) {
        const passwordField = routeRoot.querySelector("[data-password-field]");
        const passwordInput = routeRoot.querySelector("[data-account-auth-input]");
        const authSubmitButton = routeRoot.querySelector("[data-account-auth-submit]");

        if (
            !(passwordField instanceof HTMLElement) ||
            !(passwordInput instanceof HTMLInputElement) ||
            !(authSubmitButton instanceof HTMLButtonElement)
        ) {
            return;
        }

        const isActive =
            document.activeElement === passwordInput || passwordInput.value.length > 0;
        const hasPasswordValue = passwordInput.value.trim().length > 0;
        passwordField.classList.toggle("detail-form__field--active", isActive);
        authSubmitButton.disabled = !hasPasswordValue;
        authSubmitButton.classList.toggle(
            "detail-form__button--enabled",
            hasPasswordValue,
        );
    }

    function syncAccountInfoAuthRoute(routeRoot) {
        const passwordInput = routeRoot.querySelector("[data-account-auth-input]");
        if (passwordInput instanceof HTMLInputElement) {
            passwordInput.value = "";
        }
        applyAccountInfoAuthState(routeRoot);
    }

    function bindAccountInfoAuthRoute(routeRoot) {
        const passwordInput = routeRoot.querySelector("[data-account-auth-input]");
        const authForm = routeRoot.querySelector("[data-account-auth-form]");

        if (passwordInput instanceof HTMLInputElement) {
            passwordInput.addEventListener("focus", () => applyAccountInfoAuthState(routeRoot));
            passwordInput.addEventListener("blur", () => applyAccountInfoAuthState(routeRoot));
            passwordInput.addEventListener("input", () => applyAccountInfoAuthState(routeRoot));
        }

        if (authForm instanceof HTMLFormElement) {
            authForm.addEventListener("submit", (event) => {
                event.preventDefault();
                if (!(passwordInput instanceof HTMLInputElement)) {
                    return;
                }

                applyAccountInfoAuthState(routeRoot);
                if (passwordInput.value.trim().length === 0) {
                    return;
                }

                activeDetailRoute = "account-info-list";
                renderDetail();
            });
        }
    }

    function applyUsernameEditorState(routeRoot) {
        const usernameField = routeRoot.querySelector("[data-username-field]");
        const usernameInput = routeRoot.querySelector("[data-username-input]");
        const usernameMessage = routeRoot.querySelector("[data-username-message]");
        const usernameSuggestionList = routeRoot.querySelector(
            "[data-username-suggestion-list]",
        );
        const usernameSaveButton = routeRoot.querySelector("[data-username-save]");
        const usernameMarketplace = routeRoot.querySelector("[data-username-marketplace]");

        if (
            !(usernameField instanceof HTMLElement) ||
            !(usernameInput instanceof HTMLInputElement) ||
            !(usernameMessage instanceof HTMLElement) ||
            !(usernameSuggestionList instanceof HTMLElement) ||
            !(usernameSaveButton instanceof HTMLButtonElement)
        ) {
            return;
        }

        usernameState.draft = usernameInput.value;
        const validationMessage = getUsernameValidationMessage(usernameState.draft);
        const canSave =
            !validationMessage &&
            usernameState.draft.length > 0 &&
            usernameState.draft !== usernameState.current;
        const usernameLabel = usernameField.querySelector(".username-field__label");

        usernameField.classList.toggle(
            "username-field--active",
            document.activeElement === usernameInput,
        );
        usernameField.classList.toggle(
            "username-field--error",
            Boolean(validationMessage),
        );
        if (usernameLabel instanceof HTMLElement) {
            usernameLabel.classList.toggle(
                "username-field__label--filled",
                usernameInput.value.length > 0,
            );
        }

        usernameMessage.hidden = !validationMessage;
        usernameMessage.textContent = validationMessage;
        usernameSuggestionList.innerHTML = buildUsernameSuggestionMarkup(
            usernameState.draft,
        );
        usernameSaveButton.disabled = !canSave;
        usernameSaveButton.classList.toggle(
            "username-action__button--enabled",
            canSave,
        );
        if (usernameMarketplace instanceof HTMLElement) {
            usernameMarketplace.hidden = !usernameState.isMarketplaceVisible;
            usernameMarketplace.setAttribute(
                "aria-hidden",
                String(!usernameState.isMarketplaceVisible),
            );
        }
    }

    function syncUsernameRoute(routeRoot) {
        const usernameInput = routeRoot.querySelector("[data-username-input]");
        if (usernameInput instanceof HTMLInputElement) {
            usernameInput.value = usernameState.draft;
        }
        applyUsernameEditorState(routeRoot);
    }

    function bindUsernameRoute(routeRoot) {
        const usernameForm = routeRoot.querySelector("[data-username-form]");
        const usernameInput = routeRoot.querySelector("[data-username-input]");
        const usernameSuggestionList = routeRoot.querySelector(
            "[data-username-suggestion-list]",
        );
        const usernameMarketplaceCloseButton = routeRoot.querySelector(
            "[data-username-marketplace-close]",
        );

        if (usernameInput instanceof HTMLInputElement) {
            usernameInput.addEventListener("focus", () => applyUsernameEditorState(routeRoot));
            usernameInput.addEventListener("blur", () => applyUsernameEditorState(routeRoot));
            usernameInput.addEventListener("input", () => applyUsernameEditorState(routeRoot));
        }

        if (usernameSuggestionList instanceof HTMLElement) {
            usernameSuggestionList.addEventListener("click", (event) => {
                const target = event.target;
                if (!(target instanceof Element) || !(usernameInput instanceof HTMLInputElement)) {
                    return;
                }

                const suggestionButton = target.closest("[data-username-suggestion]");
                if (!(suggestionButton instanceof HTMLButtonElement)) {
                    return;
                }

                usernameInput.value = suggestionButton.dataset.usernameSuggestion || "";
                applyUsernameEditorState(routeRoot);
                usernameInput.focus();
                usernameInput.setSelectionRange(
                    usernameInput.value.length,
                    usernameInput.value.length,
                );
            });
        }

        if (usernameForm instanceof HTMLFormElement) {
            usernameForm.addEventListener("submit", (event) => {
                event.preventDefault();
                if (!(usernameInput instanceof HTMLInputElement)) {
                    return;
                }

                applyUsernameEditorState(routeRoot);
                if (getUsernameValidationMessage(usernameInput.value)) {
                    return;
                }

                usernameState.current = usernameInput.value;
                usernameState.draft = usernameInput.value;
                accountInfoItems[0].value = usernameInput.value;
                activeDetailRoute = "account-info-list";
                renderDetail();
            });
        }

        if (usernameMarketplaceCloseButton instanceof HTMLButtonElement) {
            usernameMarketplaceCloseButton.addEventListener("click", () => {
                usernameState.isMarketplaceVisible = false;
                applyUsernameEditorState(routeRoot);
            });
        }
    }

    function applyPasswordEditorState(routeRoot) {
        const passwordEditorFields = Array.from(
            routeRoot.querySelectorAll("[data-password-editor-field]"),
        );
        const passwordEditorInputs = Array.from(
            routeRoot.querySelectorAll("[data-password-editor-input]"),
        );
        const passwordEditorSaveButton = routeRoot.querySelector(
            "[data-password-editor-save]",
        );

        passwordEditorInputs.forEach((input) => {
            if (!(input instanceof HTMLInputElement)) {
                return;
            }

            const stateKey = input.dataset.passwordEditorInput;
            if (!stateKey) {
                return;
            }

            passwordChangeState[stateKey] = input.value;
        });

        passwordEditorFields.forEach((field) => {
            if (!(field instanceof HTMLElement)) {
                return;
            }

            const input = field.querySelector("[data-password-editor-input]");
            if (!(input instanceof HTMLInputElement)) {
                return;
            }

            field.classList.toggle(
                "password-editor__field--active",
                document.activeElement === input,
            );
        });

        if (!(passwordEditorSaveButton instanceof HTMLButtonElement)) {
            return;
        }

        const canSave =
            passwordChangeState.currentPassword.length > 0 &&
            passwordChangeState.nextPassword.length > 0 &&
            passwordChangeState.confirmPassword.length > 0 &&
            passwordChangeState.nextPassword === passwordChangeState.confirmPassword;

        passwordEditorSaveButton.disabled = !canSave;
        passwordEditorSaveButton.classList.toggle(
            "password-editor__save--enabled",
            canSave,
        );
    }

    function syncPasswordEditorRoute(routeRoot) {
        routeRoot.querySelectorAll("[data-password-editor-input]").forEach((input) => {
            if (!(input instanceof HTMLInputElement)) {
                return;
            }

            const stateKey = input.dataset.passwordEditorInput;
            if (stateKey) {
                input.value = passwordChangeState[stateKey];
            }
        });

        applyPasswordEditorState(routeRoot);
    }

    function bindPasswordEditorRoute(routeRoot) {
        const passwordEditorForm = routeRoot.querySelector("[data-password-editor-form]");
        routeRoot.querySelectorAll("[data-password-editor-input]").forEach((input) => {
            if (!(input instanceof HTMLInputElement)) {
                return;
            }

            input.addEventListener("focus", () => applyPasswordEditorState(routeRoot));
            input.addEventListener("blur", () => applyPasswordEditorState(routeRoot));
            input.addEventListener("input", () => applyPasswordEditorState(routeRoot));
        });

        if (passwordEditorForm instanceof HTMLFormElement) {
            passwordEditorForm.addEventListener("submit", (event) => {
                event.preventDefault();
                applyPasswordEditorState(routeRoot);
            });
        }
    }

    function syncDeactivateRoute(routeRoot) {
        const avatar = routeRoot.querySelector("[data-deactivate-avatar]");
        const name = routeRoot.querySelector("[data-deactivate-name]");
        const handle = routeRoot.querySelector("[data-deactivate-handle]");
        const summary = routeRoot.querySelector("[data-deactivate-summary]");

        if (avatar instanceof HTMLElement) {
            avatar.style.backgroundImage = `url("${currentAccountState.avatarUrl}")`;
        }
        if (name instanceof HTMLElement) {
            name.textContent = currentAccountState.displayName;
        }
        if (handle instanceof HTMLElement) {
            handle.textContent = currentAccountState.handle;
        }
        if (summary instanceof HTMLElement) {
            summary.textContent = `X 계정 비활성화 과정을 시작합니다. 내 표시 이름, ${currentAccountState.handle}, 공개 프로필이 X.com, iOS용 X, Android용 X에 더 이상 표시되지 않습니다.`;
        }
    }

    /*
     * routeRoot 하나에 서버/프론트 상태를 다시 주입하는 계열 함수들.
     * Spring으로 바꿀 때는 각 함수가 "DTO -> DOM 반영" 책임만 갖도록 유지하면 된다.
     */
    function syncNotificationFilterRoute(routeRoot) {
        const toggle = routeRoot.querySelector("[data-notification-filter-toggle]");
        if (toggle instanceof HTMLInputElement) {
            toggle.checked = notificationFilterState.isQualityFilterEnabled;
        }
    }

    function syncNotificationMutedRoute(routeRoot) {
        routeRoot.querySelectorAll("[data-notification-muted-toggle]").forEach((input) => {
            if (!(input instanceof HTMLInputElement)) {
                return;
            }

            const optionKey = input.dataset.notificationMutedToggle;
            input.checked = optionKey
                ? Boolean(notificationFilterState.mutedNotificationOptions[optionKey])
                : false;
        });
    }

    /*
     * 푸시 알림 상세 화면 동기화.
     * - 상단 master on/off
     * - 비활성 empty 섹션 / 활성 content 섹션 전환
     * - 개별 체크박스 상태 반영
     *
     * Spring 연동 포인트:
     * - 최초 렌더 직전에 notificationPreferenceState만 서버 값으로 채우면 된다.
     */
    function syncNotificationPushRoute(routeRoot) {
        const toggle = routeRoot.querySelector("[data-notification-push-toggle]");
        if (toggle instanceof HTMLInputElement) {
            toggle.checked = notificationPreferenceState.isPushEnabled;
        }
        const emptySection = routeRoot.querySelector(".notification-push-editor__empty");
        const contentSection = routeRoot.querySelector(".notification-push-editor__content");
        if (emptySection) emptySection.hidden = notificationPreferenceState.isPushEnabled;
        if (contentSection) contentSection.hidden = !notificationPreferenceState.isPushEnabled;
        routeRoot.querySelectorAll("[data-notification-push-check]").forEach((input) => {
            if (!(input instanceof HTMLInputElement)) {
                return;
            }

            const toggleKey = input.dataset.notificationPushCheck;
            input.checked = toggleKey
                ? Boolean(notificationPreferenceState.pushAlerts[toggleKey])
                : false;
        });
    }

    function syncPrivacyChatRoute(routeRoot) {
        routeRoot.querySelectorAll("[data-privacy-chat-allow]").forEach((input) => {
            if (input instanceof HTMLInputElement) {
                input.checked = input.value === privacyChatState.allow;
            }
        });
        routeRoot.querySelectorAll("[data-privacy-chat-toggle]").forEach((input) => {
            if (!(input instanceof HTMLInputElement)) {
                return;
            }

            input.checked =
                input.dataset.privacyChatToggle === "filter-low-quality"
                    ? privacyChatState.isLowQualityFilterEnabled
                    : privacyChatState.areReadReceiptsEnabled;
        });
    }

    function syncPrivacyDiscoverabilityRoute(routeRoot) {
        routeRoot
            .querySelectorAll("[data-privacy-discoverability-toggle]")
            .forEach((input) => {
                if (!(input instanceof HTMLInputElement)) {
                    return;
                }

                input.checked =
                    input.dataset.privacyDiscoverabilityToggle === "email"
                        ? privacyDiscoverabilityState.isEmailDiscoverable
                        : privacyDiscoverabilityState.isPhoneDiscoverable;
            });
    }

    function applyMutedWordFormState(routeRoot) {
        const mutedWordField = routeRoot.querySelector("[data-privacy-muted-word-field]");
        const mutedWordInput = routeRoot.querySelector("[data-privacy-muted-word-input]");
        const mutedWordSave = routeRoot.querySelector("[data-privacy-muted-word-save]");

        if (
            !(mutedWordField instanceof HTMLElement) ||
            !(mutedWordInput instanceof HTMLInputElement) ||
            !(mutedWordSave instanceof HTMLButtonElement)
        ) {
            return;
        }

        const hasValue = mutedWordInput.value.trim().length > 0;
        mutedWordField.classList.toggle(
            "privacy-muted-word-form__field-shell--active",
            document.activeElement === mutedWordInput || hasValue,
        );
        mutedWordSave.disabled = !hasValue;
        mutedWordSave.classList.toggle("privacy-muted-word-form__save--enabled", hasValue);
    }

    function syncMutedWordFormRoute(routeRoot) {
        const mutedWordInput = routeRoot.querySelector("[data-privacy-muted-word-input]");
        if (mutedWordInput instanceof HTMLInputElement) {
            mutedWordInput.value = mutedWordFormState.value;
        }

        const timelineToggle = routeRoot.querySelector(
            "[data-privacy-muted-word-timeline-toggle]",
        );
        if (timelineToggle instanceof HTMLInputElement) {
            timelineToggle.checked = mutedWordFormState.muteFromTimeline;
        }
        const notificationsToggle = routeRoot.querySelector(
            "[data-privacy-muted-word-notifications-toggle]",
        );
        if (notificationsToggle instanceof HTMLInputElement) {
            notificationsToggle.checked = mutedWordFormState.muteNotifications;
        }

        routeRoot.querySelectorAll("[data-privacy-muted-word-audience]").forEach((input) => {
            if (input instanceof HTMLInputElement) {
                input.checked =
                    input.value === mutedWordFormState.notificationAudience;
            }
        });

        routeRoot.querySelectorAll("[data-privacy-muted-word-duration]").forEach((input) => {
            if (input instanceof HTMLInputElement) {
                input.checked = input.value === mutedWordFormState.duration;
            }
        });

        applyMutedWordFormState(routeRoot);
    }

    function bindMutedWordFormRoute(routeRoot) {
        const mutedWordForm = routeRoot.querySelector("[data-privacy-muted-word-form]");
        const mutedWordInput = routeRoot.querySelector("[data-privacy-muted-word-input]");

        if (mutedWordInput instanceof HTMLInputElement) {
            mutedWordInput.addEventListener("focus", () => applyMutedWordFormState(routeRoot));
            mutedWordInput.addEventListener("blur", () => applyMutedWordFormState(routeRoot));
            mutedWordInput.addEventListener("input", () => {
                mutedWordFormState.value = mutedWordInput.value;
                applyMutedWordFormState(routeRoot);
            });
        }

        if (mutedWordForm instanceof HTMLFormElement) {
            mutedWordForm.addEventListener("submit", (event) => {
                event.preventDefault();
                applyMutedWordFormState(routeRoot);
            });
        }
    }

    function syncPrivacyPostsRoute(routeRoot) {
        const toggle = routeRoot.querySelector("[data-privacy-posts-sensitive-toggle]");
        if (toggle instanceof HTMLInputElement) {
            toggle.checked = privacyPostsState.isSensitiveMediaMarked;
        }
    }

    function syncPrivacyPostsLocationRoute(routeRoot) {
        const toggle = routeRoot.querySelector("[data-privacy-posts-location-toggle]");
        if (toggle instanceof HTMLInputElement) {
            toggle.checked = privacyPostsState.isLocationEnabled;
        }
    }

    /*
     * accountInfoItems/currentAccountState를 상세 화면별 DOM에 주입한다.
     * 서버에서 값이 바뀌면 이 sync 함수만 다시 호출해도 화면이 맞춰지게 설계되어 있다.
     */
    function syncPhoneRoute(routeRoot) {
        const phoneItem = accountInfoItems.find((item) => item.id === "phone");
        const phoneValue = phoneItem?.value || "";
        const phoneValueNode = routeRoot.querySelector("[data-phone-current-value]");
        const verifiedScreen = routeRoot.querySelector("[data-phone-verified-screen]");
        const addButton = routeRoot.querySelector(".phone-editor__action");
        const hasPhone = Boolean(phoneValue);

        if (phoneValueNode instanceof HTMLElement) {
            phoneValueNode.textContent = phoneValue;
        }
        if (verifiedScreen instanceof HTMLElement) {
            verifiedScreen.hidden = !hasPhone;
            verifiedScreen.setAttribute("aria-hidden", String(!hasPhone));
        }
        if (addButton instanceof HTMLElement) {
            addButton.hidden = hasPhone;
        }
    }

    function syncEmailRoute(routeRoot) {
        const emailItem = accountInfoItems.find((item) => item.id === "email");
        const emailValue = emailItem?.value || "tjdgh1851@gmail.com";
        const emailValueNode = routeRoot.querySelector("[data-email-current-value]");
        if (emailValueNode instanceof HTMLElement) {
            emailValueNode.textContent = emailValue;
        }
    }

    function syncCountryRoute(routeRoot) {
        const countryItem = accountInfoItems.find((item) => item.id === "country");
        const currentCountry = countryItem?.value || "대한민국";
        const countrySelect = routeRoot.querySelector("[data-country-select]");

        if (!(countrySelect instanceof HTMLSelectElement)) {
            return;
        }

        const matchedOption = Array.from(countrySelect.options).find(
            (option) => option.textContent?.trim() === currentCountry,
        );
        if (matchedOption) {
            countrySelect.value = matchedOption.value;
        }
    }

    function bindCountryRoute(routeRoot) {
        const countryItem = accountInfoItems.find((item) => item.id === "country");
        const countrySelect = routeRoot.querySelector("[data-country-select]");
        if (!(countrySelect instanceof HTMLSelectElement)) {
            return;
        }

        countrySelect.addEventListener("change", () => {
            const selectedCountry =
                countrySelect.selectedOptions[0]?.textContent?.trim() || "대한민국";

            if (countryItem) {
                countryItem.value = selectedCountry;
            }
        });
    }

    function syncLanguageRoute(routeRoot) {
        const languageValue = routeRoot.querySelector("[data-language-current-value]");
        if (languageValue instanceof HTMLElement) {
            languageValue.textContent = getCombinedLanguageLabel();
        }
    }

    function syncAccountInfoListRoute(routeRoot) {
        const languageValue = routeRoot.querySelector("[data-language-current-value]");
        if (languageValue instanceof HTMLElement) {
            languageValue.textContent = getCombinedLanguageLabel();
        }
    }

    /*
     * activeDetailRoute 값에 따라 어떤 상세 화면 동기화 함수를 호출할지 결정한다.
     * Spring에서 서버 라우팅을 일부 맡기더라도, 프론트 상세 패널을 유지할 경우 이 함수가 허브 역할을 한다.
     */
    function syncDetailRoute(routeRoot) {
        if (activeDetailRoute === "account-info-auth") {
            bindRouteOnce(routeRoot, "boundAccountAuth", bindAccountInfoAuthRoute);
            syncAccountInfoAuthRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "account-info-list") {
            syncAccountInfoListRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "username-edit") {
            bindRouteOnce(routeRoot, "boundUsername", bindUsernameRoute);
            syncUsernameRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "password-edit") {
            bindRouteOnce(routeRoot, "boundPasswordEditor", bindPasswordEditorRoute);
            syncPasswordEditorRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "deactivate-edit") {
            syncDeactivateRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "notification-filter-edit") {
            syncNotificationFilterRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "notification-muted-edit" || activeDetailRoute === "privacy-muted-notifications-edit") {
            syncNotificationMutedRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "notification-push-edit") {
            syncNotificationPushRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "privacy-chat-edit") {
            syncPrivacyChatRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "privacy-discoverability-edit") {
            syncPrivacyDiscoverabilityRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "privacy-muted-words-edit") {
            setDetailHeaderAction({
                iconPath: icons.add,
                ariaLabel: "뮤트한 단어 추가",
                action: "muted-words-add",
            });
            return;
        }
        if (activeDetailRoute === "privacy-muted-words-add-edit") {
            bindRouteOnce(routeRoot, "boundMutedWordForm", bindMutedWordFormRoute);
            syncMutedWordFormRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "privacy-posts-edit") {
            syncPrivacyPostsRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "privacy-posts-location-edit") {
            syncPrivacyPostsLocationRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "phone-edit") {
            syncPhoneRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "email-edit") {
            syncEmailRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "country-edit") {
            bindRouteOnce(routeRoot, "boundCountryRoute", bindCountryRoute);
            syncCountryRoute(routeRoot);
            return;
        }
        if (activeDetailRoute === "language-edit") {
            syncLanguageRoute(routeRoot);
            return;
        }
    }

    /*
     * 좌측 메뉴 렌더링:
     * - 검색어로 필터링된 항목만 노출
     * - 현재 섹션은 배경색과 오른쪽 파란 인디케이터를 붙인다
     * - 외부 링크는 외부 링크 아이콘을 사용한다
     */
    function renderNavigation(searchTerm = "") {
        const normalizedTerm = searchTerm.trim().toLowerCase();
        navigationList.querySelectorAll("[data-nav-entry]").forEach((entry) => {
            const link = entry.querySelector("[data-section-id]");
            if (!(link instanceof HTMLElement)) return;
            const sectionId = link.dataset.sectionId;
            const label = link.querySelector(".navigation-entry__label")?.textContent || "";
            const isVisible = !normalizedTerm || label.toLowerCase().includes(normalizedTerm);
            const isActive = sectionId === activeSectionId;
            const indicator = entry.querySelector(".navigation-entry__indicator");
            entry.classList.toggle("navigation-entry--active", isActive);
            entry.classList.toggle("navigation-entry--hidden", !isVisible);
            link.setAttribute("aria-selected", String(isActive));
            if (indicator) indicator.hidden = !isActive;
        });
    }

    /*
     * 우측 상세 패널 렌더링:
     * - 좌측 메뉴에서 선택된 섹션 또는 활성 라우트를 data-detail-route-view로 표시
     * - 제목은 routeRoot의 data-route-title에서 읽는다
     */

    /*
     * 우측 상세 패널 전체 재렌더 진입점.
     * - 어떤 route를 보여줄지 결정
     * - 헤더/뒤로가기/모바일 상태를 함께 맞춤
     * - 최종적으로 syncDetailRoute()에서 데이터 주입
     *
     * Spring에서 초기 route를 지정한 뒤에도, 프론트 전환은 이 함수 하나로 유지하는 편이 단순하다.
     */
    function renderDetail() {
        resetDetailHeaderAction();
        hideDetailRouteViews();
        detailBackButton.hidden = !activeDetailRoute;

        const routeName = activeDetailRoute || activeSectionId;
        const routeRoot = showDetailRouteView(routeName);

        if (routeRoot instanceof HTMLElement) {
            detailTitle.textContent = routeRoot.dataset.routeTitle || "";
            if (activeDetailRoute) {
                syncDetailRoute(routeRoot);
            }
            if (window.matchMedia("(max-width: 400px)").matches && !activeDetailRoute) {
                detailBackButton.hidden = false;
            }
        }

        syncMobileDetailState(true);
    }

    function syncMobileDetailState(isActive) {
        const isMobile = window.matchMedia("(max-width: 400px)").matches;
        settingsShell.classList.toggle("is-detail-active", isMobile && isActive);
    }

    /*
     * 표시 모달의 선택지 렌더링:
     * - 색상 선택은 브랜드 포인트 컬러만 바꾼다
     * - 배경 선택은 body data 속성을 바꿔 페이지 전체 톤을 바꾼다
     */
    function renderAppearanceOptions() {
        appearanceAccentList.querySelectorAll("[data-accent-id]").forEach((btn) => {
            btn.classList.toggle("appearance-chip--active", btn.dataset.accentId === appearanceState.accent);
        });
        appearanceSurfaceList.querySelectorAll("[data-surface-id]").forEach((btn) => {
            btn.classList.toggle("surface-chip--active", btn.dataset.surfaceId === appearanceState.surface);
        });
    }

    /*
     * body data 속성은 CSS 토큰을 직접 바꾸는 역할을 한다.
     * 이 방식으로 JS는 상태만 관리하고 실제 색상/배경 적용은 CSS가 담당한다.
     */
    function applyAppearanceState() {
        document.body.dataset.fontScale = appearanceState.fontScale;
        document.body.dataset.accent = appearanceState.accent;
        document.body.dataset.surface = appearanceState.surface;
        appearanceFontRange.value = appearanceState.fontScale;
        renderAppearanceOptions();
    }

    function applyPhoneAddActionState() {
        const hasPhoneNumber = phoneModalState.phoneNumber.trim().length > 0;

        phoneAddActionButton.textContent = hasPhoneNumber ? "다음" : "취소";
        phoneAddActionButton.classList.toggle(
            "phone-modal__action--primary",
            hasPhoneNumber,
        );
    }

    function renderPhoneAddStep() {
        const isCodeStep = phoneModalState.step === "code";
        const isHelpMenuVisible = isCodeStep && phoneModalState.isHelpMenuOpen;

        phoneAddStep.hidden = isCodeStep;
        phoneCodeStep.hidden = !isCodeStep;
        phoneCodeNumber.textContent =
            phoneModalState.phoneNumber || "01099139076";
        phoneCodeInput.value = phoneModalState.code;
        phoneCodeHelpMenu.hidden = !isHelpMenuVisible;
        phoneCodeHelpButton.setAttribute(
            "aria-expanded",
            String(isHelpMenuVisible),
        );
        phoneCodeActionButton.disabled =
            phoneModalState.code.trim().length === 0;
        phoneCodeActionButton.classList.toggle(
            "phone-modal__action--primary",
            phoneModalState.code.trim().length > 0,
        );
        phoneCodeActionButton.classList.toggle(
            "phone-modal__action--disabled",
            phoneModalState.code.trim().length === 0,
        );
    }

    function applyEmailAddActionState() {
        const hasEmailAddress = emailModalState.emailAddress.trim().length > 0;

        emailAddActionButton.textContent = hasEmailAddress ? "다음" : "취소";
        emailAddActionButton.classList.toggle(
            "phone-modal__action--primary",
            hasEmailAddress,
        );
        emailAddActionButton.classList.toggle(
            "email-modal__action--primary",
            hasEmailAddress,
        );
    }

    function renderEmailAddStep() {
        const isCodeStep = emailModalState.step === "code";
        const isHelpMenuVisible = isCodeStep && emailModalState.isHelpMenuOpen;

        emailAddStep.hidden = isCodeStep;
        emailCodeStep.hidden = !isCodeStep;
        emailCodeAddress.textContent =
            emailModalState.emailAddress || "tjdgh1851@gmail.com";
        emailCodeInput.value = emailModalState.code;
        emailCodeHelpMenu.hidden = !isHelpMenuVisible;
        emailCodeHelpButton.setAttribute(
            "aria-expanded",
            String(isHelpMenuVisible),
        );
        emailCodeActionButton.disabled =
            emailModalState.code.trim().length === 0;
        emailCodeActionButton.classList.toggle(
            "phone-modal__action--primary",
            emailModalState.code.trim().length > 0,
        );
        emailCodeActionButton.classList.toggle(
            "email-modal__action--primary",
            emailModalState.code.trim().length > 0,
        );
        emailCodeActionButton.classList.toggle(
            "phone-modal__action--disabled",
            emailModalState.code.trim().length === 0,
        );
        emailCodeActionButton.classList.toggle(
            "email-modal__action--disabled",
            emailModalState.code.trim().length === 0,
        );
    }

    /*
     * 공통 모달 열기.
     * Spring API 연동 후에도 모달 open/close 자체는 프론트에서 유지하고,
     * 저장/인증 성공 시 상태값만 바꾼 뒤 renderDetail()을 다시 호출하는 구조가 가장 단순하다.
     */
    function openModal(modalType) {
        activeModal = modalType;
        modalLayer.hidden = false;
        appearanceModal.hidden = modalType !== "appearance";
        shortcutModal.hidden = modalType !== "shortcuts";
        languageSelectionModal.hidden = modalType !== "language-select";
        phoneAddModal.hidden = modalType !== "phone-add";
        phoneVerifyModal.hidden = true;
        emailAddModal.hidden = modalType !== "email-add";
        emailVerifyModal.hidden = true;

        if (modalType === "appearance") {
            appearanceCompleteButton.focus();
        } else if (modalType === "shortcuts") {
            const closeButton = shortcutModal.querySelector(".modal-close");
            closeButton?.focus();
        } else if (modalType === "language-select") {
            languageSelectionState.step = "choices";
            languageSelectionState.query = "";
            languageSelectionState.showAll = false;
            languageSelectionSearchInput.value = "";
            renderLanguageSelectionModal();
            languageSelectionSearchInput.focus();
        } else if (modalType === "phone-add") {
            phoneModalState.step = "add";
            phoneModalState.isHelpMenuOpen = false;
            phoneAddInput.value = phoneModalState.phoneNumber;
            applyPhoneAddActionState();
            renderPhoneAddStep();
            phoneAddInput.focus();
        } else if (modalType === "email-add") {
            emailModalState.step = "add";
            emailModalState.isHelpMenuOpen = false;
            emailAddInput.value = emailModalState.emailAddress;
            applyEmailAddActionState();
            renderEmailAddStep();
            emailAddInput.focus();
        }
    }

    // 열린 모달을 모두 닫고 모달 관련 임시 상태를 정리한다.
    function closeModal() {
        activeModal = "";
        modalLayer.hidden = true;
        appearanceModal.hidden = true;
        shortcutModal.hidden = true;
        languageSelectionModal.hidden = true;
        phoneAddModal.hidden = true;
        phoneVerifyModal.hidden = true;
        emailAddModal.hidden = true;
        emailVerifyModal.hidden = true;
        phoneModalState.isHelpMenuOpen = false;
        emailModalState.isHelpMenuOpen = false;
    }

    function selectSection(sectionId) {
        activeSectionId = sectionId;
        activeDetailRoute = "";
        renderNavigation(searchInput.value);
        renderDetail();
    }

    searchInput.addEventListener("input", () => {
        renderNavigation(searchInput.value);
    });

    navigationList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const link = target.closest("[data-section-id]");
        if (!(link instanceof HTMLAnchorElement)) {
            return;
        }

        const sectionId = link.dataset.sectionId;
        if (!sectionId) {
            return;
        }

        if (!link.target || link.target === "_self") {
            event.preventDefault();
        }

        if (link.target === "_blank") {
            return;
        }

        syncMobileDetailState(true);
        selectSection(sectionId);
    });

    detailRoutes.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const entryLink = target.closest(".detail-entry");
        if (!(entryLink instanceof HTMLAnchorElement)) {
            return;
        }

        if (
            activeSectionId === "account" &&
            entryLink.getAttribute("href") ===
            "/settings/your_twitter_data/account"
        ) {
            event.preventDefault();
            activeDetailRoute = "account-info-auth";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "account" &&
            entryLink.getAttribute("href") === "/settings/password"
        ) {
            event.preventDefault();
            activeDetailRoute = "password-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "account" &&
            entryLink.getAttribute("href") === "/settings/deactivate"
        ) {
            event.preventDefault();
            activeDetailRoute = "deactivate-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "notifications" &&
            entryLink.getAttribute("href") === "/settings/notifications/filters"
        ) {
            event.preventDefault();
            activeDetailRoute = "notification-filter-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "notifications" &&
            entryLink.getAttribute("href") ===
            "/settings/notifications/preferences"
        ) {
            event.preventDefault();
            activeDetailRoute = "notification-preferences-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "privacy_and_safety" &&
            entryLink.getAttribute("href") ===
            "/settings/privacy_and_safety/your_posts"
        ) {
            event.preventDefault();
            activeDetailRoute = "privacy-posts-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "privacy_and_safety" &&
            entryLink.getAttribute("href") ===
            "/settings/privacy_and_safety/mute_and_block"
        ) {
            event.preventDefault();
            activeDetailRoute = "privacy-mute-block-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "privacy_and_safety" &&
            entryLink.getAttribute("href") ===
            "/settings/privacy_and_safety/direct_messages"
        ) {
            event.preventDefault();
            activeDetailRoute = "privacy-chat-edit";
            renderDetail();
            return;
        }

        if (
            activeSectionId === "privacy_and_safety" &&
            entryLink.getAttribute("href") ===
            "/settings/privacy_and_safety/discoverability_and_contacts"
        ) {
            event.preventDefault();
            activeDetailRoute = "privacy-discoverability-edit";
            renderDetail();
            return;
        }

        const entry = target.closest("[data-modal-type]");
        if (!(entry instanceof HTMLAnchorElement)) {
            return;
        }

        const modalType = entry.dataset.modalType;
        if (!modalType) {
            return;
        }

        event.preventDefault();
        openModal(modalType);
    });

    detailContent.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const deactivateLink = target.closest("[data-deactivate-link]");
        if (deactivateLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const notificationFilterLink = target.closest(
            "[data-notification-filter-link]",
        );
        if (notificationFilterLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const privacyPostsLink = target.closest("[data-privacy-posts-link]");
        if (privacyPostsLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const privacyPostsLocationLink = target.closest(
            "[data-privacy-posts-location-link]",
        );
        if (privacyPostsLocationLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const blockedAccountsLink = target.closest(
            "[data-privacy-blocked-accounts-link]",
        );
        if (blockedAccountsLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const mutedAccountsLink = target.closest(
            "[data-privacy-muted-accounts-link]",
        );
        if (mutedAccountsLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const mutedWordsLink = target.closest(
            "[data-privacy-muted-words-link]",
        );
        if (mutedWordsLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const mutedWordFormLink = target.closest(
            "[data-privacy-muted-word-link]",
        );
        if (mutedWordFormLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const privacyChatLink = target.closest("[data-privacy-chat-link]");
        if (privacyChatLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const privacyDiscoverabilityLink = target.closest(
            "[data-privacy-discoverability-link]",
        );
        if (privacyDiscoverabilityLink instanceof HTMLAnchorElement) {
            event.preventDefault();
            return;
        }

        const modalButton = target.closest("[data-modal-type]");
        if (modalButton instanceof HTMLButtonElement) {
            const modalType = modalButton.dataset.modalType;
            if (modalType) {
                openModal(modalType);
                return;
            }
        }

        const deactivateConfirmButton = target.closest("[data-deactivate-confirm]");
        if (deactivateConfirmButton instanceof HTMLButtonElement) {
            activeDetailRoute = "deactivate-confirm";
            renderDetail();
            return;
        }

        const notificationFilterToggle = target.closest(
            "[data-notification-filter-toggle]",
        );
        if (notificationFilterToggle instanceof HTMLInputElement) {
            notificationFilterState.isQualityFilterEnabled =
                notificationFilterToggle.checked;
            return;
        }

        const notificationFilterRoute = target.closest(
            "[data-notification-filter-route]",
        );
        if (notificationFilterRoute instanceof HTMLButtonElement) {
            if (
                notificationFilterRoute.dataset.notificationFilterRoute ===
                "muted"
            ) {
                activeDetailRoute = "notification-muted-edit";
                renderDetail();
            }
            return;
        }

        const notificationPreferencesRoute = target.closest(
            "[data-notification-preferences-route]",
        );
        if (notificationPreferencesRoute instanceof HTMLButtonElement) {
            if (
                notificationPreferencesRoute.dataset
                    .notificationPreferencesRoute === "push"
            ) {
                activeDetailRoute = "notification-push-edit";
                renderDetail();
            }
            return;
        }

        const privacyPostsRoute = target.closest("[data-privacy-posts-route]");
        if (privacyPostsRoute instanceof HTMLButtonElement) {
            if (privacyPostsRoute.dataset.privacyPostsRoute === "location") {
                activeDetailRoute = "privacy-posts-location-edit";
                renderDetail();
            }
            return;
        }

        const privacyMuteBlockItem = target.closest(
            "[data-privacy-mute-block-item]",
        );
        if (privacyMuteBlockItem instanceof HTMLButtonElement) {
            if (
                privacyMuteBlockItem.dataset.privacyMuteBlockItem ===
                "blocked-accounts"
            ) {
                activeDetailRoute = "privacy-blocked-accounts-edit";
                renderDetail();
            } else if (
                privacyMuteBlockItem.dataset.privacyMuteBlockItem ===
                "muted-accounts"
            ) {
                activeDetailRoute = "privacy-muted-accounts-edit";
                renderDetail();
            } else if (
                privacyMuteBlockItem.dataset.privacyMuteBlockItem ===
                "muted-words"
            ) {
                activeDetailRoute = "privacy-muted-words-edit";
                renderDetail();
            } else if (
                privacyMuteBlockItem.dataset.privacyMuteBlockItem ===
                "muted-notifications"
            ) {
                activeDetailRoute = "privacy-muted-notifications-edit";
                renderDetail();
            }
            return;
        }

        const notificationPushEnable = target.closest(
            "[data-notification-push-enable]",
        );
        if (notificationPushEnable instanceof HTMLButtonElement) {
            notificationPreferenceState.isPushEnabled = true;
            renderDetail();
            return;
        }

        const privacyPostsLocationDelete = target.closest(
            "[data-privacy-posts-location-delete]",
        );
        if (privacyPostsLocationDelete instanceof HTMLButtonElement) {
            return;
        }

        const infoButton = target.closest("[data-account-info-id]");
        if (!(infoButton instanceof HTMLButtonElement)) {
            return;
        }

        if (infoButton.dataset.accountInfoId === "username") {
            usernameState.draft = usernameState.current;
            activeDetailRoute = "username-edit";
            renderDetail();
            return;
        }

        if (infoButton.dataset.accountInfoId === "phone") {
            activeDetailRoute = "phone-edit";
            renderDetail();
            return;
        }

        if (infoButton.dataset.accountInfoId === "email") {
            activeDetailRoute = "email-edit";
            renderDetail();
            return;
        }

        if (infoButton.dataset.accountInfoId === "country") {
            activeDetailRoute = "country-edit";
            renderDetail();
            return;
        }

        if (infoButton.dataset.accountInfoId === "language") {
            activeDetailRoute = "language-edit";
            renderDetail();
        }
    });

    detailContent.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) {
            return;
        }

        if (target.matches("[data-notification-filter-toggle]")) {
            notificationFilterState.isQualityFilterEnabled = target.checked;
            return;
        }

        if (target.matches("[data-notification-muted-toggle]")) {
            const optionKey = target.dataset.notificationMutedToggle;
            if (
                optionKey &&
                Object.hasOwn(
                    notificationFilterState.mutedNotificationOptions,
                    optionKey,
                )
            ) {
                notificationFilterState.mutedNotificationOptions[optionKey] =
                    target.checked;
            }
            return;
        }

        if (target.matches("[data-notification-push-toggle]")) {
            notificationPreferenceState.isPushEnabled = target.checked;
            renderDetail();
            return;
        }

        if (target.matches("[data-notification-push-check]")) {
            const toggleKey = target.dataset.notificationPushCheck;
            if (
                toggleKey &&
                Object.hasOwn(notificationPreferenceState.pushAlerts, toggleKey)
            ) {
                notificationPreferenceState.pushAlerts[toggleKey] =
                    target.checked;
            }
            return;
        }

        if (target.matches("[data-privacy-posts-sensitive-toggle]")) {
            privacyPostsState.isSensitiveMediaMarked = target.checked;
            return;
        }

        if (target.matches("[data-privacy-posts-location-toggle]")) {
            privacyPostsState.isLocationEnabled = target.checked;
            return;
        }

        if (target.matches("[data-privacy-chat-toggle]")) {
            const toggleKey = target.dataset.privacyChatToggle;
            if (toggleKey === "filter-low-quality") {
                privacyChatState.isLowQualityFilterEnabled = target.checked;
                return;
            }

            if (toggleKey === "read-receipts") {
                privacyChatState.areReadReceiptsEnabled = target.checked;
                return;
            }
        }

        if (target.matches("[data-privacy-chat-allow]")) {
            privacyChatState.allow = target.value;
            return;
        }

        if (target.matches("[data-privacy-discoverability-toggle]")) {
            const toggleKey = target.dataset.privacyDiscoverabilityToggle;
            if (toggleKey === "email") {
                privacyDiscoverabilityState.isEmailDiscoverable =
                    target.checked;
                return;
            }

            if (toggleKey === "phone") {
                privacyDiscoverabilityState.isPhoneDiscoverable =
                    target.checked;
                return;
            }
        }

        if (target.matches("[data-privacy-muted-word-timeline-toggle]")) {
            mutedWordFormState.muteFromTimeline = target.checked;
            return;
        }

        if (target.matches("[data-privacy-muted-word-notifications-toggle]")) {
            mutedWordFormState.muteNotifications = target.checked;
            return;
        }

        if (target.matches("[data-privacy-muted-word-audience]")) {
            mutedWordFormState.notificationAudience = target.value;
            return;
        }

        if (target.matches("[data-privacy-muted-word-duration]")) {
            mutedWordFormState.duration = target.value;
        }
    });

    detailActionButton.addEventListener("click", () => {
        const action = detailActionButton.dataset.detailAction;
        if (action === "muted-words-add") {
            activeDetailRoute = "privacy-muted-words-add-edit";
            renderDetail();
            return;
        }
    });

    detailBackButton.addEventListener("click", () => {
        if (
            window.matchMedia("(max-width: 400px)").matches &&
            activeDetailRoute === ""
        ) {
            syncMobileDetailState(false);
            return;
        }

        if (
            activeDetailRoute === "username-edit" ||
            activeDetailRoute === "phone-edit" ||
            activeDetailRoute === "email-edit" ||
            activeDetailRoute === "country-edit" ||
            activeDetailRoute === "language-edit"
        ) {
            activeDetailRoute = "account-info-list";
        } else if (
            activeDetailRoute === "password-edit" ||
            activeDetailRoute === "deactivate-edit" ||
            activeDetailRoute === "notification-filter-edit" ||
            activeDetailRoute === "notification-preferences-edit" ||
            activeDetailRoute === "privacy-mute-block-edit" ||
            activeDetailRoute === "privacy-posts-edit" ||
            activeDetailRoute === "privacy-chat-edit" ||
            activeDetailRoute === "privacy-discoverability-edit"
        ) {
            activeDetailRoute = "";
        } else if (activeDetailRoute === "privacy-blocked-accounts-edit") {
            activeDetailRoute = "privacy-mute-block-edit";
        } else if (activeDetailRoute === "privacy-muted-accounts-edit") {
            activeDetailRoute = "privacy-mute-block-edit";
        } else if (activeDetailRoute === "privacy-muted-words-edit") {
            activeDetailRoute = "privacy-mute-block-edit";
        } else if (activeDetailRoute === "privacy-muted-notifications-edit") {
            activeDetailRoute = "privacy-mute-block-edit";
        } else if (activeDetailRoute === "privacy-muted-words-add-edit") {
            activeDetailRoute = "privacy-muted-words-edit";
        } else if (activeDetailRoute === "privacy-posts-location-edit") {
            activeDetailRoute = "privacy-posts-edit";
        } else if (activeDetailRoute === "notification-muted-edit") {
            activeDetailRoute = "notification-filter-edit";
        } else if (activeDetailRoute === "notification-push-edit") {
            activeDetailRoute = "notification-preferences-edit";
        } else if (activeDetailRoute === "account-info-list") {
            activeDetailRoute = "account-info-auth";
        } else {
            activeDetailRoute = "";
        }
        renderDetail();
    });

    phoneAddCloseButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (phoneModalState.step === "code") {
            phoneModalState.step = "add";
            phoneModalState.isHelpMenuOpen = false;
            renderPhoneAddStep();
            phoneAddInput.focus();
            return;
        }

        closeModal();
    });

    phoneAddInput.addEventListener("input", () => {
        phoneAddInput.value = phoneAddInput.value.replace(/[^0-9]/g, "");
        phoneModalState.phoneNumber = phoneAddInput.value;
        applyPhoneAddActionState();
    });

    phoneCodeInput.addEventListener("input", () => {
        phoneModalState.code = phoneCodeInput.value;
        renderPhoneAddStep();
    });

    phoneCodeHelpButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        phoneModalState.isHelpMenuOpen = !phoneModalState.isHelpMenuOpen;
        renderPhoneAddStep();
    });

    phoneAddActionButton.addEventListener("click", () => {
        const phoneNumber = phoneAddInput.value.trim();
        phoneModalState.phoneNumber = phoneNumber;

        if (!phoneNumber) {
            closeModal();
            return;
        }

        phoneVerifyNumber.textContent = phoneNumber;
        phoneVerifyModal.hidden = false;
        activeModal = "phone-verify";
        phoneVerifyConfirmButton.focus();
    });

    phoneVerifyEditButton.addEventListener("click", () => {
        phoneVerifyModal.hidden = true;
        activeModal = "phone-add";
        phoneAddInput.focus();
    });

    phoneVerifyConfirmButton.addEventListener("click", () => {
        phoneVerifyModal.hidden = true;
        activeModal = "phone-add";
        phoneModalState.step = "code";
        phoneModalState.code = "";
        phoneModalState.isHelpMenuOpen = false;
        renderPhoneAddStep();
        phoneCodeInput.focus();
    });

    phoneCodeActionButton.addEventListener("click", () => {
        const phoneItem = accountInfoItems.find((item) => item.id === "phone");
        if (phoneItem) {
            phoneItem.value = phoneModalState.phoneNumber;
        }
        const phoneValueNode = document.querySelector("[data-account-info-value='phone']");
        if (phoneValueNode instanceof HTMLElement) {
            phoneValueNode.textContent = phoneModalState.phoneNumber || "\u00a0";
        }
        phoneModalState.step = "add";
        phoneModalState.code = "";
        closeModal();
        renderDetail();
    });

    phoneCodeResendButton.addEventListener("click", (event) => {
        event.stopPropagation();
        phoneModalState.isHelpMenuOpen = false;
        renderPhoneAddStep();
        phoneCodeInput.focus();
    });

    emailAddCloseButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (emailModalState.step === "code") {
            emailModalState.step = "add";
            emailModalState.isHelpMenuOpen = false;
            renderEmailAddStep();
            emailAddInput.focus();
            return;
        }

        closeModal();
    });

    emailAddInput.addEventListener("input", () => {
        emailModalState.emailAddress = emailAddInput.value;
        applyEmailAddActionState();
    });

    emailCodeInput.addEventListener("input", () => {
        emailModalState.code = emailCodeInput.value;
        renderEmailAddStep();
    });

    emailCodeHelpButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        emailModalState.isHelpMenuOpen = !emailModalState.isHelpMenuOpen;
        renderEmailAddStep();
    });

    emailAddActionButton.addEventListener("click", () => {
        const emailAddress = emailAddInput.value.trim();
        emailModalState.emailAddress = emailAddress;

        if (!emailAddress) {
            closeModal();
            return;
        }

        emailVerifyAddress.textContent = emailAddress;
        emailVerifyModal.hidden = false;
        activeModal = "email-verify";
        emailVerifyConfirmButton.focus();
    });

    emailVerifyEditButton.addEventListener("click", () => {
        emailVerifyModal.hidden = true;
        activeModal = "email-add";
        emailAddInput.focus();
    });

    emailVerifyConfirmButton.addEventListener("click", () => {
        emailVerifyModal.hidden = true;
        activeModal = "email-add";
        emailModalState.step = "code";
        emailModalState.code = "";
        emailModalState.isHelpMenuOpen = false;
        renderEmailAddStep();
        emailCodeInput.focus();
    });

    emailCodeResendButton.addEventListener("click", (event) => {
        event.stopPropagation();
        emailModalState.isHelpMenuOpen = false;
        renderEmailAddStep();
        emailCodeInput.focus();
    });

    languageSelectionSearchInput.addEventListener("input", () => {
        languageSelectionState.query = languageSelectionSearchInput.value;
        renderLanguageSelectionModal();
    });

    languageSelectionList.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) {
            return;
        }

        const optionId = target.dataset.languageOptionId;
        if (!optionId) {
            return;
        }

        if (languageSelectionState.step === "app") {
            languageSelectionState.appLanguageId = optionId;
            renderLanguageSelectionModal();
            return;
        }

        if (target.checked) {
            languageSelectionState.selectedIds.add(optionId);
        } else {
            languageSelectionState.selectedIds.delete(optionId);
        }
    });

    languageSelectionMoreButton.addEventListener("click", () => {
        languageSelectionState.showAll = true;
        renderLanguageSelectionModal();
    });

    languageSelectionNextButton.addEventListener("click", () => {
        if (languageSelectionState.step === "choices") {
            const selectedOptions = languageSelectionOptions.filter((option) =>
                languageSelectionState.selectedIds.has(option.id),
            );
            languageSelectionState.appLanguageId =
                selectedOptions[0]?.id || "ko";
            languageSelectionState.step = "app";
            renderLanguageSelectionModal();
            languageSelectionBackButton.focus();
            return;
        }

        const languageItem = accountInfoItems.find(
            (item) => item.id === "language",
        );
        if (languageItem) {
            languageItem.value = getCombinedLanguageLabel();
        }

        closeModal();

        if (activeDetailRoute === "language-edit") {
            renderDetail();
        }
    });

    languageSelectionSkipButton.addEventListener("click", () => {
        closeModal();
    });

    languageSelectionBackButton.addEventListener("click", () => {
        languageSelectionState.step = "choices";
        renderLanguageSelectionModal();
        languageSelectionSearchInput.focus();
    });

    modalLayer.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        if (
            phoneModalState.isHelpMenuOpen &&
            !target.closest("#phoneCodeHelp")
        ) {
            phoneModalState.isHelpMenuOpen = false;
            renderPhoneAddStep();
        }

        if (
            emailModalState.isHelpMenuOpen &&
            !target.closest("#emailCodeHelp")
        ) {
            emailModalState.isHelpMenuOpen = false;
            renderEmailAddStep();
        }

        if (target.hasAttribute("data-modal-close")) {
            closeModal();
        }
    });

    appearanceAccentList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const button = target.closest("[data-accent-id]");
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }

        appearanceState.accent = button.dataset.accentId || "blue";
        applyAppearanceState();
    });

    appearanceSurfaceList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const button = target.closest("[data-surface-id]");
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }

        appearanceState.surface = button.dataset.surfaceId || "light";
        applyAppearanceState();
    });

    appearanceFontRange.addEventListener("input", () => {
        appearanceState.fontScale = appearanceFontRange.value;
        applyAppearanceState();
    });

    appearanceCompleteButton.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && activeModal) {
            closeModal();
        }
    });

    applyAppearanceState();
    renderNavigation();
    renderDetail();
    syncMobileDetailState(false);
});
