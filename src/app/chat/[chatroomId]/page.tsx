type ChatPageProps = {
  params: {
    chatroomId: string;
  };
};
function ChatPage({ params: { chatroomId } }: ChatPageProps) {
  return <div>{chatroomId}</div>;
}
export default ChatPage;
