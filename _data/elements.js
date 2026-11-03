// Lives with the browser JS (assets/js/data) so tools can import it; read here for templates.
// Read fresh on every build so edits are picked up while serving.
import fs from "node:fs";
import { categoryKey } from "../assets/js/lib/misc/elements.js";

// Each element also gets the periodic table's colour group for its category (categoryKey), e.g. "nonmetal"
export default () => JSON.parse(fs.readFileSync("assets/js/data/elements.json", "utf-8"))
    .map((element) => ({ ...element, categoryKey: categoryKey(element.category) }));
