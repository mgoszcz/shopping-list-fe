import axios from "axios";
import { shoppingArticlesEndpoint } from "../consts/urls";
import { expect } from "@playwright/test";

export async function createArticle(name: string, categoryId: number) {
  const response = await axios.post(shoppingArticlesEndpoint, {
    name,
    category: { id: categoryId },
  });
  expect(response.status).toBe(201);
  return response.data.id;
}

export async function deleteArticle(id: number) {
  const response = await axios.delete(`${shoppingArticlesEndpoint}/${id}`);
  expect(response.status).toBe(204);
}
