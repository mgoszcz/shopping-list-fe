import { Container } from "@mui/material";
import ShoppingCartCard from "../components/shoppingCartCard";

const ShoppingCartPage = () => {
  return (
    <Container maxWidth={"md"} sx={{ minWidth: 600 }}>
      <h1>Shopping Cart Page</h1>
      <ShoppingCartCard />
      <ShoppingCartCard />
      <ShoppingCartCard />
      <ShoppingCartCard />
      <ShoppingCartCard />
      <ShoppingCartCard />
    </Container>
  );
};

export default ShoppingCartPage;
