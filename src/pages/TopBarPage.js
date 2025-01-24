import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchDropDownInput from "../components/SearchDropDownInput";
import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

export default function TopBarPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ minWidth: 400, backgroundColor: "#3B1C32" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, maxWidth: "100%" }}
          >
            <MenuIcon />
          </IconButton>
          <SearchDropDownInput />
          <Button
            variant={"outlined"}
            startIcon={<Add fontSize={"large"} />}
            sx={{ marginLeft: 1 }}
            size={"large"}
          >
            <Typography variant={"h5"} component={"h6"}>
              Add
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
