import { z } from "zod";

// POST Chatroom
export const postChatroomRequestSchema = z.object({
  userId: z.string().uuid(),
  type: z.boolean(),
  email: z.string().max(100),
  provider: z.string().max(16),
});
export type PostChatroomRequest = z.infer<typeof postChatroomRequestSchema>;

// POST Chat
export const postChatRequestSchema = z.object({
  userId: z.string().uuid(),
  chatroomId: z.string().uuid(),
  content: z.string(),
});
export type PostChatRequest = z.infer<typeof postChatRequestSchema>;
