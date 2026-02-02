import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Building2,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Check,
  Palette,
  Clock,
  X,
  FileText,
  ChevronRight,
  Key,
  Package,
  Truck,
  MapPin,
  Receipt,
  ClipboardList,
} from "lucide-react";
import logo from '@/assets/f564cf890f443da9bfb1483c7e6b48a878d5d763.png';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/app/components/ui/dropdown-menu";
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormSection,
} from "./hb/common/Form";
import { UserRole, getRoleDisplayName, getAllRoles } from "../../mockAPI/navigationData";

interface GlobalHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isSidebarCollapsed: boolean;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onLogout?: () => void;
}

export function GlobalHeader({
  isDarkMode,
  onToggleDarkMode,
  isSidebarCollapsed,
  currentTheme = "natural",
  onThemeChange,
  currentRole = "customer",
  onRoleChange,
  onLogout,
}: GlobalHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Refs for click outside detection (search only)
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const themes = [
    {
      id: "natural",
      name: "Natural",
      description: "Clean neutral grays",
    },
    {
      id: "slate",
      name: "Slate",
      description: "Modern blue-gray tones",
    },
    {
      id: "nord",
      name: "Nord",
      description: "Nordic soft palette",
    },
    {
      id: "midnight",
      name: "Midnight",
      description: "Deep blue theme",
    },
    {
      id: "warm",
      name: "Warm",
      description: "Coffee & earth tones",
    },
    {
      id: "zajel",
      name: "Zajel",
      description: "Professional blue branding",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New Shipment Inquiry",
      message: "Customer ABC Corp submitted a new inquiry #INQ-2024-001",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Driver Bid Received",
      message: "Ahmed Hassan placed a bid on Trip #TR-2024-0456",
      time: "15 min ago",
      unread: true,
    },
    {
      id: 3,
      title: "SLA Warning",
      message: "Inquiry #INQ-2024-089 approaching response deadline",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 4,
      title: "Payment Processed",
      message: "Driver payment for Trip #TR-2024-0445 completed",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 5,
      title: "Quote Approved",
      message: "Customer approved quote for Inquiry #INQ-2024-078",
      time: "3 hours ago",
      unread: false,
    },
  ];

  // Mock search data - Logistics specific
  const searchData = [
    // Shipment Inquiries
    {
      id: 1,
      title: "INQ-2024-001 - Electronics Shipment",
      type: "Inquiry",
      category: "Shipment Inquiries",
      icon: Package,
      description: "Dubai to Abu Dhabi - 500kg",
      status: "Pending Quote",
      pageId: "inquiry-management",
    },
    {
      id: 2,
      title: "INQ-2024-089 - Pharmaceutical Cargo",
      type: "Inquiry",
      category: "Shipment Inquiries",
      icon: Package,
      description: "Sharjah to Al Ain - Temperature Controlled",
      status: "In Progress",
      pageId: "inquiry-management",
    },
    {
      id: 3,
      title: "INQ-2024-078 - Construction Materials",
      type: "Inquiry",
      category: "Shipment Inquiries",
      icon: Package,
      description: "Jebel Ali to Ras Al Khaimah - 2000kg",
      status: "Quote Sent",
      pageId: "inquiry-management",
    },

    // Drivers
    {
      id: 4,
      title: "Ahmed Hassan",
      type: "Driver",
      category: "Drivers",
      icon: Truck,
      description: "ID: DRV-1001 - Rating: 4.8/5",
      status: "Available",
      pageId: "driver-assignment",
    },
    {
      id: 5,
      title: "Mohammed Ali",
      type: "Driver",
      category: "Drivers",
      icon: Truck,
      description: "ID: DRV-1002 - Rating: 4.9/5",
      status: "On Trip",
      pageId: "driver-assignment",
    },
    {
      id: 6,
      title: "Khalid Rahman",
      type: "Driver",
      category: "Drivers",
      icon: Truck,
      description: "ID: DRV-1003 - Rating: 4.7/5",
      status: "Available",
      pageId: "driver-assignment",
    },

    // Active Trips
    {
      id: 7,
      title: "Trip #TR-2024-0456",
      type: "Trip",
      category: "Active Trips",
      icon: MapPin,
      description: "Dubai to Sharjah - In Transit",
      status: "Active",
      pageId: "trip-monitoring",
    },
    {
      id: 8,
      title: "Trip #TR-2024-0445",
      type: "Trip",
      category: "Active Trips",
      icon: MapPin,
      description: "Abu Dhabi to Dubai - Pickup Complete",
      status: "Active",
      pageId: "trip-monitoring",
    },

    // Customers
    {
      id: 9,
      title: "ABC Corporation",
      type: "Customer",
      category: "Customers",
      icon: Building2,
      description: "Trade License: TL-2023-45678",
      status: "Verified",
      pageId: "customer-approvals",
    },
    {
      id: 10,
      title: "XYZ Logistics LLC",
      type: "Customer",
      category: "Customers",
      icon: Building2,
      description: "Trade License: TL-2023-89012",
      status: "Pending Verification",
      pageId: "customer-approvals",
    },

    // Invoices
    {
      id: 11,
      title: "Invoice #INV-2024-1234",
      type: "Invoice",
      category: "Finance",
      icon: Receipt,
      description: "ABC Corporation - AED 5,500",
      status: "Paid",
      pageId: "customer-invoicing",
    },
    {
      id: 12,
      title: "Invoice #INV-2024-1235",
      type: "Invoice",
      category: "Finance",
      icon: Receipt,
      description: "XYZ Logistics LLC - AED 8,900",
      status: "Pending",
      pageId: "customer-invoicing",
    },
  ];

  const quickAccessModules = [
    {
      id: 1,
      name: "Inquiry Management",
      icon: ClipboardList,
      description: "View all shipment inquiries",
      module: "inquiry-management",
    },
    {
      id: 2,
      name: "Trip Monitoring",
      icon: MapPin,
      description: "Track active trips",
      module: "trip-monitoring",
    },
    {
      id: 3,
      name: "Driver Management",
      icon: Truck,
      description: "View all drivers",
      module: "driver-assignment",
    },
    {
      id: 4,
      name: "Customer Invoicing",
      icon: Receipt,
      description: "Manage invoices & payments",
      module: "customer-invoicing",
    },
    {
      id: 5,
      name: "SLA Monitoring",
      icon: Clock,
      description: "Track SLA compliance",
      module: "sla-monitoring",
    },
    {
      id: 6,
      name: "Reports",
      icon: FileText,
      description: "View analytics & reports",
      module: "reports",
    },
  ];

  // Filter search results
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query),
    );
  };

  const searchResults = getSearchResults();
  const groupedResults = searchResults.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof searchData>,
  );

  // Highlight search term in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts
      .map((part, index) =>
        part.toLowerCase() === query.toLowerCase()
          ? `<mark class="bg-warning-200 dark:bg-warning-900/30 text-neutral-900 dark:text-white px-0.5 rounded">${part}</mark>`
          : part,
      )
      .join("");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setShowSearchDropdown(true);
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape" && showSearchDropdown) {
        setShowSearchDropdown(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearchDropdown]);

  // Handle search input focus
  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
  };

  // Handle search query change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      setShowSearchDropdown(true);
    }
  };

  // Handle search submission and navigation
  const handleSearchSubmit = (query: string, pageId?: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecent = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem("recentSearches", JSON.stringify(newRecent));
      setShowSearchDropdown(false);

      // Navigate if pageId is provided
      if (pageId) {
        window.dispatchEvent(new CustomEvent('navigate', { detail: pageId }));
      }
    }
  };

  // Clear recent searches
  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Remove single recent search
  const handleRemoveRecent = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRecent = recentSearches.filter((s) => s !== searchToRemove);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white dark:bg-neutral-950 transition-all ${isScrolled
        ? "border-b border-neutral-200 dark:border-neutral-800 shadow-sm"
        : ""
        }`}
    >
      <div className="h-12 px-6 flex items-center justify-between gap-4">
        {/* Left Side - Logo (when sidebar collapsed) + Global Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          {/* Logo - Show only when sidebar is collapsed */}
          {isSidebarCollapsed && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <img
                src={logo}
                alt="Admin Panel"
                className="h-8 w-8 object-contain"
              />
            </div>
          )}

          {/* Global Search */}
          <div className="relative flex-1" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-500 dark:text-neutral-400" />
            <input
              type="text"
              placeholder="Search shipments, drivers, trips, invoices..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={handleSearchFocus}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  handleSearchSubmit(searchQuery);
                }
              }}
              className="w-full pl-10 pr-20 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              ref={searchInputRef}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] rounded border border-neutral-300 dark:border-neutral-700">
                ⌘K
              </kbd>
            </div>

            {showSearchDropdown && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xl overflow-hidden">
                {/* Search with results */}
                {searchQuery.trim() && searchResults.length > 0 && (
                  <div className="max-h-[500px] overflow-y-auto">
                    {/* Grouped Results */}
                    {Object.entries(groupedResults).map(([category, items]) => (
                      <div
                        key={category}
                        className="border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                      >
                        <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50">
                          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-400 uppercase tracking-wide">
                            {category}
                          </div>
                        </div>
                        {items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                handleSearchSubmit(searchQuery, item.pageId);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors flex items-center gap-3 group"
                            >
                              <div className="w-9 h-9 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                                <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div
                                  className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(item.title, searchQuery),
                                  }}
                                />
                                <div
                                  className="text-xs text-neutral-600 dark:text-neutral-400"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(
                                      item.description,
                                      searchQuery,
                                    ),
                                  }}
                                />
                              </div>
                              <div
                                className={`px-2 py-0.5 text-[10px] rounded-full flex-shrink-0 ${item.status === "Approved" ||
                                  item.status === "Present" ||
                                  item.status === "On Time"
                                  ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400"
                                  : item.status === "Pending" ||
                                    item.status === "Correction Needed"
                                    ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400"
                                    : item.status === "On Leave" ||
                                      item.status === "Late" ||
                                      item.status === "Rejected"
                                      ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400"
                                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400"
                                  }`}
                              >
                                {item.status}
                              </div>
                              <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                    <div className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                      No results found
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Try searching with different keywords
                    </div>
                  </div>
                )}

                {/* Recent Searches & Quick Access (when no query) */}
                {!searchQuery.trim() && (
                  <>
                    {/* Quick Access */}
                    <div className="border-b border-neutral-200 dark:border-neutral-800">
                      <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50">
                        <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-400 uppercase tracking-wide">
                          Quick Access
                        </div>
                      </div>
                      <div className="p-2">
                        {quickAccessModules.map((module) => {
                          const Icon = module.icon;
                          return (
                            <button
                              key={module.id}
                              onClick={() => {
                                setShowSearchDropdown(false);
                                window.dispatchEvent(new CustomEvent('navigate', { detail: module.module }));
                              }}
                              className="w-full px-3 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-3"
                            >
                              <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                  {module.name}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  {module.description}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
                          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-400 uppercase tracking-wide">
                            Recent Searches
                          </div>
                          <button
                            onClick={handleClearRecent}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="p-2">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSearchQuery(search);
                                handleSearchSubmit(search);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-3 group"
                            >
                              <Clock className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                              <span className="flex-1">{search}</span>
                              <div
                                onClick={(e) => handleRemoveRecent(search, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 hover:text-error-500 dark:hover:text-error-400" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty Recent State */}
                    {recentSearches.length === 0 && (
                      <div className="p-8 text-center border-t border-neutral-200 dark:border-neutral-800">
                        <Clock className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          No recent searches
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Search Tips Footer */}
                <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-[10px]">
                        ↵
                      </kbd>
                      to select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-[10px]">
                        ESC
                      </kbd>
                      to close
                    </span>
                  </div>
                  <span className="text-neutral-500 dark:text-neutral-500">
                    {searchResults.length > 0 && `${searchResults.length} results`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Icons and Dropdowns */}
        <div className="flex items-center gap-1.5">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-9 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-error-500 text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <DropdownMenuLabel className="p-0 text-sm font-semibold text-neutral-900 dark:text-white">
                    Notifications
                  </DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer ${notification.unread
                      ? "bg-primary-50/30 dark:bg-primary-950/30"
                      : ""
                      }`}
                  >
                    <div className="flex items-start gap-2">
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mt-1.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">
                          {notification.title}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          {notification.message}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-500">
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="w-full text-center justify-center text-primary-600 dark:text-primary-400">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors">
                <Palette className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {themes.map((theme) => (
                  <DropdownMenuItem
                    key={theme.id}
                    onClick={() => {
                      if (onThemeChange) {
                        onThemeChange(theme.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">
                          {theme.name}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {theme.description}
                        </div>
                      </div>
                      {currentTheme === theme.id && (
                        <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5 ml-2" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Day/Night Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="w-9 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-all hover:scale-105 active:scale-95"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 px-2 flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors">
                <div className="w-7 h-7 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  JD
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">
                      John Doe
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      john.doe@company.com
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">
                      Sales Manager
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  <Key className="w-4 h-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {/* Logout */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                  }
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Change Password Modal */}
      <FormModal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }}
        title="Change Password"
        description="Enter your current password and choose a new one"
        maxWidth="max-w-md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Handle password change logic here
            console.log("Password change submitted:", passwordForm);
            setShowChangePasswordModal(false);
            setPasswordForm({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }}
        >
          <FormSection>
            <FormField>
              <FormLabel htmlFor="currentPassword" required>
                Current Password
              </FormLabel>
              <FormInput
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="newPassword" required>
                New Password
              </FormLabel>
              <FormInput
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Must be at least 8 characters long
              </p>
            </FormField>

            <FormField>
              <FormLabel htmlFor="confirmPassword" required>
                Confirm New Password
              </FormLabel>
              <FormInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </FormField>
          </FormSection>

          <FormFooter>
            <button
              type="button"
              onClick={() => {
                setShowChangePasswordModal(false);
                setPasswordForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              Change Password
            </button>
          </FormFooter>
        </form>
      </FormModal>
    </header>
  );
}