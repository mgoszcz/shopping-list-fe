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

// TODO set red color of error

export default function AddShopPopup({ open, setOpen, shops, setShops }) {
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

  const handleCreate = () => {
    if (shops.find((shop) => newName === shop.name)) {
      setErrorMessage(`Shop with name "${newName}" already exists`);
      return;
    }
    console.log("Add shop");
    handleClose();
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
