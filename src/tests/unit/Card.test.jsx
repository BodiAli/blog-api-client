import { screen, render } from "@testing-library/react";
import { createRoutesStub, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import userEvent from "@testing-library/user-event";
import Card from "../../components/Card/Card";

vi.stubGlobal("fetch", vi.fn());

vi.mock("react-router", async (importOriginal) => {
  const result = await importOriginal();

  return {
    ...result,
    useOutletContext: vi.fn(() => ({ token: "token", user: "User" })),
  };
});

vi.mock("react-toastify", () => {
  return {
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

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
  liked: false,
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

const fakeDispatch = vi.fn();

beforeEach(() => {
  fetch.mockImplementation(() => {
    return Promise.resolve({
      ok: true,
    });
  });

  vi.clearAllMocks();
});

describe("Card component", () => {
  test("Should render post data", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => <Card post={fakePost} dispatch={fakeDispatch} />,
      },
    ]);

    const { container } = render(<Stub />);

    expect(container).toMatchSnapshot();
  });

  test("Should display a please login message if user is not authenticated", () => {
    useOutletContext.mockImplementationOnce(() => ({ token: "token", user: null }));

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => <Card post={fakePost} dispatch={fakeDispatch} />,
      },
    ]);

    render(<Stub />);

    expect(screen.getByTestId("login-notice")).toBeInTheDocument();
  });

  test("should call dispatch and success toast when liking post", async () => {
    const user = userEvent.setup();

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => <Card post={fakePost} dispatch={fakeDispatch} />,
      },
    ]);

    render(<Stub />);

    const likeButton = screen.getByTestId("like-button");

    await user.click(likeButton);

    expect(fakeDispatch).toHaveBeenCalledExactlyOnceWith({
      type: "update-like",
      post: { ...fakePost, liked: true, likes: 1 },
    });

    expect(toast.success).toHaveBeenCalledExactlyOnceWith("Post liked successfully!");
  });

  test("should call dispatch and success toast when removing post like", async () => {
    const user = userEvent.setup();

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => <Card post={{ ...fakePost, liked: true, likes: 1 }} dispatch={fakeDispatch} />,
      },
    ]);

    render(<Stub />);

    const likeButton = screen.getByTestId("like-button");

    await user.click(likeButton);

    expect(fakeDispatch).toHaveBeenCalledExactlyOnceWith({
      type: "update-like",
      post: { ...fakePost, liked: false, likes: 0 },
    });

    expect(toast.success).toHaveBeenCalledExactlyOnceWith("Like removed successfully!");
  });

  test("Should show an error toast if response is not ok", async () => {
    const user = userEvent.setup();

    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => <Card post={fakePost} dispatch={fakeDispatch} />,
      },
    ]);

    render(<Stub />);

    const likeButton = screen.getByTestId("like-button");

    await user.click(likeButton);

    expect(toast.error).toHaveBeenCalledExactlyOnceWith("Failed to like post please try again later");
  });
});
