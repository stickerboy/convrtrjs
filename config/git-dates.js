import fs from "node:fs";
import { execFileSync } from "node:child_process";

let lastCommitDates = null;
let uncommittedFiles = null;

const git = (...args) => execFileSync("git", args, { encoding: "utf-8", maxBuffer: 64 * 1024 * 1024 });

/**
 * Builds a map of file path -> date of the last commit that touched it,
 * from a single `git log` call (newest first, so the first date seen wins).
 */
function loadGitDates() {
    lastCommitDates = new Map();
    uncommittedFiles = new Set();

    try {
        let date;
        for (const line of git("log", "--format=%x00%cI", "--name-only", "--no-renames").split("\n")) {
            if (line.startsWith("\0")) {
                date = new Date(line.slice(1));
            } else if (line && !lastCommitDates.has(line)) {
                lastCommitDates.set(line, date);
            }
        }

        for (const line of git("status", "--porcelain", "--no-renames").split("\n")) {
            if (line) {
                uncommittedFiles.add(line.slice(3));
            }
        }
    } catch {
        // Not a git checkout (or git unavailable) - everything falls back to mtime
    }
}

/** Forget cached dates, so the next lookup re-reads git (e.g. between watch rebuilds). */
export function resetGitDates() {
    lastCommitDates = null;
    uncommittedFiles = null;
}

/**
 * Last modified date for an input file: the last commit date, or the file's
 * mtime if it has uncommitted changes or has never been committed.
 * Requires full history in CI (actions/checkout `fetch-depth: 0`).
 *
 * @param {string} inputPath - Eleventy input path, e.g. "./pages/hex/shift.liquid"
 * @returns {Date}
 */
export function lastModified(inputPath) {
    if (!lastCommitDates) {
        loadGitDates();
    }

    const file = inputPath.replace(/^\.\//, "");
    if (!uncommittedFiles.has(file) && lastCommitDates.has(file)) {
        return lastCommitDates.get(file);
    }
    return fs.statSync(inputPath).mtime;
}
