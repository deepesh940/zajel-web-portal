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

export default function OperationalReports() {
  const [dateRange, setDateRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sample data for operational report
  const reportData = [
    {
      id: "INQ-2024-1234",
      date: "2024-01-28",
      customer: "Al Futtaim Group",
      origin: "Dubai",
      destination: "Abu Dhabi",
      service: "Express Delivery",
      status: "Delivered",
      responseTime: "1.2 hrs",
      quoteTime: "2.5 hrs",
      deliveryTime: "4.8 hrs",
      slaStatus: "Met",
    },
    {
      id: "INQ-2024-1235",
      date: "2024-01-28",
      customer: "Emirates Group",
      origin: "Sharjah",
      destination: "Dubai",
      service: "Standard Delivery",
      status: "In Transit",
      responseTime: "0.8 hrs",
      quoteTime: "1.5 hrs",
      deliveryTime: "-",
      slaStatus: "On Track",
    },
    {
      id: "INQ-2024-1236",
      date: "2024-01-27",
      customer: "Majid Al Futtaim",
      origin: "Abu Dhabi",
      destination: "Al Ain",
      service: "Same Day Delivery",
      status: "Delivered",
      responseTime: "2.1 hrs",
      quoteTime: "3.2 hrs",
      deliveryTime: "6.5 hrs",
      slaStatus: "Breached",
    },
    {
      id: "INQ-2024-1237",
      date: "2024-01-27",
      customer: "Dubai Properties",
      origin: "Dubai",
      destination: "Fujairah",
      service: "Express Delivery",
      status: "Delivered",
      responseTime: "0.9 hrs",
      quoteTime: "1.8 hrs",
      deliveryTime: "5.2 hrs",
      slaStatus: "Met",
    },
    {
      id: "INQ-2024-1238",
      date: "2024-01-27",
      customer: "ADNOC Distribution",
      origin: "Abu Dhabi",
      destination: "Dubai",
      service: "Standard Delivery",
      status: "Pending Quote",
      responseTime: "1.5 hrs",
      quoteTime: "-",
      deliveryTime: "-",
      slaStatus: "At Risk",
    },
    {
      id: "INQ-2024-1239",
      date: "2024-01-26",
      customer: "Emaar Properties",
      origin: "Dubai",
      destination: "Ras Al Khaimah",
      service: "Express Delivery",
      status: "Delivered",
      responseTime: "1.1 hrs",
      quoteTime: "2.2 hrs",
      deliveryTime: "4.5 hrs",
      slaStatus: "Met",
    },
    {
      id: "INQ-2024-1240",
      date: "2024-01-26",
      customer: "DP World",
      origin: "Jebel Ali",
      destination: "Abu Dhabi",
      service: "Standard Delivery",
      status: "Delivered",
      responseTime: "0.7 hrs",
      quoteTime: "1.9 hrs",
      deliveryTime: "7.2 hrs",
      slaStatus: "Met",
    },
    {
      id: "INQ-2024-1241",
      date: "2024-01-25",
      customer: "Etisalat by e&",
      origin: "Dubai",
      destination: "Sharjah",
      service: "Same Day Delivery",
      status: "Delivered",
      responseTime: "1.3 hrs",
      quoteTime: "2.8 hrs",
      deliveryTime: "3.9 hrs",
      slaStatus: "Met",
    },
  ];

  const stats = [
    {
      label: "Total Inquiries",
      value: 1247,
      icon: "Package",
      subtitle: "+12.5% vs last period",
    },
    {
      label: "Avg Response Time",
      value: "1.2 hrs",
      icon: "Clock",
      subtitle: "-15.3% (improved)",
    },
    {
      label: "SLA Compliance",
      value: "94.5%",
      icon: "CheckCircle",
      subtitle: "+2.8% vs last period",
    },
    {
      label: "Deliveries Completed",
      value: 1089,
      icon: "TrendingUp",
      subtitle: "+8.7% vs last period",
    },
  ];

  const serviceFilterOptions = [
    { value: "all", label: "All Services", count: 1247 },
    { value: "express", label: "Express Delivery", count: 450 },
    { value: "standard", label: "Standard Delivery", count: 520 },
    { value: "same-day", label: "Same Day Delivery", count: 277 },
  ];

  const statusFilterOptions = [
    { value: "all", label: "All Statuses", count: 1247 },
    { value: "delivered", label: "Delivered", count: 1089 },
    { value: "in-transit", label: "In Transit", count: 95 },
    { value: "pending", label: "Pending Quote", count: 63 },
  ];

  const getSlaStatusColor = (status: string) => {
    switch (status) {
      case "Met":
        return "bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800";
      case "Breached":
        return "bg-danger-50 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 border-danger-200 dark:border-danger-800";
      case "At Risk":
        return "bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 border-warning-200 dark:border-warning-800";
      case "On Track":
        return "bg-info-50 dark:bg-info-900/30 text-info-700 dark:text-info-300 border-info-200 dark:border-info-800";
      default:
        return "bg-neutral-50 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800";
      case "In Transit":
        return "bg-info-50 dark:bg-info-900/30 text-info-700 dark:text-info-300 border-info-200 dark:border-info-800";
      case "Pending Quote":
        return "bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 border-warning-200 dark:border-warning-800";
      default:
        return "bg-neutral-50 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800";
    }
  };

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
          title="Operational Reports"
          subtitle="Comprehensive operational performance and SLA tracking"
          breadcrumbs={[
            { label: "Reports", href: "#" },
            { label: "Operational Reports", current: true },
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
            placeholder="Search inquiries..."
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
            currentStatus={serviceFilter}
            statuses={serviceFilterOptions}
            onChange={setServiceFilter}
          />

          <StatusFilter
            currentStatus={deliveryStatusFilter}
            statuses={statusFilterOptions}
            onChange={setDeliveryStatusFilter}
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
                    Inquiry ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Response Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Quote Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Delivery Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    SLA Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {reportData
                  .filter((row) => {
                    // Filter by service
                    if (serviceFilter !== "all") {
                      const serviceMap: Record<string, string> = {
                        express: "Express Delivery",
                        standard: "Standard Delivery",
                        "same-day": "Same Day Delivery",
                      };
                      if (row.service !== serviceMap[serviceFilter]) return false;
                    }
                    // Filter by delivery status
                    if (deliveryStatusFilter !== "all") {
                      const statusMap: Record<string, string> = {
                        delivered: "Delivered",
                        "in-transit": "In Transit",
                        pending: "Pending Quote",
                      };
                      if (row.status !== statusMap[deliveryStatusFilter]) return false;
                    }
                    // Filter by search query
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase();
                      return (
                        row.id.toLowerCase().includes(query) ||
                        row.customer.toLowerCase().includes(query) ||
                        row.origin.toLowerCase().includes(query) ||
                        row.destination.toLowerCase().includes(query)
                      );
                    }
                    return true;
                  })
                  .map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400">
                        {row.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.customer}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.origin} → {row.destination}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.service}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.responseTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.quoteTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.deliveryTime}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getSlaStatusColor(
                            row.slaStatus
                          )}`}
                        >
                          {row.slaStatus}
                        </span>
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
