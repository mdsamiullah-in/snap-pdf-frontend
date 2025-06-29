import { Navigate } from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../util/fetcher";

// ✅ Normal protected route (any logged-in user)
export const ProtectedRoute = ({ children }) => {
  const { data: session, isLoading } = useSWR("/api/user/session", fetcher);

  if (isLoading) return null;


  return children;
};

// 🔐 Admin-only protected route
export const AdminRoute = ({ children }) => {
  const { data: session, isLoading } = useSWR("/api/user/session", fetcher);

  if (isLoading) return null;

  if (!session) return <Navigate to="/login" replace />;

  if (session.role !== "admin") return <Navigate to="/unauthorized" replace />;

  return children;
};
