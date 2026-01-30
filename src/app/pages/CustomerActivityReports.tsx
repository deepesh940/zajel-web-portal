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

export default function CustomerActivityReports() {
  const [dateRange, setDateRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [customerType, setCustomerType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sample data for customer activity report
  const reportData = [
    {
      customerId: "CUST-001",
      customerName: "Al Futtaim Group",
      totalInquiries: 145,
      quotesReceived: 132,
      quotesAccepted: 118,
      conversionRate: "89.4%",
      totalRevenue: "AED 285,000",
      avgOrderValue: "AED 2,415",
      deliveriesCompleted: 115,
      deliverySuccessRate: "97.5%",
      lastActivity: "2024-01-28",
      type: "enterprise",
    },
    {
      customerId: "CUST-002",
      customerName: "Emirates Group",
      totalInquiries: 128,
      quotesReceived: 118,
      quotesAccepted: 105,
      conversionRate: "89.0%",
      totalRevenue: "AED 268,000",
      avgOrderValue: "AED 2,552",
      deliveriesCompleted: 102,
      deliverySuccessRate: "97.1%",
      lastActivity: "2024-01-28",
      type: "enterprise",
    },
    {
      customerId: "CUST-003",
      customerName: "Majid Al Futtaim",
      totalInquiries: 112,
      quotesReceived: 105,
      quotesAccepted: 92,
      conversionRate: "87.6%",
      totalRevenue: "AED 245,000",
      avgOrderValue: "AED 2,663",
      deliveriesCompleted: 89,
      deliverySuccessRate: "96.7%",
      lastActivity: "2024-01-27",
      type: "enterprise",
    },
    {
      customerId: "CUST-004",
      customerName: "Dubai Properties",
      totalInquiries: 98,
      quotesReceived: 89,
      quotesAccepted: 78,
      conversionRate: "87.6%",
      totalRevenue: "AED 198,000",
      avgOrderValue: "AED 2,538",
      deliveriesCompleted: 75,
      deliverySuccessRate: "96.2%",
      lastActivity: "2024-01-27",
      type: "sme",
    },
    {
      customerId: "CUST-005",
      customerName: "ADNOC Distribution",
      totalInquiries: 87,
      quotesReceived: 82,
      quotesAccepted: 72,
      conversionRate: "87.8%",
      totalRevenue: "AED 189,000",
      avgOrderValue: "AED 2,625",
      deliveriesCompleted: 70,
      deliverySuccessRate: "97.2%",
      lastActivity: "2024-01-26",
      type: "enterprise",
    },
    {
      customerId: "CUST-006",
      customerName: "Emaar Properties",
      totalInquiries: 76,
      quotesReceived: 71,
      quotesAccepted: 63,
      conversionRate: "88.7%",
      totalRevenue: "AED 175,000",
      avgOrderValue: "AED 2,778",
      deliveriesCompleted: 61,
      deliverySuccessRate: "96.8%",
      lastActivity: "2024-01-26",
      type: "enterprise",
    },
    {
      customerId: "CUST-007",
      customerName: "DP World",
      totalInquiries: 69,
      quotesReceived: 65,
      quotesAccepted: 58,
      conversionRate: "89.2%",
      totalRevenue: "AED 168,000",
      avgOrderValue: "AED 2,897",
      deliveriesCompleted: 56,
      deliverySuccessRate: "96.6%",
      lastActivity: "2024-01-25",
      type: "enterprise",
    },
    {
      customerId: "CUST-008",
      customerName: "Etisalat by e&",
      totalInquiries: 64,
      quotesReceived: 59,
      quotesAccepted: 52,
      conversionRate: "88.1%",
      totalRevenue: "AED 152,000",
      avgOrderValue: "AED 2,923",
      deliveriesCompleted: 50,
      deliverySuccessRate: "96.2%",
      lastActivity: "2024-01-25",
      type: "enterprise",
    },
  ];

  const stats = [
    {
      label: "Active Customers",
      value: 247,
      icon: "Users",
      subtitle: "+8 new this period",
    },
    {
      label: "Avg Conversion Rate",
      value: "88.4%",
      icon: "TrendingUp",
      subtitle: "+1.2% improvement",
    },
    {
      label: "Total Revenue",
      value: "AED 1.68M",
      icon: "DollarSign",
      subtitle: "+15.8% vs last period",
    },
    {
      label: "Avg Order Value",
      value: "AED 2,674",
      icon: "Receipt",
      subtitle: "+5.3% vs last period",
    },
  ];

  const customerTypeOptions = [
    { value: "all", label: "All Customers", count: 247 },
    { value: "enterprise", label: "Enterprise", count: 150 },
    { value: "sme", label: "SME", count: 75 },
    { value: "individual", label: "Individual", count: 22 },
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
          title="Customer Activity Reports"
          subtitle="Customer engagement and order performance analysis"
          breadcrumbs={[
            { label: "Reports", href: "#" },
            { label: "Customer Activity", current: true },
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
            placeholder="Search customers..."
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
            currentStatus={customerType}
            statuses={customerTypeOptions}
            onChange={setCustomerType}
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
                    Customer ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Inquiries
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Quotes Received
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Quotes Accepted
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Avg Order Value
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Deliveries
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {reportData
                  .filter((row) => {
                    if (customerType !== "all" && row.type !== customerType) return false;
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase();
                      return (
                        row.customerId.toLowerCase().includes(query) ||
                        row.customerName.toLowerCase().includes(query)
                      );
                    }
                    return true;
                  })
                  .map((row) => (
                    <tr
                      key={row.customerId}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400">
                        {row.customerId}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {row.customerName}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-neutral-700 dark:text-neutral-300">
                        {row.totalInquiries}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-neutral-700 dark:text-neutral-300">
                        {row.quotesReceived}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-success-600 dark:text-success-400 font-medium">
                        {row.quotesAccepted}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-neutral-700 dark:text-neutral-300 font-medium">
                        {row.conversionRate}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-primary-600 dark:text-primary-400 font-semibold">
                        {row.totalRevenue}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-700 dark:text-neutral-300">
                        {row.avgOrderValue}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-neutral-700 dark:text-neutral-300">
                        {row.deliveriesCompleted}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-success-600 dark:text-success-400 font-medium">
                        {row.deliverySuccessRate}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.lastActivity}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== PAGINATION ========== */}
        <Pagination
          currentPage={currentPage}
          totalItems={247}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
