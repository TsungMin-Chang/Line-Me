"use client";

import { IoIosSend } from "react-icons/io";

export default function ChatInput() {
  return (
    <>
      <div className="sticky bottom-0 flex w-screen">
        <form className="flex flex-1 p-3">
          <input
            className="flex-1 rounded-md border border-black text-black"
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
