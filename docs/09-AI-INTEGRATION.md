# 9. AI Integration (Claude)

All AI runs **server-side only**, inside `server/src/services/aiService.js`, using the
official Anthropic SDK. The browser never sees the API key.

## 9.1 Setup
```bash
# in /server
npm install @anthropic-ai/sdk
```
```js
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
```

- **Model:** `claude-opus-4-8` — 1M context, strong at multilingual (Greek) text and
  structured extraction.
- **Thinking:** adaptive only — `thinking: { type: "adaptive" }`. (Do **not** send
  `budget_tokens`, `temperature`, `top_p`, or `top_k` — they return `400` on this model.)
- **Effort:** `output_config: { effort: "medium" }` is a good cost/quality balance for
  extraction; raise to `high` for the compliance reasoning pass.
- **max_tokens:** keep non-streaming requests ≤ ~16000 (avoids SDK HTTP timeouts).

## 9.2 Three AI jobs

### Job 1 — Tender executive summary + key requirements (on `/api/tender/:id`)
Feed `tender.rawRequirementsText` (Greek or English) and extract structured fields.
Use **structured outputs** so the result validates against our schema:
```js
const resp = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 4000,
  thinking: { type: "adaptive" },
  output_config: {
    effort: "medium",
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          executiveSummary: { type: "string" },
          keyRequirements: {
            type: "array",
            items: {
              type: "object", additionalProperties: false,
              properties: {
                label: { type: "string" },
                detail: { type: "string" },
                category: { type: "string", enum: ["technical","legal","financial","experience","other"] }
              },
              required: ["label","detail","category"]
            }
          },
          requiredCertifications: { type: "array", items: { type: "string" } },
          minTeamSize: { type: ["integer","null"] },
          requiredExperienceYears: { type: ["integer","null"] },
          estimatedDurationMonths: { type: ["integer","null"] },
          geographicScope: { type: ["string","null"] }
        },
        required: ["executiveSummary","keyRequirements","requiredCertifications",
                   "minTeamSize","requiredExperienceYears","estimatedDurationMonths","geographicScope"]
      }
    }
  },
  system: "You analyze Greek public procurement tenders. Write the summary in clear English. Extract only what the source states; do not invent requirements.",
  messages: [{ role: "user", content: tender.rawRequirementsText }],
});
const ai = JSON.parse(resp.content.find(b => b.type === "text").text);
```
The extracted fields (`requiredCertifications`, `minTeamSize`, etc.) feed the
deterministic gap engine — Claude does the *reading*, the rule engine does the *judging*.

### Job 2 — Compliance explanations + rationale (on `/api/compliance`)
The **gap statuses and the verdict are computed deterministically** (see
[Data Model §4.4](./04-DATA-MODEL.md)). Claude is given the already-decided gaps and
asked only to write the per-gap `explanation` strings and the overall `rationale`
paragraph (structured-output array keyed by dimension). This keeps the recommendation
testable and prevents the model from changing the verdict. Use `effort: "high"`.

### Job 3 — Dashboard market insights (on `/api/dashboard`)
Given the aggregated stats (counts, top authorities, certification demand), ask Claude
for 3–5 short, concrete insight bullets (plain string array). Lowest-stakes job —
degrade silently to an empty `aiInsights: []` on timeout.

## 9.3 Latency & resilience
- Every Claude call is wrapped in the backend timeout guard (8s for tender/compliance).
  On timeout: tender returns without `.ai` (`meta.aiStatus: "timeout"`); compliance
  falls back to generic per-gap text while keeping the deterministic verdict.
- **Prompt caching:** the system prompt + any shared instruction block carry
  `cache_control: { type: "ephemeral" }` so repeated calls reuse the prefix. Keep the
  volatile part (the specific tender text / stats) **after** the cached prefix.
- **Cache AI results** in the in-memory TTL cache (~30 min) keyed by `tenderId` so a
  re-view doesn't re-call the model.
- Use typed SDK errors (`Anthropic.RateLimitError`, `Anthropic.APIError`) — never
  string-match error messages.

## 9.4 Cost notes
- `claude-opus-4-8`: $5 / 1M input, $25 / 1M output tokens. Tender texts are small;
  caching + result caching keeps spend negligible for a demo.
- If cost becomes a concern for high-volume extraction (Job 1), `claude-sonnet-4-6`
  ($3/$15) is a reasonable drop-in for that job only — keep the compliance reasoning
  (Job 2) on Opus.
