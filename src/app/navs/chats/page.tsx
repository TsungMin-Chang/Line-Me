// this is a server side component
import { eq, and, ne, inArray, desc } from "drizzle-orm";

import { db } from "@/db";
import {
  usersTable,
  chatroomsTable,
  usersToChatroomsTable,
  chatsTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

import ChatRoom from "./_components/ChatRoom";

const ChatsPage = async () => {
  const session = await auth();
  if (!session) {
    // Redirect to the sign-in page
    alert("session does not exist!");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { user } = session;
  if (!user) {
    // Redirect to the sign-in page
    alert("user does not exist!");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { id: userId } = user;

  // Step 1: Find chatrooms associated with the user
  const userChatrooms = await db
    .select({
      chatroomId: usersToChatroomsTable.chatroomId,
      type: chatroomsTable.type,
      createdAt: chatroomsTable.createdAt,
      title: chatroomsTable.title,
      picture: chatroomsTable.picture,
    })
    .from(usersToChatroomsTable)
    .innerJoin(
      chatroomsTable,
      eq(usersToChatroomsTable.chatroomId, chatroomsTable.id),
    )
    .where(eq(usersToChatroomsTable.userId, userId));

  // Step 2: Find all other users associated with those chatrooms
  const userChatroomIds = userChatrooms.map((c) => c.chatroomId);
  const otherUsersInChatrooms = await db
    .select({
      chatroomId: usersToChatroomsTable.chatroomId,
      usersToChatroomId: usersToChatroomsTable.id,
      otherUserId: usersTable.id,
      name: usersTable.username,
      picture: usersTable.picture,
    })
    .from(usersToChatroomsTable)
    .innerJoin(usersTable, eq(usersToChatroomsTable.userId, usersTable.id))
    .where(
      userChatroomIds.length > 0
        ? and(
            inArray(usersToChatroomsTable.chatroomId, userChatroomIds),
            ne(usersTable.id, userId),
          )
        : ne(usersTable.id, userId),
    );

  // Step 3: Find the last message for each chatroom sent by the other user
  const otherUserUsersToChatroomsIds = otherUsersInChatrooms.map(
    (c) => c.usersToChatroomId,
  );
  const lastChats = await db
    .selectDistinctOn([chatsTable.usersToChatroomsId], {
      chatroomId: usersToChatroomsTable.chatroomId,
      content: chatsTable.content,
      createdAt: chatsTable.createdAt,
    })
    .from(chatsTable)
    .innerJoin(
      usersToChatroomsTable,
      eq(chatsTable.usersToChatroomsId, usersToChatroomsTable.id),
    )
    .where(
      otherUserUsersToChatroomsIds.length > 0
        ? and(
            inArray(
              chatsTable.usersToChatroomsId,
              otherUserUsersToChatroomsIds,
            ),
            ne(usersToChatroomsTable.userId, userId),
          )
        : ne(usersToChatroomsTable.userId, userId),
    )
    .orderBy(chatsTable.usersToChatroomsId, desc(chatsTable.createdAt));

  // Combine the data
  const chatrooms = userChatrooms.map((chatroom) => {
    const lastChat = lastChats.find(
      (chat) => chat.chatroomId === chatroom.chatroomId,
    );
    if (chatroom.type) {
      // Individual Chat
      const otherUser = otherUsersInChatrooms.find(
        (ou) => ou.chatroomId === chatroom.chatroomId,
      );
      return {
        id: chatroom.chatroomId,
        picture: otherUser && otherUser.picture ? otherUser.picture : "",
        title: otherUser && otherUser.name ? otherUser.name : "",
        updatedAt: lastChat
          ? new Date(lastChat.createdAt)
          : new Date(chatroom.createdAt),
        lastChat: lastChat && lastChat.content ? lastChat.content : "",
      };
    } else {
      // Group Chat
      return {
        id: chatroom.chatroomId,
        picture: chatroom.picture ?? "",
        title: chatroom.title ?? "",
        updatedAt: lastChat
          ? new Date(lastChat.createdAt)
          : new Date(chatroom.createdAt),
        lastChat: lastChat && lastChat.content ? lastChat.content : "",
      };
    }
  });
  // Sort the chatrooms array in descending order of updatedAt
  chatrooms.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <>
      {chatrooms.map((chatroom) => (
        <ChatRoom
          key={chatroom.id}
          id={chatroom.id}
          title={chatroom.title}
          updatedAt={chatroom.updatedAt}
          lastChat={chatroom.lastChat}
          picture={chatroom.picture}
        />
      ))}
    </>
  );
};
export default ChatsPage;
