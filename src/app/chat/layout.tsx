type Props = {
  children: React.ReactNode;
};

function ChatLayout({ children }: Props) {
  return (
    <>
      <div className="w-screen h-screen flex flex-col">{children}</div>
    </>
  );
}

export default ChatLayout;
