import { Box, Button, Paper, useMediaQuery, useTheme } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Clear, Done } from "@mui/icons-material";
import * as React from "react";
import CategoryPopup from "../categoryPopup";
import IconButton from "@mui/material/IconButton";

const NewShoppingCartCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Paper
      elevation={3}
      className={"new-shopping-cart-card"}
      sx={{
        backgroundColor: "#5C5470",
      }}
      key="new-item"
      cartitem-id="new-item"
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={{ height: { xs: 75, sm: 100 } }}
        marginX={1}
        marginY={1}
      >
        <Box display={"flex"} alignItems={"center"} sx={{ width: "90%" }}>
          <TextField
            label={"Article Name"}
            id="new-item-article-name"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              marginRight: 1,
              width: "70%",
            }}
          />
          <Button
            id="new-item-category"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              marginRight: 1,
              height: isMobile ? 40 : 55,
            }}
            onClick={handleOpen}
          >
            Category
          </Button>
        </Box>
        <Box display={"flex"} marginLeft={"auto"} alignItems={"center"}>
          <IconButton>
            <Done fontSize={isMobile ? "small" : "large"} />
          </IconButton>
          <IconButton>
            <Clear fontSize={isMobile ? "small" : "large"} />
          </IconButton>
        </Box>
      </Box>
      <CategoryPopup open={open} onClose={handleClose} />
    </Paper>
  );
};

export default NewShoppingCartCard;
