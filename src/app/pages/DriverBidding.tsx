import React, { useState } from "react";
import {
  Truck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Calendar,
  Package,
  Clock,
  Star,
  Award,
  AlertCircle,
  ArrowRight,
  MoreVertical,
  Copy,
  Download,
  BarChart3,
  RefreshCw,
  Activity,
  User,
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
  FormTextarea,
  FormSelect,
} from "../components/hb/common/Form";
import { toast } from "sonner";

// Mock data for auto-fill
const availableInquiries = [
  {
    inquiryNumber: "INQ-2024-5679",
    customerName: "Global Trade Co.",
    serviceType: "Express Delivery",
    estimatedValue: "15000",
    fromLocation: "Jebel Ali Free Zone, Dubai",
    toLocation: "Riyadh Industrial City, KSA",
    distance: "950",
    weight: "2500",
  },
  {
    inquiryNumber: "INQ-2024-5680",
    customerName: "Al Amal Construction",
    serviceType: "Standard Delivery",
    estimatedValue: "8500",
    fromLocation: "Mussafah Industrial, Abu Dhabi",
    toLocation: "Doha Port, Qatar",
    distance: "550",
    weight: "5000",
  },
  {
    inquiryNumber: "INQ-2024-5681",
    customerName: "Tech Solutions Ltd",
    serviceType: "Same Day Delivery",
    estimatedValue: "25000",
    fromLocation: "Dubai Silicon Oasis",
    toLocation: "Dubai Internet City",
    distance: "25",
    weight: "150",
  },
];

interface DriverBid {
  id: string;
  driverName: string;
  driverRating: number;
  completedTrips: number;
  vehicleType: string;
  vehicleNumber: string;
  bidAmount: number;
  estimatedTime: string;
  bidSubmitted: string;
  status: "Pending" | "Accepted" | "Rejected" | "Expired";
  notes?: string;
}

interface ShipmentBid {
  id: string;
  inquiryNumber: string;
  customerName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  serviceType: string;
  totalWeight: number;
  quotedAmount: number;
  biddingDeadline: string;
  bids: DriverBid[];
  status: "Open" | "Closed" | "Assigned";
  assignedDriver?: string;
}

type ViewMode = "grid" | "list" | "table";

export default function DriverBidding() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<ShipmentBid | null>(null);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<DriverBid | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    inquiryNumber: "",
    customerName: "",
    serviceType: "",
    estimatedValue: "",
    fromLocation: "",
    toLocation: "",
    distance: "",
    weight: "",
    biddingDeadline: "",
    minimumBid: "",
    requirements: ""
  });

  const handleInquiryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInquiryId = e.target.value;
    const inquiry = availableInquiries.find(i => i.inquiryNumber === selectedInquiryId);

    if (inquiry) {
      setFormData(prev => ({
        ...prev,
        inquiryNumber: inquiry.inquiryNumber,
        customerName: inquiry.customerName,
        serviceType: inquiry.serviceType,
        estimatedValue: inquiry.estimatedValue,
        fromLocation: inquiry.fromLocation,
        toLocation: inquiry.toLocation,
        distance: inquiry.distance,
        weight: inquiry.weight
      }));
      toast.info("Inquiry details auto-filled");
    } else {
      setFormData(prev => ({
        ...prev,
        inquiryNumber: selectedInquiryId,
        customerName: "",
        serviceType: "",
        estimatedValue: "",
        fromLocation: "",
        toLocation: "",
        distance: "",
        weight: ""
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("biddingDeadline");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [shipments, setShipments] = useState<ShipmentBid[]>([
    {
      id: "1",
      inquiryNumber: "INQ-2024-5678",
      customerName: "John Smith",
      pickupLocation: "Business Bay, Dubai",
      deliveryLocation: "Musaffah, Abu Dhabi",
      pickupDate: "2024-01-28",
      serviceType: "Express Delivery",
      totalWeight: 125.5,
      quotedAmount: 1250.0,
      biddingDeadline: "2024-01-27T18:00:00",
      status: "Open",
      bids: [
        {
          id: "1",
          driverName: "Ahmed Al Maktoum",
          driverRating: 4.8,
          completedTrips: 156,
          vehicleType: "Box Truck 3.5T",
          vehicleNumber: "DXB-12345",
          bidAmount: 950.0,
          estimatedTime: "2h 30m",
          bidSubmitted: "2024-01-27T14:30:00",
          status: "Pending",
          notes: "Experienced with fragile items, can handle same-day delivery",
        },
        {
          id: "2",
          driverName: "Mohammed Hassan",
          driverRating: 4.9,
          completedTrips: 203,
          vehicleType: "Box Truck 3.5T",
          vehicleNumber: "DXB-67890",
          bidAmount: 925.0,
          estimatedTime: "2h 45m",
          bidSubmitted: "2024-01-27T15:15:00",
          status: "Pending",
          notes: "Available immediately, familiar with route",
        },
        {
          id: "3",
          driverName: "Khalid Rahman",
          driverRating: 4.7,
          completedTrips: 142,
          vehicleType: "Van 1.5T",
          vehicleNumber: "DXB-54321",
          bidAmount: 1100.0,
          estimatedTime: "3h 00m",
          bidSubmitted: "2024-01-27T16:00:00",
          status: "Pending",
        },
      ],
    },
    {
      id: "2",
      inquiryNumber: "INQ-2024-5677",
      customerName: "Sarah Ahmed",
      pickupLocation: "Jebel Ali, Dubai",
      deliveryLocation: "Al Ain Industrial Area",
      pickupDate: "2024-01-29",
      serviceType: "Standard Delivery",
      totalWeight: 450.0,
      quotedAmount: 2800.0,
      biddingDeadline: "2024-01-28T12:00:00",
      status: "Open",
      bids: [
        {
          id: "4",
          driverName: "Youssef Ali",
          driverRating: 4.9,
          completedTrips: 187,
          vehicleType: "Flatbed Truck 5T",
          vehicleNumber: "DXB-11111",
          bidAmount: 2400.0,
          estimatedTime: "4h 30m",
          bidSubmitted: "2024-01-27T09:30:00",
          status: "Pending",
        },
        {
          id: "5",
          driverName: "Omar Saeed",
          driverRating: 4.6,
          completedTrips: 98,
          vehicleType: "Box Truck 7T",
          vehicleNumber: "DXB-22222",
          bidAmount: 2600.0,
          estimatedTime: "4h 00m",
          bidSubmitted: "2024-01-27T11:00:00",
          status: "Pending",
        },
      ],
    },
    {
      id: "3",
      inquiryNumber: "INQ-2024-5676",
      customerName: "Mohammed Ali",
      pickupLocation: "Deira, Dubai",
      deliveryLocation: "Sharjah Industrial Area",
      pickupDate: "2024-01-28",
      serviceType: "Express Delivery",
      totalWeight: 85.0,
      quotedAmount: 650.0,
      biddingDeadline: "2024-01-27T14:00:00",
      status: "Assigned",
      assignedDriver: "Ahmed Al Maktoum",
      bids: [
        {
          id: "6",
          driverName: "Ahmed Al Maktoum",
          driverRating: 4.8,
          completedTrips: 156,
          vehicleType: "Van 1.5T",
          vehicleNumber: "DXB-12345",
          bidAmount: 580.0,
          estimatedTime: "1h 30m",
          bidSubmitted: "2024-01-26T10:00:00",
          status: "Accepted",
        },
        {
          id: "7",
          driverName: "Tariq Mahmoud",
          driverRating: 4.5,
          completedTrips: 89,
          vehicleType: "Van 1.5T",
          vehicleNumber: "DXB-99999",
          bidAmount: 620.0,
          estimatedTime: "1h 45m",
          bidSubmitted: "2024-01-26T11:30:00",
          status: "Rejected",
        },
      ],
    },
    {
      id: "4",
      inquiryNumber: "INQ-2024-5675",
      customerName: "Alex Johnson",
      pickupLocation: "DIFC, Dubai",
      deliveryLocation: "Downtown Dubai",
      pickupDate: "2024-01-27",
      serviceType: "Same Day Delivery",
      totalWeight: 15.0,
      quotedAmount: 450.0,
      biddingDeadline: "2024-01-26T16:00:00",
      status: "Closed",
      bids: [],
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
        { value: "Open", label: "Open" },
        { value: "Assigned", label: "Assigned" },
        { value: "Closed", label: "Closed" },
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
    {
      id: "bids",
      label: "Bids Received",
      type: "select",
      values: [],
      options: [
        { value: "none", label: "No Bids" },
        { value: "few", label: "1-2 Bids" },
        { value: "some", label: "3-5 Bids" },
        { value: "many", label: "5+ Bids" },
      ],
    },
  ];

  // Apply filters
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(shipment.status);

    const serviceFilter = filters.find((f) => f.id === "serviceType");
    const matchesService =
      !serviceFilter || serviceFilter.values.length === 0 || serviceFilter.values.includes(shipment.serviceType);

    const bidsFilter = filters.find((f) => f.id === "bids");
    let matchesBids = true;
    if (bidsFilter && bidsFilter.values.length > 0) {
      matchesBids = bidsFilter.values.some((value) => {
        if (value === "none") return shipment.bids.length === 0;
        if (value === "few") return shipment.bids.length >= 1 && shipment.bids.length <= 2;
        if (value === "some") return shipment.bids.length >= 3 && shipment.bids.length <= 5;
        if (value === "many") return shipment.bids.length > 5;
        return false;
      });
    }

    return matchesSearch && matchesStatus && matchesService && matchesBids;
  });

  // Apply sorting
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    let comparison = 0;
    if (sortField === "biddingDeadline") {
      comparison = new Date(a.biddingDeadline).getTime() - new Date(b.biddingDeadline).getTime();
    } else if (sortField === "inquiryNumber") {
      comparison = a.inquiryNumber.localeCompare(b.inquiryNumber);
    } else if (sortField === "customerName") {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortField === "bids") {
      comparison = a.bids.length - b.bids.length;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedShipments.length / itemsPerPage);
  const paginatedShipments = sortedShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Open":
        return "info";
      case "Assigned":
        return "success";
      case "Closed":
        return "neutral";
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
            : getStatusColor(status) === "info"
              ? "bg-info-500"
              : getStatusColor(status) === "neutral"
                ? "bg-neutral-400"
                : "bg-neutral-400"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const getBidStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div
          className={`w-1.5 h-1.5 rounded-full ${status === "Accepted"
            ? "bg-success-500"
            : status === "Rejected"
              ? "bg-error-500"
              : status === "Expired"
                ? "bg-neutral-400"
                : "bg-warning-500"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const handleViewBids = (shipment: ShipmentBid) => {
    setSelectedShipment(shipment);
    setShowBidsModal(true);
    setOpenActionMenuId(null);
  };

  const handleAcceptBid = (shipment: ShipmentBid, bid: DriverBid) => {
    setSelectedShipment(shipment);
    setSelectedBid(bid);
    setShowAcceptModal(true);
  };

  const confirmAcceptBid = () => {
    if (selectedShipment && selectedBid) {
      setShipments(
        shipments.map((s) =>
          s.id === selectedShipment.id
            ? {
              ...s,
              status: "Assigned",
              assignedDriver: selectedBid.driverName,
              bids: s.bids.map((b) =>
                b.id === selectedBid.id
                  ? { ...b, status: "Accepted" }
                  : { ...b, status: "Rejected" }
              ),
            }
            : s
        )
      );
      toast.success(`Bid accepted for ${selectedBid.driverName}`);
    }
    setShowAcceptModal(false);
    setShowBidsModal(false);
  };

  const handleRejectBid = (shipment: ShipmentBid, bid: DriverBid) => {
    setSelectedShipment(shipment);
    setSelectedBid(bid);
    setShowRejectModal(true);
  };

  const confirmRejectBid = () => {
    if (selectedShipment && selectedBid) {
      setShipments(
        shipments.map((s) =>
          s.id === selectedShipment.id
            ? {
              ...s,
              bids: s.bids.map((b) =>
                b.id === selectedBid.id ? { ...b, status: "Rejected" } : b
              ),
            }
            : s
        )
      );
      toast.success(`Bid rejected for ${selectedBid.driverName}`);
    }
    setShowRejectModal(false);
  };

  const handleCopyInquiryNumber = (inquiryNumber: string) => {
    navigator.clipboard.writeText(inquiryNumber);
    toast.success("Inquiry number copied to clipboard");
  };

  const handleDownloadShipment = (shipment: ShipmentBid) => {
    toast.success(`Downloading shipment ${shipment.inquiryNumber}`);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddNew = () => {
    setFormData({
      inquiryNumber: "",
      customerName: "",
      serviceType: "",
      estimatedValue: "",
      fromLocation: "",
      toLocation: "",
      distance: "",
      weight: "",
      biddingDeadline: "",
      minimumBid: "",
      requirements: ""
    });
    setShowAddModal(true);
  };

  const handleSubmitNewBidding = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bidding opened successfully!");
    setShowAddModal(false);
  };

  const stats = [
    {
      label: "Open Bidding",
      value: shipments.filter((s) => s.status === "Open").length,
      icon: "Activity",
      subtitle: "Active shipments",
    },
    {
      label: "Total Bids",
      value: shipments.reduce((sum, s) => sum + s.bids.length, 0),
      icon: "TrendingUp",
      subtitle: "Received",
    },
    {
      label: "Assigned",
      value: shipments.filter((s) => s.status === "Assigned").length,
      icon: "CheckCircle",
      subtitle: "Driver assigned",
    },
    {
      label: "Closed",
      value: shipments.filter((s) => s.status === "Closed").length,
      icon: "XCircle",
      subtitle: "No bids received",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Driver Bidding"
          subtitle="Manage driver bids for shipments and assign drivers"
          breadcrumbs={[
            { label: "Operations", href: "#" },
            { label: "Driver Bidding", current: true },
          ]}
          primaryAction={{
            label: "Open Bidding",
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
                value: "biddingDeadline",
                label: "Deadline (Soonest)",
                direction: "asc",
              },
              {
                value: "biddingDeadline",
                label: "Deadline (Latest)",
                direction: "desc",
              },
              { value: "bids", label: "Most Bids", direction: "desc" },
              { value: "bids", label: "Least Bids", direction: "asc" },
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
              placeholder="Search shipments..."
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
              {paginatedShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewBids(shipment)}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {shipment.inquiryNumber}
                    </h3>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(shipment.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === shipment.id ? null : shipment.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === shipment.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewBids(shipment);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Bids ({shipment.bids.length})
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInquiryNumber(shipment.inquiryNumber);
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
                                handleDownloadShipment(shipment);
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

                  {/* Customer & Route */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{shipment.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {shipment.pickupLocation} → {shipment.deliveryLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Pickup: {shipment.pickupDate}</span>
                    </div>
                  </div>

                  {/* Bids Info */}
                  <div className="p-3 bg-info-50 dark:bg-info-900/30 rounded-lg border border-info-200 dark:border-info-800 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-info-700 dark:text-info-400 mb-1">
                          Bids Received
                        </div>
                        <div className="text-lg font-bold text-info-600 dark:text-info-400">
                          {shipment.bids.length}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Deadline
                        </div>
                        <div className="text-xs font-medium text-neutral-900 dark:text-white">
                          {formatTimestamp(shipment.biddingDeadline)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Driver */}
                  {shipment.assignedDriver && (
                    <div className="text-xs text-success-600 dark:text-success-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Assigned to {shipment.assignedDriver}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {shipment.inquiryNumber}
                        </h3>
                        <button
                          onClick={() => handleCopyInquiryNumber(shipment.inquiryNumber)}
                          className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                          title="Copy inquiry number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{shipment.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {shipment.pickupLocation} → {shipment.deliveryLocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{shipment.pickupDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-info-600 dark:text-info-400" />
                          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {shipment.bids.length} Bids
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          Deadline: {formatTimestamp(shipment.biddingDeadline)}
                        </div>
                        {shipment.assignedDriver && (
                          <div className="text-xs text-success-600 dark:text-success-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {shipment.assignedDriver}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(shipment.status)}

                      <div className="relative ml-2">
                        <button
                          onClick={() =>
                            setOpenActionMenuId(
                              openActionMenuId === shipment.id ? null : shipment.id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === shipment.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => handleViewBids(shipment)}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Bids ({shipment.bids.length})
                            </button>

                            <button
                              onClick={() => {
                                handleCopyInquiryNumber(shipment.inquiryNumber);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Inquiry Number
                            </button>

                            <button
                              onClick={() => {
                                handleDownloadShipment(shipment);
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
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Bids
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedShipments.map((shipment) => (
                      <tr
                        key={shipment.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer relative"
                        onClick={() => handleViewBids(shipment)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {shipment.inquiryNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyInquiryNumber(shipment.inquiryNumber);
                              }}
                              className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(shipment.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                              {shipment.customerName}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {shipment.serviceType}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {shipment.pickupLocation} → {shipment.deliveryLocation}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-info-600 dark:text-info-400">
                            {shipment.bids.length} Bids
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {formatTimestamp(shipment.biddingDeadline)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {shipment.assignedDriver ? (
                            <div className="text-sm text-success-600 dark:text-success-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {shipment.assignedDriver}
                            </div>
                          ) : (
                            <div className="text-sm text-neutral-400 dark:text-neutral-600">
                              —
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === shipment.id ? null : shipment.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === shipment.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewBids(shipment);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Bids ({shipment.bids.length})
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyInquiryNumber(shipment.inquiryNumber);
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
                                    handleDownloadShipment(shipment);
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
          {filteredShipments.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No shipments found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "No shipments available for bidding"}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredShipments.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredShipments.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* Bids Modal */}
        <FormModal
          isOpen={showBidsModal}
          onClose={() => setShowBidsModal(false)}
          title="Driver Bids"
          description={selectedShipment?.inquiryNumber}
          maxWidth="max-w-4xl"
        >
          {selectedShipment && (
            <div className="space-y-6">
              {/* Shipment Summary */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Customer
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedShipment.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Route
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedShipment.pickupLocation} → {selectedShipment.deliveryLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Quoted Amount
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      AED {selectedShipment.quotedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bids List */}
              {selectedShipment.bids.length > 0 ? (
                <div className="space-y-3">
                  {selectedShipment.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              {bid.driverName}
                            </h4>
                            {getBidStatusBadge(bid.status)}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-warning-500" />
                              <span>{bid.driverRating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              <span>{bid.completedTrips} trips</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              <span>{bid.vehicleType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                            Bid Amount
                          </p>
                          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            AED {bid.bidAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Est. Time: {bid.estimatedTime}
                          </p>
                        </div>
                      </div>

                      {bid.notes && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                          {bid.notes}
                        </p>
                      )}

                      {bid.status === "Pending" && selectedShipment.status === "Open" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptBid(selectedShipment, bid)}
                            className="flex-1 px-3 py-2 text-sm text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept Bid
                          </button>
                          <button
                            onClick={() => handleRejectBid(selectedShipment, bid)}
                            className="flex-1 px-3 py-2 text-sm text-error-700 dark:text-error-300 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg hover:bg-error-100 dark:hover:bg-error-900/50 transition-colors flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject Bid
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    No bids received yet
                  </p>
                </div>
              )}
            </div>
          )}

          <FormFooter>
            <button
              onClick={() => setShowBidsModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </FormFooter>
        </FormModal>

        {/* Accept Bid Modal */}
        {selectedBid && (
          <FormModal
            isOpen={showAcceptModal}
            onClose={() => setShowAcceptModal(false)}
            title="Accept Bid"
            description={`${selectedBid.driverName} - ${selectedShipment?.inquiryNumber}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg">
                <p className="text-sm text-success-900 dark:text-success-400">
                  You are about to accept this bid and assign the shipment to{" "}
                  {selectedBid.driverName}. This will automatically reject all other bids.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Driver Rating
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning-500" />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedBid.driverRating}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Bid Amount
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    AED {selectedBid.bidAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAcceptBid}
                className="px-4 py-2 text-sm text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm & Assign
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Reject Bid Modal */}
        {selectedBid && (
          <FormModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            title="Reject Bid"
            description={`${selectedBid.driverName} - ${selectedShipment?.inquiryNumber}`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-sm text-error-900 dark:text-error-400">
                  You are about to reject this bid from {selectedBid.driverName}. The driver
                  will be notified.
                </p>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejectBid}
                className="px-4 py-2 text-sm text-white bg-error-500 hover:bg-error-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Confirm Rejection
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* ========== OPEN BIDDING MODAL ========== */}
        <FormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Open Bidding for Shipment"
          description="Create a new bidding opportunity for drivers"
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSubmitNewBidding}>
            <div className="space-y-6">
              {/* Shipment Information */}
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                  Shipment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel htmlFor="inquiryNumber" required>Inquiry Number</FormLabel>
                    <FormSelect
                      id="inquiryNumber"
                      required
                      value={formData.inquiryNumber}
                      onChange={handleInquiryChange}
                    >
                      <option value="">Select Inquiry</option>
                      {availableInquiries.map(inquiry => (
                        <option key={inquiry.inquiryNumber} value={inquiry.inquiryNumber}>
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
                      placeholder="Enter customer name"
                      value={formData.customerName}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="serviceType" required>Service Type</FormLabel>
                    <FormSelect
                      id="serviceType"
                      required
                      value={formData.serviceType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select service</option>
                      <option value="Express Delivery">Express Delivery</option>
                      <option value="Standard Delivery">Standard Delivery</option>
                      <option value="Same Day Delivery">Same Day Delivery</option>
                    </FormSelect>
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="estimatedValue" required>Estimated Value (AED)</FormLabel>
                    <FormInput
                      id="estimatedValue"
                      type="number"
                      required
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.estimatedValue}
                      onChange={handleInputChange}
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
                    <FormLabel htmlFor="fromLocation" required>From Location</FormLabel>
                    <FormInput
                      id="fromLocation"
                      type="text"
                      required
                      placeholder="Dubai, UAE"
                      value={formData.fromLocation}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="toLocation" required>To Location</FormLabel>
                    <FormInput
                      id="toLocation"
                      type="text"
                      required
                      placeholder="Abu Dhabi, UAE"
                      value={formData.toLocation}
                      onChange={handleInputChange}
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
                      value={formData.distance}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="weight" required>Weight (kg)</FormLabel>
                    <FormInput
                      id="weight"
                      type="number"
                      required
                      placeholder="0.0"
                      step="0.1"
                      min="0"
                      value={formData.weight}
                      onChange={handleInputChange}
                    />
                  </FormField>
                </div>
              </div>

              {/* Bidding Settings */}
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                  Bidding Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel htmlFor="biddingDeadline" required>Bidding Deadline</FormLabel>
                    <FormInput
                      id="biddingDeadline"
                      type="datetime-local"
                      required
                      value={formData.biddingDeadline}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="minimumBid">Minimum Bid Amount (AED)</FormLabel>
                    <FormInput
                      id="minimumBid"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.minimumBid}
                      onChange={handleInputChange}
                    />
                  </FormField>
                </div>
              </div>

              {/* Additional Requirements */}
              <FormField>
                <FormLabel htmlFor="requirements">Special Requirements</FormLabel>
                <FormTextarea
                  id="requirements"
                  placeholder="Vehicle type, driver qualifications, special handling instructions..."
                  rows={3}
                  value={formData.requirements}
                  onChange={handleInputChange}
                />
              </FormField>
            </div>

            <FormFooter>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Open Bidding
              </button>
            </FormFooter>
          </form>
        </FormModal>
      </div>
    </div>
  );
}
