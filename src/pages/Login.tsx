import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  sanitizeInput, validators, checkRateLimit, checkHoneypot, generateCsrfToken,
} from "@/lib/security";

// Generate CSRF token once on page load
const csrfToken = generateCsrfToken();

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Honeypot — must stay empty; bots fill it
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (!checkHoneypot(honeypotRef.current?.value ?? "")) return;

    // Rate limiting
    if (!checkRateLimit("login", 3000)) {
      toast.error("Please wait before trying again.");
      return;
    }

    // Sanitize
    const cleanEmail = sanitizeInput(email.trim());

    // Validate
    if (!role) { toast.error("Please select a role."); return; }
    if (!validators.email(cleanEmail)) { toast.error("Invalid email address."); return; }
    if (password.length < 4) { toast.error("Password is too short."); return; }

    if (role === "owner") navigate("/owner");
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-400 animate-[gradient_6s_ease_infinite] bg-[length:300%_300%]" />
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-purple-400/30 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-yellow-200/40 blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 text-center space-y-6">
          <div className="flex justify-center animate-[fade-in_0.8s_ease_forwards]">
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <img src="/happyb-logo.png" alt="HappyB Logo" className="h-28 object-contain" />
            </div>
          </div>
          <div className="space-y-3 animate-[fade-in_1s_ease_forwards]">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">HappyB.Pvt.Ltd</h1>
            <p className="text-white/90 text-lg font-medium">Quality &amp; Comfort in Every Stitch</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 animate-[fade-in_1.2s_ease_forwards]">
            {["📦 Stock Management", "🧾 Smart Billing", "👥 Attendance", "📊 Analytics"].map((f) => (
              <span key={f} className="bg-white/30 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/40">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-purple-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-pink-100/60 blur-3xl" />

        <div className="relative z-10 w-full max-w-md space-y-8 animate-[fade-in_0.6s_ease_forwards]">

          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="inline-block bg-white rounded-2xl p-4 shadow-lg mb-3">
              <img src="/happyb-logo.png" alt="HappyB Logo" className="h-16 object-contain" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">HappyB.Pvt.Ltd</h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome back 👋</h2>
            <p className="text-gray-500 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* CSRF hidden field */}
            <input type="hidden" name="_csrf" value={csrfToken} readOnly />
            {/* Honeypot — hidden from real users */}
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-300">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">👷 Worker</SelectItem>
                  <SelectItem value="owner">👑 Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                autoComplete="email"
                className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={128}
                autoComplete="current-password"
                className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Sign in →
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Contact your shop owner for account access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
