import { useState, useEffect } from "react";
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
  Calendar,
  Activity,
  ArrowRight,
  FileText,
  Bell,
  XCircle,
  Target,
  BarChart3,
  Zap,
  RefreshCw,
  Radio,
  AlertTriangle,
  ClipboardList,
  Plus,
  UserPlus,
  Route,
  FileBarChart,
  Timer,
  PlayCircle,
  PauseCircle,
  TrendingDown as Minus,
  CircleDot,
  Inbox,
  DollarSign as Currency,
  Wallet,
  CreditCard,
  ShieldAlert,
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
import { UserRole } from "../../mockAPI/navigationData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardProps {
  userRole: UserRole;
}

export default function Dashboard({ userRole }: DashboardProps) {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "year">("week");

  // Sample data for charts
  const shipmentTrendData = [
    { name: "Mon", inquiries: 45, quotes: 38, completed: 32 },
    { name: "Tue", inquiries: 52, quotes: 45, completed: 38 },
    { name: "Wed", inquiries: 48, quotes: 42, completed: 35 },
    { name: "Thu", inquiries: 61, quotes: 54, completed: 46 },
    { name: "Fri", inquiries: 55, quotes: 48, completed: 41 },
    { name: "Sat", inquiries: 38, quotes: 32, completed: 28 },
    { name: "Sun", inquiries: 30, quotes: 25, completed: 20 },
  ];

  const revenueData = [
    { name: "Jan", revenue: 45000, expenses: 32000 },
    { name: "Feb", revenue: 52000, expenses: 35000 },
    { name: "Mar", revenue: 48000, expenses: 33000 },
    { name: "Apr", revenue: 61000, expenses: 38000 },
    { name: "May", revenue: 55000, expenses: 36000 },
    { name: "Jun", revenue: 68000, expenses: 40000 },
  ];

  const shipmentStatusData = [
    { name: "Completed", value: 245, color: "#10b981" },
    { name: "In Transit", value: 89, color: "#3b82f6" },
    { name: "Pending", value: 34, color: "#f59e0b" },
    { name: "Cancelled", value: 12, color: "#ef4444" },
  ];

  const slaData = [
    { name: "Week 1", onTime: 95, delayed: 5 },
    { name: "Week 2", onTime: 92, delayed: 8 },
    { name: "Week 3", onTime: 97, delayed: 3 },
    { name: "Week 4", onTime: 94, delayed: 6 },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  // Customer Dashboard
  const renderCustomerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Shipments"
          value="24"
          change="+12%"
          changeType="positive"
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />
        <StatCard
          icon={Clock}
          label="Pending Quotes"
          value="3"
          subtitle="Awaiting review"
          iconBg="bg-warning-100 dark:bg-warning-900/30"
          iconColor="text-warning-600 dark:text-warning-400"
        />
        <StatCard
          icon={Truck}
          label="In Transit"
          value="5"
          subtitle="Active shipments"
          iconBg="bg-info-100 dark:bg-info-900/30"
          iconColor="text-info-600 dark:text-info-400"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value="16"
          change="+8%"
          changeType="positive"
          iconBg="bg-success-100 dark:bg-success-900/30"
          iconColor="text-success-600 dark:text-success-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Recent Shipments
            </h3>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <ShipmentItem
              id="SH-2024-1234"
              from="Dubai"
              to="Abu Dhabi"
              status="In Transit"
              statusColor="info"
            />
            <ShipmentItem
              id="SH-2024-1233"
              from="Sharjah"
              to="Dubai"
              status="Delivered"
              statusColor="success"
            />
            <ShipmentItem
              id="SH-2024-1232"
              from="Dubai"
              to="Al Ain"
              status="Pending Pickup"
              statusColor="warning"
            />
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Pending Actions
            </h3>
          </div>
          <div className="space-y-3">
            <ActionItem
              icon={FileText}
              title="Review Quote #QT-1234"
              description="Quote expires in 24 hours"
              actionText="Review"
              urgent
            />
            <ActionItem
              icon={Package}
              title="Update Shipment Details"
              description="Missing cargo dimensions for SH-2024-1230"
              actionText="Update"
            />
            <ActionItem
              icon={Bell}
              title="Delivery Scheduled"
              description="SH-2024-1229 arriving today at 3:00 PM"
              actionText="Track"
            />
          </div>
        </div>
      </div>

      {/* Shipment History Chart */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Shipment Activity
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={shipmentTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
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
              dataKey="completed"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Operations User Dashboard
  const renderOperationsUserDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ClipboardList}
          label="Active Inquiries"
          value="34"
          change="+5"
          changeType="positive"
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />
        <StatCard
          icon={Clock}
          label="SLA Warnings"
          value="7"
          subtitle="Require attention"
          iconBg="bg-warning-100 dark:bg-warning-900/30"
          iconColor="text-warning-600 dark:text-warning-400"
        />
        <StatCard
          icon={Truck}
          label="Active Trips"
          value="42"
          change="+8%"
          changeType="positive"
          iconBg="bg-info-100 dark:bg-info-900/30"
          iconColor="text-info-600 dark:text-info-400"
        />
        <StatCard
          icon={Target}
          label="Completion Rate"
          value="94%"
          change="+2%"
          changeType="positive"
          iconBg="bg-success-100 dark:bg-success-900/30"
          iconColor="text-success-600 dark:text-success-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SLA Status */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            SLA Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={slaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="onTime" fill="#10b981" name="On Time" />
              <Bar dataKey="delayed" fill="#ef4444" name="Delayed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <QuickActionButton icon={FileText} label="New Quote" />
            <QuickActionButton icon={Truck} label="Assign Driver" />
            <QuickActionButton icon={MapPin} label="Track Shipment" />
            <QuickActionButton icon={Clock} label="SLA Monitor" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Recent Inquiries
          </h3>
          <div className="space-y-3">
            <InquiryItem
              id="INQ-2024-5678"
              customer="ABC Trading LLC"
              status="Awaiting Quote"
              time="15 mins ago"
            />
            <InquiryItem
              id="INQ-2024-5677"
              customer="XYZ Logistics"
              status="Quote Sent"
              time="1 hour ago"
            />
            <InquiryItem
              id="INQ-2024-5676"
              customer="Global Freight Co"
              status="Quote Approved"
              time="2 hours ago"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Driver Status
          </h3>
          <div className="space-y-3">
            <DriverStatusItem name="Ahmed Hassan" status="On Trip" trips={2} />
            <DriverStatusItem name="Mohammed Ali" status="Available" trips={0} />
            <DriverStatusItem name="Khalid Omar" status="On Trip" trips={1} />
          </div>
        </div>
      </div>
    </div>
  );

  // Operations Manager Dashboard
  const renderOperationsManagerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value="AED 245K"
          change="+15%"
          changeType="positive"
          iconBg="bg-success-100 dark:bg-success-900/30"
          iconColor="text-success-600 dark:text-success-400"
        />
        <StatCard
          icon={Package}
          label="Total Shipments"
          value="380"
          change="+12%"
          changeType="positive"
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />
        <StatCard
          icon={AlertCircle}
          label="Escalations"
          value="5"
          change="-20%"
          changeType="positive"
          iconBg="bg-warning-100 dark:bg-warning-900/30"
          iconColor="text-warning-600 dark:text-warning-400"
        />
        <StatCard
          icon={Target}
          label="SLA Compliance"
          value="96%"
          change="+3%"
          changeType="positive"
          iconBg="bg-info-100 dark:bg-info-900/30"
          iconColor="text-info-600 dark:text-info-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipment Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Shipment Trends
            </h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={shipmentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="inquiries"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="quotes"
                stroke="#f59e0b"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Shipment Status */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Shipment Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={shipmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {shipmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {shipmentStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance & Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Team Performance
          </h3>
          <div className="space-y-4">
            <PerformanceItem
              name="Operations Team A"
              value={95}
              metric="SLA Compliance"
            />
            <PerformanceItem
              name="Operations Team B"
              value={92}
              metric="SLA Compliance"
            />
            <PerformanceItem
              name="Operations Team C"
              value={98}
              metric="SLA Compliance"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Recent Escalations
          </h3>
          <div className="space-y-3">
            <EscalationItem
              id="ESC-2024-0034"
              issue="Delayed Delivery - SLA Breach"
              priority="High"
              time="30 mins ago"
            />
            <EscalationItem
              id="ESC-2024-0033"
              issue="Customer Complaint - Missing Items"
              priority="Medium"
              time="2 hours ago"
            />
            <EscalationItem
              id="ESC-2024-0032"
              issue="Driver Unavailable - Reassignment Needed"
              priority="High"
              time="5 hours ago"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Finance User Dashboard
  const renderFinanceUserDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value="AED 324K"
          change="+18%"
          changeType="positive"
          iconBg="bg-success-100 dark:bg-success-900/30"
          iconColor="text-success-600 dark:text-success-400"
        />
        <StatCard
          icon={Clock}
          label="Pending Invoices"
          value="23"
          subtitle="AED 45,600"
          iconBg="bg-warning-100 dark:bg-warning-900/30"
          iconColor="text-warning-600 dark:text-warning-400"
        />
        <StatCard
          icon={CheckCircle}
          label="Paid This Month"
          value="AED 278K"
          change="+12%"
          changeType="positive"
          iconBg="bg-info-100 dark:bg-info-900/30"
          iconColor="text-info-600 dark:text-info-400"
        />
        <StatCard
          icon={Truck}
          label="Driver Payables"
          value="AED 89K"
          subtitle="Due in 7 days"
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Revenue vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Receivables Status */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Receivables Status
          </h3>
          <div className="space-y-4">
            <ReceivableItem
              label="Current (0-30 days)"
              amount="AED 124,500"
              percentage={65}
              color="success"
            />
            <ReceivableItem
              label="30-60 days"
              amount="AED 45,200"
              percentage={24}
              color="warning"
            />
            <ReceivableItem
              label="60-90 days"
              amount="AED 15,300"
              percentage={8}
              color="error"
            />
            <ReceivableItem
              label="90+ days (Overdue)"
              amount="AED 5,600"
              percentage={3}
              color="error"
            />
          </div>
        </div>
      </div>

      {/* Recent Transactions & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            <TransactionItem
              id="INV-2024-1234"
              customer="ABC Trading LLC"
              amount="AED 12,500"
              status="Paid"
              date="Today"
            />
            <TransactionItem
              id="INV-2024-1233"
              customer="XYZ Logistics"
              amount="AED 8,900"
              status="Pending"
              date="Yesterday"
            />
            <TransactionItem
              id="INV-2024-1232"
              customer="Global Freight Co"
              amount="AED 15,200"
              status="Paid"
              date="2 days ago"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Pending Driver Payouts
          </h3>
          <div className="space-y-3">
            <PayoutItem driver="Ahmed Hassan" amount="AED 4,500" trips={8} />
            <PayoutItem driver="Mohammed Ali" amount="AED 3,200" trips={6} />
            <PayoutItem driver="Khalid Omar" amount="AED 5,100" trips={9} />
          </div>
        </div>
      </div>
    </div>
  );

  // Admin Dashboard
  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value="156"
          change="+8"
          changeType="positive"
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />
        <StatCard
          icon={Activity}
          label="System Uptime"
          value="99.9%"
          subtitle="Last 30 days"
          iconBg="bg-success-100 dark:bg-success-900/30"
          iconColor="text-success-600 dark:text-success-400"
        />
        <StatCard
          icon={Zap}
          label="API Calls"
          value="234K"
          change="+15%"
          changeType="positive"
          iconBg="bg-info-100 dark:bg-info-900/30"
          iconColor="text-info-600 dark:text-info-400"
        />
        <StatCard
          icon={AlertCircle}
          label="Open Issues"
          value="3"
          change="-40%"
          changeType="positive"
          iconBg="bg-warning-100 dark:bg-warning-900/30"
          iconColor="text-warning-600 dark:text-warning-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Platform Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={shipmentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
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
              />
              <Area
                type="monotone"
                dataKey="quotes"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Integration Status */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Integration Status
          </h3>
          <div className="space-y-3">
            <IntegrationStatusItem name="Stripe" status="Connected" />
            <IntegrationStatusItem name="QuickBooks" status="Connected" />
            <IntegrationStatusItem name="Twilio" status="Connected" />
            <IntegrationStatusItem name="SendGrid" status="Connected" />
            <IntegrationStatusItem name="SAP B1" status="Error" />
            <IntegrationStatusItem name="Google Maps" status="Connected" />
          </div>
        </div>
      </div>

      {/* Recent Activity & User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Recent System Activity
          </h3>
          <div className="space-y-3">
            <SystemActivityItem
              action="User created"
              user="john.doe@zajel.ae"
              time="10 mins ago"
              type="info"
            />
            <SystemActivityItem
              action="Integration error"
              user="SAP Business One"
              time="25 mins ago"
              type="error"
            />
            <SystemActivityItem
              action="Settings updated"
              user="admin@zajel.ae"
              time="1 hour ago"
              type="success"
            />
            <SystemActivityItem
              action="New role created"
              user="Operations Lead"
              time="2 hours ago"
              type="info"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            User Activity by Role
          </h3>
          <div className="space-y-4">
            <RoleActivityItem role="Operations User" count={45} percentage={35} />
            <RoleActivityItem role="Operations Manager" count={28} percentage={22} />
            <RoleActivityItem role="Finance User" count={32} percentage={25} />
            <RoleActivityItem role="Customer" count={18} percentage={14} />
            <RoleActivityItem role="Admin" count={5} percentage={4} />
          </div>
        </div>
      </div>
    </div>
  );

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    switch (userRole) {
      case "customer":
        return renderCustomerDashboard();
      case "operations_user":
        return renderOperationsUserDashboard();
      case "operations_manager":
        return renderOperationsManagerDashboard();
      case "finance_user":
        return renderFinanceUserDashboard();
      case "admin":
        return renderAdminDashboard();
      default:
        return renderCustomerDashboard();
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {renderDashboard()}
    </div>
  );
}

// Reusable Components

interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  subtitle?: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType,
  subtitle,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg p-5 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {change && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              changeType === "positive"
                ? "text-success-600 dark:text-success-400"
                : "text-error-600 dark:text-error-400"
            }`}
          >
            {changeType === "positive" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
        <p className="text-2xl font-semibold text-neutral-900 dark:text-white mt-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function ShipmentItem({ id, from, to, status, statusColor }: any) {
  const colors = {
    info: "bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400",
    success: "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400",
    warning: "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900 dark:text-white">{id}</p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
          {from} → {to}
        </p>
      </div>
      <span className={`text-xs px-2 py-1 rounded ${colors[statusColor as keyof typeof colors]}`}>
        {status}
      </span>
    </div>
  );
}

function ActionItem({ icon: Icon, title, description, actionText, urgent }: any) {
  return (
    <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
      <div
        className={`w-8 h-8 ${
          urgent
            ? "bg-warning-100 dark:bg-warning-900/30"
            : "bg-primary-100 dark:bg-primary-900/30"
        } rounded-lg flex items-center justify-center flex-shrink-0`}
      >
        <Icon
          className={`w-4 h-4 ${
            urgent
              ? "text-warning-600 dark:text-warning-400"
              : "text-primary-600 dark:text-primary-400"
          }`}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900 dark:text-white">{title}</p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{description}</p>
      </div>
      <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline whitespace-nowrap">
        {actionText}
      </button>
    </div>
  );
}

function InquiryItem({ id, customer, status, time }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900 dark:text-white">{id}</p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{customer}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">{status}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function DriverStatusItem({ name, status, trips }: any) {
  const isAvailable = status === "Available";
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">{name}</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {trips} active {trips === 1 ? "trip" : "trips"}
          </p>
        </div>
      </div>
      <span
        className={`text-xs px-2 py-1 rounded ${
          isAvailable
            ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400"
            : "bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label }: any) {
  return (
    <button className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-3 text-left">
      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      </div>
      <span className="text-sm font-medium text-neutral-900 dark:text-white">{label}</span>
    </button>
  );
}

function PerformanceItem({ name, value, metric }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-900 dark:text-white">{name}</span>
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{value}%</span>
      </div>
      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
        <div
          className="bg-primary-500 h-2 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{metric}</p>
    </div>
  );
}

function EscalationItem({ id, issue, priority, time }: any) {
  const isHigh = priority === "High";
  return (
    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-neutral-900 dark:text-white">{id}</p>
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            isHigh
              ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400"
              : "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400"
          }`}
        >
          {priority}
        </span>
      </div>
      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">{issue}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-500">{time}</p>
    </div>
  );
}

function ReceivableItem({ label, amount, percentage, color }: any) {
  const colors = {
    success: "bg-success-500",
    warning: "bg-warning-500",
    error: "bg-error-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-900 dark:text-white">{label}</span>
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{amount}</span>
      </div>
      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
        <div
          className={`${colors[color as keyof typeof colors]} h-2 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function TransactionItem({ id, customer, amount, status, date }: any) {
  const isPaid = status === "Paid";
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900 dark:text-white">{id}</p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{customer}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">{amount}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              isPaid
                ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400"
                : "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400"
            }`}
          >
            {status}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-500">{date}</span>
        </div>
      </div>
    </div>
  );
}

function PayoutItem({ driver, amount, trips }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">{driver}</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">{trips} completed trips</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-neutral-900 dark:text-white">{amount}</span>
    </div>
  );
}

function IntegrationStatusItem({ name, status }: any) {
  const isConnected = status === "Connected";
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-neutral-900 dark:text-white">{name}</span>
      <div className="flex items-center gap-2">
        {isConnected ? (
          <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-400" />
        ) : (
          <XCircle className="w-4 h-4 text-error-600 dark:text-error-400" />
        )}
        <span
          className={`text-xs ${
            isConnected
              ? "text-success-600 dark:text-success-400"
              : "text-error-600 dark:text-error-400"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function SystemActivityItem({ action, user, time, type }: any) {
  const colors = {
    info: "bg-info-100 dark:bg-info-900/30 text-info-600 dark:text-info-400",
    error: "bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400",
    success: "bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400",
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
      <div className={`w-2 h-2 rounded-full mt-1.5 ${colors[type as keyof typeof colors]}`} />
      <div className="flex-1">
        <p className="text-sm text-neutral-900 dark:text-white">{action}</p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{user}</p>
      </div>
      <span className="text-xs text-neutral-500 dark:text-neutral-500">{time}</span>
    </div>
  );
}

function RoleActivityItem({ role, count, percentage }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-900 dark:text-white">{role}</span>
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{count}</span>
      </div>
      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
        <div
          className="bg-primary-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}