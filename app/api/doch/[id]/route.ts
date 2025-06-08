import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";

import connectToDB from "@/app/database/mongodb";

import {
  getRoomById,
  removeDocumentFromRoom,
} from "@/app/database/services/roomService";
import {
  deleteDocument,
  getDocumentById,
  updateDocument,
  // updateDocumentName,
} from "@/app/database/services/documentService";

// GET: List documents in a room
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDB();

  const { params } = context;
  const { id } = await params; // room id

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const room = await getRoomById(new Types.ObjectId(id));
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const docs = await Promise.all(
      room.documentIds.map(async (docId: string) =>
        getDocumentById(new Types.ObjectId(docId))
      )
    );

    return NextResponse.json({ data: docs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}

// POST: Get a single document by ID (in body)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { docId } = await req.json();
    if (!Types.ObjectId.isValid(docId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    const doc = await getDocumentById(new Types.ObjectId(docId));
    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: doc }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}

// PUT: Rename a document
// export async function PUT(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   await connectToDB();

//   const { params } = context;
//   const { id } = await params;

//   if (!Types.ObjectId.isValid(id)) {
//     return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
//   }

//   const session = await getServerSession();

//   if (!session?.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { name } = await req.json();
//     if (typeof name !== "string" || !name.trim()) {
//       return NextResponse.json(
//         { error: "Invalid document name" },
//         { status: 400 }
//       );
//     }

//     const updatedDoc = await updateDocumentName(new Types.ObjectId(id), name);
//     if (!updatedDoc) {
//       return NextResponse.json(
//         { error: "Document not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ data: updatedDoc }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Server error", details: error },
//       { status: 500 }
//     );
//   }
// }

// PUT /api/doch
export async function PUT(  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDB();
  const session = await getServerSession();
  const { params } = context;
  const { id } = await params;

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, folder, tags } = await req.json();

    if ( !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid or missing documentId" }, { status: 400 });
    }

    const updateFields: Partial<{ title: string; folder: string; tags: string[] }> = {};
    if (title !== undefined) updateFields.title = title;
    if (folder !== undefined) updateFields.folder = folder;
    if (tags !== undefined) updateFields.tags = tags;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: "No update fields provided" }, { status: 400 });
    }

    const updatedDoc = await updateDocument(id, updateFields);

    return NextResponse.json(
      { message: "Document updated", data: updatedDoc },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update document", error },
      { status: 500 }
    );
  }
}


// DELETE: Remove a document from DB and room
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDB();

  const { params } = context;
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (
    !Types.ObjectId.isValid(id) ||
    !roomId ||
    !Types.ObjectId.isValid(roomId)
  ) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const doc = await deleteDocument(new Types.ObjectId(id));
    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    await removeDocumentFromRoom(new Types.ObjectId(roomId), doc._id);

    return NextResponse.json({ data: doc }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
