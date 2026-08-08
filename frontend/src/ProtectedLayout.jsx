import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { useEffect } from "react";
import { socket } from "./socket/socket";
import {
  fetchConversations,
  updateConversation,
} from "./redux/conversation/conversationSlice";
import { setOnlineUsers } from "./redux/presence/presenceSlice";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  // console.log({
  //   loading,
  //   isAuthenticated,
  //   user,
  // });
  // console.log(user);
  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("join-chat", user._id);
    socket.on("conversation-updated", () => {
      dispatch(fetchConversations());
    });
    socket.on("online-users", (users) => {
      // `users` is an array of online user IDs (strings)
      dispatch(setOnlineUsers(users));

      // console.log("online-users:", users);
    });

    return () => {
      socket.off("conversation-updated");
      socket.off("online-users");
      socket.disconnect();
    };
  }, [user, dispatch]);

  useEffect(() => {
    const handleConversationUpdated = ({
      conversationId,
      unreadCount,
      lastMessage,
    }) => {
      dispatch(
        updateConversation({
          conversationId,
          unreadCount,
          lastMessage,
        }),
      );
    };

    socket.on("unreadMessages-updated", handleConversationUpdated);

    return () => {
      socket.off("unreadMessages-updated", handleConversationUpdated);
    };
  }, [dispatch]);

  const isAuthChecking = loading && !user && !isAuthenticated;

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <TailSpin height="60" width="60" color="#2563eb" ariaLabel="loading" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
