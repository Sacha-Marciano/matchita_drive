// /app/api/notif/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";

import connectToDB from "@/app/database/mongodb";
import {
  addRoomToUser,
  findUserByEmail,
  markNotificationAsRead,
} from "@/app/database/services/userServices";
import { addViewerToRoom } from "@/app/database/services/roomService";

// POST /api/notif/[id]
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDB();

  const { params } = context;
  const { id } = await params;
  const notifId = id;

  if (!Types.ObjectId.isValid(notifId)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status, notif } = await req.json();
    const user = await findUserByEmail(session.user.email);

    if (status === "accept") {
      const roomId = new Types.ObjectId(notif.metadata.payload);
      await markNotificationAsRead(user._id, notifId);
      await addViewerToRoom(roomId, user._id);
      const updatedUser = await addRoomToUser(user._id, roomId);

      return NextResponse.json(
        { message: "Invitation accepted", data: updatedUser.notifications },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid status action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to process notification", error },
      { status: 400 }
    );
  }
}
