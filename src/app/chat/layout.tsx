import ChatInput from "./[chatroomId]/_components/ChatInput";
import TitleBar from "./[chatroomId]/_components/TitleBar";

type Props = {
  children: React.ReactNode;
};

function ChatLayout({ children }: Props) {
  const title = "Miley Cyrus";
  return (
    <>
      <div className="flex h-screen w-screen flex-col">
        <TitleBar title={title} />
        <div className="flex-1 overflow-y-scroll">{children}</div>
        <ChatInput />
      </div>
    </>
  );
}

export default ChatLayout;
