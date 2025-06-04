import { Document, Types } from "mongoose";

export interface IRoom extends Document {
  title: string;
  avatar: string;
  ownerId: Types.ObjectId;
  viewerIds: Types.ObjectId[];
  documentIds: Types.ObjectId[];
  folders: string[];
  tags: string[];
  createdAt: Date;
}

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
