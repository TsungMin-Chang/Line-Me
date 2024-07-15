import { useState } from "react";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { publicEnv } from "@/lib/env/public";

import AuthInput from "./AuthInput";

function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", {
      email,
      username: "",
      password,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/navs/chats`,
      redirect: false,
    }).then((res) => {
      if (res && res.ok && res.url) {
        router.push(res.url);
      } else {
        alert("Sign in fails, try again!");
      }
    });
  };

  return (
    <div>
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
          className="focus:shadow-outline flex w-full max-w-xs items-center justify-center rounded-lg bg-indigo-100 py-2 font-bold text-gray-800 shadow-sm transition-all hover:bg-indigo-200 hover:shadow focus:shadow-sm focus:outline-none"
          onClick={async () => {
            await signIn("google", {
              callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/navs/chats`,
            });
          }}
        >
          <div className="rounded-full bg-white p-1">
            <FcGoogle size={20} />
          </div>
          <span className="ml-4">Google Sign In</span>
        </button>

        <button
          className="focus:shadow-outline flex w-full max-w-xs items-center justify-center rounded-lg bg-indigo-100 py-2 font-bold text-gray-800 shadow-sm transition-all hover:bg-indigo-200 hover:shadow focus:shadow-sm focus:outline-none"
          onClick={async () => {
            await signIn("github", {
              callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/navs/chats`,
            });
          }}
        >
          <div className="rounded-full bg-white p-1">
            <BsGithub size={20} color={"black"} />
          </div>
          <span className="ml-4">Github Sign In</span>
        </button>
      </div>
    </div>
  );
}

export default SignInPage;
