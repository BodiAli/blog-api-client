import { screen, render } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import userEvent from "@testing-library/user-event";
import Header from "../../components/Header/Header";

const setToken = vi.fn();

describe("Header component", () => {
  test("Should render website name, icon, nav, and a welcome message with logout button if user is provided", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <Header
            setToken={setToken}
            user={{
              firstName: "bodi",
              lastName: "ali",
              Profile: {
                profileImgUrl: "imageUrl",
              },
            }}
          />
        ),
      },
    ]);
    const { container } = render(<Stub />);
    expect(container).toMatchSnapshot();
  });

  test("Should remove token from localStorage and call setToken when logout is clicked", async () => {
    const user = userEvent.setup();

    window.localStorage = {
      getItem: vi.fn(),
      removeItem: vi.fn(),
    };

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <Header
            setToken={setToken}
            user={{
              firstName: "bodi",
              lastName: "ali",
              Profile: {
                profileImgUrl: "imageUrl",
              },
            }}
          />
        ),
      },
    ]);

    render(<Stub />);

    const logoutButton = screen.getByRole("button", { name: "Logout" });

    await user.click(logoutButton);

    expect(localStorage.removeItem).toHaveBeenCalledExactlyOnceWith("token");
    expect(localStorage.getItem).toHaveBeenCalledExactlyOnceWith("token");
    expect(setToken).toHaveBeenCalledExactlyOnceWith(localStorage.getItem("token"));
  });

  test("Should render website name, icon, and navbar with login button of no user is provided", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => <Header setToken={setToken} user={null} />,
      },
    ]);

    const { container } = render(<Stub />);
    expect(container).toMatchSnapshot();
  });
});
