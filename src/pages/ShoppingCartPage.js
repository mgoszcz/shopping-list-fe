import { Container } from "@mui/material";
import ShoppingCartCard from "../components/shoppingCartCard";
import shoppingCart from "../data/shoppingCart.json";
import NewShoppingCartCard from "../components/newShoppingCartCard";

const ShoppingCartPage = () => {
  return (
    <Container maxWidth={"md"} sx={{ minWidth: 300 }}>
      <NewShoppingCartCard />
      {shoppingCart.map((cartItem) => (
        <ShoppingCartCard cartItem={cartItem} />
      ))}
    </Container>
  );
};

export default ShoppingCartPage;
