import { screen, render, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import routes from "../../routes/routes";

window.fetch = vi.fn(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: vi.fn(() => {
      return Promise.resolve({
        firstName: "bodi",
        lastName: "ali",
        Profile: {
          profileImgUrl: "imageUrl",
        },
      });
    }),
  });
});

window.localStorage = {
  getItem: vi.fn(() => "token"),
};

describe("UserProvide component", () => {
  test("Should pass user object to child components", async () => {
    const router = createMemoryRouter(routes);

    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });

    const welcomeMessage = screen.getByText("welcome, bodi ali", { exact: false });

    expect(welcomeMessage).toBeInTheDocument();
  });

  test("If there is no token or token is invalid null will be passed as the user object", async () => {
    window.localStorage.getItem.mockImplementationOnce(() => null);
    const router = createMemoryRouter(routes);

    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });

    const welcomeMessage = screen.queryByText("welcome, bodi ali", { exact: false });

    expect(welcomeMessage).not.toBeInTheDocument();
  });
});
