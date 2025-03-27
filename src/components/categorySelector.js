import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import * as React from "react";
import { getCategoriesData } from "../data/api/categoriesData";

export const CategorySelector = ({
  categories,
  setCategories,
  selectedCategory,
  setSelectedCategory,
  freeSoloEnabled,
}) => {
  const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleOpenAutocomplete = () => {
    setOpenAutocomplete(true);
    (async () => {
      setLoading(true);
      const fetchedCategories = await getCategoriesData();
      setLoading(false);
      setCategories(fetchedCategories);
    })();
  };

  const handleCloseAutocomplete = () => {
    setOpenAutocomplete(false);
  };

  return (
    <Autocomplete
      id="category-select"
      fullWidth
      freeSolo={freeSoloEnabled}
      onOpen={handleOpenAutocomplete}
      onClose={handleCloseAutocomplete}
      loading={loading}
      open={openAutocomplete}
      options={categories}
      getOptionLabel={(option) => (option.name ? option.name : "")}
      sx={{ margin: 1 }}
      value={selectedCategory}
      onChange={(event, newValue) => {
        setSelectedCategory(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        if (newInputValue === "") {
          setSelectedCategory({});
          return;
        }
        const newCategory = categories.find(
          (category) => category.name === newInputValue
        );
        if (newCategory) {
          setSelectedCategory(newCategory);
        } else {
          setSelectedCategory({ name: newInputValue });
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label="Category" variant="outlined" />
      )}
    />
  );
};
