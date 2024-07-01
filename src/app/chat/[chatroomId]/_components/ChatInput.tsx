"use client";

import { IoIosSend } from "react-icons/io";

export default function ChatInput() {
  return (
    <>
      <div className="flex sticky bottom-0 w-screen">
        <form className="p-2 flex-1 flex">
          <input
            className="rounded-md border border-black text-black flex-1"
            type={"text"}
            defaultValue={"Message"}
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
          <button type="submit">
            <IoIosSend size={29} />
          </button>
        </form>
      </div>
    </>
  );
}
