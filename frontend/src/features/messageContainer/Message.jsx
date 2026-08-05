import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyChat from "./EmptyChat";
import {
  markConversationAsSeen,
  sendMessage,
} from "../../redux/message/messageSlice";
import axios from "axios";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessageSection from "./MessageSection";
import useMessageSocket from "../../hooks/useMessageSocket";
import useTyping from "../../hooks/useTyping";
import useAutoScroll from "../../hooks/useAutoScroll";
import { getSignatureForUpload } from "../../services/getSignature";

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

  async function uploadFile(file, timestamp, signature, folder) {
    const data = new FormData();

    data.append("file", file);
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    data.append("folder", folder);

    try {
      const cloudName = import.meta.env.VITE_CLOUD_NAME;
      const resourceType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "raw";

      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      return res.data.secure_url;
    } catch (error) {
      console.log(error.response?.data);
      throw error;
    }
  }

  function getMessageType(file) {
    if (file.type.startsWith("image/")) {
      return "image";
    }

    if (file.type.startsWith("video/")) {
      return "video";
    }

    return "file";
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

        const { timestamp, signature } =
          await getSignatureForUpload(uploadFolder);

        if (!timestamp || !signature) {
          throw new Error("Failed to get upload signature.");
        }

        url = await uploadFile(
          selectedFile,
          timestamp,
          signature,
          uploadFolder,
        );
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

      dispatch(sendMessage(messageOptions));

      setText("");
      setSelectedFile(null);
    } catch (error) {
      console.log(error);
      throw error;
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
