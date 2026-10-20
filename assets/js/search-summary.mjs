// Replacement for <pagefind-summary>, which only sets textContent and so can't render markup.
// Renders the same translation strings, wrapping [COUNT] and [SEARCH_TERM] in badges.

const escapeHtml = (str) => String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

const badge = (value) => `<span class="badge text-bg-convrtr">${escapeHtml(value)}</span>`;
const formatText = (value) => `<span class="text-convrtr"><strong>${escapeHtml(value)}</strong></span>`;

class ConvrtrSummary extends HTMLElement {
    connectedCallback() {
        if (this.containerEl) {
            return;
        }

        this.term = "";
        this.containerEl = document.createElement("div");
        this.containerEl.className = "pf-summary";
        this.containerEl.setAttribute("aria-live", "polite");
        this.appendChild(this.containerEl);

        const manager = window.PagefindComponents?.getInstanceManager();
        const instance = manager?.getInstance(this.getAttribute("instance") || "default");

        if (!instance) {
            return;
        }

        this.instance = instance;
        instance.on("search", (term) => {
            this.term = String(term ?? "").trim();
        }, this);
        instance.on("loading", () => {
            this.render("searching", { SEARCH_TERM: badge(this.term) }, `Searching for ${formatText(this.term)}...`);
        }, this);
        instance.on("results", (searchResult) => {
            this.onResults(searchResult);
        }, this);
        instance.on("error", (error) => {
            const message = error?.message || instance.translate("error_search") || "Search failed";
            this.containerEl.textContent = `Error: ${message}`;
        }, this);
    }

    onResults(searchResult) {
        if (!searchResult) {
            return;
        }

        const count = searchResult.results?.length ?? 0;

        if (!this.term) {
            this.containerEl.innerHTML = "";
            return;
        }

        const key = count === 0 ? "zero_results" : count === 1 ? "one_result" : "many_results";
        this.render(
            key,
            { SEARCH_TERM: formatText(this.term), COUNT: badge(count) },
            `${badge(count)} result${count === 1 ? "" : "s"} for ${formatText(this.term)}`
        );
    }

    render(key, values, fallback) {
        // values are pre-escaped badge HTML; translation strings are our own, so innerHTML is safe here
        this.containerEl.innerHTML = this.instance.translate(key, values) || fallback;
    }
}

if (!customElements.get("convrtr-summary")) {
    customElements.define("convrtr-summary", ConvrtrSummary);
}
