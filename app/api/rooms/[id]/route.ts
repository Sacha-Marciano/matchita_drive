import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { findUserByEmail } from "@/app/database/services/userServices";
import { getRoomById } from "@/app/database/services/roomService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(session.user.email);
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const room = await getRoomById(new Types.ObjectId(id));
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const isOwner = room.ownerId.toString() === user._id.toString();
  const isViewer = room.viewerIds.some(
    (v: { toString: () => string }) => v.toString() === user._id.toString()
  );

  if (!isOwner && !isViewer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ data: room });
}
