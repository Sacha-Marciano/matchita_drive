import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDB from "@/app/lib/mongodb";
import {
  findUserByEmail,
  findUsersByIds,
} from "@/app/database/services/userServices";

// GET: Fetch the current user
export async function GET() {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });

  const user = await findUserByEmail(session.user.email);

  return NextResponse.json({ data: user }, { status: 200 });
}

// POST: Fetch multiple users by IDs
export async function POST(req: Request) {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });

  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: "Invalid or missing 'ids' array." },
      { status: 400 }
    );
  }

  try {
    const users = await findUsersByIds(ids);
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch users: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  await connectToDB();

  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });

  const { email } = await req.json();

  try {
    const user = await findUserByEmail(email);
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch users: ${error}` },
      { status: 500 }
    );
  }
}
