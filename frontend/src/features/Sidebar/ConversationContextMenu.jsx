import { useDispatch } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { deleteConversationForMe } from "../../redux/conversation/conversationSlice";

export default function ConversationContextMenu({
  menuRef,
  conversation,
  setContextMenu,
}) {
  const dispatch = useDispatch();

  async function handleDeleteMe() {
    try {
      await dispatch(deleteConversationForMe(conversation._id));
      setContextMenu(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={menuRef}
      className="
        absolute top-8 z-50
        w-52
        overflow-hidden
        rounded-xl
        border border-gray-200
        bg-white
        py-1.5
        shadow-xl
      "
    >
      {/* Delete for me */}
      <button
        onClick={handleDeleteMe}
        className="
            flex w-full items-center gap-3
            px-4 py-2.5
            text-left text-sm font-medium text-red-600
            transition-colors duration-150
            hover:bg-red-50
            active:bg-red-100
          "
      >
        <RiDeleteBinLine className="text-lg" />
        <span>Delete conversation</span>
      </button>
    </div>
  );
}
