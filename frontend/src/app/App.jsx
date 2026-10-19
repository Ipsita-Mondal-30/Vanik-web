import { BrowserRouter, Routes, Route } from "react-router";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "./components/ui/sonner";
import { RootLayout } from "./layouts/RootLayout";
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
import { Assistant } from "./pages/Assistant";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Landing />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="browse" element={<BrowsePosts />} />
            <Route path="my-posts" element={<MyPosts />} />
            <Route path="post/:id" element={<PostDetails />} />
            <Route path="bids" element={<Bids />} />
            <Route path="my-bids" element={<MyBids />} />
            <Route path="chat/:userId" element={<Chat />} />
            <Route path="messages" element={<Messages />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </AppProvider>
  );
}

export default App;
