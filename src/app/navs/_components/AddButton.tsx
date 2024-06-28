"use client";

import { useState } from "react";
import { RiAddCircleFill } from "react-icons/ri";

import { useSession } from "next-auth/react";

import AddChatDialog from "../chats/_components/AddChatDialog";
import AddStoryDialog from "../stories/_components/AddStoryDialog";
import IconButton from "@mui/material/IconButton";

export default function AddButton({ nav }: { nav: number }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [openAddChatDialog, setOpenAddChatDialog] = useState(false);
  const [openAddStoryDialog, setOpenAddStoryDialog] = useState(false);
  return (
    <div className="fixed bottom-5 right-0 z-50 flex">
      <IconButton
        onClick={() =>
          nav === 0 ? setOpenAddChatDialog(true) : setOpenAddStoryDialog(true)
        }
      >
        <RiAddCircleFill size={65} color="#1e9bf0" />
      </IconButton>
      <AddChatDialog
        open={openAddChatDialog}
        onClose={() => setOpenAddChatDialog(false)}
        userId={userId ?? ""}
      />
      <AddStoryDialog
        open={openAddStoryDialog}
        onClose={() => setOpenAddStoryDialog(false)}
        userId={userId ?? ""}
      />
    </div>
  );
}
