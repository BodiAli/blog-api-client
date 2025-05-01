import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router";
import UserProvider from "../../utils/UserProvider";
import routes from "../../routes/routes";

vi.mock("../../utils/UserProvider", () => {
  return {
    default: vi.fn(() => <Outlet context={{ user: null, setToken: vi.fn() }} />),
  };
});

window.fetch = vi.fn(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: vi.fn(() => Promise.resolve({ token: "token" })),
  });
});

describe("Login page component", () => {
  test("should render Form component with email and password inputs", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/log-in"] });

    render(<RouterProvider router={router} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("should set token in localStorage on form submit", async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, { initialEntries: ["/log-in"] });

    render(<RouterProvider router={router} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Log in" });

    await user.type(emailInput, "test@email.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(localStorage.getItem("token")).toBe("token");
  });

  test("should navigate to '/' path on successful form submit", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, { initialEntries: ["/log-in"] });

    render(<RouterProvider router={router} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Log in" });

    await user.type(emailInput, "test@email.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(router.state.location.pathname).toBe("/");
  });

  test("should render errors if form is submitted with invalid input values", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, { initialEntries: ["/log-in"] });

    window.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => {
          return Promise.resolve({
            errors: [{ msg: "Email can not be empty." }, { msg: "Password can not be empty." }],
          });
        },
      })
    );

    render(<RouterProvider router={router} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Log in" });

    await user.type(emailInput, "invalid@email");
    await user.type(passwordInput, "invalidPassword");
    await user.click(submitButton);

    const listItems = screen.getAllByRole("listitem");

    expect(listItems[0]).toHaveTextContent("Email can not be empty.");
    expect(listItems[1]).toHaveTextContent("Password can not be empty.");
  });

  test("should render an error if form is submitted with an invalid email or password", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, { initialEntries: ["/log-in"] });

    window.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => {
          return Promise.resolve({
            error: "Incorrect email or password",
          });
        },
      })
    );

    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Log in" });

    await user.type(emailInput, "invalid@email");
    await user.type(passwordInput, "invalidPassword");
    await user.click(submitButton);

    expect(screen.getByRole("listitem")).toHaveTextContent("Incorrect email or password");
  });

  test("should navigate to '/' path if user is already logged in", async () => {
    UserProvider.mockImplementationOnce(() => {
      return (
        <Outlet
          context={{
            user: {
              firstName: "bodi",
              lastName: "ali",
              Profile: {
                profileImgUrl: "imageUrl",
              },
            },
            setToken: vi.fn(),
          }}
        />
      );
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/log-in"] });

    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });

    expect(router.state.location.pathname).toBe("/");
  });
});
