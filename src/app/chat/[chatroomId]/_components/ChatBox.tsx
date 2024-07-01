// this is a server side component
import Image from "next/image";

import dayjs from "dayjs";

type ChatBoxProps = {
  id: string;
  createdAt: Date;
  content: string;
  userId: string;
  userPicture: string;
  isLoggedInUser: boolean;
};

export default function ChatBox({
  id,
  createdAt,
  content,
  userId,
  userPicture,
  isLoggedInUser,
}: ChatBoxProps) {
  return (
    <div className="grid grid-cols-3 p-2">
      {!isLoggedInUser ? (
        <>
          <div className="col-span-2 flex flex-row gap-x-3">
            <Image
              className="self-start object-contain"
              style={{ borderRadius: "9999px" }}
              src={userPicture}
              width={28}
              height={28}
              alt={`${userId}`}
            />
            <div className="flex justify-center text-pretty">{content}</div>
            <div className="self-end text-xs text-zinc-400">
              {dayjs(createdAt).format("h:mm A")}
            </div>
            <div className="grow"></div>
          </div>
          <div className="col-span-1"></div>
        </>
      ) : (
        <>
          <div className="col-span-1"></div>
          <div className="col-span-2 flex flex-row gap-x-3">
            <div className="grow"></div>
            <div className="self-end text-xs text-zinc-400">
              {dayjs(createdAt).format("h:mm A")}
            </div>

            <div className="flex justify-center text-pretty">{content}</div>
          </div>
        </>
      )}
    </div>
  );
}
