"use client";

import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";

export default function NavBar() {
  return (
    <div 
      className="sticky top-0 w-screen"
      style={{ height: "6vh" }}
    >
      <Box className="flex-none" sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar className="bg-brand">
            <div className="text-xl font-bold text-white">Line Me</div>
            <div className="flex grow"></div>    
            <Link href={`/auth/signout`}>
              <AccountCircle sx={{ fontSize: 32 }} />
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      
    </div>
  );
}