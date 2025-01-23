import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Button } from "@mui/material";

export const BottomBarPage = () => {
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 0, minWidth: 400, backgroundColor: "#3B1C32" }}
    >
      <Toolbar>
        <Button variant="outlined" sx={{ marginX: 1, color: "white" }}>
          Shop Name
        </Button>
        <Button variant="outlined" sx={{ marginX: 1, color: "white" }}>
          Categories
        </Button>
      </Toolbar>
    </AppBar>
  );
};
