import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getToken, wakeBackend } from "./api";
import AuthPage from "./pages/AuthPage";
import FeedPage from "./pages/FeedPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import MyPostsPage from "./pages/MyPostsPage";
import ClaimPage from "./pages/ClaimPage";
import Support from "./Support";
import Admin from "./Admin";

function Protected({ children }) {
  return getToken() ? children : <Navigate to="/" replace />;
}

export default function App() {
  const [isWaking, setIsWaking] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    wakeBackend(controller.signal).finally(() => {
      if (!controller.signal.aborted) setIsWaking(false);
    });
    return () => controller.abort();
  }, []);

  return (
    <BrowserRouter>
      {isWaking && (
        <div className="server-waking" role="status">
          Waking up the server, this can take up to a minute…
        </div>
      )}
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/feed"
          element={
            <Protected>
              <FeedPage />
            </Protected>
          }
        />
        <Route
          path="/suggestions"
          element={
            <Protected>
              <SuggestionsPage />
            </Protected>
          }
        />
        <Route
          path="/new"
          element={
            <Protected>
              <CreatePostPage />
            </Protected>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <Protected>
              <EditPostPage />
            </Protected>
          }
        />
        <Route
          path="/my-posts"
          element={
            <Protected>
              <MyPostsPage />
            </Protected>
          }
        />
        <Route
          path="/claim/:id"
          element={
            <Protected>
              <ClaimPage />
            </Protected>
          }
        />
        <Route
          path="/support"
          element={
            <Protected>
              <Support />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected>
              <Admin />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
