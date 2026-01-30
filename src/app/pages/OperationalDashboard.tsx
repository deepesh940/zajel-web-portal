import { useState } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  DollarSign,
  Users,
  MapPin,
  Activity,
  ArrowRight,
  FileText,
  AlertTriangle,
  Plus,
  UserPlus,
  Route,
  Timer,
  PlayCircle,
  PauseCircle,
  Target,
  Zap,
  RefreshCw,
  CircleDot,
  Inbox,
  Wallet,
  ShieldAlert,
  XCircle,
  TrendingUp as UpIcon,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

export default function OperationalDashboard() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ========== MOCK DATA ========== //

  // Real-time Inquiry Metrics
  const inquiryMetrics = {
    today: {
      total: 45,
      pending: 12,
      quoted: 18,
      accepted: 10,
      rejected: 3,
      overdue: 5,
    },
    week: {
      total: 289,
      pending: 67,
      quoted: 125,
      accepted: 78,
      rejected: 19,
      overdue: 23,
    },
    month: {
      total: 1247,
      pending: 245,
      quoted: 534,
      accepted: 389,
      rejected: 79,
      overdue: 89,
    },
  };

  // Active Trips Overview
  const tripMetrics = {
    inProgress: 42,
    delayed: 8,
    onTime: 34,
    completed: 156,
    deliverySuccessRate: 94.5,
    avgDeliveryTime: "4.2 hrs",
  };

  // Driver Status Summary
  const driverMetrics = {
    total: 85,
    available: 23,
    onTrip: 42,
    offline: 20,
    utilizationRate: 67.8,
  };

  // SLA Compliance
  const slaMetrics = {
    inquiryStage: 92.3,
    quoteStage: 88.7,
    deliveryStage: 94.5,
    overall: 91.8,
  };

  // Financial Snapshot
  const financialMetrics = {
    today: {
      revenue: 45250,
      invoices: 12,
      receivables: 23400,
      payables: 8900,
    },
    week: {
      revenue: 278900,
      invoices: 89,
      receivables: 145600,
      payables: 56700,
    },
    month: {
      revenue: 1245000,
      invoices: 378,
      receivables: 645800,
      payables: 234500,
    },
  };

  // Operational Exceptions
  const exceptions = [
    {
      id: "EXC-001",
      type: "sla_breach",
      title: "SLA Breach - Quote Overdue",
      inquiry: "INQ-2024-5678",
      customer: "ABC Trading LLC",
      priority: "high",
      time: "15 mins ago",
    },
    {
      id: "EXC-002",
      type: "delayed_shipment",
      title: "Shipment Delayed - Traffic",
      trip: "TRP-2024-3421",
      driver: "Ahmed Hassan",
      priority: "medium",
      time: "30 mins ago",
    },
    {
      id: "EXC-003",
      type: "escalation",
      title: "Customer Complaint Escalated",
      inquiry: "INQ-2024-5670",
      customer: "XYZ Logistics",
      priority: "high",
      time: "1 hour ago",
    },
    {
      id: "EXC-004",
      type: "failed_pickup",
      title: "Failed Pickup Attempt",
      trip: "TRP-2024-3419",
      driver: "Mohammed Ali",
      priority: "high",
      time: "2 hours ago",
    },
    {
      id: "EXC-005",
      type: "sla_warning",
      title: "SLA Warning - Approaching Deadline",
      inquiry: "INQ-2024-5665",
      customer: "Global Freight Co",
      priority: "medium",
      time: "3 hours ago",
    },
  ];

  // Inquiry Trends Chart Data
  const inquiryTrendData = [
    { hour: "08:00", inquiries: 5, quotes: 3, accepted: 2 },
    { hour: "09:00", inquiries: 8, quotes: 6, accepted: 4 },
    { hour: "10:00", inquiries: 12, quotes: 9, accepted: 7 },
    { hour: "11:00", inquiries: 9, quotes: 7, accepted: 5 },
    { hour: "12:00", inquiries: 6, quotes: 5, accepted: 3 },
    { hour: "13:00", inquiries: 7, quotes: 5, accepted: 4 },
    { hour: "14:00", inquiries: 10, quotes: 8, accepted: 6 },
    { hour: "15:00", inquiries: 11, quotes: 9, accepted: 7 },
  ];

  // SLA Performance Data
  const slaPerformanceData = [
    { name: "Inquiry Receipt", onTime: 95, breach: 5 },
    { name: "Quote Generation", onTime: 89, breach: 11 },
    { name: "Driver Assignment", onTime: 92, breach: 8 },
    { name: "Pickup", onTime: 94, breach: 6 },
    { name: "Delivery", onTime: 96, breach: 4 },
  ];

  // Trip Status Distribution
  const tripStatusData = [
    { name: "Pending Pickup", value: 15, color: "#f59e0b" },
    { name: "In Transit", value: 42, color: "#3b82f6" },
    { name: "Delivered", value: 156, color: "#10b981" },
    { name: "Delayed", value: 8, color: "#ef4444" },
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      type: "inquiry",
      title: "New Inquiry Created",
      description: "INQ-2024-5680 from Emirate Logistics",
      time: "2 mins ago",
      icon: Inbox,
    },
    {
      id: 2,
      type: "quote",
      title: "Quote Approved",
      description: "QT-2024-3421 accepted by ABC Trading",
      time: "8 mins ago",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "driver",
      title: "Driver Assigned",
      description: "Ahmed Hassan assigned to TRP-2024-3422",
      time: "15 mins ago",
      icon: UserPlus,
    },
    {
      id: 4,
      type: "delivery",
      title: "Delivery Completed",
      description: "TRP-2024-3418 delivered successfully",
      time: "25 mins ago",
      icon: Package,
    },
    {
      id: 5,
      type: "escalation",
      title: "Issue Escalated",
      description: "INQ-2024-5672 escalated to manager",
      time: "45 mins ago",
      icon: AlertTriangle,
    },
  ];

  const currentMetrics = inquiryMetrics[timeRange];
  const currentFinancials = financialMetrics[timeRange];

  // ========== HELPER FUNCTIONS ========== //

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 1000).toFixed(1)}K`;
  };

  const getExceptionColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-error-500 bg-error-50 dark:bg-error-900/10";
      case "medium":
        return "border-l-4 border-l-warning-500 bg-warning-50 dark:bg-warning-900/10";
      default:
        return "border-l-4 border-l-info-500 bg-info-50 dark:bg-info-900/10";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400">
            Low
          </span>
        );
    }
  };

  // ========== QUICK ACTIONS ========== //

  const quickActions = [
    {
      icon: Plus,
      label: "Create Inquiry",
      onClick: () => toast.success("Inquiry created"),
      color: "primary",
    },
    {
      icon: UserPlus,
      label: "Assign Driver",
      onClick: () => toast.success("Driver assigned"),
      color: "info",
    },
    {
      icon: AlertTriangle,
      label: "View Escalations",
      onClick: () => toast.success("Escalations viewed"),
      color: "warning",
    },
    {
      icon: BarChart3,
      label: "Generate Reports",
      onClick: () => toast.success("Reports generated"),
      color: "success",
    },
  ];

  return (
    <div className="p-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* ========== PAGE HEADER ========== */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Operational Dashboard
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Real-time operations monitoring and management
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh
                  ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400"
                  : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
              {autoRefresh ? "Auto-Refresh On" : "Auto-Refresh Off"}
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => toast.success("Dashboard refreshed")}
              className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Now
            </button>
          </div>
        </div>
      </div>

      {/* ========== QUICK ACTIONS BUTTONS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md hover:border-primary-500 dark:hover:border-primary-400 transition-all flex items-center gap-3 text-left"
          >
            <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 flex items-center justify-center`}>
              <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
            </div>
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* ========== KEY METRICS SECTION ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Real-time Inquiry Metrics */}
        <MetricCard
          icon={Inbox}
          label="Total Inquiries"
          value={currentMetrics.total.toString()}
          subtitle={`${currentMetrics.pending} pending quote`}
          trend="+12%"
          trendType="up"
          color="primary"
        />

        <MetricCard
          icon={Clock}
          label="Overdue Inquiries"
          value={currentMetrics.overdue.toString()}
          subtitle="Require immediate attention"
          trend="-8%"
          trendType="down"
          color="warning"
        />

        <MetricCard
          icon={Target}
          label="SLA Compliance"
          value={`${slaMetrics.overall}%`}
          subtitle="Overall performance"
          trend="+2.3%"
          trendType="up"
          color="success"
        />

        <MetricCard
          icon={Truck}
          label="Active Trips"
          value={tripMetrics.inProgress.toString()}
          subtitle={`${tripMetrics.delayed} delayed`}
          trend="+5%"
          trendType="up"
          color="info"
        />
      </div>

      {/* ========== DRIVER STATUS & FINANCIAL SNAPSHOT ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Driver Status Summary */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Driver Status
            </h3>
            <button
              onClick={() => toast.success("Driver assignment viewed")}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            <DriverStatusRow
              label="Available"
              count={driverMetrics.available}
              total={driverMetrics.total}
              color="success"
            />
            <DriverStatusRow
              label="On Trip"
              count={driverMetrics.onTrip}
              total={driverMetrics.total}
              color="info"
            />
            <DriverStatusRow
              label="Offline"
              count={driverMetrics.offline}
              total={driverMetrics.total}
              color="neutral"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Utilization Rate
              </span>
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                {driverMetrics.utilizationRate}%
              </span>
            </div>
            <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full transition-all"
                style={{ width: `${driverMetrics.utilizationRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success-600 dark:text-success-400" />
              Financial Snapshot
            </h3>
            <button
              onClick={() => toast.success("Reports viewed")}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View Reports
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <FinancialMetricCard
              label="Revenue"
              value={formatCurrency(currentFinancials.revenue)}
              icon={TrendingUp}
              trend="+15%"
              color="success"
            />
            <FinancialMetricCard
              label="Invoices"
              value={currentFinancials.invoices.toString()}
              icon={FileText}
              subtitle="Generated"
              color="primary"
            />
            <FinancialMetricCard
              label="Receivables"
              value={formatCurrency(currentFinancials.receivables)}
              icon={Wallet}
              subtitle="Outstanding"
              color="warning"
            />
            <FinancialMetricCard
              label="Payables"
              value={formatCurrency(currentFinancials.payables)}
              icon={Truck}
              subtitle="Driver payments"
              color="info"
            />
          </div>
        </div>
      </div>

      {/* ========== CHARTS SECTION ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Inquiry Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Inquiry Activity (Today)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={inquiryTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="inquiries"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Inquiries"
              />
              <Area
                type="monotone"
                dataKey="quotes"
                stackId="2"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Quotes"
              />
              <Area
                type="monotone"
                dataKey="accepted"
                stackId="3"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Accepted"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trip Status Distribution */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Trip Status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={tripStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
              >
                {tripStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {tripStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-neutral-600 dark:text-neutral-400">{item.name}</span>
                </div>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== SLA PERFORMANCE ========== */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            SLA Performance by Stage
          </h3>
          <button
            onClick={() => toast.success("SLA monitoring viewed")}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            View Details
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={slaPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="onTime" fill="#10b981" name="On Time %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="breach" fill="#ef4444" name="Breach %" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ========== OPERATIONAL EXCEPTIONS & RECENT ACTIVITIES ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Exceptions */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              Operational Exceptions
            </h3>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400">
              {exceptions.length} Active
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {exceptions.map((exception) => (
              <div
                key={exception.id}
                className={`p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 ${getExceptionColor(
                  exception.priority
                )}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        {exception.id}
                      </span>
                      {getPriorityBadge(exception.priority)}
                    </div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                      {exception.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {exception.inquiry && `Inquiry: ${exception.inquiry}`}
                      {exception.trip && `Trip: ${exception.trip}`}
                      {exception.customer && ` • ${exception.customer}`}
                      {exception.driver && ` • Driver: ${exception.driver}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {exception.time}
                  </span>
                  <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-info-600 dark:text-info-400" />
              Recent Activities
            </h3>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">
                    {activity.title}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {activity.description}
                  </p>
                  <span className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 inline-block">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== REUSABLE COMPONENTS ========== //

interface MetricCardProps {
  icon: any;
  label: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendType?: "up" | "down";
  color: "primary" | "success" | "warning" | "info" | "error";
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  trendType,
  color,
}: MetricCardProps) {
  const colorClasses = {
    primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
    success: "bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400",
    warning: "bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400",
    info: "bg-info-100 dark:bg-info-900/30 text-info-600 dark:text-info-400",
    error: "bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400",
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg p-5 border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              trendType === "up"
                ? "text-success-600 dark:text-success-400"
                : "text-error-600 dark:text-error-400"
            }`}
          >
            {trendType === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
      <p className="text-2xl font-semibold text-neutral-900 dark:text-white mt-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function DriverStatusRow({ label, count, total, color }: any) {
  const percentage = (count / total) * 100;
  const colorClasses = {
    success: "bg-success-500",
    info: "bg-info-500",
    neutral: "bg-neutral-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
          {count}/{total}
        </span>
      </div>
      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
        <div
          className={`${colorClasses[color as keyof typeof colorClasses]} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function FinancialMetricCard({ label, value, icon: Icon, trend, subtitle, color }: any) {
  const colorClasses = {
    primary: "text-primary-600 dark:text-primary-400",
    success: "text-success-600 dark:text-success-400",
    warning: "text-warning-600 dark:text-warning-400",
    info: "text-info-600 dark:text-info-400",
  };

  return (
    <div className="text-center">
      <Icon className={`w-8 h-8 ${colorClasses[color as keyof typeof colorClasses]} mx-auto mb-2`} />
      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">{label}</p>
      <p className="text-xl font-semibold text-neutral-900 dark:text-white">{value}</p>
      {trend && (
        <p className="text-xs text-success-600 dark:text-success-400 mt-1">{trend}</p>
      )}
      {subtitle && (
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}