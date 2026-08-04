import { useEffect, useRef } from "react";

export default function useAutoScroll(messages, conversationId) {
  const messagesEndRef = useRef(null);

  // Instantly scroll to bottom when opening a conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [conversationId]);

  // Smoothly scroll when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return messagesEndRef;
}
