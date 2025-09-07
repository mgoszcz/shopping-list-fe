// components/__tests__/SynchronizationStatusBar.test.jsx
import { render, screen } from "@testing-library/react";
import SynchronizationStatusBar from "../synchronizationStatusBar";
import { synchState } from "../../../constants/synchState";

test("shows CheckCircle for SYNCHED state", () => {
  render(
    <SynchronizationStatusBar
      shoppingCartState={synchState.SYNCHED}
      articlesState={synchState.SYNCHED}
    />
  );
  const icons = screen.getAllByTestId("CheckCircleIcon");
  expect(icons).toHaveLength(2);
});

test("shows CircularProgress for FETCHING state", () => {
  render(
    <SynchronizationStatusBar
      shoppingCartState={synchState.FETCHING}
      articlesState={synchState.FETCHING}
    />
  );
  expect(screen.getAllByRole("progressbar")).toHaveLength(2);
});

test("shows Error icon for ERROR state", () => {
  render(
    <SynchronizationStatusBar
      shoppingCartState={synchState.ERROR}
      articlesState={synchState.ERROR}
    />
  );
  const icons = screen.getAllByTestId("ErrorIcon");
  expect(icons).toHaveLength(2);
});
