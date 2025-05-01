import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "../../components/Form/Form";

describe("Form component", () => {
  test("should render a form", () => {
    const { container } = render(
      <Form>
        <p>Form</p>
      </Form>
    );

    expect(container).toMatchSnapshot();
  });

  test("should render children passed to the Form component", () => {
    render(
      <Form>
        <h1>heading 1</h1>
        <h2>heading 2</h2>
      </Form>
    );

    expect(screen.getByRole("heading", { level: 1, name: "heading 1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "heading 2" })).toBeInTheDocument();
  });

  test("should call onSubmit prop when form is submitted", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e) => {
      e.preventDefault();
    });

    render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );

    const submitButton = screen.getByRole("button", { name: "Submit" });

    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledOnce();
  });
});
