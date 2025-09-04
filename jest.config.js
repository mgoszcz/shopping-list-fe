// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^react$": "<rootDir>/node_modules/react",
    "^react-dom$": "<rootDir>/node_modules/react-dom",
    "^@mui/material$": "<rootDir>/node_modules/@mui/material", // handle CSS imports
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  resetModules: true,
  clearMocks: true,
};
