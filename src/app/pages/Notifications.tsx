import { useState } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  DollarSign,
  Truck,
  Info,
  Search,
  Trash2,
  Check,
  MoreVertical,
  Clock,
  Calendar,
  Filter,
  Eye,
  Mail,
} from "lucide-react";
import {
  PageHeader,
  SearchBar,
  SummaryWidgets,
  FilterChips,
} from "../components/hb/listing";
import type { FilterCondition } from "../components/hb/listing";
import {
  FormModal,
  FormFooter,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface Notification {
  id: string;
  type:
    | "quote"
    | "shipment"
    | "payment"
    | "delivery"
    | "system"
    | "inquiry";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  actionLink?: string;
  actionLabel?: string;
}

export default function Notifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] =
    useState<Notification | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "quote",
      title: "New Quote Received",
      message:
        "Your shipment inquiry INQ-2024-5678 has received a quote of AED 850. Review and approve to proceed.",
      timestamp: "2024-01-27T14:30:00",
      read: false,
      priority: "high",
      actionLink: "quote-review",
      actionLabel: "Review Quote",
    },
    {
      id: "2",
      type: "shipment",
      title: "Shipment Picked Up",
      message:
        "Your shipment SHP-2024-1234 has been picked up and is on its way to the destination.",
      timestamp: "2024-01-27T10:15:00",
      read: false,
      priority: "medium",
      actionLink: "track-shipment",
      actionLabel: "Track Shipment",
    },
    {
      id: "3",
      type: "payment",
      title: "Payment Confirmation",
      message:
        "Your payment of AED 620 for shipment SHP-2024-1233 has been successfully processed.",
      timestamp: "2024-01-26T16:45:00",
      read: true,
      priority: "medium",
    },
    {
      id: "4",
      type: "delivery",
      title: "Delivery Completed",
      message:
        "Your shipment SHP-2024-1232 has been successfully delivered to the destination.",
      timestamp: "2024-01-26T14:20:00",
      read: true,
      priority: "low",
    },
    {
      id: "5",
      type: "inquiry",
      title: "Inquiry Submitted",
      message:
        "Your shipment inquiry INQ-2024-5679 has been submitted. We will review and send you a quote within 2-4 hours.",
      timestamp: "2024-01-26T11:00:00",
      read: true,
      priority: "low",
    },
    {
      id: "6",
      type: "system",
      title: "System Maintenance Scheduled",
      message:
        "Our system will undergo maintenance on Jan 30, 2024 from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.",
      timestamp: "2024-01-25T09:00:00",
      read: true,
      priority: "medium",
    },
    {
      id: "7",
      type: "quote",
      title: "Quote Expiring Soon",
      message:
        "Your quote for inquiry INQ-2024-5677 will expire in 24 hours. Please review and approve if you wish to proceed.",
      timestamp: "2024-01-25T08:30:00",
      read: false,
      priority: "high",
      actionLink: "quote-review",
      actionLabel: "Review Quote",
    },
    {
      id: "8",
      type: "shipment",
      title: "Shipment Out for Delivery",
      message:
        "Your shipment SHP-2024-1231 is out for delivery and will arrive today by 6:00 PM.",
      timestamp: "2024-01-24T07:00:00",
      read: true,
      priority: "high",
      actionLink: "track-shipment",
      actionLabel: "Track Now",
    },
  ]);

  // Filter options for advanced search
  const filterOptions: FilterCondition[] = [
    {
      id: "type",
      label: "Type",
      type: "checkbox",
      values: [],
      options: [
        { value: "quote", label: "Quote" },
        { value: "shipment", label: "Shipment" },
        { value: "payment", label: "Payment" },
        { value: "delivery", label: "Delivery" },
        { value: "inquiry", label: "Inquiry" },
        { value: "system", label: "System" },
      ],
    },
    {
      id: "status",
      label: "Status",
      type: "checkbox",
      values: [],
      options: [
        { value: "read", label: "Read" },
        { value: "unread", label: "Unread" },
      ],
    },
    {
      id: "priority",
      label: "Priority",
      type: "checkbox",
      values: [],
      options: [
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" },
      ],
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const typeFilter = filters.find((f) => f.id === "type");
    const matchesType =
      !typeFilter || typeFilter.values.length === 0 || typeFilter.values.includes(notification.type);

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter ||
      statusFilter.values.length === 0 ||
      (statusFilter.values.includes("read") && notification.read) ||
      (statusFilter.values.includes("unread") && !notification.read);

    const priorityFilter = filters.find((f) => f.id === "priority");
    const matchesPriority =
      !priorityFilter || priorityFilter.values.length === 0 || priorityFilter.values.includes(notification.priority);

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const stats = [
    {
      label: "Total Notifications",
      value: notifications.length.toString(),
      icon: Bell,
      color: "primary" as const,
    },
    {
      label: "Unread",
      value: unreadCount.toString(),
      icon: Mail,
      color: "warning" as const,
    },
    {
      label: "Read",
      value: readCount.toString(),
      icon: CheckCircle,
      color: "success" as const,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quote":
        return DollarSign;
      case "shipment":
        return Package;
      case "payment":
        return CheckCircle;
      case "delivery":
        return Truck;
      case "inquiry":
        return Bell;
      case "system":
        return Info;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "quote":
        return "bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400";
      case "shipment":
        return "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400";
      case "payment":
        return "bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400";
      case "delivery":
        return "bg-info-100 dark:bg-info-900/30 text-info-600 dark:text-info-400";
      case "inquiry":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
      case "system":
        return "bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400";
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400">
            High
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (read: boolean) => {
    if (!read) {
      return (
        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400">
          Unread
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400">
        Read
      </span>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = (notification: Notification) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    toast.success("Notification marked as read");
    setOpenActionMenuId(null);
  };

  const handleMarkAsUnread = (notification: Notification) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, read: false } : n
      )
    );
    toast.success("Notification marked as unread");
    setOpenActionMenuId(null);
  };

  const handleDeleteNotification = (notification: Notification) => {
    setNotificationToDelete(notification);
    setShowDeleteModal(true);
    setOpenActionMenuId(null);
  };

  const confirmDelete = () => {
    if (notificationToDelete) {
      setNotifications(
        notifications.filter((n) => n.id !== notificationToDelete.id)
      );
      toast.success("Notification deleted");
      setShowDeleteModal(false);
      setNotificationToDelete(null);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
    if (!notification.read) {
      handleMarkAsRead(notification);
    }
  };

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Notifications"
          subtitle="Stay updated with your latest activities and alerts"
          breadcrumbs={[
            { label: "Dashboard", href: "#" },
            { label: "Notifications", current: true },
          ]}
          secondaryActions={[
            {
              label: "Mark All as Read",
              onClick: handleMarkAllAsRead,
              variant: "secondary",
            },
            {
              label: "Clear All",
              onClick: handleClearAll,
              variant: "secondary",
            },
          ]}
        />

        {/* ========== SEARCH & FILTERS ========== */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search notifications..."
            showAdvancedSearch={false}
            onToggleAdvancedSearch={() => {}}
            onToggleSummary={() => setShowSummary(!showSummary)}
            showSummary={showSummary}
            filterOptions={filterOptions}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* ========== FILTER CHIPS ========== */}
        {filters.some((f) => f.values.length > 0) && (
          <FilterChips
            filters={filters}
            onRemoveFilter={(filterId, value) => {
              setFilters(
                filters.map((f) =>
                  f.id === filterId
                    ? { ...f, values: f.values.filter((v) => v !== value) }
                    : f
                )
              );
            }}
            onClearFilter={(filterId) => {
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

        {/* ========== NOTIFICATIONS LIST ========== */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <Bell className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {searchQuery || filters.some((f) => f.values.length > 0)
                  ? "Try adjusting your search or filters"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer ${
                    !notification.read ? "bg-primary-50/30 dark:bg-primary-900/10" : ""
                  }`}
                  onClick={() => handleViewDetails(notification)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-4">
                          {getStatusBadge(notification.read)}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === notification.id
                                    ? null
                                    : notification.id
                                );
                              }}
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === notification.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(notification);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>

                                {!notification.read ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkAsRead(notification);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <Check className="w-4 h-4" />
                                    Mark as Read
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkAsUnread(notification);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                  >
                                    <Mail className="w-4 h-4" />
                                    Mark as Unread
                                  </button>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                        {getPriorityBadge(notification.priority)}
                        {notification.actionLabel && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`Navigating to ${notification.actionLink}`);
                            }}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                          >
                            {notification.actionLabel} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View Details Modal */}
        {selectedNotification && (
          <FormModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title={selectedNotification.title}
            description={`Notification ID: ${selectedNotification.id}`}
            maxWidth="max-w-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${getNotificationColor(
                    selectedNotification.type
                  )}`}
                >
                  {(() => {
                    const Icon = getNotificationIcon(selectedNotification.type);
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                      {selectedNotification.type}
                    </span>
                    {getPriorityBadge(selectedNotification.priority)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedNotification.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.actionLabel && (
                <div className="p-4 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-lg">
                  <p className="text-sm text-primary-900 dark:text-primary-300 mb-2">
                    Action Required
                  </p>
                  <button
                    onClick={() => {
                      toast.info(`Navigating to ${selectedNotification.actionLink}`);
                      setShowDetailsModal(false);
                    }}
                    className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                  >
                    {selectedNotification.actionLabel}
                  </button>
                </div>
              )}
            </div>

            <FormFooter>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
              {!selectedNotification.read && (
                <button
                  onClick={() => {
                    handleMarkAsRead(selectedNotification);
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark as Read
                </button>
              )}
            </FormFooter>
          </FormModal>
        )}

        {/* Delete Confirmation Modal */}
        {notificationToDelete && (
          <FormModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete Notification"
            description="Are you sure you want to delete this notification?"
          >
            <div className="space-y-4">
              <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-sm text-error-900 dark:text-error-400">
                  This action cannot be undone. The notification will be permanently removed.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  {notificationToDelete.title}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {notificationToDelete.message}
                </p>
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
                Delete Notification
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    </div>
  );
}
