export const getBackendBaseUrl = () => {
  console.log(process.env.REACT_APP_ENVIRONMENT);
  const environment = process.env.REACT_APP_ENVIRONMENT || "prod";
  if (environment === "local") {
    return "http://localhost:3001";
  } else if (environment === "development") {
    return "https://shopping-list-be-development.up.railway.app";
  } else {
    throw new Error(`Unknown environment: ${environment}`);
  }
};

export const BASE_URL = "http://localhost:3001";
