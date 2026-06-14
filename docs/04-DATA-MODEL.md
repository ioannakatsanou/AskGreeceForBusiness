# 4. Data Model

There is **no server database** in the MVP. "Storage" = browser `localStorage`
(user data) + backend in-memory cache (public tender data). Below are the canonical
data shapes — the contract for the whole app.

## 4.1 Client-side stores (localStorage)

**Key: `tenderfit.companyProfile`**
```ts
CompanyProfile {
  // Company Information
  companyName: string
  industry: string
  yearsInBusiness: number
  employeeCount: number
  // Capabilities
  serviceDescription: string
  keywords: string[]
  certifications: string[]        // e.g. ["ISO 27001","ISO 9001"]
  technicalCapabilities: string[]
  // Coverage
  geographicCoverage: string[]    // e.g. ["Attica","Crete","Nationwide"]
  minProjectBudget: number        // EUR
  maxProjectBudget: number        // EUR
  // Delivery
  earliestStartDate: string       // ISO date
  maxProjectDurationMonths: number
  // Team
  team: { projectManagers: number, engineers: number, consultants: number, support: number }
  // Meta
  updatedAt: string               // ISO timestamp
  version: 1
}
```

**Key: `tenderfit.recentSearches`**
```ts
RecentSearch[] {
  keyword: string
  timestamp: string   // ISO
  resultCount: number
}   // capped to last 10, most-recent first
```

## 4.2 Normalized Tender (backend canonical model)
```ts
Tender {
  id: string                 // stable hash of source + sourceId
  title: string
  contractingAuthority: string
  budget: { amount: number | null, currency: "EUR" }
  deadline: string | null    // ISO date
  cpvCodes: string[]         // e.g. ["72000000-5"]
  sourceSystem: "ESIDIS" | "KIMDIS" | "MOCK"
  sourceId: string
  officialUrl: string
  status: "active" | "closed"
  publishedAt: string | null
  rawRequirementsText: string | null   // source text used for AI extraction
  location: string | null
  // AI-enriched (populated on detail / compliance)
  ai?: {
    executiveSummary: string
    keyRequirements: KeyRequirement[]
    estimatedDurationMonths: number | null
    requiredCertifications: string[]
    minTeamSize: number | null
    requiredExperienceYears: number | null
    geographicScope: string | null
  }
}

KeyRequirement {
  label: string
  detail: string
  category: "technical" | "legal" | "financial" | "experience" | "other"
}
```

## 4.3 Compliance result model
```ts
ComplianceResult {
  tenderId: string
  generatedAt: string
  gaps: Gap[]                // exactly 6
  recommendation: "Proceed" | "Proceed with Conditions" | "Proceed with Partner" | "Do Not Bid"
  rationale: string         // AI-written justification
  score: number             // 0–100 internal fit score
}

Gap {
  dimension: "Certification" | "Team Size" | "Budget" | "Geographic Coverage" | "Timeline" | "Experience"
  status: "Met" | "Partial" | "Gap"
  requirement: string       // what the tender needs
  companyValue: string      // what the company has
  severity: "low" | "medium" | "high"
  explanation: string       // AI-written
}
```

## 4.4 Recommendation rule (deterministic core, AI for prose)
```
score = weighted(gaps): Met = full, Partial = half, Gap = 0
A high-severity Gap on Certification or Budget caps the verdict.

Verdict mapping:
  score ≥ 80 and no high-severity gaps      → Proceed
  score 60–79 / fixable partials            → Proceed with Conditions
  team/cert gap but otherwise strong fit    → Proceed with Partner
  score < 45 / hard blockers                → Do Not Bid
```
The verdict is **deterministic and testable**; the LLM never selects it — it only
writes the `explanation` per gap and the `rationale` paragraph.
