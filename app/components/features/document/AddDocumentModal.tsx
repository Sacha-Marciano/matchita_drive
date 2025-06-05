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
  const [options, setOptions] = useState<
    { name: string; value: string }[] | null
  >(null);

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    // Fetches files from drive and set them in state variable
    fetchFiles(session, setFiles, setOptions, setShowSignoutMessage);
  }, [session]);

  // ─── Handlers ─────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!selectedFile || !session?.accessToken) return;

    const { id, mimeType } = selectedFile;

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

    const { id, mimeType } = selectedFile;

    ///////////////////////// STEP 1 - Classify ///////////////////////////////
    setStep("classify");
    const classifyData = await classifyText(
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
    ///////////////////////// STEP 6 - Save new document ///////////////////////////////
    const saveData = await saveDocument(docToSave, room._id.toString());

    setStep(null);
    onClose();
    setDocuments([...documents, saveData.data.newDoc]);
    setActualText(null);
    setActualVector(null);
  };

  // ─── Render ───────────────────────────────────────────────

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
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
    </BaseModal>
  );
}
