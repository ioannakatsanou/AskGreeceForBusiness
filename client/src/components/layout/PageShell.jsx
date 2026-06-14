import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

// App frame: sticky header (with Logo→Home), routed page body, footer.
export default function PageShell() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
