import "./App.css";
import { useEffect, useState } from "react";
import ShoppingCartPage from "./pages/shoppingCartPage";
import { getShoppingCartData } from "./data/api/shoppingCartData";
import { createTheme, ThemeProvider } from "@mui/material";
import { getTimestampData } from "./data/api/timestampData";
import { TABLE_NAMES } from "./constants/tableNames";
import { getCurrentShop } from "./data/api/currentShopData";
import { ShoppingCartDataProcessor } from "./data/processors/shoppingCartDataProcessor";
import logger from "./logger/logger";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [shoppingCartTimestamp, setShoppingCartTimestamp] = useState([]);
  const [currentShopTimestamp, setCurrentShopTimestamp] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [currentShop, setCurrentShop] = useState({});

  useEffect(() => {
    const fetchTimestampData = async () =>
      getTimestampData()
        .then((data) => {
          setCurrentShopTimestamp(data[TABLE_NAMES.CURRENT_SHOP]);
          setShoppingCartTimestamp(data[TABLE_NAMES.SHOPPING_CART]);
          logger.debug("Fetching Timestamp");
        })
        .catch((error) => logger.error("Failed to get timestamp data", error));
    fetchTimestampData();
    const intervalId = setInterval(fetchTimestampData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getShoppingCartData()
      .then((data) => {
        setShoppingCart(data);
        logger.debug("Fetching ShoppingCart");
      })
      .catch((error) =>
        logger.error("Failed to get shopping cart data", error),
      );
  }, [shoppingCartTimestamp, currentShop]);

  useEffect(() => {
    getCurrentShop()
      .then((data) => {
        setCurrentShop(data);
        logger.debug("Fetching CurrentShop");
      })
      .catch((error) => logger.error("Failed to get current shop", error));
  }, [currentShopTimestamp]);

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
