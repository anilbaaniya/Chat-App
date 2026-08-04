// hooks/useTyping.js

import { useRef, useState } from "react";
import { socket } from "../socket/socket";

export default function useTyping(selectedConversation) {
  const [text, setText] = useState("");

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!selectedConversation) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;

      socket.emit("typing", {
        conversationId: selectedConversation._id,
        receiverId: selectedConversation.user._id,
      });
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;

      socket.emit("stop-typing", {
        conversationId: selectedConversation._id,
        receiverId: selectedConversation.user._id,
      });
    }, 1000);
  };

  const stopTyping = () => {
    clearTimeout(typingTimeoutRef.current);

    if (!isTypingRef.current || !selectedConversation) return;

    socket.emit("stop-typing", {
      conversationId: selectedConversation._id,
      receiverId: selectedConversation.user._id,
    });

    isTypingRef.current = false;
  };

  return {
    text,
    setText,
    handleInputChange,
    stopTyping,
  };
}
