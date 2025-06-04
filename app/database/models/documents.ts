import { IDocument } from "@/app/types";
import mongoose, { Schema, model } from "mongoose";

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    googleDocsUrl: { type: String, required: true },
    folder: { type: String, required: true },
    tags: [{ type: String }],
    embedding: { type: [Number], default: [] },
    baseMimeType: { type: String, required: true },
    googleId: { type: String, required: true },
    teaser: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Document ||
  model<IDocument>("Document", DocumentSchema);
