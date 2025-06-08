// contexts/RoomContext.tsx
"use client"

import { createContext, useState, useContext, ReactNode } from "react";
import { IRoom } from "../types";

type RoomContextType = {
  room: IRoom | null ;
  setRoom: React.Dispatch<React.SetStateAction<IRoom | null >>;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [room, setRoom] = useState<IRoom | null >(null);
  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRooms must be used within RoomProvider");
  return ctx;
};
