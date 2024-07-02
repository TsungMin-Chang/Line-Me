type Props = {
  children: React.ReactNode;
};

function ChatLayout({ children }: Props) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}

export default ChatLayout;
