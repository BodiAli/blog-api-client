import { format } from "date-fns";
import parse from "html-react-parser";
import anonymousImage from "../../assets/images/anonymous.jpg";
import noImage from "../../assets/images/no-image.svg";
import styles from "./Card.module.css";

export default function Card({ post }) {
  return (
    <div className={styles.card}>
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
          <p className={styles.createdAt}> {format(post.createdAt, "y/M/d, H:m:s")} </p>
        </div>
        <div className={styles.textContainer2}>
          <p className={styles.title}>{post.title}</p>
        </div>
        <div className={styles.textContainer3}>{parse(post.content)}</div>
        <div className={styles.textContainer4}>
          <div>
            {post.Topics.length === 0 ? (
              <span>This post has no topics</span>
            ) : (
              post?.Topics.map((topic, i) => {
                return <p key={i}>{topic.name}</p>;
              })
            )}
          </div>
        </div>
        <div className={styles.textContainer5}>
          <p>
            <strong>Likes: </strong>
            {post.likes}
          </p>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={post.imgUrl ? post.imgUrl : noImage} alt="Post cover" />
      </div>
    </div>
  );
}
