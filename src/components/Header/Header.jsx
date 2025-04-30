import logBlogIcon from "/images/the-log-blog-icon.svg";
import { NavLink } from "react-router";
import anonymousImage from "../../assets/images/anonymous.jpg";
import styles from "./Header.module.css";

export default function Header({ user, setToken }) {
  function handleUserLogout() {
    localStorage.removeItem("token");
    setToken(localStorage.getItem("token"));
  }

  return (
    <header className={styles.header}>
      <div className={styles.websiteLogo}>
        <img src={logBlogIcon} alt="The Log Blog icon" />
        <span>The Log Blog</span>
      </div>
      <nav className={`${styles.nav} ${user ? styles.user : ""}`}>
        <NavLink to="/" viewTransition>
          Home
        </NavLink>
        {!user && (
          <NavLink to="log-in" viewTransition>
            Login
          </NavLink>
        )}
        <a href="#">Manage your posts</a>
        <NavLink to="about" viewTransition>
          About
        </NavLink>
      </nav>
      {user && (
        <div className={styles.profile}>
          <p>
            Welcome, {user.firstName} {user.lastName}
          </p>
          <img
            src={user.Profile.profileImgUrl ? user.Profile.profileImgUrl : anonymousImage}
            alt="User profile picture"
          />
          <button onClick={handleUserLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}
