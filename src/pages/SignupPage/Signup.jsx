import logBlogIcon from "/images/the-log-blog-icon.svg";
import { Link, useNavigate, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import { useState } from "react";
import Form from "../../components/Form/Form.jsx";
import FormButton from "../../components/FormButton/FormButton.jsx";
import anonymousImage from "../../assets/images/anonymous.jpg";
import styles from "./Signup.module.css";

export default function Signup() {
  const [imagePreview, setImagePreview] = useState(anonymousImage);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setToken } = useOutletContext();
  const navigate = useNavigate();

  async function handleUserSignup(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/sign-up`, {
        method: "post",
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 400) {
          const { errors: badRequestErrors } = await res.json();

          setErrors(badRequestErrors);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }

        throw new Error("Failed to sign up please try again later");
      }

      const { token } = await res.json();

      localStorage.setItem("token", token);
      setToken(localStorage.getItem("token"));

      navigate("/", { viewTransition: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(event) {
    const file = event.currentTarget.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(anonymousImage);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.websiteHeader}>
          <img src={logBlogIcon} alt="The Log Blog icon" />
          <h1>The Log Blog</h1>
        </div>
        <div className={styles.signupHeader}>
          <h2>Create a new account</h2>
        </div>
      </div>
      <Form onSubmit={handleUserSignup}>
        <ul className={styles.errors}>
          {errors.map((error, i) => {
            return <li key={i}>{error.msg}</li>;
          })}
        </ul>
        <div className={styles.formContent}>
          <label>
            First name
            <input type="text" name="firstName" placeholder="First name" required maxLength={255} />
          </label>
          <label>
            Last name
            <input type="text" name="lastName" placeholder="Last name" required maxLength={255} />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="name@email.com" required />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Password" required />
          </label>
          <label>
            Confirm password
            <input type="password" name="confirmPassword" placeholder="Confirm password" required />
          </label>
          <div className={styles.imagePreview}>
            <label htmlFor="imagePreview">Profile picture (optional -- max size 3MB)</label>
            <div>
              <input
                onChange={handleImageChange}
                type="file"
                name="userImage"
                accept="image/*"
                id="imagePreview"
              />
              <img src={imagePreview} alt="Image preview" />
            </div>
          </div>
          <FormButton disabled={loading}>Sign up</FormButton>
          <p>
            Already have an account?{" "}
            <Link to="/log-in" viewTransition>
              Log in
            </Link>
          </p>
        </div>
      </Form>
    </main>
  );
}
