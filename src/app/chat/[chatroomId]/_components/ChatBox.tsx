// this is a server side component
import Image from "next/image";

import dayjs from "dayjs";

type ChatBoxProps = {
  id: string;
  createdAt: Date;
  content: string;
  userId: string;
  userPicture: string;
  userName: string;
  isLoggedInUser: boolean;
};

export default function ChatBox({
  id,
  createdAt,
  content,
  userId,
  userPicture,
  userName,
  isLoggedInUser,
}: ChatBoxProps) {
  const todaysDate = new Date();

  return (
    <div className="grid grid-cols-5 border-8 border-white py-1 pl-1 pr-3">
      <div className="col-span-1 flex items-center justify-center">
        {!isLoggedInUser && (
          <Image
            className="rounded-full"
            src={userPicture}
            width={34}
            height={34}
            alt={`${id}`}
          />
        )}
      </div>
      <div className="col-span-4">
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between">
            {!isLoggedInUser && (<span className="font-bold">{userName}</span>)}

            <span className="text-xs text-zinc-400">
              {dayjs(createdAt).format(
                createdAt.setHours(0, 0, 0, 0) ===
                  todaysDate.setHours(0, 0, 0, 0)
                  ? "h:mm A"
                  : createdAt.getFullYear() === todaysDate.getFullYear()
                    ? "h:mm A · D MMM"
                    : "h:mm A · D MMM YYYY",
              )}
            </span>
          </div>
          <span className="overflow-hidden text-ellipsis text-nowrap">
            {content}
          </span>
        </div>
      </div>
    </div>
  );
}
