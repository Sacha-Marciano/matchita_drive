import React from "react";
import FolderCard from "./FolderCard";
import { IDocument } from "@/app/database/models/documents";

const FoldersList = ({
  folders,
}: {
  folders: Record<string, IDocument[]> | null;
}) => {
  return (
    <div className="h-[70vh] overflow-y-auto flex flex-col gap-4">
      {folders &&
        Object.entries(folders).map(([folderName, documents]) => (
          <FolderCard
            key={folderName}
            folderName={folderName}
            documents={documents}
          />
        ))}
    </div>
  );
};

export default FoldersList;
