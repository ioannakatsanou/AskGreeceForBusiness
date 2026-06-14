# 1. Product Requirements Document (PRD)

## 1.1 Problem statement
Greek SMEs systematically under-participate in public procurement. The barrier is
not *access* to listings (they are technically public via ESIDIS/KIMDIS) but
*interpretation and qualification*: tenders are dense, legalistic, and an SME
cannot quickly answer "Is this worth my time, and can I actually win it?" The cost
of analyzing a single tender for fit is high, so SMEs either ignore the market or
bid blindly.

## 1.2 Product vision
TenderFit AI is an **AI procurement copilot** that turns raw public tenders into a
go/no-go decision tailored to one company's actual capabilities. It compresses
hours of manual qualification review into a structured, explainable recommendation.

## 1.3 What this is / is not
| It IS | It is NOT |
|---|---|
| A decision-support system | A search engine / listing portal |
| Opinionated (gives a recommendation) | Neutral (just shows results) |
| Profile-aware (analysis depends on *your* company) | Generic |
| Explainable (shows *why* via gap analysis) | A black box |

## 1.4 Goals & non-goals (MVP)
**Goals**
- G1. Retrieve ≤5 active, relevant opportunities from Greek sources by keyword.
- G2. Generate an AI executive summary + extracted key requirements per tender.
- G3. Capture a structured company profile (persisted locally).
- G4. Produce a 6-dimension Compliance Gap Analysis + a single recommendation.
- G5. Provide a market-intelligence dashboard.
- G6. Be resilient: no infinite loading, 10s hard cap, graceful empty/error states.

**Non-goals (explicitly out of MVP scope)**
- No user accounts / authentication (profile is local-only).
- No bid document generation or submission.
- No multi-company / team collaboration.
- No payment / subscription.
- No historical tender archive or trained ML trend model (dashboard trends are
  computed from the current result set + light heuristics + AI insight prose).
- No server-side persistence of user data.

## 1.5 Success metrics (MVP)
| Metric | Target |
|---|---|
| Search → results render | < 10s, 100% of the time (hard cap enforced) |
| Tender with usable AI summary | ≥ 95% of returned tenders |
| Compliance analysis completion | < 8s |
| "Recommendation felt correct" (user survey, n≥10) | ≥ 70% |
| Zero infinite-loading incidents in demo | 100% |

## 1.6 Personas
- **Maria — Operations lead, 25-person IT services SME.** Time-poor, non-legal.
  Wants a yes/no with reasons.
- **Dimitris — Founder, 8-person cybersecurity firm.** Wants to know if he should
  partner to meet team-size / certification thresholds.

## 1.7 Critical constraints & risks
| Risk | Severity | Mitigation |
|---|---|---|
| ESIDIS/KIMDIS APIs slow, undocumented, or rate-limited | **High** | Adapter pattern + caching + 10s budget split + **mock-first** dataset for the demo |
| AI latency blows the 10s budget | **High** | AI separated from search; summaries generated on tender-detail; aggressive timeouts; streaming where useful |
| Greek-language tender text | Medium | Claude handles EL natively; prompt instructs EN output for summaries |
| Render cold starts (free tier) | Medium | Backend pre-warm ping; cold-start-tolerant frontend messaging |
| LLM hallucinating requirements | Medium | Structured extraction + show official source link so the user can verify |

## 1.8 Assumptions
- A1. Public procurement data is reachable over HTTP (REST/OData/XML); exact
  contract resolved in the Phase-0 discovery spike.
- A2. An Anthropic API key is available server-side (held by the backend, never
  shipped to the browser).
- A3. Single-user, single-profile per browser is acceptable for the MVP.
