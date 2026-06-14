import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { STORAGE_KEYS } from "../lib/constants.js";

const ProfileContext = createContext(null);

export const EMPTY_PROFILE = {
  companyName: "",
  industry: "",
  yearsInBusiness: "",
  employeeCount: "",
  serviceDescription: "",
  keywords: [],
  certifications: [],
  geographicCoverage: [],
  minProjectBudget: "",
  maxProjectBudget: "",
  earliestStartDate: "",
  maxProjectDurationMonths: "",
  team: { projectManagers: "", engineers: "", consultants: "", support: "" },
  updatedAt: null,
  version: 1,
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useLocalStorage(STORAGE_KEYS.profile, null);

  const value = useMemo(() => {
    const isComplete =
      !!profile &&
      !!profile.companyName &&
      !!profile.industry &&
      Number(profile.yearsInBusiness) > 0;

    return {
      profile,
      isComplete,
      saveProfile: (next) =>
        setProfile({ ...next, updatedAt: new Date().toISOString(), version: 1 }),
      clearProfile: () => setProfile(null),
    };
  }, [profile, setProfile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
