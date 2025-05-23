import { Outlet, useOutletContext } from "react-router";
import Header from "./components/Header/Header";

export default function App() {
  const { user, token, setToken } = useOutletContext();

  return (
    <>
      <Header user={user} setToken={setToken} />
      <Outlet context={{ user, token, setToken }} />
    </>
  );
}
