import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export const ConfirmationPopup = ({ message, onConfirm, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button
          onClick={onConfirm}
          variant={"contained"}
          sx={{ backgroundColor: "#A64D79" }}
        >
          Yes
        </Button>
        <Button onClick={handleClose} sx={{ color: "#A64D79" }}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};
