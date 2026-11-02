import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { characterName } from "../../assets/js/ui/frequencies.js";

describe("frequency tables", () => {
    it("names characters that can't be seen", () => {
        assert.equal(characterName(" "), "Space");
        assert.equal(characterName("\n"), "New line");
        assert.equal(characterName("\t"), "Tab");
        assert.equal(characterName("\x00"), "NUL");
        assert.equal(characterName("\x07"), "Control");
        assert.equal(characterName("\x85"), "Control");
    });
    it("leaves characters that can be seen alone", () => {
        for (const char of ["a", "!", "é", "😀"]) {
            assert.equal(characterName(char), null, char);
        }
    });
});
