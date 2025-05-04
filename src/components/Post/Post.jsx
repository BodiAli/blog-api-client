import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams, useOutletContext, Link } from "react-router";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import parse from "html-react-parser";
import CommentCard from "../CommentCard/CommentCard";
import Loader from "../Loader/Loader";
import noImage from "../../assets/images/no-image.svg";
import anonymousImage from "../../assets/images/anonymous.jpg";
import styles from "./Post.module.css";
import FormButton from "../FormButton/FormButton";

export default function Post() {
  const [post, dispatch] = useReducer(reducer, null);
  const [loading, setLoading] = useState(true);
  const [invalidInputErrors, setInvalidInputErrors] = useState([]);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { token, user } = useOutletContext();

  async function handleLikePost() {
    if (!post) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/like`, {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        if (post.postLiked) {
          throw new Error("Failed to remove like please try again later");
        } else {
          throw new Error("Failed to like post please try again later");
        }
      }

      if (post.postLiked) {
        toast.success("Like removed successfully!");
      } else {
        toast.success("Post liked successfully!");
      }

      dispatch({
        type: "update-post-like",
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleCreateComment(e) {
    e.preventDefault();

    if (!user) {
      toast.info("You need to login to create a comment");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const content = formData.get("content");

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const { errors } = await res.json();

          setInvalidInputErrors(errors);
          return;
        }

        throw new Error("Failed to create comment please try again later");
      }

      const { msg, comment } = await res.json();

      dispatch({
        type: "create-comment",
        comment,
      });
      toast.success(msg);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${postId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            const { error } = await res.json();
            throw new Error(error);
          }
          throw new Error("Failed to fetch post please try again later");
        }

        const fetchedPost = await res.json();

        dispatch({ type: "set-post", post: fetchedPost });
      } catch (error) {
        toast.error(error.message);
        navigate(-1, { viewTransition: true });
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId, navigate, token]);

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
      <hr />
      <div className={styles.likeContainer}>
        <p className={styles.likes}>
          <strong>Likes:</strong> {post?.likes}
        </p>
        {!user ? (
          <p className={styles.loginMessage} data-testid="login-notice">
            Please{" "}
            <Link to="log-in" viewTransition>
              login
            </Link>{" "}
            to be able to like posts
          </p>
        ) : (
          <button
            data-testid="like-button"
            onClick={handleLikePost}
            className={`${styles.likeButton} ${post?.postLiked ? styles.liked : ""}`}
          ></button>
        )}
      </div>
      <div className={styles.commentsContainer}>
        <h3>Comments</h3>
        <div className={styles.formContainer}>
          <ul className={styles.errors}>
            {invalidInputErrors.map((error, i) => {
              return <li key={i}>{error.msg}</li>;
            })}
          </ul>
          <form onSubmit={handleCreateComment} className={styles.createComment}>
            <img
              src={user.Profile.profileImgUrl ? user.Profile.profileImgUrl : anonymousImage}
              alt={`${user.firstName} ${user.lastName}'s profile picture`}
            />
            <input type="text" name="content" placeholder="Comment on post" required />
            <FormButton>Create</FormButton>
          </form>
        </div>
        <div className={styles.commentsCardContainer}>
          {post?.Comments.map((comment) => {
            return (
              <CommentCard key={comment.id} comment={comment} user={user} dispatch={dispatch} token={token} />
            );
          })}
        </div>
      </div>
    </main>
  );
}

function reducer(post, action) {
  switch (action.type) {
    case "set-post": {
      return action.post;
    }
    case "update-post-like": {
      return { ...post, postLiked: !post.postLiked, likes: post.postLiked ? post.likes - 1 : post.likes + 1 };
    }
    case "create-comment": {
      const updatedComments = [action.comment, ...post.Comments];

      return { ...post, Comments: updatedComments };
    }
    case "update-comment-like": {
      const updatedComments = post.Comments.map((comment) => {
        if (comment.id === action.comment.id) {
          return {
            ...comment,
            commentLiked: !comment.commentLiked,
            likes: comment.commentLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      });
      return { ...post, Comments: updatedComments };
    }
    case "update-comment-content": {
      const updatedComments = post.Comments.map((comment) => {
        if (comment.id === action.comment.id) {
          return { ...comment, content: action.content };
        }
        return comment;
      });

      return { ...post, Comments: updatedComments };
    }
    case "delete-comment": {
      const updatedComments = post.Comments.filter((comment) => {
        return comment.id !== action.comment.id;
      });
      return { ...post, Comments: updatedComments };
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
}
