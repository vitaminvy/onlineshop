import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAuth } from "@/store/auth";

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-lg bg-white shadow-lg ring-1 ring-blue-200 overflow-hidden">
        {/* Left: Image */}
        <div className="hidden md:block">
          <img
            src="/images/login_img.jpg"
            alt="Login illustration"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Right: Login Form */}
        <div className="flex flex-col justify-center p-8">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.svg" alt="Logo" className="w-14 h-14 mb-2" />
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Nice to see you again
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or phone
              </label>
              <input
                type="text"
                placeholder="you@example.com or 0909xxxxxx"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-gray-400 bg-transparent focus:outline-none focus:ring-0 border-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 accent-blue-600"
                  checked={remember}
                  onChange={() => setRemember((v) => !v)}
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-blue-600 bg-transparent hover:underline text-sm font-medium border-none"
                onClick={() => alert("Forgot password")}
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
            >
              Sign in
            </button>
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-3 text-gray-400 text-sm">
                Or sign in with
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              onClick={() => alert("Sign in with Google")}
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <g>
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.09 1.53 7.49 2.81l5.54-5.39C33.47 3.16 28.97 1 24 1 14.82 1 6.99 6.86 3.68 15.09l6.89 5.34C12.5 14.25 17.77 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.55c0-1.7-.15-3.36-.43-4.95H24v9.39h12.39c-.54 2.9-2.16 5.36-4.61 7.05l7.13 5.53c4.14-3.81 6.19-9.44 6.19-16.02z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.57 28.36a14.56 14.56 0 0 1 0-8.72l-6.89-5.34A23.99 23.99 0 0 0 1 24c0 3.9.94 7.59 2.68 10.91l6.89-5.34z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 47c6.48 0 11.93-2.15 15.91-5.85l-7.13-5.53c-1.98 1.34-4.53 2.13-8.78 2.13-6.23 0-11.5-4.75-13.43-11.08l-6.89 5.34C6.99 41.14 14.82 47 24 47z"
                  />
                  <path fill="none" d="M1 1h46v46H1z" />
                </g>
              </svg>
              Sign in with Google
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:underline font-medium bg-transparent"
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
