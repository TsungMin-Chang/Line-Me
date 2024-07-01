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
  const { id: loggedInUserId } = user;

  const fakeChats = [
    {
      id: "asdfqwerwqqqqqq",
      createdAt: new Date(0),
      content:
        "The sun dipped below the horizon, casting a warm golden glow over the rolling hills. Birds chirped their evening songs, and the cool breeze rustled the leaves of the ancient oak tree that stood tall in the meadow. Sarah sat on the porch of her rustic cabin, sipping a cup of herbal tea. The day had been long and tiring, filled with chores and the hustle of everyday life. But now, in the tranquility of twilight, she found a moment of peace.",
      userId: "a1a97fe1-b37f-46a5-806e-b16ee8c24f91",
      userPicture: "/pictures/mileycyrus@email.com_credentials",
    },
    {
      id: "asdfqwerwqqqqqq123",
      createdAt: new Date(),
      content:
        "The sun dipped below the horizon, casting a warm golden glow over the rolling hills. Birds chirped their evening songs, and the cool breeze rustled the leaves of the ancient oak tree that stood tall in the meadow. Sarah sat on the porch of her rustic cabin, sipping a cup of herbal tea. The day had been long and tiring, filled with chores and the hustle of everyday life. But now, in the tranquility of twilight, she found a moment of peace.",
      userId: "880fdc36-36cc-4fbc-820e-90eea9ad4588",
      userPicture: "https://avatars.githubusercontent.com/u/144597204?v=4",
    },
  ];
  return (
    <div className="flex flex-col">
      {fakeChats.map((chat) => (
        <ChatBox
          key={chat.id}
          id={chat.id}
          createdAt={chat.createdAt}
          content={chat.content}
          userId={chat.userId}
          userPicture={chat.userPicture}
          isLoggedInUser={loggedInUserId === chat.userId}
        />
      ))}
    </div>
  );
}
export default ChatPage;
