// src/components/auth/LogoutButton.tsx
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/store/auth";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout")) {
      logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-white bg-red-600 hover:bg-red-700"
    >
      <ArrowRightOnRectangleIcon className="h-4 w-4" />
      Logout
    </button>
  );
}
