import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Shield, RefreshCw } from "lucide-react";
import logo from "@/assets/f564cf890f443da9bfb1483c7e6b48a878d5d763.png";

interface OTPVerificationProps {
  email: string;
  phoneNumber?: string;
  onVerify: () => void;
  onBack: () => void;
  deliveryMethod?: "email" | "sms" | "whatsapp";
}

export default function OTPVerification({
  email,
  phoneNumber,
  onVerify,
  onBack,
  deliveryMethod = "email",
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all fields are filled
    if (newOtp.every(digit => digit !== "") && index === 5) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();

    // Auto-verify if complete
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode: string) => {
    setIsVerifying(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      // For demo: accept "123456" as valid OTP
      if (otpCode === "123456") {
        onVerify();
      } else {
        setError("Invalid OTP code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleResend = () => {
    setTimer(120);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
    // In production: trigger API call to resend OTP
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDeliveryText = () => {
    switch (deliveryMethod) {
      case "sms":
        return `SMS sent to ${phoneNumber}`;
      case "whatsapp":
        return `WhatsApp message sent to ${phoneNumber}`;
      default:
        return `Email sent to ${email}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Zajel Logo" className="h-12 mx-auto mb-6" />
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Verify Your Identity
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {getDeliveryText()}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8">
          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 text-center">
              Enter 6-digit code
            </label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-xl font-bold bg-white dark:bg-neutral-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all ${error
                    ? "border-error-500 dark:border-error-500"
                    : "border-neutral-300 dark:border-neutral-700"
                    } text-neutral-900 dark:text-white`}
                  disabled={isVerifying}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
              <p className="text-sm text-error-600 dark:text-error-400 text-center">
                {error}
              </p>
            </div>
          )}

          {/* Timer & Resend */}
          <div className="text-center mb-6">
            {!canResend ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Code expires in{" "}
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {formatTimer(timer)}
                </span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Resend Code
              </button>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify(otp.join(""))}
            disabled={otp.some(digit => !digit) || isVerifying}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-4"
          >
            {isVerifying ? "Verifying..." : "Verify & Continue"}
          </button>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-400 text-center">
              <strong>Demo Mode:</strong> Use OTP code <strong>123456</strong> to verify.
            </p>
          </div>
        </div>

        {/* Delivery Method Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Didn't receive the code?{" "}
            <button className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
              Try different delivery method
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
