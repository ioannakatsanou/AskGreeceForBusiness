import { Routes, Route } from "react-router-dom";
import PageShell from "./components/layout/PageShell.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";

import Home from "./routes/Home.jsx";
import SearchResults from "./routes/SearchResults.jsx";
import TenderDetails from "./routes/TenderDetails.jsx";
import CompanyProfile from "./routes/CompanyProfile.jsx";
import Compliance from "./routes/Compliance.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import NotFound from "./routes/NotFound.jsx";

export default function App() {
  return (
    <ProfileProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<PageShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/tender/:id" element={<TenderDetails />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/compliance/:id" element={<Compliance />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ProfileProvider>
  );
}
