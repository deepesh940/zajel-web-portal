import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Sidebar } from "@/app/components/Sidebar";
import { GlobalHeader } from "@/app/components/GlobalHeader";
import UIKit from "@/app/components/UIKit";
import SampleDesign from "@/app/components/SampleDesign";
import Login from "@/app/pages/Login";
import UserRoleManagement from "@/app/pages/UserRoleManagement";
import MasterDataManagement from "@/app/pages/MasterDataManagement";
import VehicleTypeMaster from "@/app/pages/VehicleTypeMaster";
import CargoTypeMaster from "@/app/pages/CargoTypeMaster";
import LocationMaster from "@/app/pages/LocationMaster";
import DocumentTypeMaster from "@/app/pages/DocumentTypeMaster";
import ServiceTypeMaster from "@/app/pages/ServiceTypeMaster";
import PricingRuleMaster from "@/app/pages/PricingRuleMaster";
import SystemConfiguration from "@/app/pages/SystemConfiguration";
import AuditLogsSecurity from "@/app/pages/AuditLogsSecurity";
import Dashboard from "@/app/pages/Dashboard";
import CreateShipmentInquiry from "@/app/pages/CreateShipmentInquiry";
import MyInquiries from "@/app/pages/MyInquiries";
import QuoteReview from "@/app/pages/QuoteReview";
import Notifications from "@/app/pages/Notifications";
import Profile from "@/app/pages/Profile";
import InquiryManagement from "@/app/pages/InquiryManagement";
import SLAMonitoring from "@/app/pages/SLAMonitoring";
import PricingQuote from "@/app/pages/PricingQuote";
import PricingApproval from "@/app/pages/PricingApproval";
import DriverBidding from "@/app/pages/DriverBidding";
import DriverAssignment from "@/app/pages/DriverAssignment";
import TripMonitoring from "@/app/pages/TripMonitoring";
import CustomerApprovals from "@/app/pages/CustomerApprovals";
import EscalationManagement from "@/app/pages/EscalationManagement";
import Reports from "@/app/pages/Reports";
import OperationalReports from "@/app/pages/OperationalReports";
import FinancialSummaryReports from "@/app/pages/FinancialSummaryReports";
import CustomerActivityReports from "@/app/pages/CustomerActivityReports";
import DriverPerformanceReports from "@/app/pages/DriverPerformanceReports";
import SLAComplianceReports from "@/app/pages/SLAComplianceReports";
import DriverPayables from "@/app/pages/DriverPayables";
import CustomerInvoicing from "@/app/pages/CustomerInvoicing";
import Receivables from "@/app/pages/Receivables";
import FinancialReports from "@/app/pages/FinancialReports";
import RealTimeTracking from "@/app/pages/RealTimeTracking";
import PublicTracking from "@/app/pages/PublicTracking";
import OperationalDashboard from "@/app/pages/OperationalDashboard";
import { UserRole } from "@/mockAPI/navigationData";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLoggedIn") === "true";
    }
    return false;
  });

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    }
    return false;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("colorTheme") || "zajel";
    }
    return "zajel";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [currentPage, setCurrentPage] = useState("audit-logs-security");

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("userRole") as UserRole) || "admin";
    }
    return "admin";
  });

  /* -------------------- Theme Effects -------------------- */
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("colorTheme", currentTheme);
    document.documentElement.setAttribute(
      "data-theme",
      currentTheme,
    );
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem("userRole", currentRole);
  }, [currentRole]);

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavigateEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setCurrentPage(customEvent.detail);
      }
    };

    window.addEventListener('navigate', handleNavigateEvent);
    return () => window.removeEventListener('navigate', handleNavigateEvent);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
    localStorage.setItem("isLoggedIn", "false");
  };

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentPage("dashboard"); // Reset to dashboard when role changes
  };

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setCurrentRole(role);
    setCurrentPage("dashboard");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster
          position="top-right"
          expand
          richColors
          closeButton
          theme={isDark ? "dark" : "light"}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      {/* Sidebar */}
      <Sidebar
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() =>
          setIsSidebarCollapsed(!isSidebarCollapsed)
        }
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentRole={currentRole}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
      >
        {/* Global Header */}
        <GlobalHeader
          isDarkMode={isDark}
          onToggleDarkMode={() => setIsDark(!isDark)}
          isSidebarCollapsed={isSidebarCollapsed}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        {currentPage === "ui-kit" ? (
          <UIKit />
        ) : currentPage === "sample-design" ? (
          <SampleDesign />
        ) : currentPage === "user-role-management" ? (
          <UserRoleManagement />
        ) : currentPage === "master-data-management" ? (
          <MasterDataManagement />
        ) : currentPage === "vehicle-types" ? (
          <VehicleTypeMaster />
        ) : currentPage === "cargo-types" ? (
          <CargoTypeMaster />
        ) : currentPage === "locations" ? (
          <LocationMaster />
        ) : currentPage === "document-types" ? (
          <DocumentTypeMaster />
        ) : currentPage === "service-types" ? (
          <ServiceTypeMaster />
        ) : currentPage === "pricing-rules" ? (
          <PricingRuleMaster />
        ) : currentPage === "system-configuration" ? (
          <SystemConfiguration />
        ) : currentPage === "audit-logs-security" ? (
          <AuditLogsSecurity />
        ) : currentPage === "dashboard" ? (
          <Dashboard userRole={currentRole} />
        ) : currentPage === "create-shipment-inquiry" ? (
          <CreateShipmentInquiry />
        ) : currentPage === "my-inquiries" ? (
          <MyInquiries />
        ) : currentPage === "quote-review" ? (
          <QuoteReview />
        ) : currentPage === "notifications" ? (
          <Notifications />
        ) : currentPage === "profile" ? (
          <Profile />
        ) : currentPage === "inquiry-management" ? (
          <InquiryManagement />
        ) : currentPage === "sla-monitoring" ? (
          <SLAMonitoring />
        ) : currentPage === "pricing-quote" ? (
          <PricingQuote />
        ) : currentPage === "pricing-approval" ? (
          <PricingApproval />
        ) : currentPage === "driver-bidding" ? (
          <DriverBidding />
        ) : currentPage === "driver-assignment" ? (
          <DriverAssignment />
        ) : currentPage === "trip-monitoring" ? (
          <TripMonitoring />
        ) : currentPage === "customer-approvals" ? (
          <CustomerApprovals />
        ) : currentPage === "escalation-management" ? (
          <EscalationManagement />
        ) : currentPage === "reports" ? (
          <Reports />
        ) : currentPage === "operational-reports" ? (
          <OperationalReports />
        ) : currentPage === "financial-summary-reports" ? (
          <FinancialSummaryReports />
        ) : currentPage === "customer-activity-reports" ? (
          <CustomerActivityReports />
        ) : currentPage === "driver-performance-reports" ? (
          <DriverPerformanceReports />
        ) : currentPage === "sla-compliance-reports" ? (
          <SLAComplianceReports />
        ) : currentPage === "driver-payables" ? (
          <DriverPayables />
        ) : currentPage === "customer-invoicing" ? (
          <CustomerInvoicing />
        ) : currentPage === "receivables" ? (
          <Receivables />
        ) : currentPage === "financial-reports" ? (
          <FinancialReports />
        ) : currentPage === "real-time-tracking" ? (
          <RealTimeTracking />
        ) : currentPage === "public-tracking" ? (
          <PublicTracking />
        ) : currentPage === "operational-dashboard" ? (
          <OperationalDashboard />
        ) : (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl text-neutral-900 dark:text-white mb-4">
                {currentPage === "dashboard" ? "Dashboard" : currentPage.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                This is a placeholder page for <strong>{currentPage}</strong>. The actual implementation will be added in the next phase.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      <Toaster
        position="top-right"
        expand
        richColors
        closeButton
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
}