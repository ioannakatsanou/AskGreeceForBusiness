import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, TextInput, Select, TextArea } from "../components/ui/Field.jsx";
import TagInput from "../features/profile/TagInput.jsx";
import { useProfile, EMPTY_PROFILE } from "../context/ProfileContext.jsx";
import { INDUSTRIES, GREEK_REGIONS, COMMON_CERTIFICATIONS } from "../lib/constants.js";
import { formatDate } from "../lib/format.js";

export default function CompanyProfile() {
  const { profile, saveProfile, clearProfile } = useProfile();
  const navigate = useNavigate();
  const [form, setForm] = useState(profile || EMPTY_PROFILE);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  };
  const setTeam = (key, val) => {
    setForm((f) => ({ ...f, team: { ...f.team, [key]: val } }));
    setSaved(false);
  };

  const validate = () => {
    const e = {};
    if (!form.companyName?.trim()) e.companyName = "Company name is required.";
    if (!form.industry) e.industry = "Select an industry.";
    if (!(Number(form.yearsInBusiness) > 0)) e.yearsInBusiness = "Enter a positive number.";
    if (form.employeeCount !== "" && Number(form.employeeCount) < 0)
      e.employeeCount = "Cannot be negative.";
    const min = Number(form.minProjectBudget);
    const max = Number(form.maxProjectBudget);
    if (form.minProjectBudget !== "" && form.maxProjectBudget !== "" && min > max)
      e.maxProjectBudget = "Max budget must be ≥ min budget.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Coerce numeric fields to numbers before persisting.
    const clean = {
      ...form,
      yearsInBusiness: Number(form.yearsInBusiness) || 0,
      employeeCount: Number(form.employeeCount) || 0,
      minProjectBudget: Number(form.minProjectBudget) || 0,
      maxProjectBudget: Number(form.maxProjectBudget) || 0,
      maxProjectDurationMonths: Number(form.maxProjectDurationMonths) || 0,
      team: {
        projectManagers: Number(form.team.projectManagers) || 0,
        engineers: Number(form.team.engineers) || 0,
        consultants: Number(form.team.consultants) || 0,
        support: Number(form.team.support) || 0,
      },
    };
    saveProfile(clean);
    setSaved(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onReset = () => {
    clearProfile();
    setForm(EMPTY_PROFILE);
    setErrors({});
    setSaved(false);
  };

  return (
    <form className="stack" style={{ gap: "var(--s-5)" }} onSubmit={onSave} noValidate>
      <div className="spread">
        <div>
          <h1 style={{ marginBottom: 4 }}>Company profile</h1>
          <p className="muted" style={{ margin: 0 }}>
            Saved locally in your browser and used to assess your fit against each tender.
          </p>
        </div>
        {profile?.updatedAt && (
          <Badge tone="success">Last saved {formatDate(profile.updatedAt)}</Badge>
        )}
      </div>

      {saved && (
        <Card style={{ borderColor: "var(--c-success)", background: "var(--c-success-tint)" }}>
          <div className="spread">
            <span>
              <b>✓ Profile saved.</b> You can now run compliance analysis on any tender.
            </span>
            <Button to="/search" variant="secondary">
              Browse opportunities →
            </Button>
          </div>
        </Card>
      )}

      {/* Company Information */}
      <Card>
        <h2 className="section-title">Company information</h2>
        <div className="grid grid-2">
          <Field label="Company name" htmlFor="companyName" error={errors.companyName}>
            <TextInput
              id="companyName"
              value={form.companyName}
              invalid={!!errors.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              placeholder="e.g. Aegean Secure Systems Ltd"
            />
          </Field>
          <Field label="Industry" htmlFor="industry" error={errors.industry}>
            <Select
              id="industry"
              value={form.industry}
              invalid={!!errors.industry}
              onChange={(e) => set("industry", e.target.value)}
            >
              <option value="">Select industry…</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Years in business" htmlFor="years" error={errors.yearsInBusiness}>
            <TextInput
              id="years"
              type="number"
              min="0"
              value={form.yearsInBusiness}
              invalid={!!errors.yearsInBusiness}
              onChange={(e) => set("yearsInBusiness", e.target.value)}
              placeholder="e.g. 8"
            />
          </Field>
          <Field label="Employee count" htmlFor="employees" error={errors.employeeCount}>
            <TextInput
              id="employees"
              type="number"
              min="0"
              value={form.employeeCount}
              invalid={!!errors.employeeCount}
              onChange={(e) => set("employeeCount", e.target.value)}
              placeholder="e.g. 25"
            />
          </Field>
        </div>
      </Card>

      {/* Capabilities */}
      <Card>
        <h2 className="section-title">Capabilities</h2>
        <div className="stack">
          <Field label="Product / service description" htmlFor="desc">
            <TextArea
              id="desc"
              value={form.serviceDescription}
              onChange={(e) => set("serviceDescription", e.target.value)}
              placeholder="Briefly describe what your company delivers…"
            />
          </Field>
          <Field label="Keywords" hint="Areas you want to be matched against.">
            <TagInput
              value={form.keywords}
              onChange={(v) => set("keywords", v)}
              placeholder="Add a keyword and press Enter"
              suggestions={["cybersecurity", "cloud", "ERP", "software development", "consulting"]}
            />
          </Field>
          <Field label="Certifications">
            <TagInput
              value={form.certifications}
              onChange={(v) => set("certifications", v)}
              placeholder="Add a certification and press Enter"
              suggestions={COMMON_CERTIFICATIONS}
            />
          </Field>
        </div>
      </Card>

      {/* Coverage */}
      <Card>
        <h2 className="section-title">Coverage</h2>
        <div className="stack">
          <Field label="Geographic coverage">
            <TagInput
              value={form.geographicCoverage}
              onChange={(v) => set("geographicCoverage", v)}
              placeholder="Add a region and press Enter"
              suggestions={GREEK_REGIONS}
            />
          </Field>
          <div className="grid grid-2">
            <Field label="Minimum project budget (EUR)" htmlFor="minBudget">
              <TextInput
                id="minBudget"
                type="number"
                min="0"
                value={form.minProjectBudget}
                onChange={(e) => set("minProjectBudget", e.target.value)}
                placeholder="e.g. 100000"
              />
            </Field>
            <Field
              label="Maximum project budget (EUR)"
              htmlFor="maxBudget"
              error={errors.maxProjectBudget}
            >
              <TextInput
                id="maxBudget"
                type="number"
                min="0"
                value={form.maxProjectBudget}
                invalid={!!errors.maxProjectBudget}
                onChange={(e) => set("maxProjectBudget", e.target.value)}
                placeholder="e.g. 2000000"
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card>
        <h2 className="section-title">Timeline</h2>
        <div className="grid grid-2">
          <Field label="Earliest project start date" htmlFor="start">
            <TextInput
              id="start"
              type="date"
              value={form.earliestStartDate}
              onChange={(e) => set("earliestStartDate", e.target.value)}
            />
          </Field>
          <Field label="Maximum delivery duration (months)" htmlFor="duration">
            <TextInput
              id="duration"
              type="number"
              min="0"
              value={form.maxProjectDurationMonths}
              onChange={(e) => set("maxProjectDurationMonths", e.target.value)}
              placeholder="e.g. 24"
            />
          </Field>
        </div>
      </Card>

      {/* Team */}
      <Card>
        <h2 className="section-title">Team</h2>
        <div className="grid grid-4">
          <Field label="Project managers" htmlFor="pm">
            <TextInput id="pm" type="number" min="0" value={form.team.projectManagers} onChange={(e) => setTeam("projectManagers", e.target.value)} />
          </Field>
          <Field label="Engineers" htmlFor="eng">
            <TextInput id="eng" type="number" min="0" value={form.team.engineers} onChange={(e) => setTeam("engineers", e.target.value)} />
          </Field>
          <Field label="Consultants" htmlFor="cons">
            <TextInput id="cons" type="number" min="0" value={form.team.consultants} onChange={(e) => setTeam("consultants", e.target.value)} />
          </Field>
          <Field label="Support personnel" htmlFor="sup">
            <TextInput id="sup" type="number" min="0" value={form.team.support} onChange={(e) => setTeam("support", e.target.value)} />
          </Field>
        </div>
      </Card>

      {/* Actions */}
      <div className="spread">
        <Button type="button" variant="ghost" onClick={onReset}>
          Reset profile
        </Button>
        <div className="row">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" size="lg">
            Save profile
          </Button>
        </div>
      </div>
    </form>
  );
}
