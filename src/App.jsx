import { Outlet, useOutletContext } from "react-router";
import Header from "./components/Header/Header";

export default function App() {
  const { user, setToken } = useOutletContext();

  return (
    <>
      <Header user={user} setToken={setToken} />
      <Outlet context={{ user, setToken }} />
    </>
  );
}
