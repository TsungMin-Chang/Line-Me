import { z } from "zod";

// POST Chatroom
export const postChatroomRequestSchema = z.object({
  userId: z.string().uuid(),
  type: z.boolean(),
  email: z.string().max(100),
  provider: z.string().max(16),
});
export type PostAffairRequest = z.infer<typeof postChatroomRequestSchema>;
