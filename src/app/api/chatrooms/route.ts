import { NextResponse, type NextRequest } from "next/server";

import { eq, asc, desc, and } from "drizzle-orm";

import { db } from "@/db";
import { usersTable, chatroomsTable, usersToChatroomsTable } from "@/db/schema";
// import type { DbMemo } from "@/lib/types";
import type { PostAffairRequest } from "@/validators/crudTypes";
import { postChatroomRequestSchema } from "@/validators/crudTypes";

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postChatroomRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { userId, type, email, provider } = data as PostAffairRequest;
  if (
    !provider ||
    (provider !== "github" &&
      provider !== "google" &&
      provider !== "credentials")
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    // Individual Chat
    const [{ id: otherUserId }] = await db
      .select({
        id: usersTable.id,
      })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email.toLowerCase()),
          eq(usersTable.provider, provider),
        ),
      )
      .execute();

    if (otherUserId === userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const [{ id: chatroomId }] = await db
      .insert(chatroomsTable)
      .values({
        type,
        title: null,
        picture: null,
      })
      .returning({
        id: chatroomsTable.id,
      })
      .execute();

    const usersIds = [userId, otherUserId];
    for (const id of usersIds) {
      await db
        .insert(usersToChatroomsTable)
        .values({
          chatroomId,
          userId: id,
        })
        .execute();
    }

    // Group Chat - not implemented
    // To implement, the incoming request will be an array of email + provider
    // Meaning, Individual Chat can be dealt with as a subset of Group Chat (array with one element)

    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

// export async function PUT(request: NextRequest) {
//   const data = await request.json();

//   try {
//     updateCardRequestSchema.parse(data);
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//   }
//   const { name, prevName } = data as UpdateCardRequest;

//   try {
//     await db
//       .update(cardsTable)
//       .set({ name })
//       .where(eq(cardsTable.name, prevName))
//       .execute();
//     return NextResponse.json("OK", { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Something went wrong in db" },
//       { status: 500 },
//     );
//   }
// }

export async function DELETE(request: NextRequest) {
  const chatroomId = request.headers.get("chatroomId");
  if (!chatroomId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    await db
      .delete(chatroomsTable)
      .where(eq(chatroomsTable.id, chatroomId))
      .execute();
    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong in db" },
      { status: 500 },
    );
  }
}
