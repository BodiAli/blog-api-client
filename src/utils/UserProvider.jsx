import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loader/Loader";

export default function UserProvider() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!token) {
          setUser(null);
          return;
        }

        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/validate`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          throw new Error("Failed to validate token");
        }

        const fetchedUser = await res.json();
        setUser(fetchedUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token]);

  if (loading) return <Loader />;

  return (
    <>
      <Outlet context={{ user, token, setToken }} />
      <ToastContainer hideProgressBar={true} />
    </>
  );
}
