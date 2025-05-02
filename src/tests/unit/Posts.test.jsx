import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import Posts from "../../components/Posts/Posts";

vi.stubGlobal("fetch", vi.fn());

const fakeResponse = {
  posts: [
    {
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
    },
  ],
  pages: 1,
};

const Stub = createRoutesStub([
  {
    path: "/",
    Component: Posts,
  },
]);

beforeEach(() => {
  fetch.mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(fakeResponse),
    });
  });
  fetch.mockClear();
});

describe("Posts component", () => {
  test("Should render Search component, all posts with Card component, and pagination", async () => {
    let container;

    await waitFor(() => {
      const result = render(<Stub />);
      container = result.container;
    });

    expect(container).toMatchSnapshot();
  });

  test("typing in search input triggers fetch with correct topic query", async () => {
    await waitFor(() => {
      render(<Stub />);
    });

    expect(fetch).toHaveBeenCalledOnce();

    const searchInput = screen.getByRole("searchbox", { name: /search/i });
    expect(searchInput).toHaveValue("");

    await userEvent.type(searchInput, "Topic 1");

    const lastFetchCall = fetch.mock.lastCall[0];

    expect(lastFetchCall).toMatch(/topic=Topic 1/i);
    expect(searchInput).toHaveValue("Topic 1");
  });

  test("Clicking pagination buttons will call fetch with correct page number", async () => {
    const user = userEvent.setup();

    fetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            ...fakeResponse,
            pages: 2,
          }),
      });
    });

    await waitFor(() => {
      render(<Stub />);
    });

    /* Query buttons after click to prevent clicking a stale DOM node because after react-router
   navigates to a new page query, the Posts component will re-render which unmounts the old buttons and inserts
   a brand new one */
    const secondPageButton = screen.getByRole("button", { name: "2" });
    await user.click(secondPageButton);

    expect(fetch.mock.lastCall[0]).toMatch(/page=2/);

    const firstPageButton = screen.getByRole("button", { name: "1" });
    await user.click(firstPageButton);

    expect(fetch.mock.lastCall[0]).toMatch(/page=1/);

    const nextPageButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextPageButton);

    expect(fetch.mock.lastCall[0]).toMatch(/page=2/);

    const backPageButton = screen.getByRole("button", { name: "Back" });
    await user.click(backPageButton);

    expect(fetch.mock.lastCall[0]).toMatch(/page=1/);
  });

  test("if currentPage is on 1 the back button will be disabled", async () => {
    fetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            ...fakeResponse,
            pages: 2,
          }),
      });
    });

    await waitFor(() => {
      render(<Stub />);
    });

    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
  });

  test("if currentPage is equal to or bigger than the last page then the next button will be disabled", async () => {
    const user = userEvent.setup();

    fetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            ...fakeResponse,
            pages: 2,
          }),
      });
    });

    await waitFor(() => {
      render(<Stub />);
    });

    const secondPageButton = screen.getByRole("button", { name: "2" });

    await user.click(secondPageButton);

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
