import { Api } from "./api";

export type Shop = {
  id: number;
  logo: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export class ShopsApi extends Api<Shop> {
  constructor(baseUrl: string) {
    super(baseUrl, "/shops");
  }
}
