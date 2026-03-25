document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-create");
    if (!modal) return;

    const nextButton = modal.querySelector(".next-button");
    const nameInput = modal.querySelector(".name-input");
    const identityInput = modal.querySelector(".phone-input");
    const birthInput = modal.querySelector(".birth-date-input");
    const phoneLabelText = modal.querySelector(".phone-text-in");
    const changeButton = modal.querySelector(".change");

    if (!nextButton || !nameInput || !identityInput || !birthInput || !phoneLabelText) {
        return;
    }

    const fields = [
        {
            input: nameInput,
            box: modal.querySelector(".name-placeholder"),
            host: modal.querySelector(".name-placeholder-wrap"),
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "이름을 입력하세요";
                if (trimmed.length < 2) return "이름은 2자 이상 입력하세요";
                return "";
            },
        },
        {
            input: identityInput,
            box: modal.querySelector(".phone-placeholder"),
            host: modal.querySelector(".phone-number-placeholder"),
            normalize: (value) => {
                if (phoneLabelText.textContent.trim() === "이메일") {
                    return value.trimStart();
                }
                return value.replace(/\D/g, "").slice(0, 11);
            },
            validate: (value) => {
                const trimmed = value.trim();
                const isEmailMode = phoneLabelText.textContent.trim() === "이메일";

                if (!trimmed) {
                    return isEmailMode ? "이메일을 입력하세요" : "휴대폰 번호를 입력하세요";
                }

                if (isEmailMode) {
                    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmed)
                        ? ""
                        : "이메일 형식이 올바르지 않습니다";
                }

                return /^01\d{8,9}$/.test(trimmed)
                    ? ""
                    : "휴대폰 번호 형식이 올바르지 않습니다";
            },
        },
        {
            input: birthInput,
            box: birthInput,
            host: modal.querySelector(".birth-date"),
            normalize: (value) => value.replace(/\D/g, "").slice(0, 8),
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "생년월일을 입력하세요";
                if (!/^\d{8}$/.test(trimmed)) return "생년월일 8자리를 입력하세요";

                const year = Number(trimmed.slice(0, 4));
                const month = Number(trimmed.slice(4, 6));
                const day = Number(trimmed.slice(6, 8));
                const date = new Date(year, month - 1, day);
                const today = new Date();

                const validDate =
                    date.getFullYear() === year &&
                    date.getMonth() === month - 1 &&
                    date.getDate() === day;

                if (!validDate) return "올바른 생년월일이 아닙니다";
                if (date > today) return "미래 날짜는 입력할 수 없습니다";
                if (year < 1900) return "올바른 생년월일이 아닙니다";
                return "";
            },
        },
    ];

    const ensureErrorNode = (host) => {
        if (!host) return null;
        let node = host.querySelector(".field-error-message");
        if (!node) {
            node = document.createElement("div");
            node.className = "field-error-message";
            host.appendChild(node);
        }
        return node;
    };

    const setRed = (box) => {
        if (!box) return;
        box.style.borderColor = "rgb(244, 33, 46)";
        box.style.borderWidth = "2px";
        box.style.boxShadow = "0 0 0 2px rgba(244, 33, 46, 0.18)";
    };

    const clearError = (field) => {
        const node = ensureErrorNode(field.host);
        node?.classList.remove("show");
    };

    const showError = (field, message) => {
        const node = ensureErrorNode(field.host);
        if (!node) return;
        node.textContent = message;
        node.classList.add("show");
    };

    const getError = (field) => field.validate(field.input.value);

    const syncButton = () => {
        const hasError = fields.some((field) => getError(field));
        nextButton.disabled = hasError;
        nextButton.style.opacity = hasError ? "0.5" : "1";
    };

    fields.forEach((field) => {
        const normalize = field.normalize || ((value) => value);

        field.input.addEventListener("input", () => {
            const normalized = normalize(field.input.value);
            if (normalized !== field.input.value) {
                field.input.value = normalized;
            }

            const message = getError(field);
            if (message && field.input.value.trim().length > 0) {
                showError(field, message);
            } else {
                clearError(field);
            }

            syncButton();
        });

        field.input.addEventListener("blur", () => {
            const message = getError(field);
            if (message) {
                showError(field, message);
                setRed(field.box);
            } else {
                clearError(field);
            }

            syncButton();
        });
    });

    changeButton?.addEventListener("click", () => {
        clearError(fields[1]);
        syncButton();
    });

    nextButton.addEventListener(
        "click",
        (event) => {
            const invalidField = fields.find((field) => getError(field));
            if (!invalidField) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            showError(invalidField, getError(invalidField));
            setRed(invalidField.box);
            invalidField.input.focus();
        },
        true
    );

    syncButton();
});
