import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function LoginNew() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"worker" | "owner" | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select your role before signing in.");
      return;
    }
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    // Simulate auth delay
    await new Promise((res) => setTimeout(res, 700));
    setIsLoading(false);

    if (role === "owner") {
      navigate("/owner");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          background-image: url('/images/login-bg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }
      `}</style>
      <div className="min-h-screen flex items-center justify-center p-6">
        <main
          className="w-full max-w-[420px] rounded-[16px] z-10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.93)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div className="p-[40px] flex flex-col items-center">
            {/* Logo */}
            <div className="mb-6 w-[110px]">
              <svg className="w-full h-auto" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                <text fill="#1e1c0e" fontFamily="Plus Jakarta Sans" fontSize="38" fontWeight="800" x="10" y="45">ha</text>
                <text fill="#1e1c0e" fontFamily="Plus Jakarta Sans" fontSize="38" fontWeight="800" x="55" y="45">p</text>
                <circle cx="72" cy="28" fill="white" r="3" stroke="#1e1c0e" strokeWidth="1"></circle>
                <circle cx="72" cy="28" fill="#1e1c0e" r="1.5"></circle>
                <text fill="#1e1c0e" fontFamily="Plus Jakarta Sans" fontSize="38" fontWeight="800" x="82" y="45">p</text>
                <circle cx="99" cy="28" fill="white" r="3" stroke="#1e1c0e" strokeWidth="1"></circle>
                <circle cx="99" cy="28" fill="#1e1c0e" r="1.5"></circle>
                <text fill="#1e1c0e" fontFamily="Plus Jakarta Sans" fontSize="38" fontWeight="800" x="110" y="45">y</text>
                <g transform="translate(145, 10)">
                  <ellipse cx="15" cy="15" fill="#e9e2cc" rx="12" ry="8" transform="rotate(-30 15 15)"></ellipse>
                  <ellipse cx="25" cy="15" fill="#e9e2cc" rx="12" ry="8" transform="rotate(30 25 15)"></ellipse>
                  <rect fill="#f5c200" height="25" rx="10" width="20" x="10" y="18"></rect>
                  <path d="M10 25 H30 M10 32 H30" stroke="#1e1c0e" strokeWidth="3"></path>
                  <circle cx="16" cy="25" fill="none" r="4" stroke="#1e1c0e" strokeWidth="1.5"></circle>
                  <circle cx="24" cy="25" fill="none" r="4" stroke="#1e1c0e" strokeWidth="1.5"></circle>
                </g>
              </svg>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-1">Welcome back 👋</h1>
              <p className="text-sm text-[#4e4632]">Sign in to your HappyB account</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-5">
              {/* Role Selector */}
              <div className="space-y-1.5 w-full">
                <label className="block text-sm font-semibold text-[#4e4632] ml-1">Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("worker")}
                    className={`h-12 rounded-xl border-2 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
                      ${role === "worker"
                        ? "border-[#F5C200] bg-[#FFF9E6] text-[#1A1A1A] shadow-md"
                        : "border-[#E0E0E0] bg-white text-[#4e4632] hover:border-[#F5C200]/60"
                      }`}
                  >
                    👷 Worker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("owner")}
                    className={`h-12 rounded-xl border-2 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
                      ${role === "owner"
                        ? "border-[#6B4EFF] bg-[#F3F0FF] text-[#1A1A1A] shadow-md"
                        : "border-[#E0E0E0] bg-white text-[#4e4632] hover:border-[#6B4EFF]/60"
                      }`}
                  >
                    👑 Owner
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 flex flex-col items-start w-full">
                <label className="block text-sm font-semibold text-[#4e4632] ml-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#F5C200] focus:border-[#F5C200] outline-none transition-all placeholder:text-[#807660]/50 text-[#1A1A1A]"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5 w-full">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-sm font-semibold text-[#4e4632]" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-sm font-bold text-[#F5C200] hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#F5C200] focus:border-[#F5C200] outline-none transition-all placeholder:text-[#807660]/50 pr-12 text-[#1A1A1A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#807660]/60 hover:text-[#807660] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 font-medium text-center bg-red-50 rounded-xl py-2 px-4">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-1 bg-[#F5C200] text-[#1A1A1A] font-extrabold text-sm tracking-widest rounded-xl hover:bg-[#e6b600] active:scale-[0.98] transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "SIGN IN →"}
              </button>
            </form>

            <p className="mt-8 text-sm text-center text-[#4e4632]">
              Contact your shop owner for account access
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
