import { IoPersonCircleSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

export default function MessageHeader() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  //   const { user } = useSelector((state) => state.auth);

  const { onlineUsers } = useSelector((state) => state.presence);
  const isOnline = onlineUsers.includes(selectedConversation?.user._id);

  const isTyping = useSelector(
    (state) =>
      state.conversation.typingConversations?.[selectedConversation?._id] ??
      false,
  );

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <IoPersonCircleSharp className="text-5xl text-gray-400" />

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedConversation.user.name}
          </h2>

          <p
            className={`text-sm ${
              isTyping
                ? "text-green-600"
                : isOnline
                  ? "text-green-600"
                  : "text-gray-500"
            }`}
          >
            {isTyping ? "Typing..." : isOnline ? "● Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
