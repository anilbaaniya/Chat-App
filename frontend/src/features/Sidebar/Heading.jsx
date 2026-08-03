import { IoChatboxEllipses, IoPersonCircle } from "react-icons/io5";
import SearchBox from "./SearchBox";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Heading() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="p-5 ">
      {/* Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
            <IoChatboxEllipses className="text-indigo-600 text-3xl" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">ChatApp</h1>
            <p className="text-sm text-gray-500">Stay connected</p>
          </div>
        </div>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <IoPersonCircle className="w-10 h-10 text-gray-400" />
          )}
          <span>Profile</span>
        </div>
      </div>

      {/* Search Box */}
      <SearchBox />
    </div>
  );
}
