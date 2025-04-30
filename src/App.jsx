import { useOutletContext } from "react-router";
import "./App.css";

export default function App() {
  const { user } = useOutletContext();
  console.log("App", user);
  return (
    <>
      <h1>Hello, World!</h1>
    </>
  );
}
