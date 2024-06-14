import { useState } from "react";
import { signIn } from "next-auth/react";

import { publicEnv } from "@/lib/env/public";

import AuthInput from "./AuthInput";

function SignInTab() {

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

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
    <div className="min-w-[300px]">
      <div className=" flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">

          <AuthInput
            label="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          
          <AuthInput
            label="Username"
            type="text"
            value={username}
            setValue={setUsername}
          />
          
          <AuthInput
            label="Password"
            type="password"
            value={password}
            setValue={setPassword}
          />
          
          <AuthInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />

          <button type="submit" className="w-full">
            Sign Up
          </button>
        </form>
        
      </div>
    </div>
  );
}

export default SignInTab;
