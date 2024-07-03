"use client";

import { useState, useEffect } from "react";
import { IoIosSend } from "react-icons/io";

import useChat from "@/hooks/useChat";

type ChatInputProps = {
  userId: string;
  chatroomId: string;
};

export default function ChatInput({ userId, chatroomId }: ChatInputProps) {
  useEffect(() => {
    var element = document.getElementById("chat_boxes");
    if (element && element.lastElementChild) {
      element.lastElementChild.scrollIntoView(false);
    }
  });

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
      <div className="sticky bottom-0 w-screen">
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
