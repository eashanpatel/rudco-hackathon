---
version: 1
slug: "app-runs-id-page-tsx"
primary_target: "app/runs/[id]/page.tsx"
related_targets: ["app/app/page.tsx"]
---

# Workspace and intake home

Scope: `/app` (intake home) and `/runs/[id]` (Workspace). Visitor mode: Operate.
Task: turn an RFQ into a quote; inspect each line's spec and its source; resolve held lines; watch the total; export.
Information: original RFQ with highlighted line spans; line cards in Quoted / Needs clarification / No match lanes; spec chips with provenance; live quote ledger; pipeline stage progress; model and cost chip.
States: processing (skeletons per stage), quoted, held with question and options, no match with alternatives, resolving, error in plain language, empty intake.
Frequency: a rep runs many per day; judges once. Dense but breathable, 44px rows.

## Direction contract

THESIS: An inspection instrument for a quote: the source and the result side by side with every value traceable. It refuses the chat box and the grey admin template with one accent.
OWN-WORLD: The landing's drawing world reduced to four contributions: paper ground with white work surfaces, Inter/JetBrains Mono type, teal-steel shell accents plus ok/warn/hold/info state colours with tints, and one signature move.
STORY: The rep sees what was read, what was decided and why, fixes the held lines with one click, and exports a quote they trust.
FIRST VIEWPORT: Header (run title, model/cost chip, Export). Pipeline strip under it. Three columns: Decoder (source text with highlighted spans) left, lanes of line cards centre, sticky quote ledger right.
FORM: Pinned by the brief, no roll. Signature move: linked highlighting, hovering a line card lights its source span and the exact substrings behind each chip, drawn as dimension-style underlines.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
