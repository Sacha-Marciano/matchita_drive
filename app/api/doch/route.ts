// /app/api/doch/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";

import connectToDB from "@/app/database/mongodb";
import { createDocument } from "@/app/database/services/documentService";
import {
  addDocumentToRoom,
  getRoomById,
  updateRoomTagsFolders,
} from "@/app/database/services/roomService";
import { findUserByEmail } from "@/app/database/services/userServices";

// GET /api/doch
export async function GET() {
  await connectToDB();
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await findUserByEmail(session.user.email);

    const roomDocIds = await Promise.all(
      user.roomIds.map(async (roomId: Types.ObjectId) => {
        const room = await getRoomById(new Types.ObjectId(roomId));
        return room?.documentIds || [];
      })
    );

    const docHandled = roomDocIds.flat().length;

    return NextResponse.json(
      { message: "Document count retrieved", data: { docHandled } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to retrieve document count", error },
      { status: 500 }
    );
  }
}

// POST /api/doch
export async function POST(req: Request) {
  await connectToDB();
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { document, roomId } = await req.json();

    const newDoc = await createDocument(document);
    await updateRoomTagsFolders(roomId, newDoc.tags, newDoc.folder);
    const updatedRoom = await addDocumentToRoom(roomId, newDoc._id);

    return NextResponse.json(
      { message: "Document created and room updated", data: { newDoc, updatedRoom } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create document", error },
      { status: 400 }
    );
  }
}
