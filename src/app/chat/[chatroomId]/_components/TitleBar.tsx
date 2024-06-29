import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
type TitleBarProps = {
    title: string;
  };
function TitleBar({title}: TitleBarProps) {
  
  return (
    <div className="sticky top-0 w-screen" style={{ height: "6vh" }}>
      <Box className="flex-none" sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar className="bg-brand">
            <div className="text-xl font-bold text-white">{title}</div>
            <div className="flex grow"></div>
            
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default TitleBar;

