// Run: npx tsx --env-file=.env.local scripts/smokeNicrron.ts
import { callJson } from "../lib/llm";

async function main() {
  const r = await callJson({
    system: 'Return JSON: {"ok": true, "grade": string|null} for the metal grade in the text.',
    user: "304 SS sheet 16ga 4x8",
  });
  console.log(r.text);
  console.log(r.usage);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
