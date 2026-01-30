import { useState } from "react";
import {
  DollarSign,
  Send,
  Eye,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Download,
  Mail,
  Phone,
  MoreVertical,
  Copy,
  BarChart3,
  RefreshCw,
  FileText,
  CreditCard,
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

interface Receivable {
  id: string;
  customerName: string;
  customerID: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  daysOverdue: number;
  status: "Current" | "Overdue" | "Paid" | "Partial Payment";
  contactEmail: string;
  contactPhone: string;
  lastPaymentDate?: string;
  lastReminderDate?: string;
  paymentHistory: {
    date: string;
    amount: number;
    method: string;
    reference: string;
  }[];
}

type ViewMode = "grid" | "list" | "table";

export default function Receivables() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [receivables, setReceivables] = useState<Receivable[]>([
    {
      id: "1",
      customerName: "John Smith",
      customerID: "CUST-001",
      invoiceNumber: "INV-2024-0156",
      invoiceDate: "2024-01-25",
      dueDate: "2024-02-09",
      totalAmount: 908.41,
      paidAmount: 0,
      balanceDue: 908.41,
      daysOverdue: 0,
      status: "Current",
      contactEmail: "john.smith@example.com",
      contactPhone: "+971 50 123 4567",
      paymentHistory: [],
    },
    {
      id: "2",
      customerName: "Sarah Ahmed",
      customerID: "CUST-002",
      invoiceNumber: "INV-2024-0155",
      invoiceDate: "2024-01-24",
      dueDate: "2024-02-08",
      totalAmount: 2924.25,
      paidAmount: 2924.25,
      balanceDue: 0,
      daysOverdue: 0,
      status: "Paid",
      contactEmail: "sarah.ahmed@example.com",
      contactPhone: "+971 55 234 5678",
      lastPaymentDate: "2024-01-28",
      paymentHistory: [
        {
          date: "2024-01-28",
          amount: 2924.25,
          method: "Bank Transfer",
          reference: "TRF-20240128-001",
        },
      ],
    },
    {
      id: "3",
      customerName: "Mohammed Ali",
      customerID: "CUST-003",
      invoiceNumber: "INV-2024-0154",
      invoiceDate: "2024-01-23",
      dueDate: "2024-02-07",
      totalAmount: 609.53,
      paidAmount: 0,
      balanceDue: 609.53,
      daysOverdue: 0,
      status: "Current",
      contactEmail: "mohammed.ali@example.com",
      contactPhone: "+971 52 345 6789",
      paymentHistory: [],
    },
    {
      id: "4",
      customerName: "Alex Johnson",
      customerID: "CUST-004",
      invoiceNumber: "INV-2024-0153",
      invoiceDate: "2024-01-15",
      dueDate: "2024-01-30",
      totalAmount: 486.15,
      paidAmount: 0,
      balanceDue: 486.15,
      daysOverdue: 3,
      status: "Overdue",
      contactEmail: "alex.johnson@example.com",
      contactPhone: "+971 56 456 7890",
      lastReminderDate: "2024-01-31",
      paymentHistory: [],
    },
    {
      id: "5",
      customerName: "Lisa Wang",
      customerID: "CUST-005",
      invoiceNumber: "INV-2024-0152",
      invoiceDate: "2024-01-20",
      dueDate: "2024-02-04",
      totalAmount: 1305.99,
      paidAmount: 500.0,
      balanceDue: 805.99,
      daysOverdue: 0,
      status: "Partial Payment",
      contactEmail: "lisa.wang@example.com",
      contactPhone: "+971 50 567 8901",
      lastPaymentDate: "2024-01-27",
      paymentHistory: [
        {
          date: "2024-01-27",
          amount: 500.0,
          method: "Credit Card",
          reference: "CC-20240127-045",
        },
      ],
    },
    {
      id: "6",
      customerName: "Ahmed Hassan",
      customerID: "CUST-006",
      invoiceNumber: "INV-2024-0151",
      invoiceDate: "2024-01-10",
      dueDate: "2024-01-25",
      totalAmount: 1850.0,
      paidAmount: 0,
      balanceDue: 1850.0,
      daysOverdue: 8,
      status: "Overdue",
      contactEmail: "ahmed.hassan@example.com",
      contactPhone: "+971 55 678 9012",
      lastReminderDate: "2024-01-26",
      paymentHistory: [],
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
        { value: "Current", label: "Current" },
        { value: "Overdue", label: "Overdue" },
        { value: "Paid", label: "Paid" },
        { value: "Partial Payment", label: "Partial Payment" },
      ],
    },
    {
      id: "overdue",
      label: "Ageing Buckets",
      type: "select",
      values: [],
      options: [
        { value: "0-30", label: "0-30 Days" },
        { value: "31-60", label: "31-60 Days" },
        { value: "61-90", label: "61-90 Days" },
        { value: "90+", label: "90+ Days" },
      ],
    },
  ];

  // Apply filters
  const filteredReceivables = receivables.filter((receivable) => {
    const matchesSearch =
      receivable.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receivable.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receivable.customerID.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(receivable.status);

    const overdueFilter = filters.find((f) => f.id === "overdue");
    let matchesOverdue = true;
    if (overdueFilter && overdueFilter.values.length > 0) {
      matchesOverdue = overdueFilter.values.some((value) => {
        if (value === "0-30") return receivable.daysOverdue >= 0 && receivable.daysOverdue <= 30;
        if (value === "31-60") return receivable.daysOverdue >= 31 && receivable.daysOverdue <= 60;
        if (value === "61-90") return receivable.daysOverdue >= 61 && receivable.daysOverdue <= 90;
        if (value === "90+") return receivable.daysOverdue > 90;
        return false;
      });
    }

    return matchesSearch && matchesStatus && matchesOverdue;
  });

  // Apply sorting
  const sortedReceivables = [...filteredReceivables].sort((a, b) => {
    let comparison = 0;
    if (sortField === "dueDate") {
      comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortField === "invoiceNumber") {
      comparison = a.invoiceNumber.localeCompare(b.invoiceNumber);
    } else if (sortField === "customerName") {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortField === "balanceDue") {
      comparison = a.balanceDue - b.balanceDue;
    } else if (sortField === "daysOverdue") {
      comparison = a.daysOverdue - b.daysOverdue;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedReceivables.length / itemsPerPage);
  const paginatedReceivables = sortedReceivables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Paid":
        return "success";
      case "Current":
        return "info";
      case "Partial Payment":
        return "warning";
      case "Overdue":
        return "error";
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

  const handleViewDetails = (receivable: Receivable) => {
    setSelectedReceivable(receivable);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleSendReminder = (receivable: Receivable) => {
    setSelectedReceivable(receivable);
    setReminderMessage(`Dear ${receivable.customerName},\n\nThis is a friendly reminder that invoice ${receivable.invoiceNumber} for AED ${receivable.balanceDue.toLocaleString()} is ${receivable.status === "Overdue" ? `overdue by ${receivable.daysOverdue} days` : "due soon"}.\n\nPlease process the payment at your earliest convenience.\n\nThank you.`);
    setShowReminderModal(true);
    setOpenActionMenuId(null);
  };

  const confirmSendReminder = () => {
    if (selectedReceivable) {
      setReceivables(
        receivables.map((r) =>
          r.id === selectedReceivable.id
            ? { ...r, lastReminderDate: new Date().toISOString().split("T")[0] }
            : r
        )
      );
      toast.success(`Reminder sent to ${selectedReceivable.customerName}`);
    }
    setShowReminderModal(false);
  };

  const handleRecordPayment = (receivable: Receivable) => {
    setSelectedReceivable(receivable);
    setPaymentAmount("");
    setPaymentMethod("");
    setPaymentReference("");
    setShowRecordPaymentModal(true);
    setOpenActionMenuId(null);
  };

  const confirmRecordPayment = () => {
    if (!paymentAmount || !paymentMethod || !paymentReference) {
      toast.error("Please fill all payment details");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (selectedReceivable) {
      const newPaidAmount = selectedReceivable.paidAmount + amount;
      const newBalanceDue = selectedReceivable.totalAmount - newPaidAmount;
      const newStatus = newBalanceDue === 0 ? "Paid" : "Partial Payment";

      setReceivables(
        receivables.map((r) =>
          r.id === selectedReceivable.id
            ? {
              ...r,
              paidAmount: newPaidAmount,
              balanceDue: newBalanceDue,
              status: newStatus,
              lastPaymentDate: new Date().toISOString().split("T")[0],
              paymentHistory: [
                ...r.paymentHistory,
                {
                  date: new Date().toISOString().split("T")[0],
                  amount: amount,
                  method: paymentMethod,
                  reference: paymentReference,
                },
              ],
            }
            : r
        )
      );
      toast.success(`Payment of AED ${amount.toLocaleString()} recorded`);
    }
    setShowRecordPaymentModal(false);
  };

  const handleCopyInvoiceNumber = (invoiceNumber: string) => {
    navigator.clipboard.writeText(invoiceNumber);
    toast.success("Invoice number copied to clipboard");
  };

  const handleDownloadStatement = (receivable: Receivable) => {
    toast.success(`Downloading statement for ${receivable.invoiceNumber}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stats = [
    {
      label: "Current",
      value: receivables.filter((r) => r.status === "Current").length,
      icon: "CheckCircle",
      subtitle: "Not overdue",
    },
    {
      label: "Overdue",
      value: receivables.filter((r) => r.status === "Overdue").length,
      icon: "AlertCircle",
      subtitle: "Past due date",
    },
    {
      label: "Partial",
      value: receivables.filter((r) => r.status === "Partial Payment").length,
      icon: "Clock",
      subtitle: "Partially paid",
    },
    {
      label: "Paid",
      value: receivables.filter((r) => r.status === "Paid").length,
      icon: "DollarSign",
      subtitle: "Fully collected",
    },
  ];

  const totalOutstanding = receivables
    .filter((r) => r.status !== "Paid")
    .reduce((sum, r) => sum + r.balanceDue, 0);

  const totalOverdue = receivables
    .filter((r) => r.status === "Overdue")
    .reduce((sum, r) => sum + r.balanceDue, 0);

  const totalCollected = receivables.reduce((sum, r) => sum + r.paidAmount, 0);

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Accounts Receivable"
          subtitle="Track customer payments and outstanding balances"
          breadcrumbs={[
            { label: "Finance", href: "#" },
            { label: "Accounts Receivable", current: true },
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
                value: "invoiceNumber",
                label: "Invoice Number (A-Z)",
                direction: "asc",
              },
              {
                value: "invoiceNumber",
                label: "Invoice Number (Z-A)",
                direction: "desc",
              },
              {
                value: "dueDate",
                label: "Due Date (Earliest)",
                direction: "asc",
              },
              {
                value: "dueDate",
                label: "Due Date (Latest)",
                direction: "desc",
              },
              { value: "balanceDue", label: "Balance (High to Low)", direction: "desc" },
              { value: "balanceDue", label: "Balance (Low to High)", direction: "asc" },
              { value: "daysOverdue", label: "Days Overdue (Most)", direction: "desc" },
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
              placeholder="Search receivables..."
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

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-error-700 dark:text-error-400 mb-1">
                      Total Overdue
                    </p>
                    <p className="text-3xl font-bold text-error-600 dark:text-error-400">
                      AED {totalOverdue.toLocaleString()}
                    </p>
                  </div>
                  <AlertTriangle className="w-12 h-12 text-error-500 opacity-20" />
                </div>
              </div>
              <div className="bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-warning-700 dark:text-warning-400 mb-1">
                      Total Outstanding
                    </p>
                    <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                      AED {totalOutstanding.toLocaleString()}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-warning-500 opacity-20" />
                </div>
              </div>
              <div className="bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-success-700 dark:text-success-400 mb-1">
                      Total Collected
                    </p>
                    <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                      AED {totalCollected.toLocaleString()}
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
              {paginatedReceivables.map((receivable) => (
                <div
                  key={receivable.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(receivable)}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {receivable.invoiceNumber}
                    </h3>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(receivable.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === receivable.id ? null : receivable.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === receivable.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(receivable);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            {receivable.status !== "Paid" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRecordPayment(receivable);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  Record Payment
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSendReminder(receivable);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Mail className="w-4 h-4" />
                                  Send Reminder
                                </button>
                              </>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInvoiceNumber(receivable.invoiceNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Invoice Number
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadStatement(receivable);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Statement
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Overdue Badge */}
                  {receivable.daysOverdue > 0 && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 border border-error-200 dark:border-error-800">
                        <AlertTriangle className="w-3 h-3" />
                        {receivable.daysOverdue} days overdue
                      </span>
                    </div>
                  )}

                  {/* Receivable Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{receivable.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Due: {formatDate(receivable.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span>Total: AED {receivable.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Balance Due */}
                  <div className={`p-3 rounded-lg border ${receivable.status === "Overdue"
                      ? "bg-error-50 dark:bg-error-900/30 border-error-200 dark:border-error-800"
                      : receivable.status === "Partial Payment"
                        ? "bg-warning-50 dark:bg-warning-900/30 border-warning-200 dark:border-warning-800"
                        : "bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800"
                    }`}>
                    <div className={`text-xs mb-1 ${receivable.status === "Overdue"
                        ? "text-error-700 dark:text-error-400"
                        : receivable.status === "Partial Payment"
                          ? "text-warning-700 dark:text-warning-400"
                          : "text-primary-700 dark:text-primary-400"
                      }`}>
                      Balance Due
                    </div>
                    <div className={`text-lg font-bold ${receivable.status === "Overdue"
                        ? "text-error-600 dark:text-error-400"
                        : receivable.status === "Partial Payment"
                          ? "text-warning-600 dark:text-warning-400"
                          : "text-primary-600 dark:text-primary-400"
                      }`}>
                      AED {receivable.balanceDue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedReceivables.map((receivable) => (
                <div
                  key={receivable.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {receivable.invoiceNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyInvoiceNumber(receivable.invoiceNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy invoice number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {getStatusBadge(receivable.status)}
                        {receivable.daysOverdue > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400">
                            <AlertTriangle className="w-3 h-3" />
                            {receivable.daysOverdue} days overdue
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{receivable.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Due: {formatDate(receivable.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>Total: AED {receivable.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <DollarSign className="w-4 h-4 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                          <span className={
                            receivable.status === "Overdue"
                              ? "text-error-600 dark:text-error-400"
                              : "text-neutral-900 dark:text-white"
                          }>
                            AED {receivable.balanceDue.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {receivable.paidAmount > 0 && (
                        <div className="text-sm text-success-600 dark:text-success-400">
                          Paid: AED {receivable.paidAmount.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(
                            openActionMenuId === receivable.id ? null : receivable.id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === receivable.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleViewDetails(receivable)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {receivable.status !== "Paid" && (
                            <>
                              <button
                                onClick={() => handleRecordPayment(receivable)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <CreditCard className="w-4 h-4" />
                                Record Payment
                              </button>

                              <button
                                onClick={() => handleSendReminder(receivable)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <Mail className="w-4 h-4" />
                                Send Reminder
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => {
                              handleCopyInvoiceNumber(receivable.invoiceNumber);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Invoice Number
                          </button>

                          <button
                            onClick={() => {
                              handleDownloadStatement(receivable);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Statement
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
                        Invoice Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Paid
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Balance Due
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Days Overdue
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedReceivables.map((receivable) => (
                      <tr
                        key={receivable.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer relative"
                        onClick={() => handleViewDetails(receivable)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {receivable.invoiceNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInvoiceNumber(receivable.invoiceNumber);
                              }}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(receivable.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {receivable.customerName}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {receivable.customerID}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {formatDate(receivable.dueDate)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            AED {receivable.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {receivable.paidAmount > 0 ? (
                            <div className="text-sm text-success-600 dark:text-success-400">
                              AED {receivable.paidAmount.toLocaleString()}
                            </div>
                          ) : (
                            <div className="text-sm text-neutral-400 dark:text-neutral-600">—</div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className={`text-sm font-semibold ${receivable.status === "Overdue"
                              ? "text-error-600 dark:text-error-400"
                              : "text-neutral-900 dark:text-white"
                            }`}>
                            AED {receivable.balanceDue.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {receivable.daysOverdue > 0 ? (
                            <div className="flex items-center gap-1 text-sm text-error-600 dark:text-error-400">
                              <AlertTriangle className="w-3 h-3" />
                              {receivable.daysOverdue}
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
                                setOpenActionMenuId(
                                  openActionMenuId === receivable.id ? null : receivable.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === receivable.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(receivable);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>

                                {receivable.status !== "Paid" && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRecordPayment(receivable);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                    >
                                      <CreditCard className="w-4 h-4" />
                                      Record Payment
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendReminder(receivable);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                    >
                                      <Mail className="w-4 h-4" />
                                      Send Reminder
                                    </button>
                                  </>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyInvoiceNumber(receivable.invoiceNumber);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Invoice Number
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadStatement(receivable);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download Statement
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
          {filteredReceivables.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <FileText className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No receivables found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "No outstanding receivables"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredReceivables.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredReceivables.length}
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
          title="Receivable Details"
          description={selectedReceivable?.invoiceNumber}
          maxWidth="max-w-4xl"
        >
          {selectedReceivable && (
            <div className="space-y-6">
              {/* Status & Overdue */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedReceivable.status)}
                {selectedReceivable.daysOverdue > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400">
                    <AlertTriangle className="w-3 h-3" />
                    {selectedReceivable.daysOverdue} days overdue
                  </span>
                )}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Customer Name
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedReceivable.customerName}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Customer ID
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedReceivable.customerID}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Contact
                  </p>
                  <p className="text-xs text-neutral-900 dark:text-white truncate">
                    {selectedReceivable.contactEmail}
                  </p>
                  <p className="text-xs text-neutral-900 dark:text-white">
                    {selectedReceivable.contactPhone}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Invoice Date
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatDate(selectedReceivable.invoiceDate)}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Due Date
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatDate(selectedReceivable.dueDate)}
                  </p>
                </div>
                {selectedReceivable.lastPaymentDate && (
                  <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
                    <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                      Last Payment
                    </p>
                    <p className="text-sm font-medium text-success-900 dark:text-success-300">
                      {formatDate(selectedReceivable.lastPaymentDate)}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Total Amount
                  </p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">
                    AED {selectedReceivable.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
                  <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                    Paid Amount
                  </p>
                  <p className="text-lg font-bold text-success-600 dark:text-success-400">
                    AED {selectedReceivable.paidAmount.toLocaleString()}
                  </p>
                </div>
                <div className={`p-4 rounded-lg border ${selectedReceivable.status === "Overdue"
                    ? "bg-error-50 dark:bg-error-900/30 border-error-200 dark:border-error-800"
                    : "bg-warning-50 dark:bg-warning-900/30 border-warning-200 dark:border-warning-800"
                  }`}>
                  <p className={`text-xs mb-1 ${selectedReceivable.status === "Overdue"
                      ? "text-error-700 dark:text-error-400"
                      : "text-warning-700 dark:text-warning-400"
                    }`}>
                    Balance Due
                  </p>
                  <p className={`text-lg font-bold ${selectedReceivable.status === "Overdue"
                      ? "text-error-600 dark:text-error-400"
                      : "text-warning-600 dark:text-warning-400"
                    }`}>
                    AED {selectedReceivable.balanceDue.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payment History */}
              {selectedReceivable.paymentHistory.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Payment History
                  </h4>
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50 dark:bg-neutral-900">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            Amount
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            Method
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            Reference
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {selectedReceivable.paymentHistory.map((payment, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                              {formatDate(payment.date)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-success-600 dark:text-success-400">
                              AED {payment.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                              {payment.method}
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                              {payment.reference}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
            {selectedReceivable && selectedReceivable.status !== "Paid" && (
              <>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleSendReminder(selectedReceivable);
                  }}
                  className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Reminder
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleRecordPayment(selectedReceivable);
                  }}
                  className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Record Payment
                </button>
              </>
            )}
          </FormFooter>
        </FormModal>

        {/* Send Reminder Modal */}
        {selectedReceivable && (
          <FormModal
            isOpen={showReminderModal}
            onClose={() => setShowReminderModal(false)}
            title="Send Payment Reminder"
            description={`${selectedReceivable.invoiceNumber} - ${selectedReceivable.customerName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                <div className="flex items-start gap-2 text-sm text-info-900 dark:text-info-400 mb-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Reminder will be sent to:</p>
                    <p>{selectedReceivable.contactEmail}</p>
                  </div>
                </div>
              </div>

              <FormField>
                <FormLabel htmlFor="reminderMessage">Message</FormLabel>
                <FormTextarea
                  id="reminderMessage"
                  rows={8}
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  placeholder="Enter reminder message..."
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSendReminder}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Reminder
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Record Payment Modal */}
        {selectedReceivable && (
          <FormModal
            isOpen={showRecordPaymentModal}
            onClose={() => setShowRecordPaymentModal(false)}
            title="Record Payment"
            description={`${selectedReceivable.invoiceNumber} - ${selectedReceivable.customerName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-info-700 dark:text-info-400">
                    Balance Due
                  </span>
                  <span className="text-lg font-bold text-info-600 dark:text-info-400">
                    AED {selectedReceivable.balanceDue.toLocaleString()}
                  </span>
                </div>
              </div>

              <FormField>
                <FormLabel htmlFor="paymentAmount" required>
                  Payment Amount (AED)
                </FormLabel>
                <FormInput
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="paymentMethod" required>
                  Payment Method
                </FormLabel>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select payment method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                </select>
              </FormField>

              <FormField>
                <FormLabel htmlFor="paymentReference" required>
                  Payment Reference
                </FormLabel>
                <FormInput
                  id="paymentReference"
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g., TRF-20240128-001"
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowRecordPaymentModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRecordPayment}
                className="px-4 py-2 text-sm text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Record Payment
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    </div>
  );
}
