import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { createCategory, getCategoriesData } from "../data/api/categoriesData";
import { Delete } from "@mui/icons-material";
import logger from "../logger/logger";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Popper,
} from "@mui/material";
import { CategorySelector } from "../components/categorySelector";

export default function ArticlePopup({
  open,
  setOpen,
  article,
  articlesProcessor,
}) {
  const handleClose = () => setOpen(false);
  const [categories, setCategories] = React.useState([]);

  const [articleName, setArticleName] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState({});
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const deleteButtonRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const [originalArticleName, setOriginalArticleName] = React.useState("");
  const [isApplyDisabled, setIsApplyDisabled] = React.useState(true);

  useEffect(() => {
    setArticleName("");
    setSelectedCategory({});
    if (article.id === undefined) return;
    if (article.id === 0) {
      setArticleName(article.name);
      setSelectedCategory({});
      setIsApplyDisabled(true);
      return;
    }
    (async () => {
      const fetchedArticle = await articlesProcessor.getArticleById(article.id);
      const fetchedCategories = await getCategoriesData();
      setCategories(fetchedCategories);
      setArticleName(fetchedArticle.name);
      setOriginalArticleName(fetchedArticle.name);
      setSelectedCategory(fetchedArticle.category);
    })();
  }, [article]);

  useEffect(() => {
    if (
      articleName === "" ||
      !selectedCategory ||
      Object.keys(selectedCategory).length === 0
    ) {
      setIsApplyDisabled(true);
    } else {
      setIsApplyDisabled(false);
    }
  }, [articleName, selectedCategory]);

  const handleEdit = async () => {
    let category;
    if (!selectedCategory.id) {
      const resp = await createCategory({ name: selectedCategory.name });
      category = resp.data;
    } else {
      category = selectedCategory;
    }
    const newArticle = {
      id: article.id,
      name: articleName,
      category: category,
    };
    articlesProcessor
      .editArticle(article, newArticle)
      .then(() => {
        handleClose();
        logger.debug("Update article request accepted");
      })
      .catch((error) => {
        logger.error("Failed to update article: ", error);
      });
  };

  const handleDelete = async () => {
    articlesProcessor
      .removeArticle(article)
      .then(() => {
        handleCloseConfirmation();
        handleClose();
        logger.debug("Delete article request accepted");
      })
      .catch((error) => {
        logger.error("Failed to delete article: ", error);
      });
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleToggleConfirmation = () => {
    setOpenConfirmation((prev) => !prev);
  };

  const handleCreate = async () => {
    let category;
    if (!selectedCategory.id) {
      const resp = await createCategory({ name: selectedCategory.name });
      category = resp.data;
    } else {
      category = selectedCategory;
    }
    const newArticle = {
      name: articleName,
      category: category,
    };
    articlesProcessor
      .createArticle(newArticle, true)
      .then(() => {
        handleClose();
        logger.debug("Create article request accepted");
      })
      .catch((error) => {
        logger.error("Failed to create article: ", error);
      });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-article"
        aria-describedby="modal-article-window"
        data-articleid={article.id}
        ref={dialogRef}
        disableAutoFocus
        fullWidth
        PaperProps={{ sx: { minWidth: 300, maxWidth: "50vw" } }}
      >
        <DialogTitle>
          {article.id !== 0 ? "Edit article" : "Add article"}
        </DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              label={"Article Name"}
              variant={"outlined"}
              fullWidth
              value={articleName}
              sx={{ margin: 1 }}
              onChange={(event) => setArticleName(event.target.value)}
            ></TextField>
            <CategorySelector
              categories={categories}
              setCategories={setCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </Box>
          <Box>
            <Button
              startIcon={<Delete />}
              variant="contained"
              color="error"
              disabled={article.id === 0}
              sx={{ margin: 1 }}
              onClick={handleToggleConfirmation}
              ref={deleteButtonRef}
            >
              Remove article
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box display={"flex"}>
            <Button
              variant={"contained"}
              type={"submit"}
              sx={{ margin: 1, width: 100, backgroundColor: "#A64D79" }}
              onClick={article.id !== 0 ? handleEdit : handleCreate}
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
            Are you sure you want to delete article {originalArticleName}? It
            cannot be undone.
          </Typography>
          <Box display="flex" justifyContent="space-between" marginTop={1}>
            <Button
              onClick={handleDelete}
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
