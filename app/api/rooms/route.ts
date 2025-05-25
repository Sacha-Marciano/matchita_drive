import { NextResponse } from "next/server";
import {
  getRoomsForUser,
  createRoom,
} from "@/app/database/services/roomService";
import { getServerSession } from "next-auth";
import connectToDB from "@/app/lib/mongodb";
import { addRoomToUser, findUserByEmail } from "@/app/database/services/userServices";

export async function GET() {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });

  const user = await findUserByEmail(session.user.email);

  const rooms = await getRoomsForUser(user?._id);
  return NextResponse.json({data : rooms});
}

export async function POST(req: Request) {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByEmail(session.user.email);

  const body = await req.json();

  try {
    const room = await createRoom({
      ...body,
      ownerId: user._id,
      avatar: body.avatar,
    });
    const newUser = await addRoomToUser(user._id, room._id)
    return NextResponse.json({ data: room , newUser }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }
}
