/**
 * Wires up a file tool built with the fileFrame macro (macros/tool-frame.njk): choosing or dropping files, and showing
 * the results pane once there are some. Element ids all start with the frame's id: <id>Input, <id>Results, <id>Status.
 *
 * @param {object} options
 * @param {string} options.id - The frame's id, usually the page's file slug.
 * @param {number} [options.max=1] - The most files read at once; any more are left out, with a note in the status line.
 * @param {(files: File[], output: HTMLElement) => Promise<string|void>|string|void} options.run - Reads the files and
 *   shows the results in output. What it returns is shown in the status line.
 * @param {string} [options.errorPrefix] - Text shown before an error message, e.g. "Couldn't read the file".
 */
export function bindFileDrop({ id, max = 1, run, errorPrefix = "Couldn't read the file" }) {
    const input = document.getElementById(`${id}Input`);
    const output = document.getElementById(`${id}Results`);
    const status = document.getElementById(`${id}Status`);
    const drop = input.closest("[data-drop]");
    const pane = output.closest("[data-file-results]");

    const read = async (chosen) => {
        const files = [...chosen];
        if (files.length === 0) {
            return;
        }
        pane.hidden = false;
        status.classList.remove("text-danger");
        status.textContent = "Reading…";
        try {
            const message = await run(files.slice(0, max), output);
            const skipped = files.length <= max ? ""
                : max === 1 ? `Read the first of the ${files.length} files: this tool reads one at a time. `
                : `Read the first ${max} of the ${files.length} files: choose up to ${max} at a time. `;
            status.textContent = skipped + (message ?? "");
        } catch (error) {
            output.replaceChildren();
            delete output.dataset.copy;
            status.classList.add("text-danger");
            status.textContent = `${errorPrefix}: ${error.message}`;
        }
    };

    input.addEventListener("change", () => {
        read(input.files);
        // So choosing the same file again reads it again
        input.value = "";
    });

    // Dropping is handled here rather than by the input, so several files dropped on a one-file tool still read the first
    drop.addEventListener("dragover", (event) => {
        event.preventDefault();
        drop.classList.add("tool-drop--over");
    });
    for (const type of ["dragleave", "drop"]) {
        drop.addEventListener(type, () => drop.classList.remove("tool-drop--over"));
    }
    drop.addEventListener("drop", (event) => {
        event.preventDefault();
        read(event.dataTransfer.files);
    });
}
