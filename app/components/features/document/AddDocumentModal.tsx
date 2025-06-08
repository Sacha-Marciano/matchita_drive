"use client";

// ─── Framework Imports ───────────────────────────────────────
import { useState, useEffect, Dispatch, SetStateAction } from "react";

// ─── Auth ────────────────────────────────────────────────────
import { Session } from "next-auth";

// ─── Components ──────────────────────────────────────────────

// ─── UI & Layout ─────────────────────────────────────────────
import Button from "../../shared/ui/Button";
import Select from "../../shared/ui/Select";
import BaseModal from "../../shared/modals/BaseModal";

// ─── Types ───────────────────────────────────────────────────
import { DriveFile, IRoom, IDocument, IStep, IUser } from "@/app/types";

// ─── Utils / Constants ───────────────────────────────────────
import {
  classifyText,
  embedText,
  fetchFiles,
  extractText,
  // handleSaveDuplicate,
  saveDocument,
} from "./DocumentMethods";
import { duplicateCheck } from "@/app/utils/DuplicateCheck";
import Steps from "../../shared/ui/Steps";

// ─── Prop Types ───────────────────────────────────────────────────
type AddDocModalProps = {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  room: IRoom;
  documents: IDocument[];
  user: IUser;
  setDocuments: Dispatch<SetStateAction<IDocument[]>>;
  setShowSignoutMessage: Dispatch<SetStateAction<boolean>>;
};

// ─────────────────────────────────────────────────────────────

export default function AddDocModal({
  isOpen,
  onClose,
  session,
  room,
  documents,
  user,
  setDocuments,
  setShowSignoutMessage,
}: AddDocModalProps) {
  // ─── State ────────────────────────────────────────────────
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [actualVector, setActualVector] = useState<number[] | null>(null);
  const [actualText, setActualText] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [duplicate, setDuplicate] = useState<IDocument | null>(null);
  const [step, setStep] = useState<IStep>(null);
  const [display, setDisplay] = useState<"single" | "bulk">("single");
  const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
  const [options, setOptions] = useState<
    { name: string; value: string }[] | null
  >(null);

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    // Fetches files from drive and set them in state variable
    fetchFiles(session, setFiles, setOptions, setShowSignoutMessage);
  }, [session]);

  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  // ─── Handlers ─────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!selectedFile || !session?.accessToken) return;

    const { id, mimeType, name } = selectedFile;

    ///////////////////////// STEP 1 - Extract ///////////////////////////////
    setStep("extract");
    const extractedText = await extractText(selectedFile, session);
    if (!extractedText) return;

    setActualText(extractedText);
    ///////////////////////// STEP 2 - Vectorize ///////////////////////////////
    setStep("embed");
    const embedData = await embedText(extractedText);
    if (!embedData) return;

    setActualVector(embedData.embeddings);
    ///////////////////////// STEP 3 - Duplicate Check ///////////////////////////////
    setStep("duplicate-check");
    const duplicateFound = await duplicateCheck(
      documents,
      embedData.embeddings,
      selectedFile?.webViewLink || "no url"
    );

    if (duplicateFound) {
      setStep("duplicate-found");
      setDuplicate(duplicateFound);
      return; // Saves prompting cost by exiting the function
    }
    ///////////////////////// STEP 4 - Classify ///////////////////////////////
    setStep("classify");
    const classifyData = await classifyText(
      name,
      extractedText,
      room.folders,
      room.tags
    );
    if (!classifyData) return;
    ///////////////////////// STEP 5 - Create new document ///////////////////////////////
    setStep("save");
    const docToSave = {
      title: classifyData.title,
      googleDocsUrl: selectedFile?.webViewLink || "no url",
      folder: classifyData.folder,
      tags: classifyData.tags,
      embedding: embedData.embeddings,
      createdAt: new Date(),
      baseMimeType: mimeType,
      googleId: id,
      teaser: classifyData.teaser,
      addedBy: user._id,
    };
    ///////////////////////// STEP 6 - Save new document ///////////////////////////////
    const saveData = await saveDocument(docToSave, room._id.toString());

    setStep(null);
    onClose();
    setDocuments([...documents, saveData.data.newDoc]);
    setActualText(null);
    setActualVector(null);
  };

  const handleSaveAnyway = async () => {
    if (!selectedFile || !session?.accessToken || !actualText || !actualVector)
      return;

    const { id, mimeType, name } = selectedFile;

    ///////////////////////// STEP 1 - Classify ///////////////////////////////
    setStep("classify");
    const classifyData = await classifyText(
      name,
      actualText,
      room.folders,
      room.tags
    );
    if (!classifyData) return;
    ///////////////////////// STEP 2 - Create new document ///////////////////////////////
    setStep("save");
    const docToSave = {
      title: classifyData.title,
      googleDocsUrl: selectedFile?.webViewLink || "no url",
      folder: classifyData.folder,
      tags: classifyData.tags,
      embedding: actualVector,
      createdAt: new Date(),
      baseMimeType: mimeType,
      googleId: id,
      teaser: classifyData.teaser,
      addedBy: user._id,
    };
    ///////////////////////// STEP 3 - Save new document ///////////////////////////////
    const saveData = await saveDocument(docToSave, room._id.toString());

    setStep(null);
    onClose();
    setDocuments([...documents, saveData.data.newDoc]);
    setActualText(null);
    setActualVector(null);
  };

  const handleBulkSubmit = async () => {
    if (!selectedFiles || !session?.accessToken) return;

    for (const file of selectedFiles) {
      setSelectedFile(file);
      const { id, mimeType, name } = file;

      setStep("extract");
      const extractedText = await extractText(file, session);
      if (!extractedText) continue;

      setStep("embed");
      const embedData = await embedText(extractedText);
      if (!embedData) continue;

      const duplicateFound = await duplicateCheck(
        documents,
        embedData.embeddings,
        file?.webViewLink || "no url"
      );
      if (duplicateFound) {
        setDuplicate(duplicateFound);
        continue;
      }

      setStep("classify");
      const classifyData = await classifyText(
        name,
        extractedText,
        room.folders,
        room.tags
      );
      if (!classifyData) continue;

      setStep("save");
      const docToSave = {
        title: classifyData.title,
        googleDocsUrl: file?.webViewLink || "no url",
        folder: classifyData.folder,
        tags: classifyData.tags,
        embedding: embedData.embeddings,
        createdAt: new Date(),
        baseMimeType: mimeType,
        googleId: id,
        teaser: classifyData.teaser,
        addedBy: user._id,
      };

      const saveData = await saveDocument(docToSave, room._id.toString());
      setDocuments((prev) => [...prev, saveData.data.newDoc]);
    }

    // Reset
    setStep(null);
    setSelectedFiles([]);
    onClose();
  };

  // ─── Render ───────────────────────────────────────────────

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {/* Title */}
      <div className="flex items-center justify-between border-b-2 border-paul-400">
        <h2 className="text-lg font-bold mb-4 ">Upload Doc</h2>
        {display === "single" ? (
          <Button size="sm" onClick={() => setDisplay("bulk")}>
            Bulk Upload
          </Button>
        ) : (
          <Button size="sm" onClick={() => setDisplay("single")}>
            Single Upload
          </Button>
        )}
      </div>
      {/* Body */}
      {display === "single" && (
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
            {/* steps - animations */}
            <Steps
              step={step}
              setStep={setStep}
              duplicate={duplicate}
              handleSaveAnyway={handleSaveAnyway}
            />
          </div>
          {/* Actions */}
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
      )}
      {display === "bulk" && (
        <div className="space-y-4">
          <h3 className="font-medium mb-4">Select Documents</h3>
          <p className="mb-2">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} document(s) selected`
              : "No documents selected"}
          </p>
          <div className="max-h-[40vh] overflow-y-auto border p-2 rounded">
            <div className="grid grid-cols-2 gap-2">
              {files.map((file) => {
                const isSelected = selectedFiles.some((f) => f.id === file.id);
                return (
                  <div
                    key={file.id}
                    onClick={() =>
                      setSelectedFiles((prev) =>
                        isSelected
                          ? prev.filter((f) => f.id !== file.id)
                          : [...prev, file]
                      )
                    }
                    className={`cursor-pointer border rounded p-2 text-sm ${
                      isSelected ? "bg-paul-200 border-paul-500" : "bg-white"
                    }`}
                  >
                    {file.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-[30vh] overflow-hidden w-full flex items-center justify-center text-center">
          {/* Steps - animations */}
          <Steps
            step={step}
            setStep={setStep}
            duplicate={duplicate}
            handleSaveAnyway={handleSaveAnyway}
          />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button
              variant={step === null ? "primary" : "disabled"}
              onClick={() => handleBulkSubmit()}
              disabled={step !== null || selectedFiles.length === 0}
            >
              Upload Selected
            </Button>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
