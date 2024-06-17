import { useState } from "react";
import { signIn } from "next-auth/react";

import { publicEnv } from "@/lib/env/public";

import AuthInput from "./AuthInput";

function SignInTab() {

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStatus("initial");
      setFile(e.target.files[0]);
    }
  };

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
    <div className="bg-zinc-100 rounded px-8 py-6">
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

          <div className="flex flex-col my-2 gap-1">
            <div className="text-black font-semibold pl-1">Profile Photo</div>
            <div className="input-group">
              <label htmlFor="file" className="sr-only">
                Choose File
              </label>
              <input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
                className="text-black truncate"
              />
            </div>
          </div>

          <button
            type="submit"
            className="my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70"
          >
            Sign Up
          </button>

        </form>
    </div>
  );
}

export default SignInTab;
