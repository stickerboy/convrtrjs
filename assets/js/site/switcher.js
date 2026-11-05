// The quick switcher (partials/switcher.njk). Names of tools and site pages match as you type; the text of every page is
// searched with Pagefind, which only loads the first time the switcher opens. Opens from the header search button,
// Ctrl K (⌘ K on Apple devices) or /.

const dialog = document.getElementById("switcher");

if (dialog) {
    const input = dialog.querySelector(".switcher__input");
    const results = dialog.querySelector(".switcher__results");
    const status = dialog.querySelector(".switcher__status");
    const allResults = dialog.querySelector(".switcher__all");
    const openers = document.querySelectorAll("[data-switcher-open]");
    const isApple = /Mac|iPhone|iPad/.test(navigator.platform);

    const links = [...dialog.querySelector(".switcher__items").content.querySelectorAll("a")].map((link) => ({
        label: link.textContent.trim(),
        url: link.getAttribute("href"),
        group: link.dataset.group,
        short: link.dataset.short,
        icon: link.dataset.icon,
        landing: link.hasAttribute("data-landing"),
        // Other names a tool goes by, such as Substitution cipher for the Keyword cipher (aliases in _data/nav.json)
        aliases: (link.dataset.aliases ?? "").split("|").filter(Boolean)
    }));

    // The search box needs two characters before page text is searched, as on the search page
    const minPageTerm = 2;
    const maxPages = 5;

    let active = 0;
    let options = [];
    let pages = { term: "", state: "idle", results: [] };
    let pagefind;

    const escapeHtml = (str) => String(str ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

    const words = (term) => term.toLowerCase().split(/\s+/).filter(Boolean);

    // Every word must appear in the name. Names starting with the search come first, then names with a word starting
    // with it, then names that only contain it.
    const rank = (label, terms) => {
        const name = label.toLowerCase();
        let score = 0;
        for (const term of terms) {
            if (!name.includes(term)) {
                return -1;
            }
            score += name.startsWith(term) ? 0 : name.split(/[\s-]+/).some((word) => word.startsWith(term)) ? 1 : 2;
        }
        return score;
    };

    // Categories also match their short name, as the rail shows it, and tools their other names
    const rankLink = (link, terms) => {
        const scores = [link.label, ...(link.landing ? [link.short] : []), ...link.aliases].map((name) => rank(name, terms)).filter((score) => score >= 0);
        return scores.length ? Math.min(...scores) : -1;
    };

    // Pagefind falls back to matching the start of a word, so "zzqx" finds every Z and "brute force" finds "for".
    // Keeps pages whose marked words start with a search word, or are a stem of one ("cipher" for "ciphers").
    const isRelevant = (page, terms) => {
        const marked = [...(page.excerpt ?? "").matchAll(/<mark>(.*?)<\/mark>/g)].map((match) => match[1].toLowerCase());
        return !marked.length || marked.some((word) => terms.some((term) =>
            word.startsWith(term) || (term.startsWith(word) && word.length >= Math.max(4, term.length - 2))));
    };

    // The category or site page a result sits under, such as Changelog for a version, for its icon and label
    const sectionOf = (url) => links.find((link) => link.url !== "/" && url.startsWith(link.url) && (link.landing || link.group === "Site"));

    // Changelog versions read best newest first, so they follow the other pages in version order instead of relevance
    const version = (url) => url.match(/\/changelog\/(\d+)\.(\d+)\.(\d+)\//)?.slice(1).map(Number);
    const byVersion = (a, b) => {
        const [x, y] = [version(a.url), version(b.url)];
        if (!x || !y) {
            return Boolean(x) - Boolean(y);
        }
        return y[0] - x[0] || y[1] - x[1] || y[2] - x[2];
    };

    // Marks the first match of each word in the name
    const highlight = (label, terms) => {
        const name = label.toLowerCase();
        const marked = new Array(label.length).fill(false);
        for (const term of terms) {
            const start = name.indexOf(term);
            for (let i = start; start >= 0 && i < start + term.length; i++) {
                marked[i] = true;
            }
        }
        let html = "";
        for (let i = 0; i < label.length; i++) {
            const opens = marked[i] && !marked[i - 1];
            const closes = marked[i] && !marked[i + 1];
            html += (opens ? "<mark>" : "") + escapeHtml(label[i]) + (closes ? "</mark>" : "");
        }
        return html;
    };

    const option = (url, icon, label, detail = "", excerpt = "") => {
        const id = `switcher-option-${options.length}`;
        options.push(url);
        return `<a class="switcher__option" role="option" id="${id}" href="${escapeHtml(url)}" tabindex="-1" aria-selected="false">
            <i class="bi bi-${escapeHtml(icon)}" aria-hidden="true"></i>
            <span class="switcher__label">${label}${excerpt ? `<small class="switcher__excerpt">${excerpt}</small>` : ""}</span>
            ${detail ? `<span class="switcher__detail">${escapeHtml(detail)}</span>` : ""}
        </a>`;
    };

    const group = (id, title, content) => `<div class="switcher__group" role="group" aria-labelledby="${id}">
        <p class="switcher__group-title" id="${id}">${title}</p>${content}</div>`;

    const message = (text) => `<p class="switcher__message">${text}</p>`;

    // Lists every tool by category when there's no search; otherwise the matching names, then pages mentioning it
    const render = () => {
        const term = input.value.trim();
        const terms = words(term);
        const activeUrl = options[active];
        let html = "";
        let count = 0;
        options = [];

        if (!terms.length) {
            const groups = [...new Set(links.map((link) => link.group))];
            for (const [i, name] of groups.entries()) {
                const items = links.filter((link) => link.group === name && !link.landing);
                html += group(`switcher-group-${i}`, escapeHtml(name), items.map((link) => option(link.url, link.icon, escapeHtml(link.label))).join(""));
            }
        } else {
            const matches = links
                .map((link) => ({ ...link, score: rankLink(link, terms) }))
                .filter((link) => link.score >= 0)
                .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label));
            count = matches.length;
            if (matches.length) {
                html += group("switcher-group-links", "Go to", matches.map((link) =>
                    option(link.url, link.icon, highlight(link.label, terms), link.landing ? "Category" : link.short)).join(""));
            }

            if (term.length >= minPageTerm && pages.state !== "unavailable") {
                const shown = new Set(options);
                const found = pages.results.filter((page) => !shown.has(page.url) && isRelevant(page, terms)).slice(0, maxPages).sort(byVersion);
                let content;
                if (pages.term !== term || pages.state === "loading") {
                    content = message("Searching pages…");
                } else if (found.length) {
                    content = found.map((page) => {
                        const section = sectionOf(page.url);
                        return option(page.url, section?.icon ?? "file-earmark-text", escapeHtml(page.meta?.title ?? page.url),
                            section ? (section.landing ? section.short : section.label) : "", page.excerpt);
                    }).join("");
                } else {
                    content = message(`No ${matches.length ? "other " : ""}pages mention “${escapeHtml(term)}”`);
                }
                html += group("switcher-group-pages", "Pages", content);
                count += found.length;
            } else if (!matches.length) {
                html += message(term.length < minPageTerm
                    ? `Nothing is called “${escapeHtml(term)}”. Type another letter to search the text of every page.`
                    : `Nothing matches “${escapeHtml(term)}”`);
            }
        }

        results.innerHTML = html;
        // Stay on the same result as the list fills in, or start from the top
        active = Math.max(options.indexOf(activeUrl), 0);
        mark();

        allResults.hidden = term.length < minPageTerm;
        allResults.href = `${allResults.dataset.searchUrl}?t=${encodeURIComponent(term)}`;
        status.textContent = terms.length ? (count ? `${count} result${count === 1 ? "" : "s"}` : "No results") : "";
    };

    const mark = () => {
        const current = document.getElementById(`switcher-option-${active}`);
        results.querySelectorAll("[aria-selected=true]").forEach((el) => el.setAttribute("aria-selected", "false"));
        if (current) {
            current.setAttribute("aria-selected", "true");
            current.scrollIntoView({ block: "nearest" });
            input.setAttribute("aria-activedescendant", current.id);
        } else {
            input.removeAttribute("aria-activedescendant");
        }
    };

    const loadPagefind = () => {
        pagefind ??= import(dialog.dataset.pagefind)
            .then(async (module) => {
                await module.options({ excerptLength: 16 });
                module.init();
                return module;
            })
            .catch(() => null);
        return pagefind;
    };

    const searchPages = async (term) => {
        pages = { term, state: "loading", results: [] };
        const module = await loadPagefind();
        if (!module) {
            pages.state = "unavailable";
            render();
            return;
        }
        // Resolves to null when a newer search replaces this one
        const search = await module.debouncedSearch(term, {}, 250);
        if (!search || input.value.trim() !== term) {
            return;
        }
        const found = await Promise.all(search.results.slice(0, maxPages * 2).map((result) => result.data()));
        if (input.value.trim() === term) {
            pages = { term, state: "done", results: found };
            render();
        }
    };

    const update = () => {
        const term = input.value.trim();
        active = 0;
        options = [];
        if (term.length >= minPageTerm) {
            searchPages(term);
        }
        render();
    };

    const open = () => {
        if (dialog.open) {
            return;
        }
        input.value = "";
        active = 0;
        options = [];
        render();
        dialog.showModal();
        input.focus();
        loadPagefind();
    };

    const move = (by) => {
        if (options.length) {
            active = (active + by + options.length) % options.length;
            mark();
        }
    };

    input.addEventListener("input", update);
    input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            move(event.key === "ArrowDown" ? 1 : -1);
        } else if (event.key === "Enter") {
            event.preventDefault();
            const url = options[active] ?? (allResults.hidden ? null : allResults.href);
            if (url) {
                window.location.assign(url);
            }
        }
    });
    results.addEventListener("mousemove", (event) => {
        const target = event.target.closest(".switcher__option");
        const index = target ? Number(target.id.replace("switcher-option-", "")) : -1;
        if (index >= 0 && index !== active) {
            active = index;
            mark();
        }
    });

    dialog.querySelector(".switcher__close").addEventListener("click", () => dialog.close());
    // The dialog has no padding, so a click on the dialog itself is a click on the backdrop
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    for (const opener of openers) {
        opener.addEventListener("click", open);
        if (isApple) {
            opener.setAttribute("aria-keyshortcuts", "Meta+K /");
            opener.querySelectorAll("[data-switcher-key]").forEach((key) => { key.textContent = "⌘ K"; });
        }
    }

    const isEditable = (target) => target instanceof Element && target.closest("input, textarea, select, [contenteditable]:not([contenteditable=false])");

    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() === "k" && (isApple ? event.metaKey : event.ctrlKey) && !event.altKey && !event.shiftKey) {
            event.preventDefault();
            if (dialog.open) {
                dialog.close();
            } else {
                open();
            }
        } else if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !dialog.open && !isEditable(event.target)) {
            event.preventDefault();
            open();
        }
    });
}
