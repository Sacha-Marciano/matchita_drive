import type { Metadata } from "next";

import AuthProvider from "./contexts/AuthProvider";

import { Poppins } from "next/font/google";

import "./styles/globals.css";
import Header from "@/app/components/layout/Header";
import { UserProvider } from "./contexts/UserContext";
import { RoomsProvider } from "./contexts/RoomsContext";
import { DocumentsProvider } from "./contexts/DocumentsContext";
import { RoomProvider } from "./contexts/RoomContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Paul",
  description: "Just do it smarter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <AuthProvider>
          <UserProvider>
            <RoomsProvider>
              <RoomProvider>
                <DocumentsProvider>
                  <Header />
                  {children}
                </DocumentsProvider>
              </RoomProvider>
            </RoomsProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
