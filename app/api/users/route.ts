import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDB from "@/app/database/mongodb";
import {
  findUserByEmail,
  findUsersByIds,
} from "@/app/database/services/userServices";

// GET: Fetch the current authenticated user
export async function GET() {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const user = await findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch users: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// POST: Fetch multiple users by IDs
export async function POST(req: NextRequest) {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing 'ids' array." },
        { status: 400 }
      );
    }

    const users = await findUsersByIds(ids);
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch users: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// PUT: Fetch a user by a specific email
export async function PUT(req: NextRequest) {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Invalid email provided." },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch user: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
