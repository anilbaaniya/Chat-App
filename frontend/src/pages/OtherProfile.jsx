import { IoArrowBack, IoMail, IoPersonCircle } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  //   console.log(selectedConversation);
  const selectedUser = selectedConversation.user;

  const navigate = useNavigate();

  const profileItems = [
    {
      icon: <IoPersonCircle className="w-10 h-10 text-gray-400" />,
      title: "Name",
      value: selectedUser?.name,
    },

    {
      icon: <IoMail />,
      title: "Email",
      value: selectedUser?.email,
    },
  ];

  return (
    <div className="min-h-screen w-200 mx-auto pt-4 pb-10 ">
      {/* Header */}
      <div className="shadow flex items-center justify-between p-4">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <IoArrowBack className="text-2xl" />
          <h1 className="text-xl font-semibold">Back</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-sm">
        <div className="flex flex-col items-center py-8">
          {/* Avatar */}
          <div className="relative group">
            {selectedUser?.profilePicture ? (
              <img
                src={selectedUser.profilePicture}
                alt={selectedUser.name}
                className="w-36 h-36 rounded-full object-cover object-center  border-stone-400"
              />
            ) : (
              <IoPersonCircle className="w-36 h-36 rounded-full   border-stone-400" />
            )}
            {/* <img
              src={selectedUser?.profilePicture || "https://i.pravatar.cc/300"}
              alt=""
              className="w-36 h-36 rounded-full object-cover border-4 border-stone-400"
            /> */}
          </div>

          <h2 className="text-2xl font-bold mt-5">{selectedUser?.name}</h2>
        </div>
      </div>

      {/* Personal Info */}

      <div className="mt-6 bg-white rounded-xl shadow">
        <div className="flex items-center justify-between border-b">
          <h3 className="px-5 py-4 text-lg font-semibold  ">
            Personal Information
          </h3>
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
    </div>
  );
}
