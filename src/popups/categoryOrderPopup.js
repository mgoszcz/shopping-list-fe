import React, { useEffect } from "react";
import { ProgressOverlay } from "../components/progressOverlay";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { getCategoryOrderData } from "../data/api/categoryOrderData";
import { getCategoriesData } from "../data/api/categoriesData";
import { CategorySelector } from "../components/categorySelector";
import { Add, PlaylistAddRounded } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import CategoryOrderListDnd from "../components/categoryOrderListDnd";

export default function CategoryOrderPopup({ open, setOpen, shop }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => setOpen(false);

  const handleUpdate = () => {};
  const [isApplyDisabled, setIsApplyDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [categoryOrder, setCategoryOrder] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [unusedCategories, setUnusedCategories] = React.useState([]);
  const [categoryToAdd, setCategoryToAdd] = React.useState([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (async () => {
      const orderData = await getCategoryOrderData(shop.shop_id);
      setCategoryOrder(orderData);
      setLoading(false);
    })();
  }, [open]);

  useEffect(() => {
    console.log(categories);
    const remainingCategories = categories.filter(
      (item) =>
        !categoryOrder.find(
          (orderItem) => orderItem.category.name === item.name
        )
    );
    console.log(remainingCategories);
    setUnusedCategories(remainingCategories);
  }, [categories, categoryOrder]);

  const handleAddButtonClick = () => {};

  return (
    <div>
      <ProgressOverlay loading={loading} className="progress-overlay" />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-category-order"
        aria-describedby="modal-category-order-window"
        fullWidth
        PaperProps={{ sx: { minWidth: "90%", maxWidth: "50vw" } }}
      >
        <DialogTitle>Set Category Order for shop {shop.name}</DialogTitle>
        <DialogContent>
          <Box display={"flex"} alignItems={"center"}>
            <CategorySelector
              categories={unusedCategories}
              setCategories={setCategories}
              selectedCategory={categoryToAdd}
              setSelectedCategory={setCategoryToAdd}
              freeSoloEnabled={false}
            />
            <IconButton
              sx={{
                backgroundColor: "#A64D79",
                "&.Mui-disabled": {
                  backgroundColor: "#A64D79",
                  opacity: 0.4,
                },
              }}
              size={isMobile ? "medium" : "large"}
              onClick={handleAddButtonClick}
              disabled={false}
            >
              <PlaylistAddRounded fontSize={"inherit"} />
            </IconButton>
          </Box>
          <CategoryOrderListDnd orderList={categoryOrder} />
        </DialogContent>
        <DialogActions>
          <Box display={"flex"}>
            <Button
              variant={"contained"}
              type={"submit"}
              sx={{ margin: 1, width: 100, backgroundColor: "#A64D79" }}
              onClick={handleUpdate}
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
    </div>
  );
}
