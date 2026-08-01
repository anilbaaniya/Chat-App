import { IoPersonCircleSharp, IoSend, IoAttach } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MdDoneAll } from "react-icons/md";

import EmptyChat from "./EmptyChat";
import { useState } from "react";
import {
  addMessage,
  markConversationAsSeen,
  messagesSeen,
  sendMessage,
} from "../../redux/message/messageSlice";
import { useEffect } from "react";
import { socket } from "../../socket/socket";
import { useRef } from "react";
import { formatConversationTime } from "../../utils/formatConversationTIme";

export default function Message() {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const dispatch = useDispatch();

  const { messages } = useSelector((state) => state.message);
  console.log(messages);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!selectedConversation) return;

    dispatch(markConversationAsSeen(selectedConversation._id));
  }, [selectedConversation?._id, selectedConversation, dispatch]);

  // Instantly scroll to bottom when opening a conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [selectedConversation?._id]);

  // Smoothly scroll when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      // Only add the message if it belongs to the currently opened conversation
      if (message.conversationId === selectedConversation?._id) {
        dispatch(addMessage(message));
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [dispatch, selectedConversation]);

  useEffect(() => {
    const handleMessagesSeen = ({ conversationId, messageIds, seenAt }) => {
      // Ignore events for other conversations
      if (conversationId !== selectedConversation?._id) return;

      dispatch(
        messagesSeen({
          messageIds,
          seenAt,
        }),
      );
    };

    socket.on("messages-seen", handleMessagesSeen);

    return () => {
      socket.off("messages-seen", handleMessagesSeen);
    };
  }, [dispatch, selectedConversation]);

  if (!selectedConversation) {
    return <EmptyChat />;
  }

  // const formatTime = (date) => {
  //   return new Date(date).toLocaleTimeString([], {
  //     hour: "numeric",
  //     minute: "2-digit",
  //   });
  // };

  function handleSendMessage() {
    if (!text.trim()) return;

    const messageOptions = {
      conversationId: selectedConversation._id,
      receiverId: selectedConversation.user._id,
      messageType: "text",
      text,
    };

    dispatch(sendMessage(messageOptions));
    setText("");
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <IoPersonCircleSharp className="text-5xl text-gray-400" />

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedConversation.user.name}
            </h2>

            <p className="text-sm text-green-600">● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => {
          const senderId =
            typeof message.sender === "string"
              ? message.sender
              : message.sender?._id;

          const isMyMessage = senderId === user._id;

          return (
            <div
              key={message._id}
              className={`flex ${
                isMyMessage ? "justify-end" : "justify-start"
              }`}
            >
              {!isMyMessage && (
                <IoPersonCircleSharp className="mr-2 mt-1 text-3xl text-gray-400" />
              )}

              <div
                className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow ${
                  isMyMessage
                    ? "bg-indigo-500 text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md"
                }`}
              >
                {message.messageType === "text" && <p>{message.text}</p>}

                {message.messageType === "image" && (
                  <img
                    src={message.image}
                    alt="Message"
                    className="max-h-64 rounded-lg"
                  />
                )}

                {message.messageType === "file" && (
                  <a
                    href={message.file}
                    target="_blank"
                    rel="noreferrer"
                    className={`underline ${
                      isMyMessage ? "text-blue-100" : "text-blue-600"
                    }`}
                  >
                    View File
                  </a>
                )}

                <div
                  className={`mt-1 text-right text-xs ${
                    isMyMessage ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  <span>{formatConversationTime(message.createdAt)}</span>
                  {isMyMessage && (
                    <MdDoneAll
                      size={18}
                      className={
                        message.isSeen ? "text-sky-400" : "text-gray-300"
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Auto-scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3 rounded-full border border-gray-300 px-4 py-2">
          <button className="cursor-pointer text-gray-500 hover:text-blue-300">
            <IoAttach className="text-xl" />
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none"
          />

          <button
            onClick={handleSendMessage}
            className="cursor-pointer rounded-full bg-indigo-500 p-2 text-white transition hover:bg-indigo-700"
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}
