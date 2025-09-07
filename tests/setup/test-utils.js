// test-utils.js
import { render } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const AllTheProviders = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
