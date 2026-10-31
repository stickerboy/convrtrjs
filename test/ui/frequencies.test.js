import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { uniqueArray, countArrayFreq } from "../../assets/js/lib/toolkit.js";
import { styledUniqueArrayItems, styledArrayFrequencies } from "../../assets/js/ui/frequencies.js";

describe("frequency HTML", () => {
    it("renders as before", (t) => {
        t.assert.snapshot(styledUniqueArrayItems(uniqueArray("ab c")));
        t.assert.snapshot(styledArrayFrequencies(countArrayFreq("aab"), "Test"));
    });
    it("renders nothing when there are no frequencies", () => {
        assert.equal(styledArrayFrequencies({}), "");
    });
});
