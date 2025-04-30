import logBlogIcon from "/images/the-log-blog-icon.svg";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <img src={logBlogIcon} alt="The Log Blog icon" />
        <h1>The Log Blog</h1>
      </div>
      <p className={styles.paragraph}>
        Welcome to The Log Blog, your all-in-one platform for sharing stories, sparking conversations, and
        taking control of your online presence. Whether you’re a seasoned writer or just getting started, The
        Log Blog makes it effortless to craft beautiful posts, engage with a vibrant community through
        comments, and organize your content with our intuitive management tools. From drafting your first idea
        to tracking reader feedback, we give you everything you need to grow your voice and connect with
        like-minded bloggers. Join us at The Log Blog—where your story isn’t just written, it’s celebrated.
      </p>
    </main>
  );
}
