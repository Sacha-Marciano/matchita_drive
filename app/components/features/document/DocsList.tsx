import { IDocument } from "@/app/database/models/documents";
import React, { Dispatch, SetStateAction } from "react";
import DocCard from "./DocCard";
import { IRoom } from "@/app/database/models/rooms";

const DocsList = ({
  docs,
  setDocList,
  room,
}: {
  docs: IDocument[];
  setDocList: Dispatch<SetStateAction<IDocument[]>>;
  room: IRoom;
}) => {
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-[70vh] overflow-y-auto">
      {docs.map((doc, index) => (
        <DocCard
          key={index}
          document={doc}
          docList={docs}
          setDocList={setDocList}
          room={room}
        />
      ))}
    </div>
  );
};

export default DocsList;
