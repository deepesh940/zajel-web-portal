import { useState } from "react";
import {
  Settings,
  MoreVertical,
  Edit,
  Eye,
  RefreshCw,
  Clock,
  Bell,
  Mail,
  DollarSign,
  Shield,
  Truck,
  CheckCircle,
  XCircle,
  BarChart3,
  Plus,
} from "lucide-react";
import {
  PageHeader,
  IconButton,
  SummaryWidgets,
  ViewModeSwitcher,
  AdvancedSearchPanel,
  FilterChips,
  SearchBar,
  Pagination,
} from "../components/hb/listing";
import type { FilterCondition } from "../components/hb/listing";
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormTextarea,
  FormSelect,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface ConfigurationModule {
  id: string;
  name: string;
  description: string;
  category: "General" | "Operations" | "Finance" | "Communication" | "Security";
  settingsCount: number;
  lastModified: string;
  modifiedBy: string;
  status: "Active" | "Inactive";
  icon: any;
}

type ViewMode = "grid" | "list" | "table";

export default function SystemConfiguration() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<ConfigurationModule | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Module form states
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [newModuleCategory, setNewModuleCategory] = useState<"General" | "Operations" | "Finance" | "Communication" | "Security">("General");
  const [newModuleSettingsCount, setNewModuleSettingsCount] = useState("0");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Edit form states - General Settings
  const [companyName, setCompanyName] = useState("ZAJEL Digital Logistics");
  const [companyEmail, setCompanyEmail] = useState("info@zajel.ae");
  const [companyPhone, setCompanyPhone] = useState("+971 4 123 4567");
  const [timezone, setTimezone] = useState("Asia/Dubai");
  const [currency, setCurrency] = useState("AED");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Edit form states - SLA Settings
  const [inquiryResponseTime, setInquiryResponseTime] = useState("2");
  const [quoteGenerationTime, setQuoteGenerationTime] = useState("4");
  const [driverAssignmentTime, setDriverAssignmentTime] = useState("1");
  const [slaWarningThreshold, setSlaWarningThreshold] = useState("80");

  // Edit form states - Operations
  const [autoAssignDrivers, setAutoAssignDrivers] = useState(false);
  const [maxDailyTrips, setMaxDailyTrips] = useState("5");
  const [gpsTrackingInterval, setGpsTrackingInterval] = useState("5");
  const [proofOfDeliveryRequired, setProofOfDeliveryRequired] = useState(true);

  // Edit form states - Email Settings
  const [smtpHost, setSmtpHost] = useState("smtp.zajel.ae");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("noreply@zajel.ae");
  const [emailFromName, setEmailFromName] = useState("ZAJEL Logistics");

  // Edit form states - Pricing
  const [baseRatePerKm, setBaseRatePerKm] = useState("5");
  const [minimumCharge, setMinimumCharge] = useState("50");
  const [expressMultiplier, setExpressMultiplier] = useState("1.5");
  const [fuelSurcharge, setFuelSurcharge] = useState("5");

  // Edit form states - Security
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const [configModules, setConfigModules] = useState<ConfigurationModule[]>([
    {
      id: "1",
      name: "General Settings",
      description: "Company information, timezone, currency, and language preferences",
      category: "General",
      settingsCount: 8,
      lastModified: "2024-01-28",
      modifiedBy: "Admin User",
      status: "Active",
      icon: Settings,
    },
    {
      id: "2",
      name: "SLA Configuration",
      description: "Service level agreement settings and response time thresholds",
      category: "Operations",
      settingsCount: 8,
      lastModified: "2024-01-25",
      modifiedBy: "Operations Manager",
      status: "Active",
      icon: Clock,
    },
    {
      id: "3",
      name: "Notification Settings",
      description: "Configure notification preferences and delivery channels",
      category: "Communication",
      settingsCount: 9,
      lastModified: "2024-01-20",
      modifiedBy: "System Admin",
      status: "Active",
      icon: Bell,
    },
    {
      id: "4",
      name: "Email Configuration",
      description: "SMTP server settings and email delivery preferences",
      category: "Communication",
      settingsCount: 9,
      lastModified: "2024-01-15",
      modifiedBy: "IT Admin",
      status: "Active",
      icon: Mail,
    },
    {
      id: "5",
      name: "Pricing Rules",
      description: "Default pricing rates, surcharges, and fee structures",
      category: "Finance",
      settingsCount: 9,
      lastModified: "2024-01-22",
      modifiedBy: "Finance Manager",
      status: "Active",
      icon: DollarSign,
    },
    {
      id: "6",
      name: "Operations Settings",
      description: "Driver assignment, trip management, and operational workflows",
      category: "Operations",
      settingsCount: 8,
      lastModified: "2024-01-18",
      modifiedBy: "Operations Manager",
      status: "Active",
      icon: Truck,
    },
    {
      id: "7",
      name: "Security & Authentication",
      description: "Password policies, session management, and access controls",
      category: "Security",
      settingsCount: 11,
      lastModified: "2024-01-10",
      modifiedBy: "Security Admin",
      status: "Active",
      icon: Shield,
    },
  ]);

  // Filter options for advanced search
  const filterOptions = {
    'Status': ['Active', 'Inactive'],
    'Category': ['General', 'Operations', 'Finance', 'Communication', 'Security'],
  };

  // Apply filters
  const filteredModules = configModules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.category.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(module.status);

    const categoryFilter = filters.find((f) => f.id === "category");
    const matchesCategory =
      !categoryFilter || categoryFilter.values.length === 0 || categoryFilter.values.includes(module.category);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Apply sorting
  const sortedModules = [...filteredModules].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "category") {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === "settingsCount") {
      comparison = a.settingsCount - b.settingsCount;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedModules.length / itemsPerPage);
  const paginatedModules = sortedModules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-success-500" : "bg-neutral-400"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "General":
        return "text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/30";
      case "Operations":
        return "text-info-600 dark:text-info-400 bg-info-50 dark:bg-info-900/30";
      case "Finance":
        return "text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/30";
      case "Communication":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30";
      case "Security":
        return "text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/30";
      default:
        return "text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/30";
    }
  };

  const handleViewDetails = (module: ConfigurationModule) => {
    setSelectedModule(module);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleEdit = (module: ConfigurationModule) => {
    setSelectedModule(module);
    setShowEditModal(true);
    setOpenActionMenuId(null);
  };

  const handleSaveSettings = () => {
    if (selectedModule) {
      setConfigModules(
        configModules.map((m) =>
          m.id === selectedModule.id
            ? {
              ...m,
              lastModified: new Date().toISOString().split("T")[0],
              modifiedBy: "Current User",
            }
            : m
        )
      );
      toast.success(`${selectedModule.name} updated successfully`);
    }
    setShowEditModal(false);
  };

  const stats = [
    {
      label: "Total Modules",
      value: configModules.length,
      icon: "Settings",
      subtitle: "Configuration modules",
    },
    {
      label: "Active Modules",
      value: configModules.filter((m) => m.status === "Active").length,
      icon: "CheckCircle",
      subtitle: "Currently enabled",
    },
    {
      label: "Total Settings",
      value: configModules.reduce((sum, m) => sum + m.settingsCount, 0),
      icon: "BarChart3",
      subtitle: "Configurable options",
    },
    {
      label: "Last Updated",
      value: "Today",
      icon: "Clock",
      subtitle: "Recent changes",
    },
  ];

  const renderEditModalContent = () => {
    if (!selectedModule) return null;

    switch (selectedModule.id) {
      case "1": // General Settings
        return (
          <div className="space-y-4">
            <FormField>
              <FormLabel htmlFor="companyName" required>
                Company Name
              </FormLabel>
              <FormInput
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="companyEmail" required>
                  Company Email
                </FormLabel>
                <FormInput
                  id="companyEmail"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="info@company.com"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="companyPhone" required>
                  Company Phone
                </FormLabel>
                <FormInput
                  id="companyPhone"
                  type="text"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+971 4 123 4567"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="timezone" required>
                  System Timezone
                </FormLabel>
                <FormSelect
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Dubai">Asia/Dubai</option>
                  <option value="Asia/Riyadh">Asia/Riyadh</option>
                  <option value="Asia/Kuwait">Asia/Kuwait</option>
                  <option value="UTC">UTC</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="currency" required>
                  Default Currency
                </FormLabel>
                <FormSelect
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                </FormSelect>
              </FormField>
            </div>

            <FormField>
              <FormLabel htmlFor="dateFormat" required>
                Date Format
              </FormLabel>
              <FormSelect
                id="dateFormat"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </FormSelect>
            </FormField>
          </div>
        );

      case "2": // SLA Configuration
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="inquiryResponseTime" required>
                  Inquiry Response Time (hours)
                </FormLabel>
                <FormInput
                  id="inquiryResponseTime"
                  type="number"
                  value={inquiryResponseTime}
                  onChange={(e) => setInquiryResponseTime(e.target.value)}
                  min="1"
                  max="24"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="quoteGenerationTime" required>
                  Quote Generation Time (hours)
                </FormLabel>
                <FormInput
                  id="quoteGenerationTime"
                  type="number"
                  value={quoteGenerationTime}
                  onChange={(e) => setQuoteGenerationTime(e.target.value)}
                  min="1"
                  max="48"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="driverAssignmentTime" required>
                  Driver Assignment Time (hours)
                </FormLabel>
                <FormInput
                  id="driverAssignmentTime"
                  type="number"
                  value={driverAssignmentTime}
                  onChange={(e) => setDriverAssignmentTime(e.target.value)}
                  min="0.5"
                  max="12"
                  step="0.5"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="slaWarningThreshold" required>
                  SLA Warning Threshold (%)
                </FormLabel>
                <FormInput
                  id="slaWarningThreshold"
                  type="number"
                  value={slaWarningThreshold}
                  onChange={(e) => setSlaWarningThreshold(e.target.value)}
                  min="50"
                  max="95"
                />
              </FormField>
            </div>
          </div>
        );

      case "4": // Email Configuration
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="smtpHost" required>
                  SMTP Host
                </FormLabel>
                <FormInput
                  id="smtpHost"
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.server.com"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="smtpPort" required>
                  SMTP Port
                </FormLabel>
                <FormInput
                  id="smtpPort"
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  placeholder="587"
                />
              </FormField>
            </div>

            <FormField>
              <FormLabel htmlFor="smtpUsername" required>
                SMTP Username
              </FormLabel>
              <FormInput
                id="smtpUsername"
                type="text"
                value={smtpUsername}
                onChange={(e) => setSmtpUsername(e.target.value)}
                placeholder="username@domain.com"
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="emailFromName" required>
                From Name
              </FormLabel>
              <FormInput
                id="emailFromName"
                type="text"
                value={emailFromName}
                onChange={(e) => setEmailFromName(e.target.value)}
                placeholder="Company Name"
              />
            </FormField>
          </div>
        );

      case "5": // Pricing Rules
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="baseRatePerKm" required>
                  Base Rate per KM (AED)
                </FormLabel>
                <FormInput
                  id="baseRatePerKm"
                  type="number"
                  value={baseRatePerKm}
                  onChange={(e) => setBaseRatePerKm(e.target.value)}
                  min="1"
                  step="0.1"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="minimumCharge" required>
                  Minimum Charge (AED)
                </FormLabel>
                <FormInput
                  id="minimumCharge"
                  type="number"
                  value={minimumCharge}
                  onChange={(e) => setMinimumCharge(e.target.value)}
                  min="10"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="expressMultiplier" required>
                  Express Service Multiplier
                </FormLabel>
                <FormInput
                  id="expressMultiplier"
                  type="number"
                  value={expressMultiplier}
                  onChange={(e) => setExpressMultiplier(e.target.value)}
                  min="1"
                  max="3"
                  step="0.1"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="fuelSurcharge" required>
                  Fuel Surcharge (%)
                </FormLabel>
                <FormInput
                  id="fuelSurcharge"
                  type="number"
                  value={fuelSurcharge}
                  onChange={(e) => setFuelSurcharge(e.target.value)}
                  min="0"
                  max="20"
                />
              </FormField>
            </div>
          </div>
        );

      case "6": // Operations Settings
        return (
          <div className="space-y-4">
            <FormField>
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel htmlFor="autoAssignDrivers">
                    Auto-Assign Drivers
                  </FormLabel>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Automatically assign drivers based on availability and location
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="autoAssignDrivers"
                    checked={autoAssignDrivers}
                    onChange={(e) => setAutoAssignDrivers(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="maxDailyTrips" required>
                  Max Daily Trips per Driver
                </FormLabel>
                <FormInput
                  id="maxDailyTrips"
                  type="number"
                  value={maxDailyTrips}
                  onChange={(e) => setMaxDailyTrips(e.target.value)}
                  min="1"
                  max="20"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="gpsTrackingInterval" required>
                  GPS Tracking Interval (minutes)
                </FormLabel>
                <FormInput
                  id="gpsTrackingInterval"
                  type="number"
                  value={gpsTrackingInterval}
                  onChange={(e) => setGpsTrackingInterval(e.target.value)}
                  min="1"
                  max="30"
                />
              </FormField>
            </div>

            <FormField>
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel htmlFor="proofOfDeliveryRequired">
                    Proof of Delivery Required
                  </FormLabel>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Require photo/signature proof of delivery
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="proofOfDeliveryRequired"
                    checked={proofOfDeliveryRequired}
                    onChange={(e) => setProofOfDeliveryRequired(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </FormField>
          </div>
        );

      case "7": // Security Settings
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="passwordMinLength" required>
                  Minimum Password Length
                </FormLabel>
                <FormInput
                  id="passwordMinLength"
                  type="number"
                  value={passwordMinLength}
                  onChange={(e) => setPasswordMinLength(e.target.value)}
                  min="6"
                  max="32"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="sessionTimeout" required>
                  Session Timeout (minutes)
                </FormLabel>
                <FormInput
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  min="5"
                  max="120"
                />
              </FormField>
            </div>

            <FormField>
              <FormLabel htmlFor="maxLoginAttempts" required>
                Max Login Attempts
              </FormLabel>
              <FormInput
                id="maxLoginAttempts"
                type="number"
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(e.target.value)}
                min="3"
                max="10"
              />
            </FormField>

            <FormField>
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel htmlFor="twoFactorAuth">
                    Two-Factor Authentication
                  </FormLabel>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Require 2FA for all users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    checked={twoFactorAuth}
                    onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </FormField>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Configuration options for {selectedModule.name} will be displayed here.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="System Configuration"
          subtitle="Manage system-wide settings and preferences for the ZAJEL platform"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "System Configuration", current: true },
          ]}
        >
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Module
          </button>

          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter((f) => f.values.length > 0).length}
              placeholder="Search configuration modules..."
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
            />
          </div>

          <ViewModeSwitcher currentMode={viewMode} onChange={setViewMode} />
        </PageHeader>

        {/* ========== FILTER CHIPS ========== */}
        {filters.some((f) => f.values.length > 0) && (
          <FilterChips
            filters={filters}
            onRemove={(filterId) => {
              setFilters(
                filters.map((f) =>
                  f.id === filterId ? { ...f, values: [] } : f
                )
              );
            }}
            onClearAll={() => setFilters([])}
          />
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && <SummaryWidgets widgets={stats} />}

        {/* ========== CONTENT AREA ========== */}
        <div className="space-y-4">
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedModules.map((module) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                    onClick={() => handleViewDetails(module)}
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            {module.name}
                          </h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {module.settingsCount} settings
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(module.status)}

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(
                                openActionMenuId === module.id ? null : module.id
                              );
                            }}
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openActionMenuId === module.id && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(module);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(module);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Edit className="w-4 h-4" />
                                Configure
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {module.description}
                    </p>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(module.category)}`}>
                        {module.category}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                      <span>Modified by {module.modifiedBy}</span>
                      <span>{module.lastModified}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedModules.map((module) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            {module.name}
                          </h3>
                          {getStatusBadge(module.status)}
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(module.category)}`}>
                            {module.category}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Settings: <span className="font-medium text-neutral-900 dark:text-white">{module.settingsCount}</span>
                          </span>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Modified by: <span className="font-medium text-neutral-900 dark:text-white">{module.modifiedBy}</span>
                          </span>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Last updated: <span className="font-medium text-neutral-900 dark:text-white">{module.lastModified}</span>
                          </span>
                        </div>
                      </div>

                      <div className="relative ml-4">
                        <button
                          onClick={() =>
                            setOpenActionMenuId(
                              openActionMenuId === module.id ? null : module.id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === module.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => handleViewDetails(module)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleEdit(module)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Edit className="w-4 h-4" />
                              Configure
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === "table" && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Module Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Settings
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedModules.map((module) => {
                      const Icon = module.icon;
                      return (
                        <tr
                          key={module.id}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer"
                          onClick={() => handleViewDetails(module)}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                  {module.name}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  {module.description.substring(0, 50)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(module.category)}`}>
                              {module.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {module.settingsCount}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900 dark:text-white">
                              {module.lastModified}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              by {module.modifiedBy}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {getStatusBadge(module.status)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenuId(
                                    openActionMenuId === module.id ? null : module.id
                                  );
                                }}
                                className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                title="Actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {openActionMenuId === module.id && (
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetails(module);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(module);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Configure
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredModules.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Settings className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No configuration modules found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "No configuration modules available"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredModules.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredModules.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* Details Modal */}
        {selectedModule && (
          <FormModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title={selectedModule.name}
            description="Configuration module details"
            maxWidth="max-w-2xl"
          >
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Category
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedModule.category)}`}>
                    {selectedModule.category}
                  </span>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedModule.status)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Description
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  {selectedModule.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                  <p className="text-xs text-info-700 dark:text-info-400 mb-1">
                    Settings Count
                  </p>
                  <p className="text-lg font-semibold text-info-900 dark:text-info-300">
                    {selectedModule.settingsCount}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Last Modified
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedModule.lastModified}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Modified By
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedModule.modifiedBy}
                  </p>
                </div>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEdit(selectedModule);
                }}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Configure Settings
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Edit/Configure Modal */}
        {selectedModule && (
          <FormModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title={`Configure ${selectedModule.name}`}
            description={selectedModule.description}
            maxWidth="max-w-2xl"
          >
            {renderEditModalContent()}

            <FormFooter>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Save Configuration
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Add Module Modal */}
        <FormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Configuration Module"
          description="Create a new configuration module for the ZAJEL platform"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <FormField>
              <FormLabel htmlFor="newModuleName" required>
                Module Name
              </FormLabel>
              <FormInput
                id="newModuleName"
                type="text"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                placeholder="Enter module name"
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="newModuleDescription" required>
                Description
              </FormLabel>
              <FormTextarea
                id="newModuleDescription"
                value={newModuleDescription}
                onChange={(e) => setNewModuleDescription(e.target.value)}
                placeholder="Enter module description"
                rows={3}
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="newModuleCategory" required>
                Category
              </FormLabel>
              <FormSelect
                id="newModuleCategory"
                value={newModuleCategory}
                onChange={(e) => setNewModuleCategory(e.target.value as "General" | "Operations" | "Finance" | "Communication" | "Security")}
              >
                <option value="General">General</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Communication">Communication</option>
                <option value="Security">Security</option>
              </FormSelect>
            </FormField>

            <FormField>
              <FormLabel htmlFor="newModuleSettingsCount" required>
                Settings Count
              </FormLabel>
              <FormInput
                id="newModuleSettingsCount"
                type="number"
                value={newModuleSettingsCount}
                onChange={(e) => setNewModuleSettingsCount(e.target.value)}
                min="0"
                step="1"
              />
            </FormField>
          </div>

          <FormFooter>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const newModule: ConfigurationModule = {
                  id: (configModules.length + 1).toString(),
                  name: newModuleName,
                  description: newModuleDescription,
                  category: newModuleCategory,
                  settingsCount: parseInt(newModuleSettingsCount, 10),
                  lastModified: new Date().toISOString().split("T")[0],
                  modifiedBy: "Current User",
                  status: "Active",
                  icon: Settings,
                };
                setConfigModules([...configModules, newModule]);
                toast.success(`${newModuleName} added successfully`);
                setShowAddModal(false);
              }}
              className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Module
            </button>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}