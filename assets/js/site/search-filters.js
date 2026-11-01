// The search page's filters, shown in the sidebar panel (partials/panels/search.njk). They drive the same Pagefind search
// as the search box and results. Chips combine, so each one narrows the results further; a chip that would leave no
// results is disabled, and one no page has at all is hidden.

window.addEventListener("DOMContentLoaded", () => {
    const panel = document.querySelector("[data-search-filters]");
    const pagefind = window.PagefindComponents?.getInstanceManager().getInstance();

    if (!panel || !pagefind) {
        return;
    }

    const chips = [...panel.querySelectorAll("[data-filter]")];
    const clear = panel.querySelector(".search-filters__clear");
    let selected = {};
    let counts = {};
    let totals = null;

    const isOn = (chip) => selected[chip.dataset.filter]?.includes(chip.dataset.value) ?? false;

    const render = () => {
        for (const chip of chips) {
            const { filter, value } = chip.dataset;
            const count = counts[filter]?.[value] ?? 0;
            const on = isOn(chip);
            chip.setAttribute("aria-pressed", on);
            chip.disabled = !on && count === 0;
            chip.hidden = totals !== null && !totals[filter]?.[value];
            chip.querySelector(".filter-chip__count").textContent = count;
        }
        clear.hidden = !Object.keys(selected).length;
    };

    // With a filter but no search term, list every page that matches it; with neither, show nothing as before
    const apply = (filters) => {
        pagefind.faceted = Object.keys(filters).length > 0;
        pagefind.triggerFilters(filters);
    };

    pagefind.on("filters", ({ available, total }) => {
        counts = available ?? {};
        totals ??= total;
        render();
    });
    pagefind.on("search", (term, filters) => {
        selected = Object.fromEntries(Object.entries(filters ?? {}).filter(([, values]) => Array.isArray(values) && values.length));
        // A cleared search reports no counts, so fall back to every page's
        if (!String(term ?? "").trim() && !Object.keys(selected).length && totals) {
            counts = totals;
        }
        render();
    });

    panel.addEventListener("click", (event) => {
        const chip = event.target.closest("[data-filter]");
        if (!chip) {
            return;
        }
        const { filter, value } = chip.dataset;
        const values = new Set(selected[filter]);
        if (!values.delete(value)) {
            values.add(value);
        }
        const filters = { ...selected, [filter]: [...values] };
        if (!values.size) {
            delete filters[filter];
        }
        apply(filters);
    });
    clear.addEventListener("click", () => apply({}));

    pagefind.triggerLoad?.();
    render();
});
