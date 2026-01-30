import { useState } from "react";
import {
  Plug,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Plus,
  Activity,
  Zap,
  CreditCard,
  Mail,
  MessageSquare,
  MapPin,
  Database,
  FileText,
  Briefcase,
  Cloud,
  Key,
  Copy,
  ExternalLink,
  Settings,
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

interface Integration {
  id: string;
  name: string;
  description: string;
  category: "Payment" | "Accounting" | "Communication" | "Mapping" | "Storage" | "ERP" | "Analytics";
  icon: any;
  status: "Connected" | "Disconnected" | "Error";
  statusMessage?: string;
  connectedDate?: string;
  lastSync?: string;
  apiKey?: string;
  webhookUrl?: string;
  apiCallsToday: number;
  successRate: number;
}

type ViewMode = "grid" | "list" | "table";

export default function IntegrationManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Form state
  const [formName, setFormName] = useState("");
  const [formApiKey, setFormApiKey] = useState("");
  const [formWebhookUrl, setFormWebhookUrl] = useState("");
  const [formApiEndpoint, setFormApiEndpoint] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Stripe Payment Gateway",
      description: "Process payments and manage transactions with Stripe",
      category: "Payment",
      icon: CreditCard,
      status: "Connected",
      connectedDate: "2024-01-15",
      lastSync: "2024-01-28 10:30 AM",
      apiKey: "sk_live_51abc123def456...",
      webhookUrl: "https://zajel.ae/webhooks/stripe",
      apiCallsToday: 1247,
      successRate: 99.8,
    },
    {
      id: "2",
      name: "QuickBooks Online",
      description: "Sync invoices and financial data with QuickBooks",
      category: "Accounting",
      icon: Briefcase,
      status: "Connected",
      connectedDate: "2024-01-10",
      lastSync: "2024-01-28 09:15 AM",
      apiKey: "qb_prod_abc123xyz...",
      apiCallsToday: 456,
      successRate: 98.5,
    },
    {
      id: "3",
      name: "Twilio SMS",
      description: "Send SMS notifications to customers and drivers",
      category: "Communication",
      icon: MessageSquare,
      status: "Connected",
      connectedDate: "2024-01-20",
      lastSync: "2024-01-28 11:45 AM",
      apiKey: "AC1234567890abcdef...",
      apiCallsToday: 892,
      successRate: 99.2,
    },
    {
      id: "4",
      name: "Google Maps API",
      description: "Routing, geocoding, and distance calculations",
      category: "Mapping",
      icon: MapPin,
      status: "Connected",
      connectedDate: "2024-01-05",
      lastSync: "2024-01-28 11:50 AM",
      apiKey: "AIzaSyAbc123Def456...",
      apiCallsToday: 3421,
      successRate: 99.9,
    },
    {
      id: "5",
      name: "SendGrid Email",
      description: "Email delivery service for transactional emails",
      category: "Communication",
      icon: Mail,
      status: "Connected",
      connectedDate: "2024-01-12",
      lastSync: "2024-01-28 10:00 AM",
      apiKey: "SG.abc123def456...",
      apiCallsToday: 678,
      successRate: 99.5,
    },
    {
      id: "6",
      name: "AWS S3 Storage",
      description: "Cloud storage for documents and images",
      category: "Storage",
      icon: Database,
      status: "Connected",
      connectedDate: "2024-01-08",
      lastSync: "2024-01-28 11:30 AM",
      apiKey: "AKIAIOSFODNN7EXAMPLE",
      apiCallsToday: 2134,
      successRate: 99.7,
    },
    {
      id: "7",
      name: "SAP Business One",
      description: "Enterprise resource planning integration",
      category: "ERP",
      icon: FileText,
      status: "Error",
      statusMessage: "Authentication failed",
      connectedDate: "2024-01-18",
      lastSync: "2024-01-27 03:20 PM",
      apiKey: "sap_key_abc123...",
      apiCallsToday: 0,
      successRate: 0,
    },
    {
      id: "8",
      name: "Google Analytics",
      description: "Track and analyze user behavior and platform metrics",
      category: "Analytics",
      icon: BarChart3,
      status: "Disconnected",
      apiCallsToday: 0,
      successRate: 0,
    },
    {
      id: "9",
      name: "PayPal Payments",
      description: "Accept payments through PayPal",
      category: "Payment",
      icon: CreditCard,
      status: "Disconnected",
      apiCallsToday: 0,
      successRate: 0,
    },
    {
      id: "10",
      name: "Slack Notifications",
      description: "Send alerts and notifications to Slack channels",
      category: "Communication",
      icon: MessageSquare,
      status: "Connected",
      connectedDate: "2024-01-22",
      lastSync: "2024-01-28 11:20 AM",
      apiKey: "xoxb-1234567890-abcd...",
      apiCallsToday: 234,
      successRate: 99.1,
    },
  ]);

  // Filter options for advanced search
  const filterOptions: FilterCondition[] = [
    {
      id: "status",
      label: "Status",
      type: "select",
      values: [],
      options: [
        { value: "Connected", label: "Connected" },
        { value: "Disconnected", label: "Disconnected" },
        { value: "Error", label: "Error" },
      ],
    },
    {
      id: "category",
      label: "Category",
      type: "select",
      values: [],
      options: [
        { value: "Payment", label: "Payment" },
        { value: "Accounting", label: "Accounting" },
        { value: "Communication", label: "Communication" },
        { value: "Mapping", label: "Mapping" },
        { value: "Storage", label: "Storage" },
        { value: "ERP", label: "ERP" },
        { value: "Analytics", label: "Analytics" },
      ],
    },
  ];

  // Apply filters
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.category.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(integration.status);

    const categoryFilter = filters.find((f) => f.id === "category");
    const matchesCategory =
      !categoryFilter || categoryFilter.values.length === 0 || categoryFilter.values.includes(integration.category);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Apply sorting
  const sortedIntegrations = [...filteredIntegrations].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "category") {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === "apiCallsToday") {
      comparison = a.apiCallsToday - b.apiCallsToday;
    } else if (sortField === "successRate") {
      comparison = a.successRate - b.successRate;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedIntegrations.length / itemsPerPage);
  const paginatedIntegrations = sortedIntegrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    let dotColor = "bg-neutral-400";
    if (status === "Connected") dotColor = "bg-success-500";
    else if (status === "Error") dotColor = "bg-error-500";

    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Payment":
        return "text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/30";
      case "Accounting":
        return "text-info-600 dark:text-info-400 bg-info-50 dark:bg-info-900/30";
      case "Communication":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30";
      case "Mapping":
        return "text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/30";
      case "Storage":
        return "text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/30";
      case "ERP":
        return "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30";
      case "Analytics":
        return "text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/30";
      default:
        return "text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/30";
    }
  };

  const handleViewDetails = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setFormName(integration.name);
    setFormApiKey(integration.apiKey || "");
    setFormWebhookUrl(integration.webhookUrl || "");
    setFormApiEndpoint("https://api.example.com/v1");
    setFormDescription(integration.description);
    setShowConfigModal(true);
    setOpenActionMenuId(null);
  };

  const handleDelete = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowDeleteModal(true);
    setOpenActionMenuId(null);
  };

  const confirmDelete = () => {
    if (selectedIntegration) {
      setIntegrations(integrations.filter((i) => i.id !== selectedIntegration.id));
      toast.success(`${selectedIntegration.name} removed successfully`);
    }
    setShowDeleteModal(false);
    setSelectedIntegration(null);
  };

  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleTestConnection = () => {
    toast.success("Connection test successful");
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations(
        integrations.map((i) =>
          i.id === selectedIntegration.id
            ? {
                ...i,
                apiKey: formApiKey,
                webhookUrl: formWebhookUrl,
                description: formDescription,
                lastSync: new Date().toLocaleString(),
              }
            : i
        )
      );
      toast.success(`${selectedIntegration.name} configuration updated`);
    }
    setShowConfigModal(false);
  };

  const stats = [
    {
      label: "Total Integrations",
      value: integrations.length,
      icon: "Plug",
      subtitle: "Available integrations",
    },
    {
      label: "Connected",
      value: integrations.filter((i) => i.status === "Connected").length,
      icon: "CheckCircle",
      subtitle: "Active connections",
    },
    {
      label: "API Calls Today",
      value: integrations.reduce((sum, i) => sum + i.apiCallsToday, 0).toLocaleString(),
      icon: "Activity",
      subtitle: "Total requests",
    },
    {
      label: "Avg Success Rate",
      value: `${(
        integrations.filter((i) => i.status === "Connected").reduce((sum, i) => sum + i.successRate, 0) /
        integrations.filter((i) => i.status === "Connected").length
      ).toFixed(1)}%`,
      icon: "Zap",
      subtitle: "Performance metric",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Integration Management"
          subtitle="Manage third-party integrations and API connections"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Integration Management", current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter((f) => f.values.length > 0).length}
              placeholder="Search integrations..."
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
            />
          </div>

          <IconButton
            icon={BarChart3}
            onClick={() => setShowSummary(!showSummary)}
            title="Toggle summary"
            active={showSummary}
          />

          <IconButton
            icon={RefreshCw}
            onClick={() => toast.success("Refreshed")}
            title="Refresh"
          />

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
            onClearAll={() => setFilters(filterOptions.map((f) => ({ ...f, values: [] })))}
          />
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && <SummaryWidgets widgets={stats} />}

        {/* ========== CONTENT AREA ========== */}
        <div className="space-y-4">
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedIntegrations.map((integration) => {
                const Icon = integration.icon;
                return (
                  <div
                    key={integration.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                    onClick={() => handleViewDetails(integration)}
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            {integration.name}
                          </h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {integration.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(integration.status)}

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(
                                openActionMenuId === integration.id ? null : integration.id
                              );
                            }}
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openActionMenuId === integration.id && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(integration);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfigure(integration);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Settings className="w-4 h-4" />
                                Configure
                              </button>

                              {integration.status === "Disconnected" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConfigure(integration);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-success-700 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Plug className="w-4 h-4" />
                                  Connect
                                </button>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(integration);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {integration.description}
                    </p>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(integration.category)}`}>
                        {integration.category}
                      </span>
                    </div>

                    {/* Stats */}
                    {integration.status === "Connected" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-info-50 dark:bg-info-900/30 rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            <Activity className="w-3 h-3 text-info-600 dark:text-info-400" />
                            <span className="text-xs text-info-700 dark:text-info-400">API Calls</span>
                          </div>
                          <div className="text-sm font-semibold text-info-600 dark:text-info-400">
                            {integration.apiCallsToday.toLocaleString()}
                          </div>
                        </div>
                        <div className="p-2 bg-success-50 dark:bg-success-900/30 rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            <Zap className="w-3 h-3 text-success-600 dark:text-success-400" />
                            <span className="text-xs text-success-700 dark:text-success-400">Success</span>
                          </div>
                          <div className="text-sm font-semibold text-success-600 dark:text-success-400">
                            {integration.successRate}%
                          </div>
                        </div>
                      </div>
                    )}

                    {integration.status === "Error" && (
                      <div className="p-3 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-error-600 dark:text-error-400" />
                          <span className="text-xs text-error-700 dark:text-error-400">
                            {integration.statusMessage}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedIntegrations.map((integration) => {
                const Icon = integration.icon;
                return (
                  <div
                    key={integration.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            {integration.name}
                          </h3>
                          {getStatusBadge(integration.status)}
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(integration.category)}`}>
                            {integration.category}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          {integration.description}
                        </p>
                        {integration.status === "Connected" && (
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                              API Calls: <span className="font-medium text-info-600 dark:text-info-400">{integration.apiCallsToday.toLocaleString()}</span>
                            </span>
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Success Rate: <span className="font-medium text-success-600 dark:text-success-400">{integration.successRate}%</span>
                            </span>
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Last Sync: <span className="font-medium text-neutral-900 dark:text-white">{integration.lastSync}</span>
                            </span>
                          </div>
                        )}
                        {integration.status === "Error" && (
                          <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-error-600 dark:text-error-400" />
                            <span className="text-error-700 dark:text-error-400">{integration.statusMessage}</span>
                          </div>
                        )}
                      </div>

                      <div className="relative ml-4">
                        <button
                          onClick={() =>
                            setOpenActionMenuId(
                              openActionMenuId === integration.id ? null : integration.id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === integration.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => handleViewDetails(integration)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleConfigure(integration)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Settings className="w-4 h-4" />
                              Configure
                            </button>
                            {integration.status === "Disconnected" && (
                              <button
                                onClick={() => handleConfigure(integration)}
                                className="w-full px-4 py-2.5 text-left text-sm text-success-700 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Plug className="w-4 h-4" />
                                Connect
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(integration)}
                              className="w-full px-4 py-2.5 text-left text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
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
                        Integration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        API Calls
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Success Rate
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
                    {paginatedIntegrations.map((integration) => {
                      const Icon = integration.icon;
                      return (
                        <tr
                          key={integration.id}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer"
                          onClick={() => handleViewDetails(integration)}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                  {integration.name}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  {integration.description.substring(0, 40)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(integration.category)}`}>
                              {integration.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-info-600 dark:text-info-400">
                              {integration.apiCallsToday.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-success-600 dark:text-success-400">
                              {integration.successRate}%
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {getStatusBadge(integration.status)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenuId(
                                    openActionMenuId === integration.id ? null : integration.id
                                  );
                                }}
                                className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                title="Actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {openActionMenuId === integration.id && (
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetails(integration);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfigure(integration);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <Settings className="w-4 h-4" />
                                    Configure
                                  </button>
                                  {integration.status === "Disconnected" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleConfigure(integration);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-success-700 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                    >
                                      <Plug className="w-4 h-4" />
                                      Connect
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(integration);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
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
          {filteredIntegrations.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Plug className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No integrations found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "No integrations available"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredIntegrations.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredIntegrations.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* Details Modal */}
        {selectedIntegration && (
          <FormModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title={selectedIntegration.name}
            description="Integration details and configuration"
            maxWidth="max-w-3xl"
          >
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Category
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedIntegration.category)}`}>
                    {selectedIntegration.category}
                  </span>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedIntegration.status)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Description
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  {selectedIntegration.description}
                </p>
              </div>

              {/* Connection Details */}
              {selectedIntegration.status === "Connected" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                        Connected Date
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedIntegration.connectedDate}
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                        Last Sync
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedIntegration.lastSync}
                      </p>
                    </div>
                  </div>

                  {/* API Key */}
                  {selectedIntegration.apiKey && (
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          API Key
                        </p>
                        <button
                          onClick={() => handleCopyApiKey(selectedIntegration.apiKey!)}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedKey ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="text-sm font-mono text-neutral-900 dark:text-white break-all">
                        {selectedIntegration.apiKey}
                      </p>
                    </div>
                  )}

                  {/* Webhook URL */}
                  {selectedIntegration.webhookUrl && (
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                        Webhook URL
                      </p>
                      <p className="text-sm font-mono text-neutral-900 dark:text-white break-all">
                        {selectedIntegration.webhookUrl}
                      </p>
                    </div>
                  )}

                  {/* Performance Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                      <p className="text-xs text-info-700 dark:text-info-400 mb-1">
                        API Calls Today
                      </p>
                      <p className="text-lg font-semibold text-info-900 dark:text-info-300">
                        {selectedIntegration.apiCallsToday.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg">
                      <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                        Success Rate
                      </p>
                      <p className="text-lg font-semibold text-success-900 dark:text-success-300">
                        {selectedIntegration.successRate}%
                      </p>
                    </div>
                  </div>
                </>
              )}
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
                  handleConfigure(selectedIntegration);
                }}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configure
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Configure Modal */}
        {selectedIntegration && (
          <FormModal
            isOpen={showConfigModal}
            onClose={() => setShowConfigModal(false)}
            title={`Configure ${selectedIntegration.name}`}
            description="Update integration settings and credentials"
            maxWidth="max-w-2xl"
          >
            <div className="space-y-4">
              <FormField>
                <FormLabel htmlFor="integrationName">Integration Name</FormLabel>
                <FormInput
                  id="integrationName"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  disabled
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="apiEndpoint" required>
                  API Endpoint
                </FormLabel>
                <FormInput
                  id="apiEndpoint"
                  type="text"
                  value={formApiEndpoint}
                  onChange={(e) => setFormApiEndpoint(e.target.value)}
                  placeholder="https://api.example.com/v1"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="apiKey" required>
                  API Key
                </FormLabel>
                <FormInput
                  id="apiKey"
                  type="password"
                  value={formApiKey}
                  onChange={(e) => setFormApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="webhookUrl">Webhook URL</FormLabel>
                <FormInput
                  id="webhookUrl"
                  type="text"
                  value={formWebhookUrl}
                  onChange={(e) => setFormWebhookUrl(e.target.value)}
                  placeholder="https://yourapp.com/webhooks/integration"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormTextarea
                  id="description"
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter integration description"
                />
              </FormField>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={handleTestConnection}
                  className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Test Connection
                </button>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Save Configuration
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Delete Modal */}
        {selectedIntegration && (
          <FormModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Remove Integration"
            description={`Are you sure you want to remove ${selectedIntegration.name}?`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-sm text-error-900 dark:text-error-400">
                  This action will disconnect the integration and remove all associated settings. This cannot be undone.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const Icon = selectedIntegration.icon;
                    return <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />;
                  })()}
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedIntegration.name}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {selectedIntegration.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm text-white bg-error-500 hover:bg-error-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Integration
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    </div>
  );
}