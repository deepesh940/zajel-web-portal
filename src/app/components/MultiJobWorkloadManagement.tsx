import { useState } from "react";
import {
  Truck,
  User,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  TrendingUp,
  Activity,
} from "lucide-react";

interface DriverWorkload {
  driverId: string;
  driverName: string;
  vehicleNumber: string;
  vehicleType: string;
  currentJobs: number;
  maxCapacity: number;
  totalWeight: number;
  maxWeight: number;
  status: "Available" | "Near Capacity" | "At Capacity" | "On Trip";
  assignedTrips: WorkloadTrip[];
  rating: number;
  location: string;
}

interface WorkloadTrip {
  tripId: string;
  inquiryNumber: string;
  customerName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupTime: string;
  weight: number;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
}

interface MultiJobAssignmentProps {
  drivers: DriverWorkload[];
  onAssign: (driverId: string, tripIds: string[]) => void;
  onRefresh?: () => void;
}

export default function MultiJobWorkloadManagement({
  drivers: initialDrivers,
  onAssign,
  onRefresh,
}: MultiJobAssignmentProps) {
  const [drivers, setDrivers] = useState<DriverWorkload[]>(initialDrivers);
  const [selectedDriver, setSelectedDriver] = useState<DriverWorkload | null>(null);
  const [sortBy, setSortBy] = useState<"availability" | "rating" | "proximity">("availability");

  const getStatusColor = (status: DriverWorkload["status"]) => {
    switch (status) {
      case "Available":
        return "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400";
      case "Near Capacity":
        return "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400";
      case "At Capacity":
        return "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400";
      case "On Trip":
        return "bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400";
    }
  };

  const getCapacityPercentage = (driver: DriverWorkload) => {
    return Math.round((driver.currentJobs / driver.maxCapacity) * 100);
  };

  const getWeightPercentage = (driver: DriverWorkload) => {
    return Math.round((driver.totalWeight / driver.maxWeight) * 100);
  };

  const getSortedDrivers = () => {
    return [...drivers].sort((a, b) => {
      switch (sortBy) {
        case "availability":
          return a.currentJobs - b.currentJobs;
        case "rating":
          return b.rating - a.rating;
        case "proximity":
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });
  };

  const getPriorityColor = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400";
      case "Medium":
        return "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400";
      case "Low":
        return "bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Multi-Job Workload Management
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Manage driver assignments and workload distribution
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <option value="availability">Sort by Availability</option>
            <option value="rating">Sort by Rating</option>
            <option value="proximity">Sort by Proximity</option>
          </select>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Available Drivers</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {drivers.filter((d) => d.status === "Available").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info-100 dark:bg-info-900/30 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-info-600 dark:text-info-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">On Trip</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {drivers.filter((d) => d.status === "On Trip").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Near Capacity</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {drivers.filter((d) => d.status === "Near Capacity").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Avg Utilization</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {Math.round(
                  (drivers.reduce((acc, d) => acc + getCapacityPercentage(d), 0) /
                    drivers.length)
                )}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Driver List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
            Driver Fleet ({getSortedDrivers().length})
          </h3>

          <div className="space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto">
            {getSortedDrivers().map((driver) => {
              const capacityPercentage = getCapacityPercentage(driver);
              const weightPercentage = getWeightPercentage(driver);
              const isSelected = selectedDriver?.driverId === driver.driverId;

              return (
                <div
                  key={driver.driverId}
                  onClick={() => setSelectedDriver(driver)}
                  className={`bg-white dark:bg-neutral-900 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary-600 shadow-lg"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {driver.driverName}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {driver.vehicleNumber} • {driver.vehicleType}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${getStatusColor(
                        driver.status
                      )}`}
                    >
                      {driver.status}
                    </span>
                  </div>

                  {/* Location & Rating */}
                  <div className="flex items-center gap-4 mb-3 text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{driver.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-warning-600 dark:text-warning-400" />
                      <span className="font-semibold">{driver.rating}</span>
                    </div>
                  </div>

                  {/* Workload Meters */}
                  <div className="space-y-3">
                    {/* Job Capacity */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          Jobs: {driver.currentJobs}/{driver.maxCapacity}
                        </span>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                          {capacityPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            capacityPercentage >= 100
                              ? "bg-error-500"
                              : capacityPercentage >= 80
                              ? "bg-warning-500"
                              : "bg-success-500"
                          }`}
                          style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Weight Capacity */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          Weight: {driver.totalWeight}kg/{driver.maxWeight}kg
                        </span>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                          {weightPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            weightPercentage >= 100
                              ? "bg-error-500"
                              : weightPercentage >= 80
                              ? "bg-warning-500"
                              : "bg-primary-500"
                          }`}
                          style={{ width: `${Math.min(weightPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assigned Jobs Count */}
                  <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        Assigned Jobs
                      </span>
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {driver.assignedTrips.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Driver Details */}
        <div className="space-y-4">
          {selectedDriver ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  {selectedDriver.driverName}'s Schedule
                </h3>
                <button className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium transition-colors">
                  Assign New Job
                </button>
              </div>

              {/* Job List */}
              {selectedDriver.assignedTrips.length > 0 ? (
                <div className="space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto">
                  {selectedDriver.assignedTrips.map((trip, index) => (
                    <div
                      key={trip.tripId}
                      className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
                    >
                      {/* Job Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                              #{index + 1}
                            </span>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                              {trip.inquiryNumber}
                            </p>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {trip.customerName}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(
                              trip.priority
                            )}`}
                          >
                            {trip.priority}
                          </span>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-success-600 dark:bg-success-400 rounded-full mt-1.5" />
                          <div className="flex-1">
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                              Pickup
                            </p>
                            <p className="text-xs font-medium text-neutral-900 dark:text-white">
                              {trip.pickupLocation}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pl-0.5">
                          <ArrowRight className="w-4 h-4 text-neutral-400" />
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mt-1.5" />
                          <div className="flex-1">
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                              Delivery
                            </p>
                            <p className="text-xs font-medium text-neutral-900 dark:text-white">
                              {trip.deliveryLocation}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{trip.pickupTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" />
                            <span>{trip.weight}kg</span>
                          </div>
                        </div>

                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            trip.status === "Completed"
                              ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400"
                              : trip.status === "In Progress"
                              ? "bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
                  <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    No jobs assigned yet
                  </p>
                  <button className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Assign First Job
                  </button>
                </div>
              )}

              {/* Workload Suggestion */}
              {selectedDriver.currentJobs < selectedDriver.maxCapacity && (
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary-900 dark:text-primary-200 mb-1">
                        Capacity Available
                      </p>
                      <p className="text-xs text-primary-700 dark:text-primary-400">
                        This driver can handle{" "}
                        {selectedDriver.maxCapacity - selectedDriver.currentJobs} more job(s) and{" "}
                        {Math.round(selectedDriver.maxWeight - selectedDriver.totalWeight)}kg more
                        cargo.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12 text-center h-full flex flex-col items-center justify-center">
              <Truck className="w-16 h-16 text-neutral-400 mb-4" />
              <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                Select a Driver
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Click on a driver card to view their schedule and workload details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
