import { render, screen } from "@testing-library/react";
import FormButton from "../../components/FormButton/FormButton";
import { expect } from "vitest";

describe("FormButton component", () => {
  test("Should render a button with classname and children prop", () => {
    const { container } = render(<FormButton>Form button</FormButton>);

    expect(container).toMatchSnapshot();
  });

  test("Should disable button when disabled is true", () => {
    render(<FormButton disabled={true}>Form button</FormButton>);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
