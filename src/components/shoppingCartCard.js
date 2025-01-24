import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import "../index.css";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

const ShoppingCartCard = ({ cartItem }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const backgroundColor = cartItem.checked ? "#0F0F0F" : "#6A1E55";
  return (
    <Paper
      elevation={3}
      className={"shopping-cart-card"}
      sx={{
        backgroundColor: backgroundColor,
        textDecoration: cartItem.checked ? "line-through" : "none",
      }}
      key={cartItem.id}
      cartitem-id={cartItem.id}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={{ height: { xs: 75, sm: 100 } }}
        marginX={5}
        marginY={1}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          sx={{
            maxWidth: isMobile ? "50%" : "65%",
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h4"}
            component={"h3"}
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              maxWidth: isMobile ? "100%" : "90%",
            }}
          >
            {cartItem.article.name}
          </Typography>
          {!isMobile && (
            <Typography variant={"body2"} component={"h4"} marginLeft={2}>
              {cartItem.category.name}
            </Typography>
          )}
        </Box>

        <Box display={"flex"} marginLeft={"auto"} alignItems={"center"}>
          <TextField
            hiddenLabel
            type="number"
            id="amount-input"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              width: 50,
              marginRight: 1,
            }}
            defaultValue={cartItem.quantity}
          />
          <IconButton>
            <Edit fontSize={isMobile ? "small" : "large"} />
          </IconButton>
          <IconButton aria-label={"delete"}>
            <Delete fontSize={isMobile ? "small" : "large"} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ShoppingCartCard;
