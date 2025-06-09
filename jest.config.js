// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy", // handle CSS imports
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
