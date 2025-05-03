import UserProvider from "../utils/UserProvider";
import App from "../App";
import Signup from "../pages/SignupPage/Signup";
import LoginPage from "../pages/LoginPage/LoginPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import NotFound from "../pages/NotFoundPage/NotFound";
import Posts from "../components/Posts/Posts";
import Post from "../components/Post/Post";
import ErrorHandler from "../components/ErrorHandler/ErrorHandler";

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
            ErrorBoundary: ErrorHandler,
            children: [
              {
                index: true,
                Component: Posts,
              },
              {
                path: "posts/:postId",
                Component: Post,
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
    ],
  },
];

export default routes;
