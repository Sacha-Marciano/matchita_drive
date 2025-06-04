// /app/api/notif/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectToDB from "@/app/database/mongodb";
import { addNotification } from "@/app/database/services/userServices";

export async function POST(req: Request) {
  await connectToDB();
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, payload } = await req.json();
    const notification = await addNotification(userId, payload);

    return NextResponse.json(
      { message: "Notification added", data: notification },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add notification", error },
      { status: 400 }
    );
  }
}
