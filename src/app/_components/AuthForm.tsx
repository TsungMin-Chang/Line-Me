"use client";

import { useState } from "react";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";

function AuthForm() {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="w-full h-full">
      <div className="flex-1 bg-zinc-100 rounded-lg">
        <div className="flex justify-center">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
        </div>
        <div className="px-9 py-6">
          {value === 0 && <SignInPage/>}
          {value === 1 && <SignUpPage/>}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
