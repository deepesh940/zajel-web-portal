import { useState, useMemo, useEffect } from "react";
import {
  Package,
  DollarSign,
  Calculator,
  Send,
  Eye,
  Edit,
  FileText,
  CheckCircle,
  MapPin,
  Calendar,
  Copy,
  BarChart3,
  RefreshCw,
  User,
  MoreVertical,
  Plus,
  Minus,
  MessageSquare,
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
  FormSelect,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface QuoteRequest {
  id: string;
  inquiryNumber: string;
  customerName: string;
  serviceType: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  totalWeight: number;
  totalValue: number;
  itemCount: number;
  status: "Pending Quote" | "Quote Created" | "Quote Sent" | "Quote Approved" | "Under Negotiation";
  quote?: {
    baseRate: number;
    fuelSurcharge: number;
    insuranceFee: number;
    additionalCharges: number;
    discount: number;
    totalAmount: number;
    validUntil: string;
    notes: string;
  };
}

type ViewMode = "grid" | "list" | "table";

export default function PricingQuote() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(
    null
  );
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Quote form state
  const [baseRate, setBaseRate] = useState("");
  const [fuelSurcharge, setFuelSurcharge] = useState("");
  const [insuranceFee, setInsuranceFee] = useState("");
  const [additionalCharges, setAdditionalCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [validityDays, setValidityDays] = useState("7");
  const [quoteNotes, setQuoteNotes] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("inquiryNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [requests, setRequests] = useState<QuoteRequest[]>([
    {
      id: "1",
      inquiryNumber: "INQ-2024-5678",
      customerName: "John Smith",
      serviceType: "Express Delivery",
      pickupLocation: "Business Bay, Dubai",
      deliveryLocation: "Musaffah, Abu Dhabi",
      pickupDate: "2024-01-28",
      totalWeight: 125.5,
      totalValue: 15000,
      itemCount: 3,
      status: "Pending Quote",
    },
    {
      id: "2",
      inquiryNumber: "INQ-2024-5677",
      customerName: "Sarah Ahmed",
      serviceType: "Standard Delivery",
      pickupLocation: "Jebel Ali, Dubai",
      deliveryLocation: "Al Ain Industrial Area",
      pickupDate: "2024-01-29",
      totalWeight: 450.0,
      totalValue: 25000,
      itemCount: 8,
      status: "Quote Created",
      quote: {
        baseRate: 2500.0,
        fuelSurcharge: 150.0,
        insuranceFee: 250.0,
        additionalCharges: 100.0,
        discount: 200.0,
        totalAmount: 2800.0,
        validUntil: "2024-02-03",
        notes: "Standard delivery with insurance coverage",
      },
    },
    {
      id: "3",
      inquiryNumber: "INQ-2024-5676",
      customerName: "Mohammed Ali",
      serviceType: "Express Delivery",
      pickupLocation: "Deira, Dubai",
      deliveryLocation: "Sharjah Industrial Area",
      pickupDate: "2024-01-28",
      totalWeight: 85.0,
      totalValue: 8000,
      itemCount: 2,
      status: "Quote Sent",
      quote: {
        baseRate: 800.0,
        fuelSurcharge: 48.0,
        insuranceFee: 80.0,
        additionalCharges: 50.0,
        discount: 0,
        totalAmount: 978.0,
        validUntil: "2024-02-02",
        notes: "Express delivery with tracking",
      },
    },
    {
      id: "4",
      inquiryNumber: "INQ-2024-5675",
      customerName: "Alex Johnson",
      serviceType: "Same Day Delivery",
      pickupLocation: "DIFC, Dubai",
      deliveryLocation: "Downtown Dubai",
      pickupDate: "2024-01-27",
      totalWeight: 15.0,
      totalValue: 12000,
      itemCount: 1,
      status: "Quote Approved",
      quote: {
        baseRate: 500.0,
        fuelSurcharge: 25.0,
        insuranceFee: 120.0,
        additionalCharges: 75.0,
        discount: 50.0,
        totalAmount: 670.0,
        validUntil: "2024-02-01",
        notes: "Same day delivery - high value item",
      },
    },
    {
      id: "5",
      inquiryNumber: "INQ-2024-5674",
      customerName: "Lisa Wang",
      serviceType: "Standard Delivery",
      pickupLocation: "Al Quoz, Dubai",
      deliveryLocation: "Ras Al Khaimah",
      pickupDate: "2024-01-30",
      totalWeight: 200.0,
      totalValue: 5000,
      itemCount: 5,
      status: "Pending Quote",
    },
  ]);

  // Filter options
  const filterOptions = [
    {
      id: "status",
      label: "Status",
      field: "Status",
      options: [
        "Pending Quote",
        "Quote Created",
        "Quote Sent",
        "Quote Sent",
        "Quote Approved",
        "Under Negotiation",
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
  ];

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        searchQuery === "" ||
        request.inquiryNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.serviceType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = filters.every((filter) => {
        if (filter.field === "Status") {
          return filter.values.includes(request.status);
        } else if (filter.field === "Service Type") {
          return filter.values.includes(request.serviceType);
        }
        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [requests, searchQuery, filters]);

  // Calculate paginated data
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Pending Quote":
        return "warning";
      case "Quote Created":
        return "info";
      case "Quote Sent":
        return "info";
      case "Quote Approved":
        return "success";
      case "Under Negotiation":
        return "warning";
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

  const calculateTotal = () => {
    const base = parseFloat(baseRate) || 0;
    const fuel = parseFloat(fuelSurcharge) || 0;
    const insurance = parseFloat(insuranceFee) || 0;
    const additional = parseFloat(additionalCharges) || 0;
    const disc = parseFloat(discount) || 0;
    return base + fuel + insurance + additional - disc;
  };

  const handleCreateQuote = (request: QuoteRequest) => {
    setSelectedRequest(request);
    // Auto-calculate base rate based on weight and distance
    const suggestedBaseRate = (request.totalWeight * 5).toFixed(2);
    const suggestedFuel = (parseFloat(suggestedBaseRate) * 0.06).toFixed(2);
    const suggestedInsurance = (request.totalValue * 0.01).toFixed(2);

    setBaseRate(suggestedBaseRate);
    setFuelSurcharge(suggestedFuel);
    setInsuranceFee(suggestedInsurance);
    setAdditionalCharges("0");
    setDiscount("0");
    setValidityDays("7");
    setQuoteNotes("");
    setShowQuoteModal(true);
    setOpenActionMenuId(null);
  };

  const handleSaveQuote = () => {
    if (!baseRate || parseFloat(baseRate) <= 0) {
      toast.error("Please enter a valid base rate");
      return;
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + parseInt(validityDays));

    const newQuote = {
      baseRate: parseFloat(baseRate),
      fuelSurcharge: parseFloat(fuelSurcharge) || 0,
      insuranceFee: parseFloat(insuranceFee) || 0,
      additionalCharges: parseFloat(additionalCharges) || 0,
      discount: parseFloat(discount) || 0,
      totalAmount: calculateTotal(),
      validUntil: validUntil.toISOString().split("T")[0],
      notes: quoteNotes,
    };

    if (selectedRequest) {
      setRequests(
        requests.map((r) =>
          r.id === selectedRequest.id
            ? { ...r, status: "Quote Created", quote: newQuote }
            : r
        )
      );
      toast.success("Quote created successfully");
    }
    setShowQuoteModal(false);
  };

  const handleSendQuote = (request: QuoteRequest) => {
    setRequests(
      requests.map((r) =>
        r.id === request.id ? { ...r, status: "Quote Sent" } : r
      )
    );
    toast.success("Quote sent to customer");
    setOpenActionMenuId(null);
  };


  const handleNegotiate = (request: QuoteRequest) => {
    setRequests(
      requests.map((r) =>
        r.id === request.id ? { ...r, status: "Under Negotiation" } : r
      )
    );
    toast.success("Quote moved to negotiation");
    setOpenActionMenuId(null);
  };

  const handleViewDetails = (request: QuoteRequest) => {
    setSelectedRequest(request);
    setShowViewModal(true);
    setOpenActionMenuId(null);
  };

  const handleCopyInquiryNumber = (inquiryNumber: string) => {
    navigator.clipboard.writeText(inquiryNumber);
    toast.success("Inquiry number copied!");
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleSubmitNewQuote = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("New quote created successfully!");
    setShowAddModal(false);
  };

  // Summary widgets
  const stats = [
    {
      label: "Total Requests",
      value: requests.length.toString(),
      icon: "FileText",
      subtitle: "All requests",
    },
    {
      label: "Pending Quote",
      value: requests
        .filter((r) => r.status === "Pending Quote")
        .length.toString(),
      icon: "Calculator",
      subtitle: "Awaiting pricing",
    },
    {
      label: "Quote Sent",
      value: requests
        .filter((r) => r.status === "Quote Sent")
        .length.toString(),
      icon: "Send",
      subtitle: "Sent to customer",
    },
    {
      label: "Approved",
      value: requests
        .filter((r) => r.status === "Quote Approved")
        .length.toString(),
      icon: "CheckCircle",
      subtitle: "Quote approved",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Pricing & Quote"
          subtitle="Create and manage pricing quotes for customer inquiries"
          breadcrumbs={[
            { label: "Operations", href: "#" },
            { label: "Pricing & Quote", current: true },
          ]}
          primaryAction={{
            label: "Create Quote",
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
              activeFilterCount={
                filters.filter((f) => f.values.length > 0).length
              }
              placeholder="Search quote requests..."
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
              {paginatedRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {request.inquiryNumber}
                        </h3>
                        <button
                          onClick={() =>
                            handleCopyInquiryNumber(request.inquiryNumber)
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
                            {request.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {request.pickupLocation} → {request.deliveryLocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Pickup: {request.pickupDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {request.quote ? (
                          <div className="text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Quote Amount:{" "}
                            </span>
                            <span className="font-semibold text-primary-600 dark:text-primary-400">
                              AED {request.quote.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <span className="text-neutral-400">
                              Not quoted yet
                            </span>
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Items:{" "}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {request.itemCount}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Weight:{" "}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {request.totalWeight} kg
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Service:{" "}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {request.serviceType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(request.status)}

                      <div className="relative ml-2">
                        <button
                          onClick={() =>
                            setOpenActionMenuId(
                              openActionMenuId === request.id ? null : request.id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === request.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            {request.status === "Pending Quote" && (
                              <button
                                onClick={() => handleCreateQuote(request)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Calculator className="w-4 h-4" />
                                Create Quote
                              </button>
                            )}
                            {request.status === "Quote Created" && (
                              <>
                                <button
                                  onClick={() => handleCreateQuote(request)}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Quote
                                </button>
                                <button
                                  onClick={() => handleSendQuote(request)}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Send className="w-4 h-4" />
                                  Send Quote
                                </button>

                              </>
                            )}
                            {request.status === "Quote Sent" && (
                              <button
                                onClick={() => handleNegotiate(request)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Negotiate
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleCopyInquiryNumber(request.inquiryNumber);
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
              {paginatedRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {request.inquiryNumber}
                        </h3>
                        <button
                          onClick={() =>
                            handleCopyInquiryNumber(request.inquiryNumber)
                          }
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors flex-shrink-0"
                          title="Copy inquiry number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {getStatusBadge(request.status)}

                        {/* Three-dot menu beside status badge */}
                        <div className="relative ml-auto">
                          <button
                            onClick={() =>
                              setOpenActionMenuId(
                                openActionMenuId === request.id ? null : request.id
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openActionMenuId === request.id && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                              <button
                                onClick={() => {
                                  handleViewDetails(request);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              {request.status === "Pending Quote" && (
                                <button
                                  onClick={() => {
                                    handleCreateQuote(request);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Calculator className="w-4 h-4" />
                                  Create Quote
                                </button>
                              )}
                              {request.status === "Quote Created" && (
                                <>
                                  <button
                                    onClick={() => {
                                      handleCreateQuote(request);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit Quote
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleSendQuote(request);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <Send className="w-4 h-4" />
                                    Send Quote
                                  </button>

                                </>
                              )}
                              {request.status === "Quote Sent" && (
                                <button
                                  onClick={() => {
                                    handleNegotiate(request);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Negotiate
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleCopyInquiryNumber(request.inquiryNumber);
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
                      <span className="truncate">{request.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {request.pickupLocation} → {request.deliveryLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>Pickup: {request.pickupDate}</span>
                    </div>
                  </div>

                  {request.quote ? (
                    <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-3 mb-4">
                      <p className="text-xs text-primary-700 dark:text-primary-400 mb-1">
                        Quote Amount
                      </p>
                      <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        AED {request.quote.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-neutral-50 dark:bg-neutral-950 rounded-lg p-3 mb-4">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Quote not created yet
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Items
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {request.itemCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Weight
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {request.totalWeight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Value
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {request.totalValue.toLocaleString()}
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
                        Route
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Quote Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {request.inquiryNumber}
                            </span>
                            <button
                              onClick={() =>
                                handleCopyInquiryNumber(request.inquiryNumber)
                              }
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                              title="Copy inquiry number"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                          {request.customerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                          {request.serviceType}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="max-w-[200px] truncate">
                            {request.pickupLocation} → {request.deliveryLocation}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {request.quote ? (
                            <span className="font-semibold text-neutral-900 dark:text-white">
                              AED {request.quote.totalAmount.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-neutral-400">Not quoted</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenActionMenuId(
                                  openActionMenuId === request.id ? null : request.id
                                )
                              }
                              className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === request.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={() => {
                                    handleViewDetails(request);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                {request.status === "Pending Quote" && (
                                  <button
                                    onClick={() => {
                                      handleCreateQuote(request);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <Calculator className="w-4 h-4" />
                                    Create Quote
                                  </button>
                                )}
                                {request.status === "Quote Created" && (
                                  <>
                                    <button
                                      onClick={() => {
                                        handleCreateQuote(request);
                                        setOpenActionMenuId(null);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                    >
                                      <Edit className="w-4 h-4" />
                                      Edit Quote
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleSendQuote(request);
                                        setOpenActionMenuId(null);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                    >
                                      <Send className="w-4 h-4" />
                                      Send Quote
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => {
                                    handleCopyInquiryNumber(request.inquiryNumber);
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

          {paginatedRequests.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                No quote requests found
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* ========== PAGINATION ========== */}
        {filteredRequests.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRequests.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredRequests.length}
          />
        )}
      </div>

      {/* ========== CREATE/EDIT QUOTE MODAL ========== */}
      {selectedRequest && (
        <FormModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          title={
            selectedRequest.quote ? "Edit Quote" : "Create Quote"
          }
          description={`${selectedRequest.inquiryNumber} - ${selectedRequest.customerName}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Shipment Summary */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Shipment Details
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Weight
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRequest.totalWeight} kg
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Value
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    AED {selectedRequest.totalValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Items
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRequest.itemCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Service
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRequest.serviceType}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Calculator */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Price Calculator
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel htmlFor="baseRate" required>
                      Base Rate (AED)
                    </FormLabel>
                    <FormInput
                      id="baseRate"
                      type="number"
                      step="0.01"
                      value={baseRate}
                      onChange={(e) => setBaseRate(e.target.value)}
                      placeholder="0.00"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="fuelSurcharge">
                      Fuel Surcharge (AED)
                    </FormLabel>
                    <FormInput
                      id="fuelSurcharge"
                      type="number"
                      step="0.01"
                      value={fuelSurcharge}
                      onChange={(e) => setFuelSurcharge(e.target.value)}
                      placeholder="0.00"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="insuranceFee">
                      Insurance Fee (AED)
                    </FormLabel>
                    <FormInput
                      id="insuranceFee"
                      type="number"
                      step="0.01"
                      value={insuranceFee}
                      onChange={(e) => setInsuranceFee(e.target.value)}
                      placeholder="0.00"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="additionalCharges">
                      Additional Charges (AED)
                    </FormLabel>
                    <FormInput
                      id="additionalCharges"
                      type="number"
                      step="0.01"
                      value={additionalCharges}
                      onChange={(e) => setAdditionalCharges(e.target.value)}
                      placeholder="0.00"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="discount">Discount (AED)</FormLabel>
                    <FormInput
                      id="discount"
                      type="number"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="0.00"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="validityDays">
                      Validity (Days)
                    </FormLabel>
                    <FormSelect
                      id="validityDays"
                      value={validityDays}
                      onChange={(e) => setValidityDays(e.target.value)}
                    >
                      <option value="3">3 Days</option>
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days</option>
                    </FormSelect>
                  </FormField>
                </div>

                <FormField>
                  <FormLabel htmlFor="quoteNotes">Notes (Optional)</FormLabel>
                  <FormTextarea
                    id="quoteNotes"
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="Add any special notes or conditions..."
                    rows={3}
                  />
                </FormField>

                {/* Total */}
                <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary-900 dark:text-primary-300">
                      Total Quote Amount
                    </span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      AED {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowQuoteModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleSaveQuote}>
              {selectedRequest.quote ? "Update Quote" : "Create Quote"}
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      )}

      {/* ========== VIEW DETAILS MODAL ========== */}
      {showViewModal && selectedRequest && (
        <FormModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title={`Quote Details - ${selectedRequest.inquiryNumber}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Customer Info */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Customer Information
              </h4>
              <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Name
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRequest.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Service Type
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRequest.serviceType}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Route Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Pickup:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedRequest.pickupLocation}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Delivery:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedRequest.deliveryLocation}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Pickup Date:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedRequest.pickupDate}
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
                      {selectedRequest.itemCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Total Weight:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {selectedRequest.totalWeight} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Total Value:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      AED {selectedRequest.totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Details */}
            {selectedRequest.quote && (
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Quote Breakdown
                </h4>
                <div className="space-y-2 p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Base Rate
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      AED {selectedRequest.quote.baseRate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Fuel Surcharge
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      AED{" "}
                      {selectedRequest.quote.fuelSurcharge.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Insurance Fee
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      AED {selectedRequest.quote.insuranceFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Additional Charges
                    </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      AED{" "}
                      {selectedRequest.quote.additionalCharges.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Discount
                    </span>
                    <span className="text-error-600 dark:text-error-400 font-medium">
                      - AED {selectedRequest.quote.discount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <span className="text-neutral-900 dark:text-white">
                      Total Amount
                    </span>
                    <span className="text-primary-600 dark:text-primary-400">
                      AED{" "}
                      {selectedRequest.quote.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 pt-2">
                    Valid until: {selectedRequest.quote.validUntil}
                  </div>
                </div>
                {selectedRequest.quote.notes && (
                  <div className="mt-3 p-3 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                    <p className="text-xs font-medium text-info-900 dark:text-info-300 mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-info-700 dark:text-info-400">
                      {selectedRequest.quote.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowViewModal(false)}>
              Close
            </SecondaryButton>
          </FormFooter>
        </FormModal>
      )}

      {/* ========== ADD QUOTE MODAL ========== */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Quote"
        description="Generate a pricing quote for a shipment inquiry"
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmitNewQuote}>
          <div className="space-y-6">
            {/* Inquiry Reference */}
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                Inquiry Reference
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
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="distance" required>Distance (km)</FormLabel>
                  <FormInput id="distance" type="number" required placeholder="0" step="0.1" min="0" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="weight" required>Weight (kg)</FormLabel>
                  <FormInput id="weight" type="number" required placeholder="0.0" step="0.1" min="0" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="value" required>Cargo Value (AED)</FormLabel>
                  <FormInput id="value" type="number" required placeholder="0.00" step="0.01" min="0" />
                </FormField>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                Pricing Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="baseRate" required>Base Rate (AED)</FormLabel>
                  <FormInput id="baseRate" type="number" required placeholder="0.00" step="0.01" min="0" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="fuelSurcharge" required>Fuel Surcharge (AED)</FormLabel>
                  <FormInput id="fuelSurcharge" type="number" required placeholder="0.00" step="0.01" min="0" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="insurance" required>Insurance Fee (AED)</FormLabel>
                  <FormInput id="insurance" type="number" required placeholder="0.00" step="0.01" min="0" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="additionalCharges">Additional Charges (AED)</FormLabel>
                  <FormInput id="additionalCharges" type="number" placeholder="0.00" step="0.01" min="0" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="discount">Discount (AED)</FormLabel>
                  <FormInput id="discount" type="number" placeholder="0.00" step="0.01" min="0" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="validUntil" required>Valid Until</FormLabel>
                  <FormInput id="validUntil" type="date" required />
                </FormField>
              </div>
            </div>

            {/* Notes */}
            <FormField>
              <FormLabel htmlFor="notes">Quote Notes</FormLabel>
              <FormTextarea
                id="notes"
                placeholder="Special terms, conditions, or additional information..."
                rows={3}
              />
            </FormField>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowAddModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit">
              Create Quote
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}