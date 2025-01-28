import "./App.css";
import { useEffect, useState } from "react";
import ShoppingCartPage from "./pages/shoppingCartPage";
import { getShoppingCartData } from "./data/api/shoppingCartData";
import { createTheme, ThemeProvider } from "@mui/material";
import { getTimestampData } from "./data/api/timestampData";
import { TABLE_NAMES } from "./constants/tableNames";
import { getCurrentShop } from "./data/api/currentShopData";
import { ShoppingCartDataProcessor } from "./data/processors/shoppingCartDataProcessor";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [timestampData, setTimestampData] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [currentShop, setCurrentShop] = useState({});

  useEffect(() => {
    const fetchTimestampData = async () =>
      getTimestampData()
        .then((data) => {
          setTimestampData(data);
          console.log("fetching timestamp");
        })
        .catch((error) => console.error("Failed to get timestamp data", error));
    fetchTimestampData();
    const intervalId = setInterval(fetchTimestampData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getShoppingCartData()
      .then((data) => {
        setShoppingCart(data);
        console.log("fetching shoppingcart");
      })
      .catch((error) =>
        console.error("Failed to get shopping cart data", error),
      );
  }, [timestampData[TABLE_NAMES.SHOPPING_CART], currentShop]);

  useEffect(() => {
    getCurrentShop()
      .then((data) => {
        setCurrentShop(data);
        console.log("fetching currentShop");
      })
      .catch((error) => console.error("Failed to get current shop", error));
  }, [timestampData[TABLE_NAMES.CURRENT_SHOP]]);

  const shoppingCartProcessor = new ShoppingCartDataProcessor(
    shoppingCart,
    setShoppingCart,
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <ShoppingCartPage
          shoppingCartProcessor={shoppingCartProcessor}
          shoppingCart={shoppingCart}
        />
        {currentShop.name}
      </div>
    </ThemeProvider>
  );
}

export default App;
