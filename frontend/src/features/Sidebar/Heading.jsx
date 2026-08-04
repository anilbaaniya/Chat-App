import { IoChatboxEllipses } from "react-icons/io5";
import SearchBox from "./SearchBox";

export default function Heading() {
  return (
    <div className="p-5 ">
      {/* Logo */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
          <IoChatboxEllipses className="text-indigo-600 text-3xl" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">ChatApp</h1>
          <p className="text-sm text-gray-500">Stay connected</p>
        </div>
      </div>

      {/* Search Box */}
      <SearchBox />
    </div>
  );
}
