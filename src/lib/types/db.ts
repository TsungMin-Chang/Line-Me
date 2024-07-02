export type User = {
  id: string;
  username: string;
  email: string;
  provider: "github" | "google" | "credentials";
  picture: string;
};

export type Chat = {
  id: string;
  content: string;
};
