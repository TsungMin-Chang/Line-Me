"use client"
import { useState } from "react";
import { RiAddCircleFill } from "react-icons/ri";

import IconButton from "@mui/material/IconButton";

import ChatAddDialog from "../chats/_components/ChatAddDialog";
import StoryAddDialog from "../stories/_components/StoryAddDialog";

export default function AddButton({nav}: {nav: number}) {
  const [openChatAddDialog, setOpenChatAddDialog] = useState(false);
  const [openStoryAddDialog, setOpenStoryAddDialog] = useState(false);
  return (
    <div className="fixed bottom-5 right-0 z-50 flex">
      <IconButton onClick={() => nav === 0 ? setOpenChatAddDialog(true) : setOpenStoryAddDialog(true)}>
        <RiAddCircleFill size={65} color="#1e9bf0" />
      </IconButton>
      <ChatAddDialog open={openChatAddDialog} onClose={() => setOpenChatAddDialog(false)} />
      <StoryAddDialog open={openStoryAddDialog} onClose={() => setOpenStoryAddDialog(false)} />
    </div>
  );
}
