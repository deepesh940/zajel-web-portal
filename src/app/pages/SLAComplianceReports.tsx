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

export default function SLAComplianceReports() {
  const [dateRange, setDateRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [slaType, setSlaType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sample data for SLA compliance report
  const reportData = [
    {
      slaCategory: "Initial Response Time",
      target: "< 2 hours",
      totalCount: 1247,
      metCount: 1189,
      atRiskCount: 45,
      breachedCount: 13,
      complianceRate: "95.4%",
      avgActualTime: "1.2 hrs",
      improvement: "+2.1%",
      type: "operational",
    },
    {
      slaCategory: "Quote Generation Time",
      target: "< 4 hours",
      totalCount: 1247,
      metCount: 1158,
      atRiskCount: 62,
      breachedCount: 27,
      complianceRate: "92.9%",
      avgActualTime: "2.5 hrs",
      improvement: "+1.5%",
      type: "operational",
    },
    {
      slaCategory: "Quote Approval Time",
      target: "< 24 hours",
      totalCount: 1089,
      metCount: 1045,
      atRiskCount: 28,
      breachedCount: 16,
      complianceRate: "96.0%",
      avgActualTime: "18.3 hrs",
      improvement: "+0.8%",
      type: "operational",
    },
    {
      slaCategory: "Driver Assignment Time",
      target: "< 2 hours",
      totalCount: 1089,
      metCount: 1042,
      atRiskCount: 35,
      breachedCount: 12,
      complianceRate: "95.7%",
      avgActualTime: "1.4 hrs",
      improvement: "+1.2%",
      type: "operational",
    },
    {
      slaCategory: "Pickup Time Adherence",
      target: "Within 30 min window",
      totalCount: 1089,
      metCount: 1065,
      atRiskCount: 18,
      breachedCount: 6,
      complianceRate: "97.8%",
      avgActualTime: "12 min variance",
      improvement: "+0.5%",
      type: "operational",
    },
    {
      slaCategory: "Delivery Time Adherence",
      target: "Within scheduled time",
      totalCount: 1089,
      metCount: 1053,
      atRiskCount: 24,
      breachedCount: 12,
      complianceRate: "96.7%",
      avgActualTime: "15 min variance",
      improvement: "+1.8%",
      type: "operational",
    },
    {
      slaCategory: "POD Submission Time",
      target: "< 1 hour post-delivery",
      totalCount: 1053,
      metCount: 1021,
      atRiskCount: 22,
      breachedCount: 10,
      complianceRate: "97.0%",
      avgActualTime: "35 min",
      improvement: "+2.3%",
      type: "operational",
    },
    {
      slaCategory: "Issue Resolution Time",
      target: "< 24 hours",
      totalCount: 87,
      metCount: 79,
      atRiskCount: 5,
      breachedCount: 3,
      complianceRate: "90.8%",
      avgActualTime: "16.5 hrs",
      improvement: "+3.2%",
      type: "customer-service",
    },
    {
      slaCategory: "Customer Query Response",
      target: "< 1 hour",
      totalCount: 543,
      metCount: 518,
      atRiskCount: 18,
      breachedCount: 7,
      complianceRate: "95.4%",
      avgActualTime: "42 min",
      improvement: "+1.9%",
      type: "customer-service",
    },
    {
      slaCategory: "Invoice Generation Time",
      target: "< 48 hours post-delivery",
      totalCount: 1053,
      metCount: 1032,
      atRiskCount: 15,
      breachedCount: 6,
      complianceRate: "98.0%",
      avgActualTime: "28.5 hrs",
      improvement: "+0.7%",
      type: "financial",
    },
  ];

  const stats = [
    {
      label: "Overall SLA Compliance",
      value: "95.8%",
      icon: "CheckCircle",
      subtitle: "+1.5% improvement",
    },
    {
      label: "SLAs Met",
      value: 9202,
      icon: "TrendingUp",
      subtitle: "of 9,597 total",
    },
    {
      label: "At Risk",
      value: 272,
      icon: "AlertCircle",
      subtitle: "-18 vs last period",
    },
    {
      label: "Breached",
      value: 123,
      icon: "XCircle",
      subtitle: "-12 vs last period",
    },
  ];

  const slaTypeOptions = [
    { value: "all", label: "All SLA Types", count: 25 },
    { value: "operational", label: "Operational SLAs", count: 15 },
    { value: "customer-service", label: "Customer Service SLAs", count: 6 },
    { value: "financial", label: "Financial SLAs", count: 4 },
  ];

  const getSlaStatusColor = (complianceRate: string) => {
    const rate = parseFloat(complianceRate);
    if (rate >= 95) return "text-success-600 dark:text-success-400";
    if (rate >= 90) return "text-warning-600 dark:text-warning-400";
    return "text-danger-600 dark:text-danger-400";
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
          title="SLA Compliance Reports"
          subtitle="Service Level Agreement performance and compliance tracking"
          breadcrumbs={[
            { label: "Reports", href: "#" },
            { label: "SLA Compliance", current: true },
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
            placeholder="Search SLA categories..."
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
            currentStatus={slaType}
            statuses={slaTypeOptions}
            onChange={setSlaType}
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
                    SLA Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Total Count
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Met
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    At Risk
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Breached
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Compliance Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Avg Actual Time
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {reportData
                  .filter((row) => {
                    if (slaType !== "all" && row.type !== slaType) return false;
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase();
                      return (
                        row.slaCategory.toLowerCase().includes(query) ||
                        row.target.toLowerCase().includes(query)
                      );
                    }
                    return true;
                  })
                  .map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {row.slaCategory}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.target}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-neutral-700 dark:text-neutral-300">
                        {row.totalCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-success-600 dark:text-success-400 font-medium">
                        {row.metCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-warning-600 dark:text-warning-400 font-medium">
                        {row.atRiskCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-danger-600 dark:text-danger-400 font-medium">
                        {row.breachedCount}
                      </td>
                      <td className={`px-4 py-3 text-sm text-center font-semibold ${getSlaStatusColor(row.complianceRate)}`}>
                        {row.complianceRate}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {row.avgActualTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-success-600 dark:text-success-400 font-medium">
                        {row.improvement}
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
          totalItems={25}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
