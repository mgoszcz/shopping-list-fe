import {
  Box,
  CardActionArea,
  Input,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import "../index.css";
import IconButton from "@mui/material/IconButton";

const ShoppingCartCard = ({
  cartItem,
  shoppingCartProcessor,
  setArticlePopupOpen,
  setEditingArticle,
}) => {
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
      cartitem-id={cartItem.id}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={{ height: { xs: 75, sm: 100 } }}
        marginY={1}
      >
        <CardActionArea
          onClick={() => shoppingCartProcessor.toggleChecked(cartItem)}
          sx={{ maxWidth: isMobile ? "65%" : "70%" }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            sx={{
              height: { xs: 75, sm: 100 },
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h4"}
              component={"h3"}
              marginX={5}
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
        </CardActionArea>

        <Box display={"flex"} marginLeft={"auto"} alignItems={"center"}>
          <Input
            type="number"
            id="amount-input"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              width: 25,
              marginRight: 1,
            }}
            value={cartItem.quantity}
            onChange={(e) =>
              shoppingCartProcessor.changeQuantity(cartItem, e.target.value)
            }
          />
          <IconButton
            aria-label={"edit"}
            onClick={() => {
              setArticlePopupOpen(true);
              setEditingArticle({ id: cartItem.article.id });
            }}
          >
            <Edit fontSize={isMobile ? "small" : "large"} />
          </IconButton>
          <IconButton
            aria-label={"delete"}
            onClick={() => shoppingCartProcessor.deleteCartItem(cartItem)}
          >
            <Delete fontSize={isMobile ? "small" : "large"} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ShoppingCartCard;
