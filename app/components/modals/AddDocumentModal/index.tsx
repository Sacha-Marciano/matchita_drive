"use client";

import { Dialog } from "@headlessui/react";
import Button from "../../ui/Button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { extractTextFromGoogleDoc } from "@/app/utils/extractText";
import Select from "../../ui/Select";
import { duplicateCheck } from "@/app/utils/DuplicateCheck";
import { IRoom } from "@/app/database/models/rooms";
import { IDocument } from "@/app/database/models/documents";
import { Session } from "next-auth";
import VectorizationAnimation from "../../Animations/EmbedAnimation";
import DuplicateCheckAnimation from "../../Animations/DupCheckAnimation";
import ClassificationAnimation from "../../Animations/ClassifyAnimation";
import { signOut } from "next-auth/react";
import DocCard from "../../DocCard";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
}

export default function AddDocModal({
  isOpen,
  onClose,
  session,
  room,
  documents,
  setDocuments,
  setShowSignoutMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  room: IRoom;
  documents: IDocument[];
  setDocuments: Dispatch<SetStateAction<IDocument[]>>;
  setShowSignoutMessage: Dispatch<SetStateAction<boolean>>;
}) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [actualVector, setActualVector] = useState<number[] | null>(null);
  const [actualText, setActualText] = useState<string | null>(null);
  const [options, setOptions] = useState<
    | {
        name: string;
        value: string;
      }[]
    | null
  >(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [duplicate, setDuplicate] = useState<IDocument | null>(null);
  const [step, setStep] = useState<
    | "embed"
    | "duplicate-check"
    | "classify"
    | "duplicate-found"
    | "error"
    | null
  >(null);

  const handleExtractText = async () => {
    if (!selectedFile || !session?.accessToken) return;

    const { id, mimeType, name } = selectedFile;

    if (mimeType === "application/vnd.google-apps.document") {
      const res = await axios.get(
        `https://docs.googleapis.com/v1/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const text = extractTextFromGoogleDoc(res.data);
      return text;
    } else if (mimeType === "application/vnd.google-apps.spreadsheet") {
      const res = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A1:Z1000`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const rows = res.data.values || [];
      const text = rows.map((row: string[]) => row.join(" | ")).join("\n");
      return text;
    } else if (mimeType === "application/pdf") {
      try {
        // 1. Copy and convert the PDF to a Google Doc
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

        const convertedDocId = convertRes.data.id;

        // 2. Wait a second to let the conversion settle (optional but safe)
        await new Promise((r) => setTimeout(r, 1000));

        // 3. Fetch the converted doc
        const docRes = await axios.get(
          `https://docs.googleapis.com/v1/documents/${convertedDocId}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        const text = extractTextFromGoogleDoc(docRes.data);
        return text;
      } catch (err) {
        console.error("PDF conversion error:", err);
      }
    } else {
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !session?.accessToken) return;

    const { id, mimeType } = selectedFile;

    const extractedText = await handleExtractText();

    if (extractedText == null) {
      console.error("File type not supported");
      return;
    }

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

      if (duplicateFound != null) {
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
      };

      const saveRes = await fetch("/api/doch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: docToSave,
          roomId: room._id,
        }),
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
      return;
    }
  };

  const handleSaveAnyway = async () => {
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

  //   Fetches files on session mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (!session?.accessToken) return;

        const res = await axios.get(
          "https://www.googleapis.com/drive/v3/files",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
            params: {
              fields: "files(id,name,mimeType,webViewLink)",
            },
          }
        );
        setFiles(res.data.files);
        setOptions(
          res.data.files.map((file: DriveFile) => {
            return { name: file.name, value: file.id };
          })
        );
      } catch (err) {
        console.error(err, ", Signin out");
        setShowSignoutMessage(true);
        signOut();
      }
    };

    fetchFiles();
  }, [session]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-2">
        <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl text-matchita-text-alt">
          {/* Title */}
          <h2 className="text-lg font-bold mb-4">Upload Doc</h2>
          {/* Body */}
          <div className="space-y-4">
            <div>
              {/* Select */}
              <Select
                label="Select a document"
                value={selectedOption}
                options={options}
                onChange={(val) => {
                  setSelectedOption(val || "");
                  const file = files.find((f) => f.id === val) || null;
                  setSelectedFile(file);
                }}
              />
            </div>
            <div className="h-[50vh] overflow-hidden w-full flex items-center justify-center text-center">
              {step === null && (
                <div className="text-lg font-semibold">
                  <p>Upload your doc,</p>
                  <p>Let Matchita do the work !</p>
                </div>
              )}
              {step === "embed" && <VectorizationAnimation />}
              {step === "duplicate-check" && <DuplicateCheckAnimation />}
              {step === "classify" && <ClassificationAnimation />}
              {step === "duplicate-found" && duplicate != null && (
                <div className="space-y-2 max-w-[90%]">
                  <h2 className="text-xl font-bold">
                    A duplicate document was found !
                  </h2>
                  <DocCard
                    document={duplicate}
                  />
                  <div className="flex items-center justify-around">
                    <Button onClick={() => setStep(null)} >Cancel</Button>
                  <Button
                    onClick={() => handleSaveAnyway()}
                    className="bg-yellow-500!"
                  >
                    Save Anyway
                  </Button>
                  </div>
                </div>
              )}
              {step === "error" && (
                <p className="text-red-400 font-semibold">
                  An error occured... Please try again
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button
                variant={step === null ? "primary" : "disabled"}
                onClick={() => handleSubmit()}
                disabled={step != null}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
