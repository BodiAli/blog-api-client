import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

export default function UserProvider() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        if (!token) {
          setUser(null);
          return;
        }
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

  if (loading) return <p>loading...</p>;

  return (
    <>
      <Outlet context={{ user, setToken }} />
      <ToastContainer hideProgressBar={true} />
    </>
  );
}
