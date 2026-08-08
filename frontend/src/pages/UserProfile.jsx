import { useState } from "react";
import {
  IoArrowBack,
  IoMail,
  IoLogOutOutline,
  IoPersonCircle,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditNameEmail from "../features/profile/EditNameEmail";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ChangePassword from "../features/profile/ChangePassword";
import { logout } from "../redux/auth/authSlice";
import toast from "react-hot-toast";

export default function UserProfile() {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [changing, setChanging] = useState(false);

  const profileItems = [
    {
      icon: <IoPersonCircle className="w-10 h-10 text-gray-400" />,
      title: "Name",
      value: user?.name,
    },

    {
      icon: <IoMail />,
      title: "Email",
      value: user?.email,
    },
  ];

  async function handleLogout() {
    const result = await dispatch(logout());
    if (logout.fulfilled.match(result)) {
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    }
  }

  function handleEditProfile() {
    setEditing(true);
    setChanging(false);
  }

  function handleChangePassword() {
    setChanging(true);
    setEditing(false);
  }

  return (
    <div className="min-h-screen w-250 mx-auto pt-4 pb-10 ">
      {/* Header */}
      <div className="shadow flex items-center justify-between p-4">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer border border-stone-200 px-6 py-2 rounded-xl text-xl font-semibold shadow-md/10 shadow-black  hover:bg-linear-to-b/longer from-white- to-gray-200 transition-all duration-400"
        >
          <IoArrowBack className="text-2xl" />
          <h1 className="text-xl font-semibold">Back</h1>
        </div>
        {/* Logout */}
        <div
          onClick={handleLogout}
          className="px-5 cursor-pointer bg-red-500 hover:bg-red-600 transition text-white rounded-xl py-3 flex items-center justify-center gap-3 font-semibold"
        >
          <IoLogOutOutline className="text-xl" />
          <span>Logout</span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-sm">
        <div className="flex flex-col items-center py-8">
          {/* Avatar */}
          <div className="relative group">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-36 h-36 rounded-full object-cover object-center  border-stone-400"
              />
            ) : (
              <IoPersonCircle className="w-36 h-36 rounded-full   border-stone-400" />
            )}
          </div>

          <h2 className="text-2xl font-bold mt-5">{user?.name}</h2>
        </div>
      </div>

      {/* Personal Info */}

      <div className="mt-6 bg-white rounded-xl shadow">
        <div className="flex items-center justify-between border-b">
          <h3 className="px-5 py-4 text-lg font-semibold  ">
            Personal Information
          </h3>
          {!editing && (
            <div
              onClick={handleEditProfile}
              className="text-md text-blue-600 cursor-pointer hover:underline mr-20 flex items-center gap-1"
            >
              <MdOutlineModeEditOutline />

              <span>Edit</span>
            </div>
          )}
        </div>

        {profileItems.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 px-5 py-4 border-b border-stone-300 last:border-none"
          >
            <div className="text-2xl text-indigo-600">{item.icon}</div>

            <div>
              <p className="text-sm text-gray-500">{item.title}</p>

              <p className="font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {editing && <EditNameEmail setEditing={setEditing} user={user} />}
      {!changing && (
        <button
          onClick={handleChangePassword}
          className="bg-indigo-600 text-white px-6 py-4 rounded-xl ml-4 mt-8 font-semibold cursor-pointer"
        >
          Change Password
        </button>
      )}
      {changing && <ChangePassword setChanging={setChanging} />}
    </div>
  );
}
