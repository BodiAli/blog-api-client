import { useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import Card from "../Card/Card";
import Loader from "../Loader/Loader";
import styles from "./Posts.module.css";

export default function Posts() {
  const [posts, dispatch] = useReducer(reducer, []);
  const [totalePages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`);

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
    }
    fetchPosts();
  }, []);

  if (loading) return <Loader />;

  return (
    <main>
      {/* <Search/> */}
      {posts.length === 0 ? (
        <p className={styles.noPosts}>No published posts yet!</p>
      ) : (
        <>
          <div className={styles.postsContainer}>
            {posts.map((post) => {
              return <Card key={post.id} post={post} />;
            })}
          </div>
          {/* <div className={styles.pagination}>
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
          </div> */}
        </>
      )}
    </main>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "set-posts":
      return action.posts;
    default:
      throw new Error("Invalid type");
  }
}
