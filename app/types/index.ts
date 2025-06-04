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
