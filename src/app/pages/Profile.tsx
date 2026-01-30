import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Key,
  Bell,
  Shield,
  Save,
  Camera,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  PageHeader,
} from "../components/hb/listing";
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormSection,
  FormSelect,
} from "../components/hb/common/Form";
import { toast } from "sonner";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@zajel.ae",
    phone: "+971 50 123 4567",
    alternatePhone: "+971 52 987 6543",
    dateOfBirth: "1990-05-15",
    avatar: "https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTYxMDk4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  });

  // Company Information
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "ABC Trading LLC",
    tradeLicense: "TL-123456789",
    vatNumber: "VAT-987654321",
    industry: "Trading & Distribution",
    website: "www.abctrading.ae",
    companySize: "50-100",
  });

  // Address Information
  const [addressInfo, setAddressInfo] = useState({
    addressLine1: "Building 5, Office 302",
    addressLine2: "Business Bay",
    city: "Dubai",
    emirate: "Dubai",
    poBox: "12345",
    country: "United Arab Emirates",
  });

  // Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    smsNotifications: true,
    quoteUpdates: true,
    shipmentUpdates: true,
    paymentReminders: true,
    promotionalEmails: false,
    weeklyDigest: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSavePersonalInfo = () => {
    toast.success("Personal information updated successfully");
  };

  const handleSaveCompanyInfo = () => {
    toast.success("Company information updated successfully");
  };

  const handleSaveAddressInfo = () => {
    toast.success("Address information updated successfully");
  };

  const handleSaveNotificationPrefs = () => {
    toast.success("Notification preferences updated successfully");
  };

  const handleSaveSecuritySettings = () => {
    toast.success("Security settings updated successfully");
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setShowPasswordModal(false);
    toast.success("Password changed successfully");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "company", label: "Company Info", icon: Building },
    { id: "address", label: "Address", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="My Profile"
          subtitle="Manage your account settings and preferences"
          breadcrumbs={[
            { label: "Settings", href: "#" },
            { label: "My Profile", current: true },
          ]}
        />

        {/* ========== PROFILE CARD ========== */}
        <div className="mb-6">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center overflow-hidden">
                  {personalInfo.avatar ? (
                    <img
                      src={personalInfo.avatar}
                      alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-semibold text-primary-600 dark:text-primary-400">
                      {getInitials(`${personalInfo.firstName} ${personalInfo.lastName}`)}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                      {personalInfo.firstName} {personalInfo.lastName}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {companyInfo.companyName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified Account
                    </div>
                    <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-medium">
                      Premium Customer
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Mail className="w-4 h-4" />
                    {personalInfo.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Phone className="w-4 h-4" />
                    {personalInfo.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== TABS SECTION ========== */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <FormSection title="Personal Information" description="Update your personal details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField>
                      <FormLabel htmlFor="firstName" required>
                        First Name
                      </FormLabel>
                      <FormInput
                        id="firstName"
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="lastName" required>
                        Last Name
                      </FormLabel>
                      <FormInput
                        id="lastName"
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="email" required>
                        Email Address
                      </FormLabel>
                      <FormInput
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            email: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="phone" required>
                        Phone Number
                      </FormLabel>
                      <FormInput
                        id="phone"
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            phone: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="alternatePhone">
                        Alternate Phone
                      </FormLabel>
                      <FormInput
                        id="alternatePhone"
                        type="tel"
                        value={personalInfo.alternatePhone}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            alternatePhone: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                      <FormInput
                        id="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </FormField>
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <button
                    onClick={handleSavePersonalInfo}
                    className="px-6 py-2.5 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Company Info Tab */}
            {activeTab === "company" && (
              <div className="space-y-6">
                <FormSection title="Company Information" description="Manage your company details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField>
                      <FormLabel htmlFor="companyName" required>
                        Company Name
                      </FormLabel>
                      <FormInput
                        id="companyName"
                        type="text"
                        value={companyInfo.companyName}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="tradeLicense" required>
                        Trade License Number
                      </FormLabel>
                      <FormInput
                        id="tradeLicense"
                        type="text"
                        value={companyInfo.tradeLicense}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            tradeLicense: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="vatNumber">VAT Number</FormLabel>
                      <FormInput
                        id="vatNumber"
                        type="text"
                        value={companyInfo.vatNumber}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            vatNumber: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="industry" required>
                        Industry
                      </FormLabel>
                      <FormSelect
                        id="industry"
                        value={companyInfo.industry}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            industry: e.target.value,
                          })
                        }
                      >
                        <option value="Trading & Distribution">
                          Trading & Distribution
                        </option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Technology">Technology</option>
                        <option value="Other">Other</option>
                      </FormSelect>
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="website">Website</FormLabel>
                      <FormInput
                        id="website"
                        type="text"
                        value={companyInfo.website}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            website: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="companySize">Company Size</FormLabel>
                      <FormSelect
                        id="companySize"
                        value={companyInfo.companySize}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            companySize: e.target.value,
                          })
                        }
                      >
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="50-100">50-100 employees</option>
                        <option value="101-500">101-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </FormSelect>
                    </FormField>
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveCompanyInfo}
                    className="px-6 py-2.5 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="space-y-6">
                <FormSection title="Address Information" description="Update your business address">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField className="md:col-span-2">
                      <FormLabel htmlFor="addressLine1" required>
                        Address Line 1
                      </FormLabel>
                      <FormInput
                        id="addressLine1"
                        type="text"
                        value={addressInfo.addressLine1}
                        onChange={(e) =>
                          setAddressInfo({
                            ...addressInfo,
                            addressLine1: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField className="md:col-span-2">
                      <FormLabel htmlFor="addressLine2">
                        Address Line 2
                      </FormLabel>
                      <FormInput
                        id="addressLine2"
                        type="text"
                        value={addressInfo.addressLine2}
                        onChange={(e) =>
                          setAddressInfo({
                            ...addressInfo,
                            addressLine2: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="city" required>
                        City
                      </FormLabel>
                      <FormInput
                        id="city"
                        type="text"
                        value={addressInfo.city}
                        onChange={(e) =>
                          setAddressInfo({
                            ...addressInfo,
                            city: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="emirate" required>
                        Emirate
                      </FormLabel>
                      <FormSelect
                        id="emirate"
                        value={addressInfo.emirate}
                        onChange={(e) =>
                          setAddressInfo({
                            ...addressInfo,
                            emirate: e.target.value,
                          })
                        }
                      >
                        <option value="Dubai">Dubai</option>
                        <option value="Abu Dhabi">Abu Dhabi</option>
                        <option value="Sharjah">Sharjah</option>
                        <option value="Ajman">Ajman</option>
                        <option value="Umm Al Quwain">Umm Al Quwain</option>
                        <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                        <option value="Fujairah">Fujairah</option>
                      </FormSelect>
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="poBox">P.O. Box</FormLabel>
                      <FormInput
                        id="poBox"
                        type="text"
                        value={addressInfo.poBox}
                        onChange={(e) =>
                          setAddressInfo({
                            ...addressInfo,
                            poBox: e.target.value,
                          })
                        }
                      />
                    </FormField>

                    <FormField>
                      <FormLabel htmlFor="country" required>
                        Country
                      </FormLabel>
                      <FormInput
                        id="country"
                        type="text"
                        value={addressInfo.country}
                        onChange={(e) =>
                          setAddressInfo({
                            ...addressInfo,
                            country: e.target.value,
                          })
                        }
                        disabled
                      />
                    </FormField>
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveAddressInfo}
                    className="px-6 py-2.5 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <FormSection title="Notification Preferences" description="Choose how you want to be notified">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                        Notification Channels
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                Email Notifications
                              </p>
                              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Receive notifications via email
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPrefs.emailNotifications}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                emailNotifications: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                SMS Notifications
                              </p>
                              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Receive notifications via SMS
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPrefs.smsNotifications}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                smsNotifications: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                        Notification Types
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            key: "quoteUpdates",
                            label: "Quote Updates",
                            description: "Notifications about quotes and pricing",
                          },
                          {
                            key: "shipmentUpdates",
                            label: "Shipment Updates",
                            description: "Tracking and delivery notifications",
                          },
                          {
                            key: "paymentReminders",
                            label: "Payment Reminders",
                            description: "Payment due dates and confirmations",
                          },
                          {
                            key: "promotionalEmails",
                            label: "Promotional Emails",
                            description: "Special offers and promotions",
                          },
                          {
                            key: "weeklyDigest",
                            label: "Weekly Digest",
                            description: "Summary of your weekly activity",
                          },
                        ].map((pref) => (
                          <label
                            key={pref.key}
                            className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                          >
                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                {pref.label}
                              </p>
                              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                {pref.description}
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={
                                notificationPrefs[
                                  pref.key as keyof typeof notificationPrefs
                                ] as boolean
                              }
                              onChange={(e) =>
                                setNotificationPrefs({
                                  ...notificationPrefs,
                                  [pref.key]: e.target.checked,
                                })
                              }
                              className="w-5 h-5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotificationPrefs}
                    className="px-6 py-2.5 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <FormSection title="Security Settings" description="Manage your account security">
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Key className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              Password
                            </p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                              Change your account password
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            Two-Factor Authentication
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            twoFactorAuth: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
                      />
                    </label>

                    {/* Login Alerts */}
                    <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            Login Alerts
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Get notified of new login attempts
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={securitySettings.loginAlerts}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            loginAlerts: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
                      />
                    </label>

                    {/* Session Timeout */}
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
                      <FormField>
                        <FormLabel htmlFor="sessionTimeout">
                          Session Timeout (minutes)
                        </FormLabel>
                        <FormSelect
                          id="sessionTimeout"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              sessionTimeout: e.target.value,
                            })
                          }
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="0">Never</option>
                        </FormSelect>
                      </FormField>
                    </div>
                  </div>
                </FormSection>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSecuritySettings}
                    className="px-6 py-2.5 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Modal */}
        <FormModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          description="Update your account password"
        >
          <div className="space-y-4">
            <FormField>
              <FormLabel htmlFor="currentPassword" required>
                Current Password
              </FormLabel>
              <div className="relative">
                <FormInput
                  id="currentPassword"
                  type={showPasswordFields.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordFields({
                      ...showPasswordFields,
                      current: !showPasswordFields.current,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPasswordFields.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>

            <FormField>
              <FormLabel htmlFor="newPassword" required>
                New Password
              </FormLabel>
              <div className="relative">
                <FormInput
                  id="newPassword"
                  type={showPasswordFields.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordFields({
                      ...showPasswordFields,
                      new: !showPasswordFields.new,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPasswordFields.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>

            <FormField>
              <FormLabel htmlFor="confirmPassword" required>
                Confirm New Password
              </FormLabel>
              <div className="relative">
                <FormInput
                  id="confirmPassword"
                  type={showPasswordFields.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordFields({
                      ...showPasswordFields,
                      confirm: !showPasswordFields.confirm,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPasswordFields.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>

            <div className="p-3 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
              <p className="text-xs text-info-900 dark:text-info-300">
                Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
              </p>
            </div>
          </div>

          <FormFooter>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              Update Password
            </button>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}
