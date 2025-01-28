import { Container } from "@mui/material";
import ShoppingCartCard from "../components/shoppingCartCard";

const ShoppingCartPage = ({ shoppingCart, shoppingCartProcessor }) => {
  return (
    <Container maxWidth={"md"} sx={{ minWidth: 300 }}>
      {shoppingCart.map((cartItem) => (
        <ShoppingCartCard
          cartItem={cartItem}
          key={cartItem.id}
          shoppingCartProcessor={shoppingCartProcessor}
        />
      ))}
    </Container>
  );
};

export default ShoppingCartPage;
