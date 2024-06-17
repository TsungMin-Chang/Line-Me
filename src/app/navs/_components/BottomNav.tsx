"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SignpostIcon from "@mui/icons-material/Signpost";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import AddButton from "./AddButton";

export default function ButtonNav() {
  const [value, setValue] = useState(0);
  const router = useRouter();
  useEffect(() => {
    if (value === 0) {
      router.push("/navs/chats");
    }
    if (value === 1) {
      router.push("/navs/stories");
    }
  }, [value]);
  return (
    <>
      <div className="sticky bottom-0 w-screen">
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
      <AddButton nav={value}/>
    </>
  );
}
