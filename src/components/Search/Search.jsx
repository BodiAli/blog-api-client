import styles from "./Search.module.css";

export default function Search({ onChange, value }) {
  return (
    <div className={styles.container}>
      <label htmlFor="search">Search by topic</label>
      <input onChange={onChange} value={value} type="search" id="search" />
    </div>
  );
}
