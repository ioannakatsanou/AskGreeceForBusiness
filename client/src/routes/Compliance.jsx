import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import ScoreRing from "../components/ui/ScoreRing.jsx";
import { Loading, ErrorState, EmptyState } from "../components/feedback/States.jsx";
import { useApi } from "../hooks/useApi.js";
import { useProfile } from "../context/ProfileContext.jsx";
import { getTenderById } from "../data/mockTenders.js";
import { analyzeCompliance } from "../api/client.js";

const STATUS_TONE = { Met: "success", Partial: "warning", Gap: "danger" };
const STATUS_CLASS = { Met: "met", Partial: "partial", Gap: "gap" };
const RECO_CLASS = {
  Proceed: "proceed",
  "Proceed with Conditions": "conditions",
  "Proceed with Partner": "partner",
  "Do Not Bid": "nobid",
};
const RISK_TONE = { Low: "success", Moderate: "info", Elevated: "warning", High: "danger" };

export default function Compliance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, isComplete } = useProfile();

  // Tender meta (title / not-found guard) comes from the local set; the analysis
  // itself runs through the API client (backend when available, mock fallback).
  const tender = getTenderById(id);

  const { data, loading, error, retry } = useApi(
    () => (isComplete ? analyzeCompliance(id, profile) : Promise.resolve(null)),
    [id, isComplete]
  );

  if (!tender) {
    return (
      <EmptyState
        icon="🗂️"
        title="Tender not found"
        message="We can't run an analysis for an unknown tender."
        action={<Button to="/search">Back to search</Button>}
      />
    );
  }

  // Guard: require a profile first.
  if (!isComplete) {
    return (
      <div className="stack" style={{ gap: "var(--s-4)" }}>
        <button className="backlink" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <EmptyState
          icon="🧩"
          title="Create your company profile first"
          message="Compliance analysis compares this tender against your company profile. Set it up once — it's saved in your browser."
          action={<Button to="/company-profile" size="lg">Set up company profile →</Button>}
        />
      </div>
    );
  }

  if (loading) return <Loading label="Running AI compliance analysis…" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!data) return <ErrorState message="Could not produce a result." onRetry={retry} />;

  return (
    <div className="stack" style={{ gap: "var(--s-5)" }}>
      <button className="backlink" onClick={() => navigate(-1)}>
        ← Back to tender
      </button>

      <div>
        <h1 style={{ marginBottom: 4 }}>Compliance analysis</h1>
        <p className="muted" style={{ margin: 0 }}>
          {tender.title}
        </p>
      </div>

      {/* Recommendation banner */}
      <div className={`reco ${RECO_CLASS[data.recommendation]}`}>
        <div className="spread" style={{ alignItems: "center" }}>
          <div>
            <div style={{ opacity: 0.9, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.8rem" }}>
              Recommendation
            </div>
            <h2 style={{ margin: "6px 0 8px" }}>{data.recommendation}</h2>
            <p style={{ margin: 0, opacity: 0.95, maxWidth: 640 }}>{data.rationale}</p>
          </div>
          <div className="center" style={{ background: "rgba(255,255,255,0.18)", borderRadius: "var(--r-md)", padding: "var(--s-4)" }}>
            <div style={{ fontSize: "2.6rem", fontWeight: 800, lineHeight: 1 }}>{data.score}</div>
            <div style={{ fontSize: "0.78rem", opacity: 0.9 }}>Match score</div>
          </div>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-3">
        <div className="stat-tile">
          <div className="stat-label">Match score</div>
          <div className="row" style={{ gap: "var(--s-3)", marginTop: 6 }}>
            <ScoreRing value={data.score} />
            <span className="muted">out of 100</span>
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Risk level</div>
          <div style={{ marginTop: 10 }}>
            <Badge tone={RISK_TONE[data.riskLevel]}>{data.riskLevel} risk</Badge>
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Gaps</div>
          <div className="stat-value">
            {data.gaps.filter((g) => g.status !== "Met").length}
            <span className="muted" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              {" "}
              / {data.gaps.length}
            </span>
          </div>
          <div className="stat-sub">requirements need attention</div>
        </div>
      </div>

      {/* Gap analysis */}
      <div>
        <h2 className="section-title">Gap analysis</h2>
        <div className="grid grid-2">
          {data.gaps.map((g) => (
            <Card key={g.dimension} className={`gap-card ${STATUS_CLASS[g.status]}`}>
              <div className="spread">
                <h3 style={{ margin: 0 }}>{g.dimension} Gap</h3>
                <Badge tone={STATUS_TONE[g.status]}>{g.status}</Badge>
              </div>
              <div className="dl" style={{ gridTemplateColumns: "120px 1fr", marginTop: "var(--s-3)" }}>
                <dt>Required</dt>
                <dd style={{ fontWeight: 500 }}>{g.requirement}</dd>
                <dt>You have</dt>
                <dd style={{ fontWeight: 500 }}>{g.companyValue}</dd>
              </div>
              <p className="muted" style={{ margin: "var(--s-3) 0 0", fontSize: "0.9rem" }}>
                {g.explanation}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended actions */}
      <Card>
        <h2>Recommended actions</h2>
        <ol className="stack" style={{ gap: "var(--s-2)", margin: 0, paddingLeft: "1.2rem" }}>
          {data.recommendedActions.map((a, i) => (
            <li key={i} className="muted">
              {a}
            </li>
          ))}
        </ol>
      </Card>

      <div className="row-wrap">
        <Button to={`/tender/${tender.id}`} variant="secondary">
          ← Back to tender
        </Button>
        <Button to="/company-profile" variant="ghost">
          Update company profile
        </Button>
        <Button onClick={retry} variant="ghost">
          Re-run analysis ↻
        </Button>
      </div>
    </div>
  );
}
