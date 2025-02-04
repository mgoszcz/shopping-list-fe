import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";
import { getShopsData } from "../data/api/shopsData";
import logger from "../logger/logger";
import { updateCurrentShop } from "../data/api/currentShopData";
import { Delete, SwapVert } from "@mui/icons-material";

export const BottomBar = ({ currentShop, setCurrentShop, shopsTimestamp }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [shops, setShops] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [needsUpdate, setNeedsUpdate] = React.useState(false);
  const [currentSelection, setCurrentSelection] = React.useState({});

  useEffect(() => {
    if (shopsTimestamp) {
      setNeedsUpdate(true);
    }
  }, [shopsTimestamp]);

  useEffect(() => {
    if (currentShop) {
      setCurrentSelection(currentShop);
    } else {
      setCurrentSelection({});
    }
  }, [currentShop]);

  const handleOpen = () => {
    setOpen(true);
    if (!needsUpdate) {
      return;
    }
    setShops([]);
    (async () => {
      setLoading(true);
      const fetchedShops = await getShopsData();
      setLoading(false);
      setShops(fetchedShops);
      setNeedsUpdate(false);
    })();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = async (event, value) => {
    const shopId = value.id;
    if (shopId === 0) {
      logger.debug("Handle adding new shop");
    } else {
      logger.debug("Select new current shop");
      updateCurrentShop(shopId)
        .then(() => {
          setCurrentShop(shops.find((shop) => shop.id === shopId));
          logger.debug("Current shop selected");
        })
        .catch((error) => logger.error("Failed to select current shop", error));
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          top: "auto",
          bottom: 0,
          minWidth: 400,
          backgroundColor: "#3B1C32",
          marginX: "auto",
        }}
      >
        <Toolbar>
          <Typography>{isMobile ? "0.1.0" : "Shopping List 0.1.0"}</Typography>
          <Autocomplete
            onOpen={handleOpen}
            onClose={handleClose}
            fullWidth
            open={open}
            loading={loading}
            getOptionLabel={(option) => (option.name ? option.name : "")}
            getOptionDisabled={(option) => option.id === 0}
            value={currentSelection}
            disableClearable
            onChange={(event, value) => {
              handleSelect(event, value);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id} data-id={option.id}>
                <Typography variant={"h6"} noWrap>
                  {option.name}
                </Typography>
              </li>
            )}
            renderInput={({ inputProps, ...rest }) => (
              <TextField
                {...rest}
                label="Shop Name"
                inputProps={{ ...inputProps, readOnly: true }}
              />
            )}
            options={[...shops, { name: "Add Shop...", id: 0 }]}
            sx={{ minWidth: 200, maxWidth: "50%", marginLeft: "auto" }}
          />
          <Button
            startIcon={<SwapVert fontSize={"large"} />}
            variant="contained"
            disabled={true}
            sx={{ marginX: 1, color: "white", backgroundColor: "#A64D79" }}
          >
            {isMobile ? "" : "Categories"}
          </Button>
          <Button
            startIcon={<Delete />}
            variant="contained"
            disabled={true}
            sx={{ marginX: 1, color: "white", backgroundColor: "#A64D79" }}
          >
            {isMobile ? "" : "Delete"}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
