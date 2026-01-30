import { useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  DollarSign,
  Tag,
  FileText,
  ArrowRight,
  Plus,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import {
  PageHeader,
  IconButton,
  SummaryWidgets,
} from "../components/hb/listing";
import { toast } from "sonner";

interface MasterDataCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  route: string;
  color: string;
  count: number;
  activeCount: number;
  inactiveCount: number;
}

export default function MasterDataManagement() {
  const [showSummary, setShowSummary] = useState(false);

  const categories: MasterDataCategory[] = [
    {
      id: "vehicle-types",
      name: "Vehicle Types",
      description: "Manage vehicle types, specifications, and capacity details",
      icon: Truck,
      route: "/master-data/vehicle-types",
      color: "primary",
      count: 8,
      activeCount: 7,
      inactiveCount: 1,
    },
    {
      id: "cargo-types",
      name: "Cargo Types",
      description: "Manage cargo categories, handling requirements, and classifications",
      icon: Package,
      route: "/master-data/cargo-types",
      color: "success",
      count: 12,
      activeCount: 11,
      inactiveCount: 1,
    },
    {
      id: "locations",
      name: "Locations",
      description: "Manage cities, zones, regions, and delivery locations",
      icon: MapPin,
      route: "/master-data/locations",
      color: "warning",
      count: 25,
      activeCount: 24,
      inactiveCount: 1,
    },
    {
      id: "pricing-rules",
      name: "Pricing Rules",
      description: "Configure pricing rules, rate cards, and surcharge policies",
      icon: DollarSign,
      route: "/master-data/pricing-rules",
      color: "info",
      count: 15,
      activeCount: 14,
      inactiveCount: 1,
    },
    {
      id: "service-types",
      name: "Service Types",
      description: "Define service levels, delivery options, and SLA configurations",
      icon: Tag,
      route: "/master-data/service-types",
      color: "error",
      count: 6,
      activeCount: 6,
      inactiveCount: 0,
    },
    {
      id: "document-types",
      name: "Document Types",
      description: "Manage required documents, templates, and validation rules",
      icon: FileText,
      route: "/master-data/document-types",
      color: "neutral",
      count: 10,
      activeCount: 9,
      inactiveCount: 1,
    },
  ];

  const handleNavigateToCategory = (route: string) => {
    window.location.href = route;
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      primary: {
        bg: "bg-primary-50 dark:bg-primary-900/30",
        border: "border-primary-200 dark:border-primary-800",
        text: "text-primary-700 dark:text-primary-400",
        icon: "text-primary-600 dark:text-primary-400",
      },
      success: {
        bg: "bg-success-50 dark:bg-success-900/30",
        border: "border-success-200 dark:border-success-800",
        text: "text-success-700 dark:text-success-400",
        icon: "text-success-600 dark:text-success-400",
      },
      warning: {
        bg: "bg-warning-50 dark:bg-warning-900/30",
        border: "border-warning-200 dark:border-warning-800",
        text: "text-warning-700 dark:text-warning-400",
        icon: "text-warning-600 dark:text-warning-400",
      },
      info: {
        bg: "bg-info-50 dark:bg-info-900/30",
        border: "border-info-200 dark:border-info-800",
        text: "text-info-700 dark:text-info-400",
        icon: "text-info-600 dark:text-info-400",
      },
      error: {
        bg: "bg-error-50 dark:bg-error-900/30",
        border: "border-error-200 dark:border-error-800",
        text: "text-error-700 dark:text-error-400",
        icon: "text-error-600 dark:text-error-400",
      },
      neutral: {
        bg: "bg-neutral-50 dark:bg-neutral-900/30",
        border: "border-neutral-200 dark:border-neutral-800",
        text: "text-neutral-700 dark:text-neutral-400",
        icon: "text-neutral-600 dark:text-neutral-400",
      },
    };
    return colorMap[color] || colorMap.neutral;
  };

  const totalRecords = categories.reduce((sum, cat) => sum + cat.count, 0);
  const totalActive = categories.reduce((sum, cat) => sum + cat.activeCount, 0);
  const totalInactive = categories.reduce((sum, cat) => sum + cat.inactiveCount, 0);

  const stats = [
    {
      label: "Total Records",
      value: totalRecords,
      icon: "Database",
      subtitle: "Across all categories",
    },
    {
      label: "Active",
      value: totalActive,
      icon: "CheckCircle",
      subtitle: "Currently in use",
    },
    {
      label: "Inactive",
      value: totalInactive,
      icon: "XCircle",
      subtitle: "Not in use",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: "Tag",
      subtitle: "Master data types",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Master Data Management"
          subtitle="Configure and manage core system data and business rules"
          breadcrumbs={[
            { label: "Admin", href: "#" },
            { label: "Master Data Management", current: true },
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
        </PageHeader>

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && <SummaryWidgets widgets={stats} />}

        {/* ========== NAVIGATION DESCRIPTION ========== */}
        <div className="mb-6">
          <div className="bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-info-100 dark:bg-info-900/50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-info-600 dark:text-info-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-info-900 dark:text-info-300 mb-1">
                  Select a Category to Manage
                </h3>
                <p className="text-sm text-info-700 dark:text-info-400">
                  Choose from the categories below to view, create, edit, or delete master data records. 
                  Each category contains essential system configurations that power the ZAJEL platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========== MASTER DATA CATEGORIES GRID ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const colors = getColorClasses(category.color);

            return (
              <div
                key={category.id}
                onClick={() => handleNavigateToCategory(category.route)}
                className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-lg hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer group"
              >
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 dark:text-neutral-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-neutral-900 dark:text-white">
                      {category.count}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Total
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success-600 dark:text-success-400">
                      {category.activeCount}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Active
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-neutral-400 dark:text-neutral-600">
                      {category.inactiveCount}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Inactive
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToCategory(category.route);
                  }}
                  className="w-full px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Manage {category.name}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* ========== QUICK STATS SECTION ========== */}
        <div className="mt-8 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Master Data Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Active Records
                </h4>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {cat.name}
                    </span>
                    <span className="font-medium text-success-600 dark:text-success-400">
                      {cat.activeCount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <XCircle className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Inactive Records
                </h4>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {cat.name}
                    </span>
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">
                      {cat.inactiveCount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Recent Updates
                </h4>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Last Modified
                  </div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">
                    Today, 09:30 AM
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Vehicle Types updated
                  </div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Created
                  </div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">
                    Yesterday, 03:15 PM
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    New pricing rule added
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== HELP TEXT ========== */}
        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                About Master Data Management
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Master data management provides centralized control over critical business data that 
                powers the ZAJEL Digital Logistics Platform. Each category contains configurable records 
                that define how the system operates, from vehicle specifications to pricing rules. 
                Changes made here will immediately affect all related system operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}