import { useNavigate } from "react-router-dom";
import SearchBar from "../features/search/SearchBar.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import { useRecentSearches } from "../hooks/useRecentSearches.js";
import { SEARCH_EXAMPLES } from "../lib/constants.js";
import { relativeTime } from "../lib/format.js";

export default function Home() {
  const navigate = useNavigate();
  const { recent, clearSearches } = useRecentSearches();

  const runExample = (term) => navigate(`/search?q=${encodeURIComponent(term)}`);

  return (
    <div className="stack" style={{ gap: "var(--s-6)" }}>
      {/* Hero */}
      <section className="hero">
        <Badge tone="info" className="hero-tag">
          AI Procurement Copilot · Greek Public Sector
        </Badge>
        <h1>Find the tenders you can actually win.</h1>
        <p className="lede">
          Ask Greece For Business scans active Greek public procurement opportunities and tells you
          whether your company is qualified to bid — with an explainable compliance gap
          analysis, not just a list of links.
        </p>

        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <SearchBar autoFocus />
        </div>

        <div className="row-wrap" style={{ justifyContent: "center", marginTop: "var(--s-4)" }}>
          <span className="faint" style={{ fontSize: "0.85rem" }}>
            Try:
          </span>
          {SEARCH_EXAMPLES.map((ex) => (
            <button key={ex} className="chip" onClick={() => runExample(ex)}>
              {ex}
            </button>
          ))}
        </div>

        <div className="row-wrap" style={{ justifyContent: "center", marginTop: "var(--s-5)" }}>
          <Button to="/dashboard" variant="secondary" size="lg">
            Explore market dashboard
          </Button>
          <Button to="/company-profile" variant="ghost" size="lg">
            Set up company profile →
          </Button>
        </div>
      </section>

      {/* Recent searches */}
      {recent.length > 0 && (
        <section>
          <div className="spread">
            <h2 className="section-title" style={{ margin: 0 }}>
              Recent searches
            </h2>
            <button className="backlink" onClick={clearSearches} style={{ margin: 0 }}>
              Clear
            </button>
          </div>
          <div className="recent-list" style={{ marginTop: "var(--s-3)" }}>
            {recent.map((r) => (
              <div key={r.keyword} className="recent-item" onClick={() => runExample(r.keyword)}>
                <span className="row" style={{ gap: "var(--s-2)" }}>
                  <span aria-hidden="true">🕑</span>
                  <b>{r.keyword}</b>
                </span>
                <span className="faint" style={{ fontSize: "0.82rem" }}>
                  {r.resultCount} results · {relativeTime(r.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="grid grid-3">
        <Card>
          <h3>① Discover</h3>
          <p className="muted">
            Search active opportunities from ESIDIS &amp; KIMDIS. Each result comes with an
            AI executive summary and the requirements that matter.
          </p>
        </Card>
        <Card>
          <h3>② Assess fit</h3>
          <p className="muted">
            Save your company profile once. We compare it against each tender across six
            compliance dimensions.
          </p>
        </Card>
        <Card>
          <h3>③ Decide</h3>
          <p className="muted">
            Get a clear verdict — Proceed, Proceed with Conditions, Proceed with Partner,
            or Do Not Bid — plus recommended actions.
          </p>
        </Card>
      </section>
    </div>
  );
}
