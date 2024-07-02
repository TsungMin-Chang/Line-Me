import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { pusherClient } from "@/lib/pusher/client";
import type { Chat, User } from "@/lib/types/db";
import type { PostChatRequest } from "@/validators/crudTypes";

type PusherPayload = {
  senderId: User["id"];
  chat: Chat;
};

export default function useChat() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const postChat = async (data: PostChatRequest) => {
    const jsonData = JSON.stringify(data);
    const res = await fetch(`/api/chats`, {
      method: "POST",
      body: jsonData,
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    // Private channels are in the format: private-...
    const channelName = `private-${data.chatroomId}`;
    // Subscribe to pusher events
    try {
      const channel = pusherClient.subscribe(channelName);
      channel.bind("post:chat", ({ senderId, chat }: PusherPayload) => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      router.push("/navs/chats");
    }
    return;
  };

  return {
    postChat,
  };
}
