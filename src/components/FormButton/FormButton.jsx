import styles from "./FormButton.module.css";

export default function FormButton({ children, disabled }) {
  return (
    <button
      disabled={disabled}
      className={`${styles.button} ${disabled ? styles.disabled : ""}`}
      type="submit"
    >
      {children}
    </button>
  );
}
