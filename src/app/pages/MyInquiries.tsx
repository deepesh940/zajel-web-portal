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
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface Inquiry {
  id: string;
  inquiryNumber: string;
  status:
    | "Draft"
    | "Submitted"
    | "Quote Sent"
    | "Quote Approved"
    | "Quote Rejected"
    | "Cancelled"
    | "Completed";
  serviceType: string;
  from: string;
  to: string;
  pickupDate: string;
  totalWeight: number;
  totalValue: number;
  itemCount: number;
  submittedDate: string;
  quoteAmount?: number;
  quoteValidUntil?: string;
}

type ViewMode = "grid" | "list" | "table";

export default function MyInquiries() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

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
      status: "Quote Sent",
      serviceType: "Express Delivery",
      from: "Dubai, UAE",
      to: "Abu Dhabi, UAE",
      pickupDate: "2024-01-28",
      totalWeight: 125.5,
      totalValue: 15000,
      itemCount: 8,
      submittedDate: "2024-01-27",
      quoteAmount: 850,
      quoteValidUntil: "2024-01-30",
    },
    {
      id: "2",
      inquiryNumber: "INQ-2024-5677",
      status: "Submitted",
      serviceType: "Standard Delivery",
      from: "Sharjah, UAE",
      to: "Dubai, UAE",
      pickupDate: "2024-01-29",
      totalWeight: 45.2,
      totalValue: 5200,
      itemCount: 3,
      submittedDate: "2024-01-27",
    },
    {
      id: "3",
      inquiryNumber: "INQ-2024-5676",
      status: "Quote Approved",
      serviceType: "Same Day Delivery",
      from: "Dubai, UAE",
      to: "Ajman, UAE",
      pickupDate: "2024-01-27",
      totalWeight: 20.0,
      totalValue: 2500,
      itemCount: 2,
      submittedDate: "2024-01-26",
      quoteAmount: 450,
    },
    {
      id: "4",
      inquiryNumber: "INQ-2024-5675",
      status: "Completed",
      serviceType: "Standard Delivery",
      from: "Dubai, UAE",
      to: "Al Ain, UAE",
      pickupDate: "2024-01-20",
      totalWeight: 85.0,
      totalValue: 8900,
      itemCount: 5,
      submittedDate: "2024-01-19",
      quoteAmount: 620,
    },
    {
      id: "5",
      inquiryNumber: "INQ-2024-5674",
      status: "Draft",
      serviceType: "Express Delivery",
      from: "Dubai, UAE",
      to: "Ras Al Khaimah, UAE",
      pickupDate: "2024-01-30",
      totalWeight: 60.0,
      totalValue: 7200,
      itemCount: 4,
      submittedDate: "2024-01-26",
    },
    {
      id: "6",
      inquiryNumber: "INQ-2024-5673",
      status: "Quote Rejected",
      serviceType: "Standard Delivery",
      from: "Abu Dhabi, UAE",
      to: "Dubai, UAE",
      pickupDate: "2024-01-25",
      totalWeight: 110.5,
      totalValue: 12000,
      itemCount: 7,
      submittedDate: "2024-01-24",
      quoteAmount: 780,
    },
  ]);

  // Filter options for AdvancedSearchPanel
  const filterOptions = {
    Status: [
      "Draft",
      "Submitted",
      "Quote Sent",
      "Quote Approved",
      "Quote Rejected",
      "Completed",
      "Cancelled",
    ],
    "Service Type": ["Express Delivery", "Standard Delivery", "Same Day Delivery"],
    Location: ["Dubai, UAE", "Abu Dhabi, UAE", "Sharjah, UAE", "Ajman, UAE", "Al Ain, UAE", "Ras Al Khaimah, UAE"],
  };

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const matchesSearch =
        searchQuery === "" ||
        inquiry.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.to.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply advanced filters
      const matchesFilters = filters.every((filter) => {
        if (filter.field === "Status") {
          return filter.values.includes(inquiry.status);
        } else if (filter.field === "Service Type") {
          return filter.values.includes(inquiry.serviceType);
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

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case "Draft":
        return 'neutral';
      case "Submitted":
        return 'info';
      case "Quote Sent":
        return 'warning';
      case "Quote Approved":
      case "Completed":
        return 'success';
      case "Quote Rejected":
      case "Cancelled":
        return 'error';
      default:
        return 'neutral';
    }
  };

  // Status badge component following design guidelines
  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${
          getStatusColor(status) === 'success' ? 'bg-success-500' :
          getStatusColor(status) === 'warning' ? 'bg-warning-500' :
          getStatusColor(status) === 'error' ? 'bg-error-500' :
          getStatusColor(status) === 'info' ? 'bg-info-500' :
          'bg-neutral-400'
        }`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <FileText className="w-4 h-4" />;
      case "Submitted":
        return <Clock className="w-4 h-4" />;
      case "Quote Sent":
        return <AlertCircle className="w-4 h-4" />;
      case "Quote Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Quote Rejected":
        return <XCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailsModal(true);
  };

  const handleCancelInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (selectedInquiry) {
      setInquiries(
        inquiries.map((inq) =>
          inq.id === selectedInquiry.id ? { ...inq, status: "Cancelled" } : inq
        )
      );
      toast.success(`Inquiry ${selectedInquiry.inquiryNumber} cancelled`);
    }
    setShowCancelModal(false);
  };

  const handleCopyInquiryNumber = (inquiryNumber: string) => {
    navigator.clipboard.writeText(inquiryNumber);
    toast.success("Inquiry number copied to clipboard");
  };

  const handleDownloadInquiry = (inquiry: Inquiry) => {
    toast.success(`Downloading inquiry ${inquiry.inquiryNumber}`);
  };

  const stats = [
    {
      label: "Total Inquiries",
      value: inquiries.length.toString(),
      icon: "Package",
      trend: "+12",
      trendDirection: "up" as const,
      subtitle: "from last month",
    },
    {
      label: "Pending Quotes",
      value: inquiries
        .filter((i) => i.status === "Submitted" || i.status === "Quote Sent")
        .length.toString(),
      icon: "Clock",
      subtitle: "Awaiting response",
    },
    {
      label: "Approved",
      value: inquiries.filter((i) => i.status === "Quote Approved").length.toString(),
      icon: "CheckCircle",
      trend: "+5",
      trendDirection: "up" as const,
      subtitle: "this week",
    },
    {
      label: "Completed",
      value: inquiries.filter((i) => i.status === "Completed").length.toString(),
      icon: "TrendingUp",
      subtitle: "All delivered",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="My Inquiries"
          subtitle="Track and manage your shipment inquiries"
          breadcrumbs={[
            { label: "Customer Portal", href: "#" },
            { label: "My Inquiries", current: true },
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
              { value: "inquiryNumber", label: "Inquiry Number (A-Z)", direction: "asc" },
              { value: "inquiryNumber", label: "Inquiry Number (Z-A)", direction: "desc" },
              { value: "submittedDate", label: "Date (Newest)", direction: "desc" },
              { value: "submittedDate", label: "Date (Oldest)", direction: "asc" },
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

          <PrimaryButton icon={Plus} onClick={() => {
            // Trigger navigation to create-shipment-inquiry page
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'create-shipment-inquiry' }));
          }}>
            New Inquiry
          </PrimaryButton>

          <IconButton
            icon={BarChart3}
            onClick={() => setShowSummary(!showSummary)}
            title="Toggle summary"
            active={showSummary}
          />

          <IconButton icon={RefreshCw} onClick={() => toast.success("Refreshed")} title="Refresh" />

          <ViewModeSwitcher currentMode={viewMode} onChange={setViewMode} />
        </PageHeader>

        {/* ========== FILTER CHIPS ========== */}
        {filters.some((f) => f.values.length > 0) && (
          <FilterChips 
            filters={filters} 
            onRemove={(filterId) => {
              setFilters(filters.filter(f => f.id !== filterId));
            }}
            onClearAll={() => setFilters([])}
          />
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && (
          <SummaryWidgets widgets={stats} />
        )}

        {/* ========== CONTENT AREA ========== */}
        <div className="space-y-4">
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {inquiry.inquiryNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyInquiryNumber(inquiry.inquiryNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy inquiry number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {getStatusBadge(inquiry.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
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
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Truck className="w-4 h-4 flex-shrink-0" />
                          <span>{inquiry.serviceType}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">Items: </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {inquiry.itemCount}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">Weight: </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {inquiry.totalWeight} kg
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">Value: </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            AED {inquiry.totalValue.toLocaleString()}
                          </span>
                        </div>
                        {inquiry.quoteAmount && (
                          <div className="text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">Quote: </span>
                            <span className="font-semibold text-primary-600 dark:text-primary-400">
                              AED {inquiry.quoteAmount.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {inquiry.quoteValidUntil && inquiry.status === "Quote Sent" && (
                        <div className="mt-3 p-2 bg-warning-50 dark:bg-warning-900/30 rounded text-sm text-warning-700 dark:text-warning-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Quote valid until {inquiry.quoteValidUntil}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions - 3-dot menu */}
                    <div className="relative ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionMenuId(openActionMenuId === inquiry.id ? null : inquiry.id);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown menu */}
                      {openActionMenuId === inquiry.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(inquiry);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          
                          {inquiry.status === "Quote Sent" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.info("Review Quote");
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Review Quote
                            </button>
                          )}
                          
                          {inquiry.status === "Draft" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.info("Edit inquiry");
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyInquiryNumber(inquiry.inquiryNumber);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Inquiry Number
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadInquiry(inquiry);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
                          </button>
                          
                          {(inquiry.status === "Draft" ||
                            inquiry.status === "Submitted" ||
                            inquiry.status === "Quote Sent") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelInquiry(inquiry);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Cancel Inquiry
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

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(inquiry)}
                >
                  {/* Top Row: Inquiry Number on left, Status Badge + 3-dot menu on right */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {inquiry.inquiryNumber}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(inquiry.status)}
                      
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === inquiry.id ? null : inquiry.id);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown menu */}
                        {openActionMenuId === inquiry.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(inquiry);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            
                            {inquiry.status === "Quote Sent" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.info("Review Quote");
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Review Quote
                              </button>
                            )}
                            
                            {inquiry.status === "Draft" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.info("Edit inquiry");
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInquiryNumber(inquiry.inquiryNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Inquiry Number
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadInquiry(inquiry);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </button>
                            
                            {(inquiry.status === "Draft" ||
                              inquiry.status === "Submitted" ||
                              inquiry.status === "Quote Sent") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelInquiry(inquiry);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Cancel Inquiry
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {inquiry.from} → {inquiry.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{inquiry.pickupDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      <span>{inquiry.serviceType}</span>
                    </div>
                  </div>

                  {inquiry.quoteAmount && (
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                      <div className="text-xs text-primary-700 dark:text-primary-400 mb-1">
                        Quote Amount
                      </div>
                      <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        AED {inquiry.quoteAmount.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

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
                        Route
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Pickup Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Quote
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedInquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer relative"
                        onClick={() => handleViewDetails(inquiry)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {inquiry.inquiryNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInquiryNumber(inquiry.inquiryNumber);
                              }}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(inquiry.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {inquiry.from} → {inquiry.to}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {inquiry.serviceType}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {inquiry.pickupDate}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {inquiry.quoteAmount ? (
                            <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                              AED {inquiry.quoteAmount.toLocaleString()}
                            </div>
                          ) : (
                            <div className="text-sm text-neutral-400 dark:text-neutral-600">—</div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(openActionMenuId === inquiry.id ? null : inquiry.id);
                              }}
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors ml-auto"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown menu */}
                            {openActionMenuId === inquiry.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(inquiry);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                
                                {inquiry.status === "Quote Sent" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.info("Review Quote");
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Review Quote
                                  </button>
                                )}
                                
                                {inquiry.status === "Draft" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.info("Edit inquiry");
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                  </button>
                                )}
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyInquiryNumber(inquiry.inquiryNumber);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Inquiry Number
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadInquiry(inquiry);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download PDF
                                </button>
                                
                                {(inquiry.status === "Draft" ||
                                  inquiry.status === "Submitted" ||
                                  inquiry.status === "Quote Sent") && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelInquiry(inquiry);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel Inquiry
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
          {filteredInquiries.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No inquiries found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.length > 0
                    ? "Try adjusting your search or filters"
                    : "You haven't created any inquiries yet"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredInquiries.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredInquiries.length / itemsPerPage)}
              totalItems={filteredInquiries.length}
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
          title={`Inquiry Details - ${selectedInquiry?.inquiryNumber}`}
          maxWidth="max-w-3xl"
        >
          {selectedInquiry && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                {getStatusBadge(selectedInquiry.status)}
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Submitted on {selectedInquiry.submittedDate}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Service Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Service Type:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedInquiry.serviceType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Pickup Date:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedInquiry.pickupDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">From:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedInquiry.from}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">To:</span>
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
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Total Items:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedInquiry.itemCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Total Weight:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedInquiry.totalWeight} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Declared Value:
                      </span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        AED {selectedInquiry.totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedInquiry.quoteAmount && (
                  <div className="md:col-span-2">
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                      <h4 className="text-sm font-semibold text-primary-900 dark:text-primary-300 mb-3">
                        Quote Information
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            AED {selectedInquiry.quoteAmount.toLocaleString()}
                          </p>
                          {selectedInquiry.quoteValidUntil && (
                            <p className="text-xs text-primary-700 dark:text-primary-400 mt-1">
                              Valid until {selectedInquiry.quoteValidUntil}
                            </p>
                          )}
                        </div>
                        {selectedInquiry.status === "Quote Sent" && (
                          <button className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors">
                            Review Quote
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <FormFooter>
            <SecondaryButton onClick={() => setShowDetailsModal(false)}>Close</SecondaryButton>
            {selectedInquiry?.quoteAmount && (
              <PrimaryButton
                icon={Download}
                onClick={() => selectedInquiry && handleDownloadInquiry(selectedInquiry)}
              >
                Download PDF
              </PrimaryButton>
            )}
          </FormFooter>
        </FormModal>

        {/* Cancel Confirmation Modal */}
        <FormModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Inquiry"
          description={`Are you sure you want to cancel inquiry ${selectedInquiry?.inquiryNumber}?`}
          maxWidth="max-w-md"
        >
          <div className="p-4 bg-warning-50 dark:bg-warning-900/30 rounded-lg border border-warning-200 dark:border-warning-800 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning-900 dark:text-warning-300">
                  Warning
                </p>
                <p className="text-sm text-warning-700 dark:text-warning-400 mt-1">
                  This action cannot be undone. You will need to create a new inquiry if you change
                  your mind.
                </p>
              </div>
            </div>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowCancelModal(false)}>
              Keep Inquiry
            </SecondaryButton>
            <button
              onClick={confirmCancel}
              className="px-4 py-2 text-sm text-white bg-error-500 hover:bg-error-600 rounded-lg transition-colors"
            >
              Cancel Inquiry
            </button>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}