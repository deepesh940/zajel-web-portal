import { useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  Navigation,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { MilestoneTimeline } from "@/app/components/tracking/MilestoneTimeline";
import logo from "@/assets/f564cf890f443da9bfb1483c7e6b48a878d5d763.png";

interface TripStatus {
  stage: string;
  timestamp: string;
  location: string;
  completed: boolean;
}

interface TrackingData {
  trackingNumber: string;
  status: "In Transit" | "Pickup Completed" | "Delivery In Progress" | "Delivered" | "Delayed" | "Pending";
  customerName: string;
  pickupLocation: string;
  deliveryLocation: string;
  currentLocation: string;
  pickupDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  progress: number;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  timeline: TripStatus[];
  notes?: string;
}

// Mock tracking data
const mockTrackingData: Record<string, TrackingData> = {
  "TRP-2024-001": {
    trackingNumber: "TRP-2024-001",
    status: "In Transit",
    customerName: "Sarah Ahmed",
    pickupLocation: "Jebel Ali, Dubai",
    deliveryLocation: "Al Ain Industrial Area",
    currentLocation: "E11 Highway, approaching Al Ain",
    pickupDate: "2024-01-29T10:30:00",
    estimatedDelivery: "2024-01-29T14:15:00",
    progress: 65,
    driverName: "Khalid Saeed",
    driverPhone: "+971 55 345 6789",
    vehicleNumber: "DXB-33344",
    timeline: [
      {
        stage: "Order Received",
        timestamp: "2024-01-29T09:00:00",
        location: "Zajel Logistics HQ",
        completed: true,
      },
      {
        stage: "Pickup Scheduled",
        timestamp: "2024-01-29T10:00:00",
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
        stage: "Out for Delivery",
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
  "TRP-2024-002": {
    trackingNumber: "TRP-2024-002",
    status: "Delivered",
    customerName: "Mohammed Ali",
    pickupLocation: "Deira, Dubai",
    deliveryLocation: "Sharjah Industrial Area",
    currentLocation: "Sharjah Industrial Area - Loading Bay 3",
    pickupDate: "2024-01-28T14:00:00",
    estimatedDelivery: "2024-01-28T16:00:00",
    actualDelivery: "2024-01-28T15:55:00",
    progress: 100,
    driverName: "Ahmed Al Maktoum",
    driverPhone: "+971 50 123 4567",
    vehicleNumber: "DXB-12345",
    timeline: [
      {
        stage: "Order Received",
        timestamp: "2024-01-28T13:00:00",
        location: "Zajel Logistics HQ",
        completed: true,
      },
      {
        stage: "Pickup Scheduled",
        timestamp: "2024-01-28T13:30:00",
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
        stage: "Out for Delivery",
        timestamp: "2024-01-28T15:30:00",
        location: "Sharjah Industrial Area",
        completed: true,
      },
      {
        stage: "Delivered",
        timestamp: "2024-01-28T15:55:00",
        location: "Sharjah Industrial Area",
        completed: true,
      },
    ],
    notes: "Package delivered successfully. Signed by: Ahmed Hassan",
  },
  "INQ-2024-5677": {
    trackingNumber: "INQ-2024-5677",
    status: "In Transit",
    customerName: "Sarah Ahmed",
    pickupLocation: "Jebel Ali, Dubai",
    deliveryLocation: "Al Ain Industrial Area",
    currentLocation: "E11 Highway, approaching Al Ain",
    pickupDate: "2024-01-29T10:30:00",
    estimatedDelivery: "2024-01-29T14:15:00",
    progress: 65,
    timeline: [
      {
        stage: "Order Received",
        timestamp: "2024-01-29T09:00:00",
        location: "Zajel Logistics HQ",
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
        stage: "Out for Delivery",
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
};

export default function PublicTracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setIsSearching(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const data = mockTrackingData[trackingNumber.trim().toUpperCase()];

      if (data) {
        setTrackingData(data);
        setError("");
      } else {
        setTrackingData(null);
        setError("Tracking number not found. Please check and try again.");
      }

      setIsSearching(false);
    }, 800);
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Pending";

    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: TrackingData["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-success-100 text-success-800 border-success-200 dark:bg-success-900/30 dark:text-success-400 dark:border-success-800";
      case "In Transit":
      case "Delivery In Progress":
        return "bg-info-100 text-info-800 border-info-200 dark:bg-info-900/30 dark:text-info-400 dark:border-info-800";
      case "Delayed":
        return "bg-warning-100 text-warning-800 border-warning-200 dark:bg-warning-900/30 dark:text-warning-400 dark:border-warning-800";
      case "Pending":
      case "Pickup Completed":
        return "bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-400 dark:border-neutral-800";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-400 dark:border-neutral-800";
    }
  };

  const getStatusIcon = (status: TrackingData["status"]) => {
    switch (status) {
      case "Delivered":
        return CheckCircle;
      case "In Transit":
      case "Delivery In Progress":
        return Truck;
      case "Delayed":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Zajel Logistics" className="h-10" />
            <div>
              <h1 className="text-lg font-bold text-neutral-900 dark:text-white">Track Your Shipment</h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Real-time delivery tracking</p>
            </div>
          </div>
          <a
            href="#"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1.5"
          >
            Login to Portal
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Track Your Package
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Enter your tracking number to see the latest status of your shipment
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter tracking number (e.g., TRP-2024-001)"
                  className="w-full px-4 py-3.5 text-base bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-danger-800 dark:text-danger-300">{error}</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Try sample tracking numbers: <span className="font-mono text-primary-600 dark:text-primary-400">TRP-2024-001</span> or{" "}
                <span className="font-mono text-primary-600 dark:text-primary-400">TRP-2024-002</span>
              </p>
            </div>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6 animate-fadeIn">
            {/* Status Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden">
              <div className={`p-6 ${trackingData.status === "Delivered" ? "bg-success-50 dark:bg-success-900/20" : "bg-primary-50 dark:bg-primary-900/20"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${trackingData.status === "Delivered" ? "bg-success-100 dark:bg-success-900/40" : "bg-primary-100 dark:bg-primary-900/40"}`}>
                      {(() => {
                        const StatusIcon = getStatusIcon(trackingData.status);
                        return <StatusIcon className={`w-7 h-7 ${trackingData.status === "Delivered" ? "text-success-600 dark:text-success-400" : "text-primary-600 dark:text-primary-400"}`} />;
                      })()}
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Tracking Number</p>
                      <p className="text-xl font-bold text-neutral-900 dark:text-white font-mono">{trackingData.trackingNumber}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(trackingData.status)}`}>
                    {trackingData.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Delivery Progress</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{trackingData.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${trackingData.status === "Delivered" ? "bg-success-500" : "bg-primary-500"}`}
                      style={{ width: `${trackingData.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Route Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Pickup Location</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{trackingData.pickupLocation}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{formatTimestamp(trackingData.pickupDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-5">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary-500 to-success-500" />
                    <ArrowRight className="w-5 h-5 text-neutral-400" />
                  </div>

                  {trackingData.status !== "Delivered" && (
                    <div className="flex items-start gap-4 pl-5 pb-4">
                      <Navigation className="w-5 h-5 text-info-600 dark:text-info-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-info-600 dark:text-info-400 mb-1">Current Location</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{trackingData.currentLocation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-success-600 dark:text-success-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Delivery Location</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{trackingData.deliveryLocation}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                        {trackingData.actualDelivery
                          ? `Delivered: ${formatTimestamp(trackingData.actualDelivery)}`
                          : `Expected: ${formatTimestamp(trackingData.estimatedDelivery)}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Information (if available) */}
              {trackingData.driverName && (
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Driver Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Driver Name</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{trackingData.driverName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Contact Number</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{trackingData.driverPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Vehicle Number</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{trackingData.vehicleNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="p-6">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-6">Shipment Timeline</h3>
                <MilestoneTimeline timeline={trackingData.timeline} variant="vertical" showLocation={true} />
              </div>

              {/* Delivery Notes */}
              {trackingData.notes && (
                <div className="p-6 bg-success-50 dark:bg-success-900/20 border-t border-success-200 dark:border-success-800">
                  <h3 className="text-sm font-semibold text-success-900 dark:text-success-300 mb-2">Delivery Notes</h3>
                  <p className="text-sm text-success-800 dark:text-success-400">{trackingData.notes}</p>
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Need Help?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Call Us</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">+971 4 XXX XXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Email Us</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">support@zajel.ae</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            © 2024 Zajel Digital Logistics Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
