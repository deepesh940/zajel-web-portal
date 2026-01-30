import {
  LayoutDashboard,
  Package,
  FileText,
  TrendingUp,
  Users,
  Truck,
  MapPin,
  DollarSign,
  ClipboardList,
  Clock,
  Bell,
  Settings,
  ShieldCheck,
  Database,
  Plug,
  ScrollText,
  BarChart3,
  CheckCircle,
  UserCheck,
  AlertTriangle,
  Receipt,
  Wallet,
  FileSpreadsheet,
  Shield,
  FolderTree,
  Palette,
  Tag,
} from "lucide-react";

export interface SubMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  onClick?: () => void;
  active?: boolean;
  subItems?: SubMenuItem[];
}

export type UserRole = "customer" | "operations_user" | "operations_manager" | "finance_user" | "admin";

// Customer Menu
const getCustomerMenu = (
  currentPage: string,
  onNavigate: (pageId: string) => void
): MenuItem[] => {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard"),
      active: currentPage === "dashboard",
    },
    // Removed "Create Shipment Inquiry" - accessible via "+ New Inquiry" button in My Inquiries page
    {
      id: "my-inquiries",
      label: "My Inquiries",
      icon: FileText,
      onClick: () => onNavigate("my-inquiries"),
      active: currentPage === "my-inquiries",
    },
    {
      id: "quote-review",
      label: "Quote Review",
      icon: TrendingUp,
      onClick: () => onNavigate("quote-review"),
      active: currentPage === "quote-review",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      onClick: () => onNavigate("notifications"),
      active: currentPage === "notifications",
    },
    {
      id: "profile",
      label: "Profile",
      icon: Users,
      onClick: () => onNavigate("profile"),
      active: currentPage === "profile",
    },
  ];
};

// Operations User Menu
const getOperationsUserMenu = (
  currentPage: string,
  onNavigate: (pageId: string) => void
): MenuItem[] => {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard"),
      active: currentPage === "dashboard",
    },
    {
      id: "inquiry-management",
      label: "Inquiry Management",
      icon: ClipboardList,
      onClick: () => onNavigate("inquiry-management"),
      active: currentPage === "inquiry-management",
    },
    {
      id: "sla-monitoring",
      label: "SLA Monitoring",
      icon: Clock,
      onClick: () => onNavigate("sla-monitoring"),
      active: currentPage === "sla-monitoring",
    },
    {
      id: "pricing-quote",
      label: "Pricing & Quote",
      icon: DollarSign,
      onClick: () => onNavigate("pricing-quote"),
      active: currentPage === "pricing-quote",
    },
    {
      id: "driver-bidding",
      label: "Driver Bidding",
      icon: TrendingUp,
      onClick: () => onNavigate("driver-bidding"),
      active: currentPage === "driver-bidding",
    },
    {
      id: "driver-assignment",
      label: "Driver Assignment",
      icon: UserCheck,
      onClick: () => onNavigate("driver-assignment"),
      active: currentPage === "driver-assignment",
    },
    {
      id: "trip-monitoring",
      label: "Trip Monitoring",
      icon: MapPin,
      onClick: () => onNavigate("trip-monitoring"),
      active: currentPage === "trip-monitoring",
    },
    {
      id: "real-time-tracking",
      label: "Real-Time Tracking",
      icon: MapPin,
      onClick: () => onNavigate("real-time-tracking"),
      active: currentPage === "real-time-tracking",
    },
    {
      id: "customer-approvals",
      label: "Customer Management",
      icon: CheckCircle,
      onClick: () => onNavigate("customer-approvals"),
      active: currentPage === "customer-approvals",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      onClick: () => onNavigate("notifications"),
      active: currentPage === "notifications",
    },
  ];
};

// Operations Manager Menu
const getOperationsManagerMenu = (
  currentPage: string,
  onNavigate: (pageId: string) => void
): MenuItem[] => {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard"),
      active: currentPage === "dashboard",
    },
    {
      id: "inquiry-management",
      label: "Inquiry Management",
      icon: ClipboardList,
      onClick: () => onNavigate("inquiry-management"),
      active: currentPage === "inquiry-management",
    },
    {
      id: "sla-monitoring",
      label: "SLA Monitoring",
      icon: Clock,
      onClick: () => onNavigate("sla-monitoring"),
      active: currentPage === "sla-monitoring",
    },
    {
      id: "pricing-approval",
      label: "Pricing Approval",
      icon: CheckCircle,
      onClick: () => onNavigate("pricing-approval"),
      active: currentPage === "pricing-approval",
    },
    {
      id: "escalation-management",
      label: "Escalation Management",
      icon: AlertTriangle,
      onClick: () => onNavigate("escalation-management"),
      active: currentPage === "escalation-management",
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      onClick: () => onNavigate("reports"),
      active: currentPage === "reports",
    },
    {
      id: "trip-monitoring",
      label: "Trip Monitoring",
      icon: MapPin,
      onClick: () => onNavigate("trip-monitoring"),
      active: currentPage === "trip-monitoring",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      onClick: () => onNavigate("notifications"),
      active: currentPage === "notifications",
    },
  ];
};

// Finance User Menu
const getFinanceUserMenu = (
  currentPage: string,
  onNavigate: (pageId: string) => void
): MenuItem[] => {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard"),
      active: currentPage === "dashboard",
    },
    {
      id: "driver-payables",
      label: "Driver Payables",
      icon: Wallet,
      onClick: () => onNavigate("driver-payables"),
      active: currentPage === "driver-payables",
    },
    {
      id: "customer-invoicing",
      label: "Customer Invoicing",
      icon: Receipt,
      onClick: () => onNavigate("customer-invoicing"),
      active: currentPage === "customer-invoicing",
    },
    {
      id: "receivables",
      label: "Receivables",
      icon: DollarSign,
      onClick: () => onNavigate("receivables"),
      active: currentPage === "receivables",
    },
    {
      id: "financial-reports",
      label: "Financial Reports",
      icon: FileSpreadsheet,
      onClick: () => onNavigate("financial-reports"),
      active: currentPage === "financial-reports",
    },
  ];
};

// Admin Menu
const getAdminMenu = (
  currentPage: string,
  onNavigate: (pageId: string) => void
): MenuItem[] => {
  return [
    // Dashboard
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard"),
      active: currentPage === "dashboard",
    },

    // MODULE 1: Inquiry & Pricing Hub
    {
      id: "inquiry-pricing-hub",
      label: "Inquiry & Pricing Hub",
      icon: ClipboardList,
      subItems: [
        {
          id: "inquiry-management",
          label: "Inquiry Management",
          onClick: () => onNavigate("inquiry-management"),
          active: currentPage === "inquiry-management",
        },
        {
          id: "pricing-management",
          label: "Pricing Management",
          onClick: () => onNavigate("pricing-quote"),
          active: currentPage === "pricing-quote" || currentPage === "pricing-approval",
        },
        {
          id: "sla-monitoring",
          label: "SLA Monitoring",
          onClick: () => onNavigate("sla-monitoring"),
          active: currentPage === "sla-monitoring",
        },
      ],
    },

    // MODULE 2: Driver Management
    {
      id: "driver-management-section",
      label: "Driver Management",
      icon: UserCheck,
      subItems: [
        {
          id: "driver-bidding",
          label: "Driver Bidding",
          onClick: () => onNavigate("driver-bidding"),
          active: currentPage === "driver-bidding",
        },
        {
          id: "driver-assignment",
          label: "Driver Assignment",
          onClick: () => onNavigate("driver-assignment"),
          active: currentPage === "driver-assignment",
        },
      ],
    },

    // MODULE 3: Trip & Tracking Operations
    {
      id: "trip-tracking-section",
      label: "Trip & Tracking Operations",
      icon: MapPin,
      subItems: [
        {
          id: "trip-monitoring",
          label: "Trip Monitoring",
          onClick: () => onNavigate("trip-monitoring"),
          active: currentPage === "trip-monitoring",
        },
        {
          id: "real-time-tracking",
          label: "Real-Time Tracking",
          onClick: () => onNavigate("real-time-tracking"),
          active: currentPage === "real-time-tracking",
        },
      ],
    },

    // MODULE 4: Customer & Quality Management
    {
      id: "customer-quality-section",
      label: "Customer & Quality Management",
      icon: CheckCircle,
      subItems: [
        {
          id: "customer-approvals",
          label: "Customer Management",
          onClick: () => onNavigate("customer-approvals"),
          active: currentPage === "customer-approvals",
        },
        {
          id: "escalation-management",
          label: "Escalation Management",
          onClick: () => onNavigate("escalation-management"),
          active: currentPage === "escalation-management",
        },
      ],
    },

    // Finance Section
    {
      id: "finance-section",
      label: "Finance",
      icon: DollarSign,
      subItems: [
        {
          id: "driver-payables",
          label: "Driver Payables",
          onClick: () => onNavigate("driver-payables"),
          active: currentPage === "driver-payables",
        },
        {
          id: "customer-invoicing",
          label: "Customer Invoicing",
          onClick: () => onNavigate("customer-invoicing"),
          active: currentPage === "customer-invoicing",
        },
        {
          id: "receivables",
          label: "Receivables",
          icon: DollarSign,
          onClick: () => onNavigate("receivables"),
          active: currentPage === "receivables",
        },

      ],
    },

    // Admin Section
    {
      id: "user-role-management",
      label: "User & Role Management",
      icon: Users,
      onClick: () => onNavigate("user-role-management"),
      active: currentPage === "user-role-management",
    },
    {
      id: "master-data-section",
      label: "Master Data Management",
      icon: Database,
      subItems: [
        {
          id: "vehicle-types",
          label: "Vehicle Types",
          onClick: () => onNavigate("vehicle-types"),
          active: currentPage === "vehicle-types",
        },
        {
          id: "cargo-types",
          label: "Cargo Types",
          onClick: () => onNavigate("cargo-types"),
          active: currentPage === "cargo-types",
        },
        {
          id: "locations",
          label: "Locations",
          onClick: () => onNavigate("locations"),
          active: currentPage === "locations",
        },
        {
          id: "pricing-rules",
          label: "Pricing Rules",
          onClick: () => onNavigate("pricing-rules"),
          active: currentPage === "pricing-rules",
        },
        {
          id: "service-types",
          label: "Service Types",
          onClick: () => onNavigate("service-types"),
          active: currentPage === "service-types",
        },
        {
          id: "document-types",
          label: "Document Types",
          onClick: () => onNavigate("document-types"),
          active: currentPage === "document-types",
        },
      ],
    },
    {
      id: "system-configuration",
      label: "System Configuration",
      icon: Settings,
      onClick: () => onNavigate("system-configuration"),
      active: currentPage === "system-configuration",
    },
    {
      id: "audit-logs-security",
      label: "Audit Logs & Security",
      icon: Shield,
      onClick: () => onNavigate("audit-logs-security"),
      active: currentPage === "audit-logs-security",
    },

    // Reports & Notifications
    {
      id: "reports-section",
      label: "Reports",
      icon: BarChart3,
      subItems: [
        {
          id: "operational-reports",
          label: "Operational Reports",
          onClick: () => onNavigate("operational-reports"),
          active: currentPage === "operational-reports",
        },
        {
          id: "financial-summary-reports",
          label: "Financial Summary",
          onClick: () => onNavigate("financial-summary-reports"),
          active: currentPage === "financial-summary-reports",
        },
        {
          id: "customer-activity-reports",
          label: "Customer Activity",
          onClick: () => onNavigate("customer-activity-reports"),
          active: currentPage === "customer-activity-reports",
        },
        {
          id: "driver-performance-reports",
          label: "Driver Performance",
          onClick: () => onNavigate("driver-performance-reports"),
          active: currentPage === "driver-performance-reports",
        },
        {
          id: "sla-compliance-reports",
          label: "SLA Compliance",
          onClick: () => onNavigate("sla-compliance-reports"),
          active: currentPage === "sla-compliance-reports",
        },
      ],
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      onClick: () => onNavigate("notifications"),
      active: currentPage === "notifications",
    },
    {
      id: "profile",
      label: "Profile",
      icon: Users,
      onClick: () => onNavigate("profile"),
      active: currentPage === "profile",
    },

    // HB Templates Section
    {
      id: "hb-templates",
      label: "HB Templates",
      icon: Palette,
      subItems: [
        {
          id: "ui-kit",
          label: "UI Kit",
          onClick: () => onNavigate("ui-kit"),
          active: currentPage === "ui-kit",
        },
        {
          id: "sample-design",
          label: "Sample Page",
          onClick: () => onNavigate("sample-design"),
          active: currentPage === "sample-design",
        },
      ],
    },
  ];
};

// Main navigation data getter function
export const getNavigationData = (
  currentPage: string = "dashboard",
  onNavigate: (pageId: string) => void = () => { },
  userRole: UserRole = "customer"
): MenuItem[] => {
  switch (userRole) {
    case "customer":
      return getCustomerMenu(currentPage, onNavigate);
    case "operations_user":
      return getOperationsUserMenu(currentPage, onNavigate);
    case "operations_manager":
      return getOperationsManagerMenu(currentPage, onNavigate);
    case "finance_user":
      return getFinanceUserMenu(currentPage, onNavigate);
    case "admin":
      return getAdminMenu(currentPage, onNavigate);
    default:
      return getCustomerMenu(currentPage, onNavigate);
  }
};

// Helper function to get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    customer: "Customer",
    operations_user: "Operations User",
    operations_manager: "Operations Manager",
    finance_user: "Finance User",
    admin: "Admin",
  };
  return roleNames[role];
};

// Helper function to get all available roles
export const getAllRoles = (): UserRole[] => {
  return ["customer", "operations_user", "operations_manager", "finance_user", "admin"];
};