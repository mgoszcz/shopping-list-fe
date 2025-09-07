const baseUrl = "https://shopping-list-be-development.up.railway.app";
export const categoriesEndpoint = `${baseUrl}/categories`;
export const currentShopEndpoint = `${baseUrl}/currentShop`;
export const shopsEndpoint = `${baseUrl}/shops`;
export const shopCategoriesEndpoint = (shopId) =>
  `${baseUrl}/shops/${shopId}/categories`;
export const shoppingArticlesEndpoint = `${baseUrl}/shoppingArticles`;
export const shoppingCartEndpoint = `${baseUrl}/shoppingCart`;
export const lastModifiedTimestampEndpoint = `${baseUrl}/lastModifiedTimestamp`;
export const lastModifiedCategoriesEndpoint = `${lastModifiedTimestampEndpoint}/categories`;
export const lastModifiedShoppingArticlesEndpoint = `${lastModifiedTimestampEndpoint}/shopping_articles`;
export const lastModifiedShoppingCartEndpoint = `${lastModifiedTimestampEndpoint}/shopping_cart`;
export const lastModifiedShopsEndpoint = `${lastModifiedTimestampEndpoint}/shops`;
export const lastModifiedShopCategoriesEndpoint = `${lastModifiedTimestampEndpoint}/shop_categories`;
export const lastModifiedCurrentShopEndpoint = `${lastModifiedTimestampEndpoint}/current_shop`;
export const resetDatabaseEndpoint = `${baseUrl}/resetDatabase`;
