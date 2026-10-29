import FORERUNNER from "../../data/forerunner.json" with { type: "json" };

// [glyph, character] pairs for each Forerunner glyph (the font maps each glyph to a character), plus space
export const fralphabet = [[" ", " "], ...FORERUNNER.map(({ glyph, key }) => [glyph, key])];
