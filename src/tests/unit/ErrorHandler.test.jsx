import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import userEvent from "@testing-library/user-event";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";

function ThrowErrorComponent() {
  throw new Error("ERROR!!!");
}

describe("ErrorHandler component", () => {
  test("Should render ERROR!!! message with a reload button", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: ThrowErrorComponent,
        ErrorBoundary: ErrorHandler,
      },
    ]);
    const { container } = render(<Stub initialEntries={["/"]} />);

    expect(container).toMatchSnapshot();
  });

  test("Should call reload page when reload button is clicked", async () => {
    const user = userEvent.setup();

    window.location = { reload: vi.fn() };

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: ThrowErrorComponent,
        ErrorBoundary: ErrorHandler,
      },
    ]);

    render(<Stub initialEntries={["/"]} />);

    await user.click(screen.getByRole("button"));

    expect(window.location.reload).toHaveBeenCalledOnce();
  });
});
