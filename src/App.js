import "./App.css";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import TopBarPage from "./pages/TopBarPage";
import { BottomBarPage } from "./pages/BottomBarPage";
import { createTheme, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <TopBarPage />
        <ShoppingCartPage />
        <BottomBarPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
