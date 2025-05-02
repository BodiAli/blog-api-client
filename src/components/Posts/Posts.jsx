import { useEffect, useReducer, useState, Fragment, useCallback } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import Card from "../Card/Card";
import Loader from "../Loader/Loader";
import Search from "../Search/Search";
import styles from "./Posts.module.css";

export default function Posts() {
  const [posts, dispatch] = useReducer(reducer, []);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topicSearch, setTopicSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useOutletContext();

  const queryString = new URLSearchParams(location.search);
  const currentPage = Number.parseInt(queryString.get("page", 10)) || 1;

  async function handleSearch(e) {
    setTopicSearch(e.target.value);
  }

  const fetchPosts = useCallback(
    async (page, topicSearch) => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/posts?page=${page}&topic=${topicSearch}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const { posts, pages } = await res.json();

        dispatch({ type: "set-posts", posts });
        setTotalPages(pages);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchPosts(currentPage, topicSearch);
  }, [currentPage, topicSearch, fetchPosts]);

  return (
    <main className={styles.main}>
      <Search onChange={handleSearch} value={topicSearch} />

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <p className={styles.noPosts}>No posts found!</p>
      ) : (
        <>
          <div className={styles.postsContainer}>
            {posts.map((post) => {
              return (
                <Fragment key={post.id}>
                  <Card key={post.id} post={post} />
                  <hr />
                </Fragment>
              );
            })}
          </div>
          <div className={styles.pagination}>
            <button
              className={currentPage <= 1 ? styles.disabled : ""}
              disabled={currentPage <= 1}
              onClick={() => {
                navigate(`?page=${currentPage - 1}`, { viewTransition: true });
              }}
            >
              Back
            </button>
            {Array.from({ length: totalPages }, (_val, i) => i + 1).map((pageNumber) => {
              return (
                <button
                  onClick={() => {
                    navigate(`?page=${pageNumber}`, { viewTransition: true });
                  }}
                  key={pageNumber}
                  className={currentPage === pageNumber ? styles.active : ""}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              className={currentPage >= totalPages ? styles.disabled : ""}
              disabled={currentPage >= totalPages}
              onClick={() => {
                navigate(`?page=${currentPage + 1}`, { viewTransition: true });
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "set-posts": {
      return action.posts;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
}
