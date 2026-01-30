import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  User,
  Calendar,
  Package,
  FileText,
  Send,
  Flag,
  MoreVertical,
  Copy,
  Download,
  BarChart3,
  RefreshCw,
  Activity,
  UserCheck,
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

interface Escalation {
  id: string;
  escalationNumber: string;
  title: string;
  description: string;
  category:
    | "Pricing Issue"
    | "SLA Breach"
    | "Customer Complaint"
    | "Operational Delay"
    | "Quality Issue"
    | "Driver Issue";
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  relatedInquiry?: string;
  customerName: string;
  reportedBy: string;
  assignedTo?: string;
  reportedDate: string;
  dueDate: string;
  resolvedDate?: string;
  resolution?: string;
  comments: {
    id: string;
    author: string;
    timestamp: string;
    message: string;
  }[];
}

type ViewMode = "grid" | "list" | "table";

export default function EscalationManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [assignedUser, setAssignedUser] = useState("");
  const [resolution, setResolution] = useState("");
  const [newComment, setNewComment] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("reportedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [escalations, setEscalations] = useState<Escalation[]>([
    {
      id: "1",
      escalationNumber: "ESC-2024-0123",
      title: "Customer complaint about late delivery",
      description:
        "Customer reports shipment was delivered 3 hours past the committed time window. Express delivery service was promised.",
      category: "Customer Complaint",
      severity: "High",
      status: "Open",
      relatedInquiry: "INQ-2024-5678",
      customerName: "John Smith",
      reportedBy: "Ahmed Hassan",
      reportedDate: "2024-01-27T14:30:00",
      dueDate: "2024-01-29",
      comments: [
        {
          id: "1",
          author: "Ahmed Hassan",
          timestamp: "2024-01-27T14:35:00",
          message:
            "Customer called to express dissatisfaction. Requested immediate resolution.",
        },
      ],
    },
    {
      id: "2",
      escalationNumber: "ESC-2024-0122",
      title: "SLA breach - Processing time exceeded",
      description:
        "Quote generation took 48 hours instead of the committed 24-hour turnaround time for standard inquiries.",
      category: "SLA Breach",
      severity: "Critical",
      status: "In Progress",
      relatedInquiry: "INQ-2024-5677",
      customerName: "Sarah Ahmed",
      reportedBy: "Fatima Khan",
      assignedTo: "Operations Manager",
      reportedDate: "2024-01-26T09:00:00",
      dueDate: "2024-01-28",
      comments: [
        {
          id: "1",
          author: "Fatima Khan",
          timestamp: "2024-01-26T09:15:00",
          message: "Escalated to operations team for review.",
        },
        {
          id: "2",
          author: "Operations Manager",
          timestamp: "2024-01-26T11:30:00",
          message:
            "Investigating the cause. Initial findings suggest system bottleneck during peak hours.",
        },
      ],
    },
    {
      id: "3",
      escalationNumber: "ESC-2024-0121",
      title: "Driver refused to handle fragile items",
      description:
        "Driver claimed vehicle wasn't equipped to handle fragile cargo despite booking confirmation stating otherwise.",
      category: "Driver Issue",
      severity: "Medium",
      status: "In Progress",
      relatedInquiry: "INQ-2024-5676",
      customerName: "Mohammed Ali",
      reportedBy: "Omar Saleh",
      assignedTo: "Driver Supervisor",
      reportedDate: "2024-01-25T16:00:00",
      dueDate: "2024-01-27",
      comments: [
        {
          id: "1",
          author: "Omar Saleh",
          timestamp: "2024-01-25T16:15:00",
          message:
            "Customer on-site with prepared shipment. Driver inspection revealed vehicle lacks proper securing equipment.",
        },
        {
          id: "2",
          author: "Driver Supervisor",
          timestamp: "2024-01-25T17:00:00",
          message:
            "Alternative driver with equipped vehicle dispatched. ETA 45 minutes.",
        },
      ],
    },
    {
      id: "4",
      escalationNumber: "ESC-2024-0120",
      title: "Pricing dispute - Quote too high",
      description:
        "Customer claims quote is 30% higher than previous similar shipment from last month without explanation.",
      category: "Pricing Issue",
      severity: "Low",
      status: "Resolved",
      relatedInquiry: "INQ-2024-5675",
      customerName: "Alex Johnson",
      reportedBy: "Ahmed Hassan",
      assignedTo: "Finance Manager",
      reportedDate: "2024-01-24T11:00:00",
      dueDate: "2024-01-26",
      resolvedDate: "2024-01-25T15:30:00",
      resolution:
        "Reviewed pricing. Fuel surcharge was increased 15% effective this month. Provided breakdown to customer and offered 10% discount as goodwill gesture for loyal customer. Customer accepted revised quote.",
      comments: [
        {
          id: "1",
          author: "Ahmed Hassan",
          timestamp: "2024-01-24T11:30:00",
          message: "Customer requested detailed pricing breakdown and comparison.",
        },
        {
          id: "2",
          author: "Finance Manager",
          timestamp: "2024-01-25T14:00:00",
          message:
            "Prepared detailed comparison. Fuel costs and route changes account for difference.",
        },
      ],
    },
    {
      id: "5",
      escalationNumber: "ESC-2024-0119",
      title: "Missing documentation for customs clearance",
      description:
        "International shipment held at customs due to incomplete commercial invoice. Customer provided documents but system error prevented attachment.",
      category: "Operational Delay",
      severity: "Critical",
      status: "Resolved",
      relatedInquiry: "INQ-2024-5670",
      customerName: "Lisa Wang",
      reportedBy: "Customs Team",
      assignedTo: "IT Support",
      reportedDate: "2024-01-23T08:00:00",
      dueDate: "2024-01-23",
      resolvedDate: "2024-01-23T12:00:00",
      resolution:
        "IT team identified and fixed document upload issue. All required documents successfully submitted to customs. Shipment cleared and released for delivery.",
      comments: [
        {
          id: "1",
          author: "Customs Team",
          timestamp: "2024-01-23T08:30:00",
          message: "Urgent: Shipment incurring demurrage charges. Need immediate fix.",
        },
        {
          id: "2",
          author: "IT Support",
          timestamp: "2024-01-23T10:00:00",
          message: "Bug identified in file upload module. Deploying hotfix.",
        },
        {
          id: "3",
          author: "IT Support",
          timestamp: "2024-01-23T12:00:00",
          message: "Fixed deployed. Documents submitted successfully.",
        },
      ],
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
        { value: "Open", label: "Open" },
        { value: "In Progress", label: "In Progress" },
        { value: "Resolved", label: "Resolved" },
        { value: "Closed", label: "Closed" },
      ],
    },
    {
      id: "severity",
      label: "Severity",
      type: "select",
      values: [],
      options: [
        { value: "Critical", label: "Critical" },
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
      ],
    },
    {
      id: "category",
      label: "Category",
      type: "select",
      values: [],
      options: [
        { value: "Pricing Issue", label: "Pricing Issue" },
        { value: "SLA Breach", label: "SLA Breach" },
        { value: "Customer Complaint", label: "Customer Complaint" },
        { value: "Operational Delay", label: "Operational Delay" },
        { value: "Quality Issue", label: "Quality Issue" },
        { value: "Driver Issue", label: "Driver Issue" },
      ],
    },
  ];

  // Apply filters
  const filteredEscalations = escalations.filter((escalation) => {
    const matchesSearch =
      escalation.escalationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      escalation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      escalation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      escalation.relatedInquiry?.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(escalation.status);

    const severityFilter = filters.find((f) => f.id === "severity");
    const matchesSeverity =
      !severityFilter || severityFilter.values.length === 0 || severityFilter.values.includes(escalation.severity);

    const categoryFilter = filters.find((f) => f.id === "category");
    const matchesCategory =
      !categoryFilter || categoryFilter.values.length === 0 || categoryFilter.values.includes(escalation.category);

    return matchesSearch && matchesStatus && matchesSeverity && matchesCategory;
  });

  // Apply sorting
  const sortedEscalations = [...filteredEscalations].sort((a, b) => {
    let comparison = 0;
    if (sortField === "reportedDate") {
      comparison = new Date(a.reportedDate).getTime() - new Date(b.reportedDate).getTime();
    } else if (sortField === "escalationNumber") {
      comparison = a.escalationNumber.localeCompare(b.escalationNumber);
    } else if (sortField === "customerName") {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortField === "severity") {
      const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      comparison = severityOrder[a.severity] - severityOrder[b.severity];
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEscalations.length / itemsPerPage);
  const paginatedEscalations = sortedEscalations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Open":
        return "error";
      case "In Progress":
        return "info";
      case "Resolved":
        return "success";
      case "Closed":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            getStatusColor(status) === "success"
              ? "bg-success-500"
              : getStatusColor(status) === "error"
              ? "bg-error-500"
              : getStatusColor(status) === "info"
              ? "bg-info-500"
              : "bg-neutral-400"
          }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const colorClass =
      severity === "Critical"
        ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 border-error-200 dark:border-error-800"
        : severity === "High"
        ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800"
        : severity === "Medium"
        ? "bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400 border-info-200 dark:border-info-800"
        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${colorClass}`}>
        <Flag className="w-3 h-3" />
        {severity}
      </span>
    );
  };

  const handleViewDetails = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleAssign = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setAssignedUser("");
    setShowAssignModal(true);
    setOpenActionMenuId(null);
  };

  const confirmAssign = () => {
    if (!assignedUser) {
      toast.error("Please enter an assignee");
      return;
    }
    if (selectedEscalation) {
      setEscalations(
        escalations.map((e) =>
          e.id === selectedEscalation.id
            ? { ...e, assignedTo: assignedUser, status: "In Progress" }
            : e
        )
      );
      toast.success(`Escalation assigned to ${assignedUser}`);
    }
    setShowAssignModal(false);
  };

  const handleResolve = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setResolution("");
    setShowResolveModal(true);
    setOpenActionMenuId(null);
  };

  const confirmResolve = () => {
    if (!resolution.trim()) {
      toast.error("Please provide a resolution");
      return;
    }
    if (selectedEscalation) {
      setEscalations(
        escalations.map((e) =>
          e.id === selectedEscalation.id
            ? {
                ...e,
                status: "Resolved",
                resolution,
                resolvedDate: new Date().toISOString(),
              }
            : e
        )
      );
      toast.success("Escalation marked as resolved");
    }
    setShowResolveModal(false);
  };

  const handleAddComment = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setNewComment("");
    setShowCommentModal(true);
    setOpenActionMenuId(null);
  };

  const confirmAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    if (selectedEscalation) {
      const comment = {
        id: Date.now().toString(),
        author: "Current User",
        timestamp: new Date().toISOString(),
        message: newComment,
      };
      setEscalations(
        escalations.map((e) =>
          e.id === selectedEscalation.id
            ? { ...e, comments: [...e.comments, comment] }
            : e
        )
      );
      toast.success("Comment added");
    }
    setShowCommentModal(false);
  };

  const handleCopyEscalationNumber = (escalationNumber: string) => {
    navigator.clipboard.writeText(escalationNumber);
    toast.success("Escalation number copied to clipboard");
  };

  const handleDownloadEscalation = (escalation: Escalation) => {
    toast.success(`Downloading escalation ${escalation.escalationNumber}`);
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

  const stats = [
    {
      label: "Open",
      value: escalations.filter((e) => e.status === "Open").length,
      icon: "AlertCircle",
      subtitle: "Awaiting action",
    },
    {
      label: "In Progress",
      value: escalations.filter((e) => e.status === "In Progress").length,
      icon: "Activity",
      subtitle: "Being handled",
    },
    {
      label: "Resolved",
      value: escalations.filter((e) => e.status === "Resolved").length,
      icon: "CheckCircle",
      subtitle: "Recently resolved",
    },
    {
      label: "Critical",
      value: escalations.filter((e) => e.severity === "Critical").length,
      icon: "AlertCircle",
      subtitle: "High priority",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Escalation Management"
          subtitle="Track and resolve customer escalations and critical issues"
          breadcrumbs={[
            { label: "Operations", href: "#" },
            { label: "Escalation Management", current: true },
          ]}
          moreMenu={{
            onImport: () => toast.success("Import functionality"),
            exportOptions: {
              onExportCSV: () => toast.success("Exporting as CSV..."),
              onExportExcel: () => toast.success("Exporting as Excel..."),
              onExportPDF: () => toast.success("Exporting as PDF..."),
            },
            onPrint: () => window.print(),
            sortOptions: [
              {
                value: "escalationNumber",
                label: "Escalation Number (A-Z)",
                direction: "asc",
              },
              {
                value: "escalationNumber",
                label: "Escalation Number (Z-A)",
                direction: "desc",
              },
              {
                value: "reportedDate",
                label: "Date (Newest)",
                direction: "desc",
              },
              {
                value: "reportedDate",
                label: "Date (Oldest)",
                direction: "asc",
              },
              { value: "severity", label: "Severity (High to Low)", direction: "desc" },
              { value: "severity", label: "Severity (Low to High)", direction: "asc" },
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
              placeholder="Search escalations..."
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
              {paginatedEscalations.map((escalation) => (
                <div
                  key={escalation.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(escalation)}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {escalation.escalationNumber}
                    </h3>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(escalation.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === escalation.id ? null : escalation.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === escalation.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(escalation);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            {escalation.status !== "Resolved" && escalation.status !== "Closed" && (
                              <>
                                {!escalation.assignedTo && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAssign(escalation);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    Assign
                                  </button>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddComment(escalation);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Add Comment
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResolve(escalation);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Resolve
                                </button>
                              </>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyEscalationNumber(escalation.escalationNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Escalation Number
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadEscalation(escalation);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Severity Badge */}
                  <div className="mb-3">{getSeverityBadge(escalation.severity)}</div>

                  {/* Title */}
                  <p className="text-sm font-medium text-neutral-900 dark:text-white mb-3 line-clamp-2">
                    {escalation.title}
                  </p>

                  {/* Escalation Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{escalation.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{escalation.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Due: {escalation.dueDate}</span>
                    </div>
                  </div>

                  {/* Assigned To or Comments */}
                  {escalation.assignedTo ? (
                    <div className="p-3 bg-info-50 dark:bg-info-900/30 rounded-lg border border-info-200 dark:border-info-800">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-info-600 dark:text-info-400" />
                        <div>
                          <p className="text-xs text-info-700 dark:text-info-400">
                            Assigned To
                          </p>
                          <p className="text-sm font-medium text-info-900 dark:text-info-300">
                            {escalation.assignedTo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-warning-50 dark:bg-warning-900/30 rounded-lg border border-warning-200 dark:border-warning-800">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                        <span className="text-sm font-medium text-warning-700 dark:text-warning-400">
                          Not Assigned
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Comments Count */}
                  <div className="mt-3 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <MessageSquare className="w-3 h-3" />
                    {escalation.comments.length} comment{escalation.comments.length !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedEscalations.map((escalation) => (
                <div
                  key={escalation.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {escalation.escalationNumber}
                        </h3>
                        <button
                          onClick={() =>
                            handleCopyEscalationNumber(escalation.escalationNumber)
                          }
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy escalation number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {getStatusBadge(escalation.status)}
                        {getSeverityBadge(escalation.severity)}
                      </div>

                      <p className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
                        {escalation.title}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{escalation.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{escalation.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Due: {escalation.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <MessageSquare className="w-4 h-4 flex-shrink-0" />
                          <span>{escalation.comments.length} comments</span>
                        </div>
                      </div>

                      {escalation.assignedTo && (
                        <div className="flex items-center gap-2 text-sm">
                          <UserCheck className="w-4 h-4 text-info-600 dark:text-info-400" />
                          <span className="text-info-600 dark:text-info-400">
                            Assigned to {escalation.assignedTo}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(
                            openActionMenuId === escalation.id ? null : escalation.id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === escalation.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleViewDetails(escalation)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {escalation.status !== "Resolved" && escalation.status !== "Closed" && (
                            <>
                              {!escalation.assignedTo && (
                                <button
                                  onClick={() => handleAssign(escalation)}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  Assign
                                </button>
                              )}

                              <button
                                onClick={() => handleAddComment(escalation)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Add Comment
                              </button>

                              <button
                                onClick={() => handleResolve(escalation)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Resolve
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => {
                              handleCopyEscalationNumber(escalation.escalationNumber);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Escalation Number
                          </button>

                          <button
                            onClick={() => {
                              handleDownloadEscalation(escalation);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                        Escalation Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedEscalations.map((escalation) => (
                      <tr
                        key={escalation.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer relative"
                        onClick={() => handleViewDetails(escalation)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {escalation.escalationNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyEscalationNumber(escalation.escalationNumber);
                              }}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(escalation.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getSeverityBadge(escalation.severity)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white max-w-xs truncate">
                            {escalation.title}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {escalation.customerName}
                          </div>
                          {escalation.relatedInquiry && (
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {escalation.relatedInquiry}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {escalation.category}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {escalation.assignedTo ? (
                            <div className="text-sm text-info-600 dark:text-info-400 flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              {escalation.assignedTo}
                            </div>
                          ) : (
                            <div className="text-sm text-warning-600 dark:text-warning-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Unassigned
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === escalation.id ? null : escalation.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === escalation.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(escalation);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>

                                {escalation.status !== "Resolved" &&
                                  escalation.status !== "Closed" && (
                                    <>
                                      {!escalation.assignedTo && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAssign(escalation);
                                          }}
                                          className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                        >
                                          <UserCheck className="w-4 h-4" />
                                          Assign
                                        </button>
                                      )}

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddComment(escalation);
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                      >
                                        <MessageSquare className="w-4 h-4" />
                                        Add Comment
                                      </button>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleResolve(escalation);
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Resolve
                                      </button>
                                    </>
                                  )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyEscalationNumber(escalation.escalationNumber);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Escalation Number
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadEscalation(escalation);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download Details
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

          {/* Empty State */}
          {filteredEscalations.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No escalations found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "No escalations to display"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredEscalations.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEscalations.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* Details Modal */}
        <FormModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Escalation Details"
          description={selectedEscalation?.escalationNumber}
          maxWidth="max-w-4xl"
        >
          {selectedEscalation && (
            <div className="space-y-6">
              {/* Status & Severity */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedEscalation.status)}
                {getSeverityBadge(selectedEscalation.severity)}
              </div>

              {/* Title */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  {selectedEscalation.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedEscalation.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Customer
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedEscalation.customerName}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Category
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedEscalation.category}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Reported By
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedEscalation.reportedBy}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Assigned To
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedEscalation.assignedTo || "Not assigned"}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Reported Date
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatTimestamp(selectedEscalation.reportedDate)}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Due Date
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedEscalation.dueDate}
                  </p>
                </div>
                {selectedEscalation.resolvedDate && (
                  <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
                    <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                      Resolved Date
                    </p>
                    <p className="text-sm font-medium text-success-900 dark:text-success-300">
                      {formatTimestamp(selectedEscalation.resolvedDate)}
                    </p>
                  </div>
                )}
              </div>

              {/* Resolution */}
              {selectedEscalation.resolution && (
                <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
                  <p className="text-xs text-success-700 dark:text-success-400 mb-2 font-semibold">
                    Resolution
                  </p>
                  <p className="text-sm text-success-900 dark:text-success-300">
                    {selectedEscalation.resolution}
                  </p>
                </div>
              )}

              {/* Comments */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comments ({selectedEscalation.comments.length})
                </h4>
                <div className="space-y-3">
                  {selectedEscalation.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {comment.author}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatTimestamp(comment.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {comment.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <FormFooter>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
            {selectedEscalation &&
              selectedEscalation.status !== "Resolved" &&
              selectedEscalation.status !== "Closed" && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleAddComment(selectedEscalation);
                    }}
                    className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Add Comment
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleResolve(selectedEscalation);
                    }}
                    className="px-4 py-2 text-sm text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resolve
                  </button>
                </>
              )}
          </FormFooter>
        </FormModal>

        {/* Assign Modal */}
        {selectedEscalation && (
          <FormModal
            isOpen={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            title="Assign Escalation"
            description={`${selectedEscalation.escalationNumber} - ${selectedEscalation.title}`}
          >
            <div className="space-y-4">
              <FormField>
                <FormLabel htmlFor="assignedUser" required>
                  Assign To
                </FormLabel>
                <FormInput
                  id="assignedUser"
                  type="text"
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  placeholder="Enter name or team"
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssign}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Assign
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Resolve Modal */}
        {selectedEscalation && (
          <FormModal
            isOpen={showResolveModal}
            onClose={() => setShowResolveModal(false)}
            title="Resolve Escalation"
            description={`${selectedEscalation.escalationNumber} - ${selectedEscalation.title}`}
          >
            <div className="space-y-4">
              <FormField>
                <FormLabel htmlFor="resolution" required>
                  Resolution Details
                </FormLabel>
                <FormTextarea
                  id="resolution"
                  rows={5}
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Describe how this escalation was resolved..."
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmResolve}
                className="px-4 py-2 text-sm text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Resolved
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Add Comment Modal */}
        {selectedEscalation && (
          <FormModal
            isOpen={showCommentModal}
            onClose={() => setShowCommentModal(false)}
            title="Add Comment"
            description={`${selectedEscalation.escalationNumber} - ${selectedEscalation.title}`}
          >
            <div className="space-y-4">
              <FormField>
                <FormLabel htmlFor="comment" required>
                  Comment
                </FormLabel>
                <FormTextarea
                  id="comment"
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment or update..."
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowCommentModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddComment}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Add Comment
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    </div>
  );
}
