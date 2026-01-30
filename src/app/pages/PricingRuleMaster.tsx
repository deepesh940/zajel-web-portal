import { useState } from "react";
import {
  DollarSign,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  BarChart3,
  RefreshCw,
  CheckCircle,
  XCircle,
  TrendingUp,
  Percent,
} from "lucide-react";
import {
  PageHeader,
  IconButton,
  SummaryWidgets,
  ViewModeSwitcher,
  AdvancedSearchPanel,
  FilterChips,
  SearchBar,
  Pagination,
} from "../components/hb/listing";
import type { FilterCondition } from "../components/hb/listing";
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormTextarea,
  FormSelect,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface PricingRule {
  id: string;
  code: string;
  name: string;
  description: string;
  ruleType: "Base Rate" | "Distance-Based" | "Weight-Based" | "Time-Based" | "Surcharge";
  applicability: "All Services" | "Express Only" | "Standard Only" | "Custom";
  calculationMethod: "Fixed" | "Percentage" | "Per Unit";
  value: number;
  unit: string;
  minValue?: number;
  maxValue?: number;
  priority: number;
  status: "Active" | "Inactive";
  effectiveFrom: string;
  effectiveTo?: string;
  createdDate: string;
  modifiedDate: string;
}

type ViewMode = "grid" | "list" | "table";

export default function PricingRuleMaster() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Form state
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRuleType, setFormRuleType] = useState<PricingRule["ruleType"]>("Base Rate");
  const [formApplicability, setFormApplicability] = useState<PricingRule["applicability"]>("All Services");
  const [formCalculationMethod, setFormCalculationMethod] = useState<PricingRule["calculationMethod"]>("Fixed");
  const [formValue, setFormValue] = useState("");
  const [formUnit, setFormUnit] = useState("AED");
  const [formPriority, setFormPriority] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formEffectiveFrom, setFormEffectiveFrom] = useState("");

  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: "1",
      code: "BR-001",
      name: "Standard Base Rate",
      description: "Base rate for standard delivery services",
      ruleType: "Base Rate",
      applicability: "Standard Only",
      calculationMethod: "Fixed",
      value: 50.0,
      unit: "AED",
      priority: 1,
      status: "Active",
      effectiveFrom: "2024-01-01",
      createdDate: "2023-12-15",
      modifiedDate: "2024-01-10",
    },
    {
      id: "2",
      code: "DB-001",
      name: "Distance Charge",
      description: "Per kilometer charge for all services",
      ruleType: "Distance-Based",
      applicability: "All Services",
      calculationMethod: "Per Unit",
      value: 3.5,
      unit: "AED/km",
      priority: 2,
      status: "Active",
      effectiveFrom: "2024-01-01",
      createdDate: "2023-12-15",
      modifiedDate: "2024-01-15",
    },
    {
      id: "3",
      code: "WB-001",
      name: "Weight Surcharge",
      description: "Additional charge for heavy cargo (>500kg)",
      ruleType: "Weight-Based",
      applicability: "All Services",
      calculationMethod: "Percentage",
      value: 15.0,
      unit: "%",
      minValue: 500,
      priority: 3,
      status: "Active",
      effectiveFrom: "2024-01-01",
      createdDate: "2024-01-05",
      modifiedDate: "2024-01-20",
    },
    {
      id: "4",
      code: "TB-001",
      name: "After Hours Premium",
      description: "Premium for deliveries after 6 PM",
      ruleType: "Time-Based",
      applicability: "All Services",
      calculationMethod: "Percentage",
      value: 20.0,
      unit: "%",
      priority: 4,
      status: "Active",
      effectiveFrom: "2024-01-01",
      createdDate: "2024-01-10",
      modifiedDate: "2024-01-18",
    },
    {
      id: "5",
      code: "SR-001",
      name: "Weekend Surcharge",
      description: "Additional charge for weekend deliveries",
      ruleType: "Surcharge",
      applicability: "All Services",
      calculationMethod: "Fixed",
      value: 30.0,
      unit: "AED",
      priority: 5,
      status: "Active",
      effectiveFrom: "2024-01-01",
      createdDate: "2024-01-12",
      modifiedDate: "2024-01-22",
    },
    {
      id: "6",
      code: "BR-002",
      name: "Express Base Rate (Deprecated)",
      description: "Old base rate for express services",
      ruleType: "Base Rate",
      applicability: "Express Only",
      calculationMethod: "Fixed",
      value: 100.0,
      unit: "AED",
      priority: 1,
      status: "Inactive",
      effectiveFrom: "2023-06-01",
      effectiveTo: "2023-12-31",
      createdDate: "2023-06-01",
      modifiedDate: "2023-12-31",
    },
  ]);

  // Filter options for advanced search
  const filterOptions: FilterCondition[] = [
    {
      id: "status",
      label: "Status",
      type: "select",
      values: [],
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
    {
      id: "ruleType",
      label: "Rule Type",
      type: "select",
      values: [],
      options: [
        { value: "Base Rate", label: "Base Rate" },
        { value: "Distance-Based", label: "Distance-Based" },
        { value: "Weight-Based", label: "Weight-Based" },
        { value: "Time-Based", label: "Time-Based" },
        { value: "Surcharge", label: "Surcharge" },
      ],
    },
    {
      id: "applicability",
      label: "Applicability",
      type: "select",
      values: [],
      options: [
        { value: "All Services", label: "All Services" },
        { value: "Express Only", label: "Express Only" },
        { value: "Standard Only", label: "Standard Only" },
        { value: "Custom", label: "Custom" },
      ],
    },
  ];

  // Apply filters
  const filteredRules = pricingRules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(rule.status);

    const ruleTypeFilter = filters.find((f) => f.id === "ruleType");
    const matchesRuleType =
      !ruleTypeFilter || ruleTypeFilter.values.length === 0 || ruleTypeFilter.values.includes(rule.ruleType);

    const applicabilityFilter = filters.find((f) => f.id === "applicability");
    const matchesApplicability =
      !applicabilityFilter || applicabilityFilter.values.length === 0 || applicabilityFilter.values.includes(rule.applicability);

    return matchesSearch && matchesStatus && matchesRuleType && matchesApplicability;
  });

  // Apply sorting
  const sortedRules = [...filteredRules].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "code") {
      comparison = a.code.localeCompare(b.code);
    } else if (sortField === "priority") {
      comparison = a.priority - b.priority;
    } else if (sortField === "value") {
      comparison = a.value - b.value;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRules.length / itemsPerPage);
  const paginatedRules = sortedRules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            status === "Active" ? "bg-success-500" : "bg-neutral-400"
          }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getRuleTypeColor = (ruleType: string) => {
    switch (ruleType) {
      case "Base Rate":
        return "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30";
      case "Distance-Based":
        return "text-info-600 dark:text-info-400 bg-info-50 dark:bg-info-900/30";
      case "Weight-Based":
        return "text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/30";
      case "Time-Based":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30";
      case "Surcharge":
        return "text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/30";
      default:
        return "text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/30";
    }
  };

  const handleViewDetails = (rule: PricingRule) => {
    setSelectedRule(rule);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setFormCode(rule.code);
    setFormName(rule.name);
    setFormDescription(rule.description);
    setFormRuleType(rule.ruleType);
    setFormApplicability(rule.applicability);
    setFormCalculationMethod(rule.calculationMethod);
    setFormValue(rule.value.toString());
    setFormUnit(rule.unit);
    setFormPriority(rule.priority.toString());
    setFormStatus(rule.status);
    setFormEffectiveFrom(rule.effectiveFrom);
    setShowCreateModal(true);
    setOpenActionMenuId(null);
  };

  const handleDelete = (rule: PricingRule) => {
    setSelectedRule(rule);
    setShowDeleteModal(true);
    setOpenActionMenuId(null);
  };

  const confirmDelete = () => {
    if (selectedRule) {
      setPricingRules(pricingRules.filter((r) => r.id !== selectedRule.id));
      toast.success(`Pricing rule ${selectedRule.name} deleted successfully`);
    }
    setShowDeleteModal(false);
    setSelectedRule(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const handleAddNew = () => {
    setEditingRule(null);
    setFormCode("");
    setFormName("");
    setFormDescription("");
    setFormRuleType("Base Rate");
    setFormApplicability("All Services");
    setFormCalculationMethod("Fixed");
    setFormValue("");
    setFormUnit("AED");
    setFormPriority("");
    setFormStatus("Active");
    setFormEffectiveFrom("");
    setShowCreateModal(true);
  };

  const handleSave = () => {
    if (editingRule) {
      setPricingRules(
        pricingRules.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                code: formCode,
                name: formName,
                description: formDescription,
                ruleType: formRuleType,
                applicability: formApplicability,
                calculationMethod: formCalculationMethod,
                value: parseFloat(formValue),
                unit: formUnit,
                priority: parseInt(formPriority),
                status: formStatus,
                effectiveFrom: formEffectiveFrom,
                modifiedDate: new Date().toISOString().split("T")[0],
              }
            : r
        )
      );
      toast.success(`Pricing rule ${formName} updated successfully`);
    } else {
      const newRule: PricingRule = {
        id: String(pricingRules.length + 1),
        code: formCode,
        name: formName,
        description: formDescription,
        ruleType: formRuleType,
        applicability: formApplicability,
        calculationMethod: formCalculationMethod,
        value: parseFloat(formValue),
        unit: formUnit,
        priority: parseInt(formPriority),
        status: formStatus,
        effectiveFrom: formEffectiveFrom,
        createdDate: new Date().toISOString().split("T")[0],
        modifiedDate: new Date().toISOString().split("T")[0],
      };
      setPricingRules([...pricingRules, newRule]);
      toast.success(`Pricing rule ${formName} created successfully`);
    }
    setShowCreateModal(false);
  };

  const stats = [
    {
      label: "Total Rules",
      value: pricingRules.length,
      icon: "DollarSign",
      subtitle: "All pricing rules",
    },
    {
      label: "Active Rules",
      value: pricingRules.filter((r) => r.status === "Active").length,
      icon: "CheckCircle",
      subtitle: "Currently applied",
    },
    {
      label: "Inactive Rules",
      value: pricingRules.filter((r) => r.status === "Inactive").length,
      icon: "XCircle",
      subtitle: "Deprecated rules",
    },
    {
      label: "Surcharges",
      value: pricingRules.filter((r) => r.ruleType === "Surcharge" || r.ruleType === "Time-Based").length,
      icon: "TrendingUp",
      subtitle: "Additional charges",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Pricing Rules"
          subtitle="Manage pricing rules, rate cards, and surcharge policies"
          breadcrumbs={[
            { label: "Master Data", href: "/master-data" },
            { label: "Pricing Rules", current: true },
          ]}
          primaryAction={{
            label: "+ Add Pricing Rule",
            onClick: handleAddNew,
          }}
          moreMenu={{
            onImport: () => toast.success("Import functionality"),
            exportOptions: {
              onExportCSV: () => toast.success("Exporting as CSV..."),
              onExportExcel: () => toast.success("Exporting as Excel..."),
              onExportPDF: () => toast.success("Exporting as PDF..."),
            },
            onPrint: () => window.print(),
            sortOptions: [
              { value: "name", label: "Name (A-Z)", direction: "asc" },
              { value: "name", label: "Name (Z-A)", direction: "desc" },
              { value: "code", label: "Code (A-Z)", direction: "asc" },
              { value: "priority", label: "Priority (Low to High)", direction: "asc" },
              { value: "value", label: "Value (Low to High)", direction: "asc" },
              { value: "value", label: "Value (High to Low)", direction: "desc" },
            ],
            sortField: sortField,
            sortDirection: sortDirection,
            onSortChange: (field, direction) => {
              setSortField(field);
              setSortDirection(direction);
            },
          }}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter((f) => f.values.length > 0).length}
              placeholder="Search pricing rules..."
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
            />
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

        {/* ========== FILTER CHIPS ========== */}
        {filters.some((f) => f.values.length > 0) && (
          <FilterChips
            filters={filters}
            onRemove={(filterId) => {
              setFilters(
                filters.map((f) =>
                  f.id === filterId ? { ...f, values: [] } : f
                )
              );
            }}
            onClearAll={() => setFilters(filterOptions.map((f) => ({ ...f, values: [] })))}
          />
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && <SummaryWidgets widgets={stats} />}

        {/* ========== CONTENT AREA ========== */}
        <div className="space-y-4">
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(rule)}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {rule.name}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {rule.code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(rule.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === rule.id ? null : rule.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === rule.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(rule);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(rule);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Rule
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCode(rule.code);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Code
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(rule);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                    {rule.description}
                  </p>

                  {/* Rule Type Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRuleTypeColor(rule.ruleType)}`}>
                      {rule.ruleType}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-success-50 dark:bg-success-900/30 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-success-600 dark:text-success-400" />
                        <span className="text-xs text-success-700 dark:text-success-400">Value</span>
                      </div>
                      <div className="text-sm font-semibold text-success-600 dark:text-success-400">
                        {rule.calculationMethod === "Percentage" ? `${rule.value}%` : `${rule.value} ${rule.unit}`}
                      </div>
                    </div>
                    <div className="p-2 bg-info-50 dark:bg-info-900/30 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-info-600 dark:text-info-400" />
                        <span className="text-xs text-info-700 dark:text-info-400">Priority</span>
                      </div>
                      <div className="text-sm font-semibold text-info-600 dark:text-info-400">
                        #{rule.priority}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {rule.name}
                        </h3>
                        {getStatusBadge(rule.status)}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRuleTypeColor(rule.ruleType)}`}>
                          {rule.ruleType}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {rule.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Code: <span className="font-medium text-neutral-900 dark:text-white">{rule.code}</span>
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Value: <span className="font-medium text-success-600 dark:text-success-400">
                            {rule.calculationMethod === "Percentage" ? `${rule.value}%` : `${rule.value} ${rule.unit}`}
                          </span>
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Priority: <span className="font-medium text-info-600 dark:text-info-400">#{rule.priority}</span>
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Applies to: <span className="font-medium text-neutral-900 dark:text-white">{rule.applicability}</span>
                        </span>
                      </div>
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(
                            openActionMenuId === rule.id ? null : rule.id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === rule.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleViewDetails(rule)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleEdit(rule)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Rule
                          </button>
                          <button
                            onClick={() => {
                              handleCopyCode(rule.code);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Code
                          </button>
                          <button
                            onClick={() => handleDelete(rule)}
                            className="w-full px-4 py-2.5 text-left text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
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
                        Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Priority
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
                    {paginatedRules.map((rule) => (
                      <tr
                        key={rule.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer"
                        onClick={() => handleViewDetails(rule)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {rule.code}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCode(rule.code);
                              }}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {rule.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRuleTypeColor(rule.ruleType)}`}>
                            {rule.ruleType}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-success-600 dark:text-success-400">
                            {rule.calculationMethod === "Percentage" ? `${rule.value}%` : `${rule.value} ${rule.unit}`}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-info-600 dark:text-info-400">
                            #{rule.priority}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(rule.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === rule.id ? null : rule.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === rule.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(rule);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(rule);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyCode(rule.code);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Code
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(rule);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredRules.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <DollarSign className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No pricing rules found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first pricing rule"}
                </p>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Pricing Rule
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredRules.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRules.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* Create/Edit Modal */}
        <FormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={editingRule ? "Edit Pricing Rule" : "Add New Pricing Rule"}
          description={editingRule ? `Update ${editingRule.name}` : "Create a new pricing rule"}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>
                  Rule Code
                </FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="e.g., BR-001"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="priority" required>
                  Priority
                </FormLabel>
                <FormInput
                  id="priority"
                  type="number"
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                  placeholder="e.g., 1"
                />
              </FormField>
            </div>

            <FormField>
              <FormLabel htmlFor="name" required>
                Rule Name
              </FormLabel>
              <FormInput
                id="name"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Standard Base Rate"
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="description" required>
                Description
              </FormLabel>
              <FormTextarea
                id="description"
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter rule description..."
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="ruleType" required>
                  Rule Type
                </FormLabel>
                <FormSelect
                  id="ruleType"
                  value={formRuleType}
                  onChange={(e) => setFormRuleType(e.target.value as any)}
                >
                  <option value="Base Rate">Base Rate</option>
                  <option value="Distance-Based">Distance-Based</option>
                  <option value="Weight-Based">Weight-Based</option>
                  <option value="Time-Based">Time-Based</option>
                  <option value="Surcharge">Surcharge</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="applicability" required>
                  Applicability
                </FormLabel>
                <FormSelect
                  id="applicability"
                  value={formApplicability}
                  onChange={(e) => setFormApplicability(e.target.value as any)}
                >
                  <option value="All Services">All Services</option>
                  <option value="Express Only">Express Only</option>
                  <option value="Standard Only">Standard Only</option>
                  <option value="Custom">Custom</option>
                </FormSelect>
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField>
                <FormLabel htmlFor="calculationMethod" required>
                  Calculation Method
                </FormLabel>
                <FormSelect
                  id="calculationMethod"
                  value={formCalculationMethod}
                  onChange={(e) => setFormCalculationMethod(e.target.value as any)}
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Per Unit">Per Unit</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="value" required>
                  Value
                </FormLabel>
                <FormInput
                  id="value"
                  type="number"
                  step="0.01"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="e.g., 50.00"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="unit" required>
                  Unit
                </FormLabel>
                <FormInput
                  id="unit"
                  type="text"
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  placeholder="e.g., AED or %"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="effectiveFrom" required>
                  Effective From
                </FormLabel>
                <FormInput
                  id="effectiveFrom"
                  type="date"
                  value={formEffectiveFrom}
                  onChange={(e) => setFormEffectiveFrom(e.target.value)}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="status" required>
                  Status
                </FormLabel>
                <FormSelect
                  id="status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "Active" | "Inactive")}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </FormSelect>
              </FormField>
            </div>
          </div>

          <FormFooter>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
            >
              {editingRule ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingRule ? "Update" : "Create"} Rule
            </button>
          </FormFooter>
        </FormModal>

        {/* Details Modal */}
        {selectedRule && (
          <FormModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Pricing Rule Details"
            description={selectedRule.code}
            maxWidth="max-w-3xl"
          >
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Rule Name
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRule.name}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedRule.status)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Description
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  {selectedRule.description}
                </p>
              </div>

              {/* Rule Specifications */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 border rounded-lg ${getRuleTypeColor(selectedRule.ruleType)}`}>
                  <p className="text-xs mb-1 font-medium">
                    Rule Type
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedRule.ruleType}
                  </p>
                </div>
                <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                  <p className="text-xs text-info-700 dark:text-info-400 mb-1">
                    Calculation Method
                  </p>
                  <p className="text-sm font-medium text-info-900 dark:text-info-300">
                    {selectedRule.calculationMethod}
                  </p>
                </div>
                <div className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg">
                  <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                    Value
                  </p>
                  <p className="text-sm font-medium text-success-900 dark:text-success-300">
                    {selectedRule.calculationMethod === "Percentage" ? `${selectedRule.value}%` : `${selectedRule.value} ${selectedRule.unit}`}
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Applicability
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRule.applicability}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Priority
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    #{selectedRule.priority}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Effective From
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRule.effectiveFrom}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Created Date
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRule.createdDate}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Last Modified
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedRule.modifiedDate}
                  </p>
                </div>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEdit(selectedRule);
                }}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Rule
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Delete Modal */}
        {selectedRule && (
          <FormModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete Pricing Rule"
            description={`Are you sure you want to delete ${selectedRule.name}?`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-sm text-error-900 dark:text-error-400">
                  This action cannot be undone. Deleting this pricing rule may affect active quotes and pricing calculations.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedRule.name}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {selectedRule.code}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm text-white bg-error-500 hover:bg-error-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Rule
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    </div>
  );
}
