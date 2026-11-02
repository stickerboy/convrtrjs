// Info popovers (components/_info-popover.scss): an element with `popover` and class info-popover, opened by a button
// with popovertarget. The browser opens and closes them (click, Esc, or a click elsewhere); this places each one under
// its button, lined up with the button's right edge and kept on screen, and keeps it there while the page scrolls.
const GAP = 10;
const EDGE = 16;

function place(popover) {
    const button = document.querySelector(`[popovertarget="${popover.id}"]`);
    if (!button) {
        return;
    }
    const target = button.getBoundingClientRect();
    const width = popover.offsetWidth;
    const left = Math.max(EDGE, Math.min(target.right - width, window.innerWidth - width - EDGE));
    popover.style.left = `${left}px`;
    popover.style.top = `${target.bottom + GAP}px`;
    // The arrow points at the middle of the button
    popover.style.setProperty("--info-popover-arrow", `${target.left + target.width / 2 - left}px`);
}

for (const popover of document.querySelectorAll(".info-popover[popover]")) {
    popover.addEventListener("toggle", (event) => {
        if (event.newState === "open") {
            place(popover);
        }
    });
}

// Pages scroll inside <main>, so listen on the capture phase to hear every scroll
const follow = () => document.querySelectorAll(".info-popover:popover-open").forEach(place);
document.addEventListener("scroll", follow, { capture: true, passive: true });
window.addEventListener("resize", follow);
