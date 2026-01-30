import { useState } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Truck,
  BarChart3,
  FileText,
  PieChart as PieChartIcon,
  RefreshCw,
  Eye,
  MoreVertical,
  Copy,
  Printer,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  PageHeader,
  IconButton,
  SummaryWidgets,
  ViewModeSwitcher,
  SearchBar,
  Pagination,
} from "../components/hb/listing";
import { FormSelect } from "../components/hb/common/Form";
import { toast } from "sonner";

type ViewMode = "grid" | "list" | "table";

export default function FinancialReports() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [dateRange, setDateRange] = useState("this-month");
  const [reportType, setReportType] = useState("overview");
  const [showSummary, setShowSummary] = useState(false);

  // Sample data for charts
  const monthlyRevenueData = [
    {
      month: "Jul",
      revenue: 245000,
      expenses: 185000,
      profit: 60000,
      receivables: 45000,
    },
    {
      month: "Aug",
      revenue: 268000,
      expenses: 192000,
      profit: 76000,
      receivables: 52000,
    },
    {
      month: "Sep",
      revenue: 289000,
      expenses: 198000,
      profit: 91000,
      receivables: 38000,
    },
    {
      month: "Oct",
      revenue: 312000,
      expenses: 205000,
      profit: 107000,
      receivables: 41000,
    },
    {
      month: "Nov",
      revenue: 295000,
      expenses: 201000,
      profit: 94000,
      receivables: 49000,
    },
    {
      month: "Dec",
      revenue: 334000,
      expenses: 218000,
      profit: 116000,
      receivables: 55000,
    },
    {
      month: "Jan",
      revenue: 356000,
      expenses: 225000,
      profit: 131000,
      receivables: 48000,
    },
  ];

  const customerSegmentData = [
    { name: "Enterprise", value: 450000, count: 12 },
    { name: "SME", value: 280000, count: 45 },
    { name: "Retail", value: 156000, count: 128 },
    { name: "Government", value: 385000, count: 8 },
  ];

  const serviceTypeData = [
    { name: "Express Delivery", revenue: 425000, trips: 856 },
    { name: "Standard Delivery", revenue: 358000, trips: 1024 },
    { name: "Same Day", revenue: 189000, trips: 345 },
    { name: "International", revenue: 299000, trips: 187 },
  ];

  const routePerformanceData = [
    { route: "Dubai - Abu Dhabi", trips: 245, revenue: 285000, profit: 68000 },
    { route: "Dubai - Sharjah", trips: 412, revenue: 198000, profit: 52000 },
    { route: "Abu Dhabi - Al Ain", trips: 156, revenue: 145000, profit: 38000 },
    { route: "Dubai - RAK", trips: 98, revenue: 125000, profit: 32000 },
    { route: "Sharjah - Fujairah", trips: 87, revenue: 98000, profit: 25000 },
  ];

  const COLORS = ["#174B7C", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const stats = [
    {
      label: "Total Revenue",
      value: "AED 356K",
      icon: "DollarSign",
      subtitle: "+18% from last month",
    },
    {
      label: "Net Profit",
      value: "AED 131K",
      icon: "TrendingUp",
      subtitle: "36.8% margin",
    },
    {
      label: "Total Trips",
      value: "2,412",
      icon: "Truck",
      subtitle: "+12% from last month",
    },
    {
      label: "Active Customers",
      value: "193",
      icon: "Users",
      subtitle: "15 new this month",
    },
  ];

  const reportsList = [
    {
      id: "1",
      name: "Monthly Revenue Report",
      description: "Comprehensive revenue breakdown by service type and customer segment",
      period: "January 2024",
      generatedDate: "2024-02-01",
      status: "Ready",
    },
    {
      id: "2",
      name: "Profit & Loss Statement",
      description: "Detailed P&L statement with operating expenses and net income",
      period: "Q4 2023",
      generatedDate: "2024-01-15",
      status: "Ready",
    },
    {
      id: "3",
      name: "Accounts Receivable Aging",
      description: "Outstanding invoices categorized by aging period",
      period: "As of Jan 31, 2024",
      generatedDate: "2024-02-01",
      status: "Ready",
    },
    {
      id: "4",
      name: "Driver Payables Summary",
      description: "Total driver payments by period with trip breakdowns",
      period: "January 2024",
      generatedDate: "2024-02-01",
      status: "Ready",
    },
    {
      id: "5",
      name: "Customer Performance Report",
      description: "Revenue analysis by customer with growth trends",
      period: "Last 6 Months",
      generatedDate: "2024-02-01",
      status: "Ready",
    },
    {
      id: "6",
      name: "Route Profitability Analysis",
      description: "Profitability metrics for all active routes",
      period: "January 2024",
      generatedDate: "2024-02-01",
      status: "Ready",
    },
  ];

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className="w-1.5 h-1.5 rounded-full bg-success-500"></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const handleDownloadReport = (reportName: string) => {
    toast.success(`Downloading ${reportName}`);
  };

  const handleCopyReportName = (reportName: string) => {
    navigator.clipboard.writeText(reportName);
    toast.success("Report name copied to clipboard");
  };

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Financial Reports"
          subtitle="Comprehensive financial analytics and reporting"
          breadcrumbs={[
            { label: "Finance", href: "#" },
            { label: "Financial Reports", current: true },
          ]}
          moreMenu={{
            onImport: () => toast.success("Import functionality"),
            exportOptions: {
              onExportCSV: () => toast.success("Exporting as CSV..."),
              onExportExcel: () => toast.success("Exporting as Excel..."),
              onExportPDF: () => toast.success("Exporting as PDF..."),
            },
            onPrint: () => window.print(),
          }}
        >
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="overview">Overview</option>
              <option value="revenue">Revenue</option>
              <option value="expenses">Expenses</option>
              <option value="profitability">Profitability</option>
              <option value="receivables">Receivables</option>
            </select>
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

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && <SummaryWidgets widgets={stats} />}

        {/* ========== CHARTS SECTION ========== */}
        <div className="space-y-6 mb-6">
          {/* Revenue & Profit Trend */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Revenue & Profit Trend
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Monthly performance over the last 7 months
                </p>
              </div>
              <button
                onClick={() => toast.success("Downloading chart...")}
                className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#174B7C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#174B7C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#174B7C"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue (AED)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  name="Profit (AED)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Segment & Service Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Segment Distribution */}
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Revenue by Customer Segment
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Distribution across customer types
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={customerSegmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerSegmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Service Type Performance */}
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Service Type Performance
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Revenue by service category
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={serviceTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9CA3AF" angle={-15} textAnchor="end" height={80} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#174B7C" name="Revenue (AED)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ========== REPORTS LIST ========== */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            Available Reports
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Pre-generated financial reports ready for download
          </p>
        </div>

        <div className="space-y-4">
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportsList.map((report) => (
                <div
                  key={report.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    {getStatusBadge(report.status)}
                  </div>

                  {/* Report Info */}
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                    {report.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                    {report.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{report.period}</span>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Generated: {report.generatedDate}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadReport(report.name)}
                      className="flex-1 px-3 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => toast.success(`Viewing ${report.name}`)}
                      className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {reportsList.map((report) => (
                <div
                  key={report.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            {report.name}
                          </h3>
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{report.period}</span>
                          </div>
                          <div className="text-xs">
                            Generated: {report.generatedDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toast.success(`Viewing ${report.name}`)}
                        className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadReport(report.name)}
                        className="px-3 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
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
                        Report Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Generated
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {reportsList.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {report.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
                            {report.description}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {report.period}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {report.generatedDate}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toast.success(`Viewing ${report.name}`)}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadReport(report.name)}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Route Performance Table */}
        <div className="mt-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Route Performance Analysis
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Top performing routes by revenue and profitability
              </p>
            </div>
            <button
              onClick={() => toast.success("Exporting route data...")}
              className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                    Route
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                    Trips
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                    Profit
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                    Margin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {routePerformanceData.map((route, index) => {
                  const margin = ((route.profit / route.revenue) * 100).toFixed(1);
                  return (
                    <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                      <td className="px-4 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                        {route.route}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-neutral-900 dark:text-white">
                        {route.trips}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-neutral-900 dark:text-white">
                        AED {route.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-success-600 dark:text-success-400">
                        AED {route.profit.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-semibold text-primary-600 dark:text-primary-400">
                        {margin}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}