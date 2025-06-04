import mongoose, { Schema, model } from "mongoose";
import { IUser, INotification } from "@/app/types";

const NotificationSchema = new Schema<INotification>(
  {
    type: { type: String, required: true }, // e.g. 'invitation', 'ai-chat'
    message: { type: String, required: true },
    metadata: {
      type: {
        type: String,
      },
      payload: {
        type: String,
      },
    },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    roomIds: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    lastLogin: { type: Date, default: Date.now },
    notifications: { type: [NotificationSchema], default: [] },
  },
  { timestamps: true }
); // adds createdAt and updatedAt automatically

export default mongoose.models.User || model<IUser>("User", UserSchema);
