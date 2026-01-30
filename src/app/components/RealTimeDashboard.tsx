import { useState, useEffect } from "react";
import {  Radio, RefreshCw, AlertTriangle, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

interface RealTimeMetric {
  id: string;
  label: string;
  value: number;
  trend: "up" | "down" | "stable";
  change: number;
}

interface LiveActivity {
  id: string;
  type: "inquiry" | "quote" | "trip" | "alert";
  title: string;
  description: string;
  timestamp: Date;
  priority?: "high" | "medium" | "low";
}

interface RealTimeDashboardProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export default function RealTimeDashboard({
  autoRefresh = true,
  refreshInterval = 5000, // 5 seconds
}: RealTimeDashboardProps) {
  const [isLive, setIsLive] = useState(autoRefresh);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([
    { id: "active-inquiries", label: "Active Inquiries", value: 34, trend: "up", change: 2 },
    { id: "sla-warnings", label: "SLA Warnings", value: 7, trend: "down", change: -1 },
    { id: "active-trips", label: "Active Trips", value: 42, trend: "up", change: 3 },
    { id: "completion-rate", label: "Completion Rate", value: 94, trend: "stable", change: 0 },
  ]);

  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([
    {
      id: "1",
      type: "inquiry",
      title: "New Inquiry Received",
      description: "INQ-2024-5680 from ABC Trading LLC",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      priority: "high",
    },
    {
      id: "2",
      type: "quote",
      title: "Quote Approved",
      description: "Quote #QT-1245 approved by XYZ Logistics",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      priority: "medium",
    },
    {
      id: "3",
      type: "trip",
      title: "Trip Completed",
      description: "TR-2024-890 delivered successfully",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      priority: "low",
    },
    {
      id: "4",
      type: "alert",
      title: "SLA Warning",
      description: "INQ-2024-5675 approaching SLA deadline",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      priority: "high",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Update metrics with random changes
      setMetrics((prev) =>
        prev.map((metric) => {
          const randomChange = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const newValue = Math.max(0, metric.value + randomChange);
          return {
            ...metric,
            value: newValue,
            change: randomChange,
            trend:
              randomChange > 0 ? "up" : randomChange < 0 ? "down" : "stable",
          };
        })
      );

      // Occasionally add new activity
      if (Math.random() > 0.7) {
        const newActivity: LiveActivity = {
          id: `activity-${Date.now()}`,
          type: ["inquiry", "quote", "trip", "alert"][
            Math.floor(Math.random() * 4)
          ] as LiveActivity["type"],
          title: "New Activity",
          description: "Real-time activity update",
          timestamp: new Date(),
          priority: ["high", "medium", "low"][
            Math.floor(Math.random() * 3)
          ] as LiveActivity["priority"],
        };

        setLiveActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
      }

      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getActivityIcon = (type: LiveActivity["type"]) => {
    switch (type) {
      case "inquiry":
        return "📋";
      case "quote":
        return "💰";
      case "trip":
        return "🚚";
      case "alert":
        return "⚠️";
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Status Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isLive ? (
                <Radio className="w-5 h-5 text-success-600 dark:text-success-400 animate-pulse" />
              ) : (
                <RefreshCw className="w-5 h-5 text-neutral-400" />
              )}
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {isLive ? "Live Updates" : "Paused"}
              </span>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-500">
              Last updated: {formatTime(lastUpdate)}
            </span>
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLive
                ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-900/50"
                : "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 hover:bg-success-200 dark:hover:bg-success-900/50"
            }`}
          >
            {isLive ? "Pause" : "Resume"} Updates
          </button>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {metric.label}
              </span>
              {metric.trend !== "stable" && (
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    metric.trend === "up"
                      ? "text-success-600 dark:text-success-400"
                      : "text-error-600 dark:text-error-400"
                  }`}
                >
                  <TrendingUp
                    className={`w-3 h-3 ${
                      metric.trend === "down" ? "rotate-180" : ""
                    }`}
                  />
                  {Math.abs(metric.change)}
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {metric.value}
              {metric.id === "completion-rate" ? "%" : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Live Activity Feed
          </h3>
          {isLive && (
            <div className="flex items-center gap-2 text-xs text-success-600 dark:text-success-400">
              <div className="w-2 h-2 bg-success-600 dark:bg-success-400 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
          )}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {liveActivities.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-500">
              No recent activities
            </div>
          ) : (
            liveActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {activity.title}
                    </p>
                    {activity.priority && (
                      <span
                        className={`flex-shrink-0 text-xs px-2 py-0.5 rounded ${
                          activity.priority === "high"
                            ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400"
                            : activity.priority === "medium"
                            ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400"
                            : "bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400"
                        }`}
                      >
                        {activity.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    {activity.description}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                On-Time Deliveries
              </p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                96%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Avg Response Time
              </p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                12 mins
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error-100 dark:bg-error-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Critical Alerts
              </p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
