import { useState, useEffect } from "react";
import {
  DollarSign,
  Send,
  Eye,
  Download,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Printer,
  Mail,
  MoreVertical,
  Copy,
  BarChart3,
  RefreshCw,
  User,
  AlertTriangle,
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerID: string;
  invoiceDate: string;
  dueDate: string;
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount?: number;
  balanceDue: number;
  paymentTerms: string;
  notes?: string;
  relatedTrip?: string;
}

type ViewMode = "grid" | "list" | "table";

export default function CustomerInvoicing() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("invoiceDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Create invoice form state
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerID, setNewCustomerID] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPaymentTerms, setNewPaymentTerms] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-0156",
      customerName: "John Smith",
      customerID: "CUST-001",
      invoiceDate: "2024-01-25",
      dueDate: "2024-02-09",
      status: "Sent",
      items: [
        {
          description: "Express Delivery - Dubai to Abu Dhabi",
          quantity: 1,
          unitPrice: 865.15,
          amount: 865.15,
        },
      ],
      subtotal: 865.15,
      taxRate: 5,
      taxAmount: 43.26,
      totalAmount: 908.41,
      balanceDue: 908.41,
      paymentTerms: "Net 15",
      relatedTrip: "TRP-2024-1234",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-0155",
      customerName: "Sarah Ahmed",
      customerID: "CUST-002",
      invoiceDate: "2024-01-24",
      dueDate: "2024-02-08",
      status: "Paid",
      items: [
        {
          description: "Standard Delivery - Jebel Ali to Al Ain",
          quantity: 1,
          unitPrice: 2784.52,
          amount: 2784.52,
        },
      ],
      subtotal: 2784.52,
      taxRate: 5,
      taxAmount: 139.73,
      totalAmount: 2924.25,
      paidAmount: 2924.25,
      balanceDue: 0,
      paymentTerms: "Net 15",
      relatedTrip: "TRP-2024-1230",
      notes: "Paid via bank transfer on 2024-01-28",
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-0154",
      customerName: "Mohammed Ali",
      customerID: "CUST-003",
      invoiceDate: "2024-01-23",
      dueDate: "2024-02-07",
      status: "Sent",
      items: [
        {
          description: "Express Delivery - Deira to Sharjah",
          quantity: 1,
          unitPrice: 580.5,
          amount: 580.5,
        },
      ],
      subtotal: 580.5,
      taxRate: 5,
      taxAmount: 29.03,
      totalAmount: 609.53,
      balanceDue: 609.53,
      paymentTerms: "Net 15",
      relatedTrip: "TRP-2024-1228",
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-0153",
      customerName: "Alex Johnson",
      customerID: "CUST-004",
      invoiceDate: "2024-01-15",
      dueDate: "2024-01-30",
      status: "Overdue",
      items: [
        {
          description: "Standard Delivery - Business Bay to Musaffah",
          quantity: 1,
          unitPrice: 463.0,
          amount: 463.0,
        },
      ],
      subtotal: 463.0,
      taxRate: 5,
      taxAmount: 23.15,
      totalAmount: 486.15,
      balanceDue: 486.15,
      paymentTerms: "Net 15",
      relatedTrip: "TRP-2024-1220",
      notes: "Payment reminder sent on 2024-01-31",
    },
    {
      id: "5",
      invoiceNumber: "INV-2024-0152",
      customerName: "Lisa Wang",
      customerID: "CUST-005",
      invoiceDate: "2024-01-20",
      dueDate: "2024-02-04",
      status: "Draft",
      items: [
        {
          description: "Express Delivery - Al Quoz to Ras Al Khaimah",
          quantity: 1,
          unitPrice: 1243.8,
          amount: 1243.8,
        },
      ],
      subtotal: 1243.8,
      taxRate: 5,
      taxAmount: 62.19,
      totalAmount: 1305.99,
      balanceDue: 1305.99,
      paymentTerms: "Net 15",
      relatedTrip: "TRP-2024-1224",
    },
  ]);

  // Filter options for advanced search
  const filterOptions: any[] = [
    {
      id: "status",
      label: "Status",
      type: "select",
      values: [],
      options: [
        { value: "Draft", label: "Draft" },
        { value: "Sent", label: "Sent" },
        { value: "Paid", label: "Paid" },
        { value: "Overdue", label: "Overdue" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
    {
      id: "paymentTerms",
      label: "Payment Terms",
      type: "select",
      values: [],
      options: [
        { value: "Net 15", label: "Net 15" },
        { value: "Net 30", label: "Net 30" },
        { value: "Due on Receipt", label: "Due on Receipt" },
      ],
    },
  ];

  // Apply filters
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerID.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(invoice.status);

    const paymentTermsFilter = filters.find((f) => f.id === "paymentTerms");
    const matchesPaymentTerms =
      !paymentTermsFilter || paymentTermsFilter.values.length === 0 || paymentTermsFilter.values.includes(invoice.paymentTerms);

    return matchesSearch && matchesStatus && matchesPaymentTerms;
  });

  // Apply sorting
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let comparison = 0;
    if (sortField === "invoiceDate") {
      comparison = new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime();
    } else if (sortField === "invoiceNumber") {
      comparison = a.invoiceNumber.localeCompare(b.invoiceNumber);
    } else if (sortField === "customerName") {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortField === "totalAmount") {
      comparison = a.totalAmount - b.totalAmount;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const paginatedInvoices = sortedInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Paid":
        return "success";
      case "Sent":
        return "info";
      case "Overdue":
        return "error";
      case "Draft":
        return "neutral";
      case "Cancelled":
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
              : getStatusColor(status) === "error"
                ? "bg-error-500"
                : "bg-neutral-400"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowSendModal(true);
    setOpenActionMenuId(null);
  };

  const confirmSendInvoice = () => {
    if (selectedInvoice) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === selectedInvoice.id ? { ...inv, status: "Sent" } : inv
        )
      );
      toast.success(`Invoice ${selectedInvoice.invoiceNumber} sent successfully`);
    }
    setShowSendModal(false);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Downloading invoice ${invoice.invoiceNumber}`);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    toast.success(`Printing invoice ${invoice.invoiceNumber}`);
  };

  const handleCopyInvoiceNumber = (invoiceNumber: string) => {
    navigator.clipboard.writeText(invoiceNumber);
    toast.success("Invoice number copied to clipboard");
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === invoice.id
          ? { ...inv, status: "Paid", paidAmount: inv.totalAmount, balanceDue: 0 }
          : inv
      )
    );
    toast.success(`Invoice ${invoice.invoiceNumber} marked as paid`);
    setOpenActionMenuId(null);
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
      label: "Draft",
      value: invoices.filter((i) => i.status === "Draft").length,
      icon: "FileText",
      subtitle: "Not sent",
    },
    {
      label: "Sent",
      value: invoices.filter((i) => i.status === "Sent").length,
      icon: "Send",
      subtitle: "Awaiting payment",
    },
    {
      label: "Paid",
      value: invoices.filter((i) => i.status === "Paid").length,
      icon: "CheckCircle",
      subtitle: "Completed",
    },
    {
      label: "Overdue",
      value: invoices.filter((i) => i.status === "Overdue").length,
      icon: "AlertCircle",
      subtitle: "Past due date",
    },
  ];

  const totalRevenue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalOutstanding = invoices
    .filter((i) => i.status !== "Paid" && i.status !== "Cancelled")
    .reduce((sum, inv) => sum + inv.balanceDue, 0);

  // Handle pending invoice draft from Trip Monitoring or Proforma from Pricing Hub
  useEffect(() => {
    const invoiceDraftStr = localStorage.getItem("pendingInvoiceDraft");
    const proformaDraftStr = localStorage.getItem("pendingProformaDraft");

    if (invoiceDraftStr) {
      try {
        const draft = JSON.parse(invoiceDraftStr);
        setNewCustomerName(draft.customerName || "");
        setNewPaymentTerms("Net 15");
        setNewNotes(`Invoice for Trip: ${draft.tripNumber || ""}\nInquiry: ${draft.inquiryNumber || ""}\n${draft.description || ""}`);

        // Clear draft after reading
        localStorage.removeItem("pendingInvoiceDraft");

        // Open modal
        setShowCreateModal(true);
        toast.info("Invoice pre-filled from trip details");
      } catch (e) {
        console.error("Failed to parse invoice draft", e);
      }
    } else if (proformaDraftStr) {
      try {
        const draft = JSON.parse(proformaDraftStr);
        setNewCustomerName(draft.customerName || "");
        setNewPaymentTerms("Due on Receipt");
        setNewNotes(`PROFORMA INVOICE\nReference: ${draft.quoteNumber || draft.inquiryNumber}\n${draft.description || ""}\nAmount: AED ${draft.amount?.toLocaleString()}`);

        // Clear draft after reading
        localStorage.removeItem("pendingProformaDraft");

        // Open modal
        setShowCreateModal(true);
        toast.info("Proforma invoice pre-filled from quotation");
      } catch (e) {
        console.error("Failed to parse proforma draft", e);
      }
    }
  }, []);

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Customer Invoicing"
          subtitle="Create and manage customer invoices and payments"
          breadcrumbs={[
            { label: "Finance", href: "#" },
            { label: "Customer Invoicing", current: true },
          ]}
          primaryAction={{
            label: "+ New Invoice",
            onClick: () => setShowCreateModal(true),
          }}
          moreMenu={{
            onImport: () => toast.success("Import functionality"),
            exportOptions: {
              onExportCSV: () => toast.success("Exporting as CSV..."),
              onExportExcel: () => toast.success("Exporting as Excel..."),
              onExportPDF: () => toast.success("Exporting as PDF..."),
            },
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
                value: "invoiceDate",
                label: "Date (Newest)",
                direction: "desc",
              },
              {
                value: "invoiceDate",
                label: "Date (Oldest)",
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
              placeholder="Search invoices..."
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
            onClearAll={() => setFilters(filterOptions.map((f) => ({ ...f, values: [] })))}
          />
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && (
          <>
            <SummaryWidgets widgets={stats} />

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-success-700 dark:text-success-400 mb-1">
                      Total Revenue (Paid)
                    </p>
                    <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                      AED {totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-success-500 opacity-20" />
                </div>
              </div>
              <div className="bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-warning-700 dark:text-warning-400 mb-1">
                      Outstanding Amount
                    </p>
                    <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                      AED {totalOutstanding.toLocaleString()}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-warning-500 opacity-20" />
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
              {paginatedInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(invoice)}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {invoice.invoiceNumber}
                    </h3>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(invoice.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === invoice.id ? null : invoice.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === invoice.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(invoice);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            {invoice.status === "Draft" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendInvoice(invoice);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <Send className="w-4 h-4" />
                                Send Invoice
                              </button>
                            )}

                            {(invoice.status === "Sent" || invoice.status === "Overdue") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsPaid(invoice);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Mark as Paid
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrintInvoice(invoice);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Printer className="w-4 h-4" />
                              Print
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInvoiceNumber(invoice.invoiceNumber);
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
                                handleDownloadInvoice(invoice);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Invoice Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{invoice.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Due: {formatDate(invoice.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span>{invoice.items.length} item(s)</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-primary-700 dark:text-primary-400 mb-1">
                          Total Amount
                        </div>
                        <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          AED {invoice.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      {invoice.balanceDue > 0 && (
                        <div className="text-right">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                            Balance Due
                          </div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            AED {invoice.balanceDue.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {invoice.invoiceNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyInvoiceNumber(invoice.invoiceNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy invoice number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {getStatusBadge(invoice.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{invoice.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Due: {formatDate(invoice.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <DollarSign className="w-4 h-4 flex-shrink-0" />
                          <span className="font-semibold">AED {invoice.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>{invoice.items.length} items</span>
                        </div>
                      </div>

                      {invoice.balanceDue > 0 && (
                        <div className="text-sm">
                          <span className="text-warning-600 dark:text-warning-400 font-medium">
                            Balance Due: AED {invoice.balanceDue.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(
                            openActionMenuId === invoice.id ? null : invoice.id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === invoice.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleViewDetails(invoice)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {invoice.status === "Draft" && (
                            <button
                              onClick={() => handleSendInvoice(invoice)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Send className="w-4 h-4" />
                              Send Invoice
                            </button>
                          )}

                          {(invoice.status === "Sent" || invoice.status === "Overdue") && (
                            <button
                              onClick={() => handleMarkAsPaid(invoice)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark as Paid
                            </button>
                          )}

                          <button
                            onClick={() => {
                              handlePrintInvoice(invoice);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </button>

                          <button
                            onClick={() => {
                              handleCopyInvoiceNumber(invoice.invoiceNumber);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Invoice Number
                          </button>

                          <button
                            onClick={() => {
                              handleDownloadInvoice(invoice);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
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
                        Invoice Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Balance Due
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer relative"
                        onClick={() => handleViewDetails(invoice)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {invoice.invoiceNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInvoiceNumber(invoice.invoiceNumber);
                              }}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {invoice.customerName}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {invoice.customerID}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {formatDate(invoice.invoiceDate)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {formatDate(invoice.dueDate)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            AED {invoice.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {invoice.balanceDue > 0 ? (
                            <div className="text-sm font-medium text-warning-600 dark:text-warning-400">
                              AED {invoice.balanceDue.toLocaleString()}
                            </div>
                          ) : (
                            <div className="text-sm text-success-600 dark:text-success-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Paid
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === invoice.id ? null : invoice.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === invoice.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(invoice);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>

                                {invoice.status === "Draft" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSendInvoice(invoice);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <Send className="w-4 h-4" />
                                    Send Invoice
                                  </button>
                                )}

                                {(invoice.status === "Sent" || invoice.status === "Overdue") && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkAsPaid(invoice);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark as Paid
                                  </button>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrintInvoice(invoice);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Printer className="w-4 h-4" />
                                  Print
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyInvoiceNumber(invoice.invoiceNumber);
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
                                    handleDownloadInvoice(invoice);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download PDF
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
          {filteredInvoices.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <FileText className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No invoices found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first invoice"}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Invoice
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredInvoices.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredInvoices.length}
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
          title="Invoice Details"
          description={selectedInvoice?.invoiceNumber}
          maxWidth="max-w-4xl"
        >
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedInvoice.status)}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Customer Name
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedInvoice.customerName}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Customer ID
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedInvoice.customerID}
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
                    {formatDate(selectedInvoice.invoiceDate)}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Due Date
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatDate(selectedInvoice.dueDate)}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Payment Terms
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedInvoice.paymentTerms}
                  </p>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Line Items
                </h4>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          Description
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-neutral-900 dark:text-white">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-neutral-900 dark:text-white">
                            AED {item.unitPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-neutral-900 dark:text-white">
                            AED {item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">Subtotal:</span>
                    <span className="text-neutral-900 dark:text-white">
                      AED {selectedInvoice.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Tax ({selectedInvoice.taxRate}%):
                    </span>
                    <span className="text-neutral-900 dark:text-white">
                      AED {selectedInvoice.taxAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2 flex justify-between font-semibold">
                    <span className="text-neutral-900 dark:text-white">Total:</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      AED {selectedInvoice.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  {selectedInvoice.paidAmount && selectedInvoice.paidAmount > 0 && (
                    <div className="flex justify-between text-sm text-success-600 dark:text-success-400">
                      <span>Paid:</span>
                      <span>AED {selectedInvoice.paidAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedInvoice.balanceDue > 0 && (
                    <div className="flex justify-between font-semibold text-warning-600 dark:text-warning-400">
                      <span>Balance Due:</span>
                      <span>AED {selectedInvoice.balanceDue.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Notes</p>
                  <p className="text-sm text-neutral-900 dark:text-white">
                    {selectedInvoice.notes}
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
            {selectedInvoice && (
              <>
                <button
                  onClick={() => handlePrintInvoice(selectedInvoice)}
                  className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </>
            )}
          </FormFooter>
        </FormModal>

        {/* Send Invoice Modal */}
        {selectedInvoice && (
          <FormModal
            isOpen={showSendModal}
            onClose={() => setShowSendModal(false)}
            title="Send Invoice"
            description={`${selectedInvoice.invoiceNumber} - ${selectedInvoice.customerName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                <p className="text-sm text-info-900 dark:text-info-400">
                  This invoice will be sent to {selectedInvoice.customerName} via email.
                  The invoice status will be updated to "Sent".
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Total Amount
                  </span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    AED {selectedInvoice.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Due Date
                  </span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatDate(selectedInvoice.dueDate)}
                  </span>
                </div>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSendInvoice}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Invoice
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Create Invoice Modal */}
        <FormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Invoice"
          description="Generate a new invoice for a customer"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="customerName" required>
                  Customer Name
                </FormLabel>
                <FormInput
                  id="customerName"
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="customerID" required>
                  Customer ID
                </FormLabel>
                <FormInput
                  id="customerID"
                  type="text"
                  value={newCustomerID}
                  onChange={(e) => setNewCustomerID(e.target.value)}
                  placeholder="Enter customer ID"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="dueDate" required>
                  Due Date
                </FormLabel>
                <FormInput
                  id="dueDate"
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="paymentTerms" required>
                  Payment Terms
                </FormLabel>
                <FormSelect
                  id="paymentTerms"
                  value={newPaymentTerms}
                  onChange={(e) => setNewPaymentTerms(e.target.value)}
                >
                  <option value="">Select payment terms</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </FormSelect>
              </FormField>
            </div>

            <FormField>
              <FormLabel htmlFor="notes">Notes (Optional)</FormLabel>
              <FormTextarea
                id="notes"
                rows={3}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Add any additional notes..."
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
              onClick={() => {
                toast.success("Invoice created successfully");
                setShowCreateModal(false);
              }}
              className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Invoice
            </button>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}
