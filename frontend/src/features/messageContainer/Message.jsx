import { useDispatch, useSelector } from "react-redux";
import EmptyChat from "./EmptyChat";
import {
  markConversationAsSeen,
  sendMessage,
} from "../../redux/message/messageSlice";
import { useEffect } from "react";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessageSection from "./MessageSection";
import useMessageSocket from "../../hooks/useMessageSocket";
import useTyping from "../../hooks/useTyping";
import useAutoScroll from "../../hooks/useAutoScroll";

export default function Message() {
  const dispatch = useDispatch();

  const { messages } = useSelector((state) => state.message);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.auth);

  const { text, setText, handleInputChange, stopTyping } =
    useTyping(selectedConversation);

  useMessageSocket(selectedConversation?._id);
  const messagesEndRef = useAutoScroll(messages, selectedConversation?._id);

  useEffect(() => {
    if (!selectedConversation) return;

    dispatch(markConversationAsSeen(selectedConversation._id));
  }, [selectedConversation?._id, selectedConversation, dispatch]);

  if (!selectedConversation) {
    return <EmptyChat />;
  }

  function handleSendMessage() {
    if (!text.trim()) return;

    // Stop typing immediately
    stopTyping();

    const messageOptions = {
      conversationId: selectedConversation._id,
      receiverId: selectedConversation.user._id,
      messageType: "text",
      text: text.trim(),
    };

    dispatch(sendMessage(messageOptions));

    setText("");
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}

      <MessageHeader />

      {/* Messages */}
      <MessageSection
        messages={messages}
        user={user}
        messagesEndRef={messagesEndRef}
      />

      {/* Input */}
      <MessageInput
        text={text}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}
