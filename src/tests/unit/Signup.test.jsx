import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, Outlet } from "react-router";
import userEvent from "@testing-library/user-event";
import routes from "../../routes/routes";

const setToken = vi.fn();

vi.mock("../../utils/UserProvider", () => {
  return {
    default: vi.fn(() => <Outlet context={{ user: null, setToken }} />),
  };
});

window.fetch = vi.fn(() => {
  return Promise.resolve({
    ok: true,
    json: vi.fn(() => Promise.resolve({ token: "token" })),
  });
});

describe("Sign up page component", () => {
  test("should render Form component with required inputs to signup", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/sign-up"] });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  test("should display a preview image on each image upload", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, { initialEntries: ["/sign-up"] });

    window.URL.createObjectURL = vi.fn(() => "levi.png");

    render(<RouterProvider router={router} />);

    const file = new File(["dummy content"], "levi.png", { type: "image/png" });

    const image = screen.getByAltText("Image preview");
    const fileInput = screen.getByLabelText("Profile picture", { exact: false });

    await user.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
    expect(image.src).toContain("levi.png");
  });

  test("should set token in localStorage and call setToken on form submit", async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, { initialEntries: ["/sign-up"] });

    render(<RouterProvider router={router} />);

    const firstNameInput = screen.getByLabelText("First name");
    const lastNameInput = screen.getByLabelText("Last name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(firstNameInput, "first name");
    await user.type(lastNameInput, "last name");
    await user.type(emailInput, "test@email.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    expect(localStorage.getItem("token")).toBe("token");
    expect(setToken).toHaveBeenCalledWith("token");
  });

  test("should navigate to '/' path on successful form submit", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, { initialEntries: ["/sign-up"] });

    render(<RouterProvider router={router} />);

    const firstNameInput = screen.getByLabelText("First name");
    const lastNameInput = screen.getByLabelText("Last name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(firstNameInput, "first name");
    await user.type(lastNameInput, "last name");
    await user.type(emailInput, "test@email.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    expect(router.state.location.pathname).toBe("/");
  });

  test("should render errors if form is submitted with invalid input values", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, { initialEntries: ["/sign-up"] });

    window.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => {
          return Promise.resolve({
            errors: [
              { msg: "Email can not be empty." },
              { msg: "Password and password confirmation do not match." },
            ],
          });
        },
      })
    );

    render(<RouterProvider router={router} />);

    const firstNameInput = screen.getByLabelText("First name");
    const lastNameInput = screen.getByLabelText("Last name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(firstNameInput, "first name");
    await user.type(lastNameInput, "last name");
    await user.type(emailInput, "invalid@email");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "invalidPassword");
    await user.click(submitButton);

    const listItems = screen.getAllByRole("listitem");

    expect(listItems[0]).toHaveTextContent("Email can not be empty.");
    expect(listItems[1]).toHaveTextContent("Password and password confirmation do not match.");
  });
});
