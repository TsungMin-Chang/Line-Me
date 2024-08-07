import { type NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { usersToChatroomsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const socketId = data.get("socket_id") as string;
    const channel = data.get("channel_name") as string;

    // channel name is in the format: private-<docId>
    const chatroomId = channel.slice(8);
    console.log(chatroomId);
    if (!chatroomId) {
      return NextResponse.json(
        { error: "Invalid channel name" },
        { status: 400 },
      );
    }

    // Get the chatroom from the database
    const [chatroomOwnership] = await db
      .select()
      .from(usersToChatroomsTable)
      .where(
        and(
          eq(usersToChatroomsTable.userId, session.user.id),
          eq(usersToChatroomsTable.chatroomId, chatroomId),
        ),
      );
    if (!chatroomOwnership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = {
      user_id: session.user.email + session.user.provider,
    };

    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channel,
      userData,
    );

    return NextResponse.json(authResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      },
    );
  }
}
