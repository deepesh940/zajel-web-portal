import { useState } from "react";
import {
  Shield,
  MoreVertical,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Activity,
  User,
  Lock,
  LogIn,
  LogOut,
  Key,
  FileText,
  Clock,
  MapPin,
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
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  status: "Success" | "Failed" | "Warning";
  details: string;
  severity: "Low" | "Medium" | "High" | "Critical";
}

type ViewMode = "grid" | "list" | "table";

export default function AuditLogsSecurity() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "AL-001",
      timestamp: "2024-01-28 10:45:23",
      userId: "USR-001",
      userName: "Ahmed Hassan",
      userRole: "Admin",
      action: "Updated User",
      module: "User Management",
      resourceType: "User",
      resourceId: "USR-045",
      ipAddress: "192.168.1.100",
      status: "Success",
      details: "Modified user role from Operations User to Operations Manager",
      severity: "Medium",
    },
    {
      id: "AL-002",
      timestamp: "2024-01-28 10:30:15",
      userId: "USR-002",
      userName: "Sarah Al-Mansouri",
      userRole: "Finance User",
      action: "Created Invoice",
      module: "Finance Management",
      resourceType: "Invoice",
      resourceId: "INV-2024-0123",
      ipAddress: "192.168.1.105",
      status: "Success",
      details: "Created invoice INV-2024-0123 for AED 5,240.00",
      severity: "Low",
    },
    {
      id: "AL-003",
      timestamp: "2024-01-28 10:15:42",
      userId: "USR-003",
      userName: "Mohammed Ali",
      userRole: "Operations Manager",
      action: "Deleted Shipment",
      module: "Operations",
      resourceType: "Shipment",
      resourceId: "SHP-2024-0456",
      ipAddress: "192.168.1.112",
      status: "Success",
      details: "Deleted draft shipment SHP-2024-0456",
      severity: "High",
    },
    {
      id: "AL-004",
      timestamp: "2024-01-28 10:00:30",
      userId: "USR-001",
      userName: "Ahmed Hassan",
      userRole: "Admin",
      action: "Failed Login Attempt",
      module: "Authentication",
      resourceType: "Login",
      resourceId: "N/A",
      ipAddress: "203.0.113.45",
      status: "Failed",
      details: "Failed login attempt - Invalid credentials",
      severity: "Critical",
    },
    {
      id: "AL-005",
      timestamp: "2024-01-28 09:45:18",
      userId: "USR-004",
      userName: "Fatima Abdullah",
      userRole: "Customer",
      action: "Updated Inquiry",
      module: "Customer Portal",
      resourceType: "Inquiry",
      resourceId: "INQ-2024-0789",
      ipAddress: "192.168.1.150",
      status: "Success",
      details: "Modified pickup location for inquiry INQ-2024-0789",
      severity: "Low",
    },
    {
      id: "AL-006",
      timestamp: "2024-01-28 09:30:55",
      userId: "USR-005",
      userName: "Khalid Rahman",
      userRole: "Driver",
      action: "Updated Trip Status",
      module: "Trip Management",
      resourceType: "Trip",
      resourceId: "TRP-2024-1234",
      ipAddress: "192.168.1.201",
      status: "Success",
      details: "Changed trip status from In Transit to Delivered",
      severity: "Low",
    },
    {
      id: "AL-007",
      timestamp: "2024-01-28 09:15:22",
      userId: "USR-002",
      userName: "Sarah Al-Mansouri",
      userRole: "Finance User",
      action: "Exported Report",
      module: "Finance Management",
      resourceType: "Report",
      resourceId: "RPT-FIN-0123",
      ipAddress: "192.168.1.105",
      status: "Success",
      details: "Exported monthly financial report to PDF",
      severity: "Low",
    },
    {
      id: "AL-008",
      timestamp: "2024-01-28 09:00:10",
      userId: "USR-006",
      userName: "Omar Khalifa",
      userRole: "Operations User",
      action: "Created Quote",
      module: "Pricing & Quotes",
      resourceType: "Quote",
      resourceId: "QTE-2024-0567",
      ipAddress: "192.168.1.115",
      status: "Success",
      details: "Generated quote QTE-2024-0567 for customer CUS-456",
      severity: "Low",
    },
    {
      id: "AL-009",
      timestamp: "2024-01-28 08:45:33",
      userId: "USR-001",
      userName: "Ahmed Hassan",
      userRole: "Admin",
      action: "Updated System Config",
      module: "System Configuration",
      resourceType: "Configuration",
      resourceId: "CFG-SLA-001",
      ipAddress: "192.168.1.100",
      status: "Success",
      details: "Modified SLA response time from 2 hours to 1.5 hours",
      severity: "High",
    },
    {
      id: "AL-010",
      timestamp: "2024-01-28 08:30:45",
      userId: "SYSTEM",
      userName: "System Automated",
      userRole: "System",
      action: "Auto-Backup",
      module: "System Maintenance",
      resourceType: "Backup",
      resourceId: "BCK-2024-0128",
      ipAddress: "127.0.0.1",
      status: "Success",
      details: "Automated daily database backup completed successfully",
      severity: "Low",
    },
    {
      id: "AL-011",
      timestamp: "2024-01-28 08:15:20",
      userId: "USR-007",
      userName: "Layla Hassan",
      userRole: "Customer Service",
      action: "Updated Customer",
      module: "Customer Management",
      resourceType: "Customer",
      resourceId: "CUS-789",
      ipAddress: "192.168.1.130",
      status: "Success",
      details: "Updated customer contact information and billing address",
      severity: "Medium",
    },
    {
      id: "AL-012",
      timestamp: "2024-01-28 08:00:12",
      userId: "USR-003",
      userName: "Mohammed Ali",
      userRole: "Operations Manager",
      action: "Failed Access Attempt",
      module: "Finance Management",
      resourceType: "Access",
      resourceId: "N/A",
      ipAddress: "192.168.1.112",
      status: "Failed",
      details: "Attempted to access Finance module without proper permissions",
      severity: "High",
    },
    {
      id: "AL-013",
      timestamp: "2024-01-28 07:45:55",
      userId: "USR-008",
      userName: "Amira Yousef",
      userRole: "Driver",
      action: "Logged In",
      module: "Authentication",
      resourceType: "Session",
      resourceId: "SES-20240128-001",
      ipAddress: "192.168.1.210",
      status: "Success",
      details: "Successful login from mobile device",
      severity: "Low",
    },
    {
      id: "AL-014",
      timestamp: "2024-01-28 07:30:40",
      userId: "USR-001",
      userName: "Ahmed Hassan",
      userRole: "Admin",
      action: "Created Integration",
      module: "Integration Management",
      resourceType: "Integration",
      resourceId: "INT-STRIPE-001",
      ipAddress: "192.168.1.100",
      status: "Success",
      details: "Configured new Stripe payment gateway integration",
      severity: "Medium",
    },
    {
      id: "AL-015",
      timestamp: "2024-01-28 07:15:25",
      userId: "USR-009",
      userName: "Yusuf Ahmed",
      userRole: "Customer",
      action: "Password Reset",
      module: "Authentication",
      resourceType: "User",
      resourceId: "USR-009",
      ipAddress: "192.168.1.165",
      status: "Warning",
      details: "Password reset requested and completed via email verification",
      severity: "Medium",
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
        { value: "Success", label: "Success" },
        { value: "Failed", label: "Failed" },
        { value: "Warning", label: "Warning" },
      ],
    },
    {
      id: "severity",
      label: "Severity",
      type: "select",
      values: [],
      options: [
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
        { value: "Critical", label: "Critical" },
      ],
    },
    {
      id: "module",
      label: "Module",
      type: "select",
      values: [],
      options: [
        { value: "User Management", label: "User Management" },
        { value: "Finance Management", label: "Finance Management" },
        { value: "Operations", label: "Operations" },
        { value: "Authentication", label: "Authentication" },
        { value: "Customer Portal", label: "Customer Portal" },
        { value: "Trip Management", label: "Trip Management" },
        { value: "System Configuration", label: "System Configuration" },
      ],
    },
  ];

  // Apply filters
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(log.status);

    const severityFilter = filters.find((f) => f.id === "severity");
    const matchesSeverity =
      !severityFilter || severityFilter.values.length === 0 || severityFilter.values.includes(log.severity);

    const moduleFilter = filters.find((f) => f.id === "module");
    const matchesModule =
      !moduleFilter || moduleFilter.values.length === 0 || moduleFilter.values.includes(log.module);

    return matchesSearch && matchesStatus && matchesSeverity && matchesModule;
  });

  // Apply sorting
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let comparison = 0;
    if (sortField === "timestamp") {
      comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (sortField === "userName") {
      comparison = a.userName.localeCompare(b.userName);
    } else if (sortField === "module") {
      comparison = a.module.localeCompare(b.module);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    let dotColor = "bg-neutral-400";
    if (status === "Success") dotColor = "bg-success-500";
    else if (status === "Failed") dotColor = "bg-error-500";
    else if (status === "Warning") dotColor = "bg-warning-500";

    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/30";
      case "Medium":
        return "text-info-600 dark:text-info-400 bg-info-50 dark:bg-info-900/30";
      case "High":
        return "text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/30";
      case "Critical":
        return "text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/30";
      default:
        return "text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/30";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("Login") || action.includes("Logged In")) return LogIn;
    if (action.includes("Logout")) return LogOut;
    if (action.includes("Password")) return Key;
    if (action.includes("Created")) return FileText;
    if (action.includes("Updated") || action.includes("Modified")) return Activity;
    if (action.includes("Deleted")) return AlertTriangle;
    if (action.includes("Exported")) return Download;
    return Shield;
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleExportLogs = () => {
    toast.success("Exporting audit logs...");
  };

  const stats = [
    {
      label: "Total Logs",
      value: auditLogs.length,
      icon: "FileText",
      subtitle: "Audit entries",
    },
    {
      label: "Successful Actions",
      value: auditLogs.filter((l) => l.status === "Success").length,
      icon: "CheckCircle",
      subtitle: "Completed successfully",
    },
    {
      label: "Failed Actions",
      value: auditLogs.filter((l) => l.status === "Failed").length,
      icon: "XCircle",
      subtitle: "Failed attempts",
    },
    {
      label: "Critical Events",
      value: auditLogs.filter((l) => l.severity === "Critical").length,
      icon: "AlertTriangle",
      subtitle: "High priority",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Audit Logs & Security"
          subtitle="Monitor system activity, user actions, and security events"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Audit Logs & Security", current: true },
          ]}
          primaryAction={{
            label: "Export Logs",
            onClick: handleExportLogs,
            icon: Download,
          }}
          moreMenu={{
            exportOptions: {
              onExportCSV: () => toast.success("Exporting as CSV..."),
              onExportExcel: () => toast.success("Exporting as Excel..."),
              onExportPDF: () => toast.success("Exporting as PDF..."),
            },
            onPrint: () => window.print(),
            sortOptions: [
              { value: "timestamp", label: "Time (Newest First)", direction: "desc" },
              { value: "timestamp", label: "Time (Oldest First)", direction: "asc" },
              { value: "userName", label: "User (A-Z)", direction: "asc" },
              { value: "module", label: "Module (A-Z)", direction: "asc" },
            ],
            sortField: sortField,
            sortDirection: sortDirection,
            onSortChange: (field, direction) => {
              setSortField(field);
              setSortDirection(direction);
            },
          }}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter((f) => f.values.length > 0).length}
              placeholder="Search audit logs..."
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
              {paginatedLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                return (
                  <div
                    key={log.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                    onClick={() => handleViewDetails(log)}
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <ActionIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            {log.action}
                          </h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {log.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(log.status)}

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(
                                openActionMenuId === log.id ? null : log.id
                              );
                            }}
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openActionMenuId === log.id && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(log);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Exporting log entry...");
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Download className="w-4 h-4" />
                                Export Entry
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {log.details}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 px-2.5 py-1 bg-neutral-50 dark:bg-neutral-900/30 rounded-full">
                        {log.module}
                      </span>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{log.userName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                return (
                  <div
                    key={log.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <ActionIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            {log.action}
                          </h3>
                          {getStatusBadge(log.status)}
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                            {log.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          {log.details}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            User: <span className="font-medium text-neutral-900 dark:text-white">{log.userName}</span> ({log.userRole})
                          </span>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Module: <span className="font-medium text-neutral-900 dark:text-white">{log.module}</span>
                          </span>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            IP: <span className="font-mono text-neutral-900 dark:text-white">{log.ipAddress}</span>
                          </span>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Time: <span className="font-medium text-neutral-900 dark:text-white">{log.timestamp}</span>
                          </span>
                        </div>
                      </div>

                      <div className="relative ml-4">
                        <button
                          onClick={() =>
                            setOpenActionMenuId(
                              openActionMenuId === log.id ? null : log.id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === log.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => handleViewDetails(log)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                toast.success("Exporting log entry...");
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Download className="w-4 h-4" />
                              Export Entry
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
                        Timestamp
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Module
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Severity
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
                    {paginatedLogs.map((log) => {
                      const ActionIcon = getActionIcon(log.action);
                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer"
                          onClick={() => handleViewDetails(log)}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                              {log.timestamp}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                              {log.userName}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {log.userRole}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <ActionIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                              <span className="text-sm text-neutral-900 dark:text-white">
                                {log.action}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-neutral-900 dark:text-white">
                              {log.module}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {getStatusBadge(log.status)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenuId(
                                    openActionMenuId === log.id ? null : log.id
                                  );
                                }}
                                className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                title="Actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {openActionMenuId === log.id && (
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetails(log);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.success("Exporting log entry...");
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <Download className="w-4 h-4" />
                                    Export Entry
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
          {filteredLogs.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Shield className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No audit logs found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "No audit logs available"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* Details Modal */}
        {selectedLog && (
          <FormModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Audit Log Details"
            description={selectedLog.id}
            maxWidth="max-w-3xl"
          >
            <div className="space-y-6">
              {/* Status & Severity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedLog.status)}
                  </div>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Severity
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedLog.severity)}`}>
                    {selectedLog.severity}
                  </span>
                </div>
              </div>

              {/* Action Details */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Action
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {selectedLog.action}
                </p>
              </div>

              {/* Details */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Details
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  {selectedLog.details}
                </p>
              </div>

              {/* User & Resource Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    User
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedLog.userName}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    {selectedLog.userRole} ({selectedLog.userId})
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Resource
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedLog.resourceType}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    ID: {selectedLog.resourceId}
                  </p>
                </div>
              </div>

              {/* Module & Timestamp */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Module
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedLog.module}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    IP Address
                  </p>
                  <p className="text-sm font-mono text-neutral-900 dark:text-white">
                    {selectedLog.ipAddress}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Timestamp
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedLog.timestamp}
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
                  toast.success("Exporting log entry...");
                  setShowDetailsModal(false);
                }}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Entry
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    </div>
  );
}