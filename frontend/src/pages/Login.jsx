import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/auth/authSlice";
import { IoChatboxEllipses } from "react-icons/io5";
import { RotatingLines } from "react-loader-spinner";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error } = useSelector((state) => state.auth);
  // console.log(error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    // console.log(user);
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    // console.log(result.payload.data);

    if (loginUser.fulfilled.match(result)) {
      toast.success("Login successful!");
      navigate("/");
    }
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
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              required
            />
          </div>

          <p className="text-red-600 text-sm pl-4">{error}</p>

          {/* Forgot Password */}
          <div className="text-right">
            <NavLink
              to="/forgotPassword"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </NavLink>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white py-2 rounded-md transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
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

        {/* Extra */}
        {!loading && (
          <p className="text-sm text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </NavLink>
          </p>
        )}
      </div>
    </div>
  );
}
