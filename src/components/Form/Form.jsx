import styles from "./Form.module.css";

export default function Form({ children, onSubmit }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
