const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;

export const getBackendBaseUrl = () => {
  if (ENVIRONMENT === "local") {
    return "http://localhost:3001";
  } else if (ENVIRONMENT === "development") {
    return "https://shopping-list-be-development.up.railway.app";
  } else if (ENVIRONMENT === "production") {
    return "https://shopping-list-be.up.railway.app";
  } else {
    throw new Error(`Unknown environment: ${ENVIRONMENT}`);
  }
};
