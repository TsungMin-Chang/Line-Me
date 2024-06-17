import AccountCircle from "@mui/icons-material/AccountCircle";

export default function ChatBlock({index}: {index: number}) {
  return (
    <div 
      className="grid grid-cols-5 border-8 border-white pl-1 pr-3 py-1"
    >
        <div className="col-span-1 flex justify-center items-center">
          <AccountCircle sx={{ fontSize: 40 }} />
        </div>
        <div className="col-span-4">
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-center">
              <span className="font-bold">Harry Potter {index.toString()}</span>
              <span className="text-xs text-zinc-400">7:24 PM</span>
            </div>
            <span className="overflow-hidden text-nowrap text-ellipsis">
              The sun dipped below the horizon, casting a warm golden glow over the rolling hills. A gentle breeze rustled the leaves of the ancient oak tree standing proudly at the edge of the meadow. 
            </span>
          </div>
        </div>
    </div>
  );
}
