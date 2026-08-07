import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedLayout from "./ProtectedLayout";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./redux/auth/authSlice";
import UserProfile from "./pages/UserProfile";
import OtherProfile from "./pages/OtherProfile";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/otherProfile",
        element: <OtherProfile />,
      },
    ],
  },
]);

export default function App() {
  const dispatch = useDispatch();
  // const { isAuthenticated } = useSelector((state) => state.auth);
  // console.log(isAuthenticated);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);
  return <RouterProvider router={router} />;
}
