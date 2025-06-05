"use client";
import React, { Dispatch, SetStateAction } from "react";
import Button from "./Button";
import DocCard from "../../features/document/DocCard";
import ExtractionAnimation from "../../animations/ExtractionAnimation";
import VectorizationAnimation from "../../animations/EmbedAnimation";
import DuplicateCheckAnimation from "../../animations/DupCheckAnimation";
import ClassificationAnimation from "../../animations/ClassifyAnimation";
import SaveAnimation from "../../animations/SaveAnimation";
import { IDocument, IStep } from "@/app/types";

const Steps = ({
  step,
  setStep,
  duplicate,
  handleSaveAnyway,
}: {
  step: IStep;
  setStep: Dispatch<SetStateAction<IStep>>;
  duplicate: IDocument | null;
  handleSaveAnyway: () => void;
}) => {
  return (
    <>
      {step === null && (
        <div className="text-lg font-semibold">
          <p>Upload your doc,</p>
          <p>Let Matchita do the work!</p>
        </div>
      )}
      {step === "extract" && <ExtractionAnimation />}
      {step === "embed" && <VectorizationAnimation />}
      {step === "duplicate-check" && <DuplicateCheckAnimation />}
      {step === "classify" && <ClassificationAnimation />}
      {step === "save" && <SaveAnimation />}
      {step === "duplicate-found" && duplicate != null && (
        <div className="space-y-2 max-w-[90%]">
          <h2 className="text-xl font-bold">A duplicate document was found!</h2>
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
          An error occurred... Please try again
        </p>
      )}
    </>
  );
};

export default Steps;
