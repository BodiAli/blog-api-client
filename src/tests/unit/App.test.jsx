import { render } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import App from "../../App";

vi.mock("react-router", async (importOriginal) => {
  const result = await importOriginal();
  return {
    ...result,
    useOutletContext: () => ({
      user: {
        firstName: "bodi",
        lastName: "ali",
        Profile: {
          profileImgUrl: "imageUrl",
        },
      },
    }),
  };
});

const Stub = createRoutesStub([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: () => <p>Nested component</p>,
      },
    ],
  },
]);

describe("App component", () => {
  test("Should render Header component and nested route through Outlet component", () => {
    const { container } = render(<Stub />);

    expect(container).toMatchSnapshot();
  });
});
