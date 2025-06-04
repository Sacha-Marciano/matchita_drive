import User from "../models/users";
import { Types } from "mongoose";
import { IUser } from "@/app/types";

export const findUserByEmail = (email: string) => User.findOne({ email });

// This is for an array of IDs
export async function findUsersByIds(ids: string[]) {
  const objectIds = ids.map(id => new Types.ObjectId(id));
  return await User.find({ _id: { $in: objectIds } });
}

export const createUser = (data: Partial<IUser>) => User.create(data);

export const updateLastLogin = (userId: Types.ObjectId) =>
  User.findByIdAndUpdate(userId, { lastLogin: new Date() });

export const addRoomToUser = (userId: Types.ObjectId, roomId: Types.ObjectId) =>
  User.findByIdAndUpdate(userId, { $addToSet: { roomIds: roomId } });

export const removeRoomFromUser = (
  userId: Types.ObjectId,
  roomId: Types.ObjectId
) => User.findByIdAndUpdate(userId, { $pull: { roomIds: roomId } });

export const getUserRooms = (userId: Types.ObjectId) =>
  User.findById(userId).populate("roomIds");

export async function addNotification(
  userId: string,
  payload: {
    type: string;
    message: string;
    metadata?: {
      type: string;
      payload: string;
    };
  }
) {
  const notification = {
    _id: new Types.ObjectId(),
    ...payload,
    read: false,
    createdAt: new Date(),
  };

  await User.findByIdAndUpdate(userId, {
    $push: { notifications: notification },
  });

  return notification;
}

export async function deleteNotification(
  userId: string,
  notificationId: string
) {
  await User.findByIdAndUpdate(new Types.ObjectId(userId), {
    $pull: { notifications: { _id: new Types.ObjectId(notificationId) } },
  });
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: string
) {
  await User.updateOne(
    { _id: userId, "notifications._id": new Types.ObjectId(notificationId) },
    { $set: { "notifications.$.read": true } }
  );
}
