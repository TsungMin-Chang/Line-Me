import BottomNav from "./_components/BottomNav";

type Props = {
  children: React.ReactNode;
};

function TabsLayout({ children }: Props) {
  return (
    <>
      <div className="bg-white text-black h-screen w-screen overflow-y-scroll">{children}</div>
      <BottomNav />
    </>
  );
}

export default TabsLayout;
