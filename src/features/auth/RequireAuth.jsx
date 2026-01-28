import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Card from "../../shared/components/ui/Card";
import Spinner from "../../shared/components/ui/Spinner";

export default function RequireAuth() {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <Card className="p-6 flex items-center gap-3">
        <Spinner />
        <span className="text-gray-700">Verificando sesión…</span>
      </Card>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
