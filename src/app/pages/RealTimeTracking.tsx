import { useState, useEffect } from "react";
import {
  MapPin,
  Truck,
  Navigation,
  Clock,
  Phone,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  Radio,
  Maximize2,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";

interface VehicleLocation {
  id: string;
  driverName: string;
  vehicleNumber: string;
  phone: string;
  shipmentId: string;
  status: "en-route" | "idle" | "loading" | "unloading";
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  speed: number; // km/h
  eta: string;
  progress: number; // percentage
}

const mockVehicles: VehicleLocation[] = [
  {
    id: "VH-001",
    driverName: "Ahmed Hassan",
    vehicleNumber: "DXB-A-1234",
    phone: "+971 50 123 4567",
    shipmentId: "SH-2024-1234",
    status: "en-route",
    location: {
      lat: 25.2048,
      lng: 55.2708,
      address: "Sheikh Zayed Road, Dubai",
    },
    destination: {
      lat: 24.4539,
      lng: 54.3773,
      address: "Al Ain Industrial Area",
    },
    speed: 85,
    eta: "45 mins",
    progress: 65,
  },
  {
    id: "VH-002",
    driverName: "Mohammed Ali",
    vehicleNumber: "DXB-B-5678",
    phone: "+971 50 234 5678",
    shipmentId: "SH-2024-1235",
    status: "loading",
    location: {
      lat: 25.3548,
      lng: 55.4212,
      address: "Sharjah Industrial Area",
    },
    destination: {
      lat: 25.2048,
      lng: 55.2708,
      address: "Dubai Marina",
    },
    speed: 0,
    eta: "1 hr 20 mins",
    progress: 20,
  },
  {
    id: "VH-003",
    driverName: "Khalid Omar",
    vehicleNumber: "DXB-C-9012",
    phone: "+971 50 345 6789",
    shipmentId: "SH-2024-1236",
    status: "unloading",
    location: {
      lat: 24.4539,
      lng: 54.3773,
      address: "Abu Dhabi Port",
    },
    destination: {
      lat: 24.4539,
      lng: 54.3773,
      address: "Abu Dhabi Port",
    },
    speed: 0,
    eta: "Arrived",
    progress: 100,
  },
  {
    id: "VH-004",
    driverName: "Salem Abdullah",
    vehicleNumber: "DXB-D-3456",
    phone: "+971 50 456 7890",
    shipmentId: "SH-2024-1237",
    status: "en-route",
    location: {
      lat: 25.1972,
      lng: 55.2744,
      address: "Business Bay, Dubai",
    },
    destination: {
      lat: 25.3548,
      lng: 55.4212,
      address: "Sharjah Airport",
    },
    speed: 72,
    eta: "28 mins",
    progress: 55,
  },
];

export default function RealTimeTracking() {
  const [vehicles, setVehicles] = useState<VehicleLocation[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(
    mockVehicles[0]
  );
  const [isLive, setIsLive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time location updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle) => {
          // Simulate movement for en-route vehicles
          if (vehicle.status === "en-route") {
            const newProgress = Math.min(vehicle.progress + Math.random() * 2, 100);
            const newSpeed = 60 + Math.random() * 40;

            return {
              ...vehicle,
              progress: newProgress,
              speed: newSpeed,
              location: {
                ...vehicle.location,
                lat: vehicle.location.lat + (Math.random() - 0.5) * 0.01,
                lng: vehicle.location.lng + (Math.random() - 0.5) * 0.01,
              },
            };
          }
          return vehicle;
        })
      );
      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: VehicleLocation["status"]) => {
    switch (status) {
      case "en-route":
        return "bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400";
      case "loading":
        return "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400";
      case "unloading":
        return "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400";
      case "idle":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400";
    }
  };

  const getStatusIcon = (status: VehicleLocation["status"]) => {
    switch (status) {
      case "en-route":
        return <Navigation className="w-4 h-4" />;
      case "loading":
      case "unloading":
        return <Package className="w-4 h-4" />;
      case "idle":
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.shipmentId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Real-Time Vehicle Tracking
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Monitor all active shipments and vehicle locations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              {isLive ? (
                <>
                  <Radio className="w-4 h-4 text-success-600 dark:text-success-400 animate-pulse" />
                  <span className="text-sm font-medium text-success-600 dark:text-success-400">
                    Live
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Paused
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLive
                  ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 hover:bg-error-200"
                  : "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 hover:bg-success-200"
              }`}
            >
              {isLive ? "Pause" : "Resume"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Total Vehicles
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {vehicles.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info-100 dark:bg-info-900/30 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-info-600 dark:text-info-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  En Route
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {vehicles.filter((v) => v.status === "en-route").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  On Time
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {vehicles.filter((v) => v.progress < 100).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Delayed
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {/* Map Controls */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    Live Map View
                  </span>
                </div>
                <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  <Maximize2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Mock Map */}
            <div className="relative h-[600px] bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-950 dark:to-neutral-900">
              {/* Map Grid */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-10 h-full">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-neutral-400 dark:border-neutral-600"
                    />
                  ))}
                </div>
              </div>

              {/* Vehicle Markers */}
              {filteredVehicles.map((vehicle, index) => {
                const isSelected = selectedVehicle?.id === vehicle.id;
                const top = 15 + (index * 25) % 70;
                const left = 10 + (index * 30) % 70;

                return (
                  <div
                    key={vehicle.id}
                    className="absolute cursor-pointer transform transition-all duration-300 hover:scale-110"
                    style={{
                      top: `${top}%`,
                      left: `${left}%`,
                    }}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    {/* Vehicle Pin */}
                    <div
                      className={`relative ${
                        isSelected ? "z-10" : "z-0"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                          isSelected
                            ? "bg-primary-600 ring-4 ring-primary-200 dark:ring-primary-900"
                            : vehicle.status === "en-route"
                            ? "bg-info-600"
                            : vehicle.status === "loading" || vehicle.status === "unloading"
                            ? "bg-warning-600"
                            : "bg-neutral-600"
                        }`}
                      >
                        <Truck className="w-5 h-5 text-white" />
                      </div>

                      {/* Vehicle Label */}
                      {isSelected && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 whitespace-nowrap z-20">
                          <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                            {vehicle.vehicleNumber}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {vehicle.driverName}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Navigation className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                            <span className="text-xs text-primary-600 dark:text-primary-400">
                              {vehicle.speed} km/h
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Pulse Animation for En-Route */}
                      {vehicle.status === "en-route" && (
                        <div className="absolute inset-0 rounded-full bg-info-400 animate-ping opacity-30" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 shadow-lg">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">
                  Legend
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-info-600 rounded-full" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      En Route
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning-600 rounded-full" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      Loading/Unloading
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-neutral-600 rounded-full" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      Idle
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Update Time */}
              <div className="absolute top-4 right-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-2 shadow-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search vehicle, driver, shipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option value="all">All Status</option>
              <option value="en-route">En Route</option>
              <option value="loading">Loading</option>
              <option value="unloading">Unloading</option>
              <option value="idle">Idle</option>
            </select>
          </div>

          {/* Vehicle Cards */}
          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
            {filteredVehicles.map((vehicle) => {
              const isSelected = selectedVehicle?.id === vehicle.id;
              return (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`bg-white dark:bg-neutral-900 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary-600 shadow-lg"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {vehicle.vehicleNumber}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {vehicle.shipmentId}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${getStatusColor(
                        vehicle.status
                      )}`}
                    >
                      {getStatusIcon(vehicle.status)}
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Driver Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        {vehicle.driverName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        {vehicle.phone}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-success-600 dark:text-success-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">
                          Current
                        </p>
                        <p className="text-xs text-neutral-900 dark:text-white">
                          {vehicle.location.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">
                          Destination
                        </p>
                        <p className="text-xs text-neutral-900 dark:text-white">
                          {vehicle.destination.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        Progress
                      </span>
                      <div className="flex items-center gap-3">
                        {vehicle.status === "en-route" && (
                          <span className="text-xs text-info-600 dark:text-info-400">
                            {vehicle.speed} km/h
                          </span>
                        )}
                        <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                          {vehicle.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          vehicle.progress === 100
                            ? "bg-success-500"
                            : vehicle.progress > 75
                            ? "bg-info-500"
                            : "bg-primary-500"
                        }`}
                        style={{ width: `${vehicle.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-neutral-500 dark:text-neutral-500">
                        ETA: {vehicle.eta}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
