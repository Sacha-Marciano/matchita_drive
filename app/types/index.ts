import { Document, Types } from "mongoose";

export interface IRoom extends Document {
  _id: Types.ObjectId;
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
  _id: Types.ObjectId;
  title: string;
  googleDocsUrl: string;
  folder: string;
  tags: string[];
  embedding: number[];
  createdAt: Date;
  baseMimeType: string;
  googleId: string;
  teaser: string;
  addedBy: Types.ObjectId;
}

export interface INotification extends Document {
  _id: Types.ObjectId;
  type: "invitation" | "ai-chat" | "system";
  message: string;
  metadata?: {
    type: string;
    payload: string;
  };
  read: boolean;
  createdAt: Date;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  avatar: string;
  roomIds: Types.ObjectId[]; // rooms the user has access to
  lastLogin: Date;
  createdAt: Date;
  notifications: INotification[];
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
}

export type IStep =
  | "extract"
  | "embed"
  | "duplicate-check"
  | "classify"
  | "save"
  | "duplicate-found"
  | "error"
  | null;

export interface IMessage {
  role: "user" | "agent";
  content: {
    text: string;
    source?: { title: string; url: string };
    agentNote?: string;
  };
}
