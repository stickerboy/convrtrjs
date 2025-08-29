import { isLikelyJSON } from "../tools.mjs";

let locStore = [];
const sortedEntries = Object.entries(localStorage)
    .map(([key, value]) => {
        if (isLikelyJSON(value)) {
            try {
                const parsed = JSON.parse(value);
                return { key, ...parsed };
            } catch {
                return { key, value };
            }
        } else {
            return { key, value };
        }
    })
    .sort((a, b) => {
        const nameA = a.name?.toLowerCase() || a.key.toLowerCase();
        const nameB = b.name?.toLowerCase() || b.key.toLowerCase();
        return nameA.localeCompare(nameB);
    });

if (localStorage.length > 0) {
    locStore.push(`<div class="table-responsive">`);
    locStore.push(`     <table class="table table-striped mb-0">
        <thead class="table-success">
            <tr>
                <th scope="col" class="col-4 col-md-4 col-lg-4">Storage item</th>
                <th scope="col">Value</th>
            </tr>
        </thead>
        <tbody class="active" id="lsResults">`);

    sortedEntries.forEach(entry => {
        const { key, id, name, value, description } = entry;

        if (id === "theme" || id === "legacy") {
            locStore.push(`<tr>
                <th scope="row" rowspan="1">
                    <span class="display-6 fs-6 fw-normal">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </th>
                <td>
                    ${name ?? key}${description ? ` — ${description}` : ""}
                </td>
            </tr>`);
        } else if (typeof value === "string" && (value === "true" || value === "false")) {
            locStore.push(`<tr>
                <th scope="row" rowspan="1">
                    <span class="display-6 fs-6 fw-normal">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </th>
                <td>${value === "false" ? "Collapsed" : "Expanded"}</td>
            </tr>`);
        } else {
            locStore.push(`<tr>
                <th scope="row" rowspan="1">
                    <span class="display-6 fs-6 fw-normal">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </th>
                <td>${value}</td>
            </tr>`);
        }
    });

    locStore.push(`        </tbody>
        </table>
    </div>`);
} else {
    locStore.push(`<div class="alert alert-info mb-0" role="alert">
        You have no local storage items stored for our site at this time.
    </div>`);
}


document.addEventListener("DOMContentLoaded", () => {
    const locStorageContainer = document.querySelector(".privacy-localstorage");
    if (locStorageContainer) {
        locStorageContainer.innerHTML = locStore.join("");
    }
});

// Ensure the localStorage variable is initialized
if (!locStore) {
    locStore = [];
}