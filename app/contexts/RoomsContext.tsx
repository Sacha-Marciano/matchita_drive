// contexts/RoomContext.tsx
"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { IRoom } from "../types";

type RoomContextType = {
  rooms: IRoom[];
  setRooms: React.Dispatch<React.SetStateAction<IRoom[]>>;
};

const RoomsContext = createContext<RoomContextType | undefined>(undefined);

export const RoomsProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  return (
    <RoomsContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const ctx = useContext(RoomsContext);
  if (!ctx) throw new Error("useRooms must be used within RoomsProvider");
  return ctx;
};
