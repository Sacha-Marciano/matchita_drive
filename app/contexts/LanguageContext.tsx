// contexts/LanguageContext.tsx
"use client"

import { createContext, useState, useContext, ReactNode } from "react";

type Language = "en" | "he" | "fr" | "es";

type LanguageContextType = {
  lang: Language;
  setLang: React.Dispatch<React.SetStateAction<Language>>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("en");
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
