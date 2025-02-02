import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SearchDropDownInput from "./searchDropDownInput";
import { AddRounded } from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import logger from "../logger/logger";

export default function TopBar({
  articlesTimestamp,
  shoppingCartProcessor,
  shoppingCart,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchItem, setSearchItem] = React.useState({});
  const [addButtonDisabled, setAddButtonDisabled] = React.useState(true);
  const [inputValue, setInputValue] = React.useState("");

  const handleAddButtonClick = async () => {
    logger.debug("Add button clicked");
    if (!searchItem.id) {
      logger.info("New item creation here");
      return;
    }
    const result = await shoppingCartProcessor.addCartItem(searchItem.id);
    if (result) {
      setInputValue("");
      setSearchItem({});
      setAddButtonDisabled(true);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ minWidth: 400, backgroundColor: "#3B1C32" }}
      >
        <Toolbar>
          <SearchDropDownInput
            articlesTimestamp={articlesTimestamp}
            setSearchItem={setSearchItem}
            shoppingCart={shoppingCart}
            setAddButtonDisabled={setAddButtonDisabled}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <IconButton
            sx={{
              backgroundColor: "#A64D79",
              "&.Mui-disabled": {
                backgroundColor: "#524C42",
              },
            }}
            size={isMobile ? "medium" : "large"}
            onClick={handleAddButtonClick}
            disabled={addButtonDisabled}
          >
            <AddRounded fontSize={"inherit"} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
