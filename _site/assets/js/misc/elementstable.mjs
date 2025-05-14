const elementInfo = document.getElementById("elementstableResults");
document.querySelectorAll(".p-element").forEach(item => {
    item.addEventListener("click", event => {
        const elementNumber = parseInt(event.currentTarget.getAttribute("data-element"), 10);
        const element = ELEMENTS.find(el => el.number === elementNumber);
        document.querySelectorAll(".p-element").forEach(button => button.classList.remove("active"));
        event.currentTarget.classList.add("active");

        if (element) {
            const rows = [
                { label: "Atomic number", value: element.number },
                { label: "Atomic symbol", value: element.symbol },
                { label: "Category", value: element.category },
                { label: "Phase", value: element.phase },
                { label: "Group", value: element.group },
                { label: "Period", value: element.period },
                { label: "Block", value: element.block },
                { label: "Density", value: element.density },
                { label: "Boiling point", value: element.boil ? `${element.boil} K` : "Currently unavailable" },
                { label: "Melting point", value:element.melt ? `${element.melt} K` : "Currently unavailable" },
                { label: "Electron configuration", value: element.electron_configuration },
                { label: "Electron configuration (semantic)", value: element.electron_configuration_semantic },
                { label: "Further information", value: element.source ? `<a href="${element.source}" title="${element.name} wikipedia page" class="text-convrtr-link">${element.source}</a>` : null },
                { label: "Appearance", value: element.appearance ? element.appearance : "Not available" },
                { label: "Discovered by", value: element.discovered_by },
                { label: "Named by", value: element.named_by }
            ];

            let content = "";
            for (let i = 0; i < rows.length; i += 2) {
                const row1 = rows[i];
                const row2 = rows[i + 1];

                content += `
                        <div class="col fw-bold p-2">${row1.label}</div>
                        <div class="col p-2">${row1.value}</div>`;

                if (row2 && row2.value !== null && row2.value !== undefined) {
                    content += `
                        <div class="col fw-bold p-2">${row2.label}</div>
                        <div class="col p-2">${row2.value}</div>`;
                } else {
                    content += `
                        <div class="col fw-bold p-2"></div>
                        <div class="col p-2"></div>`;
                }
            }

            const elementContent = `
                <div class="elements-table">
                    <div class="row g-0 border-1 border-bottom border-dark-subtle">
                        <div class="col p-2 convrtr-table-header">
                            <p class="fs-3 mb-0 text-black">${element.name}</p>
                        </div>
                    </div>
                    <div class="row g-0">
                        <div class="col p-2" style="background-color: inherit;">
                            <p>${element.summary}</p>
                        </div>
                    </div>
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-0">
                    ${content}
                    </div>
                </div>`;

            elementInfo.innerHTML = elementContent;

            // Scroll to the relevant parts of the page
            event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" });
            elementInfo.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    });
});

const elementstableFilter = document.getElementById("elementstableFilter");
if (elementstableFilter) {
    elementstableFilter.addEventListener("change", function () {
        const filter = this.value;
        const buttons = document.querySelectorAll(".p-element");

        buttons.forEach(button => {
            // Reset all buttons to be visible
            button.classList.remove("d-none");
            button.classList.add("d-block");

            const phase = button.getAttribute("data-phase");
            const group = button.getAttribute("data-group");
            const period = button.getAttribute("data-period");
            const block = button.getAttribute("data-block");

            if (filter === "all") {
                // Show all elements
                button.classList.remove("d-none");
                button.classList.add("d-block");
            } else if (filter.startsWith("phase-") && phase !== filter.split("-")[1]) {
                // Filter by phase
                button.classList.remove("d-block");
                button.classList.add("d-none");
            } else if (filter.startsWith("group-") && group !== filter.split("-")[1]) {
                // Filter by group
                button.classList.remove("d-block");
                button.classList.add("d-none");
            } else if (filter.startsWith("period-") && period !== filter.split("-")[1]) {
                // Filter by period
                button.classList.remove("d-block");
                button.classList.add("d-none");
            } else if (filter.startsWith("block-") && block !== filter.split("-")[1]) {
                // Filter by block
                button.classList.remove("d-block");
                button.classList.add("d-none");
            }
        });
    });
}
