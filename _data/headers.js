// Lives with the browser JS (assets/js/data) so tools can import it; read here for templates.
// Read fresh on every build so edits are picked up while serving.
import fs from "node:fs";

export default () => JSON.parse(fs.readFileSync("assets/js/data/headers.json", "utf-8"));
