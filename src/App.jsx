import { Outlet, useOutletContext } from "react-router";
import "./App.css";

export default function App() {
  const { user, setToken } = useOutletContext();
  console.log("App", user);
  return (
    <>
      <header>
        <p>HEADER</p>
      </header>
      <Outlet context={{ user, setToken }} />
    </>
  );
}
