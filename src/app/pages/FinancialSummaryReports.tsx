import { useState } from "react";
import { Calendar, RefreshCw, BarChart3 } from "lucide-react";
import {
  PageHeader,
  IconButton,
  SummaryWidgets,
  SearchBar,
  Pagination,
  StatusFilter,
  DateRangeFilter,
} from "../components/hb/listing";
import { toast } from "sonner";

export default function FinancialSummaryReports() {
  const [dateRange, setDateRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [reportType, setReportType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sample data for financial summary report
  const reportData = [
    {
      month: "January 2024",
      totalRevenue: "AED 1,245,000",
      totalInvoiced: "AED 1,180,000",
      totalReceived: "AED 1,050,000",
      pendingReceivables: "AED 130,000",
      driverPayables: "AED 780,000",
      netProfit: "AED 465,000",
      profitMargin: "37.3%",
      invoicesIssued: 247,
      invoicesPaid: 218,
      invoicesPending: 29,
    },
    {
      month: "December 2023",
      totalRevenue: "AED 1,189,000",
      totalInvoiced: "AED 1,120,000",
      totalReceived: "AED 995,000",
      pendingReceivables: "AED 125,000",
      driverPayables: "AED 745,000",
      netProfit: "AED 444,000",
      profitMargin: "37.3%",
      invoicesIssued: 234,
      invoicesPaid: 205,
      invoicesPending: 29,
    },
    {
      month: "November 2023",
      totalRevenue: "AED 1,156,000",
      totalInvoiced: "AED 1,095,000",
      totalReceived: "AED 980,000",
      pendingReceivables: "AED 115,000",
      driverPayables: "AED 720,000",
      netProfit: "AED 436,000",
      profitMargin: "37.7%",
      invoicesIssued: 228,
      invoicesPaid: 198,
      invoicesPending: 30,
    },
    {
      month: "October 2023",
      totalRevenue: "AED 1,098,000",
      totalInvoiced: "AED 1,045,000",
      totalReceived: "AED 935,000",
      pendingReceivables: "AED 110,000",
      driverPayables: "AED 685,000",
      netProfit: "AED 413,000",
      profitMargin: "37.6%",
      invoicesIssued: 215,
      invoicesPaid: 189,
      invoicesPending: 26,
    },
    {
      month: "September 2023",
      totalRevenue: "AED 1,067,000",
      totalInvoiced: "AED 1,015,000",
      totalReceived: "AED 905,000",
      pendingReceivables: "AED 110,000",
      driverPayables: "AED 665,000",
      netProfit: "AED 402,000",
      profitMargin: "37.7%",
      invoicesIssued: 210,
      invoicesPaid: 184,
      invoicesPending: 26,
    },
    {
      month: "August 2023",
      totalRevenue: "AED 1,023,000",
      totalInvoiced: "AED 975,000",
      totalReceived: "AED 870,000",
      pendingReceivables: "AED 105,000",
      driverPayables: "AED 638,000",
      netProfit: "AED 385,000",
      profitMargin: "37.6%",
      invoicesIssued: 201,
      invoicesPaid: 176,
      invoicesPending: 25,
    },
  ];

  const stats = [
    {
      label: "Total Revenue (6M)",
      value: "AED 6.78M",
      icon: "DollarSign",
      subtitle: "+15.8% vs previous 6M",
    },
    {
      label: "Net Profit (6M)",
      value: "AED 2.55M",
      icon: "TrendingUp",
      subtitle: "+14.2% vs previous 6M",
    },
    {
      label: "Avg Profit Margin",
      value: "37.5%",
      icon: "BarChart3",
      subtitle: "+0.5% vs previous 6M",
    },
    {
      label: "Collection Rate",
      value: "89.3%",
      icon: "CheckCircle",
      subtitle: "-1.2% vs previous 6M",
    },
  ];

  const reportTypeOptions = [
    { value: "all", label: "All Periods", count: 12 },
    { value: "summary", label: "Summary View", count: 12 },
    { value: "detailed", label: "Detailed View", count: 12 },
    { value: "comparison", label: "Comparison View", count: 12 },
  ];

  const handleRefreshData = () => {
    toast.success("Refreshing data...");
  };

  const handleDateRangeApply = (start: string, end: string, label?: string) => {
    setStartDate(start);
    setEndDate(end);
    setDateRange(label || `${start} to ${end}`);
    toast.success(`Date range applied: ${label || `${start} to ${end}`}`);
  };

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Financial Summary Reports"
          subtitle="Monthly financial performance and profitability analysis"
          breadcrumbs={[
            { label: "Reports", href: "#" },
            { label: "Financial Summary", current: true },
          ]}
          moreMenu={{
            exportOptions: {
              onExportCSV: () => toast.success("Exporting as CSV..."),
              onExportExcel: () => toast.success("Exporting as Excel..."),
              onExportPDF: () => toast.success("Exporting as PDF..."),
            },
            onPrint: () => window.print(),
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search periods..."
          />

          <div className="relative">
            <IconButton
              icon={Calendar}
              onClick={() => setShowDateRangePicker(!showDateRangePicker)}
              tooltip={dateRange || "Select Date Range"}
              active={!!dateRange}
            />
            <DateRangeFilter
              isOpen={showDateRangePicker}
              onClose={() => setShowDateRangePicker(false)}
              startDate={startDate}
              endDate={endDate}
              onApply={handleDateRangeApply}
            />
          </div>

          <StatusFilter
            currentStatus={reportType}
            statuses={reportTypeOptions}
            onChange={setReportType}
          />

          <IconButton
            icon={BarChart3}
            onClick={() => setShowSummary(!showSummary)}
            tooltip="Toggle Summary"
            active={showSummary}
          />

          <IconButton
            icon={RefreshCw}
            onClick={handleRefreshData}
            tooltip="Refresh Data"
          />
        </PageHeader>

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && (
          <SummaryWidgets widgets={stats} />
        )}

        {/* ========== TABULAR REPORT ========== */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Total Invoiced
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Total Received
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Pending Receivables
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Driver Payables
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Net Profit
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Profit Margin
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Invoices
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {reportData
                  .filter((row) => {
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase();
                      return row.month.toLowerCase().includes(query);
                    }
                    return true;
                  })
                  .map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {row.month}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-700 dark:text-neutral-300 font-medium">
                        {row.totalRevenue}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-700 dark:text-neutral-300">
                        {row.totalInvoiced}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-success-600 dark:text-success-400 font-medium">
                        {row.totalReceived}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-warning-600 dark:text-warning-400 font-medium">
                        {row.pendingReceivables}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-700 dark:text-neutral-300">
                        {row.driverPayables}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-primary-600 dark:text-primary-400 font-semibold">
                        {row.netProfit}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-700 dark:text-neutral-300 font-medium">
                        {row.profitMargin}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <div className="text-neutral-700 dark:text-neutral-300">
                          <span className="font-medium">{row.invoicesIssued}</span> issued
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {row.invoicesPaid} paid, {row.invoicesPending} pending
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="bg-neutral-100 dark:bg-neutral-800/50 border-t-2 border-neutral-300 dark:border-neutral-700">
                <tr className="font-semibold">
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    Total (6 Months)
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-neutral-900 dark:text-neutral-100">
                    AED 6,778,000
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-neutral-900 dark:text-neutral-100">
                    AED 6,430,000
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-success-600 dark:text-success-400">
                    AED 5,735,000
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-warning-600 dark:text-warning-400">
                    AED 695,000
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-neutral-900 dark:text-neutral-100">
                    AED 4,233,000
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-primary-600 dark:text-primary-400">
                    AED 2,545,000
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-neutral-900 dark:text-neutral-100">
                    37.5%
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-neutral-900 dark:text-neutral-100">
                    1,335 / 1,170 / 165
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ========== PAGINATION ========== */}
        <Pagination
          currentPage={currentPage}
          totalItems={12}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
