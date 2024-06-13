"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SignpostIcon from "@mui/icons-material/Signpost";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

export default function ButtonNav() {
  const [value, setValue] = useState(0);
  const router = useRouter();
  useEffect(() => {
    if (value === 0) {
      router.push("/tabs/chats");
    }
    if (value === 1) {
      router.push("/tabs/stories");
    }
  }, [value]);
  return (
    <div className="fixed bottom-0 w-screen">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        className="w-full"
      >
        <BottomNavigationAction label="Chats" icon={<PeopleAltIcon />} />
        <BottomNavigationAction label="Stories" icon={<SignpostIcon />} />
      </BottomNavigation>
    </div>
  );
}
