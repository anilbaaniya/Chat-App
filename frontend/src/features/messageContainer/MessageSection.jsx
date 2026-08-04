import { MdDoneAll } from "react-icons/md";
import { formatConversationTime } from "../../utils/formatConversationTIme";
import { IoPersonCircleSharp } from "react-icons/io5";

export default function MessageSection({ messages, user, messagesEndRef }) {
  return (
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
            className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
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
  );
}
