"use client";

import ChatBlock from "./_components/ChatBlock";

function ChatsPage() {
  return (
    <>
      {Array(20).fill(0).map((_, i) => (
        <ChatBlock index={i + 1} key={i} />
      ))}

    </>
  );
}
export default ChatsPage;
