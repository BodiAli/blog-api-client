import { useRouteError } from "react-router";
import styles from "./ErrorHandler.module.css";

export default function ErrorHandler() {
  const error = useRouteError();

  return (
    <div className={styles.error}>
      <h2>Unexpected error occurred!</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>Reload page</button>
    </div>
  );
}
