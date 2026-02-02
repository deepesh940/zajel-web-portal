import { useState, useMemo, useEffect } from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  Eye,
  Calendar,
  Bell,
  Copy,
  BarChart3,
  RefreshCw,
  User,
  MapPin,
  MoreVertical,
  FileText,
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
  SecondaryButton,
  PrimaryButton,
} from "../components/hb/listing";
import type { FilterCondition } from "../components/hb/listing";
import {
  FormModal,
  FormField,
  FormFooter,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface SLARecord {
  id: string;
  inquiryNumber: string;
  customerName: string;
  serviceType: string;
  submittedDate: string;
  targetResponseTime: string;
  actualResponseTime?: string;
  targetQuoteTime: string;
  actualQuoteTime?: string;
  currentStage:
  | "Inquiry Received"
  | "Under Review"
  | "Quote Prepared"
  | "Quote Sent"
  | "Completed";
  slaStatus: "On Time" | "At Risk" | "Breached";
  timeRemaining: string;
  breachReason?: string;
  assignedTo: string;
}

type ViewMode = "grid" | "list" | "table";

export default function SLAMonitoring() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<SLARecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("submittedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [records] = useState<SLARecord[]>([
    {
      id: "1",
      inquiryNumber: "INQ-2024-5678",
      customerName: "John Smith",
      serviceType: "Express Delivery",
      submittedDate: "2024-01-27T14:30:00",
      targetResponseTime: "2024-01-27T16:30:00",
      actualResponseTime: "2024-01-27T15:45:00",
      targetQuoteTime: "2024-01-27T18:30:00",
      currentStage: "Under Review",
      slaStatus: "On Time",
      timeRemaining: "2h 45m",
      assignedTo: "Ahmed Hassan",
    },
    {
      id: "2",
      inquiryNumber: "INQ-2024-5677",
      customerName: "Sarah Ahmed",
      serviceType: "Standard Delivery",
      submittedDate: "2024-01-27T10:15:00",
      targetResponseTime: "2024-01-27T14:15:00",
      actualResponseTime: "2024-01-27T14:00:00",
      targetQuoteTime: "2024-01-27T18:15:00",
      currentStage: "Quote Prepared",
      slaStatus: "At Risk",
      timeRemaining: "25m",
      assignedTo: "Fatima Khan",
    },
    {
      id: "3",
      inquiryNumber: "INQ-2024-5676",
      customerName: "Mohammed Ali",
      serviceType: "Express Delivery",
      submittedDate: "2024-01-27T08:00:00",
      targetResponseTime: "2024-01-27T10:00:00",
      actualResponseTime: "2024-01-27T09:30:00",
      targetQuoteTime: "2024-01-27T12:00:00",
      actualQuoteTime: "2024-01-27T11:45:00",
      currentStage: "Quote Sent",
      slaStatus: "On Time",
      timeRemaining: "Completed",
      assignedTo: "Omar Saleh",
    },
    {
      id: "4",
      inquiryNumber: "INQ-2024-5675",
      customerName: "Alex Johnson",
      serviceType: "Same Day Delivery",
      submittedDate: "2024-01-27T06:45:00",
      targetResponseTime: "2024-01-27T07:45:00",
      actualResponseTime: "2024-01-27T08:15:00",
      targetQuoteTime: "2024-01-27T09:45:00",
      actualQuoteTime: "2024-01-27T10:30:00",
      currentStage: "Quote Sent",
      slaStatus: "Breached",
      timeRemaining: "Breached",
      breachReason: "High inquiry volume, delayed resource allocation",
      assignedTo: "Sara Ahmed",
    },
    {
      id: "5",
      inquiryNumber: "INQ-2024-5674",
      customerName: "Lisa Wang",
      serviceType: "Standard Delivery",
      submittedDate: "2024-01-27T11:20:00",
      targetResponseTime: "2024-01-27T15:20:00",
      targetQuoteTime: "2024-01-27T17:20:00",
      currentStage: "Inquiry Received",
      slaStatus: "At Risk",
      timeRemaining: "1h 15m",
      assignedTo: "Unassigned",
    },
    {
      id: "6",
      inquiryNumber: "INQ-2024-5673",
      customerName: "David Brown",
      serviceType: "Express Delivery",
      submittedDate: "2024-01-27T09:00:00",
      targetResponseTime: "2024-01-27T11:00:00",
      actualResponseTime: "2024-01-27T10:15:00",
      targetQuoteTime: "2024-01-27T13:00:00",
      actualQuoteTime: "2024-01-27T12:30:00",
      currentStage: "Completed",
      slaStatus: "On Time",
      timeRemaining: "Completed",
      assignedTo: "Ahmed Hassan",
    },
  ]);

  // Filter options
  const filterOptions: Record<string, string[]> = {
    "SLA Status": ["On Time", "At Risk", "Breached"],
    "Current Stage": [
      "Inquiry Received",
      "Under Review",
      "Quote Prepared",
      "Quote Sent",
      "Completed",
    ],
    "Service Type": [
      "Express Delivery",
      "Standard Delivery",
      "Same Day Delivery",
      "Economy Delivery",
    ],
  };

  // Filter and search logic
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        searchQuery === "" ||
        record.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.serviceType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = filters.every((filter) => {
        if (filter.field === "SLA Status") {
          return filter.values.includes(record.slaStatus);
        } else if (filter.field === "Current Stage") {
          return filter.values.includes(record.currentStage);
        } else if (filter.field === "Service Type") {
          return filter.values.includes(record.serviceType);
        }
        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [records, searchQuery, filters]);

  // Calculate paginated data
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const getSLAColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "On Time":
        return "success";
      case "At Risk":
        return "warning";
      case "Breached":
        return "error";
      default:
        return "neutral";
    }
  };

  const getStageColor = (
    stage: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (stage) {
      case "Inquiry Received":
        return "info";
      case "Under Review":
        return "warning";
      case "Quote Prepared":
        return "info";
      case "Quote Sent":
        return "success";
      case "Completed":
        return "neutral";
      default:
        return "neutral";
    }
  };

  // Status badge component following design guidelines
  const getSLABadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${getSLAColor(status) === "success"
            ? "bg-success-500"
            : getSLAColor(status) === "warning"
              ? "bg-warning-500"
              : getSLAColor(status) === "error"
                ? "bg-error-500"
                : "bg-neutral-400"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {status}
        </span>
      </span>
    );
  };

  const getStageBadge = (stage: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${getStageColor(stage) === "success"
            ? "bg-success-500"
            : getStageColor(stage) === "warning"
              ? "bg-warning-500"
              : getStageColor(stage) === "error"
                ? "bg-error-500"
                : getStageColor(stage) === "info"
                  ? "bg-info-500"
                  : "bg-neutral-400"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {stage}
        </span>
      </span>
    );
  };

  const getTimeRemainingColor = (status: string, timeRemaining: string) => {
    if (timeRemaining === "Completed")
      return "text-neutral-600 dark:text-neutral-400";
    if (status === "Breached") return "text-error-600 dark:text-error-400";
    if (status === "At Risk") return "text-warning-600 dark:text-warning-400";
    return "text-success-600 dark:text-success-400";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (record: SLARecord) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleCopyInquiryNumber = (inquiryNumber: string) => {
    navigator.clipboard.writeText(inquiryNumber);
    toast.success("Inquiry number copied!");
  };

  const handleSendAlert = (record: SLARecord) => {
    toast.success(`Alert sent for ${record.inquiryNumber}`);
    setOpenActionMenuId(null);
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleSubmitNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("New SLA record created successfully!");
    setShowAddModal(false);
  };

  // Summary widgets
  const stats = [
    {
      label: "Total Records",
      value: records.length.toString(),
      icon: "FileText",
      subtitle: "All SLA records",
    },
    {
      label: "On Time",
      value: records.filter((r) => r.slaStatus === "On Time").length.toString(),
      icon: "CheckCircle",
      subtitle: "Meeting SLA",
    },
    {
      label: "At Risk",
      value: records.filter((r) => r.slaStatus === "At Risk").length.toString(),
      icon: "AlertTriangle",
      subtitle: "SLA warning",
    },
    {
      label: "Breached",
      value: records.filter((r) => r.slaStatus === "Breached").length.toString(),
      icon: "XCircle",
      subtitle: "SLA missed",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="SLA Monitoring"
          subtitle="Track service level agreement compliance and response times"
          breadcrumbs={[
            { label: "Operations", href: "#" },
            { label: "SLA Monitoring", current: true },
          ]}
          primaryAction={{
            label: "Add Record",
            onClick: handleAddNew,
            icon: Plus,
          }}
          moreMenu={{

            sortOptions: [
              {
                value: "inquiryNumber",
                label: "Inquiry Number (A-Z)",
                direction: "asc",
              },
              {
                value: "inquiryNumber",
                label: "Inquiry Number (Z-A)",
                direction: "desc",
              },
              {
                value: "submittedDate",
                label: "Date (Newest)",
                direction: "desc",
              },
              {
                value: "submittedDate",
                label: "Date (Oldest)",
                direction: "asc",
              },
              { value: "slaStatus", label: "SLA Status", direction: "asc" },
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
              activeFilterCount={
                filters.filter((f) => f.values.length > 0).length
              }
              placeholder="Search SLA records..."
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
              setFilters(filters.filter((f) => f.id !== filterId));
            }}
            onClearAll={() => setFilters([])}
          />
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && <SummaryWidgets widgets={stats} />}

        {/* ========== CONTENT AREA ========== */}
        <div className="space-y-4">
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {record.inquiryNumber}
                        </h3>
                        <button
                          onClick={() =>
                            handleCopyInquiryNumber(record.inquiryNumber)
                          }
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy inquiry number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {record.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Package className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{record.serviceType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{formatTimestamp(record.submittedDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Time Remaining:{" "}
                          </span>
                          <span
                            className={`font-semibold ${getTimeRemainingColor(
                              record.slaStatus,
                              record.timeRemaining
                            )}`}
                          >
                            {record.timeRemaining}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Assigned:{" "}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {record.assignedTo}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getSLABadge(record.slaStatus)}
                      {getStageBadge(record.currentStage)}

                      <div className="relative ml-2">
                        <button
                          onClick={() =>
                            setOpenActionMenuId(
                              openActionMenuId === record.id ? null : record.id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === record.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => {
                                handleViewDetails(record);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            {record.slaStatus === "At Risk" && (
                              <button
                                onClick={() => handleSendAlert(record)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Bell className="w-4 h-4" />
                                Send Alert
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleCopyInquiryNumber(record.inquiryNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Inquiry Number
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {record.inquiryNumber}
                        </h3>
                        <button
                          onClick={() =>
                            handleCopyInquiryNumber(record.inquiryNumber)
                          }
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors flex-shrink-0"
                          title="Copy inquiry number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {getSLABadge(record.slaStatus)}
                        {getStageBadge(record.currentStage)}

                        {/* Three-dot menu beside status badges */}
                        <div className="relative ml-auto">
                          <button
                            onClick={() =>
                              setOpenActionMenuId(
                                openActionMenuId === record.id ? null : record.id
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openActionMenuId === record.id && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                              <button
                                onClick={() => {
                                  handleViewDetails(record);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              {record.slaStatus === "At Risk" && (
                                <button
                                  onClick={() => {
                                    handleSendAlert(record);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Bell className="w-4 h-4" />
                                  Send Alert
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleCopyInquiryNumber(record.inquiryNumber);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Copy className="w-4 h-4" />
                                Copy Inquiry Number
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{record.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Package className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{record.serviceType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>{formatTimestamp(record.submittedDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
                    <div className="text-xs">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Time Remaining
                      </p>
                      <p
                        className={`font-semibold mt-1 ${getTimeRemainingColor(
                          record.slaStatus,
                          record.timeRemaining
                        )}`}
                      >
                        {record.timeRemaining}
                      </p>
                    </div>
                    <div className="text-xs text-right">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Assigned To
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-white mt-1">
                        {record.assignedTo}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === "table" && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Inquiry Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Service Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Assigned To
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Current Stage
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        SLA Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Time Remaining
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {record.inquiryNumber}
                            </span>
                            <button
                              onClick={() =>
                                handleCopyInquiryNumber(record.inquiryNumber)
                              }
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                              title="Copy inquiry number"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                          {record.customerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                          {record.serviceType}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                          {record.assignedTo}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getStageBadge(record.currentStage)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getSLABadge(record.slaStatus)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`font-semibold ${getTimeRemainingColor(
                              record.slaStatus,
                              record.timeRemaining
                            )}`}
                          >
                            {record.timeRemaining}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenActionMenuId(
                                  openActionMenuId === record.id ? null : record.id
                                )
                              }
                              className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === record.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={() => {
                                    handleViewDetails(record);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                {record.slaStatus === "At Risk" && (
                                  <button
                                    onClick={() => {
                                      handleSendAlert(record);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <Bell className="w-4 h-4" />
                                    Send Alert
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    handleCopyInquiryNumber(record.inquiryNumber);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Inquiry Number
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {paginatedRecords.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                No SLA records found
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* ========== PAGINATION ========== */}
        {filteredRecords.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRecords.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredRecords.length}
          />
        )}
      </div>

      {/* ========== VIEW DETAILS MODAL ========== */}
      {showDetailsModal && selectedRecord && (
        <FormModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={`SLA Details - ${selectedRecord.inquiryNumber}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                  Current Stage
                </p>
                {getStageBadge(selectedRecord.currentStage)}
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                  SLA Status
                </p>
                {getSLABadge(selectedRecord.slaStatus)}
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Time Remaining
                </p>
                <p
                  className={`text-lg font-semibold ${getTimeRemainingColor(
                    selectedRecord.slaStatus,
                    selectedRecord.timeRemaining
                  )}`}
                >
                  {selectedRecord.timeRemaining}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                SLA Timeline
              </h4>
              <div className="space-y-4">
                {/* Response Time */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        Initial Response
                      </p>
                    </div>
                    {selectedRecord.actualResponseTime && (
                      <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-400" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Target Time
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {formatTimestamp(selectedRecord.targetResponseTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Actual Time
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedRecord.actualResponseTime
                          ? formatTimestamp(selectedRecord.actualResponseTime)
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quote Time */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        Quote Delivery
                      </p>
                    </div>
                    {selectedRecord.actualQuoteTime && (
                      <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-400" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Target Time
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {formatTimestamp(selectedRecord.targetQuoteTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Actual Time
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedRecord.actualQuoteTime
                          ? formatTimestamp(selectedRecord.actualQuoteTime)
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Breach Reason */}
            {selectedRecord.breachReason && (
              <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-error-900 dark:text-error-400 mb-1">
                      SLA Breach Reason
                    </p>
                    <p className="text-sm text-error-700 dark:text-error-400">
                      {selectedRecord.breachReason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Assignment Info */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Assigned To
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRecord.assignedTo}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Customer
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRecord.customerName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowDetailsModal(false)}>
              Close
            </SecondaryButton>
          </FormFooter>
        </FormModal>
      )}

      {/* ========== ADD SLA RECORD MODAL ========== */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add SLA Record"
        description="Create a new SLA monitoring record"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmitNewRecord}>
          <div className="space-y-6">
            {/* Inquiry Information */}
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                Inquiry Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="inquiryNumber" required>Inquiry Number</FormLabel>
                  <FormInput id="inquiryNumber" type="text" required placeholder="INQ-2024-XXXX" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="customerName" required>Customer Name</FormLabel>
                  <FormInput id="customerName" type="text" required placeholder="Enter customer name" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="serviceType" required>Service Type</FormLabel>
                  <FormSelect id="serviceType" required>
                    <option value="">Select service</option>
                    <option value="Express Delivery">Express Delivery</option>
                    <option value="Standard Delivery">Standard Delivery</option>
                    <option value="Same Day Delivery">Same Day Delivery</option>
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="assignedTo" required>Assigned To</FormLabel>
                  <FormInput id="assignedTo" type="text" required placeholder="Staff member name" />
                </FormField>
              </div>
            </div>

            {/* SLA Timings */}
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                SLA Timings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="targetResponseTime" required>Target Response Time</FormLabel>
                  <FormInput id="targetResponseTime" type="datetime-local" required />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="actualResponseTime">Actual Response Time</FormLabel>
                  <FormInput id="actualResponseTime" type="datetime-local" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="targetQuoteTime" required>Target Quote Time</FormLabel>
                  <FormInput id="targetQuoteTime" type="datetime-local" required />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="actualQuoteTime">Actual Quote Time</FormLabel>
                  <FormInput id="actualQuoteTime" type="datetime-local" />
                </FormField>
              </div>
            </div>

            {/* SLA Status */}
            <FormField>
              <FormLabel htmlFor="slaStatus" required>SLA Status</FormLabel>
              <FormSelect id="slaStatus" required>
                <option value="">Select status</option>
                <option value="On Time">On Time</option>
                <option value="At Risk">At Risk</option>
                <option value="Breached">Breached</option>
              </FormSelect>
            </FormField>

            {/* Breach Reason */}
            <FormField>
              <FormLabel htmlFor="breachReason">Breach Reason (if applicable)</FormLabel>
              <FormTextarea
                id="breachReason"
                placeholder="Explain reason for SLA breach..."
                rows={3}
              />
            </FormField>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowAddModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit">
              Create Record
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}