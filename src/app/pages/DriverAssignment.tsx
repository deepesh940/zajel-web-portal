import { useState } from "react";
import {
  Truck,
  User,
  MapPin,
  Calendar,
  Package,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  Phone,
  Mail,
  MoreVertical,
  Copy,
  Download,
  BarChart3,
  RefreshCw,
  Activity,
  Eye,
  XCircle,
  Plus,
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
  FormSelect,
  FormTextarea,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  completedTrips: number;
  vehicleType: string;
  vehicleNumber: string;
  currentStatus: "Available" | "On Trip" | "Offline";
  currentLocation?: string;
}

interface Trip {
  id: string;
  inquiryNumber: string;
  customerName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  pickupTime: string;
  serviceType: string;
  totalWeight: number;
  totalValue: number;
  assignedDriver?: Driver;
  status: "Unassigned" | "Assigned" | "In Progress" | "Completed";
  priority: "High" | "Medium" | "Low";
}

type ViewMode = "grid" | "list" | "table";

export default function DriverAssignment() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("pickupDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [drivers] = useState<Driver[]>([
    {
      id: "1",
      name: "Ahmed Al Maktoum",
      phone: "+971 50 123 4567",
      email: "ahmed.maktoum@zajel.ae",
      rating: 4.8,
      completedTrips: 156,
      vehicleType: "Box Truck 3.5T",
      vehicleNumber: "DXB-12345",
      currentStatus: "Available",
      currentLocation: "Business Bay, Dubai",
    },
    {
      id: "2",
      name: "Mohammed Hassan",
      phone: "+971 52 234 5678",
      email: "mohammed.hassan@zajel.ae",
      rating: 4.9,
      completedTrips: 203,
      vehicleType: "Box Truck 3.5T",
      vehicleNumber: "DXB-67890",
      currentStatus: "On Trip",
      currentLocation: "En route to Abu Dhabi",
    },
    {
      id: "3",
      name: "Khalid Saeed",
      phone: "+971 55 345 6789",
      email: "khalid.saeed@zajel.ae",
      rating: 4.9,
      completedTrips: 187,
      vehicleType: "Box Truck 7.5T",
      vehicleNumber: "DXB-33344",
      currentStatus: "Available",
      currentLocation: "Jebel Ali, Dubai",
    },
    {
      id: "4",
      name: "Youssef Ali",
      phone: "+971 56 456 7890",
      email: "youssef.ali@zajel.ae",
      rating: 4.7,
      completedTrips: 142,
      vehicleType: "Van 1.5T",
      vehicleNumber: "DXB-54321",
      currentStatus: "Available",
      currentLocation: "Deira, Dubai",
    },
  ]);

  const [trips, setTrips] = useState<Trip[]>([
    {
      id: "1",
      inquiryNumber: "INQ-2024-5678",
      customerName: "John Smith",
      pickupLocation: "Business Bay, Dubai",
      deliveryLocation: "Musaffah, Abu Dhabi",
      pickupDate: "2024-01-28",
      pickupTime: "09:00 AM",
      serviceType: "Express Delivery",
      totalWeight: 125.5,
      totalValue: 15000,
      status: "Unassigned",
      priority: "High",
    },
    {
      id: "2",
      inquiryNumber: "INQ-2024-5677",
      customerName: "Sarah Ahmed",
      pickupLocation: "Jebel Ali, Dubai",
      deliveryLocation: "Al Ain Industrial Area",
      pickupDate: "2024-01-29",
      pickupTime: "10:00 AM",
      serviceType: "Standard Delivery",
      totalWeight: 450.0,
      totalValue: 25000,
      status: "Unassigned",
      priority: "Medium",
    },
    {
      id: "3",
      inquiryNumber: "INQ-2024-5676",
      customerName: "Mohammed Ali",
      pickupLocation: "Deira, Dubai",
      deliveryLocation: "Sharjah Industrial Area",
      pickupDate: "2024-01-28",
      pickupTime: "02:00 PM",
      serviceType: "Express Delivery",
      totalWeight: 85.0,
      totalValue: 8000,
      assignedDriver: drivers[0],
      status: "Assigned",
      priority: "High",
    },
    {
      id: "4",
      inquiryNumber: "INQ-2024-5675",
      customerName: "Alex Johnson",
      pickupLocation: "DIFC, Dubai",
      deliveryLocation: "Downtown Dubai",
      pickupDate: "2024-01-27",
      pickupTime: "03:00 PM",
      serviceType: "Same Day Delivery",
      totalWeight: 15.0,
      totalValue: 12000,
      assignedDriver: drivers[1],
      status: "In Progress",
      priority: "High",
    },
    {
      id: "5",
      inquiryNumber: "INQ-2024-5674",
      customerName: "Lisa Wang",
      pickupLocation: "Al Quoz, Dubai",
      deliveryLocation: "Ras Al Khaimah",
      pickupDate: "2024-01-26",
      pickupTime: "08:00 AM",
      serviceType: "Standard Delivery",
      totalWeight: 200.0,
      totalValue: 5000,
      assignedDriver: drivers[2],
      status: "Completed",
      priority: "Low",
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
        { value: "Unassigned", label: "Unassigned" },
        { value: "Assigned", label: "Assigned" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
      ],
    },
    {
      id: "priority",
      label: "Priority",
      type: "select",
      values: [],
      options: [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
      ],
    },
    {
      id: "serviceType",
      label: "Service Type",
      type: "select",
      values: [],
      options: [
        { value: "Express Delivery", label: "Express Delivery" },
        { value: "Standard Delivery", label: "Standard Delivery" },
        { value: "Same Day Delivery", label: "Same Day Delivery" },
      ],
    },
  ];

  // Apply filters
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.assignedDriver?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(trip.status);

    const priorityFilter = filters.find((f) => f.id === "priority");
    const matchesPriority =
      !priorityFilter || priorityFilter.values.length === 0 || priorityFilter.values.includes(trip.priority);

    const serviceFilter = filters.find((f) => f.id === "serviceType");
    const matchesService =
      !serviceFilter || serviceFilter.values.length === 0 || serviceFilter.values.includes(trip.serviceType);

    return matchesSearch && matchesStatus && matchesPriority && matchesService;
  });

  // Apply sorting
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    let comparison = 0;
    if (sortField === "pickupDate") {
      comparison = new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime();
    } else if (sortField === "inquiryNumber") {
      comparison = a.inquiryNumber.localeCompare(b.inquiryNumber);
    } else if (sortField === "customerName") {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortField === "priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTrips.length / itemsPerPage);
  const paginatedTrips = sortedTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Unassigned":
        return "warning";
      case "Assigned":
        return "info";
      case "In Progress":
        return "info";
      case "Completed":
        return "success";
      default:
        return "neutral";
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            getStatusColor(status) === "success"
              ? "bg-success-500"
              : getStatusColor(status) === "warning"
              ? "bg-warning-500"
              : getStatusColor(status) === "info"
              ? "bg-info-500"
              : "bg-neutral-400"
          }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colorClass =
      priority === "High"
        ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400"
        : priority === "Medium"
        ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400"
        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400";

    return (
      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${colorClass}`}>
        {priority}
      </span>
    );
  };

  const handleAssignDriver = (trip: Trip) => {
    setSelectedTrip(trip);
    setSelectedDriverId("");
    setShowAssignModal(true);
    setOpenActionMenuId(null);
  };

  const confirmAssignment = () => {
    if (!selectedDriverId) {
      toast.error("Please select a driver");
      return;
    }

    const driver = drivers.find((d) => d.id === selectedDriverId);
    if (selectedTrip && driver) {
      setTrips(
        trips.map((t) =>
          t.id === selectedTrip.id
            ? { ...t, assignedDriver: driver, status: "Assigned" }
            : t
        )
      );
      toast.success(`Trip assigned to ${driver.name}`);
    }
    setShowAssignModal(false);
  };

  const handleUnassignDriver = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowUnassignModal(true);
    setOpenActionMenuId(null);
  };

  const confirmUnassign = () => {
    if (selectedTrip) {
      setTrips(
        trips.map((t) =>
          t.id === selectedTrip.id
            ? { ...t, assignedDriver: undefined, status: "Unassigned" }
            : t
        )
      );
      toast.success("Driver unassigned");
    }
    setShowUnassignModal(false);
  };

  const handleViewDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleCopyInquiryNumber = (inquiryNumber: string) => {
    navigator.clipboard.writeText(inquiryNumber);
    toast.success("Inquiry number copied to clipboard");
  };

  const handleDownloadTrip = (trip: Trip) => {
    toast.success(`Downloading trip ${trip.inquiryNumber}`);
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleSubmitNewAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Driver assigned successfully!");
    setShowAddModal(false);
  };

  const stats = [
    {
      label: "Unassigned",
      value: trips.filter((t) => t.status === "Unassigned").length,
      icon: "AlertCircle",
      subtitle: "Awaiting assignment",
    },
    {
      label: "Assigned",
      value: trips.filter((t) => t.status === "Assigned").length,
      icon: "CheckCircle",
      subtitle: "Driver assigned",
    },
    {
      label: "In Progress",
      value: trips.filter((t) => t.status === "In Progress").length,
      icon: "Activity",
      subtitle: "Currently active",
    },
    {
      label: "Completed",
      value: trips.filter((t) => t.status === "Completed").length,
      icon: "CheckCircle",
      subtitle: "Delivered",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Driver Assignment"
          subtitle="Assign drivers to shipments and manage trip allocations"
          breadcrumbs={[
            { label: "Operations", href: "#" },
            { label: "Driver Assignment", current: true },
          ]}
          primaryAction={{
            label: "Assign Driver",
            onClick: handleAddNew,
            icon: Plus,
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
              {
                value: "inquiryNumber",
                label: "Inquiry Number (A-Z)",
                direction: "asc",
              },
              {
                value: "inquiryNumber",
                label: "Inquiry Number (Z-A)",
                direction: "desc",
              },
              {
                value: "pickupDate",
                label: "Pickup Date (Earliest)",
                direction: "asc",
              },
              {
                value: "pickupDate",
                label: "Pickup Date (Latest)",
                direction: "desc",
              },
              { value: "priority", label: "Priority (High to Low)", direction: "desc" },
              { value: "priority", label: "Priority (Low to High)", direction: "asc" },
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
              placeholder="Search trips..."
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
              {paginatedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(trip)}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {trip.inquiryNumber}
                    </h3>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(trip.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === trip.id ? null : trip.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === trip.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(trip);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            {trip.status === "Unassigned" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignDriver(trip);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <UserCheck className="w-4 h-4" />
                                Assign Driver
                              </button>
                            )}

                            {trip.status === "Assigned" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnassignDriver(trip);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <XCircle className="w-4 h-4" />
                                Unassign Driver
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInquiryNumber(trip.inquiryNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Inquiry Number
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadTrip(trip);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className="mb-3">{getPriorityBadge(trip.priority)}</div>

                  {/* Trip Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{trip.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {trip.pickupLocation} → {trip.deliveryLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {trip.pickupDate} at {trip.pickupTime}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Driver or Unassigned */}
                  {trip.assignedDriver ? (
                    <div className="p-3 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="w-4 h-4 text-success-600 dark:text-success-400" />
                        <span className="text-xs text-success-700 dark:text-success-400 font-medium">
                          Assigned Driver
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-success-900 dark:text-success-300">
                        {trip.assignedDriver.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-warning-500" />
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {trip.assignedDriver.rating} • {trip.assignedDriver.vehicleType}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-warning-50 dark:bg-warning-900/30 rounded-lg border border-warning-200 dark:border-warning-800">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                        <span className="text-sm font-medium text-warning-700 dark:text-warning-400">
                          No Driver Assigned
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {trip.inquiryNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyInquiryNumber(trip.inquiryNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy inquiry number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{trip.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {trip.pickupLocation} → {trip.deliveryLocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>
                            {trip.pickupDate} at {trip.pickupTime}
                          </span>
                        </div>
                      </div>

                      {trip.assignedDriver ? (
                        <div className="flex items-center gap-2 text-sm">
                          <UserCheck className="w-4 h-4 text-success-600 dark:text-success-400" />
                          <span className="font-medium text-success-600 dark:text-success-400">
                            {trip.assignedDriver.name}
                          </span>
                          <span className="text-neutral-500 dark:text-neutral-400">
                            • {trip.assignedDriver.vehicleType}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-warning-600 dark:text-warning-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">No driver assigned</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(trip.status)}
                      {getPriorityBadge(trip.priority)}
                      
                      <div className="relative ml-2">
                        <button
                          onClick={() =>
                            setOpenActionMenuId(
                              openActionMenuId === trip.id ? null : trip.id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === trip.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleViewDetails(trip)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {trip.status === "Unassigned" && (
                            <button
                              onClick={() => handleAssignDriver(trip)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <UserCheck className="w-4 h-4" />
                              Assign Driver
                            </button>
                          )}

                          {trip.status === "Assigned" && (
                            <button
                              onClick={() => handleUnassignDriver(trip)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <XCircle className="w-4 h-4" />
                              Unassign Driver
                            </button>
                          )}

                          <button
                            onClick={() => {
                              handleCopyInquiryNumber(trip.inquiryNumber);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Inquiry Number
                          </button>

                          <button
                            onClick={() => {
                              handleDownloadTrip(trip);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Details
                          </button>
                        </div>
                      )}
                      </div>
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
                        Inquiry Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Pickup
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Assigned Driver
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedTrips.map((trip) => (
                      <tr
                        key={trip.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer relative"
                        onClick={() => handleViewDetails(trip)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {trip.inquiryNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInquiryNumber(trip.inquiryNumber);
                              }}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(trip.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getPriorityBadge(trip.priority)}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                              {trip.customerName}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {trip.serviceType}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {trip.pickupLocation} → {trip.deliveryLocation}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {trip.pickupDate}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {trip.pickupTime}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {trip.assignedDriver ? (
                            <div>
                              <div className="text-sm font-medium text-success-600 dark:text-success-400 flex items-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                {trip.assignedDriver.name}
                              </div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                {trip.assignedDriver.vehicleType}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-warning-600 dark:text-warning-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Unassigned
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === trip.id ? null : trip.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === trip.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(trip);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>

                                {trip.status === "Unassigned" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAssignDriver(trip);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    Assign Driver
                                  </button>
                                )}

                                {trip.status === "Assigned" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnassignDriver(trip);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Unassign Driver
                                  </button>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyInquiryNumber(trip.inquiryNumber);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Inquiry Number
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadTrip(trip);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download Details
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
          {filteredTrips.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No trips found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "No trips available for assignment"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredTrips.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTrips.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* Details Modal */}
        <FormModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Trip Details"
          description={selectedTrip?.inquiryNumber}
          maxWidth="max-w-4xl"
        >
          {selectedTrip && (
            <div className="space-y-6">
              {/* Trip Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Customer
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedTrip.customerName}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Service Type
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedTrip.serviceType}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Priority
                  </p>
                  {getPriorityBadge(selectedTrip.priority)}
                </div>
              </div>

              {/* Route */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Route Details
                </h4>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Pickup</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedTrip.pickupLocation}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Delivery
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedTrip.deliveryLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Pickup Time
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedTrip.pickupDate} {selectedTrip.pickupTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assigned Driver */}
              {selectedTrip.assignedDriver && (
                <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
                  <h4 className="text-sm font-semibold text-success-900 dark:text-success-300 mb-3">
                    Assigned Driver
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                        Name
                      </p>
                      <p className="text-sm font-medium text-success-900 dark:text-success-300">
                        {selectedTrip.assignedDriver.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-success-900 dark:text-success-300">
                        {selectedTrip.assignedDriver.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                        Vehicle
                      </p>
                      <p className="text-sm font-medium text-success-900 dark:text-success-300">
                        {selectedTrip.assignedDriver.vehicleType} -{" "}
                        {selectedTrip.assignedDriver.vehicleNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-success-700 dark:text-success-400 mb-1">
                        Rating
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning-500" />
                        <span className="text-sm font-medium text-success-900 dark:text-success-300">
                          {selectedTrip.assignedDriver.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <FormFooter>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
            {selectedTrip && selectedTrip.status === "Unassigned" && (
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleAssignDriver(selectedTrip);
                }}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Assign Driver
              </button>
            )}
            {selectedTrip && selectedTrip.status === "Assigned" && (
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleUnassignDriver(selectedTrip);
                }}
                className="px-4 py-2 text-sm text-error-700 dark:text-error-300 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg hover:bg-error-100 dark:hover:bg-error-900/50 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Unassign Driver
              </button>
            )}
          </FormFooter>
        </FormModal>

        {/* Assign Driver Modal */}
        {selectedTrip && (
          <FormModal
            isOpen={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            title="Assign Driver"
            description={`${selectedTrip.inquiryNumber} - ${selectedTrip.customerName}`}
          >
            <div className="space-y-4">
              <FormField>
                <FormLabel htmlFor="driver" required>
                  Select Driver
                </FormLabel>
                <FormSelect
                  id="driver"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                >
                  <option value="">-- Select a driver --</option>
                  {drivers
                    .filter((d) => d.currentStatus === "Available")
                    .map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.vehicleType} ({driver.rating}★)
                      </option>
                    ))}
                </FormSelect>
              </FormField>

              {selectedDriverId && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  {drivers
                    .filter((d) => d.id === selectedDriverId)
                    .map((driver) => (
                      <div key={driver.id}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                              Phone
                            </p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {driver.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                              Completed Trips
                            </p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {driver.completedTrips}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                              Vehicle
                            </p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {driver.vehicleNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                              Current Location
                            </p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {driver.currentLocation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <FormFooter>
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssignment}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Assignment
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Unassign Driver Modal */}
        {selectedTrip && (
          <FormModal
            isOpen={showUnassignModal}
            onClose={() => setShowUnassignModal(false)}
            title="Unassign Driver"
            description={`${selectedTrip.inquiryNumber} - ${selectedTrip.customerName}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg">
                <p className="text-sm text-warning-900 dark:text-warning-400">
                  Are you sure you want to unassign{" "}
                  <strong>{selectedTrip.assignedDriver?.name}</strong> from this trip? The
                  trip will be marked as unassigned.
                </p>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowUnassignModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnassign}
                className="px-4 py-2 text-sm text-white bg-error-500 hover:bg-error-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Confirm Unassign
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* ========== ASSIGN DRIVER MODAL ========== */}
        <FormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Assign Driver to Trip"
          description="Select a driver for shipment delivery"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmitNewAssignment}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="inquiryNumber" required>Inquiry Number</FormLabel>
                  <FormInput id="inquiryNumber" type="text" required placeholder="INQ-2024-XXXX" />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="driver" required>Select Driver</FormLabel>
                  <FormSelect id="driver" required>
                    <option value="">Choose a driver</option>
                    <option value="1">Ahmed Hassan (4.8★)</option>
                    <option value="2">Mohammed Ali (4.9★)</option>
                    <option value="3">Khaled Omar (4.7★)</option>
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="vehicle" required>Vehicle Type</FormLabel>
                  <FormSelect id="vehicle" required>
                    <option value="">Select vehicle</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="pickupTime" required>Pickup Time</FormLabel>
                  <FormInput id="pickupTime" type="datetime-local" required />
                </FormField>
              </div>
              <FormField>
                <FormLabel htmlFor="notes">Assignment Notes</FormLabel>
                <FormTextarea id="notes" placeholder="Special instructions for driver..." rows={2} />
              </FormField>
            </div>
            <FormFooter>
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg flex items-center gap-2"><UserCheck className="w-4 h-4" />Assign Driver</button>
            </FormFooter>
          </form>
        </FormModal>
      </div>
    </div>
  );
}
