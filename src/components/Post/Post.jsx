import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import parse from "html-react-parser";
import Loader from "../Loader/Loader";
import noImage from "../../assets/images/no-image.svg";
import styles from "./Post.module.css";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${postId}`);

        if (!res.ok) {
          if (res.status === 404) {
            const { error } = await res.json();
            throw new Error(error);
          }
          throw new Error("Failed to fetch post please try again later");
        }

        const fetchedPost = await res.json();

        setPost(fetchedPost);
        console.log(fetchedPost);
      } catch (error) {
        toast.error(error.message);
        navigate(-1, { viewTransition: true });
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId, navigate]);

  if (loading) return <Loader />;

  return (
    <main className={styles.main}>
      <div className={styles.textContainer1}>
        <h2 className={styles.title}>{post?.title}</h2>
        <p className={styles.date}>
          <strong>Created at: </strong>
          {post && format(post.createdAt, "y/M/d, H:m:s")}
        </p>
        <p className={styles.date}>
          <strong>Last updated: </strong>
          {post && formatDistanceToNow(post.updatedAt, { addSuffix: true, includeSeconds: true })}
        </p>
      </div>
      <div className={styles.textContainer2}>
        <p className={styles.likes}>
          <strong>Likes:</strong> {post?.likes}
        </p>
        <p className={styles.published}>{post?.published ? "Published" : "Unpublished"}</p>
      </div>
      <div className={styles.textContainer3}>
        <p>Topics:</p>
        <div>
          {post?.Topics.length === 0 ? (
            <span>This post has no topics</span>
          ) : (
            post?.Topics.map((topic, i) => {
              return <p key={i}>{topic.name}</p>;
            })
          )}
        </div>
      </div>
      <div className={styles.postContent}>
        <img src={post?.imgUrl ? post?.imgUrl : noImage} alt="Post cover" />
        <div className={styles.postContentHtml}>{post && parse(post.content)}</div>
      </div>

      <div className={styles.commentsContainer}></div>
    </main>
  );
}
