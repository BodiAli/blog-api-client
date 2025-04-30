import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { toast } from "react-toastify";

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
    <form onSubmit={handleUserLogin}>
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button type="submit">Submit</button>
    </form>
  );
}
