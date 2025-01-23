import { Box, Paper, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import "../index.css";

const ShoppingCartCard = () => {
  return (
    <Paper
      elevation={3}
      className={"shopping-cart-card"}
      sx={{
        backgroundColor: "#6A1E55",
      }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={{ height: 100 }}
        marginX={5}
        marginY={1}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Typography variant={"h4"} component={"h3"}>
            Shopping Item
          </Typography>
          <Typography variant={"body2"} component={"h4"} marginLeft={2}>
            Category
          </Typography>
        </Box>
        <Box display={"flex"} marginLeft={"auto"}>
          <Edit fontSize={"large"} />
          <Delete fontSize={"large"} />
        </Box>
      </Box>
    </Paper>
  );
};

export default ShoppingCartCard;
