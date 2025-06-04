// /app/api/notif/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import User, { INotification } from "@/app/database/models/users";
import connectDB from "@/app/lib/mongodb";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import {
  addRoomToUser,
  findUserByEmail,
  markNotificationAsRead,
} from "@/app/database/services/userServices";
import { addViewerToRoom } from "@/app/database/services/roomService";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const userId = params.id;

//   if (!Types.ObjectId.isValid(userId)) {
//     return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
//   }

//   await connectDB();

//   const user = await User.findById(userId, "notifications");

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   const sortedNotifications = user.notifications.sort(
//     (a : INotification, b: INotification) => b.createdAt.getTime() - a.createdAt.getTime()
//   );

//   return NextResponse.json({ notifications: sortedNotifications });
// }

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { params } = context;
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, notif } = await req.json();

  const user = await findUserByEmail(session.user.email);

  const { id } = await params;
  const notifId = id;

  if (!Types.ObjectId.isValid(notifId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }
  console.log(notif);
  if (status === "accept") {
    try {
      await markNotificationAsRead(user._id, notifId);
      await addViewerToRoom(
        new Types.ObjectId(notif.metadata.payload),
        user._id
      );
      const userNewRoom = await addRoomToUser(
        user._id,
        new Types.ObjectId(notif.metadata.payload)
      );

      return NextResponse.json({ data: userNewRoom.notifications }, { status: 200 });
    } catch (err) {
      return NextResponse.json(
        { error: "error accepting invitation" },
        { status: 400 }
      );
    }
  }
}
