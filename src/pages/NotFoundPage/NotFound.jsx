import { Link } from "react-router";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <h1>404 Not found</h1>
      <p>
        Looks like you&apos;re lost! <Link to="/">Head back.</Link>
      </p>
    </main>
  );
}
