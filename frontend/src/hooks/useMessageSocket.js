// src/hooks/useMessageSocket.js

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket/socket";
import {
  addMessage,
  markConversationAsSeen,
  messagesSeen,
} from "../redux/message/messageSlice";
import {
  typingStarted,
  typingStopped,
} from "../redux/conversation/conversationSlice";

export default function useMessageSocket(conversationId) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!conversationId) return;

    const handleReceiveMessage = (message) => {
      if (message.conversationId !== conversationId) return;

      dispatch(addMessage(message));
      dispatch(markConversationAsSeen(message.conversationId));
    };

    const handleMessagesSeen = ({ conversationId: id, messageIds, seenAt }) => {
      if (id !== conversationId) return;

      dispatch(
        messagesSeen({
          messageIds,
          seenAt,
        }),
      );
    };

    const handleTyping = ({ conversationId: id }) => {
      if (id !== conversationId) return;

      dispatch(typingStarted({ conversationId: id }));
    };

    const handleStopTyping = ({ conversationId: id }) => {
      if (id !== conversationId) return;

      dispatch(typingStopped({ conversationId: id }));
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("messages-seen", handleMessagesSeen);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("messages-seen", handleMessagesSeen);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [conversationId, dispatch]);
}
