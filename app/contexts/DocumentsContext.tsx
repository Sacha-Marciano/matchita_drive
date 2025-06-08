// contexts/DocumentsContext.tsx
"use client"

import { createContext, useState, useContext, ReactNode } from "react";
import { IDocument } from "../types";

type DocumentsContextType = {
  documents: IDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<IDocument[]>>;
};

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export const DocumentsProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  return (
    <DocumentsContext.Provider value={{ documents, setDocuments }}>
      {children}
    </DocumentsContext.Provider>
  );
};

export const useDocuments = () => {
  const ctx = useContext(DocumentsContext);
  if (!ctx) throw new Error("useDocuments must be used within DocumentsProvider");
  return ctx;
};
