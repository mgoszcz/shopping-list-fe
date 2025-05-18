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
import { Delete, DeleteSweep, Edit, SwapVert } from "@mui/icons-material";
import { ConfirmationPopup } from "../popups/confirmationPopup";
import SynchronizationStatusBar from "./synchronizationStatusBar";
import { APP_VERSION } from "../constants/version";
import CategoryOrderPopup from "../popups/categoryOrderPopup";
import AddShopPopup from "../popups/addShopPopup";

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;

const getColor = () => {
  switch (ENVIRONMENT) {
    case "local":
      return "darkred";

    case "development":
      return "darkorange";

    case "production": {
      return "";
    }
  }
};

export const BottomBar = ({
  currentShop,
  setCurrentShop,
  shopsTimestamp,
  shoppingCartProcessor,
  shoppingCartSyncState,
  articlesSyncState,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [shops, setShops] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [currentSelection, setCurrentSelection] = React.useState({});
  const [deleteAllConfirmationOpen, setDeleteAllConfirmationOpen] =
    React.useState(false);
  const [categoryOrderWindowOpen, setCategoryOrderWindowOpen] =
    React.useState(false);
  const [categoryOrderDisabled, setCategoryOrderDisabled] =
    React.useState(true);
  const [addShopPopupOpen, setAddShopPopupOpen] = React.useState(false);
  const [editingShop, setEditingShop] = React.useState(null);
  const [editButtonDisabled, setEditButtonDisabled] = React.useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const fetchedShops = await getShopsData();
      setLoading(false);
      setShops(fetchedShops);
    })();
  }, [shopsTimestamp]);

  useEffect(() => {
    if (currentShop.shop_id !== null) {
      setCurrentSelection(currentShop);
      setCategoryOrderDisabled(false);
      setEditButtonDisabled(false);
    } else {
      setCurrentSelection({});
      setCategoryOrderDisabled(true);
      setEditButtonDisabled(true);
    }
  }, [currentShop]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = async (event, value) => {
    const shopId = value.id;
    if (shopId === 0) {
      logger.debug("Handle adding new shop");
      setEditingShop(null);
      setAddShopPopupOpen(true);
    } else {
      logger.debug("Select new current shop");
      updateCurrentShop(shopId)
        .then(() => {
          const shop = shops.find((shop) => shop.id === shopId);
          setCurrentShop({
            logo: shop.logo,
            name: shop.name,
            shop_id: shop.id,
          });
          logger.debug("Current shop selected");
        })
        .catch((error) => logger.error("Failed to select current shop", error));
    }
  };

  const handleClear = async () => {
    logger.debug("Clear button pressed");
    const checkedItems = shoppingCartProcessor.getCheckedItems();
    logger.debug("Checked items: ", checkedItems);
    if (checkedItems.length !== 0) {
      logger.debug("Removing all checked items");
      await shoppingCartProcessor.deleteAllCheckedItems();
      return;
    }
    const uncheckedItems = shoppingCartProcessor.getUncheckedItems();
    logger.debug("Unchecked items: ", uncheckedItems);
    setDeleteAllConfirmationOpen(true);
  };

  const handleDeleteUnchecked = async () => {
    logger.debug("Removing all unchecked items");
    shoppingCartProcessor.deleteAllUnCheckedItems();
    setDeleteAllConfirmationOpen(false);
  };

  const handleEditShop = () => {
    const shop = shops.find((shop) => shop.id === currentShop.shop_id);
    setEditingShop(shop);
    setAddShopPopupOpen(true);
  };

  return (
    <div>
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
            <Box></Box>
            <Button
              startIcon={<DeleteSweep />}
              variant="contained"
              sx={{
                marginX: 1,
                color: "white",
                backgroundColor: "#A64D79",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              size={isMobile ? "small" : "medium"}
              onClick={handleClear}
              disabled={shoppingCartProcessor.isEmpty()}
            >
              {isMobile ? "" : "Clear List"}
            </Button>
            <Autocomplete
              onOpen={handleOpen}
              onClose={handleClose}
              fullWidth
              open={open}
              loading={loading}
              getOptionLabel={(option) => (option.name ? option.name : "")}
              // getOptionDisabled={(option) => option.id === 0}
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
              sx={{ minWidth: 150, maxWidth: "50%", marginLeft: "auto" }}
            />
            <Button
              startIcon={<SwapVert fontSize={"large"} />}
              variant="contained"
              disabled={categoryOrderDisabled}
              sx={{ marginX: 1, color: "white", backgroundColor: "#A64D79" }}
              onClick={() => {
                setCategoryOrderWindowOpen(true);
              }}
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "" : "Categories"}
            </Button>
            <Button
              startIcon={<Edit />}
              variant="contained"
              disabled={editButtonDisabled}
              sx={{ marginX: 1, color: "white", backgroundColor: "#A64D79" }}
              size={isMobile ? "small" : "medium"}
              onClick={handleEditShop}
            >
              {isMobile ? "" : "Edit"}
            </Button>
          </Toolbar>
          <footer>
            <Box
              display={"flex"}
              justifyContent="space-between"
              alignItems="center"
              marginX={1}
              backgroundColor={getColor()}
            >
              <Typography variant="body2">
                Shopping List version {APP_VERSION}{" "}
                {ENVIRONMENT === "production" ? "" : ENVIRONMENT}
              </Typography>
              <SynchronizationStatusBar
                articlesState={articlesSyncState}
                shoppingCartState={shoppingCartSyncState}
                display={"flex"}
              />
            </Box>
          </footer>
        </AppBar>
      </Box>

      <ConfirmationPopup
        message={"Are you sure you want to remove all shopping cart items?"}
        onConfirm={handleDeleteUnchecked}
        open={deleteAllConfirmationOpen}
        setOpen={setDeleteAllConfirmationOpen}
      />
      <CategoryOrderPopup
        open={categoryOrderWindowOpen}
        setOpen={setCategoryOrderWindowOpen}
        shop={currentShop}
        shoppingCartProcessor={shoppingCartProcessor}
      />
      <AddShopPopup
        open={addShopPopupOpen}
        setOpen={setAddShopPopupOpen}
        shops={shops}
        setShops={setShops}
        setCurrentShop={setCurrentShop}
        editingShop={editingShop}
      />
    </div>
  );
};
