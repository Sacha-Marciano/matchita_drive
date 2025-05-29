import connectToDB from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createDocument } from "@/app/database/services/documentService";
import {
  addDocumentToRoom,
  updateRoomTagsFolders,
} from "@/app/database/services/roomService";

export async function POST(req: Request) {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { document, roomId } = await req.json();
  try {
    const newDoc = await createDocument(document);

    await updateRoomTagsFolders(
      roomId,
      newDoc.tags,
      newDoc.folder,
    );

    const newRoom = await addDocumentToRoom(roomId, newDoc._id);

    return NextResponse.json({ data: { newDoc, newRoom } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }
}
