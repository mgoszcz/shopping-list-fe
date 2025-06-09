import React from "react";
import { useEffect, useState } from "react";
import ShoppingCartPage from "./pages/shoppingCartPage";
import { createTheme, ThemeProvider } from "@mui/material";
import { getTimestampData } from "./data/api/timestampData";
import { TABLE_NAMES } from "./constants/tableNames";
import { getCurrentShop } from "./data/api/currentShopData";
import { ShoppingCartDataProcessor } from "./data/processors/shoppingCartDataProcessor";
import logger from "./logger/logger";
import TopBar from "./components/topBar";
import { BottomBar } from "./components/bottomBar/bottomBar";
import { ShoppingArticlesProcessor } from "./data/processors/shoppingArticlesProcessor";
import { synchState } from "./constants/synchState";
import { ProgressOverlay } from "./components/progressOverlay";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  // Timestamp states
  const [shoppingCartTimestamp, setShoppingCartTimestamp] = useState([]);
  const [currentShopTimestamp, setCurrentShopTimestamp] = useState([]);
  const [articlesTimestamp, setArticlesTimestamp] = useState([]);
  const [shopsTimestamp, setShopsTimestamp] = useState([]);

  // Data states
  const [shoppingCart, setShoppingCart] = useState([]);
  const [currentShop, setCurrentShop] = useState({});
  const [articles, setArticles] = useState([]);

  // Synchronization states
  const [articlesSynchState, setArticlesSyncState] = useState(
    synchState.UNKNOWN
  );
  const [shoppingCartSyncState, setShoppingCartSyncState] = useState(
    synchState.UNKNOWN
  );

  // Other states
  const [articlePopupOpen, setArticlePopupOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState({});
  const [sendingData, setSendingData] = useState(false);

  useEffect(() => {
    const fetchTimestampData = async () =>
      getTimestampData()
        .then((data) => {
          setCurrentShopTimestamp(data[TABLE_NAMES.CURRENT_SHOP]);
          setShoppingCartTimestamp(data[TABLE_NAMES.SHOPPING_CART]);
          setArticlesTimestamp(data[TABLE_NAMES.SHOPPING_ARTICLES]);
          setShopsTimestamp(data[TABLE_NAMES.SHOPS]);
          logger.debug("Fetching Timestamp");
        })
        .catch((error) => logger.error("Failed to get timestamp data", error));
    fetchTimestampData();
    const intervalId = setInterval(fetchTimestampData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    shoppingCartProcessor.getShoppingCartItems();
  }, [shoppingCartTimestamp, currentShop]);

  useEffect(() => {
    articlesProcessor.getShoppingArticlesData();
  }, [articlesTimestamp]);

  useEffect(() => {
    getCurrentShop()
      .then((data) => {
        setCurrentShop(data);
        logger.debug("Fetching CurrentShop");
      })
      .catch((error) => logger.error("Failed to get current shop", error));
  }, [currentShopTimestamp]);

  useEffect(() => {
    if (
      articlesSynchState === synchState.SENDING ||
      shoppingCartSyncState === synchState.SENDING
    ) {
      setSendingData(true);
    } else {
      setSendingData(false);
    }
  });

  const shoppingCartProcessor = new ShoppingCartDataProcessor(
    shoppingCart,
    setShoppingCart,
    shoppingCartSyncState,
    setShoppingCartSyncState
  );

  const articlesProcessor = new ShoppingArticlesProcessor(
    articles,
    setArticles,
    shoppingCartProcessor,
    articlesSynchState,
    setArticlesSyncState
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <TopBar
          articlesTimestamp={articlesTimestamp}
          shoppingCart={shoppingCart}
          shoppingCartProcessor={shoppingCartProcessor}
          articlesProcessor={articlesProcessor}
          setArticlePopupOpen={setArticlePopupOpen}
          setEditingArticle={setEditingArticle}
        />
        <ShoppingCartPage
          shoppingCartProcessor={shoppingCartProcessor}
          shoppingCart={shoppingCart}
          setArticlePopupOpen={setArticlePopupOpen}
          articlePopupOpen={articlePopupOpen}
          editingArticle={editingArticle}
          setEditingArticle={setEditingArticle}
          articlesProcessor={articlesProcessor}
        />
        <BottomBar
          currentShop={currentShop}
          setCurrentShop={setCurrentShop}
          shopsTimestamp={shopsTimestamp}
          shoppingCartProcessor={shoppingCartProcessor}
          shoppingCartSyncState={shoppingCartSyncState}
          articlesSyncState={articlesSynchState}
        />
        <ProgressOverlay loading={sendingData} />
      </div>
    </ThemeProvider>
  );
}

export default App;
