import { DriveFile, IDocument } from "@/app/types";
import { extractTextFromGoogleDoc } from "@/app/utils/extractText";
import axios from "axios";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

export const fetchFiles = async (
  session: Session | null,
  setFiles: Dispatch<SetStateAction<DriveFile[]>>,
  setOptions: Dispatch<
    SetStateAction<{ name: string; value: string }[] | null>
  >,
  setShowSignoutMessage: Dispatch<SetStateAction<boolean>>
) => {
  if (!session?.accessToken) return;

  try {
    const res = await axios.get("https://www.googleapis.com/drive/v3/files", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      params: { fields: "files(id,name,mimeType,webViewLink)" },
    });

    setFiles(res.data.files);
    setOptions(
      res.data.files.map((file: DriveFile) => ({
        name: file.name,
        value: file.id,
      }))
    );
  } catch (err) {
    console.error(err, ", Signing out");
    setShowSignoutMessage(true);
    signOut();
  }
};

export const extractText = async (
  selectedFile: DriveFile | null,
  session: Session
) => {
  try {
    if (!selectedFile || !session) return;

    const { id, mimeType } = selectedFile;

    if (mimeType === "application/vnd.google-apps.document") {
      const res = await axios.get(
        `https://docs.googleapis.com/v1/documents/${id}`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      return extractTextFromGoogleDoc(res.data);
    }

    if (mimeType === "application/vnd.google-apps.spreadsheet") {
      const res = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A1:Z1000`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      const rows = res.data.values || [];
      return rows.map((row: string[]) => row.join(" | ")).join("\n");
    }

    if (mimeType === "application/pdf") {
      const convertRes = await axios.post(
        `https://www.googleapis.com/drive/v3/files/${id}/copy`,
        {
          name: `${name}-converted`,
          mimeType: "application/vnd.google-apps.document",
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await new Promise((r) => setTimeout(r, 1000));
      const convertedDocId = convertRes.data.id;

      const docRes = await axios.get(
        `https://docs.googleapis.com/v1/documents/${convertedDocId}`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      return extractTextFromGoogleDoc(docRes.data);
    }
  } catch (err) {
    console.error("Error extracting text:", err);
    return null;
  }
};

export const embedText = async (text: string) => {
  const response = await fetch(
    "https://fastapi-gemini-571768511871.us-central1.run.app/embed",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );
  return await response.json(); // should contain { embeddings }
};

export const classifyText = async (
  text: string,
  folders: string[],
  tags: string[]
) => {
  const response = await fetch(
    "https://fastapi-gemini-571768511871.us-central1.run.app/classify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, folders, tags }),
    }
  );
  return await response.json(); // should contain { title, folder, tags, teaser }
};

export const saveDocument = async (doc: Partial<IDocument>, roomId: string) => {
  const response = await fetch("/api/doch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document: doc, roomId }),
  });
  return await response.json(); // should contain { data: { newDoc } }
};
