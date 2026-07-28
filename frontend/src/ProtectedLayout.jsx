import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";

export default function ProtectedLayout() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  console.log(user);

  if (loading) {
    <TailSpin height="60" width="60" color="#2563eb" ariaLabel="loading" />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
