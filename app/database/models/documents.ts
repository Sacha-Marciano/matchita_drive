import mongoose, { Schema, Document, model } from "mongoose";

export interface IDocument extends Document {
  title: string;
  googleDocsUrl: string;
  folder: string;
  tags: string[];
  embedding: number[];
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  googleDocsUrl: { type: String, required: true },
  folder: { type: String, required: true },
  tags: [{ type: String }],
  embedding: { type: [Number], default: [] },
}, { timestamps: true });

export default mongoose.models.Document || model<IDocument>("Document", DocumentSchema);
