// src/hooks/useMessageSocket.js

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket/socket";
import {
  addMessage,
  markConversationAsSeen,
  messageDeleteToEveryone,
  messageDeleteToMe,
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

    const handleMessageDeleteToEveryone = (deletedMessage) => {
      if (deletedMessage.conversationId !== conversationId) return;
      dispatch(messageDeleteToEveryone(deletedMessage));
    };

    const handleMessageDeleteToMe = (deletedMessage) => {
      if (deletedMessage.conversationId !== conversationId) return;
      dispatch(messageDeleteToMe(deletedMessage));
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("messages-seen", handleMessagesSeen);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);
    socket.on("message-deleted-to-everyone", handleMessageDeleteToEveryone);
    socket.on("message-deleted-to-me", handleMessageDeleteToMe);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("messages-seen", handleMessagesSeen);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
      socket.off("message-deleted-to-everyone", handleMessageDeleteToEveryone);
      socket.off("message-deleted-to-me", handleMessageDeleteToMe);
    };
  }, [conversationId, dispatch]);
}
