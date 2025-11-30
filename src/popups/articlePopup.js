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
import { ProgressOverlay } from "../components/progressOverlay";

export default function ArticlePopup({
  open,
  setOpen,
  article,
  articlesProcessor,
  _selectedCategoryOverride,
}) {
  const handleClose = () => setOpen(false);
  const [categories, setCategories] = React.useState([]);

  const [articleName, setArticleName] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(
    _selectedCategoryOverride ?? {}
  );
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const deleteButtonRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const [originalArticleName, setOriginalArticleName] = React.useState("");
  const [originalCategory, setOriginalCategory] = React.useState({});
  const [isApplyDisabled, setIsApplyDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  useEffect(() => {
    setArticleName("");
    setSelectedCategory(_selectedCategoryOverride ?? {});
    if (article.id === undefined) return;
    if (article.id === 0) {
      setArticleName(article.name);
      setSelectedCategory(_selectedCategoryOverride ?? {});
      setIsApplyDisabled(true);
      return;
    }
    (async () => {
      setLoading(true);
      const fetchedArticle = await articlesProcessor.getArticleById(article.id);
      const fetchedCategories = await getCategoriesData();
      setCategories(fetchedCategories);
      setArticleName(fetchedArticle.name);
      setOriginalArticleName(fetchedArticle.name);
      setOriginalCategory(fetchedArticle.category);
      setSelectedCategory(_selectedCategoryOverride ?? fetchedArticle.category);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  useEffect(() => {
    if (
      articleName === "" ||
      !selectedCategory ||
      Object.keys(selectedCategory).length === 0
    ) {
      setIsApplyDisabled(true);
      setErrorMessage("");
    } else if (doesArticleExist()) {
      setIsApplyDisabled(true);
      if (!isTheSameAsEditingArticle()) {
        setErrorMessage("This article already exists");
      }
    } else {
      setIsApplyDisabled(false);
      setErrorMessage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleName, selectedCategory]);

  const doesArticleExist = () => {
    for (const article of articlesProcessor.state) {
      if (
        article.name === articleName &&
        article.category.name === selectedCategory.name
      ) {
        return true;
      }
    }

    return false;
  };

  const isTheSameAsEditingArticle = () => {
    if (article.id === 0) return false;
    if (
      originalArticleName === articleName &&
      originalCategory.name === selectedCategory.name
    )
      return true;
    return false;
  };

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
    try {
      await articlesProcessor.editArticle(article, newArticle);
      handleClose();
      logger.debug("Update article request accepted");
    } catch (error) {
      logger.error("Failed to update article: ", error);
    }
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
    try {
      await articlesProcessor.createArticle(newArticle, true);
      handleClose();
      logger.debug("Create article request accepted");
    } catch (error) {
      logger.error("Failed to create article: ", error);
    }
  };

  return (
    <div>
      <ProgressOverlay loading={loading} className="progress-overlay" />
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
        <DialogTitle data-testid="add-edit-article-dialog-title">
          {article.id !== 0
            ? `Edit article ${originalArticleName} category ${originalCategory.name}`
            : "Add article"}
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
              setSelectedCategory={
                _selectedCategoryOverride
                  ? () => setSelectedCategory(_selectedCategoryOverride)
                  : setSelectedCategory
              }
              freeSoloEnabled={true}
            />
            <Typography variant="subtitle1" data-testid="article-dialog-error">
              {errorMessage}
            </Typography>
          </Box>
          <Box>
            <Button
              startIcon={<Delete />}
              variant="contained"
              color="error"
              disabled={article.id === 0}
              sx={{ margin: 1, opacity: article.id !== 0 ? 100 : 0 }}
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
              data-testid="confirm-remove-article"
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
