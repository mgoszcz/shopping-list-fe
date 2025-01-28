import axios from "axios";
import { getBackendBaseUrl } from "../../constants/urls/baseUrl";

export const api = axios.create({ baseURL: getBackendBaseUrl() });
