import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SearchDropDownInput() {
  return (
    <Autocomplete
      sx={{ minWidth: 300, marginX: "auto" }}
      freeSolo
      fullWidth
      id="search-article"
      disableClearable
      options={articles.map((option) => option.name)}
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
          label="Search input"
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

const articles = [
  { name: "article1", category: "category1" },
  { name: "article2", category: "category2" },
  { name: "article3", category: "category3" },
  { name: "article4", category: "category4" },
  { name: "article5", category: "category5" },
];
