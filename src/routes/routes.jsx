import UserProvider from "../utils/UserProvider";
import App from "../App";
import LoginPage from "../pages/LoginPage/LoginPage";

const routes = [
  {
    Component: UserProvider,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            path: "log-in",
            Component: LoginPage,
          },
        ],
      },
    ],
  },
];

export default routes;
