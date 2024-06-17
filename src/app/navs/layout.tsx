import BottomNav from "./_components/BottomNav";
import NavBar from "./_components/NavBar";

type Props = {
  children: React.ReactNode;
};

function NavsLayout({ children }: Props) {
  return (
    <div className="h-screen w-screen flex flex-col">
      <NavBar />
      <div className="bg-white text-black overflow-y-scroll">{children}</div>
      <BottomNav />
    </div>
  );
}

export default NavsLayout;
