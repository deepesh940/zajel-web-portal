import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  Package,
  User,
  ArrowRight,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Copy,
  BarChart3,
  RefreshCw,
  Download,
  DollarSign,
  Activity,
  Receipt,
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

interface QuoteApproval {
  id: string;
  inquiryNumber: string;
  customerName: string;
  serviceType: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  submittedBy: string;
  submittedDate: string;
  status: "Pending Approval" | "Approved" | "Rejected" | "Needs Revision";
  quote: {
    baseRate: number;
    fuelSurcharge: number;
    insuranceFee: number;
    additionalCharges: number;
    discount: number;
    totalAmount: number;
    validUntil: string;
    notes: string;
    margin: number; // Profit margin percentage
  };
  totalWeight: number;
  totalValue: number;
  itemCount: number;
}

type ViewMode = "grid" | "list" | "table";

export default function PricingApproval() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteApproval | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [revisionComments, setRevisionComments] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("submittedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [quotes, setQuotes] = useState<QuoteApproval[]>([
    {
      id: "1",
      inquiryNumber: "INQ-2024-5678",
      customerName: "John Smith",
      serviceType: "Express Delivery",
      pickupLocation: "Business Bay, Dubai",
      deliveryLocation: "Musaffah, Abu Dhabi",
      pickupDate: "2024-01-28",
      submittedBy: "Ahmed Hassan",
      submittedDate: "2024-01-27T14:30:00",
      status: "Pending Approval",
      quote: {
        baseRate: 627.5,
        fuelSurcharge: 37.65,
        insuranceFee: 150.0,
        additionalCharges: 50.0,
        discount: 0,
        totalAmount: 865.15,
        validUntil: "2024-02-03",
        notes: "Express delivery with insurance coverage",
        margin: 18.5,
      },
      totalWeight: 125.5,
      totalValue: 15000,
      itemCount: 3,
    },
    {
      id: "2",
      inquiryNumber: "INQ-2024-5677",
      customerName: "Sarah Ahmed",
      serviceType: "Standard Delivery",
      pickupLocation: "Jebel Ali, Dubai",
      deliveryLocation: "Al Ain Industrial Area",
      pickupDate: "2024-01-29",
      submittedBy: "Fatima Khan",
      submittedDate: "2024-01-27T10:15:00",
      status: "Pending Approval",
      quote: {
        baseRate: 2250.0,
        fuelSurcharge: 135.0,
        insuranceFee: 250.0,
        additionalCharges: 100.0,
        discount: 200.0,
        totalAmount: 2535.0,
        validUntil: "2024-02-03",
        notes: "Standard delivery with insurance, bulk discount applied",
        margin: 22.3,
      },
      totalWeight: 450.0,
      totalValue: 25000,
      itemCount: 8,
    },
    {
      id: "3",
      inquiryNumber: "INQ-2024-5676",
      customerName: "Mohammed Ali",
      serviceType: "Express Delivery",
      pickupLocation: "Deira, Dubai",
      deliveryLocation: "Sharjah Industrial Area",
      pickupDate: "2024-01-28",
      submittedBy: "Omar Saleh",
      submittedDate: "2024-01-27T08:00:00",
      status: "Approved",
      quote: {
        baseRate: 425.0,
        fuelSurcharge: 25.5,
        insuranceFee: 80.0,
        additionalCharges: 50.0,
        discount: 0,
        totalAmount: 580.5,
        validUntil: "2024-02-02",
        notes: "Express delivery with tracking",
        margin: 20.1,
      },
      totalWeight: 85.0,
      totalValue: 8000,
      itemCount: 2,
    },
    {
      id: "4",
      inquiryNumber: "INQ-2024-5675",
      customerName: "Alex Johnson",
      serviceType: "Same Day Delivery",
      pickupLocation: "DIFC, Dubai",
      deliveryLocation: "Downtown Dubai",
      pickupDate: "2024-01-27",
      submittedBy: "Ahmed Hassan",
      submittedDate: "2024-01-26T15:45:00",
      status: "Needs Revision",
      quote: {
        baseRate: 300.0,
        fuelSurcharge: 18.0,
        insuranceFee: 120.0,
        additionalCharges: 75.0,
        discount: 50.0,
        totalAmount: 463.0,
        validUntil: "2024-02-01",
        notes: "Same day delivery - high value item",
        margin: 12.5,
      },
      totalWeight: 15.0,
      totalValue: 12000,
      itemCount: 1,
    },
    {
      id: "5",
      inquiryNumber: "INQ-2024-5674",
      customerName: "Lisa Wang",
      serviceType: "Standard Delivery",
      pickupLocation: "Al Quoz, Dubai",
      deliveryLocation: "Ras Al Khaimah",
      pickupDate: "2024-01-30",
      submittedBy: "Fatima Khan",
      submittedDate: "2024-01-26T11:20:00",
      status: "Rejected",
      quote: {
        baseRate: 800.0,
        fuelSurcharge: 48.0,
        insuranceFee: 50.0,
        additionalCharges: 0,
        discount: 100.0,
        totalAmount: 798.0,
        validUntil: "2024-02-05",
        notes: "Long distance delivery",
        margin: 8.2,
      },
      totalWeight: 200.0,
      totalValue: 5000,
      itemCount: 5,
    },
  ]);

  // Filter options for advanced search
  const filterOptions = [
    {
      id: "status",
      label: "Status",
      type: "select",
      values: [],
      options: [
        { value: "Pending Approval", label: "Pending Approval" },
        { value: "Approved", label: "Approved" },
        { value: "Rejected", label: "Rejected" },
        { value: "Needs Revision", label: "Needs Revision" },
      ],
    },
    {
      id: "serviceType",
      label: "Service Type",
      type: "select",
      values: [],
      options: [
        { value: "Express Delivery", label: "Express Delivery" },
        { value: "Standard Delivery", label: "Standard Delivery" },
        { value: "Same Day Delivery", label: "Same Day Delivery" },
      ],
    },
    {
      id: "margin",
      label: "Profit Margin",
      type: "select",
      values: [],
      options: [
        { value: "high", label: "High (≥20%)" },
        { value: "medium", label: "Medium (15-19%)" },
        { value: "low", label: "Low (<15%)" },
      ],
    },
  ];

  // Apply filters
  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(quote.status);

    const serviceFilter = filters.find((f) => f.id === "serviceType");
    const matchesService =
      !serviceFilter || serviceFilter.values.length === 0 || serviceFilter.values.includes(quote.serviceType);

    const marginFilter = filters.find((f) => f.id === "margin");
    let matchesMargin = true;
    if (marginFilter && marginFilter.values.length > 0) {
      matchesMargin = marginFilter.values.some((value) => {
        if (value === "high") return quote.quote.margin >= 20;
        if (value === "medium") return quote.quote.margin >= 15 && quote.quote.margin < 20;
        if (value === "low") return quote.quote.margin < 15;
        return false;
      });
    }

    return matchesSearch && matchesStatus && matchesService && matchesMargin;
  });

  // Apply sorting
  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    let comparison = 0;
    if (sortField === "submittedDate") {
      comparison = new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
    } else if (sortField === "inquiryNumber") {
      comparison = a.inquiryNumber.localeCompare(b.inquiryNumber);
    } else if (sortField === "customerName") {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortField === "totalAmount") {
      comparison = a.quote.totalAmount - b.quote.totalAmount;
    } else if (sortField === "margin") {
      comparison = a.quote.margin - b.quote.margin;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedQuotes.length / itemsPerPage);
  const paginatedQuotes = sortedQuotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Pending Approval":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Needs Revision":
        return "info";
      default:
        return "neutral";
    }
  };

  // Status badge component following design guidelines
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
                : getStatusColor(status) === "info"
                  ? "bg-info-500"
                  : "bg-neutral-400"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getMarginBadge = (margin: number) => {
    if (margin >= 20) {
      return "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400";
    } else if (margin >= 15) {
      return "bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400";
    } else if (margin >= 10) {
      return "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400";
    } else {
      return "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400";
    }
  };

  const handleViewDetails = (quote: QuoteApproval) => {
    setSelectedQuote(quote);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleApprove = (quote: QuoteApproval) => {
    setSelectedQuote(quote);
    setApprovalNotes("");
    setShowApproveModal(true);
    setOpenActionMenuId(null);
  };

  const confirmApprove = () => {
    if (selectedQuote) {
      setQuotes(
        quotes.map((q) =>
          q.id === selectedQuote.id ? { ...q, status: "Approved" } : q
        )
      );
      toast.success(`Quote ${selectedQuote.inquiryNumber} approved`);
    }
    setShowApproveModal(false);
  };

  const handleReject = (quote: QuoteApproval) => {
    setSelectedQuote(quote);
    setRejectionReason("");
    setShowRejectModal(true);
    setOpenActionMenuId(null);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    if (selectedQuote) {
      setQuotes(
        quotes.map((q) =>
          q.id === selectedQuote.id ? { ...q, status: "Rejected" } : q
        )
      );
      toast.success(`Quote ${selectedQuote.inquiryNumber} rejected`);
    }
    setShowRejectModal(false);
  };

  const handleRequestRevision = (quote: QuoteApproval) => {
    setSelectedQuote(quote);
    setRevisionComments("");
    setShowRevisionModal(true);
    setOpenActionMenuId(null);
  };

  const confirmRequestRevision = () => {
    if (!revisionComments.trim()) {
      toast.error("Please provide revision comments");
      return;
    }
    if (selectedQuote) {
      setQuotes(
        quotes.map((q) =>
          q.id === selectedQuote.id ? { ...q, status: "Needs Revision" } : q
        )
      );
      toast.success(`Revision requested for ${selectedQuote.inquiryNumber}`);
    }
    setShowRevisionModal(false);
  };

  const handleCopyInquiryNumber = (inquiryNumber: string) => {
    navigator.clipboard.writeText(inquiryNumber);
    toast.success("Inquiry number copied to clipboard");
  };

  const handleDownloadQuote = (quote: QuoteApproval) => {
    toast.success(`Downloading quote for ${quote.inquiryNumber}`);
  };

  const handleCreateProformaInvoice = (quote: QuoteApproval) => {
    const draft = {
      customerName: quote.customerName,
      inquiryNumber: quote.inquiryNumber,
      tripNumber: "",
      quoteNumber: quote.id, // Using id as placeholder for quote number
      amount: quote.quote.totalAmount,
      description: `Proforma Invoice for Approved Quote ${quote.inquiryNumber}\nService: ${quote.serviceType}\nFrom: ${quote.pickupLocation}\nTo: ${quote.deliveryLocation}`,
      type: "Proforma"
    };

    localStorage.setItem("pendingProformaDraft", JSON.stringify(draft));

    // Dispatch custom navigation event
    const event = new CustomEvent('navigate', { detail: 'customer-invoicing' });
    window.dispatchEvent(event);

    toast.success("Draft proforma invoice created. Redirecting to billing...");
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
      label: "Pending Approval",
      value: quotes.filter((q) => q.status === "Pending Approval").length,
      icon: "Clock",
      subtitle: "Awaiting review",
    },
    {
      label: "Approved",
      value: quotes.filter((q) => q.status === "Approved").length,
      icon: "CheckCircle",
      subtitle: "Ready to proceed",
    },
    {
      label: "Rejected",
      value: quotes.filter((q) => q.status === "Rejected").length,
      icon: "XCircle",
      subtitle: "Not approved",
    },
    {
      label: "Needs Revision",
      value: quotes.filter((q) => q.status === "Needs Revision").length,
      icon: "Activity",
      subtitle: "Requires changes",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Pricing Approval"
          subtitle="Review and approve pricing quotes submitted by operations team"
          breadcrumbs={[
            { label: "Finance", href: "#" },
            { label: "Pricing Approval", current: true },
          ]}
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
              {
                value: "totalAmount",
                label: "Amount (High to Low)",
                direction: "desc",
              },
              {
                value: "totalAmount",
                label: "Amount (Low to High)",
                direction: "asc",
              },
              { value: "margin", label: "Margin (High to Low)", direction: "desc" },
              { value: "margin", label: "Margin (Low to High)", direction: "asc" },
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
              placeholder="Search quotes..."
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions as any}
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
            onClearAll={() => setFilters((filterOptions as any).map((f: any) => ({ ...f, values: [] })))}
          />
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && <SummaryWidgets widgets={stats} />}

        {/* ========== CONTENT AREA ========== */}
        <div className="space-y-4">
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(quote)}
                >
                  {/* Top Row: Inquiry Number on left, Status Badge + 3-dot menu on right */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {quote.inquiryNumber}
                    </h3>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(quote.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === quote.id ? null : quote.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown menu */}
                        {openActionMenuId === quote.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(quote);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            {quote.status === "Pending Approval" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(quote);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestRevision(quote);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <FileText className="w-4 h-4" />
                                  Request Revision
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(quote);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInquiryNumber(quote.inquiryNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Inquiry Number
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadQuote(quote);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </button>
                            {quote.status === "Approved" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCreateProformaInvoice(quote);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Receipt className="w-4 h-4" />
                                Create Proforma Invoice
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{quote.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {quote.pickupLocation} → {quote.deliveryLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Submitted: {formatTimestamp(quote.submittedDate)}</span>
                    </div>
                  </div>

                  {/* Quote Amount & Margin */}
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-primary-700 dark:text-primary-400 mb-1">
                          Quote Amount
                        </div>
                        <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          AED {quote.quote.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Margin
                        </div>
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded ${getMarginBadge(
                            quote.quote.margin
                          )}`}
                        >
                          {quote.quote.margin}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submitted By */}
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    By {quote.submittedBy}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {quote.inquiryNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyInquiryNumber(quote.inquiryNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy inquiry number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {getStatusBadge(quote.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{quote.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {quote.pickupLocation} → {quote.deliveryLocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>By {quote.submittedBy}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                            AED {quote.quote.totalAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            Margin:
                          </span>
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded ${getMarginBadge(
                              quote.quote.margin
                            )}`}
                          >
                            {quote.quote.margin}%
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatTimestamp(quote.submittedDate)}
                        </div>
                      </div>
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(
                            openActionMenuId === quote.id ? null : quote.id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === quote.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleViewDetails(quote)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {quote.status === "Pending Approval" && (
                            <>
                              <button
                                onClick={() => handleApprove(quote)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>

                              <button
                                onClick={() => handleRequestRevision(quote)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                Request Revision
                              </button>

                              <button
                                onClick={() => handleReject(quote)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => {
                              handleCopyInquiryNumber(quote.inquiryNumber);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Inquiry Number
                          </button>

                          <button
                            onClick={() => {
                              handleDownloadQuote(quote);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
                          </button>
                          {quote.status === "Approved" && (
                            <button
                              onClick={() => {
                                handleCreateProformaInvoice(quote);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Receipt className="w-4 h-4" />
                              Create Proforma Invoice
                            </button>
                          )}
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
                        Inquiry Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Quote Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Margin
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Submitted By
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedQuotes.map((quote) => (
                      <tr
                        key={quote.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer relative"
                        onClick={() => handleViewDetails(quote)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {quote.inquiryNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInquiryNumber(quote.inquiryNumber);
                              }}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(quote.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                              {quote.customerName}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {quote.serviceType}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {quote.pickupLocation} → {quote.deliveryLocation}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                            AED {quote.quote.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getMarginBadge(
                                quote.quote.margin
                              )}`}
                            >
                              {quote.quote.margin}%
                            </span>
                            {quote.quote.margin >= 15 ? (
                              <TrendingUp className="w-3 h-3 text-success-600 dark:text-success-400" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-error-600 dark:text-error-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm text-neutral-900 dark:text-white">
                              {quote.submittedBy}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {formatTimestamp(quote.submittedDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === quote.id ? null : quote.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === quote.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(quote);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>

                                {quote.status === "Pending Approval" && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApprove(quote);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Approve
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRequestRevision(quote);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                    >
                                      <FileText className="w-4 h-4" />
                                      Request Revision
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject(quote);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Reject
                                    </button>
                                  </>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyInquiryNumber(quote.inquiryNumber);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Inquiry Number
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadQuote(quote);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download PDF
                                </button>
                                {quote.status === "Approved" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCreateProformaInvoice(quote);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <Receipt className="w-4 h-4" />
                                    Create Proforma Invoice
                                  </button>
                                )}
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
          {filteredQuotes.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No quotes found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "No quotes pending approval"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredQuotes.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredQuotes.length}
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
          title="Quote Details"
          description={selectedQuote?.inquiryNumber}
          maxWidth="max-w-4xl"
        >
          {selectedQuote && (
            <div className="space-y-6">
              {/* Customer & Shipment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Name
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedQuote.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Service Type
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedQuote.serviceType}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Shipment Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Weight / Items
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedQuote.totalWeight} kg / {selectedQuote.itemCount} items
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Cargo Value
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        AED {selectedQuote.totalValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Route Details
                </h4>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Pickup
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedQuote.pickupLocation}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Delivery
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedQuote.deliveryLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Date
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedQuote.pickupDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Price Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Base Rate
                    </span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      AED {selectedQuote.quote.baseRate.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Fuel Surcharge
                    </span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      AED {selectedQuote.quote.fuelSurcharge.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Insurance Fee
                    </span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      AED {selectedQuote.quote.insuranceFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Additional Charges
                    </span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      AED {selectedQuote.quote.additionalCharges.toFixed(2)}
                    </span>
                  </div>
                  {selectedQuote.quote.discount > 0 && (
                    <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="text-sm text-success-600 dark:text-success-400">
                        Discount
                      </span>
                      <span className="text-sm font-medium text-success-600 dark:text-success-400">
                        - AED {selectedQuote.quote.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 bg-primary-50 dark:bg-primary-900/30 px-4 rounded-lg mt-2">
                    <div>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">
                        Total Amount
                      </p>
                      <p className="text-xl font-bold text-primary-700 dark:text-primary-400">
                        AED {selectedQuote.quote.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                        Profit Margin
                      </p>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded ${getMarginBadge(
                          selectedQuote.quote.margin
                        )}`}
                      >
                        {selectedQuote.quote.margin}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Submitted By
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedQuote.submittedBy}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Submitted On
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatTimestamp(selectedQuote.submittedDate)}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Valid Until
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedQuote.quote.validUntil}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedQuote.quote.notes && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                    Notes
                  </p>
                  <p className="text-sm text-neutral-900 dark:text-white">
                    {selectedQuote.quote.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <FormFooter>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
            {selectedQuote && selectedQuote.status === "Pending Approval" && (
              <>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleRequestRevision(selectedQuote);
                  }}
                  className="px-4 py-2 text-sm text-info-700 dark:text-info-300 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg hover:bg-info-100 dark:hover:bg-info-900/50 transition-colors"
                >
                  Request Revision
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleReject(selectedQuote);
                  }}
                  className="px-4 py-2 text-sm text-error-700 dark:text-error-300 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg hover:bg-error-100 dark:hover:bg-error-900/50 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleApprove(selectedQuote);
                  }}
                  className="px-4 py-2 text-sm text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              </>
            )}
            {selectedQuote && selectedQuote.status === "Approved" && (
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleCreateProformaInvoice(selectedQuote);
                }}
                className="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                Create Proforma Invoice
              </button>
            )}
          </FormFooter>
        </FormModal>

        {/* Approve Modal */}
        {selectedQuote && (
          <FormModal
            isOpen={showApproveModal}
            onClose={() => setShowApproveModal(false)}
            title="Approve Quote"
            description={`${selectedQuote.inquiryNumber} - ${selectedQuote.customerName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg">
                <p className="text-sm text-success-900 dark:text-success-400">
                  You are about to approve this quote. The customer will be notified and can
                  proceed with booking the shipment.
                </p>
              </div>

              <FormField>
                <FormLabel htmlFor="approvalNotes">Approval Notes (Optional)</FormLabel>
                <FormTextarea
                  id="approvalNotes"
                  rows={4}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any notes or instructions..."
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="px-4 py-2 text-sm text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Approval
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Reject Modal */}
        {selectedQuote && (
          <FormModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            title="Reject Quote"
            description={`${selectedQuote.inquiryNumber} - ${selectedQuote.customerName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-sm text-error-900 dark:text-error-400">
                  You are about to reject this quote. The operations team will be notified to
                  reconsider the pricing.
                </p>
              </div>

              <FormField>
                <FormLabel htmlFor="rejectionReason" required>
                  Reason for Rejection
                </FormLabel>
                <FormTextarea
                  id="rejectionReason"
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this quote is being rejected..."
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 text-sm text-white bg-error-500 hover:bg-error-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Confirm Rejection
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Request Revision Modal */}
        {selectedQuote && (
          <FormModal
            isOpen={showRevisionModal}
            onClose={() => setShowRevisionModal(false)}
            title="Request Revision"
            description={`${selectedQuote.inquiryNumber} - ${selectedQuote.customerName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                <p className="text-sm text-info-900 dark:text-info-400">
                  Request the operations team to revise the pricing. They will be notified with
                  your comments.
                </p>
              </div>

              <FormField>
                <FormLabel htmlFor="revisionComments" required>
                  Revision Comments
                </FormLabel>
                <FormTextarea
                  id="revisionComments"
                  rows={4}
                  value={revisionComments}
                  onChange={(e) => setRevisionComments(e.target.value)}
                  placeholder="Specify what needs to be revised..."
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRequestRevision}
                className="px-4 py-2 text-sm text-white bg-info-500 hover:bg-info-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Send Revision Request
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    </div>
  );
}
