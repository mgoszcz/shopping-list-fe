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
import {
  getCategoryOrderData,
  setCategoryOrderData,
} from "../data/api/categoryOrderData";
import { getCategoriesData } from "../data/api/categoriesData";
import { CategorySelector } from "../components/categorySelector";
import { Add, PlaylistAddRounded } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import CategoryOrderListDnd from "../components/categoryOrderListDnd";
import { isObjectEmpty } from "../utils/isObjectEmpty";

export default function CategoryOrderPopup({
  open,
  setOpen,
  shop,
  shoppingCartProcessor,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => setOpen(false);

  const [isApplyDisabled, setIsApplyDisabled] = React.useState(true);
  const [isAddCategoryDisabled, setIsAddCategoryDisabled] =
    React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [categoryOrder, setCategoryOrder] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [unusedCategories, setUnusedCategories] = React.useState([]);
  const [categoryToAdd, setCategoryToAdd] = React.useState({});
  const [currentOrderList, setCurrentOrderList] = React.useState([]);

  useEffect(() => {
    if (!open) return;
    setIsApplyDisabled(true);
    setLoading(true);
    (async () => {
      const orderData = await getCategoryOrderData(shop.shop_id);
      setCategoryOrder(orderData);
      setLoading(false);
    })();
  }, [open]);

  useEffect(() => {
    const itemsList = [...categoryOrder];
    itemsList.sort((a, b) => a.category_order - b.category_order);
    setCurrentOrderList(
      itemsList.map((item) => {
        return { title: item.category.name, id: item.category.id };
      })
    );
  }, [categoryOrder]);

  useEffect(() => {
    const remainingCategories = categories.filter(
      (item) =>
        !currentOrderList.find((orderItem) => orderItem.title === item.name)
    );
    setUnusedCategories(remainingCategories);
  }, [categories, currentOrderList]);

  useEffect(() => {
    if (isObjectEmpty(categoryToAdd)) {
      setIsAddCategoryDisabled(true);
    } else {
      setIsAddCategoryDisabled(false);
    }
  }, [categoryToAdd]);

  const handleAddButtonClick = () => {
    setCurrentOrderList([
      {
        title: categoryToAdd.name,
        id: categoryToAdd.id,
      },
      ...currentOrderList,
    ]);
    setIsApplyDisabled(false);
    setCategoryToAdd({});
  };

  const handleApply = () => {
    const newOrder = [];
    for (const [index, item] of currentOrderList.entries()) {
      newOrder.push({
        category: { id: item.id, name: item.title },
        category_order: index + 1,
      });
    }
    setCategoryOrderData(shop.shop_id, newOrder)
      .then(() => {
        setCategoryOrder(newOrder);
        shoppingCartProcessor.getShoppingCartItems();
      })
      .catch((error) =>
        console.error(`Failed to set category order: ${error}`)
      );
    handleClose();
  };

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
              disabled={isAddCategoryDisabled}
            >
              <PlaylistAddRounded fontSize={"inherit"} />
            </IconButton>
          </Box>
          <CategoryOrderListDnd
            orderList={currentOrderList}
            setOrderList={setCurrentOrderList}
            setApplyDisabled={setIsApplyDisabled}
          />
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </Dialog>
    </div>
  );
}
