import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import { beforeEach, expect, vi } from "vitest";
import Post from "../../components/Post/Post";

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
      error: vi.fn(),
      success: vi.fn(),
      info: vi.fn(),
    },
  };
});

const fakeUser = {
  id: 1,
  firstName: "Bodi",
  lastName: "Ali",
  Profile: {
    profileImgUrl: "imageUrl",
  },
};

const navigateMock = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const result = await importOriginal();

  return {
    ...result,
    useOutletContext: vi.fn(),
    useNavigate: () => navigateMock,
  };
});

const fakePost = {
  id: "57c20dfb-8135-42eb-8abe-0bffbaffd668",
  userId: 1,
  title: "Post title",
  content: "Post content",
  published: true,
  likes: 2,
  createdAt: "2025-05-01T10:44:36.648Z",
  updatedAt: "2025-05-03T04:45:02.965Z",
  imgUrl: "imageUrl",
  User: {
    id: 1,
    firstName: "Bodi",
    lastName: "Ali",
    Profile: {
      profileImgUrl: "imageUrl",
    },
  },
  Topics: [{ name: "Topic 1" }, { name: "Topic 2" }],
  postLiked: false,
  Comments: [
    {
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
    },
    {
      id: "5432119e-58ef-4e42-bc94-aa8788db2021",
      userId: 2,
      postId: "57c20dfb-8135-42eb-8abe-0bffbaffd668",
      content: "Comment content 2",
      likes: 1,
      createdAt: "2025-05-03T07:51:49.273Z",
      updatedAt: "2025-05-04T06:19:03.092Z",
      User: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        Profile: {
          profileImgUrl: "imageUrl",
        },
      },
      commentLiked: false,
    },
  ],
};

beforeEach(() => {
  fetch.mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(fakePost),
    });
  });

  useOutletContext.mockImplementation(() => ({ token: "token", user: fakeUser }));

  vi.clearAllMocks();
});

describe("Post component", () => {
  test("Should render post and comment data with expected buttons and inputs", async () => {
    const Stub = createRoutesStub([
      {
        path: "/posts/:postId",
        Component: () => <Post />,
      },
    ]);

    let container;

    await waitFor(() => {
      const result = render(<Stub initialEntries={["/posts/57c20dfb-8135-42eb-8abe-0bffbaffd668"]} />);

      container = result.container;
    });

    expect(container).toMatchSnapshot();
  });

  test("When component is mounted it should call fetch with expected postId and Authorization header as the token", async () => {
    const Stub = createRoutesStub([
      {
        path: "/posts/:postId",
        Component: () => <Post />,
      },
    ]);

    await waitFor(() => {
      render(<Stub initialEntries={["/posts/57c20dfb-8135-42eb-8abe-0bffbaffd668"]} />);
    });

    const fetchCall = fetch.mock.calls[0];

    expect(fetchCall[0]).toMatch("57c20dfb-8135-42eb-8abe-0bffbaffd668");
    expect(fetchCall[1]).toStrictEqual({ headers: { Authorization: "token" } });
  });

  test("if user is not authenticated, component should render a login notice for liking post", async () => {
    const Stub = createRoutesStub([
      {
        path: "/posts/:postId",
        Component: () => <Post />,
      },
    ]);

    useOutletContext.mockImplementation(() => ({ token: "token", user: null }));

    await waitFor(() => {
      render(<Stub initialEntries={["/posts/57c20dfb-8135-42eb-8abe-0bffbaffd668"]} />);
    });

    expect(screen.getByTestId("login-notice")).toBeInTheDocument();
    expect(screen.queryByTestId("like-button")).not.toBeInTheDocument();
  });

  test("should increment post likes to 3 when clicking like button and assign liked class to like button", async () => {
    const user = userEvent.setup();

    const Stub = createRoutesStub([
      {
        path: "/posts/:postId",
        Component: () => <Post />,
      },
    ]);

    await waitFor(() => {
      render(<Stub initialEntries={["/posts/57c20dfb-8135-42eb-8abe-0bffbaffd668"]} />);
    });

    await user.click(screen.getByTestId("like-button"));

    expect(screen.getByTestId("likes-count")).toHaveTextContent("Likes: 3");
    expect(screen.getByTestId("like-button")).toHaveClass(/liked/i);
    expect(toast.success).toHaveBeenCalledWith("Post liked successfully!");
  });

  test("should decrement post likes to 1 when clicking unlike button and remove liked class from like button", async () => {
    const user = userEvent.setup();

    fetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ ...fakePost, postLiked: true }),
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/posts/:postId",
        Component: () => <Post />,
      },
    ]);

    await waitFor(() => {
      render(<Stub initialEntries={["/posts/57c20dfb-8135-42eb-8abe-0bffbaffd668"]} />);
    });

    await user.click(screen.getByTestId("like-button"));

    expect(screen.getByTestId("likes-count")).toHaveTextContent("Likes: 1");
    expect(screen.getByTestId("like-button")).not.toHaveClass(/liked/i);
    expect(toast.success).toHaveBeenCalledWith("Like removed successfully!");
  });

  test("if fetch response is not ok because post is not found, component should call navigate and error toast with expected arguments", async () => {
    fetch.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            error: "Post not found! it may have been moved, deleted or it might have never existed.",
          }),
      });
    });

    const Stub = createRoutesStub([
      {
        path: "/posts/:postId",
        Component: () => <Post />,
      },
    ]);

    await waitFor(() => {
      render(<Stub initialEntries={["/posts/invalidParam"]} />);
    });

    expect(navigateMock).toHaveBeenCalledWith(-1, { viewTransition: true });
    expect(toast.error).toHaveBeenCalledWith(
      "Post not found! it may have been moved, deleted or it might have never existed."
    );
  });

  test("When create comment form is submitted and user is not authenticated it should info a toast", async () => {
    const user = userEvent.setup();

    useOutletContext.mockImplementation(() => ({ token: "", user: null }));

    const Stub = createRoutesStub([
      {
        path: "/posts/:postId",
        Component: () => <Post />,
      },
    ]);

    await waitFor(() => {
      render(<Stub initialEntries={["/posts/57c20dfb-8135-42eb-8abe-0bffbaffd668"]} />);
    });

    const commentInput = screen.getByPlaceholderText("Comment on post");
    const createButton = screen.getByRole("button", { name: "Create" });

    await user.type(commentInput, "Created comment");
    await user.click(createButton);

    expect(toast.info).toBeCalledWith("You need to login to create a comment");
  });

  test("When create comment form is submitted it should create a new comment", async () => {
    const user = userEvent.setup();

    // Implement two responses one for useEffect and one for handleCreateComment
    fetch
      .mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(fakePost),
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () =>
            Promise.resolve({
              comment: {
                id: "1234-1234-1234-1234-1234",
                userId: 1,
                postId: "57c20dfb-8135-42eb-8abe-0bffbaffd668",
                content: "Created comment",
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
              },
              msg: "Comment created successfully!",
            }),
        });
      });

    const Stub = createRoutesStub([
      {
        path: "/posts/:postId",
        Component: () => <Post />,
      },
    ]);

    await waitFor(() => {
      render(<Stub initialEntries={["/posts/57c20dfb-8135-42eb-8abe-0bffbaffd668"]} />);
    });

    const commentInput = screen.getByPlaceholderText("Comment on post");
    const createButton = screen.getByRole("button", { name: "Create" });

    await user.type(commentInput, "Created comment");
    await user.click(createButton);

    expect(screen.getByText("Created comment")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Comment created successfully!");
  });

  test("If form is submitted with invalid input component should render invalid input error returned from server", async () => {
    const user = userEvent.setup();

    // Implement two responses one for useEffect and one for handleCreateComment
    fetch
      .mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(fakePost),
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ errors: [{ msg: "Comment can not be empty." }] }),
        });
      });

    const Stub = createRoutesStub([
      {
        path: "/posts/:postId",
        Component: () => <Post />,
      },
    ]);

    await waitFor(() => {
      render(<Stub initialEntries={["/posts/57c20dfb-8135-42eb-8abe-0bffbaffd668"]} />);
    });

    const commentInput = screen.getByPlaceholderText("Comment on post");
    const createButton = screen.getByRole("button", { name: "Create" });

    await user.type(commentInput, "Created comment");
    await user.click(createButton);

    expect(screen.getByRole("listitem")).toHaveTextContent("Comment can not be empty.");
  });

  // test("KOKO", async () => {
  //   const user = userEvent.setup();

  //   fetch
  //     .mockImplementationOnce(() => {
  //       return Promise.resolve({
  //         ok: true,
  //         status: 200,
  //         json: () => Promise.resolve(fakePost),
  //       });
  //     })
  //     .mockImplementationOnce(() => {
  //       return Promise.resolve({
  //         ok: false,
  //         status: 400,
  //         json: () => Promise.resolve({ errors: [{ msg: "Comment can not be empty." }] }),
  //       });
  //     });

  //   const Stub = createRoutesStub([
  //     {
  //       path: "/posts/:postId",
  //       Component: () => <Post />,
  //     },
  //   ]);

  //   await waitFor(() => {
  //     render(<Stub initialEntries={["/posts/57c20dfb-8135-42eb-8abe-0bffbaffd668"]} />);
  //   });
  // });
});
