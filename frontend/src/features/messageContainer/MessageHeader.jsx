import { IoPersonCircle } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MessageHeader() {
  const navigate = useNavigate();
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
      <div
        onClick={() => navigate("/otherProfile")}
        className="flex items-center gap-2 cursor-pointer"
      >
        {selectedConversation.user?.profilePicture ? (
          <img
            src={selectedConversation.user.profilePicture}
            alt={selectedConversation.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <IoPersonCircle className="w-10 h-10 text-gray-400" />
        )}

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
