import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import anonymousImage from "../../assets/images/anonymous.jpg";
import optionsIcon from "../../assets/images/dots-vertical.svg";
import editIcon from "../../assets/images/edit.svg";
import deleteIcon from "../../assets/images/delete.svg";
import styles from "./CommentCard.module.css";

export default function CommentCard({ comment, user, token, dispatch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [invalidInputErrors, setInvalidInputErrors] = useState([]);

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

  async function handleUpdateComment(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const content = formData.get("content");

    try {
      setUpdateLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/posts/${comment.postId}/comments/${comment.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!res.ok) {
        if (res.status === 400) {
          const { errors } = await res.json();

          setInvalidInputErrors(errors);
          return;
        }
        throw new Error("Failed to update comment please try again later");
      }

      const { msg } = await res.json();

      dispatch({ type: "update-comment-content", comment, content });

      toast.success(msg);
      setIsEditing(false);
      setInvalidInputErrors([]);
    } catch (error) {
      toast.error(error.message);
      setIsEditing(false);
    } finally {
      setUpdateLoading(false);
    }
  }

  async function handleDeleteComment() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/posts/${comment.postId}/comments/${comment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete comment please try again later");
      }

      dispatch({ type: "delete-comment", comment });
      toast.success("Comment deleted successfully!");
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
              <div
                className={styles.folderEdit}
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <img src={editIcon} alt="Edit comment" />
                <button>Edit</button>
              </div>
              <div onClick={handleDeleteComment} className={styles.folderDelete}>
                <img src={deleteIcon} alt="delete comment" />
                <button>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.container2}>
        {isEditing ? (
          <form onSubmit={handleUpdateComment} className={styles.editForm}>
            <div>
              <input type="text" name="content" defaultValue={comment.content} required />
              <button
                className={styles.cancel}
                type="button"
                onClick={() => {
                  setInvalidInputErrors([]);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <button
                className={`${styles.confirm} ${updateLoading ? styles.disabled : ""}`}
                disabled={updateLoading}
                type="submit"
              >
                Confirm
              </button>
            </div>
            <ul className={styles.errors}>
              {invalidInputErrors.map((error, i) => {
                return <li key={i}>{error.msg}</li>;
              })}
            </ul>
          </form>
        ) : (
          <p>{comment.content}</p>
        )}
      </div>
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
