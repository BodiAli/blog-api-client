import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import routes from "../../routes/routes";

describe("NotFound component", () => {
  test("Should render NotFound component with link to head back to '/' path", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/undefined-path"] });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });
});
