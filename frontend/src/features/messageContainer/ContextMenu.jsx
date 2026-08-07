import { useDispatch } from "react-redux";
import {
  deleteMessageForEveryone,
  deleteMessageForMe,
} from "../../redux/message/messageSlice";
import { RiDeleteBinLine } from "react-icons/ri";

export default function ContextMenu({
  isMyMessage,
  menuRef,
  message,
  setContextMenu,
}) {
  const dispatch = useDispatch();

  async function handleDeleteEveryone() {
    try {
      await dispatch(deleteMessageForEveryone(message._id)).unwrap();
      setContextMenu(null);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteMe() {
    try {
      await dispatch(deleteMessageForMe(message._id)).unwrap();
      setContextMenu(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
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
          text-left text-sm font-medium text-gray-700
          transition-colors duration-150
          hover:bg-gray-100
          active:bg-gray-200
        "
      >
        <RiDeleteBinLine className="text-lg text-gray-500" />
        <span>Delete for me</span>
      </button>

      {/* Delete for everyone */}
      {isMyMessage && (
        <button
          onClick={handleDeleteEveryone}
          className="
            flex w-full items-center gap-3
            px-4 py-2.5
            text-left text-sm font-medium text-red-600
            hover:bg-red-50
            active:bg-red-100
          "
        >
          <RiDeleteBinLine className="text-lg" />
          <span>Delete for everyone</span>
        </button>
      )}
    </div>
  );
}
