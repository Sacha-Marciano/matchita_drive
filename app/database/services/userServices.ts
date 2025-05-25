import User, { IUser } from "../models/users";
import { Types } from "mongoose";

export const findUserByEmail = (email: string) => User.findOne({ email });

export const createUser = (data: Partial<IUser>) => User.create(data);

export const updateLastLogin = (userId: Types.ObjectId) =>
  User.findByIdAndUpdate(userId, { lastLogin: new Date() });

export const addRoomToUser = (userId: Types.ObjectId, roomId: Types.ObjectId) =>
  User.findByIdAndUpdate(userId, { $addToSet: { roomIds: roomId } });

export const removeRoomFromUser = (userId: Types.ObjectId, roomId: Types.ObjectId) =>
  User.findByIdAndUpdate(userId, { $pull: { roomIds: roomId } });

export const getUserRooms = (userId: Types.ObjectId) =>
  User.findById(userId).populate("roomIds");