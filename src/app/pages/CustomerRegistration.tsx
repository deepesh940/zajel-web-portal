import { useState } from "react";
import { ArrowLeft, Upload, X, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import logo from "@/assets/f564cf890f443da9bfb1483c7e6b48a878d5d763.png";

interface CustomerRegistrationProps {
  onBackToLogin: () => void;
  onRegistrationComplete?: () => void;
}

type RegistrationStatus = "pending" | "verified" | "rejected";

interface DocumentFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: Date;
}

export default function CustomerRegistration({
  onBackToLogin,
  onRegistrationComplete
}: CustomerRegistrationProps) {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>("pending");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyAddress: "",
    tradeLicenseNumber: "",
    taxRegistrationNumber: "",
  });

  const [documents, setDocuments] = useState<DocumentFile[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocuments: DocumentFile[] = Array.from(files).map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedAt: new Date(),
      }));
      setDocuments(prev => [...prev, ...newDocuments]);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Submit registration
      setShowSuccess(true);
      setTimeout(() => {
        if (onRegistrationComplete) {
          onRegistrationComplete();
        }
      }, 3000);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      onBackToLogin();
    }
  };

  const isStep1Valid = formData.fullName && formData.companyName && formData.mobileNumber && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const isStep2Valid = formData.companyAddress && formData.tradeLicenseNumber && documents.length > 0;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Registration Submitted!
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Your registration has been submitted successfully. Our team will review your documents and verify your account.
            </p>

            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-primary-700 dark:text-primary-400 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Status: Pending Verification</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                You will receive an email and WhatsApp notification once your account is verified.
              </p>
            </div>

            <button
              onClick={onBackToLogin}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="Zajel Logo" className="h-12 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Customer Registration
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Create your account to start shipping with Zajel
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? "bg-primary-600 text-white" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}>
                1
              </div>
              <span className={`text-sm font-medium ${step >= 1 ? "text-primary-600 dark:text-primary-400" : "text-neutral-600 dark:text-neutral-400"
                }`}>
                Personal Info
              </span>
            </div>

            <div className={`w-16 h-1 ${step >= 2 ? "bg-primary-600" : "bg-neutral-200 dark:bg-neutral-700"
              }`} />

            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? "bg-primary-600 text-white" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}>
                2
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? "text-primary-600 dark:text-primary-400" : "text-neutral-600 dark:text-neutral-400"
                }`}>
                Company Details
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                Personal Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-neutral-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-neutral-900 dark:text-white"
                  placeholder="Enter company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-neutral-900 dark:text-white"
                    placeholder="+971 50 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-neutral-900 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-neutral-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-neutral-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-error-600 dark:text-error-400">
                  Passwords do not match
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                Company Details & Documents
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Company Address *
                </label>
                <textarea
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-neutral-900 dark:text-white"
                  placeholder="Enter complete company address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Trade License Number *
                  </label>
                  <input
                    type="text"
                    name="tradeLicenseNumber"
                    value={formData.tradeLicenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-neutral-900 dark:text-white"
                    placeholder="Enter license number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Tax Registration Number (TRN)
                  </label>
                  <input
                    type="text"
                    name="taxRegistrationNumber"
                    value={formData.taxRegistrationNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-neutral-900 dark:text-white"
                    placeholder="Enter TRN (optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Upload Documents *
                </label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  Upload Trade License, Tax Registration Certificate, or other relevant documents
                </p>

                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:border-primary-600 dark:hover:border-primary-600 transition-colors bg-neutral-50 dark:bg-neutral-800/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      PDF, PNG, JPG up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                </label>

                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {doc.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {doc.size}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? "Back to Login" : "Back"}
            </button>

            <button
              onClick={handleNext}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {step === 1 ? "Next: Company Details" : "Submit Registration"}
            </button>
          </div>
        </div>

        {/* Already have account */}
        <p className="text-center mt-6 text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <button
            onClick={onBackToLogin}
            className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
