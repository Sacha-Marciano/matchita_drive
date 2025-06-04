import { getServerSession } from "next-auth";
import connectToDB from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { addNotification, findUserByEmail } from "@/app/database/services/userServices";

export async function POST(req: Request) {
  await connectToDB();
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByEmail(session.user.email);

  const { userId, payload } = await req.json();

  try {
    const notification = await addNotification(userId,payload)
    return NextResponse.json({ data: notification }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }
}
