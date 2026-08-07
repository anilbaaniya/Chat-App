import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyChat from "./EmptyChat";
import {
  markConversationAsSeen,
  sendMessage,
} from "../../redux/message/messageSlice";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessageSection from "./MessageSection";
import useMessageSocket from "../../hooks/useMessageSocket";
import useTyping from "../../hooks/useTyping";
import useAutoScroll from "../../hooks/useAutoScroll";
import { uploadToCloudinary } from "../../services/cloudinaryService";
import { getMessageType } from "../../utils/getMessageType";
import toast from "react-hot-toast";

export default function Message() {
  const [sending, setSending] = useState(false);

  const dispatch = useDispatch();

  const { messages } = useSelector((state) => state.message);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.auth);

  const [selectedFile, setSelectedFile] = useState(null);

  const { text, setText, handleInputChange, stopTyping } =
    useTyping(selectedConversation);

  useMessageSocket(selectedConversation?._id);
  const { messagesEndRef, scrollToBottom } = useAutoScroll(
    messages,
    selectedConversation?._id,
  );

  useEffect(() => {
    if (!selectedConversation) return;

    dispatch(markConversationAsSeen(selectedConversation._id));
  }, [selectedConversation?._id, selectedConversation, dispatch]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setText("");
    setSelectedFile(file);
  }

  async function handleSendMessage() {
    if (!text.trim() && !selectedFile) return;
    setSending(true);

    try {
      let url = "";
      let messageType = "text";

      if (selectedFile) {
        messageType = getMessageType(selectedFile);
        const uploadFolder = "chatApp";
        url = await uploadToCloudinary(selectedFile, uploadFolder);
      }

      stopTyping();

      const messageOptions = {
        conversationId: selectedConversation._id,
        receiverId: selectedConversation.user._id,
        messageType,
        text: text.trim(),
      };

      if (url) {
        messageOptions[messageType] = url;
      }

      if (messageType === "file") {
        messageOptions.text = selectedFile.name;
      }

      await dispatch(sendMessage(messageOptions)).unwrap();

      setText("");
      setSelectedFile(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message.");
      // throw error;
    } finally {
      setSending(false);
    }
  }

  if (!selectedConversation) {
    return <EmptyChat />;
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
        scrollToBottom={scrollToBottom}
      />

      {/* Input */}
      <MessageInput
        text={text}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        handleFileChange={handleFileChange}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        sending={sending}
      />
    </div>
  );
}
