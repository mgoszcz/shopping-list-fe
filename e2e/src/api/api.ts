import axios, { AxiosInstance } from "axios";
import { Identifiable } from "../types/basicObject";

export abstract class Api<T extends Identifiable> {
  protected client: AxiosInstance;

  constructor(
    baseURL: string,
    protected basePath: string
  ) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // this.client.interceptors.request.use((request) => {
    //   console.log("[AXIOS][REQUEST]", {
    //     method: request.method,
    //     url: request.url,
    //     headers: request.headers,
    //     data: request.data,
    //   });
    //   return request;
    // });
  }

  async get(id: string): Promise<T> {
    const response = await this.client.get<T>(`${this.basePath}/${id}`);
    return response.data;
  }

  async list(params?: Record<string, any>): Promise<T[]> {
    const response = await this.client.get<T[]>(this.basePath, { params });
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await this.client.post<T>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await this.client.put<T>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`${this.basePath}/${id}`);
  }
}
