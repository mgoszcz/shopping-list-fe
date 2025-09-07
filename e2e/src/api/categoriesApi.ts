import axios from "axios";
import { categoriesEndpoint } from "../consts/urls";
import { expect } from "@playwright/test";

export async function createCategory(name: string) {
  const response = await axios.post(categoriesEndpoint, { name });
  expect(response.status).toBe(201);
  return response.data.id;
}
