import React, { forwardRef } from "react";
import {
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

export const CategoryOrderListItem = forwardRef(({ item, ...props }, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <ListItem {...props} ref={ref}>
        <ListItemText>{item.title}</ListItemText>
        <IconButton aria-label={"delete"}>
          <Delete fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </ListItem>
      <Divider />
    </>
  );
});

export default CategoryOrderListItem;
