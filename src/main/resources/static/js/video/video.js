document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".space-title");
    const editButton = document.querySelector(".edit-btn");
    if (!title || !editButton) return;

    const STORAGE_KEY = "video_space_title";

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) {
        title.textContent = saved.trim();
    }

    editButton.addEventListener("click", () => {
        const current = title.textContent.trim();
        const next = window.prompt("스페이스 이름을 입력하세요", current);
        if (next === null) return;

        const normalized = next.trim();
        if (!normalized) {
            window.alert("이름을 입력해 주세요.");
            return;
        }

        title.textContent = normalized;
        localStorage.setItem(STORAGE_KEY, normalized);
    });
});
