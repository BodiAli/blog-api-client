import { Link, useNavigate, useOutletContext } from "react-router";
import { format } from "date-fns";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import anonymousImage from "../../assets/images/anonymous.jpg";
import noImage from "../../assets/images/no-image.svg";
import styles from "./Card.module.css";

export default function Card({ post, currentPage, topicQuery, updatePosts }) {
  const { token, user } = useOutletContext();
  const navigate = useNavigate();

  async function handleLikePost(e) {
    e.stopPropagation();

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/like`, {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        if (post.liked) {
          throw new Error("Failed to remove like please try again later");
        } else {
          throw new Error("Failed to like post please try again later");
        }
      }

      if (post.liked) {
        toast.success("Like removed successfully!");
      } else {
        toast.success("Post liked successfully!");
      }

      updatePosts(currentPage, topicQuery);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div
      onClick={() => {
        navigate(`posts/${post.id}`, { viewTransition: true });
      }}
      className={styles.card}
    >
      <div className={styles.text}>
        <div className={styles.textContainer1}>
          <img
            className={styles.profilePic}
            src={post.User.Profile.profileImgUrl ? post.User.Profile.profileImgUrl : anonymousImage}
            alt={`${post.User.firstName} ${post.User.lastName}'s profile picture`}
          />
          <p className={styles.name}>
            {post.User.firstName} {post.User.lastName}
          </p>
          <p className={styles.createdAt}>{format(post.createdAt, "MMM d, y")}</p>
        </div>
        <div className={styles.textContainer2}>
          <p className={styles.title}>{post.title}</p>
        </div>
        <div className={styles.textContainer3}>{parse(post.content)}</div>
        <div className={styles.textContainer4}>
          {post.Topics.length === 0 ? (
            <span>This post has no topics</span>
          ) : (
            post?.Topics.map((topic, i) => {
              return <p key={i}>{topic.name}</p>;
            })
          )}
        </div>
        <div className={styles.textContainer5}>
          <p>
            <strong>Likes: </strong>
            {post.likes}
          </p>
          {!user ? (
            <p className={styles.loginMessage}>
              Please{" "}
              <Link onClick={(e) => e.stopPropagation()} to="log-in" viewTransition>
                Login
              </Link>{" "}
              to be able to like posts
            </p>
          ) : (
            <button
              onClick={handleLikePost}
              className={`${styles.likeButton} ${post.liked ? styles.liked : ""}`}
            ></button>
          )}
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={post.imgUrl ? post.imgUrl : noImage} alt="Post cover" />
      </div>
    </div>
  );
}
