import { NextResponse, type NextRequest } from "next/server";

import { eq, and } from "drizzle-orm";
import Pusher from "pusher";

import { db } from "@/db";
import { chatsTable, usersToChatroomsTable } from "@/db/schema";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";
import type { PostChatRequest } from "@/validators/crudTypes";
import { postChatRequestSchema } from "@/validators/crudTypes";

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postChatRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { userId, chatroomId, content } = data as PostChatRequest;

  try {
    // Individual Chat + Group Chat
    const [{ id: utcId }] = await db
      .select({
        id: usersToChatroomsTable.id,
      })
      .from(usersToChatroomsTable)
      .where(
        and(
          eq(usersToChatroomsTable.chatroomId, chatroomId),
          eq(usersToChatroomsTable.userId, userId),
        ),
      )
      .execute();

    const [{ id: newChatId }] = await db
      .insert(chatsTable)
      .values({
        content,
        usersToChatroomsId: utcId,
      })
      .returning({
        id: chatsTable.id,
      })
      .execute();

    // Trigger pusher event
    const pusher = new Pusher({
      appId: privateEnv.PUSHER_ID,
      key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
      secret: privateEnv.PUSHER_SECRET,
      cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    // Private channels are in the format: private-...
    await pusher.trigger(`private-${chatroomId}`, "post:chat", {
      senderId: userId,
      chat: {
        id: newChatId,
        content,
      },
    });

    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
