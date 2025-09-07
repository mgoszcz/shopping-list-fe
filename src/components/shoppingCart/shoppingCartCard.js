import {
  Box,
  CardActionArea,
  ClickAwayListener,
  Input,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Delete, Edit, Report, SwapVert } from "@mui/icons-material";
import "../../index.css";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";

const ShoppingCartCard = ({
  cartItem,
  shoppingCartProcessor,
  setArticlePopupOpen,
  setEditingArticle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const backgroundColor = cartItem.checked ? "#0F0F0F" : "#6A1E55";

  const [isSorted, setIsSorted] = useState(true);
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    setIsSorted(cartItem.sorted);
  }, [cartItem]);

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
        sx={{
          height: { xs: 75, sm: 100 },
          border: isSorted ? 0 : 5,
          borderStyle: "dashed",
          borderColor: "#BE1E55",
          borderRadius: "5px",
        }}
        marginY={1}
      >
        <CardActionArea
          onClick={() => shoppingCartProcessor.toggleChecked(cartItem)}
          sx={{ maxWidth: isMobile ? (isSorted ? "58%" : "55%") : "70%" }}
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
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={
                  <>
                    Category is not ordered in current shop. To order go to the
                    bottom bar and click on button{" "}
                    <SwapVert fontSize={"small"} />
                  </>
                }
                slotProps={{
                  popper: {
                    disablePortal: true,
                  },
                }}
              >
                <IconButton disabled={isSorted} onClick={handleTooltipOpen}>
                  <Report sx={{ opacity: isSorted ? 0 : 100, fill: "red" }} />
                </IconButton>
              </Tooltip>
            </div>
          </ClickAwayListener>
          <Input
            type="number"
            id="amount-input"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              width: 25,
              marginRight: 1,
              marginLeft: 1,
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
