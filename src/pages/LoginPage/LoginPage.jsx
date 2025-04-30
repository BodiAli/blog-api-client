import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router";
import { toast } from "react-toastify";
import Form from "../../components/Form/Form";
import FormButton from "../../components/FormButton/FormButton";
import logBlogIcon from "/images/the-log-blog-icon.svg";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [errors, setErrors] = useState([]);
  const { user, setToken } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      toast.info("You are already signed in.");
      navigate("/", { viewTransition: true });
    }
  }, [user, navigate]);

  async function handleUserLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const { errors: badRequestErrors } = await res.json();
          setErrors(badRequestErrors);
          return;
        }

        if (res.status === 401) {
          const { error: unauthorizedError } = await res.json();
          setErrors([{ msg: unauthorizedError }]);
          return;
        }

        throw new Error("Failed to log in please try again later");
      }

      const { token } = await res.json();

      localStorage.setItem("token", token);
      setToken(localStorage.getItem("token"));

      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.websiteHeader}>
          <img src={logBlogIcon} alt="The Log Blog icon" />
          <h1>The Log Blog</h1>
        </div>
        <div className={styles.loginHeader}>
          <h2>
            Log in to your account <span>(Public)</span>
          </h2>
        </div>
      </div>
      <Form onSubmit={handleUserLogin}>
        <ul className={styles.errors}>
          {errors.map((error, i) => {
            return <li key={i}>{error.msg}</li>;
          })}
        </ul>
        <div className={styles.formContent}>
          <label>
            Email
            <input type="email" name="email" placeholder="name@email.com" required />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Password" required />
          </label>
          <FormButton>Log in</FormButton>
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" viewTransition>
              Sign up
            </Link>
          </p>
        </div>
      </Form>
    </main>
  );
}
