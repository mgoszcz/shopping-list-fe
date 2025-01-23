import "./App.css";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import TopBarPage from "./pages/TopBarPage";
import { BottomBarPage } from "./pages/BottomBarPage";

function App() {
  return (
    <div className="App">
      <TopBarPage />
      <ShoppingCartPage />
      <BottomBarPage />
    </div>
  );
}

export default App;
