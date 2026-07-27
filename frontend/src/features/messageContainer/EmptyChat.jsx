import { IoChatboxEllipsesOutline } from "react-icons/io5";

export default function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white  border border-stone-200 px-6 m-2">
      {/* Icon */}
      <div className="flex items-center justify-center w-28 h-28 rounded-full bg-blue-100">
        <IoChatboxEllipsesOutline className="text-6xl text-blue-600" />
      </div>

      {/* Heading */}
      <h2 className="mt-6 text-3xl font-bold text-gray-800">
        Welcome to ChatApp 👋🏻
      </h2>

      {/* Description */}
      <p className="mt-3 max-w-md text-center text-gray-500 leading-relaxed">
        Select a conversation from the sidebar to start chatting. Stay connected
        with your friends in real time.
      </p>
    </div>
  );
}
