"use client";

// ─── Framework Imports ───────────────────────────────────────
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { signOut } from "next-auth/react";

// ─── Auth ────────────────────────────────────────────────────
import { Session } from "next-auth";

// ─── Third-Party Libraries ───────────────────────────────────
import axios from "axios";

// ─── Components ──────────────────────────────────────────────
import DocCard from "./DocCard";

// ─── UI & Layout ─────────────────────────────────────────────
import Button from "../../shared/ui/Button";
import Select from "../../shared/ui/Select";
import BaseModal from "../../shared/modals/BaseModal";

// ─── Animations ─────────────────────────────────────────────
import VectorizationAnimation from "../../animations/EmbedAnimation";
import DuplicateCheckAnimation from "../../animations/DupCheckAnimation";
import ClassificationAnimation from "../../animations/ClassifyAnimation";
import ExtractionAnimation from "../../animations/ExtractionAnimation";

// ─── Types ───────────────────────────────────────────────────
import { DriveFile, IRoom, IDocument } from "@/app/types";

// ─── Utils / Constants ───────────────────────────────────────
import {
  fetchFiles,
  handleSaveDuplicate,
  handleTextUpload,
} from "./DocumentMethods";

// ─── Prop Types ───────────────────────────────────────────────────
type AddDocModalProps = {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  room: IRoom;
  documents: IDocument[];
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
  setDocuments,
  setShowSignoutMessage,
}: AddDocModalProps) {

  // ─── State ────────────────────────────────────────────────
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [actualVector, setActualVector] = useState<number[] | null>(null);
  const [actualText, setActualText] = useState<string | null>(null);
  const [options, setOptions] = useState<
    { name: string; value: string }[] | null
  >(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [duplicate, setDuplicate] = useState<IDocument | null>(null);
  const [step, setStep] = useState<
    | "extract"
    | "embed"
    | "duplicate-check"
    | "classify"
    | "duplicate-found"
    | "error"
    | null
  >(null);

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    // Fetches files from drive and set them in state variable
    fetchFiles(session, setFiles, setOptions, setShowSignoutMessage);
  }, [session]);

  // ─── Handlers ─────────────────────────────────────────────

  const handleSubmit = async () => {
    await handleTextUpload(
      session,
      selectedFile,
      documents,
      room,
      onClose,
      setActualText,
      setDuplicate,
      setDocuments,
      setActualVector,
      setStep
    );
  };

  const handleSaveAnyway = async () => {
    await handleSaveDuplicate(
      session,
      selectedFile,
      actualText,
      actualVector,
      documents,
      room,
      onClose,
      setDocuments,
      setStep
    );
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
          {step === null && (
            <div className="text-lg font-semibold">
              <p>Upload your doc,</p>
              <p>Let Matchita do the work !</p>
            </div>
          )}
          {step === "extract" && <ExtractionAnimation />}
          {step === "embed" && <VectorizationAnimation />}
          {step === "duplicate-check" && <DuplicateCheckAnimation />}
          {step === "classify" && <ClassificationAnimation />}
          {step === "duplicate-found" && duplicate != null && (
            <div className="space-y-2 max-w-[90%]">
              <h2 className="text-xl font-bold">
                A duplicate document was found !
              </h2>
              <DocCard document={duplicate} />
              <div className="flex items-center justify-around">
                <Button onClick={() => setStep(null)}>Cancel</Button>
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
    </BaseModal>
  );
}
