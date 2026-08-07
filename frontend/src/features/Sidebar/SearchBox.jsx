import { useEffect, useState } from "react";
import { IoPersonCircleSharp, IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/user/userSlice";
import { fetchMessages } from "../../redux/message/messageSlice";
import { createConversation } from "../../redux/conversation/conversationSlice";

export default function SearchBox() {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchUsers(search));
    }, 500);

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  const handleSelectUser = async (user) => {
    try {
      const conversation = await dispatch(
        createConversation(user._id),
      ).unwrap();

      console.log(conversation);
      console.log(conversation.data._id);

      await dispatch(fetchMessages(conversation.data._id));

      setSearch("");
    } catch (err) {
      //   toast.error(err);
      console.log(err);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm">
        <IoSearchSharp className="text-gray-500 text-xl" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full ml-3 outline-none"
        />
      </div>

      {search && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg  max-h-80 overflow-y-auto z-50">
          {loading && <p className="p-4 text-gray-500">Searching...</p>}

          {!loading && users.length === 0 && (
            <p className="p-4 text-gray-500">No users found</p>
          )}

          {!loading &&
            users.map((user) => (
              <div
                onClick={() => handleSelectUser(user)}
                key={user._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover object-center"
                  />
                ) : (
                  <IoPersonCircleSharp className="text-5xl text-gray-400" />
                )}

                <div>
                  <p className="font-medium">{user.name}</p>
                  {/* <p className="text-sm text-gray-500">{user.email}</p> */}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
