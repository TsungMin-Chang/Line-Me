import type { PostChatroomRequest } from "@/validators/crudTypes";

export default function useChatroom() {
  const postChatroom = async (data: PostChatroomRequest) => {
    const jsonData = JSON.stringify(data);
    const res = await fetch(`/api/chatrooms`, {
      method: "POST",
      body: jsonData,
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    return;
  };

  //   const updateCard = useCallback(async (data: UpdateCardRequest) => {
  //     const jsonData = JSON.stringify(data);
  //     const res = await fetch(`/api/cards`, {
  //       method: "PUT",
  //       body: jsonData,
  //     });
  //     if (!res.ok) {
  //       const body = await res.json();
  //       throw new Error(body.error);
  //     }
  //     return;
  //   }, []);

  const deleteChatroom = async (chatroomId: string) => {
    const res = await fetch(`/api/cards`, {
      method: "DELETE",
      headers: { chatroomId },
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    return;
  };

  return {
    // getCards,
    postChatroom,
    // updateCard,
    deleteChatroom,
  };
}
