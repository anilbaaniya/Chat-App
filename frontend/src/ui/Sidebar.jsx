import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";

import Heading from "../features/Sidebar/Heading";
import MessageList from "../features/Sidebar/MessageList";

export default function Sidebar({ conversations }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen border-r-2 border-stone-200">
      {/* Fixed Header */}
      <Heading />

      {/* Scrollable Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {!conversations || conversations.length === 0 ? (
          <div className="p-4 text-gray-500">No conversations yet</div>
        ) : (
          conversations.map((conversation) => (
            <MessageList key={conversation._id} conversation={conversation} />
          ))
        )}
      </div>

      {/* Fixed Profile Section */}
      <div
        onClick={() => navigate("/profile")}
        className="flex items-center gap-3 p-4 border-t border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors"
      >
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <IoPersonCircle className="w-10 h-10 text-gray-400" />
        )}

        <div className="flex flex-col overflow-hidden">
          <span className="font-medium truncate">
            {user?.name || "Profile"}
          </span>
          <span className="text-xs text-gray-500">View Profile</span>
        </div>
      </div>
    </div>
  );
}
