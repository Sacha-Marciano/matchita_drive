import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDB from "@/app/lib/mongodb";
import { findUserByEmail } from "@/app/database/services/userServices";

export async function GET() {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });

  const user = await findUserByEmail(session.user.email);

  return NextResponse.json({ data: user }, { status: 200 });
}
