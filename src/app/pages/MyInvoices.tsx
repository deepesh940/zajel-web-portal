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
    Printer,
    Copy,
    BarChart3,
    RefreshCw,
    User,
    Receipt,
    Search,
    MoreVertical,
    CreditCard,
    Smartphone,
    Building2,
    ShieldCheck,
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
    type: "Proforma" | "Final";
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }[];
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    balanceDue: number;
    relatedQuote?: string;
}

type ViewMode = "grid" | "list" | "table";

export default function MyInvoices() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "wallet">("card");
    const [showSummary, setShowSummary] = useState(true);
    const [filters, setFilters] = useState<FilterCondition[]>([]);
    const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Sorting state
    const [sortField, setSortField] = useState<string>("invoiceDate");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const [invoices, setInvoices] = useState<Invoice[]>([
        {
            id: "1",
            invoiceNumber: "INV-2024-001",
            customerName: "Deepesh",
            customerID: "CUST-456",
            invoiceDate: "2024-01-20",
            dueDate: "2024-02-04",
            status: "Paid",
            type: "Final",
            items: [
                {
                    description: "Service Charge - Dubai to Abu Dhabi",
                    quantity: 1,
                    unitPrice: 850,
                    amount: 850,
                },
            ],
            subtotal: 850,
            taxAmount: 42.5,
            totalAmount: 892.5,
            balanceDue: 0,
        },
        {
            id: "2",
            invoiceNumber: "PROF-2024-002",
            customerName: "Deepesh",
            customerID: "CUST-456",
            invoiceDate: "2024-01-28",
            dueDate: "2024-02-12",
            status: "Sent",
            type: "Proforma",
            items: [
                {
                    description: "Quotation PROF-2024-002",
                    quantity: 1,
                    unitPrice: 1200,
                    amount: 1200,
                },
            ],
            subtotal: 1200,
            taxAmount: 60,
            totalAmount: 1260,
            balanceDue: 1260,
            relatedQuote: "QUO-2024-8901",
        },
    ]);

    const filterOptions = [
        {
            id: "status",
            label: "Status",
            type: "select",
            options: [
                { value: "Draft", label: "Draft" },
                { value: "Sent", label: "Sent" },
                { value: "Paid", label: "Paid" },
                { value: "Overdue", label: "Overdue" },
            ],
        },
        {
            id: "type",
            label: "Invoice Type",
            type: "select",
            options: [
                { value: "Proforma", label: "Proforma" },
                { value: "Final", label: "Final" },
            ],
        },
    ];

    const filteredInvoices = invoices.filter((inv) => {
        const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const getStatusColor = (status: string): "success" | "warning" | "error" | "info" | "neutral" => {
        switch (status) {
            case "Paid": return "success";
            case "Sent": return "info";
            case "Overdue": return "error";
            default: return "neutral";
        }
    };

    const getStatusBadge = (status: string) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status) === "success" ? "bg-success-500" :
                getStatusColor(status) === "info" ? "bg-info-500" :
                    getStatusColor(status) === "error" ? "bg-error-500" : "bg-neutral-400"
                }`}></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
        </span>
    );

    const stats = [
        {
            label: "Total Invoices",
            value: invoices.length,
            icon: "FileText",
            subtitle: "All records",
        },
        {
            label: "Awaiting Payment",
            value: invoices.filter(i => i.status === "Sent").length,
            icon: "Clock",
            subtitle: "Sent to you",
        },
        {
            label: "Total Paid",
            value: `AED ${invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}`,
            icon: "CheckCircle",
            subtitle: "Completed",
        },
        {
            label: "Outstanding",
            value: `AED ${invoices.filter(i => i.status !== "Paid").reduce((sum, i) => sum + i.balanceDue, 0).toLocaleString()}`,
            icon: "DollarSign",
            subtitle: "Pending payment",
        },
    ];

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

    const handleViewInvoiceDetails = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailsModal(true);
        setOpenActionMenuId(null);
    };

    const handleOpenPayment = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setShowPayModal(true);
        setPaymentStatus("idle");
        setOpenActionMenuId(null);
    };

    const handleConfirmPayment = () => {
        setPaymentStatus("processing");
        // Simulate payment processing
        setTimeout(() => {
            setPaymentStatus("success");
            if (selectedInvoice) {
                setInvoices(prev => prev.map(inv =>
                    inv.id === selectedInvoice.id ? { ...inv, status: "Paid", balanceDue: 0 } : inv
                ));
            }
            toast.success("Payment Received Successfully!");
        }, 2000);
    };

    return (
        <div className="px-6 py-8 bg-white dark:bg-neutral-950">
            <div className="max-w-[100%] mx-auto">
                <PageHeader
                    title="My Invoices"
                    subtitle="View and manage your proforma and final invoices"
                    breadcrumbs={[
                        { label: "Customer Portal", href: "#" },
                        { label: "My Invoices", current: true },
                    ]}
                >
                    <div className="relative">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onAdvancedSearch={() => setShowAdvancedSearch(true)}
                            placeholder="Search invoices..."
                        />
                    </div>
                    <IconButton icon={BarChart3} onClick={() => setShowSummary(!showSummary)} active={showSummary} />
                    <IconButton icon={RefreshCw} onClick={() => toast.success("Refreshed")} />
                    <ViewModeSwitcher currentMode={viewMode} onChange={setViewMode} />
                </PageHeader>

                {showSummary && <SummaryWidgets widgets={stats} />}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {filteredInvoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                            onClick={() => handleViewInvoiceDetails(invoice)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                                        {invoice.invoiceNumber}
                                    </h3>
                                    <span className="text-xs text-neutral-500 mt-1 block">
                                        {invoice.type} Invoice
                                    </span>
                                </div>
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
                                                        handleViewInvoiceDetails(invoice);
                                                    }}
                                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Details
                                                </button>

                                                {invoice.status !== "Paid" && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenPayment(invoice);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                                    >
                                                        <DollarSign className="w-4 h-4" />
                                                        Pay Now
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
                                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download PDF
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>Date: {invoice.invoiceDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    <FileText className="w-4 h-4" />
                                    <span>Due: {invoice.dueDate}</span>
                                </div>
                            </div>

                            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-primary-700 dark:text-primary-400">Total Amount</div>
                                        <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                            AED {invoice.totalAmount.toLocaleString()}
                                        </div>
                                    </div>
                                    {invoice.balanceDue > 0 && (
                                        <div className="text-right">
                                            <div className="text-xs text-neutral-600 dark:text-neutral-400">Balance Due</div>
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

                {showPayModal && selectedInvoice && (
                    <FormModal
                        title={`Complete Payment: ${selectedInvoice.invoiceNumber}`}
                        isOpen={showPayModal}
                        onClose={() => setShowPayModal(false)}
                        maxWidth="max-w-md"
                    >
                        {paymentStatus === "success" ? (
                            <div className="py-8 text-center">
                                <div className="w-20 h-20 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-12 h-12 text-success-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Payment Successful!</h3>
                                <p className="text-neutral-500 mb-8">Thank you for your payment. Your invoice has been marked as paid.</p>
                                <button
                                    onClick={() => setShowPayModal(false)}
                                    className="w-full py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Invoice Summary */}
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-neutral-500">Invoice Amount</span>
                                        <span className="font-semibold text-neutral-900 dark:text-white">AED {selectedInvoice.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-neutral-400">
                                        <span>Reference: {selectedInvoice.invoiceNumber}</span>
                                        <span>VAT (5%) Included</span>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Select Payment Method</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setPaymentMethod("card")}
                                            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === "card" ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "border-neutral-200 dark:border-neutral-800 hover:border-primary-400"}`}
                                        >
                                            <CreditCard className="w-6 h-6" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Card</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod("bank")}
                                            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === "bank" ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "border-neutral-200 dark:border-neutral-800 hover:border-primary-400"}`}
                                        >
                                            <Building2 className="w-6 h-6" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Bank</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod("wallet")}
                                            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === "wallet" ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "border-neutral-200 dark:border-neutral-800 hover:border-primary-400"}`}
                                        >
                                            <Smartphone className="w-6 h-6" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Wallet</span>
                                        </button>
                                    </div>
                                </div>

                                {paymentMethod === "card" && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div>
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1 block">Card Number</label>
                                            <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1 block">Expiry</label>
                                                <input type="text" placeholder="MM/YY" className="w-full p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1 block">CVV</label>
                                                <input type="text" placeholder="XXX" className="w-full p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === "bank" && (
                                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-xs text-neutral-500 mb-3">Please transfer the amount to the following bank account:</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-neutral-400">Account Name:</span>
                                                <span className="font-medium">Zajel Logistics LLC</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-400">Bank:</span>
                                                <span className="font-medium">Emirates NBD</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-400">IBAN:</span>
                                                <span className="font-mono text-xs">AE73 0020 0000 1234 5678 901</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === "wallet" && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <button className="w-full p-4 bg-black text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-neutral-900 transition-colors">
                                            <Smartphone className="w-5 h-5 text-white" />
                                            Pay with Apple Pay
                                        </button>
                                        <button className="w-full p-4 bg-white border border-neutral-200 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-neutral-50 transition-colors text-neutral-900">
                                            <Search className="w-5 h-5 text-primary-600" />
                                            Pay with Google Pay
                                        </button>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button
                                        onClick={handleConfirmPayment}
                                        disabled={paymentStatus === "processing"}
                                        className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary-500/20"
                                    >
                                        {paymentStatus === "processing" ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-5 h-5" />
                                                Secure Payment - AED {selectedInvoice.totalAmount.toLocaleString()}
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-[10px] text-neutral-400 mt-4 flex items-center justify-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        PCI-DSS Compliant • Encrypted Transaction
                                    </p>
                                </div>
                            </div>
                        )}
                    </FormModal>
                )}

                {showDetailsModal && selectedInvoice && (
                    <FormModal
                        title={`Invoice Details: ${selectedInvoice.invoiceNumber}`}
                        isOpen={showDetailsModal}
                        onClose={() => setShowDetailsModal(false)}
                        maxWidth="max-w-2xl"
                    >
                        <div className="space-y-6">
                            <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold">{selectedInvoice.invoiceNumber}</h2>
                                    <p className="text-sm text-neutral-500">{selectedInvoice.type} Invoice</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">Issue Date: {selectedInvoice.invoiceDate}</p>
                                    <p className="text-sm text-neutral-500">Due Date: {selectedInvoice.dueDate}</p>
                                </div>
                            </div>

                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200">
                                    <tr>
                                        <th className="py-2">Description</th>
                                        <th className="py-2 text-right">Qty</th>
                                        <th className="py-2 text-right">Unit Price</th>
                                        <th className="py-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-neutral-100 last:border-0">
                                            <td className="py-3">{item.description}</td>
                                            <td className="py-3 text-right">{item.quantity}</td>
                                            <td className="py-3 text-right">AED {item.unitPrice.toLocaleString()}</td>
                                            <td className="py-3 text-right">AED {item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-end pt-4 border-t border-neutral-200">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">Subtotal</span>
                                        <span>AED {selectedInvoice.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">VAT (5%)</span>
                                        <span>AED {selectedInvoice.taxAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-neutral-100">
                                        <span>Total</span>
                                        <span>AED {selectedInvoice.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormModal>
                )}
            </div>
        </div>
    );
}
