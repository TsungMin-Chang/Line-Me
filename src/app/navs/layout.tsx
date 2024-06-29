import BottomNav from "./_components/BottomNav";
import NavBar from "./_components/NavBar";

type Props = {
  children: React.ReactNode;
};

function NavsLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NavBar />
      <div className="flex-1 overflow-y-scroll">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

export default NavsLayout;
