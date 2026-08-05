import { IoPersonCircleSharp } from "react-icons/io5";
import { formatConversationTime } from "../../utils/formatConversationTIme";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "../../redux/conversation/conversationSlice";
import { fetchMessages } from "../../redux/message/messageSlice";

export default function MessageList({ conversation }) {
  const dispatch = useDispatch();

  const isTyping = useSelector(
    (state) =>
      state.conversation.typingConversations?.[conversation._id] ?? false,
  );

  function handleClick() {
    {
      dispatch(setSelectedConversation(conversation));
      dispatch(fetchMessages(conversation._id));
    }
  }
  let lastMessage = "Start a conversation";

  if (conversation.lastMessage) {
    if (conversation.lastMessage.text) {
      lastMessage = conversation.lastMessage.text;
    } else {
      switch (conversation.lastMessage.messageType) {
        case "image":
          lastMessage = "📷 Photo";
          break;

        case "video":
          lastMessage = "🎥 Video";
          break;

        case "file":
          lastMessage = "📄 File";
          break;

        default:
          lastMessage = "Message";
      }
    }
  }
  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between py-4 pl-6 pr-8 mx-2 hover:bg-gray-100 cursor-pointer transition-all duration-200 rounded-xl"
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <IoPersonCircleSharp className="text-5xl text-gray-400" />

        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold text-lg">
            {conversation.user.name}
          </span>
          {isTyping ? (
            <span className="text-green-500 font-bold truncate">typing...</span>
          ) : (
            <span className="text-gray-500 text-sm truncate">
              {lastMessage}
            </span>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-gray-500">
          {formatConversationTime(conversation.lastMessageAt)}
        </span>

        {conversation.unreadCount > 0 && (
          <span className="flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-indigo-600 text-white text-xs font-semibold">
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </div>
  );
}
