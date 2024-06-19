import BottomNav from "./_components/BottomNav";
import NavBar from "./_components/NavBar";

type Props = {
  children: React.ReactNode;
};

function NavsLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NavBar />
      <div className="overflow-y-scroll bg-white text-black">{children}</div>
      <BottomNav />
    </div>
  );
}

export default NavsLayout;
