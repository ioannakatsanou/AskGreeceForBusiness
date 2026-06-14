import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import ScoreRing from "../../components/ui/ScoreRing.jsx";
import { formatCurrency, formatDate, deadlineLabel, daysUntil } from "../../lib/format.js";

// Opportunity card shown on the search results page.
export default function ResultCard({ tender }) {
  const navigate = useNavigate();
  const open = () => navigate(`/tender/${tender.id}`);
  const days = daysUntil(tender.deadline);
  const deadlineTone = days != null && days <= 14 ? "warning" : "default";

  return (
    <Card hover className="result-card" onClick={open}>
      <div className="spread" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div className="row-wrap" style={{ marginBottom: 6 }}>
            <Badge tone="info">{tender.sourceSystem}</Badge>
            <Badge>{tender.category}</Badge>
            <Badge tone={deadlineTone}>{deadlineLabel(tender.deadline)}</Badge>
          </div>
          <h3>{tender.title}</h3>
          <p className="muted" style={{ margin: 0 }}>
            {tender.contractingAuthority}
          </p>
        </div>
        <div className="center">
          <ScoreRing value={tender.opportunityScore} />
          <div className="faint" style={{ fontSize: "0.7rem", marginTop: 4 }}>
            Opportunity
          </div>
        </div>
      </div>

      <div className="result-meta">
        <div className="meta-item">
          <span>Budget</span>
          <b>{formatCurrency(tender.budget.amount, tender.budget.currency)}</b>
        </div>
        <div className="meta-item">
          <span>Deadline</span>
          <b>{formatDate(tender.deadline)}</b>
        </div>
        <div className="meta-item">
          <span>CPV code</span>
          <b>{tender.cpvCodes.join(", ")}</b>
        </div>
        <div className="meta-item">
          <span>Location</span>
          <b>{tender.location}</b>
        </div>
      </div>

      <div className="ai-blurb">
        <span className="ai-tag">AI summary · </span>
        {tender.ai.executiveSummary.slice(0, 180)}…
      </div>

      <div className="spread" style={{ marginTop: "var(--s-3)" }}>
        <a
          href={tender.officialUrl}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Official tender ↗
        </a>
        <span className="btn btn-ghost" aria-hidden="true">
          View details →
        </span>
      </div>
    </Card>
  );
}
