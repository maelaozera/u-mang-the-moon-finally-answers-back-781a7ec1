// The Moon Finally Answers Back — u-mang-the-moon-finally-answers-back-781a7ec1
//
// Writes a single line, in the voice of the Moon, to /output/entry.txt.
// The line answers everyone who has ever stared up at it, wished on it,
// howled at it, or made it a late-night promise.
//
// Gate: the output must be UTF-8 text of 1 to 240 characters, not only
// whitespace. This program self-checks that before writing.
//
// Layout of this file:
//   1. Constants — the entry text and the output gate limits.
//   2. Validation helpers — one small check per rule, so each failure
//      names the rule that was broken.
//   3. Writer — prepares the output directory and writes the entry.
//   4. main() — ties the steps together in order.

import { mkdirSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// The entry itself. The em dash is written as the escape \u2014 so the
// source stays plain ASCII while the output keeps the intended character.
const ENTRY =
  "Every night you wish on me, howl at me, promise me the world \u2014 and not once has anyone wished me a good night back.";

// Bounds for the make.fun entry gate, counted in Unicode code points
// (so characters outside the BMP, if any, count as one, not two).
const MIN_LENGTH = 1;
const MAX_LENGTH = 240;

const OUTPUT_DIR = "/output";
const OUTPUT_PATH = "/output/entry.txt";

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

// Count code points instead of UTF-16 code units, matching how the gate
// measures the entry.
function countCharacters(text: string): number {
  return [...text].length;
}

// The entry must sit inside the allowed length window.
function validateLength(text: string): void {
  const length = countCharacters(text);
  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(
      `Entry must be ${MIN_LENGTH} to ${MAX_LENGTH} characters, got ${length}.`
    );
  }
}

// The entry must contain at least one non-whitespace character.
function assertNotBlank(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
}

// A one-liner entry must not smuggle in a second line: no line breaks.
function assertSingleLine(text: string): void {
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
}

// Run every validation rule in turn.
function validateEntry(text: string): void {
  validateLength(text);
  assertNotBlank(text);
  assertSingleLine(text);
}

// ---------------------------------------------------------------------------
// Writer
// ---------------------------------------------------------------------------

// Ensure the output directory exists, then write the entry as UTF-8
// without a trailing newline (the gate counts the raw file contents).
// writeFileSync replaces any previous entry file, so re-runs are
// idempotent: the same input always produces the same file.
function writeEntry(text: string): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, text, "utf8");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  validateEntry(ENTRY);
  writeEntry(ENTRY);
  console.log(`Wrote ${countCharacters(ENTRY)} characters to ${OUTPUT_PATH}`);
}

main();
