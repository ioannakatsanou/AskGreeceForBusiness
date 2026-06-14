import { Link } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import StatTile from "../components/ui/StatTile.jsx";
import { Loading, ErrorState } from "../components/feedback/States.jsx";
import { useApi } from "../hooks/useApi.js";
import { getDashboard } from "../api/client.js";
import { formatCompactCurrency, formatDate, deadlineLabel } from "../lib/format.js";

export default function Dashboard() {
  const { data, loading, error, retry } = useApi(() => getDashboard(), []);

  if (loading) return <Loading label="Loading market intelligence…" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  const maxCert = Math.max(...data.certificationDemand.map((c) => c.demandCount));
  const maxCat = Math.max(...data.topCategories.map((c) => c.count));

  return (
    <div className="stack" style={{ gap: "var(--s-5)" }}>
      <div>
        <h1 style={{ marginBottom: 4 }}>Market intelligence</h1>
        <p className="muted" style={{ margin: 0 }}>
          A live snapshot of the Greek public procurement market (mock data).
        </p>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-4">
        <StatTile label="Active opportunities" value={data.activeOpportunities} sub="currently open" />
        <StatTile
          label="Total market value"
          value={formatCompactCurrency(data.totalMarketValue)}
          sub="across active tenders"
        />
        <StatTile
          label="Upcoming deadlines"
          value={data.upcomingDeadlines.length}
          sub="in the next weeks"
        />
        <StatTile
          label="Top category"
          value={data.topCategories[0]?.cpvLabel || "—"}
          sub={`${data.topCategories[0]?.count || 0} active tenders`}
        />
      </div>

      <div className="grid grid-2">
        {/* Upcoming deadlines */}
        <Card>
          <h2>Upcoming deadlines</h2>
          <div className="stack" style={{ gap: "var(--s-2)" }}>
            {data.upcomingDeadlines.map((d) => (
              <Link
                key={d.opportunityId}
                to={`/tender/${d.opportunityId}`}
                className="recent-item"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span style={{ flex: 1 }}>
                  <b style={{ display: "block", fontSize: "0.92rem" }}>{d.title}</b>
                  <span className="faint" style={{ fontSize: "0.8rem" }}>
                    {d.authority}
                  </span>
                </span>
                <Badge tone="warning">{deadlineLabel(d.deadline)}</Badge>
              </Link>
            ))}
          </div>
        </Card>

        {/* Most active authorities */}
        <Card>
          <h2>Most active authorities</h2>
          <div className="stack" style={{ gap: "var(--s-2)" }}>
            {data.mostActiveAuthorities.map((a) => (
              <div key={a.name} className="spread">
                <span style={{ fontSize: "0.92rem" }}>{a.name}</span>
                <Badge tone="info">{a.count} tenders</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Top categories */}
        <Card>
          <h2>Top opportunity categories</h2>
          {data.topCategories.map((c) => (
            <div key={c.cpvLabel} className="bar-row">
              <span>{c.cpvLabel}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(c.count / maxCat) * 100}%` }} />
              </span>
              <span className="faint">{c.count}</span>
            </div>
          ))}
        </Card>

        {/* Certification demand */}
        <Card>
          <h2>Certification demand</h2>
          {data.certificationDemand.map((c) => (
            <div key={c.certification} className="bar-row">
              <span>{c.certification}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(c.demandCount / maxCert) * 100}%` }} />
              </span>
              <span className="faint">{c.demandCount}%</span>
            </div>
          ))}
        </Card>
      </div>

      {/* AI market insights */}
      <Card>
        <div className="row" style={{ gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
          <Badge tone="info">AI</Badge>
          <h2 style={{ margin: 0 }}>Market insights</h2>
        </div>
        <div>
          {data.aiInsights.map((insight, i) => (
            <div key={i} className="insight">
              <span className="dot">▸</span>
              <span className="muted">{insight}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
