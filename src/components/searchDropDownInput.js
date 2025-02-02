import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import { getArticles } from "../data/api/articlesData";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

export default function SearchDropDownInput({
  articlesTimestamp,
  inputValue,
  setInputValue,
  setSearchItem,
  shoppingCart,
  setAddButtonDisabled,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [articles, setArticles] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  useEffect(() => {
    if (articlesTimestamp) {
      setNeedsUpdate(true);
    }
  }, [articlesTimestamp]);

  const handleOpen = () => {
    setOpen(true);
    if (!needsUpdate) {
      return;
    }
    setArticles([]);
    (async () => {
      setLoading(true);
      const fetchedArticles = await getArticles();
      setLoading(false);
      setArticles(fetchedArticles);
      setNeedsUpdate(false);
    })();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleType = (event, newValue) => {
    setInputValue(newValue);
    if (!newValue) {
      setAddButtonDisabled(true);
    } else {
      setAddButtonDisabled(false);
    }
    const existingArticle = articles.find(
      (article) => article.name.toLowerCase() === newValue.toLowerCase(),
    );
    if (existingArticle) {
      if (
        shoppingCart.some(
          (item) =>
            item.article.name === existingArticle.name &&
            item.category.name === existingArticle.category.name,
        )
      ) {
        setAddButtonDisabled(true);
      }
      setSearchItem({ id: existingArticle.id, name: "" });
    } else {
      setSearchItem({ id: null, name: newValue });
    }
  };
  const handleSelect = (event, newValue) => {
    const articleId = parseInt(newValue.id);
    setSearchItem({ id: articleId, name: "" });
    setInputValue(newValue.name);
  };

  return (
    <Autocomplete
      sx={{ minWidth: 200, maxWidth: "90%", marginX: "auto" }}
      size={isMobile ? "medium" : "large"}
      freeSolo
      fullWidth
      onOpen={handleOpen}
      onClose={handleClose}
      open={open}
      id="search-article"
      disableClearable
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      inputValue={inputValue}
      getOptionDisabled={(option) => {
        return shoppingCart.some(
          (item) =>
            item.article.name === option.name &&
            item.category.name === option.category.name,
        );
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.id} data-id={option.id}>
          <Box>
            <Typography variant={"body1"} component={"h5"}>
              {option.name}
            </Typography>
            <Typography variant={"body2"} component={"h6"}>
              {option.category.name}
            </Typography>
          </Box>
        </li>
      )}
      onChange={(event, inputValue) => handleSelect(event, inputValue)}
      onInputChange={(event, newInputValue) => handleType(event, newInputValue)}
      options={articles}
      loading={loading}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#1A1A1D",
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Article"
          size={isMobile ? "medium" : "large"}
          slotProps={{
            input: {
              ...params.InputProps,
              type: "search",
            },
          }}
        />
      )}
    />
  );
}
