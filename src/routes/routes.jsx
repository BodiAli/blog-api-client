import UserProvider from "../utils/UserProvider";
import App from "../App";
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
            path: "about",
            Component: AboutPage,
          },
        ],
      },
    ],
  },
];

export default routes;
