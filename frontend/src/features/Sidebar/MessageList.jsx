import { IoPersonCircleSharp } from "react-icons/io5";

export default function MessageList() {
  return (
    <div className="flex items-center justify-between py-4 pl-6 pr-8 mx-2 hover:bg-gray-100 cursor-pointer transition-all duration-200 rounded-xl">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <IoPersonCircleSharp className="text-5xl text-gray-400" />

        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold text-lg">
            Anil Baniya
          </span>

          <span className="text-gray-500 text-sm truncate">Hello!</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-gray-500">10:30 AM</span>

        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold">
          3
        </span>
      </div>
    </div>
  );
}
