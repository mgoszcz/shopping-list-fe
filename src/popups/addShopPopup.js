import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { createShop } from "../data/api/shopsData";
import logger from "../logger/logger";
import { updateCurrentShop } from "../data/api/currentShopData";

// TODO set red color of error

export default function AddShopPopup({
  open,
  setOpen,
  shops,
  setShops,
  setCurrentShop,
}) {
  const handleClose = () => setOpen(false);

  const [newName, setNewName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);

  useEffect(() => {
    if (open) {
      setErrorMessage(" ");
      setNewName("");
      setIsApplyDisabled(true);
    }
  }, [open]);

  const handleCreate = async () => {
    if (shops.find((shop) => newName === shop.name)) {
      setErrorMessage(`Shop with name "${newName}" already exists`);
      return;
    }
    const result = await sendRequest();
    if (result) {
      handleClose();
    }
  };

  const handleChange = (e) => {
    const name = e.target.value;
    setNewName(name);
    if (shops.find((shop) => name === shop.name)) {
      setErrorMessage(`Shop with name "${name}" already exists`);
      setIsApplyDisabled(true);
      // return;
    } else if (name === "") {
      setErrorMessage(`Shop name cannot be empty`);
      setIsApplyDisabled(true);
    } else {
      setErrorMessage("");
      setIsApplyDisabled(false);
    }
  };

  const sendRequest = async () => {
    try {
      const response = await createShop({ name: newName, logo: "logo" });
      logger.info(`Shop ${newName} created`);
      logger.debug(response);
      const { id, name, logo } = response.data;
      setShops([...shops, { id, name, logo }]);
      await updateCurrentShop(id);
      setCurrentShop({ logo, name, shop_id: id });
      return true;
    } catch (error) {
      logger.error(`Creating shop failed: ${error}`);
      return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-add-shop"
      aria-describedby="modal-add-shop-window"
      fullWidth
    >
      <DialogTitle>Add Shop</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            label={"Shop Name"}
            variant={"outlined"}
            fullWidth
            value={newName}
            sx={{ margin: 1 }}
            onChange={(event) => handleChange(event)}
            inputRef={(input) => input && input.focus()}
          />
          <Box minHeight={20}>
            <Typography variant="body2">{errorMessage}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button variant="contained" color="error" sx={{ margin: 1 }}>
            Remove Shop
          </Button>
          <Box display={"flex"}>
            <Button
              variant={"contained"}
              type={"submit"}
              sx={{ margin: 1, width: 100, backgroundColor: "#A64D79" }}
              onClick={handleCreate}
              disabled={isApplyDisabled}
            >
              Apply
            </Button>
            <Button
              sx={{ margin: 1, width: 100, color: "#A64D79" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
