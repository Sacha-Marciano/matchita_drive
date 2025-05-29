import connectToDB from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createDocument } from "@/app/database/services/documentService";
import {
  addDocumentToRoom,
  getRoomById,
  updateRoomTagsFolders,
} from "@/app/database/services/roomService";
import { findUserByEmail } from "@/app/database/services/userServices";
import { Types } from "mongoose";

export async function GET() {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByEmail(session.user.email);
  const roomDocIds = await Promise.all(
    user.roomIds.map(async (roomId: Types.ObjectId) => {
      const res = await getRoomById(new Types.ObjectId(roomId));
      if (res == null) return;
      return res.documentIds;
    })
  );

  const docHandled = roomDocIds
    .filter((item) => item != undefined)
    .flat().length;

  return NextResponse.json({ data: { docHandled } }, { status: 200 });
}
export async function POST(req: Request) {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { document, roomId } = await req.json();
  try {
    const newDoc = await createDocument(document);

    await updateRoomTagsFolders(roomId, newDoc.tags, newDoc.folder);

    const newRoom = await addDocumentToRoom(roomId, newDoc._id);

    return NextResponse.json({ data: { newDoc, newRoom } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }
}
