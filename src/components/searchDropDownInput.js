import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { synchState } from "../constants/synchState";

const removeDiacritics = require("diacritics").remove;

const isArticleInCart = (article, shoppingCart) => {
  return shoppingCart.some(
    (item) =>
      item.article.name === article.name &&
      item.category.name === article.category.name
  );
};

export default function SearchDropDownInput({
  inputValue,
  setInputValue,
  setSearchItem,
  shoppingCart,
  setAddButtonDisabled,
  articlesProcessor,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownSelection, setDropdownSelection] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (articlesProcessor.synchronizationState === synchState.FETCHING) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  });

  useEffect(() => {
    setDropdownSelection(null);
  }, [inputValue]);

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
    const existingArticle = articlesProcessor.state.find(
      (article) =>
        removeDiacritics(article.name.toLowerCase()) ===
        removeDiacritics(newValue.toLowerCase())
    );
    if (existingArticle) {
      if (
        shoppingCart.some(
          (item) =>
            item.article.name === existingArticle.name &&
            item.category.name === existingArticle.category.name
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
      value={dropdownSelection}
      filterOptions={(options, { inputValue }) => {
        const normalizedInput = removeDiacritics(inputValue.toLowerCase());
        return options.filter((option) =>
          removeDiacritics(option.name.toLowerCase()).includes(normalizedInput)
        );
      }}
      inputValue={inputValue}
      getOptionDisabled={(option) => isArticleInCart(option, shoppingCart)}
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
      options={articlesProcessor.state.sort((a, b) => {
        if (
          isArticleInCart(a, shoppingCart) &&
          !isArticleInCart(b, shoppingCart)
        ) {
          return 1;
        } else if (
          !isArticleInCart(a, shoppingCart) &&
          isArticleInCart(b, shoppingCart)
        ) {
          return -1;
        } else {
          return 0;
        }
      })}
      loading={loading}
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
