export async function getExifInfo(selectedFile) {
    const arrayBuffer = await selectedFile.arrayBuffer();

    try {
        const tags = await ExifReader.load(arrayBuffer);
        const output = document.getElementById("exifResults");

        // Clear previous content
        output.innerHTML = "";

        // Create table
        const table = document.createElement("table");
        table.style.width = "100%";
        table.className = "table table-striped hash-table";

        // Table header
        const thead = document.createElement("thead");
        thead.classList.add("table-success");
        thead.innerHTML = `
            <tr>
                <th scope="col">Tag</th>
                <th scope="col">Value</th>
            </tr>
        `;
        table.appendChild(thead);

        // Table body
        const tbody = document.createElement("tbody");
        tbody.classList.add("active");

        for (const [tag, data] of Object.entries(tags)) {
            const row = document.createElement("tr");

            const tagCell = document.createElement("th");
            tagCell.scope = "row";
            tagCell.rowSpan = 1; 
            tagCell.textContent = tag;

            const valueCell = document.createElement("td");
            valueCell.textContent = data.description || data.value || "—";

            row.appendChild(tagCell);
            row.appendChild(valueCell);
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        output.appendChild(table);

    } catch (error) {
        document.getElementById("exifResults").textContent = `Error reading EXIF data: ${error}`;
    }
}