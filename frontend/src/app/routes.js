import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { CreatePost } from "./pages/CreatePost";
import { BrowsePosts } from "./pages/BrowsePosts";
import { MyPosts } from "./pages/MyPosts";
import { PostDetails } from "./pages/PostDetails";
import { Bids } from "./pages/Bids";
import { MyBids } from "./pages/MyBids";
import { Chat } from "./pages/Chat";
import { Messages } from "./pages/Messages";
import { RootLayout } from "./layouts/RootLayout";
import { NotFound } from "./pages/NotFound";
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Landing },
      { path: "signup", Component: Signup },
      { path: "login", Component: Login },
      { path: "dashboard", Component: Dashboard },
      { path: "create-post", Component: CreatePost },
      { path: "browse", Component: BrowsePosts },
      { path: "my-posts", Component: MyPosts },
      { path: "post/:id", Component: PostDetails },
      { path: "bids", Component: Bids },
      { path: "my-bids", Component: MyBids },
      { path: "chat/:userId", Component: Chat },
      { path: "messages", Component: Messages },
      { path: "*", Component: NotFound }
    ]
  }
]);
export {
  router
};
