import mongoose, { Schema, Document, model, Types } from "mongoose";

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

const RoomSchema = new Schema<IRoom>({
  title: { type: String, required: true },
  avatar: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  viewerIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  documentIds: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  folders: [{ type: String }],
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Room || model<IRoom>("Room", RoomSchema);
