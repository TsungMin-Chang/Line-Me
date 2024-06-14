import { useState } from "react";
import { signIn } from "next-auth/react";
import { BsGithub } from "react-icons/bs";

import { publicEnv } from "@/lib/env/public";

import AuthInput from "./AuthInput";

function SignInTab() {

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", {
      email,
      username,
      password,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/navs/chats`,
    });
  };

  return (
    <div className="bg-white border-2 border-blue-400 rounded p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <AuthInput
          label="Email"
          type="email"
          value={email}
          setValue={setEmail}
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          setValue={setPassword}
        />

        <button
          type="submit"
          className="my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70"
        >
          Sign In
        </button>


      </form>
      <div className="flex w-full items-center gap-1 py-2">
        <div className="h-[1px] grow border-t"></div>
        <p className="text-xs text-gray-400">or</p>
        <div className="h-[1px] grow border-t"></div>
      </div>

      <button
        onClick={async () => {
          signIn("github", {
            callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/navs/chats`,
          });
        }}
        className="flex w-full"
      >
        <BsGithub size={20} color={"black"}/>
        <span className="grow text-black">Sign In with Github</span>
      </button>
      
    </div>
  );
}

export default SignInTab;
