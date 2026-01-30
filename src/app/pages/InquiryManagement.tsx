import { useState, useMemo, useEffect } from "react";
import {
  Package,
  Plus,
  Eye,
  Edit2,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  TrendingUp,
  FileText,
  Truck,
  MoreVertical,
  Download,
  Copy,
  BarChart3,
  RefreshCw,
  User,
  Send,
  UserCheck,
} from "lucide-react";
import {
  PageHeader,
  PrimaryButton,
  IconButton,
  SummaryWidgets,
  ViewModeSwitcher,
  AdvancedSearchPanel,
  FilterChips,
  SearchBar,
  Pagination,
  SecondaryButton,
} from "../components/hb/listing";
import type { FilterCondition } from "../components/hb/listing";
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormSection,
  FormSelect,
  FormTextarea,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface Inquiry {
  id: string;
  inquiryNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status:
    | "New"
    | "Under Review"
    | "Quote Sent"
    | "Quote Approved"
    | "Quote Rejected"
    | "Expired"
    | "Cancelled";
  serviceType: string;
  from: string;
  to: string;
  pickupDate: string;
  submittedDate: string;
  totalWeight: number;
  totalValue: number;
  itemCount: number;
  priority: "High" | "Medium" | "Low";
  slaStatus: "On Time" | "At Risk" | "Overdue";
  assignedTo?: string;
  notes?: string;
}

type ViewMode = "grid" | "list" | "table";

export default function InquiryManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSendQuoteModal, setShowSendQuoteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [assignedUser, setAssignedUser] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("submittedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: "1",
      inquiryNumber: "INQ-2024-5678",
      customerName: "John Smith",
      customerEmail: "john.smith@example.com",
      customerPhone: "+971 50 123 4567",
      status: "New",
      serviceType: "Express Delivery",
      from: "Dubai, UAE",
      to: "Abu Dhabi, UAE",
      pickupDate: "2024-01-28",
      submittedDate: "2024-01-27",
      totalWeight: 125.5,
      totalValue: 15000,
      itemCount: 25,
      priority: "High",
      slaStatus: "On Time",
    },
    {
      id: "2",
      inquiryNumber: "INQ-2024-5677",
      customerName: "Sarah Ahmed",
      customerEmail: "sarah.ahmed@company.ae",
      customerPhone: "+971 52 987 6543",
      status: "Under Review",
      serviceType: "Standard Delivery",
      from: "Abu Dhabi, UAE",
      to: "Sharjah, UAE",
      pickupDate: "2024-01-29",
      submittedDate: "2024-01-27",
      totalWeight: 450.0,
      totalValue: 25000,
      itemCount: 8,
      priority: "Medium",
      slaStatus: "At Risk",
      assignedTo: "Ahmed Hassan",
    },
    {
      id: "3",
      inquiryNumber: "INQ-2024-5676",
      customerName: "Mohammed Ali",
      customerEmail: "m.ali@trading.ae",
      customerPhone: "+971 50 555 1234",
      status: "Quote Sent",
      serviceType: "Express Delivery",
      from: "Sharjah, UAE",
      to: "Dubai, UAE",
      pickupDate: "2024-01-28",
      submittedDate: "2024-01-26",
      totalWeight: 85.0,
      totalValue: 8000,
      itemCount: 2,
      priority: "High",
      slaStatus: "On Time",
      assignedTo: "Fatima Khan",
    },
    {
      id: "4",
      inquiryNumber: "INQ-2024-5675",
      customerName: "Alex Johnson",
      customerEmail: "alex@techcorp.ae",
      customerPhone: "+971 54 321 9876",
      status: "Quote Approved",
      serviceType: "Same Day Delivery",
      from: "Dubai, UAE",
      to: "Dubai, UAE",
      pickupDate: "2024-01-27",
      submittedDate: "2024-01-26",
      totalWeight: 15.0,
      totalValue: 12000,
      itemCount: 1,
      priority: "High",
      slaStatus: "On Time",
      assignedTo: "Omar Saleh",
    },
    {
      id: "5",
      inquiryNumber: "INQ-2024-5674",
      customerName: "Lisa Wang",
      customerEmail: "lisa.wang@retail.ae",
      customerPhone: "+971 56 789 4321",
      status: "Quote Rejected",
      serviceType: "Standard Delivery",
      from: "Dubai, UAE",
      to: "Ras Al Khaimah, UAE",
      pickupDate: "2024-01-30",
      submittedDate: "2024-01-26",
      totalWeight: 200.0,
      totalValue: 5000,
      itemCount: 5,
      priority: "Low",
      slaStatus: "On Time",
      assignedTo: "Ahmed Hassan",
    },
    {
      id: "6",
      inquiryNumber: "INQ-2024-5673",
      customerName: "David Brown",
      customerEmail: "david@logistics.ae",
      customerPhone: "+971 50 111 2222",
      status: "Expired",
      serviceType: "Express Delivery",
      from: "Dubai, UAE",
      to: "Abu Dhabi, UAE",
      pickupDate: "2024-01-25",
      submittedDate: "2024-01-24",
      totalWeight: 320.0,
      totalValue: 45000,
      itemCount: 6,
      priority: "Medium",
      slaStatus: "Overdue",
      assignedTo: "Fatima Khan",
    },
    {
      id: "7",
      inquiryNumber: "INQ-2024-5672",
      customerName: "Fatima Al Zaabi",
      customerEmail: "fatima@uaecompany.ae",
      customerPhone: "+971 55 888 9999",
      status: "New",
      serviceType: "Economy Delivery",
      from: "Ajman, UAE",
      to: "Fujairah, UAE",
      pickupDate: "2024-01-30",
      submittedDate: "2024-01-27",
      totalWeight: 75.0,
      totalValue: 3500,
      itemCount: 4,
      priority: "Low",
      slaStatus: "On Time",
    },
    {
      id: "8",
      inquiryNumber: "INQ-2024-5671",
      customerName: "Robert Miller",
      customerEmail: "robert@international.com",
      customerPhone: "+971 52 444 5555",
      status: "Under Review",
      serviceType: "Express Delivery",
      from: "Dubai, UAE",
      to: "Abu Dhabi, UAE",
      pickupDate: "2024-01-28",
      submittedDate: "2024-01-27",
      totalWeight: 180.0,
      totalValue: 22000,
      itemCount: 12,
      priority: "High",
      slaStatus: "At Risk",
      assignedTo: "Omar Saleh",
    },
  ]);

  // Filter options
  const filterOptions = [
    {
      id: "status",
      label: "Status",
      field: "Status",
      options: [
        "New",
        "Under Review",
        "Quote Sent",
        "Quote Approved",
        "Quote Rejected",
        "Expired",
        "Cancelled",
      ],
    },
    {
      id: "serviceType",
      label: "Service Type",
      field: "Service Type",
      options: [
        "Express Delivery",
        "Standard Delivery",
        "Same Day Delivery",
        "Economy Delivery",
      ],
    },
    {
      id: "priority",
      label: "Priority",
      field: "Priority",
      options: ["High", "Medium", "Low"],
    },
    {
      id: "sla",
      label: "SLA Status",
      field: "SLA Status",
      options: ["On Time", "At Risk", "Overdue"],
    },
    {
      id: "location",
      label: "Location",
      field: "Location",
      options: [
        "Dubai",
        "Abu Dhabi",
        "Sharjah",
        "Ajman",
        "Fujairah",
        "Ras Al Khaimah",
        "Umm Al Quwain",
      ],
    },
  ];

  // Filter and search logic
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const matchesSearch =
        searchQuery === "" ||
        inquiry.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.to.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = filters.every((filter) => {
        if (filter.field === "Status") {
          return filter.values.includes(inquiry.status);
        } else if (filter.field === "Service Type") {
          return filter.values.includes(inquiry.serviceType);
        } else if (filter.field === "Priority") {
          return filter.values.includes(inquiry.priority);
        } else if (filter.field === "SLA Status") {
          return filter.values.includes(inquiry.slaStatus);
        } else if (filter.field === "Location") {
          return filter.values.some(
            (v) => inquiry.from.includes(v) || inquiry.to.includes(v)
          );
        }
        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [inquiries, searchQuery, filters]);

  // Calculate paginated data
  const paginatedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInquiries, currentPage, itemsPerPage]);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "New":
        return "info";
      case "Under Review":
        return "warning";
      case "Quote Sent":
        return "info";
      case "Quote Approved":
        return "success";
      case "Quote Rejected":
      case "Cancelled":
        return "error";
      case "Expired":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getPriorityColor = (
    priority: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getSLAColor = (
    sla: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (sla) {
      case "On Time":
        return "success";
      case "At Risk":
        return "warning";
      case "Overdue":
        return "error";
      default:
        return "neutral";
    }
  };

  // Status badge component following design guidelines
  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            getStatusColor(status) === "success"
              ? "bg-success-500"
              : getStatusColor(status) === "warning"
              ? "bg-warning-500"
              : getStatusColor(status) === "error"
              ? "bg-error-500"
              : getStatusColor(status) === "info"
              ? "bg-info-500"
              : "bg-neutral-400"
          }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {status}
        </span>
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            getPriorityColor(priority) === "error"
              ? "bg-error-500"
              : getPriorityColor(priority) === "warning"
              ? "bg-warning-500"
              : "bg-neutral-400"
          }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {priority}
        </span>
      </span>
    );
  };

  const getSLABadge = (sla: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            getSLAColor(sla) === "success"
              ? "bg-success-500"
              : getSLAColor(sla) === "warning"
              ? "bg-warning-500"
              : getSLAColor(sla) === "error"
              ? "bg-error-500"
              : "bg-neutral-400"
          }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {sla}
        </span>
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New":
        return <FileText className="w-4 h-4" />;
      case "Under Review":
        return <Clock className="w-4 h-4" />;
      case "Quote Sent":
        return <Send className="w-4 h-4" />;
      case "Quote Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Quote Rejected":
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      case "Expired":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailsModal(true);
  };

  const handleCopyInquiryNumber = (inquiryNumber: string) => {
    navigator.clipboard.writeText(inquiryNumber);
    toast.success("Inquiry number copied!");
  };

  const handleAssign = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setAssignedUser(inquiry.assignedTo || "");
    setShowAssignModal(true);
  };

  const confirmAssign = () => {
    if (!assignedUser) {
      toast.error("Please select a user to assign");
      return;
    }
    if (selectedInquiry) {
      setInquiries(
        inquiries.map((inq) =>
          inq.id === selectedInquiry.id
            ? { ...inq, assignedTo: assignedUser, status: "Under Review" }
            : inq
        )
      );
      toast.success(`Inquiry assigned to ${assignedUser}`);
      setShowAssignModal(false);
      setAssignedUser("");
    }
  };

  const handleSendQuote = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowSendQuoteModal(true);
  };

  const confirmSendQuote = () => {
    if (selectedInquiry) {
      setInquiries(
        inquiries.map((inq) =>
          inq.id === selectedInquiry.id ? { ...inq, status: "Quote Sent" } : inq
        )
      );
      toast.success("Quote sent to customer successfully!");
      setShowSendQuoteModal(false);
    }
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleSubmitNewInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("New inquiry created successfully!");
    setShowAddModal(false);
  };

  // Summary widgets
  const stats = [
    {
      label: "Total Inquiries",
      value: inquiries.length.toString(),
      icon: "FileText",
      subtitle: "All inquiries",
    },
    {
      label: "New",
      value: inquiries.filter((i) => i.status === "New").length.toString(),
      icon: "AlertCircle",
      subtitle: "Unassigned",
    },
    {
      label: "Under Review",
      value: inquiries
        .filter((i) => i.status === "Under Review")
        .length.toString(),
      icon: "Clock",
      subtitle: "Being processed",
    },
    {
      label: "At Risk",
      value: inquiries.filter((i) => i.slaStatus === "At Risk").length.toString(),
      icon: "AlertCircle",
      subtitle: "SLA warning",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Inquiry Management"
          subtitle="Review and process customer shipment inquiries"
          breadcrumbs={[
            { label: "Operations", href: "#" },
            { label: "Inquiry Management", current: true },
          ]}
          primaryAction={{
            label: "Add Inquiry",
            onClick: handleAddNew,
            icon: Plus,
          }}
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
              { value: "status", label: "Status", direction: "asc" },
              { value: "priority", label: "Priority", direction: "desc" },
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
              placeholder="Search inquiries..."
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
              {paginatedInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {inquiry.inquiryNumber}
                    </h3>
                    <button
                      onClick={() =>
                        handleCopyInquiryNumber(inquiry.inquiryNumber)
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
                        {inquiry.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {inquiry.from} → {inquiry.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Pickup: {inquiry.pickupDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Items:{" "}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {inquiry.itemCount}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Weight:{" "}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {inquiry.totalWeight} kg
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Service:{" "}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {inquiry.serviceType}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Assigned:{" "}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {inquiry.assignedTo || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(inquiry.status)}
                      {getPriorityBadge(inquiry.priority)}
                      {getSLABadge(inquiry.slaStatus)}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(
                            openActionMenuId === inquiry.id ? null : inquiry.id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === inquiry.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => {
                              handleViewDetails(inquiry);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          {inquiry.status === "New" && (
                            <button
                              onClick={() => {
                                handleAssign(inquiry);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <UserCheck className="w-4 h-4" />
                              Assign Inquiry
                            </button>
                          )}
                          {inquiry.status === "Under Review" && (
                            <button
                              onClick={() => {
                                handleSendQuote(inquiry);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Send Quote
                            </button>
                          )}
                          <button
                            onClick={() => {
                              handleCopyInquiryNumber(inquiry.inquiryNumber);
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
              ))}
            </div>
          )}

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {inquiry.inquiryNumber}
                        </h3>
                        <button
                          onClick={() =>
                            handleCopyInquiryNumber(inquiry.inquiryNumber)
                          }
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors flex-shrink-0"
                          title="Copy inquiry number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {getStatusBadge(inquiry.status)}
                        {getPriorityBadge(inquiry.priority)}
                        
                        {/* Three-dot menu beside status badges */}
                        <div className="relative ml-auto">
                          <button
                            onClick={() =>
                              setOpenActionMenuId(
                                openActionMenuId === inquiry.id ? null : inquiry.id
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openActionMenuId === inquiry.id && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                              <button
                                onClick={() => {
                                  handleViewDetails(inquiry);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              {inquiry.status === "New" && (
                                <button
                                  onClick={() => {
                                    handleAssign(inquiry);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  Assign Inquiry
                                </button>
                              )}
                              {inquiry.status === "Under Review" && (
                                <button
                                  onClick={() => {
                                    handleSendQuote(inquiry);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Send className="w-4 h-4" />
                                  Send Quote
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleCopyInquiryNumber(inquiry.inquiryNumber);
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
                      <span className="truncate">{inquiry.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {inquiry.from} → {inquiry.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>Pickup: {inquiry.pickupDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="text-xs">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        SLA Status
                      </p>
                      <div className="mt-1">{getSLABadge(inquiry.slaStatus)}</div>
                    </div>
                    <div className="text-xs text-right">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Assigned To
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-white mt-1">
                        {inquiry.assignedTo || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Items
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {inquiry.itemCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Weight
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {inquiry.totalWeight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Value
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {inquiry.totalValue.toLocaleString()}
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
                        Route
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Service Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Assigned To
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        SLA
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedInquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {inquiry.inquiryNumber}
                            </span>
                            <button
                              onClick={() =>
                                handleCopyInquiryNumber(inquiry.inquiryNumber)
                              }
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                              title="Copy inquiry number"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {inquiry.customerName}
                            </p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                              {inquiry.customerEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="max-w-[200px] truncate">
                            {inquiry.from} → {inquiry.to}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                          {inquiry.serviceType}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                          {inquiry.assignedTo || (
                            <span className="text-neutral-400">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getStatusBadge(inquiry.status)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getPriorityBadge(inquiry.priority)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getSLABadge(inquiry.slaStatus)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenActionMenuId(
                                  openActionMenuId === inquiry.id ? null : inquiry.id
                                )
                              }
                              className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === inquiry.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={() => {
                                    handleViewDetails(inquiry);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                {inquiry.status === "New" && (
                                  <button
                                    onClick={() => {
                                      handleAssign(inquiry);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    Assign Inquiry
                                  </button>
                                )}
                                {inquiry.status === "Under Review" && (
                                  <button
                                    onClick={() => {
                                      handleSendQuote(inquiry);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <Send className="w-4 h-4" />
                                    Send Quote
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    handleCopyInquiryNumber(inquiry.inquiryNumber);
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

          {paginatedInquiries.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                No inquiries found
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* ========== PAGINATION ========== */}
        {filteredInquiries.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredInquiries.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredInquiries.length}
          />
        )}
      </div>

      {/* ========== VIEW DETAILS MODAL ========== */}
      {showDetailsModal && selectedInquiry && (
        <FormModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={`Inquiry Details - ${selectedInquiry.inquiryNumber}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Inquiry Overview */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Inquiry Number
                </p>
                <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {selectedInquiry.inquiryNumber}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Submitted: {selectedInquiry.submittedDate}
                </p>
              </div>
              <div className="text-right space-y-2">
                {getStatusBadge(selectedInquiry.status)}
                <div className="flex gap-2 justify-end">
                  {getPriorityBadge(selectedInquiry.priority)}
                  {getSLABadge(selectedInquiry.slaStatus)}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Customer Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Name
                  </p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">
                    {selectedInquiry.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Email
                  </p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">
                    {selectedInquiry.customerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Phone
                  </p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">
                    {selectedInquiry.customerPhone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Assigned To
                  </p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">
                    {selectedInquiry.assignedTo || "Unassigned"}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Shipment Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Service Type:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedInquiry.serviceType}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Pickup Date:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedInquiry.pickupDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      From:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedInquiry.from}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      To:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedInquiry.to}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Cargo Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Total Items:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedInquiry.itemCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Total Weight:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedInquiry.totalWeight} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Total Value:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      AED {selectedInquiry.totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              {selectedInquiry.status === "New" && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleAssign(selectedInquiry);
                  }}
                  className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                >
                  <UserCheck className="w-4 h-4 inline mr-2" />
                  Assign Inquiry
                </button>
              )}
              {selectedInquiry.status === "Under Review" && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleSendQuote(selectedInquiry);
                  }}
                  className="flex-1 px-4 py-2.5 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Send Quote
                </button>
              )}
              <SecondaryButton
                onClick={() => setShowDetailsModal(false)}
                className="flex-1"
              >
                Close
              </SecondaryButton>
            </div>
          </div>
        </FormModal>
      )}

      {/* ========== ASSIGN MODAL ========== */}
      <FormModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Inquiry"
      >
        <div className="space-y-4">
          <FormField label="Assign To" required>
            <FormSelect
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              <option value="">Select user...</option>
              <option value="Ahmed Hassan">Ahmed Hassan</option>
              <option value="Fatima Khan">Fatima Khan</option>
              <option value="Omar Saleh">Omar Saleh</option>
              <option value="Sara Ali">Sara Ali</option>
            </FormSelect>
          </FormField>

          <div className="p-4 bg-info-50 dark:bg-info-900/30 rounded-lg border border-info-200 dark:border-info-800">
            <p className="text-sm text-info-700 dark:text-info-400">
              The selected user will be notified and the inquiry status will be
              updated to "Under Review".
            </p>
          </div>

          <FormFooter
            onCancel={() => setShowAssignModal(false)}
            onSubmit={confirmAssign}
            submitText="Assign Inquiry"
            cancelText="Cancel"
          />
        </div>
      </FormModal>

      {/* ========== SEND QUOTE MODAL ========== */}
      <FormModal
        isOpen={showSendQuoteModal}
        onClose={() => setShowSendQuoteModal(false)}
        title="Send Quote to Customer"
      >
        <div className="space-y-4">
          <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success-900 dark:text-success-300">
                  Ready to Send Quote
                </p>
                <p className="text-sm text-success-700 dark:text-success-400 mt-1">
                  The customer will receive the quote via email and can review,
                  approve, or negotiate the pricing.
                </p>
              </div>
            </div>
          </div>

          <FormFooter
            onCancel={() => setShowSendQuoteModal(false)}
            onSubmit={confirmSendQuote}
            submitText="Send Quote"
            cancelText="Cancel"
          />
        </div>
      </FormModal>

      {/* ========== ADD INQUIRY MODAL ========== */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Inquiry"
        description="Add a new shipment inquiry to the system"
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmitNewInquiry}>
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="customerName" required>Customer Name</FormLabel>
                  <FormInput id="customerName" type="text" required placeholder="Enter customer name" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="customerEmail" required>Email</FormLabel>
                  <FormInput id="customerEmail" type="email" required placeholder="customer@example.com" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="customerPhone" required>Phone</FormLabel>
                  <FormInput id="customerPhone" type="tel" required placeholder="+971 50 123 4567" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="priority" required>Priority</FormLabel>
                  <FormSelect id="priority" required>
                    <option value="">Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </FormSelect>
                </FormField>
              </div>
            </div>

            {/* Shipment Details */}
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                Shipment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="serviceType" required>Service Type</FormLabel>
                  <FormSelect id="serviceType" required>
                    <option value="">Select service</option>
                    <option value="Express Delivery">Express Delivery</option>
                    <option value="Standard Delivery">Standard Delivery</option>
                    <option value="Same Day Delivery">Same Day Delivery</option>
                    <option value="Scheduled Delivery">Scheduled Delivery</option>
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="pickupDate" required>Pickup Date</FormLabel>
                  <FormInput id="pickupDate" type="date" required />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="from" required>From Location</FormLabel>
                  <FormInput id="from" type="text" required placeholder="Dubai, UAE" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="to" required>To Location</FormLabel>
                  <FormInput id="to" type="text" required placeholder="Abu Dhabi, UAE" />
                </FormField>
              </div>
            </div>

            {/* Cargo Information */}
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                Cargo Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField>
                  <FormLabel htmlFor="itemCount" required>Item Count</FormLabel>
                  <FormInput id="itemCount" type="number" required placeholder="0" min="1" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="totalWeight" required>Total Weight (kg)</FormLabel>
                  <FormInput id="totalWeight" type="number" required placeholder="0.0" step="0.1" min="0" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="totalValue" required>Total Value (AED)</FormLabel>
                  <FormInput id="totalValue" type="number" required placeholder="0.00" step="0.01" min="0" />
                </FormField>
              </div>
            </div>

            {/* Additional Notes */}
            <FormField>
              <FormLabel htmlFor="notes">Additional Notes</FormLabel>
              <FormTextarea
                id="notes"
                placeholder="Any special requirements or instructions..."
                rows={3}
              />
            </FormField>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowAddModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit">
              Create Inquiry
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}