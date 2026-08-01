import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { useEffect } from "react";
import { socket } from "./socket/socket";
import { fetchConversations } from "./redux/conversation/conversationSlice";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  // console.log(user);
  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("join-chat", user._id);
    socket.on("conversation-updated", () => {
      dispatch(fetchConversations());
    });

    return () => {
      socket.off("conversation-updated");
      socket.disconnect();
    };
  }, [user, dispatch]);

  if (loading) {
    <TailSpin height="60" width="60" color="#2563eb" ariaLabel="loading" />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
