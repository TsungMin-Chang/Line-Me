import { useState } from "react";
import { signIn } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
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
    <div className="border-2 border-slate-400 rounded p-4">
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
        <p className="text-sm text-gray-400">or</p>
        <div className="h-[1px] grow border-t"></div>
      </div>

      <div className="flex flex-col items-center gap-y-3">
        <button
          className="w-full max-w-xs font-bold shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all focus:outline-none hover:bg-indigo-200 hover:shadow focus:shadow-sm focus:shadow-outline">
          <div className="bg-white p-1 rounded-full">
            <FcGoogle size={20}/>
          </div>
          <span className="ml-4">
            Sign In with Google
          </span>
        </button>

        <button
          className="w-full max-w-xs font-bold shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all focus:outline-none hover:bg-indigo-200 hover:shadow focus:shadow-sm focus:shadow-outline"
          onClick={async () => {
            signIn("github", {
              callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/navs/chats`,
            });
          }}
        >
          <div className="bg-white p-1 rounded-full">
            <BsGithub size={20} color={"black"}/>
          </div>
          <span className="ml-4">
            Sign In with Github
          </span>
        </button>
      </div>
      
    </div>
  );
}

export default SignInTab;
