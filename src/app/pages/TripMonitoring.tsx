import { useState } from "react";
import {
  MapPin,
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Phone,
  User,
  Calendar,
  Eye,
  ArrowRight,
  MoreVertical,
  Copy,
  Download,
  BarChart3,
  RefreshCw,
  Activity,
  Flag,
  XCircle,
  Plus,
  Receipt,
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
import { MilestoneTimeline } from "@/app/components/tracking/MilestoneTimeline";
import { PODViewer } from "@/app/components/tracking/PODViewer";
import type { PODData } from "@/app/components/tracking/PODViewer";

interface TripStatus {
  stage: string;
  timestamp: string;
  location: string;
  completed: boolean;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleNumber: string;
}

interface Trip {
  id: string;
  tripNumber: string;
  inquiryNumber: string;
  customerName: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  pickupLocation: string;
  deliveryLocation: string;
  currentLocation: string;
  pickupDate: string;
  deliveryDate: string;
  assignedDriver?: Driver;
  status: "In Transit" | "Pickup Completed" | "Delivery In Progress" | "Delivered" | "Delayed";
  progress: number;
  totalDistance: string;
  distanceRemaining: string;
  estimatedArrival: string;
  timeline: TripStatus[];
  pod?: PODData;
}

interface Inquiry {
  id: string;
  inquiryNumber: string;
  customerName: string;
  serviceType: string;
  from: string;
  to: string;
  pickupDate: string;
}

type ViewMode = "grid" | "list" | "table";

export default function TripMonitoring() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPODModal, setShowPODModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Add Trip Form State
  const [selectedAddInquiryId, setSelectedAddInquiryId] = useState("");
  const [addTripNumber, setAddTripNumber] = useState("");
  const [addCustomerName, setAddCustomerName] = useState("");
  const [addDriverId, setAddDriverId] = useState("");
  const [addVehicleNumber, setAddVehicleNumber] = useState("");
  const [addFromLocation, setAddFromLocation] = useState("");
  const [addToLocation, setAddToLocation] = useState("");
  const [addPickupTime, setAddPickupTime] = useState("");
  const [addDeliveryTime, setAddDeliveryTime] = useState("");
  const [addDistance, setAddDistance] = useState("");
  const [addStatus, setAddStatus] = useState("In Transit");
  const [addNotes, setAddNotes] = useState("");

  const sampleInquiries: Inquiry[] = [
    {
      id: "INQ-001",
      inquiryNumber: "INQ-2024-8801",
      customerName: "Global Trade Co",
      serviceType: "FTL - Full Truck Load",
      from: "Abu Dhabi Port",
      to: "Dubai Logistics City",
      pickupDate: "2024-02-01",
    },
    {
      id: "INQ-002",
      inquiryNumber: "INQ-2024-8802",
      customerName: "Tech Solutions FZ",
      serviceType: "LTL - Less than Truck Load",
      from: "Sharjah Airport",
      to: "Fujairah Free Zone",
      pickupDate: "2024-02-02",
    },
    {
      id: "INQ-003",
      inquiryNumber: "INQ-2024-8803",
      customerName: "Retail Giants LLC",
      serviceType: "Express Delivery",
      from: "Jebel Ali, Dubai",
      to: "Al Ain Mall",
      pickupDate: "2024-02-03",
    }
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("estimatedArrival");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [trips] = useState<Trip[]>([
    {
      id: "1",
      tripNumber: "TRP-2024-001",
      inquiryNumber: "INQ-2024-5677",
      customerName: "Sarah Ahmed",
      driverName: "Khalid Saeed",
      driverPhone: "+971 55 345 6789",
      vehicleNumber: "DXB-33344",
      pickupLocation: "Jebel Ali, Dubai",
      deliveryLocation: "Al Ain Industrial Area",
      currentLocation: "E11 Highway, approaching Al Ain",
      pickupDate: "2024-01-29T10:30:00",
      deliveryDate: "2024-01-29T14:00:00",
      status: "In Transit",
      progress: 65,
      totalDistance: "145 km",
      distanceRemaining: "51 km",
      estimatedArrival: "2024-01-29T14:15:00",
      timeline: [
        {
          stage: "Trip Started",
          timestamp: "2024-01-29T10:30:00",
          location: "Jebel Ali, Dubai",
          completed: true,
        },
        {
          stage: "Pickup Completed",
          timestamp: "2024-01-29T10:45:00",
          location: "Jebel Ali, Dubai",
          completed: true,
        },
        {
          stage: "In Transit",
          timestamp: "2024-01-29T11:00:00",
          location: "E11 Highway",
          completed: true,
        },
        {
          stage: "Approaching Destination",
          timestamp: "",
          location: "Al Ain Industrial Area",
          completed: false,
        },
        {
          stage: "Delivered",
          timestamp: "",
          location: "Al Ain Industrial Area",
          completed: false,
        },
      ],
    },
    {
      id: "2",
      tripNumber: "TRP-2024-002",
      inquiryNumber: "INQ-2024-5676",
      customerName: "Mohammed Ali",
      driverName: "Ahmed Al Maktoum",
      driverPhone: "+971 50 123 4567",
      vehicleNumber: "DXB-12345",
      pickupLocation: "Deira, Dubai",
      deliveryLocation: "Sharjah Industrial Area",
      currentLocation: "Sharjah Industrial Area - Loading Bay 3",
      pickupDate: "2024-01-28T14:00:00",
      deliveryDate: "2024-01-28T16:00:00",
      status: "Delivery In Progress",
      progress: 95,
      totalDistance: "25 km",
      distanceRemaining: "1 km",
      estimatedArrival: "2024-01-28T16:10:00",
      timeline: [
        {
          stage: "Trip Started",
          timestamp: "2024-01-28T14:00:00",
          location: "Deira, Dubai",
          completed: true,
        },
        {
          stage: "Pickup Completed",
          timestamp: "2024-01-28T14:15:00",
          location: "Deira, Dubai",
          completed: true,
        },
        {
          stage: "In Transit",
          timestamp: "2024-01-28T14:30:00",
          location: "Sheikh Mohammed Bin Zayed Road",
          completed: true,
        },
        {
          stage: "Arrived at Destination",
          timestamp: "2024-01-28T15:45:00",
          location: "Sharjah Industrial Area",
          completed: true,
        },
        {
          stage: "Delivered",
          timestamp: "",
          location: "Sharjah Industrial Area",
          completed: false,
        },
      ],
    },
    {
      id: "3",
      tripNumber: "TRP-2024-003",
      inquiryNumber: "INQ-2024-5678",
      customerName: "John Smith",
      driverName: "Mohammed Hassan",
      driverPhone: "+971 52 234 5678",
      vehicleNumber: "DXB-67890",
      pickupLocation: "Business Bay, Dubai",
      deliveryLocation: "Musaffah, Abu Dhabi",
      currentLocation: "Business Bay, Dubai - Traffic Delay",
      pickupDate: "2024-01-28T09:00:00",
      deliveryDate: "2024-01-28T12:00:00",
      status: "Delayed",
      progress: 20,
      totalDistance: "120 km",
      distanceRemaining: "96 km",
      estimatedArrival: "2024-01-28T13:30:00",
      timeline: [
        {
          stage: "Trip Started",
          timestamp: "2024-01-28T09:00:00",
          location: "Business Bay, Dubai",
          completed: true,
        },
        {
          stage: "Pickup In Progress",
          timestamp: "2024-01-28T09:15:00",
          location: "Business Bay, Dubai",
          completed: true,
        },
        {
          stage: "Pickup Completed",
          timestamp: "",
          location: "Business Bay, Dubai",
          completed: false,
        },
        {
          stage: "In Transit",
          timestamp: "",
          location: "E11 Highway",
          completed: false,
        },
        {
          stage: "Delivered",
          timestamp: "",
          location: "Musaffah, Abu Dhabi",
          completed: false,
        },
      ],
    },
    {
      id: "4",
      tripNumber: "TRP-2024-004",
      inquiryNumber: "INQ-2024-5674",
      customerName: "Lisa Wang",
      driverName: "Youssef Ali",
      driverPhone: "+971 56 456 7890",
      vehicleNumber: "DXB-54321",
      pickupLocation: "Al Quoz, Dubai",
      deliveryLocation: "Ras Al Khaimah",
      currentLocation: "Ras Al Khaimah",
      pickupDate: "2024-01-26T08:00:00",
      deliveryDate: "2024-01-26T12:00:00",
      status: "Delivered",
      progress: 100,
      totalDistance: "110 km",
      distanceRemaining: "0 km",
      estimatedArrival: "2024-01-26T11:45:00",
      timeline: [
        {
          stage: "Trip Started",
          timestamp: "2024-01-26T08:00:00",
          location: "Al Quoz, Dubai",
          completed: true,
        },
        {
          stage: "Pickup Completed",
          timestamp: "2024-01-26T08:20:00",
          location: "Al Quoz, Dubai",
          completed: true,
        },
        {
          stage: "In Transit",
          timestamp: "2024-01-26T08:35:00",
          location: "E11 Highway",
          completed: true,
        },
        {
          stage: "Arrived at Destination",
          timestamp: "2024-01-26T11:30:00",
          location: "Ras Al Khaimah",
          completed: true,
        },
        {
          stage: "Delivered",
          timestamp: "2024-01-26T11:45:00",
          location: "Ras Al Khaimah",
          completed: true,
        },
      ],
    },
  ]);

  // Filter options for advanced search
  const filterOptions: any[] = [
    {
      id: "status",
      label: "Status",
      type: "select",
      values: [],
      options: [
        { value: "In Transit", label: "In Transit" },
        { value: "Pickup Completed", label: "Pickup Completed" },
        { value: "Delivery In Progress", label: "Delivery In Progress" },
        { value: "Delivered", label: "Delivered" },
        { value: "Delayed", label: "Delayed" },
      ],
    },
    {
      id: "progress",
      label: "Progress",
      type: "select",
      values: [],
      options: [
        { value: "low", label: "Low (0-33%)" },
        { value: "medium", label: "Medium (34-66%)" },
        { value: "high", label: "High (67-99%)" },
        { value: "complete", label: "Complete (100%)" },
      ],
    },
  ];

  // Apply filters
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(trip.status);

    const progressFilter = filters.find((f) => f.id === "progress");
    let matchesProgress = true;
    if (progressFilter && progressFilter.values.length > 0) {
      matchesProgress = progressFilter.values.some((value) => {
        if (value === "low") return trip.progress >= 0 && trip.progress <= 33;
        if (value === "medium") return trip.progress >= 34 && trip.progress <= 66;
        if (value === "high") return trip.progress >= 67 && trip.progress <= 99;
        if (value === "complete") return trip.progress === 100;
        return false;
      });
    }

    return matchesSearch && matchesStatus && matchesProgress;
  });

  // Apply sorting
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    let comparison = 0;
    if (sortField === "estimatedArrival") {
      comparison = new Date(a.estimatedArrival).getTime() - new Date(b.estimatedArrival).getTime();
    } else if (sortField === "tripNumber") {
      comparison = a.tripNumber.localeCompare(b.tripNumber);
    } else if (sortField === "customerName") {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortField === "progress") {
      comparison = a.progress - b.progress;
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
      case "In Transit":
        return "info";
      case "Pickup Completed":
        return "info";
      case "Delivery In Progress":
        return "info";
      case "Delivered":
        return "success";
      case "Delayed":
        return "warning";
      default:
        return "neutral";
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status) === "success"
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

  const handleViewDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowDetailsModal(true);
    setOpenActionMenuId(null);
  };

  const handleCopyTripNumber = (tripNumber: string) => {
    navigator.clipboard.writeText(tripNumber);
    toast.success("Trip number copied to clipboard");
  };

  const handleDownloadTrip = (trip: Trip) => {
    toast.success(`Downloading trip ${trip.tripNumber}`);
  };

  const handleCallDriver = (trip: Trip) => {
    toast.info(`Calling ${trip.driverName} at ${trip.driverPhone}`);
  };

  const handleSubmitPOD = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowPODModal(true);
    setOpenActionMenuId(null);
  };
  const handlePODSubmit = (podData: PODData) => {
    if (selectedTrip) {
      toast.success(`POD submitted successfully for ${selectedTrip.tripNumber}`);
      setShowPODModal(false);
      setSelectedTrip(null);
      // In real app, this would update the trip with POD data
    }
  };

  const handleCreateInvoice = (trip: Trip) => {
    const draft = {
      customerName: trip.customerName,
      inquiryNumber: trip.inquiryNumber,
      tripNumber: trip.tripNumber,
      amount: 1200,
      description: `Delivery from ${trip.pickupLocation} to ${trip.deliveryLocation}`
    };

    localStorage.setItem("pendingInvoiceDraft", JSON.stringify(draft));

    // Dispatch custom navigation event
    const event = new CustomEvent('navigate', { detail: 'customer-invoicing' });
    window.dispatchEvent(event);

    toast.success("Draft invoice created. Redirecting to billing...");
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "—";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddNew = () => {
    setSelectedAddInquiryId("");
    setAddTripNumber(`TRP-2024-0${trips.length + 1}`);
    setAddCustomerName("");
    setAddDriverId("");
    setAddVehicleNumber("");
    setAddFromLocation("");
    setAddToLocation("");
    setAddPickupTime("");
    setAddDeliveryTime("");
    setAddDistance("");
    setAddStatus("In Transit");
    setAddNotes("");
    setShowAddModal(true);
  };

  const handleInquiryChange = (inquiryId: string) => {
    setSelectedAddInquiryId(inquiryId);
    const inquiry = sampleInquiries.find(i => i.id === inquiryId);
    if (inquiry) {
      setAddCustomerName(inquiry.customerName);
      setAddFromLocation(inquiry.from);
      setAddToLocation(inquiry.to);
      setAddPickupTime(`${inquiry.pickupDate}T09:00`);
      setAddDeliveryTime(`${inquiry.pickupDate}T17:00`);
      setAddDistance("120"); // Mock default distance

      // Auto-select first driver (mock)
      setAddDriverId("1"); // Ahmed Hassan
      setAddVehicleNumber("DXB-12345");
    } else {
      setAddCustomerName("");
      setAddFromLocation("");
      setAddToLocation("");
      setAddPickupTime("");
      setAddDeliveryTime("");
      setAddDistance("");
      setAddDriverId("");
      setAddVehicleNumber("");
    }
  };

  const handleSubmitNewTrip = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Trip ${addTripNumber} created successfully!`);
    setShowAddModal(false);
  };

  const stats = [
    {
      label: "In Transit",
      value: trips.filter((t) => t.status === "In Transit" || t.status === "Pickup Completed").length,
      icon: "Activity",
      subtitle: "Active trips",
    },
    {
      label: "Delivery In Progress",
      value: trips.filter((t) => t.status === "Delivery In Progress").length,
      icon: "Truck",
      subtitle: "Almost complete",
    },
    {
      label: "Delivered",
      value: trips.filter((t) => t.status === "Delivered").length,
      icon: "CheckCircle",
      subtitle: "Completed",
    },
    {
      label: "Delayed",
      value: trips.filter((t) => t.status === "Delayed").length,
      icon: "AlertCircle",
      subtitle: "Needs attention",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Trip Monitoring"
          subtitle="Track and monitor active shipments in real-time"
          breadcrumbs={[
            { label: "Operations", href: "#" },
            { label: "Trip Monitoring", current: true },
          ]}
          primaryAction={{
            label: "Add Trip",
            onClick: handleAddNew,
            icon: Plus,
          }}
          moreMenu={{

            onPrint: () => window.print(),
            sortOptions: [
              {
                value: "tripNumber",
                label: "Trip Number (A-Z)",
                direction: "asc",
              },
              {
                value: "tripNumber",
                label: "Trip Number (Z-A)",
                direction: "desc",
              },
              {
                value: "estimatedArrival",
                label: "ETA (Soonest)",
                direction: "asc",
              },
              {
                value: "estimatedArrival",
                label: "ETA (Latest)",
                direction: "desc",
              },
              { value: "progress", label: "Progress (High to Low)", direction: "desc" },
              { value: "progress", label: "Progress (Low to High)", direction: "asc" },
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
              filterOptions={filterOptions as any}
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
                      {trip.tripNumber}
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

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallDriver(trip);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Phone className="w-4 h-4" />
                              Call Driver
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyTripNumber(trip.tripNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Trip Number
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

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateInvoice(trip);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Receipt className="w-4 h-4" />
                              Create Invoice
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Trip Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{trip.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {trip.driverName} - {trip.vehicleNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {trip.pickupLocation} → {trip.deliveryLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Navigation className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{trip.currentLocation}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        Progress
                      </span>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {trip.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${trip.status === "Delivered"
                          ? "bg-success-500"
                          : trip.status === "Delayed"
                            ? "bg-warning-500"
                            : "bg-info-500"
                          }`}
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* ETA */}
                  <div className="p-3 bg-info-50 dark:bg-info-900/30 rounded-lg border border-info-200 dark:border-info-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-info-700 dark:text-info-400 mb-1">
                          Estimated Arrival
                        </div>
                        <div className="text-sm font-bold text-info-600 dark:text-info-400">
                          {formatTimestamp(trip.estimatedArrival)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Remaining
                        </div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          {trip.distanceRemaining}
                        </div>
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
              {paginatedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {trip.tripNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyTripNumber(trip.tripNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy trip number"
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
                          <Truck className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{trip.driverName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {trip.pickupLocation} → {trip.deliveryLocation}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3 max-w-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            Progress: {trip.progress}%
                          </span>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            {trip.distanceRemaining} remaining
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${trip.status === "Delivered"
                              ? "bg-success-500"
                              : trip.status === "Delayed"
                                ? "bg-warning-500"
                                : "bg-info-500"
                              }`}
                            style={{ width: `${trip.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ETA: {formatTimestamp(trip.estimatedArrival)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          {trip.currentLocation}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(trip.status)}

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

                            <button
                              onClick={() => {
                                handleCallDriver(trip);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Phone className="w-4 h-4" />
                              Call Driver
                            </button>

                            <button
                              onClick={() => {
                                handleCopyTripNumber(trip.tripNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Trip Number
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
                        Trip Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        ETA
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
                              {trip.tripNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyTripNumber(trip.tripNumber);
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
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {trip.customerName}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {trip.inquiryNumber}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {trip.driverName}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {trip.vehicleNumber}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {trip.pickupLocation} → {trip.deliveryLocation}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-24">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-neutral-900 dark:text-white">
                                {trip.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${trip.status === "Delivered"
                                  ? "bg-success-500"
                                  : trip.status === "Delayed"
                                    ? "bg-warning-500"
                                    : "bg-info-500"
                                  }`}
                                style={{ width: `${trip.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {formatTimestamp(trip.estimatedArrival)}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {trip.distanceRemaining}
                          </div>
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

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCallDriver(trip);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Phone className="w-4 h-4" />
                                  Call Driver
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyTripNumber(trip.tripNumber);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Trip Number
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
                    : "No active trips to monitor"}
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
          description={selectedTrip?.tripNumber}
          maxWidth="max-w-5xl"
        >
          {selectedTrip && (
            <div className="space-y-6">
              {/* Trip Summary */}
              <div className="grid grid-cols-4 gap-4">
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
                    Driver
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedTrip.driverName}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Vehicle
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedTrip.vehicleNumber}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Status
                  </p>
                  {getStatusBadge(selectedTrip.status)}
                </div>
              </div>

              {/* Progress */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Trip Progress
                  </h4>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {selectedTrip.progress}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full ${selectedTrip.status === "Delivered"
                      ? "bg-success-500"
                      : selectedTrip.status === "Delayed"
                        ? "bg-warning-500"
                        : "bg-info-500"
                      }`}
                    style={{ width: `${selectedTrip.progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Total Distance
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {selectedTrip.totalDistance}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Remaining
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {selectedTrip.distanceRemaining}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      ETA
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {formatTimestamp(selectedTrip.estimatedArrival)}
                    </p>
                  </div>
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
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {formatTimestamp(selectedTrip.pickupDate)}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Delivery</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedTrip.deliveryLocation}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Expected: {formatTimestamp(selectedTrip.deliveryDate)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-info-50 dark:bg-info-900/30 rounded-lg border border-info-200 dark:border-info-800">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-info-600 dark:text-info-400" />
                    <div>
                      <p className="text-xs text-info-700 dark:text-info-400">
                        Current Location
                      </p>
                      <p className="text-sm font-medium text-info-900 dark:text-info-300">
                        {selectedTrip.currentLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                  Trip Timeline
                </h4>
                <MilestoneTimeline
                  timeline={selectedTrip.timeline}
                  variant="vertical"
                  showLocation={true}
                />
              </div>
            </div>
          )}

          <FormFooter>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
            {selectedTrip && (
              <>
                <button
                  onClick={() => {
                    handleCallDriver(selectedTrip);
                  }}
                  className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Driver
                </button>
                {(selectedTrip.status === "Delivery In Progress" || selectedTrip.status === "Delivered") && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleSubmitPOD(selectedTrip);
                    }}
                    className="px-4 py-2 text-sm text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {selectedTrip.pod ? "View POD" : "Submit POD"}
                  </button>
                )}
              </>
            )}
          </FormFooter>
        </FormModal>

        {/* ========== ADD TRIP MODAL ========== */}
        <FormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Trip"
          description="Create a new delivery trip"
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSubmitNewTrip}>
            <div className="space-y-6">
              {/* Trip Information */}
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                  Trip Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel htmlFor="tripNumber" required>Trip Number</FormLabel>
                    <FormInput
                      id="tripNumber"
                      type="text"
                      required
                      placeholder="TRIP-2024-XXXX"
                      value={addTripNumber}
                      onChange={(e) => setAddTripNumber(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="inquiryId" required>Select Inquiry</FormLabel>
                    <FormSelect
                      id="inquiryId"
                      required
                      value={selectedAddInquiryId}
                      onChange={(e) => handleInquiryChange(e.target.value)}
                    >
                      <option value="">Choose an inquiry</option>
                      {sampleInquiries.map((inquiry) => (
                        <option key={inquiry.id} value={inquiry.id}>
                          {inquiry.inquiryNumber} - {inquiry.customerName}
                        </option>
                      ))}
                    </FormSelect>
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="customerName" required>Customer Name</FormLabel>
                    <FormInput
                      id="customerName"
                      type="text"
                      required
                      value={addCustomerName}
                      onChange={(e) => setAddCustomerName(e.target.value)}
                      readOnly
                      className="bg-neutral-50 dark:bg-neutral-800"
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="driver" required>Assigned Driver</FormLabel>
                    <FormSelect
                      id="driver"
                      required
                      value={addDriverId}
                      onChange={(e) => setAddDriverId(e.target.value)}
                    >
                      <option value="">Select driver</option>
                      <option value="1">Ahmed Hassan</option>
                      <option value="2">Mohammed Ali</option>
                      <option value="3">Khaled Omar</option>
                    </FormSelect>
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="vehicle" required>Vehicle</FormLabel>
                    <FormInput
                      id="vehicle"
                      type="text"
                      required
                      placeholder="ABC-1234"
                      value={addVehicleNumber}
                      onChange={(e) => setAddVehicleNumber(e.target.value)}
                    />
                  </FormField>
                </div>
              </div>

              {/* Route Details */}
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                  Route Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel htmlFor="from" required>From Location</FormLabel>
                    <FormInput
                      id="from"
                      type="text"
                      required
                      placeholder="Dubai, UAE"
                      value={addFromLocation}
                      onChange={(e) => setAddFromLocation(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="to" required>To Location</FormLabel>
                    <FormInput
                      id="to"
                      type="text"
                      required
                      placeholder="Abu Dhabi, UAE"
                      value={addToLocation}
                      onChange={(e) => setAddToLocation(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="pickupTime" required>Pickup Time</FormLabel>
                    <FormInput
                      id="pickupTime"
                      type="datetime-local"
                      required
                      value={addPickupTime}
                      onChange={(e) => setAddPickupTime(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="deliveryTime" required>Estimated Delivery</FormLabel>
                    <FormInput
                      id="deliveryTime"
                      type="datetime-local"
                      required
                      value={addDeliveryTime}
                      onChange={(e) => setAddDeliveryTime(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="distance" required>Distance (km)</FormLabel>
                    <FormInput
                      id="distance"
                      type="number"
                      required
                      placeholder="0"
                      step="0.1"
                      min="0"
                      value={addDistance}
                      onChange={(e) => setAddDistance(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="status" required>Status</FormLabel>
                    <FormSelect
                      id="status"
                      required
                      value={addStatus}
                      onChange={(e) => setAddStatus(e.target.value)}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </FormSelect>
                  </FormField>
                </div>
              </div>

              {/* Notes */}
              <FormField>
                <FormLabel htmlFor="notes">Trip Notes</FormLabel>
                <FormTextarea
                  id="notes"
                  placeholder="Special instructions or remarks..."
                  rows={2}
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                />
              </FormField>
            </div>

            <FormFooter>
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" />Create Trip</button>
            </FormFooter>
          </form>
        </FormModal>

        {/* POD Modal */}
        <FormModal
          isOpen={showPODModal}
          onClose={() => {
            setShowPODModal(false);
            setSelectedTrip(null);
          }}
          title="Proof of Delivery"
          description={selectedTrip ? `${selectedTrip.tripNumber} - ${selectedTrip.customerName}` : undefined}
          maxWidth="max-w-4xl"
        >
          {selectedTrip && (
            <PODViewer
              tripId={selectedTrip.id}
              isEditable={!selectedTrip.pod}
              initialData={selectedTrip.pod}
              onSubmit={handlePODSubmit}
              onClose={() => {
                setShowPODModal(false);
                setSelectedTrip(null);
              }}
            />
          )}
        </FormModal>
      </div>
    </div>
  );
}
