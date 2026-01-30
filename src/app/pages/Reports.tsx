import { useState } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Clock,
  Users,
  BarChart3,
  Filter,
  RefreshCw,
  FileText,
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
import { PageHeader, IconButton } from "../components/hb/listing";
import { FormSelect } from "../components/hb/common/Form";
import { toast } from "sonner";

export default function Reports() {
  const [dateRange, setDateRange] = useState("last-7-days");
  const [reportType, setReportType] = useState("overview");
  const [serviceFilter, setServiceFilter] = useState("all-services");

  // Sample data for charts
  const dailyInquiriesData = [
    { day: "Mon", inquiries: 45, quotes: 38, approved: 28 },
    { day: "Tue", inquiries: 52, quotes: 45, approved: 35 },
    { day: "Wed", inquiries: 48, quotes: 42, approved: 32 },
    { day: "Thu", inquiries: 61, quotes: 55, approved: 42 },
    { day: "Fri", inquiries: 55, quotes: 48, approved: 38 },
    { day: "Sat", inquiries: 38, quotes: 32, approved: 25 },
    { day: "Sun", inquiries: 32, quotes: 28, approved: 20 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 245000, target: 250000 },
    { month: "Feb", revenue: 278000, target: 260000 },
    { month: "Mar", revenue: 312000, target: 280000 },
    { month: "Apr", revenue: 295000, target: 300000 },
    { month: "May", revenue: 338000, target: 320000 },
    { month: "Jun", revenue: 365000, target: 350000 },
  ];

  const serviceTypeData = [
    { name: "Express Delivery", value: 35, color: "#3b82f6" },
    { name: "Standard Delivery", value: 45, color: "#8b5cf6" },
    { name: "Same Day Delivery", value: 15, color: "#ec4899" },
    { name: "Scheduled Delivery", value: 5, color: "#f59e0b" },
  ];

  const slaPerformanceData = [
    { category: "Response Time", onTime: 85, atRisk: 12, breached: 3 },
    { category: "Quote Generation", onTime: 78, atRisk: 15, breached: 7 },
    { category: "Delivery Time", onTime: 92, atRisk: 6, breached: 2 },
    { category: "Issue Resolution", onTime: 88, atRisk: 9, breached: 3 },
  ];

  const performanceMetrics = [
    {
      title: "Total Inquiries",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: Package,
      color: "primary",
    },
    {
      title: "Revenue",
      value: "AED 1.83M",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      color: "success",
    },
    {
      title: "Avg Response Time",
      value: "1.2 hrs",
      change: "-15.3%",
      trend: "up",
      icon: Clock,
      color: "info",
    },
    {
      title: "Customer Satisfaction",
      value: "94.5%",
      change: "+2.8%",
      trend: "up",
      icon: Users,
      color: "success",
    },
  ];

  const topPerformers = [
    { name: "Ahmed Hassan", inquiries: 142, quotes: 128, conversion: 90.1 },
    { name: "Fatima Khan", inquiries: 138, quotes: 125, conversion: 90.6 },
    { name: "Omar Saleh", inquiries: 125, quotes: 108, conversion: 86.4 },
    { name: "Sarah Ahmed", inquiries: 118, quotes: 102, conversion: 86.4 },
  ];

  const escalationStats = [
    { type: "SLA Breach", count: 12, resolved: 8, pending: 4 },
    { type: "Customer Complaint", count: 8, resolved: 6, pending: 2 },
    { type: "Pricing Issue", count: 6, resolved: 5, pending: 1 },
    { type: "Operational Delay", count: 5, resolved: 4, pending: 1 },
  ];

  const getColorClass = (color: string) => {
    const colors = {
      primary: "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800",
      success: "text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/30 border-success-200 dark:border-success-800",
      info: "text-info-600 dark:text-info-400 bg-info-50 dark:bg-info-900/30 border-info-200 dark:border-info-800",
      warning: "text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/30 border-warning-200 dark:border-warning-800",
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  const handleExportReport = () => {
    toast.success("Exporting report...");
  };

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Reports & Analytics"
          subtitle="Comprehensive operational insights and performance metrics"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Reports & Analytics", current: true },
          ]}
          primaryAction={{
            label: "Export Report",
            onClick: handleExportReport,
            icon: Download,
          }}
          moreMenu={{
            exportOptions: {
              onExportCSV: () => toast.success("Exporting as CSV..."),
              onExportExcel: () => toast.success("Exporting as Excel..."),
              onExportPDF: () => toast.success("Exporting as PDF..."),
            },
            onPrint: () => window.print(),
          }}
        >
          <IconButton
            icon={RefreshCw}
            onClick={() => toast.success("Refreshed")}
            title="Refresh"
          />
        </PageHeader>

        {/* ========== FILTERS ========== */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <FormSelect
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
              </FormSelect>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <FormSelect
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="overview">Overview</option>
                <option value="operations">Operations</option>
                <option value="financial">Financial</option>
                <option value="customer">Customer</option>
                <option value="performance">Team Performance</option>
              </FormSelect>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <FormSelect
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="all-services">All Services</option>
                <option value="express">Express Delivery</option>
                <option value="standard">Standard Delivery</option>
                <option value="same-day">Same Day Delivery</option>
              </FormSelect>
            </div>
          </div>
        </div>

        {/* ========== PERFORMANCE METRICS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className={`bg-white dark:bg-neutral-900 rounded-lg p-5 border ${getColorClass(
                  metric.color
                )}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5" />
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-success-600 dark:text-success-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-error-600 dark:text-error-400" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        metric.trend === "up"
                          ? "text-success-600 dark:text-success-400"
                          : "text-error-600 dark:text-error-400"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                  {metric.value}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {metric.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* ========== CHARTS ROW 1 ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Inquiries Chart */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Daily Inquiries & Conversions
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyInquiriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="day"
                  stroke="#6b7280"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis stroke="#6b7280" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="inquiries" fill="#3b82f6" name="Inquiries" />
                <Bar dataKey="quotes" fill="#8b5cf6" name="Quotes" />
                <Bar dataKey="approved" fill="#10b981" name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue vs Target Chart */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Revenue vs Target
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis stroke="#6b7280" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ========== CHARTS ROW 2 ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Service Type Distribution */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Service Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* SLA Performance */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              SLA Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={slaPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis type="number" stroke="#6b7280" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis
                  dataKey="category"
                  type="category"
                  stroke="#6b7280"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time" />
                <Bar dataKey="atRisk" stackId="a" fill="#f59e0b" name="At Risk" />
                <Bar dataKey="breached" stackId="a" fill="#ef4444" name="Breached" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ========== TABLES ROW ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Top Performers
            </h3>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                      Inquiries
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                      Quotes
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                      Conv. %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {topPerformers.map((performer, index) => (
                    <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                        {performer.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-600 dark:text-neutral-400">
                        {performer.inquiries}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-600 dark:text-neutral-400">
                        {performer.quotes}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-success-600 dark:text-success-400">
                        {performer.conversion}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Escalation Statistics */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Escalation Statistics
            </h3>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                      Resolved
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                      Pending
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {escalationStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                        {stat.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-600 dark:text-neutral-400">
                        {stat.count}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-success-600 dark:text-success-400">
                        {stat.resolved}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-warning-600 dark:text-warning-400">
                        {stat.pending}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
