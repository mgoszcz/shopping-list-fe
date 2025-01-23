import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import "../index.css";

const ShoppingCartCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
        sx={{ height: { xs: 75, sm: 100 } }}
        marginX={5}
        marginY={1}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Typography variant={isMobile ? "h6" : "h4"} component={"h3"}>
            Shopping Item
          </Typography>
          {!isMobile && (
            <Typography variant={"body2"} component={"h4"} marginLeft={2}>
              Category
            </Typography>
          )}
        </Box>
        <Box display={"flex"} marginLeft={"auto"}>
          <Edit fontSize={isMobile ? "small" : "large"} />
          <Delete
            fontSize={isMobile ? "small" : "large"}
            sx={{ marginLeft: 1 }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ShoppingCartCard;
