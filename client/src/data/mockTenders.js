// Realistic mock tenders for the frontend MVP. No backend — this is the data layer.
// Shape mirrors the normalized `Tender` model in /docs/04-DATA-MODEL.md.

export const TENDERS = [
  {
    id: "esidis-2026-0451",
    title: "Managed Cybersecurity & SOC Services for Regional Health Authority",
    contractingAuthority: "6th Health Region of Peloponnese, Ionian Islands, Epirus & Western Greece",
    budget: { amount: 1450000, currency: "EUR" },
    deadline: "2026-08-12",
    publishedAt: "2026-05-28",
    cpvCodes: ["72500000-0", "79417000-0"],
    sourceSystem: "ESIDIS",
    officialUrl: "https://www.eprocurement.gov.gr/",
    status: "active",
    location: "Western Greece",
    opportunityScore: 87,
    category: "Cybersecurity",
    keywords: ["cybersecurity", "soc", "monitoring", "incident response"],
    requirements: {
      requiredCertifications: ["ISO 27001", "ISO 9001"],
      minTeamSize: 8,
      requiredExperienceYears: 5,
      estimatedDurationMonths: 24,
      geographicScope: "Western Greece",
      minBudgetCapacity: 800000,
    },
    ai: {
      executiveSummary:
        "A 24-month engagement to deliver a managed Security Operations Center (SOC), 24/7 threat monitoring, and incident response for a regional health authority spanning multiple hospitals. The authority prioritises proven public-sector security experience and certified information-security management. Strong fit for mid-sized cybersecurity firms that can staff a continuous monitoring team and demonstrate ISO 27001 governance.",
      keyRequirements: [
        { label: "24/7 SOC operation", detail: "Continuous monitoring with guaranteed response SLAs.", category: "technical" },
        { label: "ISO 27001 certification", detail: "Mandatory for the bidding entity.", category: "legal" },
        { label: "Incident response playbooks", detail: "Documented procedures aligned to ENISA guidance.", category: "technical" },
        { label: "Public-sector references", detail: "At least 2 similar engagements in the last 5 years.", category: "experience" },
        { label: "Financial standing", detail: "Average annual turnover ≥ €800,000.", category: "financial" },
      ],
    },
  },
  {
    id: "kimdis-2026-1188",
    title: "Cloud Migration & Modernisation of Municipal Citizen Services Platform",
    contractingAuthority: "Municipality of Thessaloniki",
    budget: { amount: 980000, currency: "EUR" },
    deadline: "2026-07-30",
    publishedAt: "2026-05-20",
    cpvCodes: ["72317000-0", "72222300-0"],
    sourceSystem: "KIMDIS",
    officialUrl: "https://cerpp.eprocurement.gov.gr/kimds2/",
    status: "active",
    location: "Central Macedonia",
    opportunityScore: 79,
    category: "Cloud Migration",
    keywords: ["cloud migration", "modernisation", "azure", "devops"],
    requirements: {
      requiredCertifications: ["ISO 27001"],
      minTeamSize: 6,
      requiredExperienceYears: 3,
      estimatedDurationMonths: 14,
      geographicScope: "Central Macedonia",
      minBudgetCapacity: 500000,
    },
    ai: {
      executiveSummary:
        "Migration of a legacy citizen-services platform to a public cloud, including re-architecture for high availability, a CI/CD pipeline, and staff knowledge transfer. The municipality wants a partner comfortable with phased, zero-downtime cutover and GDPR-compliant data handling. Attractive for cloud-native teams with a track record of public-sector modernisation.",
      keyRequirements: [
        { label: "Zero-downtime migration", detail: "Phased cutover with rollback plan.", category: "technical" },
        { label: "Cloud platform expertise", detail: "Certified cloud architects on the delivery team.", category: "technical" },
        { label: "GDPR data handling", detail: "Data residency within the EU.", category: "legal" },
        { label: "Knowledge transfer", detail: "Training for in-house municipal IT staff.", category: "other" },
        { label: "Delivery within 14 months", detail: "Hard deadline tied to EU funding window.", category: "experience" },
      ],
    },
  },
  {
    id: "esidis-2026-0622",
    title: "Enterprise Resource Planning (ERP) Implementation for Port Authority",
    contractingAuthority: "Piraeus Port Authority S.A.",
    budget: { amount: 2300000, currency: "EUR" },
    deadline: "2026-09-05",
    publishedAt: "2026-06-01",
    cpvCodes: ["48000000-8", "72263000-6"],
    sourceSystem: "ESIDIS",
    officialUrl: "https://www.eprocurement.gov.gr/",
    status: "active",
    location: "Attica",
    opportunityScore: 72,
    category: "ERP",
    keywords: ["erp", "implementation", "finance", "logistics"],
    requirements: {
      requiredCertifications: ["ISO 9001", "ISO 27001", "CMMI Level 3"],
      minTeamSize: 14,
      requiredExperienceYears: 7,
      estimatedDurationMonths: 30,
      geographicScope: "Attica",
      minBudgetCapacity: 1500000,
    },
    ai: {
      executiveSummary:
        "A large-scale ERP rollout covering finance, procurement, HR, and logistics modules for a major port authority. This is a heavyweight engagement demanding deep ERP integration experience, a sizeable certified team, and strong financial capacity. Best suited to established system integrators; smaller firms would likely need a consortium or partner to qualify.",
      keyRequirements: [
        { label: "Full ERP suite", detail: "Finance, procurement, HR, logistics modules.", category: "technical" },
        { label: "CMMI Level 3", detail: "Process maturity certification required.", category: "legal" },
        { label: "Large delivery team", detail: "Minimum 14 dedicated specialists.", category: "experience" },
        { label: "Turnover ≥ €1.5M", detail: "Demonstrated financial capacity.", category: "financial" },
        { label: "7+ years ERP experience", detail: "Comparable public-sector ERP projects.", category: "experience" },
      ],
    },
  },
  {
    id: "kimdis-2026-1342",
    title: "Digital Transformation Strategy & Advisory Services",
    contractingAuthority: "Ministry of Digital Governance",
    budget: { amount: 420000, currency: "EUR" },
    deadline: "2026-07-18",
    publishedAt: "2026-05-15",
    cpvCodes: ["79410000-1", "72224000-1"],
    sourceSystem: "KIMDIS",
    officialUrl: "https://cerpp.eprocurement.gov.gr/kimds2/",
    status: "active",
    location: "Nationwide",
    opportunityScore: 83,
    category: "Consulting",
    keywords: ["consulting", "strategy", "advisory", "digital transformation"],
    requirements: {
      requiredCertifications: ["ISO 9001"],
      minTeamSize: 4,
      requiredExperienceYears: 4,
      estimatedDurationMonths: 10,
      geographicScope: "Nationwide",
      minBudgetCapacity: 250000,
    },
    ai: {
      executiveSummary:
        "An advisory engagement to shape a national digital-transformation roadmap, including stakeholder workshops, maturity assessment, and an implementation plan. Deliverable-driven and team-light, with emphasis on senior consultants and demonstrable public-policy experience. A strong fit for boutique consultancies with public-sector advisory credentials.",
      keyRequirements: [
        { label: "Senior advisory team", detail: "Partner-level consultants leading delivery.", category: "experience" },
        { label: "Maturity assessment", detail: "Structured framework with benchmarking.", category: "technical" },
        { label: "Stakeholder facilitation", detail: "Workshops across ministries.", category: "other" },
        { label: "Public-policy experience", detail: "Prior government advisory work.", category: "experience" },
        { label: "10-month delivery", detail: "Phased reporting milestones.", category: "other" },
      ],
    },
  },
  {
    id: "esidis-2026-0710",
    title: "Custom Software Development for Tax Administration e-Services",
    contractingAuthority: "Independent Authority for Public Revenue (AADE)",
    budget: { amount: 1750000, currency: "EUR" },
    deadline: "2026-08-28",
    publishedAt: "2026-05-30",
    cpvCodes: ["72200000-7", "72212000-4"],
    sourceSystem: "ESIDIS",
    officialUrl: "https://www.eprocurement.gov.gr/",
    status: "active",
    location: "Attica",
    opportunityScore: 76,
    category: "Software Development",
    keywords: ["software development", "e-services", "api", "web"],
    requirements: {
      requiredCertifications: ["ISO 27001", "ISO 9001"],
      minTeamSize: 10,
      requiredExperienceYears: 5,
      estimatedDurationMonths: 20,
      geographicScope: "Attica",
      minBudgetCapacity: 900000,
    },
    ai: {
      executiveSummary:
        "Design and build of new citizen-facing tax e-services with high security and accessibility requirements, integrating with existing government registries. Demands a robust engineering team, secure-by-design practices, and accessibility compliance. Well matched to software houses with secure web-application experience and public-sector integration know-how.",
      keyRequirements: [
        { label: "Secure-by-design", detail: "OWASP-aligned development lifecycle.", category: "technical" },
        { label: "Registry integrations", detail: "Interoperability with government systems.", category: "technical" },
        { label: "Accessibility (WCAG)", detail: "Compliance with public accessibility standards.", category: "legal" },
        { label: "10-person engineering team", detail: "Dedicated developers, QA, and a lead architect.", category: "experience" },
        { label: "5+ years experience", detail: "Comparable secure web platforms.", category: "experience" },
      ],
    },
  },
  {
    id: "kimdis-2026-1455",
    title: "Network Infrastructure Upgrade for University Campus",
    contractingAuthority: "Aristotle University of Thessaloniki",
    budget: { amount: 640000, currency: "EUR" },
    deadline: "2026-07-25",
    publishedAt: "2026-05-22",
    cpvCodes: ["32400000-7", "51610000-1"],
    sourceSystem: "KIMDIS",
    officialUrl: "https://cerpp.eprocurement.gov.gr/kimds2/",
    status: "active",
    location: "Thessaloniki",
    opportunityScore: 68,
    category: "Cloud Migration",
    keywords: ["network", "infrastructure", "campus", "upgrade"],
    requirements: {
      requiredCertifications: ["ISO 9001"],
      minTeamSize: 5,
      requiredExperienceYears: 3,
      estimatedDurationMonths: 8,
      geographicScope: "Central Macedonia",
      minBudgetCapacity: 350000,
    },
    ai: {
      executiveSummary:
        "Upgrade of campus-wide network infrastructure including core switching, Wi-Fi 6 coverage, and segmentation for research labs. A delivery-focused engagement with physical installation and commissioning. Suited to infrastructure integrators with regional presence and a small, certified delivery crew.",
      keyRequirements: [
        { label: "Wi-Fi 6 rollout", detail: "Full campus coverage with high-density support.", category: "technical" },
        { label: "Network segmentation", detail: "Isolated VLANs for research and admin.", category: "technical" },
        { label: "On-site commissioning", detail: "Installation and acceptance testing.", category: "other" },
        { label: "Regional delivery capacity", detail: "Local team for on-site work.", category: "experience" },
        { label: "8-month delivery", detail: "Completion before academic year start.", category: "other" },
      ],
    },
  },
];

// Lookup by id (used by tender details + compliance pages).
export function getTenderById(id) {
  return TENDERS.find((t) => t.id === id) || null;
}

// Naive keyword filter over the mock set, capped by the caller.
export function searchTenders(keyword) {
  const q = (keyword || "").trim().toLowerCase();
  if (!q) return TENDERS;
  return TENDERS.filter((t) => {
    const haystack = [
      t.title,
      t.contractingAuthority,
      t.category,
      ...(t.keywords || []),
      ...(t.cpvCodes || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
