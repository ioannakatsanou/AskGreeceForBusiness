// Mock market-intelligence data for the dashboard. Some figures are derived from the
// mock tender set so the dashboard stays internally consistent.

import { TENDERS } from "./mockTenders.js";

const activeTenders = TENDERS.filter((t) => t.status === "active");

export const DASHBOARD = {
  activeOpportunities: activeTenders.length,
  totalMarketValue: activeTenders.reduce((sum, t) => sum + (t.budget.amount || 0), 0),

  upcomingDeadlines: [...activeTenders]
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5)
    .map((t) => ({ opportunityId: t.id, title: t.title, deadline: t.deadline, authority: t.contractingAuthority })),

  topCategories: buildCounts(activeTenders.map((t) => t.category)),

  mostActiveAuthorities: [
    { name: "Independent Authority for Public Revenue (AADE)", count: 6 },
    { name: "Municipality of Thessaloniki", count: 5 },
    { name: "Ministry of Digital Governance", count: 4 },
    { name: "Piraeus Port Authority S.A.", count: 3 },
    { name: "Aristotle University of Thessaloniki", count: 3 },
  ],

  certificationDemand: [
    { certification: "ISO 27001", demandCount: 71 },
    { certification: "ISO 9001", demandCount: 64 },
    { certification: "CMMI Level 3", demandCount: 28 },
    { certification: "ISO 22301", demandCount: 19 },
    { certification: "PCI DSS", demandCount: 12 },
  ],

  aiInsights: [
    "Cybersecurity and cloud-migration tenders account for the largest share of value this quarter — driven by public-sector resilience programmes.",
    "ISO 27001 now appears in roughly 7 of every 10 IT tenders; firms without it are increasingly filtered out at eligibility.",
    "Average contract duration is rising toward ~18 months, favouring bidders who can sustain longer engagements or form consortia.",
    "Attica and Central Macedonia concentrate the highest-value opportunities, but nationwide-coverage firms win more advisory work.",
    "Several upcoming deadlines cluster in late July — prioritise the highest-fit tenders to avoid spreading bid resources thin.",
  ],
};

function buildCounts(values) {
  const map = {};
  values.forEach((v) => (map[v] = (map[v] || 0) + 1));
  return Object.entries(map)
    .map(([cpvLabel, count]) => ({ cpvLabel, count }))
    .sort((a, b) => b.count - a.count);
}
