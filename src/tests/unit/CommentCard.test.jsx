import { screen, render } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { toast } from "react-toastify";
import userEvent from "@testing-library/user-event";
import { vi, expect, test, beforeEach } from "vitest";
import CommentCard from "../../components/CommentCard/CommentCard";

vi.stubGlobal("fetch", vi.fn());

vi.mock("date-fns", async (importOriginal) => {
  const result = await importOriginal();

  return {
    ...result,
    formatDistanceToNow: () => "1 day ago",
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

const fakeComment = {
  id: "7397319e-58ef-4e42-bc94-aa8788db4090",
  userId: 1,
  postId: "57c20dfb-8135-42eb-8abe-0bffbaffd668",
  content: "Comment content",
  likes: 1,
  createdAt: "2025-05-03T07:51:49.273Z",
  updatedAt: "2025-05-04T06:19:03.092Z",
  User: {
    id: 1,
    firstName: "Bodi",
    lastName: "Ali",
    Profile: {
      profileImgUrl: "imageUrl",
    },
  },
  commentLiked: false,
};

const fakeUser = {
  id: 1,
  firstName: "Bodi",
  lastName: "Ali",
  Profile: {
    profileImgUrl: "imageUrl",
  },
};

const fakeToken = "token";

const fakeDispatch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CommentCard component", () => {
  test("Should render comment data ", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={fakeUser} />
        ),
      },
    ]);

    const { container } = render(<Stub />);

    expect(container).toMatchSnapshot();
  });

  test("If user is not authenticated component should not render options icon", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={null} />
        ),
      },
    ]);

    render(<Stub />);

    expect(screen.queryByAltText("options")).not.toBeInTheDocument();
  });

  test("If authenticated user is not the author of the comment, component should not render options icon", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard
            comment={fakeComment}
            dispatch={fakeDispatch}
            token={fakeToken}
            user={{ ...fakeUser, id: 2 }}
          />
        ),
      },
    ]);

    render(<Stub />);

    expect(screen.queryByAltText("options")).not.toBeInTheDocument();
  });

  test("If edit button is clicked component should render a form to edit comment", async () => {
    const user = userEvent.setup();

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={fakeUser} />
        ),
      },
    ]);

    render(<Stub />);

    const editButton = screen.getByRole("button", { name: "Edit" });

    await user.click(editButton);

    expect(screen.getByDisplayValue("Comment content")).toBeInTheDocument();
  });

  test("If edit button is clicked and then cancel button is clicked component should hide form", async () => {
    const user = userEvent.setup();

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={fakeUser} />
        ),
      },
    ]);

    render(<Stub />);

    const editButton = screen.getByRole("button", { name: "Edit" });

    await user.click(editButton);

    expect(screen.getByDisplayValue("Comment content")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(screen.queryByDisplayValue("Comment content")).not.toBeInTheDocument();
  });

  test("If user is not authenticated component should render a login notice", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={null} />
        ),
      },
    ]);

    render(<Stub />);

    const loginNotice = screen.getByTestId("login-notice-comment");

    expect(loginNotice).toBeInTheDocument();
  });

  test("When like button is clicked component should call dispatch function and a success toast", async () => {
    const user = userEvent.setup();

    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={fakeUser} />
        ),
      },
    ]);

    render(<Stub />);

    const likeButton = screen.getByTestId("like-button-comment");

    await user.click(likeButton);

    expect(fakeDispatch).toHaveBeenCalledWith({ type: "update-comment-like", comment: fakeComment });
    expect(toast.success).toHaveBeenCalledWith("Comment liked successfully!");
  });

  test("When unlike button is clicked component should call dispatch function and a success toast", async () => {
    const user = userEvent.setup();

    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard
            comment={{ ...fakeComment, commentLiked: true }}
            dispatch={fakeDispatch}
            token={fakeToken}
            user={fakeUser}
          />
        ),
      },
    ]);

    render(<Stub />);

    const likeButton = screen.getByTestId("like-button-comment");

    await user.click(likeButton);

    expect(fakeDispatch).toHaveBeenCalledWith({
      type: "update-comment-like",
      comment: { ...fakeComment, commentLiked: true },
    });
    expect(toast.success).toHaveBeenCalledWith("Like removed successfully!");
  });

  test("Should toast an error of removing like if comment is liked and fetch is not ok", async () => {
    const user = userEvent.setup();

    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard
            comment={{ ...fakeComment, commentLiked: true }}
            dispatch={fakeDispatch}
            token={fakeToken}
            user={fakeUser}
          />
        ),
      },
    ]);

    render(<Stub />);

    const likeButton = screen.getByTestId("like-button-comment");

    await user.click(likeButton);

    expect(fakeDispatch).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Failed to remove like please try again later");
  });

  test("Should toast an error of adding like if comment is not liked and fetch is not ok", async () => {
    const user = userEvent.setup();

    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={fakeUser} />
        ),
      },
    ]);

    render(<Stub />);

    const likeButton = screen.getByTestId("like-button-comment");

    await user.click(likeButton);

    expect(fakeDispatch).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Failed to like comment please try again later");
  });

  test("Should show errors sent by the server if update form is sent with invalid input", async () => {
    const user = userEvent.setup();

    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ errors: [{ msg: "Comment can not be empty." }] }),
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={fakeUser} />
        ),
      },
    ]);

    render(<Stub />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    const commentInput = screen.getByDisplayValue("Comment content");

    await user.clear(commentInput);
    await user.type(commentInput, "Invalid input");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    const errorList = screen.getByRole("listitem");
    expect(errorList).toHaveTextContent("Comment can not be empty.");
  });

  test("Should call dispatch, success toast, and hide form when form is successfully submitted", async () => {
    const user = userEvent.setup();

    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ msg: "Comment updated successfully!" }),
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={fakeUser} />
        ),
      },
    ]);

    render(<Stub />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    const commentInput = screen.getByDisplayValue("Comment content");

    await user.clear(commentInput);
    await user.type(commentInput, "Comment updated");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(screen.queryByDisplayValue("Comment updated")).not.toBeInTheDocument();
    expect(toast.success).toBeCalledWith("Comment updated successfully!");
    expect(fakeDispatch).toBeCalledWith({
      type: "update-comment-content",
      comment: fakeComment,
      content: "Comment updated",
    });
  });

  test("Should call dispatch and success toast when delete button is clicked", async () => {
    const user = userEvent.setup();

    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <CommentCard comment={fakeComment} dispatch={fakeDispatch} token={fakeToken} user={fakeUser} />
        ),
      },
    ]);

    render(<Stub />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(fakeDispatch).toBeCalledWith({ type: "delete-comment", comment: fakeComment });
    expect(toast.success).toBeCalledWith("Comment deleted successfully!");
  });
});
