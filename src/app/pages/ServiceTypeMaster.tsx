import { useState } from "react";
import {
  Tag,
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
  Clock,
  Zap,
  Package,
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

interface ServiceType {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  priority: "Standard" | "Express" | "Same Day" | "Scheduled";
  slaHours: number;
  basePrice: number;
  status: "Active" | "Inactive";
  features: string[];
  createdDate: string;
  modifiedDate: string;
}

type ViewMode = "grid" | "list" | "table";

export default function ServiceTypeMaster() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
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
  const [formPriority, setFormPriority] = useState<"Standard" | "Express" | "Same Day" | "Scheduled">("Standard");
  const [formSlaHours, setFormSlaHours] = useState("");
  const [formBasePrice, setFormBasePrice] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([
    {
      id: "1",
      code: "STD-001",
      name: "Standard Delivery",
      description: "Regular delivery service with standard timeline",
      icon: "Package",
      priority: "Standard",
      slaHours: 48,
      basePrice: 50.0,
      status: "Active",
      features: ["Track & Trace", "Basic Insurance", "Proof of Delivery"],
      createdDate: "2023-01-15",
      modifiedDate: "2024-01-10",
    },
    {
      id: "2",
      code: "EXP-001",
      name: "Express Delivery",
      description: "Fast delivery service for urgent shipments",
      icon: "Zap",
      priority: "Express",
      slaHours: 24,
      basePrice: 120.0,
      status: "Active",
      features: ["Priority Handling", "Real-time Tracking", "Enhanced Insurance", "SMS Notifications"],
      createdDate: "2023-01-15",
      modifiedDate: "2024-01-15",
    },
    {
      id: "3",
      code: "SMD-001",
      name: "Same Day Delivery",
      description: "Ultra-fast same-day delivery service",
      icon: "Clock",
      priority: "Same Day",
      slaHours: 8,
      basePrice: 200.0,
      status: "Active",
      features: ["Same Day Guarantee", "Priority Handling", "Real-time GPS Tracking", "Direct Communication"],
      createdDate: "2023-02-01",
      modifiedDate: "2024-01-20",
    },
    {
      id: "4",
      code: "SCH-001",
      name: "Scheduled Delivery",
      description: "Delivery at customer-specified date and time",
      icon: "Calendar",
      priority: "Scheduled",
      slaHours: 72,
      basePrice: 80.0,
      status: "Active",
      features: ["Date & Time Selection", "Track & Trace", "Advance Notifications", "Flexible Scheduling"],
      createdDate: "2023-03-10",
      modifiedDate: "2024-01-12",
    },
    {
      id: "5",
      code: "ECO-001",
      name: "Economy Delivery",
      description: "Budget-friendly delivery option",
      icon: "Package",
      priority: "Standard",
      slaHours: 96,
      basePrice: 35.0,
      status: "Active",
      features: ["Basic Tracking", "Standard Insurance"],
      createdDate: "2023-04-05",
      modifiedDate: "2023-12-20",
    },
    {
      id: "6",
      code: "PRE-001",
      name: "Premium Delivery",
      description: "Premium white-glove delivery service (Inactive)",
      icon: "Star",
      priority: "Express",
      slaHours: 12,
      basePrice: 350.0,
      status: "Inactive",
      features: ["White Glove Service", "Premium Insurance", "Dedicated Support", "Installation Service"],
      createdDate: "2023-05-15",
      modifiedDate: "2023-11-30",
    },
  ]);

  // Filter options for advanced search
  const filterOptions: Record<string, string[]> = {
    "Status": ["Active", "Inactive"],
    "Priority": ["Standard", "Express", "Same Day", "Scheduled"],
  };

  // Apply filters
  const filteredServiceTypes = serviceTypes.filter((serviceType) => {
    const matchesSearch =
      serviceType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceType.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceType.description.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.field === "Status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(serviceType.status);

    const priorityFilter = filters.find((f) => f.field === "Priority");
    const matchesPriority =
      !priorityFilter || priorityFilter.values.length === 0 || priorityFilter.values.includes(serviceType.priority);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Apply sorting
  const sortedServiceTypes = [...filteredServiceTypes].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "code") {
      comparison = a.code.localeCompare(b.code);
    } else if (sortField === "slaHours") {
      comparison = a.slaHours - b.slaHours;
    } else if (sortField === "basePrice") {
      comparison = a.basePrice - b.basePrice;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedServiceTypes.length / itemsPerPage);
  const paginatedServiceTypes = sortedServiceTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    return status === "Active" ? "success" : "neutral";
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status) === "success" ? "bg-success-500" : "bg-neutral-400"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Same Day":
        return "text-error-600 dark:text-error-400";
      case "Express":
        return "text-warning-600 dark:text-warning-400";
      case "Scheduled":
        return "text-info-600 dark:text-info-400";
      default:
        return "text-neutral-600 dark:text-neutral-400";
    }
  };

  const handleViewDetails = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleEdit = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setFormCode(serviceType.code);
    setFormName(serviceType.name);
    setFormDescription(serviceType.description);
    setFormPriority(serviceType.priority);
    setFormSlaHours(serviceType.slaHours.toString());
    setFormBasePrice(serviceType.basePrice.toString());
    setFormStatus(serviceType.status);
    setShowCreateModal(true);
    setOpenActionMenuId(null);
  };

  const handleDelete = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setShowDeleteModal(true);
    setOpenActionMenuId(null);
  };

  const confirmDelete = () => {
    if (selectedServiceType) {
      setServiceTypes(serviceTypes.filter((st) => st.id !== selectedServiceType.id));
      toast.success(`Service type ${selectedServiceType.name} deleted successfully`);
    }
    setShowDeleteModal(false);
    setSelectedServiceType(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const handleAddNew = () => {
    setEditingServiceType(null);
    setFormCode("");
    setFormName("");
    setFormDescription("");
    setFormPriority("Standard");
    setFormSlaHours("");
    setFormBasePrice("");
    setFormStatus("Active");
    setShowCreateModal(true);
  };

  const handleSave = () => {
    if (editingServiceType) {
      setServiceTypes(
        serviceTypes.map((st) =>
          st.id === editingServiceType.id
            ? {
              ...st,
              code: formCode,
              name: formName,
              description: formDescription,
              priority: formPriority,
              slaHours: parseInt(formSlaHours),
              basePrice: parseFloat(formBasePrice),
              status: formStatus,
              modifiedDate: new Date().toISOString().split("T")[0],
            }
            : st
        )
      );
      toast.success(`Service type ${formName} updated successfully`);
    } else {
      const newServiceType: ServiceType = {
        id: String(serviceTypes.length + 1),
        code: formCode,
        name: formName,
        description: formDescription,
        icon: "Package",
        priority: formPriority,
        slaHours: parseInt(formSlaHours),
        basePrice: parseFloat(formBasePrice),
        status: formStatus,
        features: [],
        createdDate: new Date().toISOString().split("T")[0],
        modifiedDate: new Date().toISOString().split("T")[0],
      };
      setServiceTypes([...serviceTypes, newServiceType]);
      toast.success(`Service type ${formName} created successfully`);
    }
    setShowCreateModal(false);
  };

  const stats = [
    {
      label: "Total Service Types",
      value: serviceTypes.length,
      icon: "Tag",
      subtitle: "All service types",
    },
    {
      label: "Active",
      value: serviceTypes.filter((st) => st.status === "Active").length,
      icon: "CheckCircle",
      subtitle: "Currently available",
    },
    {
      label: "Inactive",
      value: serviceTypes.filter((st) => st.status === "Inactive").length,
      icon: "XCircle",
      subtitle: "Not in use",
    },
    {
      label: "Express Services",
      value: serviceTypes.filter((st) => st.priority === "Express" || st.priority === "Same Day").length,
      icon: "Zap",
      subtitle: "Priority services",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Service Types"
          subtitle="Manage delivery service levels and configurations"
          breadcrumbs={[
            { label: "Master Data", href: "/master-data" },
            { label: "Service Types", current: true },
          ]}
          primaryAction={{
            label: "+ Add Service Type",
            onClick: handleAddNew,
          }}
          moreMenu={{

            onPrint: () => window.print(),
            sortOptions: [
              { value: "name", label: "Name (A-Z)", direction: "asc" },
              { value: "name", label: "Name (Z-A)", direction: "desc" },
              { value: "code", label: "Code (A-Z)", direction: "asc" },
              { value: "slaHours", label: "SLA (Fastest First)", direction: "asc" },
              { value: "basePrice", label: "Price (Low to High)", direction: "asc" },
              { value: "basePrice", label: "Price (High to Low)", direction: "desc" },
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
              placeholder="Search service types..."
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
            onClearAll={() => setFilters([])}
          />
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && <SummaryWidgets widgets={stats} />}

        {/* ========== CONTENT AREA ========== */}
        <div className="space-y-4">
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedServiceTypes.map((serviceType) => (
                <div
                  key={serviceType.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(serviceType)}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {serviceType.name}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {serviceType.code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(serviceType.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === serviceType.id ? null : serviceType.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === serviceType.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(serviceType);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(serviceType);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Service Type
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCode(serviceType.code);
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
                                handleDelete(serviceType);
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
                    {serviceType.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-2 bg-info-50 dark:bg-info-900/30 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-info-600 dark:text-info-400" />
                        <span className="text-xs text-info-700 dark:text-info-400">SLA</span>
                      </div>
                      <div className="text-sm font-semibold text-info-600 dark:text-info-400">
                        {serviceType.slaHours}h
                      </div>
                    </div>
                    <div className="p-2 bg-success-50 dark:bg-success-900/30 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <Package className="w-3 h-3 text-success-600 dark:text-success-400" />
                        <span className="text-xs text-success-700 dark:text-success-400">Base Price</span>
                      </div>
                      <div className="text-sm font-semibold text-success-600 dark:text-success-400">
                        AED {serviceType.basePrice}
                      </div>
                    </div>
                  </div>

                  {/* Features Count */}
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    {serviceType.features.length} features included
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW & TABLE VIEW - Similar structure as other master pages */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedServiceTypes.map((serviceType) => (
                <div
                  key={serviceType.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {serviceType.name}
                        </h3>
                        {getStatusBadge(serviceType.status)}
                        <span className={`text-xs font-medium ${getPriorityColor(serviceType.priority)}`}>
                          {serviceType.priority}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {serviceType.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Code: <span className="font-medium text-neutral-900 dark:text-white">{serviceType.code}</span>
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          SLA: <span className="font-medium text-info-600 dark:text-info-400">{serviceType.slaHours}h</span>
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Price: <span className="font-medium text-success-600 dark:text-success-400">AED {serviceType.basePrice}</span>
                        </span>
                      </div>
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(
                            openActionMenuId === serviceType.id ? null : serviceType.id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === serviceType.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleViewDetails(serviceType)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleEdit(serviceType)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Service Type
                          </button>
                          <button
                            onClick={() => {
                              handleCopyCode(serviceType.code);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Code
                          </button>
                          <button
                            onClick={() => handleDelete(serviceType)}
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
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        SLA
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Base Price
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
                    {paginatedServiceTypes.map((serviceType) => (
                      <tr
                        key={serviceType.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer"
                        onClick={() => handleViewDetails(serviceType)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {serviceType.code}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCode(serviceType.code);
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
                            {serviceType.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getPriorityColor(serviceType.priority)}`}>
                            {serviceType.priority}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm text-info-600 dark:text-info-400 font-medium">
                            {serviceType.slaHours} hours
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-success-600 dark:text-success-400">
                            AED {serviceType.basePrice}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(serviceType.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === serviceType.id ? null : serviceType.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === serviceType.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(serviceType);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(serviceType);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyCode(serviceType.code);
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
                                    handleDelete(serviceType);
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
          {filteredServiceTypes.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Tag className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No service types found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first service type"}
                </p>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Service Type
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredServiceTypes.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredServiceTypes.length}
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
          title={editingServiceType ? "Edit Service Type" : "Add New Service Type"}
          description={editingServiceType ? `Update ${editingServiceType.name}` : "Create a new service type"}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>
                  Service Code
                </FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="e.g., STD-001"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="priority" required>
                  Priority
                </FormLabel>
                <FormSelect
                  id="priority"
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as any)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Same Day">Same Day</option>
                  <option value="Scheduled">Scheduled</option>
                </FormSelect>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="name" required>
                  Service Name (English)
                </FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Standard Delivery"
                />
              </FormField>
            </div>

            <FormField>
              <FormLabel htmlFor="description" required>
                Description
              </FormLabel>
              <FormTextarea
                id="description"
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter service description..."
              />
            </FormField>

            <div className="grid grid-cols-3 gap-4">
              <FormField>
                <FormLabel htmlFor="slaHours" required>
                  SLA Hours
                </FormLabel>
                <FormInput
                  id="slaHours"
                  type="number"
                  value={formSlaHours}
                  onChange={(e) => setFormSlaHours(e.target.value)}
                  placeholder="e.g., 48"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="basePrice" required>
                  Base Price (AED)
                </FormLabel>
                <FormInput
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={formBasePrice}
                  onChange={(e) => setFormBasePrice(e.target.value)}
                  placeholder="e.g., 50.00"
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
              {editingServiceType ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingServiceType ? "Update" : "Create"} Service Type
            </button>
          </FormFooter>
        </FormModal>

        {/* Details Modal */}
        {selectedServiceType && (
          <FormModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Service Type Details"
            description={selectedServiceType.code}
            maxWidth="max-w-3xl"
          >
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Service Name
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedServiceType.name}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedServiceType.status)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Description
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  {selectedServiceType.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-info-50 dark:bg-info-900/30 border border-info-200 dark:border-info-800 rounded-lg">
                  <p className="text-xs text-info-700 dark:text-info-400 mb-1">
                    Priority
                  </p>
                  <p className="text-sm font-medium text-info-900 dark:text-info-300">
                    {selectedServiceType.priority}
                  </p>
                </div>
                <div className="p-4 bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg">
                  <p className="text-xs text-warning-700 dark:text-warning-400 mb-1">
                    SLA Hours
                  </p>
                  <p className="text-sm font-medium text-warning-900 dark:text-warning-300">
                    {selectedServiceType.slaHours} hours
                  </p>
                </div>
                <div className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg">
                  <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                    Base Price
                  </p>
                  <p className="text-sm font-medium text-success-900 dark:text-success-300">
                    AED {selectedServiceType.basePrice}
                  </p>
                </div>
              </div>

              {/* Features */}
              {selectedServiceType.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Features ({selectedServiceType.features.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedServiceType.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-400 flex-shrink-0" />
                        <span className="text-sm text-success-900 dark:text-success-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Created Date
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedServiceType.createdDate}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Last Modified
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedServiceType.modifiedDate}
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
                  handleEdit(selectedServiceType);
                }}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Service Type
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Delete Modal */}
        {selectedServiceType && (
          <FormModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete Service Type"
            description={`Are you sure you want to delete ${selectedServiceType.name}?`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-sm text-error-900 dark:text-error-400">
                  This action cannot be undone. Deleting this service type may affect existing quotes and orders.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedServiceType.name}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {selectedServiceType.code}
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
                Delete Service Type
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    </div>
  );
}