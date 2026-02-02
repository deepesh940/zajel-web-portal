import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  AlertTriangle,
  Eye,
  FileText,
  DollarSign,
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Copy,
  Download,
  BarChart3,
  RefreshCw,
  Plus,
  Building2,
  Mail,
  Phone,
  Hash,
  AlertCircle,
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
  FormSection,
} from "../components/hb/common/Form";
import { toast } from "sonner";

// ===================
// TYPES & INTERFACES
// ===================

interface OperationalApproval {
  id: string;
  inquiryNumber: string;
  customerName: string;
  approvalType: "Quote" | "Delivery Proof" | "Payment" | "Route Change";
  pickupLocation: string;
  deliveryLocation: string;
  serviceType: string;
  amount?: number;
  status: "Pending" | "Approved" | "Rejected" | "Expired";
  submittedDate: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  documents?: string[];
}

interface DocumentFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  url: string;
}

interface CustomerRegistration {
  id: string;
  registrationNumber: string;
  fullName: string;
  companyName: string;
  mobileNumber: string;
  email: string;
  companyAddress: string;
  tradeLicenseNumber: string;
  taxRegistrationNumber: string;
  documents: DocumentFile[];
  status: "Pending" | "Verified" | "Rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

type ViewMode = "grid" | "list" | "table";
type TabType = "operational" | "registration";

// ===================
// MAIN COMPONENT
// ===================

export default function CustomerApprovals() {
  const [activeTab, setActiveTab] = useState<TabType>("operational");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("submittedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Operational Approvals State
  const [selectedOperational, setSelectedOperational] = useState<OperationalApproval | null>(null);
  const [showOperationalDetailsModal, setShowOperationalDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAddOperationalModal, setShowAddOperationalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Add Operational Approval Form State
  const [newApprovalForm, setNewApprovalForm] = useState({
    inquiryNumber: "",
    customerName: "",
    approvalType: "Quote" as OperationalApproval["approvalType"],
    pickupLocation: "",
    deliveryLocation: "",
    serviceType: "",
    amount: "",
    priority: "Medium" as OperationalApproval["priority"],
    description: "",
    dueDate: "",
  });

  // Registration Approvals State
  const [selectedRegistration, setSelectedRegistration] = useState<CustomerRegistration | null>(null);
  const [showRegistrationDetailsModal, setShowRegistrationDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [registrationRejectionReason, setRegistrationRejectionReason] = useState("");

  // Operational Approvals Data
  const [operationalApprovals, setOperationalApprovals] = useState<OperationalApproval[]>([
    {
      id: "1",
      inquiryNumber: "INQ-2024-5678",
      customerName: "John Smith",
      approvalType: "Quote",
      pickupLocation: "Business Bay, Dubai",
      deliveryLocation: "Musaffah, Abu Dhabi",
      serviceType: "Express Delivery",
      amount: 1250.0,
      status: "Pending",
      submittedDate: "2024-01-27T14:30:00",
      dueDate: "2024-01-29",
      priority: "High",
      description: "Customer review and approval required for express delivery quote.",
      documents: ["Quote-INQ-2024-5678.pdf"],
    },
    {
      id: "2",
      inquiryNumber: "INQ-2024-5677",
      customerName: "Sarah Ahmed",
      approvalType: "Route Change",
      pickupLocation: "Jebel Ali, Dubai",
      deliveryLocation: "Al Ain Industrial Area",
      serviceType: "Standard Delivery",
      status: "Pending",
      submittedDate: "2024-01-27T10:00:00",
      dueDate: "2024-01-28",
      priority: "Medium",
      description: "Customer requested alternative delivery route due to road construction.",
      documents: ["Route-Change-Request.pdf"],
    },
    {
      id: "3",
      inquiryNumber: "INQ-2024-5676",
      customerName: "Mohammed Ali",
      approvalType: "Delivery Proof",
      pickupLocation: "Deira, Dubai",
      deliveryLocation: "Sharjah Industrial Area",
      serviceType: "Express Delivery",
      status: "Approved",
      submittedDate: "2024-01-26T15:00:00",
      dueDate: "2024-01-27",
      priority: "High",
      description: "Delivery completed. Customer signature and photos uploaded.",
      documents: ["Delivery-Receipt.pdf", "Photo-1.jpg"],
    },
  ]);

  // Customer Registration Data
  const [registrations, setRegistrations] = useState<CustomerRegistration[]>([
    {
      id: "1",
      registrationNumber: "REG-2024-001",
      fullName: "Ahmed Al Mansoori",
      companyName: "Al Mansoori Trading LLC",
      mobileNumber: "+971 50 123 4567",
      email: "ahmed@almansoori.ae",
      companyAddress: "Dubai Industrial Park, Street 12, Dubai, UAE",
      tradeLicenseNumber: "TL-123456-DXB",
      taxRegistrationNumber: "TAX-654321-UAE",
      documents: [
        {
          id: "doc1",
          name: "Trade License.pdf",
          size: "2.3 MB",
          type: "Trade License",
          uploadedAt: "2024-01-28T10:30:00",
          url: "#",
        },
        {
          id: "doc2",
          name: "Tax Registration Certificate.pdf",
          size: "1.8 MB",
          type: "Tax Certificate",
          uploadedAt: "2024-01-28T10:30:00",
          url: "#",
        },
      ],
      status: "Pending",
      submittedAt: "2024-01-28T10:30:00",
    },
    {
      id: "2",
      registrationNumber: "REG-2024-002",
      fullName: "Fatima Hassan",
      companyName: "Emirates Logistics Solutions",
      mobileNumber: "+971 55 987 6543",
      email: "fatima@emirateslogistics.ae",
      companyAddress: "Jebel Ali Free Zone, Building A3, Dubai, UAE",
      tradeLicenseNumber: "TL-789012-DXB",
      taxRegistrationNumber: "TAX-210987-UAE",
      documents: [
        {
          id: "doc4",
          name: "Trade License.pdf",
          size: "2.1 MB",
          type: "Trade License",
          uploadedAt: "2024-01-29T14:15:00",
          url: "#",
        },
      ],
      status: "Pending",
      submittedAt: "2024-01-29T14:15:00",
    },
  ]);

  // ===================
  // HELPER FUNCTIONS
  // ===================

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Approved":
      case "Verified":
        return "success";
      case "Rejected":
        return "error";
      case "Expired":
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
            : getStatusColor(status) === "warning"
              ? "bg-warning-500"
              : getStatusColor(status) === "error"
                ? "bg-error-500"
                : "bg-neutral-400"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colorClass =
      priority === "High"
        ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400"
        : priority === "Medium"
          ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400"
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400";

    return <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${colorClass}`}>{priority}</span>;
  };

  // ===================
  // FILTER & PAGINATION LOGIC
  // Filter options for advanced search
  const filterOptions: Record<string, string[]> =
    activeTab === "operational"
      ? {
        "Status": ["Pending", "Approved", "Rejected", "Expired"],
        "Approval Type": ["Quote", "Delivery Proof", "Payment", "Route Change"],
        "Priority": ["High", "Medium", "Low"],
      }
      : {
        "Status": ["Pending", "Verified", "Rejected"],
      };

  // Operational Approvals Filtering
  const filteredOperationalApprovals = operationalApprovals.filter((approval) => {
    const matchesSearch =
      approval.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.approvalType.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.field === "Status");
    const matchesStatus = !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(approval.status);

    const typeFilter = filters.find((f) => f.field === "Approval Type");
    const matchesType = !typeFilter || typeFilter.values.length === 0 || typeFilter.values.includes(approval.approvalType);

    const priorityFilter = filters.find((f) => f.field === "Priority");
    const matchesPriority = !priorityFilter || priorityFilter.values.length === 0 || priorityFilter.values.includes(approval.priority);

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // Registration Approvals Filtering
  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      searchQuery === "" ||
      registration.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.field === "Status");
    const matchesStatus = !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(registration.status);

    return matchesSearch && matchesStatus;
  });

  // Get current items based on active tab
  const currentItems = activeTab === "operational" ? filteredOperationalApprovals : filteredRegistrations;

  // Pagination
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const paginatedItems = currentItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ===================
  // STATS
  // ===================

  const operationalStats = [
    {
      label: "Pending",
      value: operationalApprovals.filter((a) => a.status === "Pending").length,
      icon: "Clock",
      subtitle: "Awaiting action",
    },
    {
      label: "Approved",
      value: operationalApprovals.filter((a) => a.status === "Approved").length,
      icon: "CheckCircle",
      subtitle: "Approved",
    },
    {
      label: "Rejected",
      value: operationalApprovals.filter((a) => a.status === "Rejected").length,
      icon: "XCircle",
      subtitle: "Declined",
    },
    {
      label: "Expired",
      value: operationalApprovals.filter((a) => a.status === "Expired").length,
      icon: "AlertCircle",
      subtitle: "Past deadline",
    },
  ];

  const registrationStats = [
    {
      label: "Pending Review",
      value: registrations.filter((r) => r.status === "Pending").length,
      icon: "Clock",
      subtitle: "Awaiting review",
    },
    {
      label: "Verified",
      value: registrations.filter((r) => r.status === "Verified").length,
      icon: "CheckCircle",
      subtitle: "Approved registrations",
    },
    {
      label: "Rejected",
      value: registrations.filter((r) => r.status === "Rejected").length,
      icon: "XCircle",
      subtitle: "Declined applications",
    },
    {
      label: "Total Registrations",
      value: registrations.length,
      icon: "Building2",
      subtitle: "All time",
    },
  ];

  const stats = activeTab === "operational" ? operationalStats : registrationStats;

  // ===================
  // EVENT HANDLERS - OPERATIONAL
  // ===================

  const handleViewOperationalDetails = (approval: OperationalApproval) => {
    setSelectedOperational(approval);
    setShowOperationalDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleApproveOperational = (approval: OperationalApproval) => {
    setSelectedOperational(approval);
    setApprovalNotes("");
    setShowApproveModal(true);
    setOpenActionMenuId(null);
  };

  const confirmApproveOperational = () => {
    if (selectedOperational) {
      setOperationalApprovals(
        operationalApprovals.map((a) => (a.id === selectedOperational.id ? { ...a, status: "Approved" } : a))
      );
      toast.success(`${selectedOperational.approvalType} approved for ${selectedOperational.inquiryNumber}`);
    }
    setShowApproveModal(false);
  };

  const handleRejectOperational = (approval: OperationalApproval) => {
    setSelectedOperational(approval);
    setRejectionReason("");
    setShowRejectModal(true);
    setOpenActionMenuId(null);
  };

  const confirmRejectOperational = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    if (selectedOperational) {
      setOperationalApprovals(
        operationalApprovals.map((a) => (a.id === selectedOperational.id ? { ...a, status: "Rejected" } : a))
      );
      toast.success(`${selectedOperational.approvalType} rejected for ${selectedOperational.inquiryNumber}`);
    }
    setShowRejectModal(false);
  };

  const handleAddOperationalApproval = () => {
    // Validate form
    if (!newApprovalForm.inquiryNumber || !newApprovalForm.customerName || !newApprovalForm.pickupLocation || !newApprovalForm.deliveryLocation || !newApprovalForm.serviceType || !newApprovalForm.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newApproval: OperationalApproval = {
      id: (operationalApprovals.length + 1).toString(),
      inquiryNumber: newApprovalForm.inquiryNumber,
      customerName: newApprovalForm.customerName,
      approvalType: newApprovalForm.approvalType,
      pickupLocation: newApprovalForm.pickupLocation,
      deliveryLocation: newApprovalForm.deliveryLocation,
      serviceType: newApprovalForm.serviceType,
      amount: newApprovalForm.amount ? parseFloat(newApprovalForm.amount) : undefined,
      status: "Pending",
      submittedDate: new Date().toISOString(),
      dueDate: newApprovalForm.dueDate,
      priority: newApprovalForm.priority,
      description: newApprovalForm.description,
    };

    setOperationalApprovals([newApproval, ...operationalApprovals]);
    toast.success(`Approval request ${newApproval.inquiryNumber} has been created`);

    // Reset form
    setNewApprovalForm({
      inquiryNumber: "",
      customerName: "",
      approvalType: "Quote",
      pickupLocation: "",
      deliveryLocation: "",
      serviceType: "",
      amount: "",
      priority: "Medium",
      description: "",
      dueDate: "",
    });
    setShowAddOperationalModal(false);
  };

  // ===================
  // EVENT HANDLERS - REGISTRATION
  // ===================

  const handleViewRegistrationDetails = (registration: CustomerRegistration) => {
    setSelectedRegistration(registration);
    setShowRegistrationDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleApproveRegistration = (registration: CustomerRegistration) => {
    setSelectedRegistration(registration);
    setShowApprovalModal(true);
    setOpenActionMenuId(null);
  };

  const confirmApprovalRegistration = () => {
    if (selectedRegistration) {
      setRegistrations(
        registrations.map((r) =>
          r.id === selectedRegistration.id
            ? {
              ...r,
              status: "Verified",
              reviewedAt: new Date().toISOString(),
              reviewedBy: "Admin User",
            }
            : r
        )
      );
      toast.success(`${selectedRegistration.companyName} has been approved`);
    }
    setShowApprovalModal(false);
    setSelectedRegistration(null);
  };

  const handleRejectRegistration = (registration: CustomerRegistration) => {
    setSelectedRegistration(registration);
    setRegistrationRejectionReason("");
    setShowRejectionModal(true);
    setOpenActionMenuId(null);
  };

  const confirmRejectionRegistration = () => {
    if (selectedRegistration && registrationRejectionReason.trim()) {
      setRegistrations(
        registrations.map((r) =>
          r.id === selectedRegistration.id
            ? {
              ...r,
              status: "Rejected",
              reviewedAt: new Date().toISOString(),
              reviewedBy: "Admin User",
              rejectionReason: registrationRejectionReason,
            }
            : r
        )
      );
      toast.success(`${selectedRegistration.companyName} has been rejected`);
    }
    setShowRejectionModal(false);
    setSelectedRegistration(null);
    setRegistrationRejectionReason("");
  };

  const handleCopyInquiryNumber = (inquiryNumber: string) => {
    navigator.clipboard.writeText(inquiryNumber);
    toast.success("Inquiry number copied to clipboard");
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard");
  };

  // ===================
  // RENDER
  // ===================

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Customer Management"
          subtitle="Manage operational approvals and customer registration requests"
          breadcrumbs={[
            { label: activeTab === "operational" ? "Operations" : "Admin", href: "#" },
            { label: "Customer Management", current: true },
          ]}
          primaryAction={{
            label: activeTab === "operational" ? "Add Approval" : "Add Registration",
            onClick: () => {
              if (activeTab === "operational") {
                setShowAddOperationalModal(true);
              } else {
                toast.info("Customer registration is typically done via public form");
              }
            },
            icon: Plus,
          }}
          moreMenu={{

            onPrint: () => window.print(),
            sortOptions:
              activeTab === "operational"
                ? [
                  { value: "inquiryNumber", label: "Inquiry Number (A-Z)", direction: "asc" },
                  { value: "submittedDate", label: "Date (Newest)", direction: "desc" },
                  { value: "priority", label: "Priority (High to Low)", direction: "desc" },
                ]
                : [
                  { value: "submittedAt", label: "Submitted Date (Recent)", direction: "desc" },
                  { value: "companyName", label: "Company Name (A-Z)", direction: "asc" },
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
              placeholder={activeTab === "operational" ? "Search approvals..." : "Search registrations..."}
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
            />
          </div>

          <IconButton icon={BarChart3} onClick={() => setShowSummary(!showSummary)} title="Toggle summary" active={showSummary} />

          <IconButton icon={RefreshCw} onClick={() => toast.success("Refreshed")} title="Refresh" />

          <ViewModeSwitcher currentMode={viewMode} onChange={setViewMode} />
        </PageHeader>

        {/* ========== TABS ========== */}
        <div className="mb-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab("operational");
                  setCurrentPage(1);
                  setFilters([]);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "operational"
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300 hover:border-neutral-300"
                  }`}
              >
                Operational Approvals
              </button>
              <button
                onClick={() => {
                  setActiveTab("registration");
                  setCurrentPage(1);
                  setFilters([]);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "registration"
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300 hover:border-neutral-300"
                  }`}
              >
                Registration Approvals
              </button>
            </nav>
          </div>
        </div>

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
          {/* OPERATIONAL APPROVALS - GRID VIEW */}
          {activeTab === "operational" && viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(paginatedItems as OperationalApproval[]).map((approval) => (
                <div
                  key={approval.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewOperationalDetails(approval)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{approval.inquiryNumber}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(approval.status)}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === approval.id ? null : approval.id);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === approval.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewOperationalDetails(approval);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            {approval.status === "Pending" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveOperational(approval);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  Approve
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRejectOperational(approval);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInquiryNumber(approval.inquiryNumber);
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

                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400">
                      {approval.approvalType}
                    </span>
                    {getPriorityBadge(approval.priority)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{approval.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {approval.pickupLocation} → {approval.deliveryLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Due: {approval.dueDate}</span>
                    </div>
                  </div>

                  {approval.amount && (
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                      <div className="text-xs text-primary-700 dark:text-primary-400 mb-1">Amount</div>
                      <div className="text-lg font-bold text-primary-600 dark:text-primary-400">AED {approval.amount.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* OPERATIONAL APPROVALS - LIST VIEW */}
          {activeTab === "operational" && viewMode === "list" && (
            <div className="space-y-3">
              {(paginatedItems as OperationalApproval[]).map((approval) => (
                <div key={approval.id} className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">{approval.inquiryNumber}</h3>
                        {getStatusBadge(approval.status)}
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400">{approval.approvalType}</span>
                        {getPriorityBadge(approval.priority)}
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{approval.customerName}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span className="truncate">{approval.pickupLocation} → {approval.deliveryLocation}</span></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>Due: {approval.dueDate}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {approval.amount && <div className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded text-sm font-semibold text-primary-600 dark:text-primary-400">AED {approval.amount.toLocaleString()}</div>}
                      <button onClick={() => handleViewOperationalDetails(approval)} className="p-2 text-primary-600 hover:bg-primary-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
                      {approval.status === "Pending" && (<><button onClick={() => handleApproveOperational(approval)} className="p-2 text-success-600 hover:bg-success-50 rounded" title="Approve"><ThumbsUp className="w-4 h-4" /></button><button onClick={() => handleRejectOperational(approval)} className="p-2 text-error-600 hover:bg-error-50 rounded" title="Reject"><ThumbsDown className="w-4 h-4" /></button></>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* OPERATIONAL APPROVALS - TABLE VIEW */}
          {activeTab === "operational" && viewMode === "table" && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Inquiry No.</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Customer</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Type</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Route</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Amount</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Due Date</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Priority</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Status</th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {(paginatedItems as OperationalApproval[]).map((approval) => (
                      <tr key={approval.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950">
                        <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">{approval.inquiryNumber}</td>
                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">{approval.customerName}</td>
                        <td className="px-6 py-4 text-sm"><span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400">{approval.approvalType}</span></td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400"><div className="max-w-xs truncate">{approval.pickupLocation} → {approval.deliveryLocation}</div></td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{approval.amount ? `AED ${approval.amount.toLocaleString()}` : "-"}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{approval.dueDate}</td>
                        <td className="px-6 py-4 text-sm">{getPriorityBadge(approval.priority)}</td>
                        <td className="px-6 py-4 text-sm">{getStatusBadge(approval.status)}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleViewOperationalDetails(approval)} className="p-2 text-primary-600 hover:bg-primary-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
                            {approval.status === "Pending" && (<><button onClick={() => handleApproveOperational(approval)} className="p-2 text-success-600 hover:bg-success-50 rounded" title="Approve"><ThumbsUp className="w-4 h-4" /></button><button onClick={() => handleRejectOperational(approval)} className="p-2 text-error-600 hover:bg-error-50 rounded" title="Reject"><ThumbsDown className="w-4 h-4" /></button></>)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REGISTRATION APPROVALS - GRID VIEW */}
          {activeTab === "registration" && viewMode === "grid" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {(paginatedItems as CustomerRegistration[]).map((registration) => (
                <div
                  key={registration.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-md transition-shadow relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1 truncate">{registration.companyName}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{registration.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {getStatusBadge(registration.status)}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === registration.id ? null : registration.id);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === registration.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewRegistrationDetails(registration);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            {registration.status === "Pending" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveRegistration(registration);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  Approve
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRejectRegistration(registration);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Hash className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{registration.registrationNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{registration.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{formatTimestamp(registration.submittedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REGISTRATION APPROVALS - LIST VIEW */}
          {activeTab === "registration" && viewMode === "list" && (
            <div className="space-y-4">
              {(paginatedItems as CustomerRegistration[]).map((registration) => (
                <div
                  key={registration.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-md transition-shadow relative"
                >
                  <div className="absolute top-4 right-4">{getStatusBadge(registration.status)}</div>

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">{registration.companyName}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{registration.fullName}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{registration.email}</span>
                              <button onClick={() => handleCopyEmail(registration.email)} className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span>{registration.mobileNumber}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Hash className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-600 dark:text-neutral-400">Reg No:</span>
                          <span className="font-medium text-neutral-900 dark:text-white">{registration.registrationNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-600 dark:text-neutral-400">Submitted:</span>
                          <span className="font-medium text-neutral-900 dark:text-white">{formatTimestamp(registration.submittedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-600 dark:text-neutral-400">Documents:</span>
                          <span className="font-medium text-neutral-900 dark:text-white">{registration.documents.length} file(s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewRegistrationDetails(registration)}
                        className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      {registration.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApproveRegistration(registration)}
                            className="px-4 py-2 text-sm font-medium text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRegistration(registration)}
                            className="px-4 py-2 text-sm font-medium text-white bg-error-600 hover:bg-error-700 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REGISTRATION APPROVALS - TABLE VIEW */}
          {activeTab === "registration" && viewMode === "table" && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Reg. No.</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Company</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Contact Person</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Submitted</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {(paginatedItems as CustomerRegistration[]).map((registration) => (
                      <tr key={registration.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">{registration.registrationNumber}</td>
                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">{registration.companyName}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{registration.fullName}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{registration.email}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{formatTimestamp(registration.submittedAt)}</td>
                        <td className="px-6 py-4 text-sm">{getStatusBadge(registration.status)}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewRegistrationDetails(registration)}
                              className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {registration.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleApproveRegistration(registration)}
                                  className="p-2 text-success-600 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/20 rounded transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectRegistration(registration)}
                                  className="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
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
          {currentItems.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                {activeTab === "operational" ? (
                  <CheckCircle className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                ) : (
                  <Building2 className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                )}
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No {activeTab === "operational" ? "approvals" : "registrations"} found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0) ? "Try adjusting your search or filters" : "No items available"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {currentItems.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={currentItems.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* ========== MODALS ========== */}

        {/* Add Operational Approval Modal */}
        <FormModal
          isOpen={showAddOperationalModal}
          onClose={() => setShowAddOperationalModal(false)}
          title="Add Operational Approval"
          description="Create a new approval request"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="inquiryNumber" required>
                  Inquiry Number
                </FormLabel>
                <FormInput
                  id="inquiryNumber"
                  value={newApprovalForm.inquiryNumber}
                  onChange={(e) => setNewApprovalForm({ ...newApprovalForm, inquiryNumber: e.target.value })}
                  placeholder="INQ-2024-XXXX"
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="customerName" required>
                  Customer Name
                </FormLabel>
                <FormInput
                  id="customerName"
                  value={newApprovalForm.customerName}
                  onChange={(e) => setNewApprovalForm({ ...newApprovalForm, customerName: e.target.value })}
                  placeholder="Enter customer name"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="approvalType" required>
                  Approval Type
                </FormLabel>
                <FormSelect
                  id="approvalType"
                  value={newApprovalForm.approvalType}
                  onChange={(e) => setNewApprovalForm({ ...newApprovalForm, approvalType: e.target.value as OperationalApproval["approvalType"] })}
                >
                  <option value="Quote">Quote</option>
                  <option value="Delivery Proof">Delivery Proof</option>
                  <option value="Payment">Payment</option>
                  <option value="Route Change">Route Change</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="serviceType" required>
                  Service Type
                </FormLabel>
                <FormInput
                  id="serviceType"
                  value={newApprovalForm.serviceType}
                  onChange={(e) => setNewApprovalForm({ ...newApprovalForm, serviceType: e.target.value })}
                  placeholder="Express Delivery, Standard, etc."
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="pickupLocation" required>
                  Pickup Location
                </FormLabel>
                <FormInput
                  id="pickupLocation"
                  value={newApprovalForm.pickupLocation}
                  onChange={(e) => setNewApprovalForm({ ...newApprovalForm, pickupLocation: e.target.value })}
                  placeholder="Enter pickup location"
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="deliveryLocation" required>
                  Delivery Location
                </FormLabel>
                <FormInput
                  id="deliveryLocation"
                  value={newApprovalForm.deliveryLocation}
                  onChange={(e) => setNewApprovalForm({ ...newApprovalForm, deliveryLocation: e.target.value })}
                  placeholder="Enter delivery location"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField>
                <FormLabel htmlFor="amount">
                  Amount (AED)
                </FormLabel>
                <FormInput
                  id="amount"
                  type="number"
                  value={newApprovalForm.amount}
                  onChange={(e) => setNewApprovalForm({ ...newApprovalForm, amount: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="priority" required>
                  Priority
                </FormLabel>
                <FormSelect
                  id="priority"
                  value={newApprovalForm.priority}
                  onChange={(e) => setNewApprovalForm({ ...newApprovalForm, priority: e.target.value as OperationalApproval["priority"] })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="dueDate" required>
                  Due Date
                </FormLabel>
                <FormInput
                  id="dueDate"
                  type="date"
                  value={newApprovalForm.dueDate}
                  onChange={(e) => setNewApprovalForm({ ...newApprovalForm, dueDate: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField>
              <FormLabel htmlFor="description">
                Description
              </FormLabel>
              <FormTextarea
                id="description"
                value={newApprovalForm.description}
                onChange={(e) => setNewApprovalForm({ ...newApprovalForm, description: e.target.value })}
                rows={3}
                placeholder="Enter approval description or notes..."
              />
            </FormField>
          </div>

          <FormFooter>
            <button
              onClick={() => setShowAddOperationalModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddOperationalApproval}
              className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Approval
            </button>
          </FormFooter>
        </FormModal>

        {/* Operational Details Modal */}
        <FormModal
          isOpen={showOperationalDetailsModal}
          onClose={() => setShowOperationalDetailsModal(false)}
          title="Approval Request Details"
          description={selectedOperational?.inquiryNumber || ""}
          maxWidth="max-w-3xl"
        >
          {selectedOperational && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <FormLabel>Inquiry Number</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">{selectedOperational.inquiryNumber}</p>
                </div>
                <div>
                  <FormLabel>Customer Name</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedOperational.customerName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <FormLabel>Approval Type</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedOperational.approvalType}</p>
                </div>
                <div>
                  <FormLabel>Service Type</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedOperational.serviceType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <FormLabel>Pickup Location</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedOperational.pickupLocation}</p>
                </div>
                <div>
                  <FormLabel>Delivery Location</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedOperational.deliveryLocation}</p>
                </div>
              </div>

              {selectedOperational.amount && (
                <div>
                  <FormLabel>Amount</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100 font-semibold">AED {selectedOperational.amount.toLocaleString()}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <FormLabel>Priority</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedOperational.priority}</p>
                </div>
                <div>
                  <FormLabel>Status</FormLabel>
                  <div className="mt-1">{getStatusBadge(selectedOperational.status)}</div>
                </div>
                <div>
                  <FormLabel>Due Date</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedOperational.dueDate}</p>
                </div>
              </div>

              <div>
                <FormLabel>Description</FormLabel>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{selectedOperational.description}</p>
              </div>

              <div>
                <FormLabel>Submitted Date</FormLabel>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{formatTimestamp(selectedOperational.submittedDate)}</p>
              </div>
            </div>
          )}

          <FormFooter>
            <button
              onClick={() => setShowOperationalDetailsModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
            {selectedOperational?.status === "Pending" && (
              <>
                <button
                  onClick={() => {
                    setShowOperationalDetailsModal(false);
                    handleApproveOperational(selectedOperational);
                  }}
                  className="px-4 py-2 text-sm text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    setShowOperationalDetailsModal(false);
                    handleRejectOperational(selectedOperational);
                  }}
                  className="px-4 py-2 text-sm text-white bg-error-600 hover:bg-error-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </>
            )}
          </FormFooter>
        </FormModal>

        {/* Registration Details Modal */}
        <FormModal
          isOpen={showRegistrationDetailsModal}
          onClose={() => setShowRegistrationDetailsModal(false)}
          title="Customer Registration Details"
          description={selectedRegistration?.registrationNumber || ""}
          maxWidth="max-w-3xl"
        >
          {selectedRegistration && (
            <div className="space-y-6">
              <FormSection title="Company Information">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <FormLabel>Registration Number</FormLabel>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">{selectedRegistration.registrationNumber}</p>
                  </div>
                  <div>
                    <FormLabel>Company Name</FormLabel>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedRegistration.companyName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <FormLabel>Trade License Number</FormLabel>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedRegistration.tradeLicenseNumber}</p>
                  </div>
                  <div>
                    <FormLabel>Tax Registration Number</FormLabel>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedRegistration.taxRegistrationNumber}</p>
                  </div>
                </div>

                <div>
                  <FormLabel>Company Address</FormLabel>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedRegistration.companyAddress}</p>
                </div>
              </FormSection>

              <FormSection title="Contact Information">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <FormLabel>Full Name</FormLabel>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedRegistration.fullName}</p>
                  </div>
                  <div>
                    <FormLabel>Email</FormLabel>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <FormLabel>Mobile Number</FormLabel>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedRegistration.mobileNumber}</p>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Documents">
                <div className="space-y-2">
                  {selectedRegistration.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{doc.name}</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">{doc.size} • Uploaded {doc.uploadedAt}</p>
                        </div>
                      </div>
                      <button className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </FormSection>

              <FormSection title="Review Information">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <FormLabel>Status</FormLabel>
                    <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                  </div>
                  <div>
                    <FormLabel>Submitted At</FormLabel>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{formatTimestamp(selectedRegistration.submittedAt)}</p>
                  </div>
                </div>

                {selectedRegistration.reviewedAt && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <FormLabel>Reviewed By</FormLabel>
                      <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedRegistration.reviewedBy}</p>
                    </div>
                    <div>
                      <FormLabel>Reviewed At</FormLabel>
                      <p className="text-sm text-neutral-900 dark:text-neutral-100">{formatTimestamp(selectedRegistration.reviewedAt)}</p>
                    </div>
                  </div>
                )}

                {selectedRegistration.rejectionReason && (
                  <div>
                    <FormLabel>Rejection Reason</FormLabel>
                    <p className="text-sm text-error-600 dark:text-error-400">{selectedRegistration.rejectionReason}</p>
                  </div>
                )}
              </FormSection>
            </div>
          )}

          <FormFooter>
            <button
              onClick={() => setShowRegistrationDetailsModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
            {selectedRegistration?.status === "Pending" && (
              <>
                <button
                  onClick={() => {
                    setShowRegistrationDetailsModal(false);
                    handleApproveRegistration(selectedRegistration);
                  }}
                  className="px-4 py-2 text-sm text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    setShowRegistrationDetailsModal(false);
                    handleRejectRegistration(selectedRegistration);
                  }}
                  className="px-4 py-2 text-sm text-white bg-error-600 hover:bg-error-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </>
            )}
          </FormFooter>
        </FormModal>

        {/* Operational Approve Modal */}
        <FormModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          title="Approve Request"
          description="Confirm approval of this request"
          maxWidth="max-w-md"
        >
          <FormField>
            <FormLabel htmlFor="approvalNotes">Notes (Optional)</FormLabel>
            <FormTextarea id="approvalNotes" value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} rows={3} />
          </FormField>

          <FormFooter>
            <button
              onClick={() => setShowApproveModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmApproveOperational}
              className="px-4 py-2 text-sm text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
          </FormFooter>
        </FormModal>

        {/* Operational Reject Modal */}
        <FormModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Request"
          description="Provide a reason for rejection"
          maxWidth="max-w-md"
        >
          <FormField>
            <FormLabel htmlFor="rejectionReason" required>
              Reason for Rejection
            </FormLabel>
            <FormTextarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              required
            />
          </FormField>

          <FormFooter>
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmRejectOperational}
              className="px-4 py-2 text-sm text-white bg-error-600 hover:bg-error-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </FormFooter>
        </FormModal>

        {/* Registration Approve Modal */}
        <FormModal
          isOpen={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          title="Approve Customer Registration"
          description="Confirm approval of this customer registration"
          maxWidth="max-w-md"
        >
          <div className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg">
            <p className="text-sm text-success-700 dark:text-success-400">
              This will grant the customer access to the platform and allow them to start placing orders.
            </p>
          </div>

          <FormFooter>
            <button
              onClick={() => setShowApprovalModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmApprovalRegistration}
              className="px-4 py-2 text-sm text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve Registration
            </button>
          </FormFooter>
        </FormModal>

        {/* Registration Reject Modal */}
        <FormModal
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          title="Reject Customer Registration"
          description="Provide a reason for rejecting this registration"
          maxWidth="max-w-md"
        >
          <FormField>
            <FormLabel htmlFor="registrationRejectionReason" required>
              Reason for Rejection
            </FormLabel>
            <FormTextarea
              id="registrationRejectionReason"
              value={registrationRejectionReason}
              onChange={(e) => setRegistrationRejectionReason(e.target.value)}
              rows={4}
              required
              placeholder="E.g., Trade license has expired, missing required documents..."
            />
          </FormField>

          <FormFooter>
            <button
              onClick={() => setShowRejectionModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmRejectionRegistration}
              className="px-4 py-2 text-sm text-white bg-error-600 hover:bg-error-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject Registration
            </button>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}
