import { auth } from "@/lib/auth";

import ChatBox from "./_components/ChatBox";
import TitleBar from "./_components/TitleBar";
import ChatInput from "./_components/ChatInput";

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
      content: "faking fake chat",
      userId: "a1a97fe1-b37f-46a5-806e-b16ee8c24f91",
      userPicture: "/pictures/mileycyrus@email.com_credentials",
      userName: "Miley Cyrus",
    },
    {
      id: "asdfqwerwqqqqqq123",
      createdAt: new Date(),
      content: "faking fake chat2",
      userId: "880fdc36-36cc-4fbc-820e-90eea9ad4588",
      userPicture: "https://avatars.githubusercontent.com/u/144597204?v=4",
      userName: "TsungMin-Chang",
    },
  ];
  return (
    <>
    <TitleBar
    title={chatroomId}
    />
      {fakeChats.map((chat) => (
        <ChatBox
          key={chat.id}
          id={chat.id}
          createdAt={chat.createdAt}
          content={chat.content}
          userId={chat.userId}
          userPicture={chat.userPicture}
          userName={chat.userName}
          isLoggedInUser={loggedInUserId === chat.userId}
        />
      ))}
      <ChatInput/>
    </>
  );
}
export default ChatPage;
