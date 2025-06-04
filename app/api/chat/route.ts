import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/database/mongodb";
import { getRoomById } from "@/app/database/services/roomService";
import { getDocumentById } from "@/app/database/services/documentService";
import { Types } from "mongoose";
import { extractTextFromGoogleDoc } from "@/app/utils/extractText";

export async function POST(req: NextRequest) {
  await connectDb();

  try {
    const { question, roomId, accessToken } = await req.json();
    if (!question || !roomId) {
      throw new Error("Missing question or roomId");
    }

    let room;
    try {
      room = await getRoomById(roomId);
      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }
    } catch (error) {
      throw new Error(`Failed to fetch room from database : ${(error as Error).message}`,);
    }

    let docsMeta = [];
    try {
      const documents = await Promise.all(
        room.documentIds.map(async (docId: string) => {
          return await getDocumentById(new Types.ObjectId(docId));
        })
      );

      docsMeta = documents.map((doc) => ({
        id: doc._id,
        title: doc.title,
        folder: doc.folder,
        tags: doc.tags,
        createdAt: doc.createdAt.toISOString(),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch document metadata: ${(error as Error).message}`);
    }

    let rankedDocIds;
    try {
      const rankRes = await fetch("https://fastapi-gemini-571768511871.us-central1.run.app/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.text,
          docs: docsMeta,
        }),
      });

      if (!rankRes.ok) throw new Error("Rank service returned an error");

      const rankData = await rankRes.json();
      rankedDocIds = rankData.rankedDocIds;
    } catch (error) {
      throw new Error(`Failed to rank documents with AI agent: ${(error as Error).message}`);
    }

    for (const docId of rankedDocIds) {
      let doc, extractedText = "";

      try {
        doc = await getDocumentById(docId);
      } catch (error) {
        console.warn(`Failed to fetch ranked document ${docId}:`, error);
        continue;
      }

      try {
        if (doc.baseMimeType === "application/vnd.google-apps.document") {
          const res = await fetch(`https://docs.googleapis.com/v1/documents/${doc.googleId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (!res.ok) throw new Error(res.statusText);
          const data = await res.json();
          extractedText = extractTextFromGoogleDoc(data);

        } else if (doc.baseMimeType === "application/vnd.google-apps.spreadsheet") {
          const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${doc.googleId}/values/A1:Z1000`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (!res.ok) throw new Error(res.statusText);
          const data = await res.json();
          const rows = data.values || [];
          extractedText = rows.map((row: string[]) => row.join(" | ")).join("\n");
        }
      } catch (error) {
        console.warn(`Failed to extract text from doc ${docId}:`, error);
        continue;
      }

      try {
        const extractRes = await fetch("https://fastapi-gemini-571768511871.us-central1.run.app/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question.text,
            text: extractedText,
          }),
        });

        if (!extractRes.ok) throw new Error("Answer extraction failed");

        const extractData = await extractRes.json();

        if (extractData.response.found) {
          return NextResponse.json({
            data: {
              text_source: extractData.response.text_source,
              answer: extractData.response.answer,
              sourceTitle: doc.title,
              sourceUrl: doc.googleDocsUrl,
            },
          }, { status: 200 });
        }
      } catch (error) {
        console.warn(`Extraction failed for doc ${docId}:`, error);
        continue;
      }
    }

    return NextResponse.json({ data: null }, { status: 404 });
  } catch (error) {
    console.error("[CHAT ROUTE ERROR]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}
