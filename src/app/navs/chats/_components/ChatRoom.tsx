// this is a server side component
import Image from "next/image";
import Link from "next/link";

import AccountCircle from "@mui/icons-material/AccountCircle";
import dayjs from "dayjs";

type ChatRoomProps = {
  id: string;
  title: string;
  updatedAt: Date;
  lastChat: string;
  picture: string;
};

export default function ChatRoom({
  id,
  title,
  updatedAt,
  lastChat,
  picture,
}: ChatRoomProps) {
  const todaysDate = new Date();
  return (
    <Link
      href={{
        pathname: `/chat/${id}`,
      }}
    >
      <div className="grid grid-cols-5 border-8 border-white py-1 pl-1 pr-3">
        <div className="col-span-1 flex items-center justify-center">
          {picture ? (
            <Image
              className="rounded-full"
              src={picture}
              width={34}
              height={34}
              alt={`${id}`}
            />
          ) : (
            <AccountCircle sx={{ fontSize: 40 }} />
          )}
        </div>
        <div className="col-span-4">
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <span className="font-bold">{title}</span>

              <span className="text-xs text-zinc-400">
                {dayjs(updatedAt).format(
                  updatedAt.setHours(0, 0, 0, 0) ===
                    todaysDate.setHours(0, 0, 0, 0)
                    ? "h:mm A"
                    : updatedAt.getFullYear() === todaysDate.getFullYear()
                      ? "h:mm A · D MMM"
                      : "h:mm A · D MMM YYYY",
                )}
              </span>
            </div>
            <span className="overflow-hidden text-ellipsis text-nowrap">
              {lastChat}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
