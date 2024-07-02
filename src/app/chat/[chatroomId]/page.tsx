import { eq, asc } from "drizzle-orm";

import { db } from "@/db";
import {
  usersTable,
  usersToChatroomsTable,
  chatsTable,
  chatroomsTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

import ChatBox from "./_components/ChatBox";
import ChatInput from "./_components/ChatInput";
import TitleBar from "./_components/TitleBar";

type ChatPageProps = {
  params: {
    chatroomId: string;
  };
};
async function ChatPage({ params: { chatroomId } }: ChatPageProps) {
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
  const { id: loggedInUserId, username: loggedInUserUsername } = user;

  const chats = await db
    .select({
      id: chatsTable.id,
      createdAt: chatsTable.createdAt,
      content: chatsTable.content,
      userId: usersTable.id,
      userPicture: usersTable.picture,
    })
    .from(usersToChatroomsTable)
    .innerJoin(usersTable, eq(usersToChatroomsTable.userId, usersTable.id))
    .innerJoin(
      chatsTable,
      eq(chatsTable.usersToChatroomsId, usersToChatroomsTable.id),
    )
    .where(eq(usersToChatroomsTable.chatroomId, chatroomId))
    .orderBy(asc(chatsTable.createdAt));

  const titleArray = await db
    .select({
      chatroomType: chatroomsTable.type,
      chatroomTitle: chatroomsTable.title,
      username: usersTable.username,
    })
    .from(usersToChatroomsTable)
    .innerJoin(usersTable, eq(usersToChatroomsTable.userId, usersTable.id))
    .innerJoin(
      chatroomsTable,
      eq(usersToChatroomsTable.chatroomId, chatroomsTable.id),
    )
    .where(eq(usersToChatroomsTable.chatroomId, chatroomId));

  let title;
  if (!titleArray[0].chatroomType) {
    // group chat
    title = titleArray[0].chatroomTitle;
  } else {
    // indiviual chat
    for (const ele of titleArray) {
      if (ele.username !== loggedInUserUsername) {
        title = ele.username;
        break;
      }
    }
  }
  if (!title) {
    // Redirect to the sign-in page
    alert("title does not exist!");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return (
    <div className="flex h-screen w-screen flex-col">
      <TitleBar title={title} />
      <div className="flex-1 overflow-y-scroll">
        {chats.map((chat) => (
          <ChatBox
            key={chat.id}
            id={chat.id}
            createdAt={chat.createdAt}
            content={chat.content ?? ""}
            userId={chat.userId}
            userPicture={chat.userPicture}
            isLoggedInUser={loggedInUserId === chat.userId}
          />
        ))}
      </div>
      <ChatInput userId={loggedInUserId} chatroomId={chatroomId} />
    </div>
  );
}
export default ChatPage;
