/**
 * Runs a set of input boxes built by the toolFrame macro's inputs or inputList (macros/tool-frame.njk): Swap between
 * two boxes, and for a list, adding and removing boxes, keeping them numbered ("String 1", "String 2"…) with ids to
 * match. The first box keeps its id, so it's always the tool's <id>Text.
 *
 * A list has data-label, data-min and data-max; its boxes can't go below min or above max. What happens is said in a
 * status element, for screen readers, and focus moves to where it makes sense: a new box, or the box after a removed one.
 *
 * @param {HTMLElement} list - The [data-input-list] element.
 * @param {object} [options]
 * @param {() => void} [options.onChange] - Called when the boxes' text changes other than by typing: a swap, or a box
 *   removed.
 * @param {HTMLElement} [options.status] - Where to say what happened, such as "Added string 3".
 * @returns {{boxes: () => HTMLTextAreaElement[], fill: (text: string) => void}} The boxes in order, and fill, which puts
 *   text in the first box and empties the rest, taking a list back to its fewest boxes.
 */
export function bindInputList(list, { onChange = () => {}, status } = {}) {
    const pane = list.parentElement;
    const add = pane.querySelector("[data-input-add]");
    const swap = list.querySelector("[data-input-swap]");
    const label = list.dataset.label ?? "";
    const min = Number(list.dataset.min ?? 0);
    const max = Number(list.dataset.max ?? Infinity);
    const items = () => [...list.querySelectorAll("[data-input-item]")];
    const boxes = () => items().map((item) => item.querySelector("[data-input-box]"));
    const baseId = boxes()[0].id;

    const say = (message) => {
        if (status) {
            status.textContent = message;
        }
    };

    // Each box's label, id and remove button follow its place in the list; remove buttons only show above the minimum,
    // and Add only below the maximum
    const renumber = () => {
        const all = items();
        all.forEach((item, i) => {
            const box = item.querySelector("[data-input-box]");
            const name = `${label} ${i + 1}`;
            box.id = i === 0 ? baseId : `${baseId}${i + 1}`;
            const boxLabel = item.querySelector("[data-input-label]");
            boxLabel.htmlFor = box.id;
            boxLabel.textContent = name;
            const remove = item.querySelector("[data-input-remove]");
            remove.setAttribute("aria-label", `Remove ${name.toLowerCase()}`);
            remove.hidden = all.length <= min;
        });
        if (add) {
            add.hidden = all.length >= max;
        }
    };

    // A new box is a copy of the first, emptied
    const addBox = () => {
        const item = items()[0].cloneNode(true);
        const box = item.querySelector("[data-input-box]");
        box.value = "";
        box.classList.remove("is-invalid", "ld-warning", "tool-pane__box--moved");
        item.querySelector("[data-count-box]").textContent = "";
        list.append(item);
        renumber();
        return box;
    };

    const removeBox = (item) => {
        const all = items();
        const index = all.indexOf(item);
        const hadText = item.querySelector("[data-input-box]").value !== "";
        item.remove();
        renumber();
        // Focus the box that took its place, or the last one, so the keyboard isn't left on nothing
        const rest = boxes();
        rest[Math.min(index, rest.length - 1)].focus();
        say(`Removed ${label.toLowerCase()} ${index + 1}`);
        if (hadText) {
            onChange();
        }
    };

    if (label) {
        add?.addEventListener("click", () => {
            if (items().length >= max) {
                return;
            }
            addBox().focus();
            const count = items().length;
            // At the most there can be, Add goes, so say why
            say(`Added ${label.toLowerCase()} ${count}${count >= max ? `. That's the most, ${max}` : ""}`);
        });
        list.addEventListener("click", (event) => {
            const remove = event.target.closest("[data-input-remove]");
            if (remove) {
                removeBox(remove.closest("[data-input-item]"));
            }
        });
        renumber();
    }

    swap?.addEventListener("click", () => {
        const [first, second] = boxes();
        [first.value, second.value] = [second.value, first.value];
        say("Swapped");
        onChange();
    });

    const fill = (text) => {
        if (label) {
            while (items().length > Math.max(min, 1)) {
                items().at(-1).remove();
            }
            renumber();
        }
        boxes().forEach((box, i) => {
            box.value = i === 0 ? text : "";
        });
    };

    return { boxes, fill };
}
