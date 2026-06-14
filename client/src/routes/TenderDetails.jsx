import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import ScoreRing from "../components/ui/ScoreRing.jsx";
import { Loading, ErrorState, EmptyState } from "../components/feedback/States.jsx";
import { useApi } from "../hooks/useApi.js";
import { getOpportunity } from "../api/client.js";
import { formatCurrency, formatDate, deadlineLabel } from "../lib/format.js";

const CATEGORY_TONE = {
  technical: "info",
  legal: "danger",
  financial: "warning",
  experience: "success",
  other: "default",
};

export default function TenderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tender, loading, error, retry } = useApi(() => getOpportunity(id), [id]);

  if (loading) return <Loading label="Loading tender details…" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!tender)
    return (
      <EmptyState
        icon="🗂️"
        title="Tender not found"
        message="This opportunity may have closed or the link is invalid."
        action={<Button to="/search">Back to search</Button>}
      />
    );

  const req = tender.requirements;

  return (
    <div className="stack" style={{ gap: "var(--s-5)" }}>
      <button className="backlink" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Header */}
      <Card>
        <div className="spread" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div className="row-wrap" style={{ marginBottom: 8 }}>
              <Badge tone="info">{tender.sourceSystem}</Badge>
              <Badge>{tender.category}</Badge>
              <Badge tone="warning">{deadlineLabel(tender.deadline)}</Badge>
            </div>
            <h1 style={{ fontSize: "1.6rem" }}>{tender.title}</h1>
            <p className="muted" style={{ margin: 0 }}>
              {tender.contractingAuthority}
            </p>
          </div>
          <div className="center">
            <ScoreRing value={tender.opportunityScore} size={72} />
            <div className="faint" style={{ fontSize: "0.72rem", marginTop: 4 }}>
              Opportunity score
            </div>
          </div>
        </div>

        <div className="divider" />

        <dl className="dl">
          <dt>Contracting authority</dt>
          <dd>{tender.contractingAuthority}</dd>
          <dt>Budget</dt>
          <dd>{formatCurrency(tender.budget.amount, tender.budget.currency)}</dd>
          <dt>Deadline</dt>
          <dd>
            {formatDate(tender.deadline)} · {deadlineLabel(tender.deadline)}
          </dd>
          <dt>CPV code(s)</dt>
          <dd>{tender.cpvCodes.join(", ")}</dd>
          <dt>Source system</dt>
          <dd>{tender.sourceSystem}</dd>
          <dt>Location</dt>
          <dd>{tender.location}</dd>
          <dt>Published</dt>
          <dd>{formatDate(tender.publishedAt)}</dd>
          <dt>Official link</dt>
          <dd>
            <a href={tender.officialUrl} target="_blank" rel="noopener noreferrer">
              Open official tender ↗
            </a>
          </dd>
        </dl>

        <div className="divider" />

        <Button to={`/compliance/${tender.id}`} size="lg">
          Run Compliance Analysis →
        </Button>
      </Card>

      {/* AI executive summary */}
      <Card>
        <div className="row" style={{ gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
          <Badge tone="info">AI</Badge>
          <h2 style={{ margin: 0 }}>Executive summary</h2>
        </div>
        <p className="muted" style={{ margin: 0 }}>
          {tender.ai.executiveSummary}
        </p>
      </Card>

      {/* Key requirements */}
      <Card>
        <h2>Key requirements</h2>
        <div className="stack" style={{ gap: "var(--s-2)" }}>
          {tender.ai.keyRequirements.map((r) => (
            <div key={r.label} className="spread" style={{ alignItems: "flex-start", gap: "var(--s-3)" }}>
              <div style={{ flex: 1 }}>
                <b>{r.label}</b>
                <div className="muted" style={{ fontSize: "0.9rem" }}>
                  {r.detail}
                </div>
              </div>
              <Badge tone={CATEGORY_TONE[r.category] || "default"}>{r.category}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Structured requirement breakdown */}
      <div className="grid grid-2">
        <Card>
          <h3>Certifications &amp; team</h3>
          <dl className="dl" style={{ gridTemplateColumns: "1fr" }}>
            <dt>Required certifications</dt>
            <dd>
              <div className="row-wrap">
                {req.requiredCertifications.map((c) => (
                  <Badge key={c} tone="danger">
                    {c}
                  </Badge>
                ))}
              </div>
            </dd>
            <dt>Minimum team size</dt>
            <dd>{req.minTeamSize} specialists</dd>
            <dt>Required experience</dt>
            <dd>{req.requiredExperienceYears}+ years</dd>
          </dl>
        </Card>

        <Card>
          <h3>Budget &amp; timeline</h3>
          <dl className="dl" style={{ gridTemplateColumns: "1fr" }}>
            <dt>Contract value</dt>
            <dd>{formatCurrency(tender.budget.amount)}</dd>
            <dt>Min. financial capacity</dt>
            <dd>{formatCurrency(req.minBudgetCapacity)}</dd>
            <dt>Estimated duration</dt>
            <dd>{req.estimatedDurationMonths} months</dd>
            <dt>Geographic scope</dt>
            <dd>{req.geographicScope}</dd>
          </dl>
        </Card>
      </div>
    </div>
  );
}
