import Room, { IRoom } from "../models/rooms";
import { Types } from "mongoose";

export const createRoom = (data: Partial<IRoom>) => Room.create(data);

// export const getAllRooms = (userId: Types.ObjectId) => Room.find({});

export const getRoomById = (roomId: Types.ObjectId) => Room.findById(roomId);

export const getRoomsForUser = (userId: Types.ObjectId) =>
  Room.find({ $or: [{ ownerId: userId }, { viewerIds: userId }] });

export const addViewerToRoom = (
  roomId: Types.ObjectId,
  viewerId: Types.ObjectId
) => Room.findByIdAndUpdate(roomId, { $addToSet: { viewerIds: viewerId } });

export const addDocumentToRoom = (
  roomId: Types.ObjectId,
  documentId: Types.ObjectId
) => Room.findByIdAndUpdate(roomId, { $addToSet: { documentIds: documentId } });

export const updateRoomTagsFolders = (
  roomId: Types.ObjectId,
  tags: string[],
  folder: string
) =>
  Room.findByIdAndUpdate(
    roomId,
    {
      $addToSet: { tags: { $each: tags }, folders: folder },
    },
    { runValidators: true }
  );

export const updateRoomName = (roomId: Types.ObjectId, name: string) =>
  Room.findByIdAndUpdate(
    roomId,
    { $set: { title: name } },
    { new: true, runValidators: true }
  );

export const deleteRoom = (roomId: Types.ObjectId) =>
  Room.findByIdAndDelete(roomId);
