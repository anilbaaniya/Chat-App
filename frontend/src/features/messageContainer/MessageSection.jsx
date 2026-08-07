import { ImBlocked } from "react-icons/im";

import { MdDoneAll } from "react-icons/md";
import { formatConversationTime } from "../../utils/formatConversationTIme";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";

export default function MessageSection({
  messages,
  user,
  messagesEndRef,
  scrollToBottom,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        contextMenu &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setContextMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  function handleRightClick(e, messageId) {
    e.preventDefault();

    setContextMenu({
      messageId,
      x: e.clientX,
      y: e.clientY,
    });
  }
  // console.log(messages[messages.length - 1]);
  // console.log(messages);
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4">
      {messages.map((message) => {
        const senderId =
          typeof message.sender === "string"
            ? message.sender
            : message.sender?._id;

        const isMyMessage = senderId === user._id;

        return (
          <div
            key={message._id}
            className={`relative flex ${isMyMessage ? "justify-end" : "justify-start "}`}
          >
            {!isMyMessage && (
              <IoPersonCircleSharp className="mr-2 mt-1 text-3xl text-gray-400" />
            )}
            <div
              onContextMenu={(e) => handleRightClick(e, message._id)}
              className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow  ${
                isMyMessage
                  ? ` ${message.messageType == "image" || message.messageType == "video" ? " bg-gray-50 text-black" : "bg-indigo-500 text-white"}  rounded-br-md`
                  : "bg-white text-gray-800 rounded-bl-md"
              }`}
            >
              {message.messageType === "text" && <p>{message.text}</p>}
              {message.messageType === "deleted" && (
                <div className="flex items-center gap-2">
                  <ImBlocked />
                  <span>This message was deleted</span>
                </div>
              )}

              {message.messageType === "image" && (
                <img
                  src={message.image}
                  alt="Message"
                  className="max-h-64 rounded-lg"
                  onLoad={scrollToBottom}
                />
              )}
              {message.messageType === "video" && (
                <video
                  src={message.video}
                  controls
                  className="max-h-64 rounded-lg"
                  onLoadedData={scrollToBottom}
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
                  {message.text}
                </a>
              )}

              <div
                className={`mt-1 text-right text-xs ${
                  isMyMessage
                    ? `${message.messageType == "image" || message.messageType == "video" ? "text-black" : "text-blue-100"}`
                    : "text-gray-500"
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
            {contextMenu?.messageId === message._id && (
              <ContextMenu
                message={message}
                setContextMenu={setContextMenu}
                menuRef={menuRef}
                isMyMessage={isMyMessage}
                x={contextMenu.x}
                y={contextMenu.y}
              />
            )}
          </div>
        );
      })}

      {/* Auto-scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
}
