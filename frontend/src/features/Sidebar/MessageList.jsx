import { IoPersonCircleSharp } from "react-icons/io5";
import { formatConversationTime } from "../../utils/formatConversationTIme";
import { useDispatch } from "react-redux";
import { setSelectedConversation } from "../../redux/conversation/conversationSlice";
import { fetchMessages } from "../../redux/message/messageSlice";

export default function MessageList({ conversation }) {
  const dispatch = useDispatch();
  function handleClick() {
    {
      dispatch(setSelectedConversation(conversation));
      dispatch(fetchMessages(conversation._id));
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

          <span className="text-gray-500 text-sm truncate">
            {conversation.lastMessage?.text || "Start a conversation"}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-gray-500">
          {formatConversationTime(conversation.lastMessageAt)}
        </span>

        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-semibold">
          3
        </span>
      </div>
    </div>
  );
}
