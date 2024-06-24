"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

function NavBar() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userPic = session?.user?.picture;

  return (
    <div className="sticky top-0 w-screen" style={{ height: "6vh" }}>
      <Box className="flex-none" sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar className="bg-brand">
            <div className="text-xl font-bold text-white">Line Me</div>
            <div className="flex grow"></div>
            <Link href={`/auth/signout`}>
              {userPic ? (
                <Image
                  className="rounded-full"
                  src={userPic}
                  width={35}
                  height={35}
                  alt={`User ${userId} Profile Picture`}
                />
              ) : (
                <AccountCircle sx={{ fontSize: 35 }} />
              )}
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default NavBar;
