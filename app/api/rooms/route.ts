import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectToDB from "@/app/database/mongodb";
import {
  getRoomsForUser,
  createRoom,
} from "@/app/database/services/roomService";
import {
  findUserByEmail,
  addRoomToUser,
} from "@/app/database/services/userServices";

// GET /api/room
export async function GET() {
  await connectToDB();
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await findUserByEmail(session.user.email);
    const rooms = await getRoomsForUser(user._id);

    return NextResponse.json(
      { message: "Rooms retrieved", data: rooms },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to retrieve rooms", error },
      { status: 500 }
    );
  }
}

// POST /api/room
export async function POST(req: Request) {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await findUserByEmail(session.user.email);
    const body = await req.json();

    const room = await createRoom({
      ...body,
      ownerId: user._id,
      avatar: body.avatar,
    });

    const updatedUser = await addRoomToUser(user._id, room._id);

    return NextResponse.json(
      { message: "Room created", data: room, user: updatedUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create room", error },
      { status: 400 }
    );
  }
}
