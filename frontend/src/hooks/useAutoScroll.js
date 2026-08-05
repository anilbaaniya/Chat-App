import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export default function useAutoScroll(messages, conversationId) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  useLayoutEffect(() => {
    if (!conversationId) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [conversationId]);

  useEffect(() => {
    const frame = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(frame);
  }, [messages.length, scrollToBottom]);

  return { messagesEndRef, scrollToBottom };
}
