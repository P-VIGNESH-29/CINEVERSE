import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface User {
  email: string;
  password?: string;
  joinedDate?: string;
}

function Login() {
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Clear errors/success on tab switch
  useEffect(() => {
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, [isLoginTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const storedUsersRaw = localStorage.getItem("cineverse_users");
    const users: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    if (isLoginTab) {
      // Login Logic
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      // Support a default dummy account for testing convenience
      const isDefaultAccount = email.toLowerCase() === "test@test.com" && password === "password";

      if (foundUser || isDefaultAccount) {
        localStorage.setItem("cineverse_logged_in_user", email);
        setSuccess("Success! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/layout");
        }, 800);
      } else {
        setError("Invalid email or password.");
      }
    } else {
      // Sign Up Logic
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setError("This email address is already registered.");
        return;
      }

      // Save new user
      const newUser: User = { 
        email, 
        password,
        joinedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      users.push(newUser);
      localStorage.setItem("cineverse_users", JSON.stringify(users));

      setSuccess("Account created successfully! Switching to login tab...");
      setTimeout(() => {
        setIsLoginTab(true);
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#07080a] overflow-hidden select-none">
      
      {/* Background Graphic Vignettes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-[3px] scale-105" style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?auto=format&fit=crop&w=1500&q=80')` 
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080a] via-black/90 to-[#07080a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/75" />
      </div>

      {/* Floating Login/Signup Card */}
      <div className="relative z-10 w-full max-w-[430px] mx-4 bg-[#0f1013]/75 backdrop-blur-2xl border border-white/5 p-8 md:p-10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-[#7c3aed] font-black tracking-[0.25em] text-3xl md:text-4xl mb-1.5 drop-shadow-md">
            CINEVERSE
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide">
            Unlimited movies, TV shows, and more.
          </p>
        </div>

        {/* Form Header */}
        <div className="border-b border-white/5 mb-6 pb-3 text-center">
          <h2 className="text-sm font-bold tracking-wider text-[#8b5cf6] uppercase">
            {isLoginTab ? "SIGN IN" : "SIGN UP"}
          </h2>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-3 rounded-xl mb-4 text-center animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold p-3 rounded-xl mb-4 text-center animate-fade-in">
            {success}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#18191d]/60 border border-white/5 focus:border-[#7c3aed] rounded-xl px-4 py-3.5 text-sm text-white font-semibold outline-none focus:ring-1 focus:ring-[#7c3aed]/25 transition-all placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              className="w-full bg-[#18191d]/60 border border-white/5 focus:border-[#7c3aed] rounded-xl px-4 py-3.5 text-sm text-white font-semibold outline-none focus:ring-1 focus:ring-[#7c3aed]/25 transition-all placeholder-gray-500"
            />
          </div>

          {/* Confirm Password (only on Sign Up tab) */}
          {!isLoginTab && (
            <div className="relative animate-slide-down">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-[#18191d]/60 border border-white/5 focus:border-[#7c3aed] rounded-xl px-4 py-3.5 text-sm text-white font-semibold outline-none focus:ring-1 focus:ring-[#7c3aed]/25 transition-all placeholder-gray-500"
              />
            </div>
          )}

          {/* CTA Action Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white py-3.5 rounded-xl font-bold shadow-[0_10px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_30px_rgba(124,58,237,0.5)] transition-all duration-300 hover:scale-[1.02] cursor-pointer text-sm tracking-wider uppercase"
          >
            {isLoginTab ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Remember me & Help Options (Only on Login tab) */}
        {isLoginTab && (
          <div className="flex items-center justify-between mt-4 text-xs font-semibold text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded bg-[#18191d] border-white/10 text-[#7c3aed] focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline hover:text-[#8b5cf6]">Need help?</a>
          </div>
        )}

        {/* Secondary Navigation info */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-500 font-medium flex flex-col gap-3">
          {isLoginTab ? (
            <div className="text-gray-400 text-sm">
              New to Cineverse?{" "}
              <button
                type="button"
                onClick={() => setIsLoginTab(false)}
                className="text-[#7c3aed] hover:text-[#8b5cf6] font-bold cursor-pointer hover:underline bg-transparent border-none p-0 outline-none"
              >
                Sign Up Now
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLoginTab(true)}
                className="text-[#7c3aed] hover:text-[#8b5cf6] font-bold cursor-pointer hover:underline bg-transparent border-none p-0 outline-none"
              >
                Sign In
              </button>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <span>Explore Cineverse as </span>
            <span 
              onClick={() => navigate("/layout")}
              className="text-[#7c3aed] hover:text-[#8b5cf6] font-bold cursor-pointer hover:underline ml-1"
            >
              Guest User
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;