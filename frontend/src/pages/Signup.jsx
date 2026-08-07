import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { signupUser } from "../redux/auth/authSlice";
import { IoChatboxEllipses } from "react-icons/io5";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { RotatingLines } from "react-loader-spinner";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");

  const { error, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // console.log(user);
    e.preventDefault();
    try {
      let profilePicUrl = "";

      if (profilePicture) {
        const uploadFolder = "chatApp";
        profilePicUrl = await uploadToCloudinary(profilePicture, uploadFolder);
      }

      const result = await dispatch(
        signupUser({
          name,
          email,
          password,
          confirmPassword,
          profilePicture: profilePicUrl,
        }),
      );

      if (signupUser.fulfilled.match(result)) {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <div className="w-full max-w-md p-8 rounded-2xl border border-gray-100 shadow-xl">
        {/* Title */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="flex items-center justify-center w-12 h-11 rounded-xl  bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg">
            <IoChatboxEllipses className="text-white text-3xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800">ChatApp</h1>
        </div>
        <h2 className="text-2xl font-semibold text-center">
          Create Your Account 🚀
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Join ChatApp and start connecting instantly.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <span className="font-semibold text-lg">(Optional)</span>
            </div>

            <label
              htmlFor="profile-picture"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700"
            >
              {profilePicture ? "Change Image" : "Choose Image"}
            </label>

            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {preview && (
              <div className="flex items-center gap-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <p className="text-sm text-green-600">
                  ✓ {profilePicture.name}
                </p>
              </div>
            )}
          </div>

          <p className="text-red-600 text-sm pl-4">{error}</p>

          {/* Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white py-2 rounded-md transition"
          >
            {loading ? "Creating account" : "Signup"}
          </button>
        </form>

        {loading && (
          <div className="pl-30 mt-6">
            <RotatingLines
              visible={true}
              height="96"
              width="96"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
        {!loading && (
          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <NavLink to="/login" className="text-indigo-600 hover:underline">
              Login
            </NavLink>
          </p>
        )}
      </div>
    </div>
  );
}
