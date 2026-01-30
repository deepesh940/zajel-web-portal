import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Users,
  LogIn,
  Shield,
  UserPlus,
  ChevronDown,
  Check,
  LayoutDashboard,
  Globe,
  Zap,
  Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logo from "@/assets/f564cf890f443da9bfb1483c7e6b48a878d5d763.png";
import { UserRole } from "@/mockAPI/navigationData";
import CustomerRegistration from "@/app/pages/CustomerRegistration";
import OTPVerification from "@/app/components/OTPVerification";

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

interface RoleCredentials {
  email: string;
  password: string;
  name: string;
  description: string;
}

const roleCredentials: Record<UserRole, RoleCredentials> = {
  customer: {
    email: "customer@zajel.ae",
    password: "customer123",
    name: "Customer Portal",
    description: "Create inquiries and manage shipments",
  },
  operations_user: {
    email: "operations@zajel.ae",
    password: "operations123",
    name: "Operations User",
    description: "Manage inquiries, pricing, and driver assignments",
  },
  operations_manager: {
    email: "manager@zajel.ae",
    password: "manager123",
    name: "Operations Manager",
    description: "Approve pricing and manage escalations",
  },
  finance_user: {
    email: "finance@zajel.ae",
    password: "finance123",
    name: "Finance User",
    description: "Handle payables, invoicing, and receivables",
  },
  admin: {
    email: "admin@zajel.ae",
    password: "admin123",
    name: "Administrator",
    description: "Full system access and configuration",
  },
};

export default function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState(roleCredentials.admin.email);
  const [password, setPassword] = useState(roleCredentials.admin.password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [requireOTP, setRequireOTP] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(roleCredentials[role].email);
    setPassword(roleCredentials[role].password);
    setIsRoleDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireOTP) {
      setShowOTP(true);
    } else {
      onLogin(selectedRole);
    }
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    onLogin(selectedRole);
  };

  const roleOptions: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: "admin", label: "Administrator", icon: <LayoutDashboard className="w-4 h-4" /> },
    { value: "customer", label: "Customer", icon: <Users className="w-4 h-4" /> },
    { value: "operations_user", label: "Operations User", icon: <Shield className="w-4 h-4" /> },
    { value: "operations_manager", label: "Operations Manager", icon: <Shield className="w-4 h-4 text-purple-500" /> },
    { value: "finance_user", label: "Finance User", icon: <Shield className="w-4 h-4 text-green-500" /> },
  ];

  const selectedRoleOption = roleOptions.find(r => r.value === selectedRole) || roleOptions[0];

  if (showOTP) {
    return (
      <OTPVerification
        email={email}
        phoneNumber="+971 50 123 4567"
        onVerify={handleOTPVerified}
        onBack={() => setShowOTP(false)}
        deliveryMethod="email"
      />
    );
  }

  if (showRegistration) {
    return (
      <CustomerRegistration
        onBackToLogin={() => setShowRegistration(false)}
        onRegistrationComplete={() => setShowRegistration(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-[#FAFAFA] dark:bg-neutral-950 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-screen relative z-10">

        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-20 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <img src={logo} alt="Zajel Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-white dark:to-neutral-400">
              ZAJEL
            </span>
          </motion.div>

          <div className="space-y-8 max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl font-bold text-neutral-900 dark:text-white leading-tight"
            >
              Enterprise Logistics <br />
              <span className="text-blue-600">Reimagined.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed"
            >
              Experience seamless shipment management, real-time tracking, and automated operations with Zajel's next-generation platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4 pt-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-900 bg-gray-200 dark:bg-neutral-800" />
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">Trusted by 500+</span>
                <span className="text-xs text-neutral-500">Enterprises worldwide</span>
              </div>
            </motion.div>

            {/* Feature Highlights Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-12"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Global Reach</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">Seamless international shipping to 200+ countries.</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Real-time</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">Live tracking and instant status updates.</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Headphones className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">24/7 Support</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">Dedicated support team always available.</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm text-neutral-400"
          >
            © {new Date().getFullYear()} Zajel Logistics. All rights reserved.
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-6 lg:p-12 xl:p-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[480px] space-y-8 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 dark:border-neutral-800"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-4">
              <img src={logo} alt="Zajel Logo" className="h-10 w-auto" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Welcome Back</h2>
              <p className="text-neutral-500 dark:text-neutral-400">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Custom Role Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                  Access Portal
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        {selectedRoleOption.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-none mb-1">
                          {selectedRoleOption.label}
                        </p>
                        <p className="text-xs text-neutral-500 truncate max-w-[200px]">
                          {roleCredentials[selectedRole].description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isRoleDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-700 z-50 overflow-hidden py-1"
                      >
                        {roleOptions.map((role) => (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => handleRoleChange(role.value)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left"
                          >
                            <div className={`p-2 rounded-lg ${selectedRole === role.value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 dark:bg-neutral-900 dark:text-neutral-400'}`}>
                              {role.icon}
                            </div>
                            <span className={`text-sm font-medium ${selectedRole === role.value ? 'text-blue-600 ' : 'text-neutral-700 dark:text-neutral-300'}`}>
                              {role.label}
                            </span>
                            {selectedRole === role.value && <Check className="w-4 h-4 ml-auto text-blue-600" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5 role-group">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="name@zajel.ae"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </button>
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">Remember me</span>
                </label>

                {/* OTP Toggle Switch */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">OTP</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireOTP}
                      onChange={(e) => setRequireOTP(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-neutral-700"></div></div>
                  <div className="relative bg-white dark:bg-neutral-950 px-4 text-xs text-neutral-500 uppercase font-medium">Or continue with</div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRegistration(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-white rounded-xl font-semibold transition-all input-shadow active:scale-[0.98]"
                >
                  <UserPlus className="w-5 h-5 text-green-600" />
                  Create New Account
                </button>
              </div>

            </form>

            {/* Demo Notice */}
            <div className="text-center">
              <p className="text-xs text-neutral-400">
                <strong className="text-neutral-500">Demo Mode:</strong> Credentials auto-filled for testing.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}