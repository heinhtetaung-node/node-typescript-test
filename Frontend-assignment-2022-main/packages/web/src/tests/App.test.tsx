import { render } from "@testing-library/react";

import App from "../App";

describe("App", () => {
  it("should work as expected", () => {
    const screen = render(<App />);
    expect(screen.getByText("Restaurants")).toBeInTheDocument();
  });
});
