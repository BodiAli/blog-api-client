import { Link } from "react-router";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import anonymousImage from "../../assets/images/anonymous.jpg";
import optionsIcon from "../../assets/images/dots-vertical.svg";
import editIcon from "../../assets/images/edit.svg";
import deleteIcon from "../../assets/images/delete.svg";
import styles from "./CommentCard.module.css";

export default function CommentCard({ comment, user, token, dispatch }) {
  async function handleLikeComment() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/posts/${comment.postId}/comments/${comment.id}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!res.ok) {
        if (comment.commentLiked) {
          throw new Error("Failed to remove like please try again later");
        } else {
          throw new Error("Failed to like comment please try again later");
        }
      }

      if (comment.commentLiked) {
        toast.success("Like removed successfully!");
      } else {
        toast.success("Comment liked successfully!");
      }

      dispatch({ type: "update-comment-like", comment });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.container1}>
        <div className={styles.commentUserInfo}>
          <img
            src={comment.User.Profile.profileImgUrl ? comment.User.Profile.profileImgUrl : anonymousImage}
            alt={`${comment.User.firstName} ${comment.User.lastName}'s profile picture`}
          />
          <p className={styles.name}>
            {comment.User.firstName} {comment.User.lastName}
          </p>
          <p className={styles.createdAt}>
            {formatDistanceToNow(comment.updatedAt, { addSuffix: true, includeSeconds: true })}
          </p>
        </div>
        {comment.userId === user.id && (
          <div className={styles.dropdown}>
            <button className={styles.dropBtn}>
              <img src={optionsIcon} alt="options" />
            </button>
            <div className={styles.dropdownContent}>
              <div className={styles.folderEdit}>
                <img src={editIcon} alt="Edit comment" />
                <button>Edit</button>
              </div>
              <div className={styles.folderDelete}>
                <img src={deleteIcon} alt="delete comment" />
                <button>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.container2}>{comment.content}</div>
      <div className={styles.likeContainer}>
        <p className={styles.likes}>
          <strong>Likes:</strong> {comment.likes}
        </p>
        {!user ? (
          <p className={styles.loginMessage} data-testid="login-notice-comment">
            Please{" "}
            <Link to="log-in" viewTransition>
              login
            </Link>{" "}
            to be able to like comment
          </p>
        ) : (
          <button
            data-testid="like-button-comment"
            onClick={handleLikeComment}
            className={`${styles.likeButton} ${comment.commentLiked ? styles.liked : ""}`}
          ></button>
        )}
      </div>
    </div>
  );
}
