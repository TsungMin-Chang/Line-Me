import ChatInput from "./[chatroomId]/_components/ChatInput";

type Props = {
  children: React.ReactNode;
};

function ChatLayout({ children }: Props) {
  return (
    <>
      <div className="flex h-screen w-screen flex-col">
        <div className="flex-1 overflow-y-scroll">{children}</div>
        <ChatInput />
      </div>
    </>
  );
}

export default ChatLayout;
