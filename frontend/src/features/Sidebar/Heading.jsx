import { IoChatboxEllipses } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";

export default function Heading() {
  return (
    <div className="p-5 ">
      {/* Logo */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
          <IoChatboxEllipses className="text-blue-600 text-3xl" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">ChatApp</h1>
          <p className="text-sm text-gray-500">Stay connected</p>
        </div>
      </div>

      {/* Search Box */}
      <div className="flex items-center bg-white rounded-xl px-4 py-3 transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
        <IoSearchSharp className="text-gray-500 text-xl" />

        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full ml-3 bg-transparent text-gray-700 placeholder:text-gray-400 outline-none"
        />
      </div>
    </div>
  );
}
