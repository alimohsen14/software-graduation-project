// ...existing code...
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("❌ Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("❌ Password must be at least 6 characters long");
      return;
    }

    setError("");
    console.log("Login successful!");

    navigate("/home");
  };

  const handleGitHubSignIn = () => {
    console.log("GitHub sign in clicked");
    // TODO: integrate OAuth flow
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
    // TODO: integrate OAuth flow
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook sign in clicked");
    // TODO: integrate OAuth flow
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="relative z-10 w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">
            Palestine 3D | فلسطين ثلاثية الأبعاد
          </h1>
        </header>

        <div className="rounded-2xl p-1 bg-gradient-to-r from-green-200/60 via-transparent to-red-200/40 shadow-xl">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Tabs */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setTab("login")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    tab === "login"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    tab === "signup"
                      ? "bg-white text-gray-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email / البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 focus:ring-2 focus:ring-red-100"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Password / كلمة المرور
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 focus:ring-2 focus:ring-red-100"
                  placeholder="********"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-red-500"
                  />
                  <span>Remember me</span>
                </label>
                <a href="" className="text-red-500 hover:underline text-sm">
                  Forgot your password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                {tab === "login" ? "Login" : "Create account"}
              </button>

              {/* Social sign-in buttons styled like the Login button (real icons) */}
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  aria-label="Continue with GitHub"
                  onClick={handleGitHubSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-lg font-semibold shadow-sm hover:opacity-95 transition-colors"
                >
                  {/* GitHub icon (official mark) */}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.83 9.504.471.085.678-.204.678-.423 0-.209-.009-.769-.019-1.517-2.783.606-3.364-1.34-3.364-1.34-.454-1.164-1.11-1.474-1.11-1.474-.908-.62.069-.608.069-.608 1.006.072 1.532 1.038 1.532 1.038.89 1.529 2.34 1.088 2.91.831.091-.646.353-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.953 0-1.096.392-1.988 1.03-2.684-.108-.256-.445-1.27-.099-2.64 0 0 .84-.27 2.75 1.025.799-.222 1.637-.333 2.475-.337.838.004 1.677.115 2.475.337 1.91-1.295 2.75-1.025 2.75-1.025.346 1.37.009 2.384-.108 2.64.64.695 1.03 1.587 1.03 2.684 0 3.848-2.339 4.7-4.562 4.948.356.307.675.915.675 1.841 0 1.33-.012 2.41-.012 2.723 0 .219.207.514.684.423C21.137 20.19 24 16.425 24 12.017 24 6.484 19.522 2 14 2h-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>

                <button
                  type="button"
                  aria-label="Continue with Google"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
                >
                  {/* Google "G" colored icon */}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M21.35 11.1H12v2.8h5.35c-.23 1.4-.93 2.6-1.98 3.4v2.8c2.2-1.9 3.48-4.9 3.48-8.99 0-.6-.05-1.18-.5-1.99z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 22c2.7 0 4.96-.88 6.62-2.4l-2.76-2.14c-.77.53-1.94.92-3.86.92-2.96 0-5.47-2-6.36-4.72L3.1 15.9C4.74 19.96 8.97 22 12 22z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.64 13.68c-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72L3.1 8.76C2.36 10.36 2 12.12 2 13.96s.36 3.6 1.1 5.2l2.54-3.48z"
                    />
                    <path
                      fill="#4285F4"
                      d="M12 7.5c1.44 0 2.74.5 3.76 1.48l2.82-2.82C17 4.7 14.76 3.5 12 3.5 8.97 3.5 5.74 5.54 3.1 8.6l2.54 1.86C6.53 9.5 9.04 7.5 12 7.5z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  aria-label="Continue with Facebook"
                  onClick={handleFacebookSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-[#1877F2] text-white rounded-lg font-semibold shadow-sm hover:opacity-95 transition-colors"
                >
                  {/* Facebook "f" icon */}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88V14.9H8.9v-2.9h1.54V10.4c0-1.52.9-2.36 2.27-2.36.66 0 1.35.12 1.35.12v1.49h-.76c-.75 0-1 .48-1 1.04v1.3h1.7l-.27 2.9h-1.43v7.88C18.34 21.12 22 16.99 22 12z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
// ...existing
