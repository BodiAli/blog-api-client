import { render } from "@testing-library/react";
import AboutPage from "../../pages/AboutPage/AboutPage";

describe("AboutPage component", () => {
  test("Should render website logo, name and description", () => {
    const { container } = render(<AboutPage />);

    expect(container).toMatchSnapshot();
  });
});
