import { IoPersonCircleSharp, IoSend, IoAttach } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

import EmptyChat from "./EmptyChat";
import { useState } from "react";
import { sendMessage } from "../../redux/message/messageSlice";

export default function Message() {
  const [text, setText] = useState("");

  const dispatch = useDispatch();

  const { messages } = useSelector((state) => state.message);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.auth);

  console.log(messages);
  console.log(selectedConversation);

  if (!selectedConversation) {
    return <EmptyChat />;
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

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
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.map((message) => {
          const isMyMessage = message.sender._id === user._id;

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
                className={`max-w-xs rounded-2xl px-4 py-3 shadow lg:max-w-md ${
                  isMyMessage
                    ? "rounded-br-md bg-blue-600 text-white"
                    : "rounded-bl-md bg-white text-gray-800"
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

                <p
                  className={`mt-1 text-right text-xs ${
                    isMyMessage ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3 rounded-full border border-gray-300 px-4 py-2">
          <button className="cursor-pointer text-gray-500 hover:text-blue-600">
            <IoAttach className="text-xl" />
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none"
          />

          <button
            onClick={handleSendMessage}
            className="cursor-pointer rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700"
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}
