import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  avatar: string;
  roomIds: Types.ObjectId[]; // rooms the user has access to
  lastLogin: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  roomIds: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  lastLogin: { type: Date, default: Date.now },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

export default mongoose.models.User || model<IUser>("User", UserSchema);
