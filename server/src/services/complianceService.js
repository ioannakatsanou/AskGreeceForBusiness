// Deterministic compliance gap engine (mirrors the frontend mock engine and the
// design in /docs/04-DATA-MODEL.md §4.4). The verdict is computed by rule; in a
// later phase Claude writes the per-gap prose, but never chooses the verdict.

const STATUS_WEIGHT = { Met: 1, Partial: 0.5, Gap: 0 };

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function totalTeam(team = {}) {
  return num(team.projectManagers) + num(team.engineers) + num(team.consultants) + num(team.support);
}

function gap(dimension, status, requirement, companyValue, severity, explanation) {
  return { dimension, status, requirement, companyValue, severity, explanation };
}

export function analyzeCompliance(opportunity, profile) {
  const req = opportunity.requirements;
  const gaps = [];

  // 1. Certification
  const have = new Set((profile.certifications || []).map((c) => String(c).toLowerCase()));
  const needed = req.requiredCertifications || [];
  const missing = needed.filter((c) => !have.has(c.toLowerCase()));
  gaps.push(
    gap(
      "Certification",
      missing.length === 0 ? "Met" : missing.length < needed.length ? "Partial" : "Gap",
      `Requires: ${needed.join(", ") || "none"}`,
      profile.certifications?.length ? profile.certifications.join(", ") : "None recorded",
      missing.length === 0 ? "low" : missing.length < needed.length ? "medium" : "high",
      missing.length === 0
        ? "Your company holds all required certifications."
        : `Missing ${missing.join(", ")}. Certification is typically a hard eligibility gate — obtain or partner before bidding.`
    )
  );

  // 2. Team size
  const team = totalTeam(profile.team);
  const needTeam = num(req.minTeamSize);
  gaps.push(
    gap(
      "Team Size",
      team >= needTeam ? "Met" : team >= needTeam * 0.7 ? "Partial" : "Gap",
      `Minimum ${needTeam} dedicated specialists`,
      `${team} people across your team`,
      team >= needTeam ? "low" : team >= needTeam * 0.7 ? "medium" : "high",
      team >= needTeam
        ? "Your headcount comfortably meets the requirement."
        : `You have ${team} of the ${needTeam} required. Consider a delivery partner or subcontractor to close the gap.`
    )
  );

  // 3. Budget capacity
  const cap = num(profile.maxProjectBudget);
  const needCap = num(req.minBudgetCapacity);
  gaps.push(
    gap(
      "Budget",
      cap >= needCap ? "Met" : cap >= needCap * 0.75 ? "Partial" : "Gap",
      `Project value approx. ${needCap.toLocaleString()} EUR`,
      `Your max project budget: ${cap.toLocaleString()} EUR`,
      cap >= needCap ? "low" : cap >= needCap * 0.75 ? "medium" : "high",
      cap >= needCap
        ? "Your stated project capacity covers this tender's value."
        : "This contract exceeds your typical project size — review cash-flow and bonding capacity carefully."
    )
  );

  // 4. Geographic coverage
  const regions = (profile.geographicCoverage || []).map((r) => String(r).toLowerCase());
  const scope = String(req.geographicScope || "").toLowerCase();
  const covered = regions.includes("nationwide") || regions.some((r) => scope.includes(r) || r.includes(scope));
  gaps.push(
    gap(
      "Geographic Coverage",
      covered ? "Met" : "Partial",
      `Delivery in ${req.geographicScope}`,
      profile.geographicCoverage?.length ? profile.geographicCoverage.join(", ") : "Not specified",
      covered ? "low" : "medium",
      covered
        ? "Your coverage includes the tender's region."
        : `You did not list ${req.geographicScope}. On-site delivery may require a local presence or travel cost.`
    )
  );

  // 5. Timeline
  const haveDuration = num(profile.maxProjectDurationMonths);
  const needDuration = num(req.estimatedDurationMonths);
  gaps.push(
    gap(
      "Timeline",
      haveDuration >= needDuration ? "Met" : haveDuration >= needDuration * 0.7 ? "Partial" : "Gap",
      `Engagement length ~${needDuration} months`,
      `Your max delivery duration: ${haveDuration} months`,
      haveDuration >= needDuration ? "low" : haveDuration >= needDuration * 0.7 ? "medium" : "high",
      haveDuration >= needDuration
        ? "You can commit for the full engagement length."
        : "The engagement runs longer than your stated maximum — confirm you can sustain a multi-year commitment."
    )
  );

  // 6. Experience
  const haveExp = num(profile.yearsInBusiness);
  const needExp = num(req.requiredExperienceYears);
  gaps.push(
    gap(
      "Experience",
      haveExp >= needExp ? "Met" : haveExp >= needExp * 0.7 ? "Partial" : "Gap",
      `${needExp}+ years of relevant experience`,
      `${haveExp} years in business`,
      haveExp >= needExp ? "low" : haveExp >= needExp * 0.7 ? "medium" : "high",
      haveExp >= needExp
        ? "Your track record satisfies the experience threshold."
        : "You fall short of the stated experience requirement — strong references or a senior partner can compensate."
    )
  );

  const score = Math.round(
    (gaps.reduce((sum, g) => sum + STATUS_WEIGHT[g.status], 0) / gaps.length) * 100
  );

  // Budget incapacity is a true hard blocker; cert/team gaps are "partnerable".
  const budgetBlocker = gaps.some(
    (g) => g.dimension === "Budget" && g.status === "Gap" && g.severity === "high"
  );
  const certOrTeamUnmet = gaps.some(
    (g) => (g.dimension === "Certification" || g.dimension === "Team Size") && g.status !== "Met"
  );

  let recommendation;
  if (score < 40 || budgetBlocker) recommendation = "Do Not Bid";
  else if (certOrTeamUnmet) recommendation = "Proceed with Partner";
  else if (score >= 80) recommendation = "Proceed";
  else recommendation = "Proceed with Conditions";

  const riskLevel =
    recommendation === "Do Not Bid"
      ? "High"
      : recommendation === "Proceed with Partner"
      ? "Elevated"
      : recommendation === "Proceed with Conditions"
      ? "Moderate"
      : "Low";

  return {
    opportunityId: opportunity.id,
    generatedAt: new Date().toISOString(),
    gaps,
    score,
    riskLevel,
    recommendation,
    recommendedActions: buildActions(gaps, recommendation),
    rationale: buildRationale(recommendation, score, gaps),
  };
}

function severityRank(s) {
  return s === "high" ? 3 : s === "medium" ? 2 : 1;
}

function buildActions(gaps, recommendation) {
  const actions = [];
  gaps
    .filter((g) => g.status !== "Met")
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))
    .forEach((g) => {
      if (g.dimension === "Certification") actions.push("Obtain the missing certification(s) or bid via a certified partner.");
      if (g.dimension === "Team Size") actions.push("Line up subcontractors or a consortium to reach the required headcount.");
      if (g.dimension === "Budget") actions.push("Secure bonding / working capital to cover the contract value.");
      if (g.dimension === "Geographic Coverage") actions.push("Establish a local delivery presence or budget for on-site travel.");
      if (g.dimension === "Timeline") actions.push("Confirm internal capacity to sustain the full engagement length.");
      if (g.dimension === "Experience") actions.push("Strengthen the bid with senior references and case studies.");
    });
  if (recommendation === "Proceed") actions.push("Proceed to prepare the bid — you are well positioned.");
  if (actions.length === 0) actions.push("No material gaps — focus on a competitive, well-priced proposal.");
  return actions.slice(0, 5);
}

function buildRationale(recommendation, score, gaps) {
  const met = gaps.filter((g) => g.status === "Met").length;
  const partial = gaps.filter((g) => g.status === "Partial").length;
  const gapped = gaps.filter((g) => g.status === "Gap").length;
  const base = `Overall fit score is ${score}/100 (${met} requirements met, ${partial} partial, ${gapped} with gaps).`;
  const verdict = {
    Proceed: " Your profile aligns strongly with this tender — recommend preparing a competitive bid.",
    "Proceed with Conditions": " You can bid, but address the partial gaps to strengthen eligibility and reduce delivery risk.",
    "Proceed with Partner": " Bidding is viable through a partner or consortium that covers your eligibility gaps.",
    "Do Not Bid": " The eligibility gaps make a standalone bid high-risk — not recommended without major changes.",
  };
  return base + (verdict[recommendation] || "");
}
