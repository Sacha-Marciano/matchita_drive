// File: /app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/mongodb";
import { getRoomById } from "@/app/database/services/roomService";
import { getDocumentById } from "@/app/database/services/documentService";
import { Types } from "mongoose";
import { extractTextFromGoogleDoc } from "@/app/utils/extractText";

export async function POST(req: NextRequest) {
  try {
    const { question, roomId, accessToken } = await req.json();
    if (!question || !roomId) {
      throw new Error("Missing question or roomId");
    }

    console.log("Connecting to DB...");
    await connectDb();

    console.log("Fetching room...");
    const room = await getRoomById(roomId);
    if (!room || !room.documentIds.length) {
      return NextResponse.json(
        { error: "Room not found or empty" },
        { status: 404 }
      );
    }

    // Step 1: Extract document metadata
    const documents = await Promise.all(
      room.documentIds.map(async (docId: string) => {
        return await getDocumentById(new Types.ObjectId(docId));
      })
    );

    const docs = documents.map((doc) => ({
      id: doc._id,
      title: doc.title,
      folder: doc.folder,
      tags: doc.tags,
      createdAt: doc.createdAt.toISOString(), // critical
    }));

    //step 2: Rank document with agent
    console.log("Calling AI agent to rank documents...");
    const rankRes = await fetch("https://fastapi-gemini-571768511871.us-central1.run.app/rank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question.text,
        docs,
      }),
    });

    const rankData = await rankRes.json();

    const rankedDocIds = rankData.rankedDocIds;
    console.log("Ranked Docs IDs : ", rankedDocIds);

    // step 3: Extract answer from documents
    for (const docId of rankedDocIds) {
      const doc = await getDocumentById(docId);
      let extractedText;

      if (doc.baseMimeType === "application/vnd.google-apps.document") {
        const res = await fetch(
          `https://docs.googleapis.com/v1/documents/${doc.googleId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch document: ${res.statusText}`);
        }

        const data = await res.json();
        extractedText = extractTextFromGoogleDoc(data);
      } else if (
        doc.baseMimeType === "application/vnd.google-apps.spreadsheet"
      ) {
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${doc.googleId}/values/A1:Z1000`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch spreadsheet: ${res.statusText}`);
        }

        const data = await res.json();
        const rows = data.values || [];
        extractedText = rows.map((row: string[]) => row.join(" | ")).join("\n");
      }

      const extractResponse = await fetch("https://fastapi-gemini-571768511871.us-central1.run.app/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.text,
          text: extractedText,
        }),
      });

      const extractData = await extractResponse.json();
      console.log("extracted", extractData);

      if (extractData.response.found) {
        return NextResponse.json(
          {
            data: {
              text_source: extractData.response.text_source,
              answer: extractData.response.answer,
              sourceTitle: doc.title,
              sourceUrl: doc.googleDocsUrl,
            },
          },
          { status: 200 }
        );
      }
    }
    return NextResponse.json({ data: null }, { status: 404 });
  } catch (err) {
    console.error("[CHAT ERROR]", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
