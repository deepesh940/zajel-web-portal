import { useState, useMemo, useEffect } from "react";
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Truck,
  Box,
  Weight,
  Shield,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  MessageSquare,
  Eye,
  BarChart3,
  RefreshCw,
  Copy,
  MoreVertical,
  TrendingUp,
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
  FormTextarea,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface Quote {
  id: string;
  inquiryNumber: string;
  quoteNumber: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Expired";
  submittedDate: string;
  quoteDate: string;
  validUntil: string;
  serviceType: string;
  from: string;
  to: string;
  pickupDate: string;
  totalWeight: number;
  totalValue: number;
  itemCount: number;
  quoteAmount: number;
  estimatedDelivery: string;
}

interface QuoteDetail {
  inquiryNumber: string;
  quoteNumber: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Expired";
  submittedDate: string;
  quoteDate: string;
  validUntil: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  from: {
    contact: string;
    phone: string;
    address: string;
    city: string;
    emirate: string;
  };
  to: {
    contact: string;
    phone: string;
    address: string;
    city: string;
    emirate: string;
  };
  cargoItems: {
    description: string;
    quantity: number;
    weight: number;
    dimensions: string;
    value: number;
  }[];
  pricing: {
    baseFare: number;
    fuelSurcharge: number;
    insuranceFee?: number;
    packagingFee?: number;
    handlingFee: number;
    vat: number;
    discount?: number;
    total: number;
  };
  additionalServices: {
    insurance: boolean;
    insuranceValue?: number;
    packaging: boolean;
    packagingType?: string;
  };
  terms: string[];
  estimatedDelivery: string;
}

type ViewMode = "grid" | "list" | "table";

export default function QuoteReview() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showNegotiateModal, setShowNegotiateModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [negotiationMessage, setNegotiationMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "cargo",
    "pricing",
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("quoteDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Mock quotes data
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: "1",
      inquiryNumber: "INQ-2024-5678",
      quoteNumber: "QUO-2024-8901",
      status: "Pending Review",
      submittedDate: "2024-01-27",
      quoteDate: "2024-01-27",
      validUntil: "2024-01-30",
      serviceType: "Express Delivery",
      from: "Dubai, UAE",
      to: "Abu Dhabi, UAE",
      pickupDate: "2024-01-28",
      totalWeight: 125.5,
      totalValue: 15000,
      itemCount: 25,
      quoteAmount: 850,
      estimatedDelivery: "2024-01-29 (Next Day)",
    },
    {
      id: "2",
      inquiryNumber: "INQ-2024-5432",
      quoteNumber: "QUO-2024-8902",
      status: "Approved",
      submittedDate: "2024-01-25",
      quoteDate: "2024-01-25",
      validUntil: "2024-01-28",
      serviceType: "Standard Delivery",
      from: "Abu Dhabi, UAE",
      to: "Sharjah, UAE",
      pickupDate: "2024-01-26",
      totalWeight: 85.0,
      totalValue: 8500,
      itemCount: 15,
      quoteAmount: 520,
      estimatedDelivery: "2024-01-28 (2-3 Days)",
    },
    {
      id: "3",
      inquiryNumber: "INQ-2024-4567",
      quoteNumber: "QUO-2024-8903",
      status: "Rejected",
      submittedDate: "2024-01-24",
      quoteDate: "2024-01-24",
      validUntil: "2024-01-27",
      serviceType: "Express Delivery",
      from: "Sharjah, UAE",
      to: "Dubai, UAE",
      pickupDate: "2024-01-25",
      totalWeight: 45.0,
      totalValue: 5000,
      itemCount: 8,
      quoteAmount: 380,
      estimatedDelivery: "2024-01-26 (Next Day)",
    },
    {
      id: "4",
      inquiryNumber: "INQ-2024-3456",
      quoteNumber: "QUO-2024-8904",
      status: "Expired",
      submittedDate: "2024-01-20",
      quoteDate: "2024-01-20",
      validUntil: "2024-01-23",
      serviceType: "Standard Delivery",
      from: "Dubai, UAE",
      to: "Fujairah, UAE",
      pickupDate: "2024-01-21",
      totalWeight: 200.0,
      totalValue: 25000,
      itemCount: 50,
      quoteAmount: 1250,
      estimatedDelivery: "2024-01-24 (3-4 Days)",
    },
    {
      id: "5",
      inquiryNumber: "INQ-2024-2345",
      quoteNumber: "QUO-2024-8905",
      status: "Pending Review",
      submittedDate: "2024-01-26",
      quoteDate: "2024-01-26",
      validUntil: "2024-01-29",
      serviceType: "Economy Delivery",
      from: "Ajman, UAE",
      to: "Ras Al Khaimah, UAE",
      pickupDate: "2024-01-27",
      totalWeight: 60.0,
      totalValue: 4000,
      itemCount: 12,
      quoteAmount: 290,
      estimatedDelivery: "2024-01-31 (4-5 Days)",
    },
    {
      id: "6",
      inquiryNumber: "INQ-2024-1234",
      quoteNumber: "QUO-2024-8906",
      status: "Approved",
      submittedDate: "2024-01-23",
      quoteDate: "2024-01-23",
      validUntil: "2024-01-26",
      serviceType: "Express Delivery",
      from: "Dubai, UAE",
      to: "Abu Dhabi, UAE",
      pickupDate: "2024-01-24",
      totalWeight: 150.0,
      totalValue: 18000,
      itemCount: 30,
      quoteAmount: 950,
      estimatedDelivery: "2024-01-25 (Next Day)",
    },
  ]);

  // Filter options
  const filterOptions = [
    {
      id: "status",
      label: "Status",
      field: "Status",
      options: ["Pending Review", "Approved", "Rejected", "Expired"],
    },
    {
      id: "serviceType",
      label: "Service Type",
      field: "Service Type",
      options: ["Express Delivery", "Standard Delivery", "Economy Delivery"],
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
  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch =
        searchQuery === "" ||
        quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.to.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = filters.every((filter) => {
        if (filter.field === "Status") {
          return filter.values.includes(quote.status);
        } else if (filter.field === "Service Type") {
          return filter.values.includes(quote.serviceType);
        } else if (filter.field === "Location") {
          return filter.values.some(
            (v) => quote.from.includes(v) || quote.to.includes(v)
          );
        }
        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [quotes, searchQuery, filters]);

  // Calculate paginated data
  const paginatedQuotes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredQuotes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredQuotes, currentPage, itemsPerPage]);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Pending Review":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Expired":
        return "neutral";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Review":
        return <Clock className="w-4 h-4" />;
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "Expired":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowDetailsModal(true);
  };

  const handleCopyQuoteNumber = (quoteNumber: string) => {
    navigator.clipboard.writeText(quoteNumber);
    toast.success("Quote number copied!");
  };

  const handleApprove = () => {
    if (selectedQuote) {
      setQuotes(
        quotes.map((q) =>
          q.id === selectedQuote.id ? { ...q, status: "Approved" } : q
        )
      );
      toast.success("Quote approved successfully!");
      setShowApproveModal(false);
      setShowDetailsModal(false);
    }
  };

  const handleReject = () => {
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
      toast.success("Quote rejected. Your feedback has been sent.");
      setShowRejectModal(false);
      setShowDetailsModal(false);
      setRejectionReason("");
    }
  };

  const handleNegotiate = () => {
    if (!negotiationMessage.trim()) {
      toast.error("Please enter your negotiation message");
      return;
    }
    toast.success("Your negotiation request has been sent");
    setShowNegotiateModal(false);
    setNegotiationMessage("");
  };

  const handleDownload = (quote: Quote) => {
    toast.success(`Downloading quote ${quote.quoteNumber} PDF...`);
  };

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  // Summary widgets
  const stats = [
    {
      label: "Total Quotes",
      value: quotes.length.toString(),
      icon: "FileText",
      subtitle: "All quotes",
    },
    {
      label: "Pending Review",
      value: quotes.filter((q) => q.status === "Pending Review").length.toString(),
      icon: "Clock",
      subtitle: "Awaiting action",
    },
    {
      label: "Approved",
      value: quotes.filter((q) => q.status === "Approved").length.toString(),
      icon: "CheckCircle",
      subtitle: "Accepted quotes",
    },
    {
      label: "Total Value",
      value: `AED ${quotes
        .filter((q) => q.status === "Approved")
        .reduce((sum, q) => sum + q.quoteAmount, 0)
        .toLocaleString()}`,
      icon: "TrendingUp",
      subtitle: "Approved quotes",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Quote Review"
          subtitle="Review and respond to your shipment quotes"
          breadcrumbs={[
            { label: "Customer Portal", href: "#" },
            { label: "Quote Review", current: true },
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
              { value: "quoteNumber", label: "Quote Number (A-Z)", direction: "asc" },
              { value: "quoteNumber", label: "Quote Number (Z-A)", direction: "desc" },
              { value: "quoteDate", label: "Date (Newest)", direction: "desc" },
              { value: "quoteDate", label: "Date (Oldest)", direction: "asc" },
              { value: "status", label: "Status", direction: "asc" },
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
              {paginatedQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {quote.quoteNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyQuoteNumber(quote.quoteNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy quote number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {getStatusBadge(quote.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            Inquiry: {quote.inquiryNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {quote.from} → {quote.to}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Valid until: {quote.validUntil}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Amount:{" "}
                          </span>
                          <span className="font-semibold text-primary-600 dark:text-primary-400">
                            AED {quote.quoteAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Items:{" "}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {quote.itemCount}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Weight:{" "}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {quote.totalWeight} kg
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Service:{" "}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {quote.serviceType}
                          </span>
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
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => {
                              handleViewDetails(quote);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              handleDownload(quote);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
                          </button>
                          <button
                            onClick={() => {
                              handleCopyQuoteNumber(quote.quoteNumber);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Quote Number
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
              {paginatedQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {quote.quoteNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyQuoteNumber(quote.quoteNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors flex-shrink-0"
                          title="Copy quote number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {getStatusBadge(quote.status)}
                        
                        {/* Three-dot menu beside status */}
                        <div className="relative ml-auto">
                          <button
                            onClick={() =>
                              setOpenActionMenuId(
                                openActionMenuId === quote.id ? null : quote.id
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openActionMenuId === quote.id && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                              <button
                                onClick={() => {
                                  handleViewDetails(quote);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              {quote.status === "Pending Review" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedQuote(quote);
                                      setShowApproveModal(true);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve Quote
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedQuote(quote);
                                      setShowRejectModal(true);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject Quote
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  handleDownload(quote);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Download className="w-4 h-4" />
                                Download PDF
                              </button>
                              <button
                                onClick={() => {
                                  handleCopyQuoteNumber(quote.quoteNumber);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Copy Quote Number
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <FileText className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{quote.inquiryNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {quote.from} → {quote.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>Valid: {quote.validUntil}</span>
                    </div>
                  </div>

                  <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-3 mb-4">
                    <p className="text-xs text-primary-700 dark:text-primary-400 mb-1">
                      Quote Amount
                    </p>
                    <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      AED {quote.quoteAmount.toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400">Items</p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {quote.itemCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400">Weight</p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {quote.totalWeight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400">Value</p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {quote.totalValue.toLocaleString()}
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
                        Quote Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Inquiry
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Service Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Route
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Valid Until
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedQuotes.map((quote) => (
                      <tr
                        key={quote.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {quote.quoteNumber}
                            </span>
                            <button
                              onClick={() => handleCopyQuoteNumber(quote.quoteNumber)}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                              title="Copy quote number"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                          {quote.inquiryNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                          {quote.serviceType}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="max-w-[200px] truncate">
                            {quote.from} → {quote.to}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="font-semibold text-primary-600 dark:text-primary-400">
                            AED {quote.quoteAmount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                          {quote.validUntil}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getStatusBadge(quote.status)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenActionMenuId(
                                  openActionMenuId === quote.id ? null : quote.id
                                )
                              }
                              className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === quote.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={() => {
                                    handleViewDetails(quote);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                {quote.status === "Pending Review" && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedQuote(quote);
                                        setShowApproveModal(true);
                                        setOpenActionMenuId(null);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Approve Quote
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedQuote(quote);
                                        setShowRejectModal(true);
                                        setOpenActionMenuId(null);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Reject Quote
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => {
                                    handleDownload(quote);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Download className="w-4 h-4" />
                                  Download PDF
                                </button>
                                <button
                                  onClick={() => {
                                    handleCopyQuoteNumber(quote.quoteNumber);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Quote Number
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

          {paginatedQuotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                No quotes found
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* ========== PAGINATION ========== */}
        {filteredQuotes.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredQuotes.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredQuotes.length}
          />
        )}
      </div>

      {/* ========== VIEW DETAILS MODAL ========== */}
      {showDetailsModal && selectedQuote && (
        <FormModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={`Quote Details - ${selectedQuote.quoteNumber}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Quote Overview */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Quote Number
                </p>
                <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {selectedQuote.quoteNumber}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Inquiry: {selectedQuote.inquiryNumber}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(selectedQuote.status)}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Valid until: {selectedQuote.validUntil}
                </p>
              </div>
            </div>

            {/* Quote Amount */}
            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-5 border border-primary-200 dark:border-primary-800">
              <p className="text-sm text-primary-700 dark:text-primary-400 mb-2">
                Quote Amount
              </p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                AED {selectedQuote.quoteAmount.toLocaleString()}
              </p>
              <p className="text-xs text-primary-700 dark:text-primary-400">
                Includes VAT
              </p>
              <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-800">
                <p className="text-xs text-primary-700 dark:text-primary-400">
                  Estimated Delivery
                </p>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-300 mt-1">
                  {selectedQuote.estimatedDelivery}
                </p>
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
                      {selectedQuote.serviceType}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Pickup Date:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedQuote.pickupDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Route:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedQuote.from} → {selectedQuote.to}
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
                      {selectedQuote.itemCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Total Weight:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedQuote.totalWeight} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Total Value:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      AED {selectedQuote.totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedQuote.status === "Pending Review" && (
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowApproveModal(true);
                  }}
                  className="flex-1 px-4 py-2.5 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors font-medium"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Approve Quote
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowNegotiateModal(true);
                  }}
                  className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Negotiate
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowRejectModal(true);
                  }}
                  className="flex-1 px-4 py-2.5 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors font-medium"
                >
                  <XCircle className="w-4 h-4 inline mr-2" />
                  Reject Quote
                </button>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={() => handleDownload(selectedQuote)}>
                <Download className="w-4 h-4" />
                Download PDF
              </SecondaryButton>
            </div>
          </div>
        </FormModal>
      )}

      {/* ========== APPROVE MODAL ========== */}
      <FormModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Quote"
      >
        <div className="space-y-4">
          <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success-900 dark:text-success-300">
                  Confirm Quote Approval
                </p>
                <p className="text-sm text-success-700 dark:text-success-400 mt-1">
                  By approving this quote, you agree to the terms and pricing.
                  Our team will contact you shortly to arrange payment and
                  pickup.
                </p>
              </div>
            </div>
          </div>

          <FormFooter
            onCancel={() => setShowApproveModal(false)}
            onSubmit={handleApprove}
            submitText="Approve Quote"
            cancelText="Cancel"
          />
        </div>
      </FormModal>

      {/* ========== REJECT MODAL ========== */}
      <FormModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Quote"
      >
        <div className="space-y-4">
          <FormField label="Reason for Rejection" required>
            <FormTextarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejecting this quote..."
              rows={4}
            />
          </FormField>

          <div className="p-4 bg-warning-50 dark:bg-warning-900/30 rounded-lg border border-warning-200 dark:border-warning-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warning-700 dark:text-warning-400">
                Your feedback will help us improve our service and provide
                better quotes in the future.
              </p>
            </div>
          </div>

          <FormFooter
            onCancel={() => setShowRejectModal(false)}
            onSubmit={handleReject}
            submitText="Reject Quote"
            cancelText="Cancel"
          />
        </div>
      </FormModal>

      {/* ========== NEGOTIATE MODAL ========== */}
      <FormModal
        isOpen={showNegotiateModal}
        onClose={() => setShowNegotiateModal(false)}
        title="Negotiate Quote"
      >
        <div className="space-y-4">
          <FormField label="Negotiation Message" required>
            <FormTextarea
              value={negotiationMessage}
              onChange={(e) => setNegotiationMessage(e.target.value)}
              placeholder="Enter your negotiation request, counter-offer, or questions..."
              rows={4}
            />
          </FormField>

          <div className="p-4 bg-info-50 dark:bg-info-900/30 rounded-lg border border-info-200 dark:border-info-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-info-600 dark:text-info-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-info-700 dark:text-info-400">
                Our team will review your request and respond within 24 hours
                with a revised quote or clarification.
              </p>
            </div>
          </div>

          <FormFooter
            onCancel={() => setShowNegotiateModal(false)}
            onSubmit={handleNegotiate}
            submitText="Send Request"
            cancelText="Cancel"
          />
        </div>
      </FormModal>
    </div>
  );
}