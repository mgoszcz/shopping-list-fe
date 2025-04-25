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
import { useEffect, useState } from "react";

// TODO set size of dialog, to be not resized when adding error
// TODO set red color of error
// TODO clear text field when opening dialog

export default function AddShopPopup({ open, setOpen, shops, setShops }) {
  const handleClose = () => setOpen(false);

  const [newName, setNewName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);

  useEffect(() => {
    if (newName === "") {
      setIsApplyDisabled(true);
    } else {
      setIsApplyDisabled(false);
    }
  }, [newName]);

  const handleCreate = () => {
    if (shops.find((shop) => newName === shop.name)) {
      setErrorMessage(`Shop with name "${newName}" already exists`);
      return;
    }
    console.log("Add shop");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-add-shop"
      aria-describedby="modal-add-shop-window"
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
            onChange={(event) => setNewName(event.target.value)}
          ></TextField>
          <Typography>{errorMessage}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  );
}
