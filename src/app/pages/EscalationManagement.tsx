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

interface EscalationManagementProps {
  userRole?: string;
}

export default function EscalationManagement({ userRole = "admin" }: EscalationManagementProps) {
  const isCustomer = userRole === "customer";
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [assignedUser, setAssignedUser] = useState("");
  const [resolution, setResolution] = useState("");
  const [newComment, setNewComment] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Create Escalation Form State
  const [newEscalation, setNewEscalation] = useState({
    title: "",
    description: "",
    category: "Customer Complaint" as Escalation["category"],
    severity: "Medium" as Escalation["severity"],
    relatedInquiry: "",
  });

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

  // Filter options for Advanced Search
  const filterOptionsMap: Record<string, string[]> = {
    "Status": ["Open", "In Progress", "Resolved", "Closed"],
    "Severity": ["Critical", "High", "Medium", "Low"],
    "Category": [
      "Pricing Issue",
      "SLA Breach",
      "Customer Complaint",
      "Operational Delay",
      "Quality Issue",
      "Driver Issue",
    ],
  };

  // Filtered escalations
  const filteredEscalations = escalations.filter((escalation) => {
    // Role based filtering: Customers only see their own escalations
    if (isCustomer && escalation.customerName !== "John Smith") { // Assuming John Smith is the mock customer
      return false;
    }

    // Search query filtering
    if (
      searchQuery &&
      !escalation.escalationNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !escalation.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !escalation.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Advanced filters
    if (filters.length > 0) {
      for (const filter of filters) {
        if (filter.values.length === 0) continue;

        if (filter.field === "Status") {
          if (!filter.values.includes(escalation.status)) return false;
        } else if (filter.field === "Severity") {
          if (!filter.values.includes(escalation.severity)) return false;
        } else if (filter.field === "Category") {
          if (!filter.values.includes(escalation.category)) return false;
        }
      }
    }

    return true;
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
          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status) === "success"
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

  const handleCreateEscalation = () => {
    setNewEscalation({
      title: "",
      description: "",
      category: "Customer Complaint",
      severity: "Medium",
      relatedInquiry: "",
    });
    setShowCreateModal(true);
  };

  const confirmCreateEscalation = () => {
    if (!newEscalation.title.trim() || !newEscalation.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const escalation: Escalation = {
      id: (escalations.length + 1).toString(),
      escalationNumber: `ESC-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newEscalation.title,
      description: newEscalation.description,
      category: newEscalation.category,
      severity: newEscalation.severity,
      status: "Open",
      customerName: "John Smith", // Mock customer
      reportedBy: "John Smith",
      reportedDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      relatedInquiry: newEscalation.relatedInquiry,
      comments: [
        {
          id: "1",
          author: "John Smith",
          timestamp: new Date().toISOString(),
          message: "Escalation created.",
        },
      ],
    };

    setEscalations([escalation, ...escalations]);
    toast.success("Escalation created successfully");
    setShowCreateModal(false);
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
              filterOptions={filterOptionsMap}
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

          {isCustomer && (
            <button
              onClick={handleCreateEscalation}
              className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Escalation
            </button>
          )}

          <ViewModeSwitcher currentMode={viewMode} onChange={setViewMode} />
        </PageHeader>

        {/* ========== FILTER CHIPS ========== */}
        {filters.some((f) => f.values.length > 0) && (
          <FilterChips
            filters={filters}
            onRemove={(filterId) => {
              setFilters(
                filters.map((f: any) =>
                  f.id === filterId ? { ...f, values: [] } : f
                ).filter((f: any) => f.values.length > 0)
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

          {/* Create Escalation Modal */}
          <FormModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New Escalation"
            description="Report a new critical issue or complaint"
          >
            <div className="space-y-4">
              <FormField>
                <FormLabel htmlFor="title" required>
                  Title
                </FormLabel>
                <FormInput
                  id="title"
                  type="text"
                  value={newEscalation.title}
                  onChange={(e) =>
                    setNewEscalation({ ...newEscalation, title: e.target.value })
                  }
                  placeholder="Brief summary of the issue"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="category" required>
                    Category
                  </FormLabel>
                  <FormSelect
                    id="category"
                    value={newEscalation.category}
                    onChange={(e) =>
                      setNewEscalation({
                        ...newEscalation,
                        category: e.target.value as Escalation["category"],
                      })
                    }
                  >
                    {filterOptionsMap.Category.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </FormSelect>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="severity" required>
                    Severity
                  </FormLabel>
                  <FormSelect
                    id="severity"
                    value={newEscalation.severity}
                    onChange={(e) =>
                      setNewEscalation({
                        ...newEscalation,
                        severity: e.target.value as Escalation["severity"],
                      })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </FormSelect>
                </FormField>
              </div>

              <FormField>
                <FormLabel htmlFor="relatedInquiry">Related Inquiry (Optional)</FormLabel>
                <FormInput
                  id="relatedInquiry"
                  type="text"
                  value={newEscalation.relatedInquiry}
                  onChange={(e) =>
                    setNewEscalation({
                      ...newEscalation,
                      relatedInquiry: e.target.value,
                    })
                  }
                  placeholder="e.g., INQ-2024-1234"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="description" required>
                  Description
                </FormLabel>
                <FormTextarea
                  id="description"
                  rows={4}
                  value={newEscalation.description}
                  onChange={(e) =>
                    setNewEscalation({
                      ...newEscalation,
                      description: e.target.value,
                    })
                  }
                  placeholder="Provide full details of the issue..."
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCreateEscalation}
                className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Escalation
              </button>
            </FormFooter>
          </FormModal>
        </div>
      </div>
    </div>
  );
}
