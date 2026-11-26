// Funniest Cat Voicemail Greeting — entry program.
// Writes one voicemail greeting as if a cat recorded it (<=120 chars) to
// /output/entry.txt. The greeting is a deadpan call menu: the vase fell, the
// dinner is late — the cat's own voice, specific to cats, spoken aloud.
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const MAX_CHARS = 120;

const GREETING_PARTS = [
  "This is the cat.",
  "If it's about the vase: it fell.",
  "If it's about dinner: it's late.",
  "Leave a message.",
];

function composeGreeting(): string {
  return GREETING_PARTS.join(" ");
}

function checkGreeting(text: string): void {
  const line = text.trim();
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`greeting fails the 1-${MAX_CHARS} character gate`);
  }
  if (line.includes("\n")) {
    throw new Error("greeting must be a single line");
  }
  // It must be a cat's voicemail: the cat speaks, and it names cat business.
  if (!/^This is the cat\./.test(line) || !/vase/.test(line) || !/dinner/.test(line)) {
    throw new Error("greeting must keep the cat's voice and the cat's business");
  }
  // No apology, no confession: the cat never apologises.
  if (/sorry|apolog|my fault/i.test(line)) {
    throw new Error("the cat never apologises");
  }
  // A voicemail greeting must invite a message after the beep.
  if (!/Leave a message/.test(line)) {
    throw new Error("greeting must invite a message");
  }
}

async function run(): Promise<void> {
  const line = composeGreeting();
  checkGreeting(line);
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  await mkdir(outDir, { recursive: true });
  const target = resolve(outDir, "entry.txt");
  await writeFile(target, new TextEncoder().encode(line));
  console.log(`wrote ${[...line].length} chars to ${target}`);
}

await run();
