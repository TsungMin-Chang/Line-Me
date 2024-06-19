import { useState } from "react";
import { Crop } from 'react-image-crop';
import { signIn } from "next-auth/react";

import { publicEnv } from "@/lib/env/public";
import AuthInput from "./AuthInput";
import ImgCropDialog from "./ImgCropDialog";

function SignUpPage() {

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [picture, setPicture] = useState<FormData | null>(null);

  const [openImgCropDialog, setOpenImgCropDialog] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState('');

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
      setOpenImgCropDialog(true);
    }
  }

  const handleCancel = () => {
    (document.getElementById("fileinput") as HTMLInputElement).value= "";
    setImgSrc('');
    setPicture(null);
    setCrop(undefined);
    setOpenImgCropDialog(false);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!email) {
      alert("What is your email?");
      return;
    };
    if(!username) {
      alert("What is your username?");
      return;
    }
    if(!password || !confirmPassword || password !== confirmPassword || password.length < 8) {
      alert("Please double check your password!\n(Note: has to be at least 8 characters long!)");
      return;
    }
    // if(!picture) {
    //   alert("Please (re)upload a profile picture!"); // TODO
    //   return;
    // }
    signIn("credentials", {
      email,
      username,
      password,
      picture: "fake for now",
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/navs/chats`,
    });
  };

  return (
    <>
      <div>
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
              <div className="truncate">
                <input
                  id="fileinput"
                  type="file" 
                  accept="image/*" 
                  onChange={onSelectFile} 
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

      <ImgCropDialog
        open={openImgCropDialog}
        onClose={() => setOpenImgCropDialog(false)}
        onCancel={handleCancel}
        imgSrc={imgSrc}
        crop={crop}
        setCrop={setCrop}
        setPicture={setPicture}
      />

    </>
  );
}

export default SignUpPage;
