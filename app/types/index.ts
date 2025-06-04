import { Document } from "mongoose";

export interface IDocument extends Document {
  title: string;
  googleDocsUrl: string;
  folder: string;
  tags: string[];
  embedding: number[];
  createdAt: Date;
  baseMimeType: string;
  googleId: string;
  teaser: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
}
