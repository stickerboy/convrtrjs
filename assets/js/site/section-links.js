// Links to a page's own sections, in its sidebar panel and in the row of the same links shown when the panel isn't
// (the Settings and UI kit pages): marks the section being read, as you scroll or when you pick one. Each link has
// data-section-link with its section's id. The row scrolls sideways on phones, so it brings the marked link into view.

const links = [...document.querySelectorAll("[data-section-link]")];
const scroller = document.getElementById("content");

if (links.length && scroller) {
    const ids = [...new Set(links.map((link) => link.dataset.sectionLink))];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    /**
     * Marks the links to one section as the place being read, and unmarks the rest.
     *
     * @param {string} id - The section's id.
     * @returns {void}
     */
    const mark = (id) => {
        for (const link of links) {
            if (link.dataset.sectionLink === id) {
                const changed = link.getAttribute("aria-current") !== "location";
                link.setAttribute("aria-current", "location");
                // After marking it, as the bold text makes it a little wider
                const row = link.closest(".section-nav");
                if (changed && row) {
                    row.scrollLeft = link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2;
                }
            } else {
                link.removeAttribute("aria-current");
            }
        }
    };

    /**
     * Marks the section being read: the last whose top has passed a third of the way down, the last at the very
     * bottom, or the first.
     *
     * @returns {void}
     */
    const onScroll = () => {
        const line = scroller.getBoundingClientRect().top + scroller.clientHeight / 3;
        const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
        const current = atEnd ? sections.at(-1) : sections.filter((section) => section.getBoundingClientRect().top <= line).at(-1) || sections[0];
        if (current) {
            mark(current.id);
        }
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}
