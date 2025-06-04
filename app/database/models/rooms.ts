import mongoose, { Schema, model } from "mongoose";
import { IRoom } from "@/app/types";

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
