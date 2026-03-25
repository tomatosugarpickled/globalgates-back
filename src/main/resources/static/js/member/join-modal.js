document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-create");
    if (!modal) return;

    const changeButton = modal.querySelector(".change");
    const replaceEmailText = modal.querySelector(".replace-email");
    const phoneLabelText = modal.querySelector(".phone-text-in");
    const phoneInput = modal.querySelector(".phone-input");
    const closeButton = modal.querySelector(".join-modal-header-close-button, .join-modal-close");
    const modalRoot = modal.querySelector(".join-modal, .join-modal-overlay");
    const birthInput = modal.querySelector(".birth-date-input");

    const fields = [
        {
            input: modal.querySelector(".name-input"),
            box: modal.querySelector(".name-placeholder"),
            label: modal.querySelector(".name-text"),
            shrink: (label) => {
                if (!label) return;
                label.style.fontSize = "12px";
                label.style.paddingTop = "8px";
                label.style.color = "rgb(29, 155, 240)";
            },
            expand: (label) => {
                if (!label) return;
                label.style.fontSize = "17px";
                label.style.paddingTop = "16px";
                label.style.color = "rgb(83, 100, 113)";
            },
        },
        {
            input: phoneInput,
            box: modal.querySelector(".phone-placeholder"),
            label: modal.querySelector(".phone-text"),
            shrink: (label) => {
                if (!label) return;
                label.style.fontSize = "12px";
                label.style.paddingTop = "8px";
                label.style.color = "rgb(29, 155, 240)";
            },
            expand: (label) => {
                if (!label) return;
                label.style.fontSize = "17px";
                label.style.paddingTop = "16px";
                label.style.color = "rgb(83, 100, 113)";
            },
        },
        {
            input: birthInput,
            box: birthInput,
            label: modal.querySelector(".birth-date-text-input"),
            shrink: (_, input) => {
                if (!input) return;
                input.classList.add("birth-focus-placeholder");
            },
            expand: (_, input) => {
                if (!input) return;
                input.classList.remove("birth-focus-placeholder");
            },
        },
    ].filter((field) => field.input && field.box);

    const setBlue = (box) => {
        if (!box) return;
        box.style.borderColor = "rgb(29, 155, 240)";
        box.style.borderWidth = "2px";
        box.style.boxShadow = "0 0 0 2px rgba(29, 155, 240, 0.18)";
    };

    const setNeutral = (box) => {
        if (!box) return;
        box.style.borderColor = "rgb(207, 217, 222)";
        box.style.borderWidth = "1px";
        box.style.boxShadow = "none";
    };

    fields.forEach((field) => {
        if (field.input.value.trim().length > 0) {
            field.shrink(field.label, field.input);
        } else {
            field.expand(field.label, field.input);
        }

        setNeutral(field.box);

        field.input.addEventListener("focus", () => {
            field.shrink(field.label, field.input);
            setBlue(field.box);
        });

        field.input.addEventListener("input", () => {
            if (field.input.value.trim().length > 0) {
                field.shrink(field.label, field.input);
                setBlue(field.box);
            } else {
                field.expand(field.label, field.input);
                setNeutral(field.box);
            }
        });

        field.input.addEventListener("blur", () => {
            if (field.input.value.trim().length === 0) {
                field.expand(field.label, field.input);
            }
            setNeutral(field.box);
        });
    });

    if (changeButton && replaceEmailText && phoneLabelText && phoneInput) {
        let useEmail = false;

        const syncPhoneEmailMode = () => {
            if (useEmail) {
                phoneLabelText.textContent = "이메일";
                replaceEmailText.textContent = "휴대폰 사용하기";
                phoneInput.setAttribute("name", "email");
                phoneInput.setAttribute("autocomplete", "email");
                phoneInput.setAttribute("inputmode", "email");
            } else {
                phoneLabelText.textContent = "휴대폰 번호";
                replaceEmailText.textContent = "이메일 사용하기";
                phoneInput.setAttribute("name", "phone");
                phoneInput.setAttribute("autocomplete", "tel");
                phoneInput.setAttribute("inputmode", "tel");
            }
        };

        syncPhoneEmailMode();

        changeButton.addEventListener("click", () => {
            useEmail = !useEmail;
            phoneInput.value = "";
            syncPhoneEmailMode();
        });
    }

    if (closeButton && modalRoot) {
        closeButton.addEventListener("click", () => {
            modalRoot.style.display = "none";
        });
    }

    if (birthInput) {
        birthInput.addEventListener("input", () => {
            birthInput.value = birthInput.value.replace(/\D/g, "").slice(0, 8);
        });
    }
});
