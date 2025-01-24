import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export const BottomBarPage = () => {
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 0, minWidth: 400, backgroundColor: "#3B1C32" }}
    >
      <Toolbar>
        <Autocomplete
          renderInput={({ inputProps, ...rest }) => (
            <TextField
              {...rest}
              label="Shop Name"
              inputProps={{ ...inputProps, readOnly: true }}
            />
          )}
          options={shops}
          sx={{ width: "70%" }}
        />
        <Button variant="outlined" sx={{ marginX: 1, color: "white" }}>
          Categories
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const shops = ["Auchan", "Kaufland", "Lidl"];
