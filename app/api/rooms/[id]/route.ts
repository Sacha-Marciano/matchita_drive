import { NextRequest, NextResponse } from "next/server";
import { Types, ObjectId } from "mongoose";
import { getServerSession } from "next-auth";

import {
  findUserByEmail,
  removeRoomFromUser,
} from "@/app/database/services/userServices";
import {
  deleteRoom,
  getRoomById,
  setRoomTagsFolders,
  updateRoomName,
} from "@/app/database/services/roomService";
import connectToDB from "@/app/database/mongodb";

// GET /api/room/[id] — Get room by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDB();

  const { params } = context;
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await findUserByEmail(session.user.email);
    const room = await getRoomById(new Types.ObjectId(id));

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const userIdStr = user._id.toString();
    const isOwner = room.ownerId.toString() === userIdStr;
    const isViewer = room.viewerIds.some(
      (v: ObjectId) => v.toString() === userIdStr
    );

    if (!isOwner && !isViewer) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: room });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}

// PUT /api/room/[id] — Update room name, folders, tags
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDB();

  const { params } = context;
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await findUserByEmail(session.user.email);
    const room = await getRoomById(new Types.ObjectId(id));

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.ownerId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, folders, tags } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid room name" }, { status: 400 });
    }

    await updateRoomName(room._id, name);
    const updatedMetadata = await setRoomTagsFolders(room._id, folders, tags);

    return NextResponse.json({ data: updatedMetadata });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update room", details: error },
      { status: 500 }
    );
  }
}

// DELETE /api/room/[id] — Delete room and remove from users
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDB();

  const { params } = context;
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const roomId = new Types.ObjectId(id);
    const user = await findUserByEmail(session.user.email);
    const room = await getRoomById(roomId);

    if (!user || !room) {
      return NextResponse.json(
        { error: "Room or user not found" },
        { status: 404 }
      );
    }

    if (!room.ownerId.equals(user._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Remove room reference from all users
    for (const viewerId of room.viewerIds) {
      await removeRoomFromUser(viewerId, roomId);
    }
    await removeRoomFromUser(user._id, roomId);

    // Delete the room
    await deleteRoom(roomId);

    return NextResponse.json({ data: room });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete room", details: error },
      { status: 500 }
    );
  }
}
