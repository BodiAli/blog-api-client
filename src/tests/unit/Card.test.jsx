import { screen, render } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import Card from "../../components/Card/Card";
import { vi } from "vitest";

vi.stubGlobal("fetch", vi.fn);

const fakePost = {
  id: "57c20dfb-8135-42eb-8abe-0bffbaffd668",
  userId: 1,
  title: "16",
  content: "<p>Content</p>",
  published: true,
  likes: 0,
  createdAt: "2025-05-01T10:44:36.648Z",
  updatedAt: "2025-05-01T10:44:36.648Z",
  imgUrl: null,
  User: {
    id: 1,
    firstName: "Bodi",
    lastName: "Ali",
    profileId: 1,
    Profile: {
      profileImgUrl: "img-url",
    },
  },
  Topics: [
    {
      id: 1,
      name: "Topic 1",
    },
  ],
};

const Stub = createRoutesStub([
  {
    path: "/",
    Component: () => <Card post={fakePost} />,
  },
]);

describe("Card component", () => {
  test("Should render post data", () => {
    const { container } = render(<Stub />);

    expect(container).toMatchSnapshot();
  });

  // test("Should ")
});
