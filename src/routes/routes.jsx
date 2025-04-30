import UserProvider from "../utils/UserProvider";
import App from "../App";
import Signup from "../pages/SignupPage/Signup";
import LoginPage from "../pages/LoginPage/LoginPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import NotFound from "../pages/NotFoundPage/NotFound";

const routes = [
  {
    Component: UserProvider,
    ErrorBoundary: NotFound,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            index: true,
            element: <p>HIII</p>,
          },
          {
            path: "log-in",
            Component: LoginPage,
          },
          {
            path: "sign-up",
            Component: Signup,
          },
          {
            path: "about",
            Component: AboutPage,
          },
        ],
      },
    ],
  },
];

export default routes;
