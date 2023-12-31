import { render } from "@testing-library/react";

import Restaurant from "../Restaurant";

describe("Restaurant", () => {
  it("should show skeleton at the beginning", () => {
    const screen = render(<Restaurant />);
    expect(screen.getByTestId("div-loading")).toBeInTheDocument();
  });
});
