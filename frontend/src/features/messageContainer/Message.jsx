import { IoPersonCircleSharp, IoSend, IoAttach } from "react-icons/io5";

export default function Message() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <IoPersonCircleSharp className="text-5xl text-gray-400" />

          <div>
            <h2 className="text-lg font-semibold text-gray-800">John Doe</h2>
            <p className="text-sm text-green-600">● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Received */}
        <div className="flex justify-start">
          <div className="max-w-xs rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow">
            <p className="text-gray-800">
              Hey Anil! How's your chat app going?
            </p>

            <p className="mt-1 text-right text-xs text-gray-500">10:15 AM</p>
          </div>
        </div>

        {/* Sent */}
        <div className="flex justify-end">
          <div className="max-w-xs rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white shadow">
            <p>It's going well! I'm working on the messaging UI now.</p>

            <p className="mt-1 text-right text-xs text-blue-100">10:17 AM</p>
          </div>
        </div>

        {/* Received */}
        <div className="flex justify-start">
          <div className="max-w-xs rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow">
            <p>Nice! The UI already looks clean. 🚀</p>

            <p className="mt-1 text-right text-xs text-gray-500">10:18 AM</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2">
          <button className="text-gray-500 hover:text-blue-600 cursor-pointer">
            <IoAttach className="text-xl" />
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none "
          />

          <button className="rounded-full bg-blue-600 p-2 text-sm text-white transition hover:bg-blue-700 cursor-pointer">
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}
