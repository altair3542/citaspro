import { NavLink, Outlet } from "react-router-dom";

const linkBase =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
const linkClass = ({ isActive }) =>
  `${linkBase} ${isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`;

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-tight">CitasPro</div>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className={linkClass}>
              Signup
            </NavLink>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
