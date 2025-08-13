import { isLikelyJSON } from "../tools.mjs";

let locStore = [];

if (localStorage.length > 0) {
    locStore.push(`<div class="table-responsive">`);
    locStore.push(`     <table class="table table-striped hash-table mb-0">
        <thead class="table-success">
            <tr>
                <th scope="col" class="col-4 col-md-4 col-lg-4">Storage item</th>
                <th scope="col">Value</th>
            </tr>
        </thead>
        <tbody class="active" id="lsResults">`);
            Object.entries(localStorage).forEach(([key, value]) => {
                if (isLikelyJSON(value)) {
                    value = JSON.parse(value);
                    locStore.push(`<tr>
                                                    <th scope="row" rowspan="1">
                                                        <span class="display-6 fs-6 fw-normal">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                    </th>
                                                    <td>
                                                        ${value.name ?? value.name}${value.description ? ` — ${value.description}` : ""}
                                                    </td>
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