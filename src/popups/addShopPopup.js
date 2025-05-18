import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { createShop, deleteShop, updateShop } from "../data/api/shopsData";
import logger from "../logger/logger";
import { updateCurrentShop } from "../data/api/currentShopData";

export default function AddShopPopup({
  open,
  setOpen,
  shops,
  setShops,
  setCurrentShop,
  editingShop,
}) {
  const handleClose = () => setOpen(false);

  const [newName, setNewName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const deleteButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      setErrorMessage("");
      setNewName("");
      setIsApplyDisabled(true);
      if (editingShop) {
        setNewName(editingShop.name);
      }
    }
  }, [open]);

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleApply = async () => {
    if (editingShop) {
      await handleEditShop();
    } else {
      await handleCreateShop();
    }
  };

  const handleCreateShop = async () => {
    if (shops.find((shop) => newName === shop.name)) {
      setErrorMessage(`Shop with name "${newName}" already exists`);
      return;
    }
    const result = await sendCreateRequest();
    if (result) {
      handleClose();
    }
  };

  const handleEditShop = async () => {
    if (
      newName !== editingShop.name &&
      shops.find((shop) => newName === shop.name)
    ) {
      setErrorMessage(`Shop with name "${newName}" already exists`);
      return;
    }
    const result = await sendUpdateRequest();
    if (result) {
      handleClose();
    }
  };

  const handleDeleteShop = async () => {
    if (!editingShop) {
      throw new Error(
        "Bad Operation, cannot remove shop when dialog not in editing mode"
      );
    }
    handleCloseConfirmation();
    const result = await sendDeleteRequest();
    if (result) {
      handleClose();
    } else {
      logger.error("Removing shop failed");
    }
  };

  const handleChange = (e) => {
    const name = e.target.value;
    setNewName(name);
    if (shops.find((shop) => name === shop.name)) {
      if (!editingShop || name !== editingShop.name) {
        setErrorMessage(`Shop with name "${name}" already exists`);
      }
      setIsApplyDisabled(true);
    } else if (name === "") {
      setErrorMessage(`Shop name cannot be empty`);
      setIsApplyDisabled(true);
    } else {
      setErrorMessage("");
      setIsApplyDisabled(false);
    }
  };

  const sendCreateRequest = async () => {
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

  const sendDeleteRequest = async () => {
    try {
      const response = await deleteShop(editingShop.id);
      logger.info(`Shop ${newName} deleted`);
      logger.debug(response);
      setShops(shops.filter((shop) => shop.id !== editingShop.id));
      setCurrentShop({ logo: null, name: null, shop_id: null });
      return true;
    } catch (error) {
      logger.error(`Removing shop failed: ${error}`);
      return false;
    }
  };

  const sendUpdateRequest = async () => {
    try {
      const response = await updateShop(editingShop.id, {
        name: newName,
        logo: "logo",
      });
      logger.info(`Shop ${editingShop.name} updated to ${newName}`);
      logger.debug(response);
      setShops(
        shops.map((shop) =>
          shop.id === editingShop.id
            ? { id: editingShop.id, name: newName, logo: editingShop.logo }
            : shop
        )
      );
      await updateCurrentShop(editingShop.id);
      setCurrentShop({
        shop_id: editingShop.id,
        name: newName,
        logo: editingShop.logo,
      });
      return true;
    } catch (error) {
      logger.error(`Updating shop failed: ${error}`);
      return false;
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-add-shop"
        aria-describedby="modal-add-shop-window"
        fullWidth
        ref={dialogRef}
      >
        <DialogTitle>
          {editingShop ? `Edit Shop ${editingShop.name}` : "Add Shop"}
        </DialogTitle>
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
            <Button
              variant="contained"
              color="error"
              sx={{ margin: 1, opacity: editingShop ? 100 : 0 }}
              disabled={!editingShop}
              onClick={() => setOpenConfirmation((prev) => !prev)}
              ref={deleteButtonRef}
            >
              Remove Shop
            </Button>

            <Box display={"flex"}>
              <Button
                variant={"contained"}
                type={"submit"}
                sx={{ margin: 1, width: 100, backgroundColor: "#A64D79" }}
                onClick={handleApply}
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
      <Popper
        open={openConfirmation}
        anchorEl={deleteButtonRef.current}
        placement={"top"}
        container={dialogRef.current}
        disablePortal={false}
      >
        <Paper
          sx={{
            padding: 2,
            backgroundColor: "black",
            boxShadow: 3,
            zIndex: 1301,
          }}
        >
          <Typography>
            Are you sure you want to delete shop{" "}
            {editingShop && editingShop.name}? It cannot be undone.
          </Typography>
          <Box display="flex" justifyContent="space-between" marginTop={1}>
            <Button
              onClick={handleDeleteShop}
              variant={"contained"}
              sx={{ backgroundColor: "#A64D79" }}
            >
              Yes
            </Button>
            <Button onClick={handleCloseConfirmation} sx={{ color: "#A64D79" }}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Popper>
    </div>
  );
}
