import { useState } from "react";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  Truck,
  Clock,
  Download,
  CreditCard,
  AlertCircle,
  FileText,
  Send,
  MoreVertical,
  Copy,
  BarChart3,
  RefreshCw,
  Banknote,
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

interface DriverPayable {
  id: string;
  payableNumber: string;
  driverName: string;
  driverID: string;
  tripCount: number;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  period: string;
  status: "Pending" | "Approved" | "Paid" | "Rejected" | "On Hold";
  trips: {
    tripNumber: string;
    date: string;
    route: string;
    amount: number;
  }[];
  paymentMethod: "Bank Transfer" | "Cash" | "Check" | "Wallet";
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    iban: string;
  };
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  notes?: string;
}

type ViewMode = "grid" | "list" | "table";

export default function DriverPayables() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayable, setSelectedPayable] = useState<DriverPayable | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("period");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [payables, setPayables] = useState<DriverPayable[]>([
    {
      id: "1",
      payableNumber: "PAY-2024-0045",
      driverName: "Khalid Saeed",
      driverID: "DRV-001",
      tripCount: 12,
      totalAmount: 4850.0,
      advanceAmount: 1000.0,
      balanceAmount: 3850.0,
      period: "2024-01-15 to 2024-01-21",
      status: "Pending",
      trips: [
        {
          tripNumber: "TRP-2024-001",
          date: "2024-01-15",
          route: "Dubai to Abu Dhabi",
          amount: 450.0,
        },
        {
          tripNumber: "TRP-2024-005",
          date: "2024-01-16",
          route: "Sharjah to Al Ain",
          amount: 380.0,
        },
        {
          tripNumber: "TRP-2024-012",
          date: "2024-01-17",
          route: "Dubai to Fujairah",
          amount: 520.0,
        },
      ],
      paymentMethod: "Bank Transfer",
      bankDetails: {
        bankName: "Emirates NBD",
        accountNumber: "1234567890",
        iban: "AE070331234567890123456",
      },
    },
    {
      id: "2",
      payableNumber: "PAY-2024-0044",
      driverName: "Ahmed Al Maktoum",
      driverID: "DRV-002",
      tripCount: 15,
      totalAmount: 5670.0,
      advanceAmount: 2000.0,
      balanceAmount: 3670.0,
      period: "2024-01-15 to 2024-01-21",
      status: "Approved",
      trips: [
        {
          tripNumber: "TRP-2024-002",
          date: "2024-01-15",
          route: "Deira to Sharjah",
          amount: 320.0,
        },
        {
          tripNumber: "TRP-2024-008",
          date: "2024-01-16",
          route: "Business Bay to Musaffah",
          amount: 410.0,
        },
      ],
      paymentMethod: "Bank Transfer",
      bankDetails: {
        bankName: "Abu Dhabi Commercial Bank",
        accountNumber: "9876543210",
        iban: "AE070221234567890123456",
      },
      approvedBy: "Finance Manager",
      approvedDate: "2024-01-22",
    },
    {
      id: "3",
      payableNumber: "PAY-2024-0043",
      driverName: "Mohammed Hassan",
      driverID: "DRV-003",
      tripCount: 10,
      totalAmount: 3920.0,
      advanceAmount: 0,
      balanceAmount: 3920.0,
      period: "2024-01-15 to 2024-01-21",
      status: "Paid",
      trips: [
        {
          tripNumber: "TRP-2024-003",
          date: "2024-01-15",
          route: "Al Quoz to RAK",
          amount: 480.0,
        },
      ],
      paymentMethod: "Bank Transfer",
      bankDetails: {
        bankName: "Mashreq Bank",
        accountNumber: "5555666677",
        iban: "AE070441234567890123456",
      },
      approvedBy: "Finance Manager",
      approvedDate: "2024-01-20",
      paidDate: "2024-01-22",
    },
    {
      id: "4",
      payableNumber: "PAY-2024-0042",
      driverName: "Youssef Ali",
      driverID: "DRV-004",
      tripCount: 8,
      totalAmount: 3210.0,
      advanceAmount: 500.0,
      balanceAmount: 2710.0,
      period: "2024-01-08 to 2024-01-14",
      status: "On Hold",
      trips: [
        {
          tripNumber: "TRP-2024-020",
          date: "2024-01-08",
          route: "Dubai Marina to Ajman",
          amount: 350.0,
        },
      ],
      paymentMethod: "Bank Transfer",
      notes: "Pending documentation verification",
    },
    {
      id: "5",
      payableNumber: "PAY-2024-0041",
      driverName: "Salem Ahmed",
      driverID: "DRV-005",
      tripCount: 6,
      totalAmount: 2450.0,
      advanceAmount: 1000.0,
      balanceAmount: 1450.0,
      period: "2024-01-08 to 2024-01-14",
      status: "Rejected",
      trips: [
        {
          tripNumber: "TRP-2024-025",
          date: "2024-01-10",
          route: "DIFC to Downtown",
          amount: 280.0,
        },
      ],
      paymentMethod: "Cash",
      notes: "Trip logs incomplete - rejected for review",
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
        { value: "Pending", label: "Pending" },
        { value: "Approved", label: "Approved" },
        { value: "Paid", label: "Paid" },
        { value: "Rejected", label: "Rejected" },
        { value: "On Hold", label: "On Hold" },
      ],
    },
    {
      id: "paymentMethod",
      label: "Payment Method",
      type: "select",
      values: [],
      options: [
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "Cash", label: "Cash" },
        { value: "Check", label: "Check" },
        { value: "Wallet", label: "Wallet" },
      ],
    },
  ];

  // Apply filters
  const filteredPayables = payables.filter((payable) => {
    const matchesSearch =
      payable.payableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payable.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payable.driverID.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(payable.status);

    const paymentMethodFilter = filters.find((f) => f.id === "paymentMethod");
    const matchesPaymentMethod =
      !paymentMethodFilter || paymentMethodFilter.values.length === 0 || paymentMethodFilter.values.includes(payable.paymentMethod);

    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  // Apply sorting
  const sortedPayables = [...filteredPayables].sort((a, b) => {
    let comparison = 0;
    if (sortField === "period") {
      comparison = a.period.localeCompare(b.period);
    } else if (sortField === "payableNumber") {
      comparison = a.payableNumber.localeCompare(b.payableNumber);
    } else if (sortField === "driverName") {
      comparison = a.driverName.localeCompare(b.driverName);
    } else if (sortField === "totalAmount") {
      comparison = a.totalAmount - b.totalAmount;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPayables.length / itemsPerPage);
  const paginatedPayables = sortedPayables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Paid":
        return "success";
      case "Approved":
        return "info";
      case "Pending":
        return "warning";
      case "Rejected":
        return "error";
      case "On Hold":
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
            : getStatusColor(status) === "info"
              ? "bg-info-500"
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

  const handleViewDetails = (payable: DriverPayable) => {
    setSelectedPayable(payable);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleApprove = (payable: DriverPayable) => {
    setSelectedPayable(payable);
    setApprovalNotes("");
    setShowApproveModal(true);
    setOpenActionMenuId(null);
  };

  const confirmApprove = () => {
    if (selectedPayable) {
      setPayables(
        payables.map((p) =>
          p.id === selectedPayable.id
            ? {
              ...p,
              status: "Approved",
              approvedBy: "Finance Manager",
              approvedDate: new Date().toISOString().split("T")[0],
            }
            : p
        )
      );
      toast.success(`Payable ${selectedPayable.payableNumber} approved`);
    }
    setShowApproveModal(false);
  };

  const handlePay = (payable: DriverPayable) => {
    setSelectedPayable(payable);
    setShowPayModal(true);
    setOpenActionMenuId(null);
  };

  const confirmPay = () => {
    if (selectedPayable) {
      setPayables(
        payables.map((p) =>
          p.id === selectedPayable.id
            ? {
              ...p,
              status: "Paid",
              paidDate: new Date().toISOString().split("T")[0],
            }
            : p
        )
      );
      toast.success(`Payment processed for ${selectedPayable.payableNumber}`);
    }
    setShowPayModal(false);
  };

  const handleReject = (payable: DriverPayable) => {
    setSelectedPayable(payable);
    setRejectionReason("");
    setShowRejectModal(true);
    setOpenActionMenuId(null);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    if (selectedPayable) {
      setPayables(
        payables.map((p) =>
          p.id === selectedPayable.id
            ? { ...p, status: "Rejected", notes: rejectionReason }
            : p
        )
      );
      toast.success(`Payable ${selectedPayable.payableNumber} rejected`);
    }
    setShowRejectModal(false);
  };

  const handleCopyPayableNumber = (payableNumber: string) => {
    navigator.clipboard.writeText(payableNumber);
    toast.success("Payable number copied to clipboard");
  };

  const handleDownloadPayable = (payable: DriverPayable) => {
    toast.success(`Downloading payable ${payable.payableNumber}`);
  };

  const stats = [
    {
      label: "Pending",
      value: payables.filter((p) => p.status === "Pending").length,
      icon: "Clock",
      subtitle: "Awaiting approval",
    },
    {
      label: "Approved",
      value: payables.filter((p) => p.status === "Approved").length,
      icon: "CheckCircle",
      subtitle: "Ready for payment",
    },
    {
      label: "Paid",
      value: payables.filter((p) => p.status === "Paid").length,
      icon: "DollarSign",
      subtitle: "Completed",
    },
    {
      label: "On Hold",
      value: payables.filter((p) => p.status === "On Hold" || p.status === "Rejected").length,
      icon: "AlertCircle",
      subtitle: "Requires attention",
    },
  ];

  const totalPending = payables
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const totalPaid = payables
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Driver Payables"
          subtitle="Manage driver payments and payroll"
          breadcrumbs={[
            { label: "Finance", href: "#" },
            { label: "Driver Payables", current: true },
          ]}
          moreMenu={{
            onImport: () => toast.success("Import functionality"),
            exportOptions: {
              onExportCSV: () => toast.success("Exporting as CSV..."),
              onExportExcel: () => toast.success("Exporting as Excel..."),
              onExportPDF: () => toast.success("Exporting as PDF..."),
            },
            sortOptions: [
              {
                value: "payableNumber",
                label: "Payable Number (A-Z)",
                direction: "asc",
              },
              {
                value: "payableNumber",
                label: "Payable Number (Z-A)",
                direction: "desc",
              },
              {
                value: "period",
                label: "Period (Newest)",
                direction: "desc",
              },
              {
                value: "period",
                label: "Period (Oldest)",
                direction: "asc",
              },
              { value: "totalAmount", label: "Amount (High to Low)", direction: "desc" },
              { value: "totalAmount", label: "Amount (Low to High)", direction: "asc" },
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
              placeholder="Search payables..."
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
        {showSummary && (
          <>
            <SummaryWidgets widgets={stats} />

            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-warning-700 dark:text-warning-400 mb-1">
                      Total Pending Payables
                    </p>
                    <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                      AED {totalPending.toLocaleString()}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-warning-500 opacity-20" />
                </div>
              </div>
              <div className="bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-success-700 dark:text-success-400 mb-1">
                      Total Paid This Period
                    </p>
                    <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                      AED {totalPaid.toLocaleString()}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-success-500 opacity-20" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========== CONTENT AREA ========== */}
        <div className="space-y-4">
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedPayables.map((payable) => (
                <div
                  key={payable.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(payable)}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {payable.payableNumber}
                    </h3>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(payable.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === payable.id ? null : payable.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === payable.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(payable);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            {payable.status === "Pending" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(payable);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(payable);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}

                            {payable.status === "Approved" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePay(payable);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Banknote className="w-4 h-4" />
                                Process Payment
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPayableNumber(payable.payableNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Payable Number
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadPayable(payable);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Report
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payable Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{payable.driverName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      <span>{payable.tripCount} trips</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{payable.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <CreditCard className="w-4 h-4 flex-shrink-0" />
                      <span>{payable.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Amount Breakdown */}
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-2">
                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                      <span>Total</span>
                      <span>AED {payable.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-info-600 dark:text-info-400">
                      <span>Advance</span>
                      <span>AED {payable.advanceAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-primary-600 dark:text-primary-400 pt-1 border-t border-neutral-200 dark:border-neutral-800">
                      <span>Balance</span>
                      <span>AED {payable.balanceAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedPayables.map((payable) => (
                <div
                  key={payable.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {payable.payableNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyPayableNumber(payable.payableNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy payable number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {getStatusBadge(payable.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{payable.driverName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Truck className="w-4 h-4 flex-shrink-0" />
                          <span>{payable.tripCount} trips</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{payable.period}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                            <DollarSign className="w-4 h-4 flex-shrink-0" />
                            <span className="font-semibold">Total: AED {payable.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs pl-6">
                            <span className="text-neutral-500">Adv: {payable.advanceAmount.toLocaleString()}</span>
                            <span className="text-primary-600 dark:text-primary-400 font-medium">Bal: {payable.balanceAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <CreditCard className="w-4 h-4 flex-shrink-0" />
                        <span>{payable.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(
                            openActionMenuId === payable.id ? null : payable.id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === payable.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleViewDetails(payable)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {payable.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(payable)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>

                              <button
                                onClick={() => handleReject(payable)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}

                          {payable.status === "Approved" && (
                            <button
                              onClick={() => handlePay(payable)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Banknote className="w-4 h-4" />
                              Process Payment
                            </button>
                          )}

                          <button
                            onClick={() => {
                              handleCopyPayableNumber(payable.payableNumber);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Payable Number
                          </button>

                          <button
                            onClick={() => {
                              handleDownloadPayable(payable);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Report
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
                        Payable Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Trips
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedPayables.map((payable) => (
                      <tr
                        key={payable.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer relative"
                        onClick={() => handleViewDetails(payable)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {payable.payableNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPayableNumber(payable.payableNumber);
                              }}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(payable.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {payable.driverName}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {payable.driverID}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {payable.period}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {payable.tripCount}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {payable.paymentMethod}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                            AED {payable.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === payable.id ? null : payable.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === payable.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(payable);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>

                                {payable.status === "Pending" && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApprove(payable);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Approve
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject(payable);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Reject
                                    </button>
                                  </>
                                )}

                                {payable.status === "Approved" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePay(payable);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <Banknote className="w-4 h-4" />
                                    Process Payment
                                  </button>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyPayableNumber(payable.payableNumber);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Payable Number
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadPayable(payable);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download Report
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
          {filteredPayables.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <FileText className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No payables found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "No driver payables to display"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredPayables.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPayables.length}
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
          title="Payable Details"
          description={selectedPayable?.payableNumber}
          maxWidth="max-w-4xl"
        >
          {selectedPayable && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedPayable.status)}
              </div>

              {/* Driver Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Driver Name
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedPayable.driverName}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Driver ID
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedPayable.driverID}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Payment Method
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedPayable.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Period & Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Period
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedPayable.period}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Total Trips
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedPayable.tripCount}
                  </p>
                </div>
              </div>

              {/* Bank Details */}
              {selectedPayable.bankDetails && (
                <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-info-900 dark:text-info-400 mb-3">
                    Bank Details
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-info-700 dark:text-info-400 mb-1">
                        Bank Name
                      </p>
                      <p className="text-sm font-medium text-info-900 dark:text-info-300">
                        {selectedPayable.bankDetails.bankName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-info-700 dark:text-info-400 mb-1">
                        Account Number
                      </p>
                      <p className="text-sm font-medium text-info-900 dark:text-info-300">
                        {selectedPayable.bankDetails.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-info-700 dark:text-info-400 mb-1">
                        IBAN
                      </p>
                      <p className="text-sm font-medium text-info-900 dark:text-info-300">
                        {selectedPayable.bankDetails.iban}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Breakdown */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Trip Breakdown (Showing {Math.min(3, selectedPayable.trips.length)} of {selectedPayable.tripCount})
                </h4>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          Trip Number
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          Route
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {selectedPayable.trips.map((trip, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                            {trip.tripNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                            {trip.date}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                            {trip.route}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-neutral-900 dark:text-white">
                            AED {trip.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Amount */}
              <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700 dark:text-primary-400">
                    Total Payable Amount
                  </span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    AED {selectedPayable.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedPayable.notes && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Notes</p>
                  <p className="text-sm text-neutral-900 dark:text-white">
                    {selectedPayable.notes}
                  </p>
                </div>
              )}

              {/* Approval Details */}
              {selectedPayable.approvedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
                    <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                      Approved By
                    </p>
                    <p className="text-sm font-medium text-success-900 dark:text-success-300">
                      {selectedPayable.approvedBy}
                    </p>
                  </div>
                  <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
                    <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                      Approved Date
                    </p>
                    <p className="text-sm font-medium text-success-900 dark:text-success-300">
                      {selectedPayable.approvedDate}
                    </p>
                  </div>
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
            {selectedPayable && (
              <>
                <button
                  onClick={() => handleDownloadPayable(selectedPayable)}
                  className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                {selectedPayable.status === "Pending" && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApprove(selectedPayable);
                    }}
                    className="px-4 py-2 text-sm text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                )}
                {selectedPayable.status === "Approved" && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handlePay(selectedPayable);
                    }}
                    className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Banknote className="w-4 h-4" />
                    Process Payment
                  </button>
                )}
              </>
            )}
          </FormFooter>
        </FormModal>

        {/* Approve Modal */}
        {selectedPayable && (
          <FormModal
            isOpen={showApproveModal}
            onClose={() => setShowApproveModal(false)}
            title="Approve Payable"
            description={`${selectedPayable.payableNumber} - ${selectedPayable.driverName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg">
                <p className="text-sm text-success-900 dark:text-success-400">
                  You are about to approve payment of{" "}
                  <span className="font-semibold">
                    AED {selectedPayable.totalAmount.toLocaleString()}
                  </span>{" "}
                  to {selectedPayable.driverName} for {selectedPayable.tripCount} trips.
                </p>
              </div>

              <FormField>
                <FormLabel htmlFor="approvalNotes">Notes (Optional)</FormLabel>
                <FormTextarea
                  id="approvalNotes"
                  rows={3}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any approval notes..."
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

        {/* Process Payment Modal */}
        {selectedPayable && (
          <FormModal
            isOpen={showPayModal}
            onClose={() => setShowPayModal(false)}
            title="Process Payment"
            description={`${selectedPayable.payableNumber} - ${selectedPayable.driverName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                <p className="text-sm text-info-900 dark:text-info-400 mb-3">
                  Payment will be processed via {selectedPayable.paymentMethod} for{" "}
                  <span className="font-semibold">
                    AED {selectedPayable.totalAmount.toLocaleString()}
                  </span>
                </p>
                {selectedPayable.bankDetails && (
                  <div className="text-xs text-info-700 dark:text-info-400 space-y-1">
                    <p>Bank: {selectedPayable.bankDetails.bankName}</p>
                    <p>Account: {selectedPayable.bankDetails.accountNumber}</p>
                    <p>IBAN: {selectedPayable.bankDetails.iban}</p>
                  </div>
                )}
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowPayModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPay}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Banknote className="w-4 h-4" />
                Confirm Payment
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Reject Modal */}
        {selectedPayable && (
          <FormModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            title="Reject Payable"
            description={`${selectedPayable.payableNumber} - ${selectedPayable.driverName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-sm text-error-900 dark:text-error-400">
                  You are about to reject this payable. Please provide a reason.
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
                  placeholder="Explain why this payable is being rejected..."
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
      </div>
    </div>
  );
}
