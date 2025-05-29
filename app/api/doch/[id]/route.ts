import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { getRoomById } from "@/app/database/services/roomService";
import { getDocumentById } from "@/app/database/services/documentService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const room = await getRoomById(new Types.ObjectId(id));

  if (!room) {
    return NextResponse.json({ error: "No Room found" }, { status: 404 });
  }

  const docs = await Promise.all(
    room.documentIds.map(async (docId: string) => {
      return await getDocumentById(new Types.ObjectId(docId));
    })
  );

  return NextResponse.json({ data: docs });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {docId} = await req.json();

    const doc = await getDocumentById(new Types.ObjectId(docId))
  
    return NextResponse.json({ data: doc }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
