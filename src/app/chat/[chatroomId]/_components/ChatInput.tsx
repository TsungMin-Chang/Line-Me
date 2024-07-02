"use client";

import { useState } from "react";
import { IoIosSend } from "react-icons/io";

import useChat from "@/hooks/useChat";

type ChatInputProps = {
  userId: string;
  chatroomId: string;
};

export default function ChatInput({ userId, chatroomId }: ChatInputProps) {
  const { postChat } = useChat();
  const [content, setContent] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) {
      return;
    }
    const data = {
      userId,
      chatroomId,
      content,
    };
    postChat(data);
    setContent("");
  };
  return (
    <>
      <div className="fixed bottom-0 w-screen">
        <form onSubmit={handleSubmit} className="flex flex-1 p-3">
          <input
            className="flex-1 rounded-md border border-black text-black"
            type={"text"}
            placeholder={"Message"}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <button type="submit">
            <IoIosSend size={29} />
          </button>
        </form>
      </div>
    </>
  );
}
