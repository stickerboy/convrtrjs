/**
 * YEAH Toast! Displays a toast notification
 * @param {string} heading - The heading for the toast.
 * @param {string} content - The content of the toast.
 * @param {string} color - The color theme for the toast (optional).
 * @param {number} delay - The delay in milliseconds before the toast disappears (optional, default is 5000 milliseconds).
 * @returns {void}
 */
export function showToast(heading, content, color, delay = 5000, autohide = true) {
    let toastEL = document.getElementById("toast");
    const toast = bootstrap.Toast.getOrCreateInstance(toastEL, { delay: delay, autohide: autohide });

    toastEL.addEventListener("hidden.bs.toast", () => {
        toastEL.querySelector(".toast-header").classList.remove("text-bg-warning", "text-bg-danger");
        toastEL.querySelector(".toast-header").classList.add("text-bg-convrtr");
    });

    if (color) {
        toastEL.querySelector(".toast-header").classList.replace("text-bg-convrtr", `text-bg-${color}`);
    }
    toastEL.querySelector(".toast-header strong").textContent = heading;
    toastEL.querySelector(".toast-body").textContent = content;

    toast.show();
}
