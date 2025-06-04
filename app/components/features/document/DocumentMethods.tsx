import { DriveFile, IDocument, IRoom } from "@/app/types";
import { duplicateCheck } from "@/app/utils/DuplicateCheck";
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

export const handleExtractText = async (
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

export const handleTextUpload = async (
  session: Session | null,
  selectedFile: DriveFile | null,
  documents: IDocument[],
  room: IRoom,
  onClose: () => void,
  setActualText: Dispatch<SetStateAction<string | null>>,
  setDuplicate: Dispatch<SetStateAction<IDocument | null>>,
  setDocuments: Dispatch<SetStateAction<IDocument[]>>,
  setActualVector: Dispatch<SetStateAction<number[] | null>>,
  setStep: Dispatch<
    SetStateAction<
      | "extract"
      | "embed"
      | "duplicate-check"
      | "classify"
      | "duplicate-found"
      | "error"
      | null
    >
  >
) => {
  if (!selectedFile || !session?.accessToken) return;

  const { id, mimeType } = selectedFile;
  setStep("extract");
  const extractedText = await handleExtractText(selectedFile, session);
  if (!extractedText) return;

  setActualText(extractedText);

  try {
    setStep("embed");

    const embedRes = await fetch(
      "https://fastapi-gemini-571768511871.us-central1.run.app/embed",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      }
    );

    const embedData = await embedRes.json();
    setActualVector(embedData.embeddings);

    setStep("duplicate-check");

    const duplicateFound = await duplicateCheck(
      documents,
      embedData.embeddings,
      selectedFile?.webViewLink || "no url"
    );

    if (duplicateFound) {
      setStep("duplicate-found");
      setDuplicate(duplicateFound);
      return;
    }

    setStep("classify");

    const classRes = await fetch(
      "https://fastapi-gemini-571768511871.us-central1.run.app/classify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractedText,
          folders: documents.map((doc) => doc.folder),
          tags: documents.map((doc) => doc.tags).flat(),
        }),
      }
    );

    const classData = await classRes.json();

    const docToSave = {
      title: classData.title,
      googleDocsUrl: selectedFile?.webViewLink || "no url",
      folder: classData.folder,
      tags: classData.tags,
      embedding: embedData.embeddings,
      createdAt: new Date(),
      baseMimeType: mimeType,
      googleId: id,
      teaser: classData.teaser,
    };

    const saveRes = await fetch("/api/doch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document: docToSave, roomId: room._id }),
    });

    const saveData = await saveRes.json();
    setStep(null);

    if (saveRes.status === 201) {
      onClose();
      setDocuments([...documents, saveData.data.newDoc]);
      setActualText(null);
      setActualVector(null);
    }
  } catch (err) {
    setStep("error");
    console.error(err);
  }
};

export const handleSaveDuplicate = async (
  session: Session | null,
  selectedFile: DriveFile | null,
  actualText: string | null,
  actualVector: number[] | null,
  documents: IDocument[],
  room: IRoom,
  onClose: () => void,
  setDocuments: Dispatch<SetStateAction<IDocument[]>>,
  setStep: Dispatch<
    SetStateAction<
      | "extract"
      | "embed"
      | "duplicate-check"
      | "classify"
      | "duplicate-found"
      | "error"
      | null
    >
  >
) => {
  if (!selectedFile || !session?.accessToken) return;

  const { id, mimeType } = selectedFile;

  try {
    setStep("classify");
    const classRes = await fetch(
      "https://fastapi-gemini-571768511871.us-central1.run.app/classify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: actualText,
          folders: documents.map((doc) => doc.folder),
          tags: documents.map((doc) => doc.tags).flat(),
        }),
      }
    );

    const classData = await classRes.json();

    const docToSave = {
      title: classData.title,
      googleDocsUrl: selectedFile?.webViewLink || "no url",
      folder: classData.folder,
      tags: classData.tags,
      embedding: actualVector,
      createdAt: new Date(),
      baseMimeType: mimeType,
      googleId: id,
      teaser: classData.teaser,
    };

    const saveRes = await fetch("/api/doch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        document: docToSave,
        roomId: room._id,
      }),
    });

    setStep(null);

    if (saveRes.status === 201) {
      onClose();
      setDocuments([...documents, docToSave as IDocument]);
    }
  } catch (err) {
    setStep("error");
    console.error(err);
    return;
  }
};
