// The errors a browser gives for a file it can't open, rather than one the tool couldn't make sense of
const UNREADABLE = new Set(["NotFoundError", "NotReadableError", "SecurityError", "AbortError"]);

/**
 * Says what went wrong reading a file, in plain words. The browser's own message for a file it can't open, such as a
 * dropped folder or a file changed since it was chosen, says little ("A requested file or directory could not be
 * found…"), so it's replaced.
 *
 * @param {Error} error - What reading the file threw.
 * @returns {string} The message to show, starting in lowercase, to follow "Couldn't read the file: ".
 */
export function readProblem(error) {
    return UNREADABLE.has(error?.name)
        ? "the browser couldn't open it. It may be a folder, or it changed or moved after you chose it"
        : error?.message ?? String(error);
}

/**
 * Wires up a file tool built with the fileFrame macro (macros/tool-frame.njk): choosing or dropping files, and showing
 * the results pane once there are some. Element ids all start with the frame's id: <id>Input, <id>Results, <id>Status.
 *
 * @param {object} options
 * @param {string} options.id - The frame's id, usually the page's file slug.
 * @param {number} [options.max=1] - The most files read at once; any more are left out, with a note in the status line.
 * @param {(files: File[], output: HTMLElement) => Promise<string|void>|string|void} options.run - Reads the files and
 *   shows the results in output, a spare element whose contents move to the page when it's done, so anything kept for
 *   later should be the elements themselves, not found in output then. What it returns is shown in the status line.
 * @param {string} [options.errorPrefix] - Text shown before an error message, e.g. "Couldn't read the file".
 */
export function bindFileDrop({ id, max = 1, run, errorPrefix = "Couldn't read the file" }) {
    const input = document.getElementById(`${id}Input`);
    const output = document.getElementById(`${id}Results`);
    const status = document.getElementById(`${id}Status`);
    const drop = input.closest("[data-drop]");
    const pane = output.closest("[data-file-results]");

    // Each read is counted, so a slow file finishing after a newer one doesn't replace its result
    let reads = 0;
    const read = async (chosen) => {
        const files = [...chosen];
        if (files.length === 0) {
            return;
        }
        const thisRead = ++reads;
        pane.hidden = false;
        status.classList.remove("text-danger");
        status.textContent = "Reading…";
        // The newer file's result is drawn into a spare output, so the one showing isn't touched until it's ready
        const target = document.createElement("div");
        try {
            const message = await run(files.slice(0, max), target);
            if (thisRead !== reads) {
                return;
            }
            output.replaceChildren(...target.childNodes);
            if (target.dataset.copy === undefined) {
                delete output.dataset.copy;
            } else {
                output.dataset.copy = target.dataset.copy;
            }
            const skipped = files.length <= max ? ""
                : max === 1 ? `Read the first of the ${files.length} files: this tool reads one at a time. `
                : `Read the first ${max} of the ${files.length} files: choose up to ${max} at a time. `;
            status.textContent = skipped + (message ?? "");
        } catch (error) {
            if (thisRead !== reads) {
                return;
            }
            output.replaceChildren();
            delete output.dataset.copy;
            status.classList.add("text-danger");
            status.textContent = `${errorPrefix}: ${readProblem(error)}`;
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
