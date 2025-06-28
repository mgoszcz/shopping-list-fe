import React from "react";
import { render, screen } from "@testing-library/react";
import { ProgressOverlay } from "../progressOverlay";

describe("ProgressOverlay", () => {
  test("renders CircularProgress when loading is true", () => {
    render(<ProgressOverlay loading={true} />);
    const backdrop = screen.getByTestId("overlay-backdrop");
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveStyle("opacity: 1");
  });

  test("does not render anything when loading is false", () => {
    const { container } = render(<ProgressOverlay loading={false} />);
    expect(container).toBeEmptyDOMElement();
  });
});
