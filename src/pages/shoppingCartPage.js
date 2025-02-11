import { Container } from "@mui/material";
import ShoppingCartCard from "../components/shoppingCartCard";
import ArticlePopup from "../popups/articlePopup";
import React from "react";

const ShoppingCartPage = ({
  shoppingCart,
  shoppingCartProcessor,
  articlePopupOpen,
  setArticlePopupOpen,
  editingArticle,
  setEditingArticle,
  articlesProcessor,
}) => {
  return (
    <Container maxWidth={"md"} sx={{ minWidth: 300, pb: "60px" }}>
      {shoppingCart.map((cartItem) => (
        <ShoppingCartCard
          cartItem={cartItem}
          key={cartItem.id}
          shoppingCartProcessor={shoppingCartProcessor}
          setArticlePopupOpen={setArticlePopupOpen}
          setEditingArticle={setEditingArticle}
        />
      ))}
      <ArticlePopup
        setOpen={setArticlePopupOpen}
        open={articlePopupOpen}
        article={editingArticle}
        articlesProcessor={articlesProcessor}
      ></ArticlePopup>
    </Container>
  );
};

export default ShoppingCartPage;
