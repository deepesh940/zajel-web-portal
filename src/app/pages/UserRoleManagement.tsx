import { useState } from "react";
import {
  Users,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Shield,
  Eye,
  Calendar,
  Building2,
  Copy,
  BarChart3,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
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
  FormSection,
  FormSelect,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "Active" | "Inactive" | "Locked";
  lastLogin: string;
  createdDate: string;
  avatar?: string;
  permissions: string[];
}

type ViewMode = "grid" | "list" | "table";

export default function UserRoleManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive" | "Locked">("Active");
  const [formAvatar, setFormAvatar] = useState("");
  const [formPermissions, setFormPermissions] = useState<string[]>([]);

  // Available permissions list
  const availablePermissions = [
    { id: "view_inquiries", label: "View Inquiries", category: "Customer" },
    { id: "create_inquiries", label: "Create Inquiries", category: "Customer" },
    { id: "manage_customers", label: "Manage Customers", category: "Customer" },
    { id: "create_quotes", label: "Create Quotes", category: "Operations" },
    { id: "assign_drivers", label: "Assign Drivers", category: "Operations" },
    { id: "approve_pricing", label: "Approve Pricing", category: "Operations" },
    { id: "view_assignments", label: "View Assignments", category: "Operations" },
    { id: "update_trip_status", label: "Update Trip Status", category: "Operations" },
    { id: "view_invoices", label: "View Invoices", category: "Finance" },
    { id: "create_invoices", label: "Create Invoices", category: "Finance" },
    { id: "process_payments", label: "Process Payments", category: "Finance" },
    { id: "view_reports", label: "View Reports", category: "Finance" },
    { id: "view_pricing", label: "View Pricing", category: "Finance" },
    { id: "approve_discounts", label: "Approve Discounts", category: "Finance" },
    { id: "upload_documents", label: "Upload Documents", category: "General" },
    { id: "full_access", label: "Full Access", category: "Admin" },
    { id: "manage_users", label: "Manage Users", category: "Admin" },
    { id: "system_settings", label: "System Settings", category: "Admin" },
    { id: "view_audit_logs", label: "View Audit Logs", category: "Admin" },
  ];

  const [users, setUsers] = useState<User[]>([
    {
      id: "USR-001",
      name: "Ahmed Hassan",
      email: "ahmed.hassan@zajel.ae",
      phone: "+971 50 123 4567",
      role: "Operations Manager",
      department: "Operations",
      status: "Active",
      lastLogin: "2024-01-27 09:30 AM",
      createdDate: "2023-06-15",
      avatar: "https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTYxMDk4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      permissions: ["view_inquiries", "create_quotes", "assign_drivers", "approve_pricing"],
    },
    {
      id: "USR-002",
      name: "Fatima Al Mansoori",
      email: "fatima.almansoori@zajel.ae",
      phone: "+971 50 234 5678",
      role: "Finance User",
      department: "Finance",
      status: "Active",
      lastLogin: "2024-01-27 08:15 AM",
      createdDate: "2023-07-20",
      avatar: "https://images.unsplash.com/photo-1758817730402-b0ea18d9e607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwYXJhYnxlbnwxfHx8fDE3Njk2NjkwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      permissions: ["view_invoices", "create_invoices", "process_payments", "view_reports"],
    },
    {
      id: "USR-003",
      name: "Mohammed Al Zaabi",
      email: "mohammed.alzaabi@zajel.ae",
      phone: "+971 50 345 6789",
      role: "Driver",
      department: "Operations",
      status: "Active",
      lastLogin: "2024-01-27 07:45 AM",
      createdDate: "2023-08-10",
      permissions: ["view_assignments", "update_trip_status", "upload_documents"],
    },
    {
      id: "USR-004",
      name: "Sarah Johnson",
      email: "sarah.johnson@zajel.ae",
      phone: "+971 50 456 7890",
      role: "Customer Service",
      department: "Customer Support",
      status: "Active",
      lastLogin: "2024-01-27 09:00 AM",
      createdDate: "2023-09-05",
      avatar: "https://images.unsplash.com/photo-1765005204058-10418f5123c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGNvcnBvcmF0ZSUyMGhlYWRzaG90fGVufDF8fHx8MTc2OTU5MTMzNnww&ixlib=rb-4.1.0&q=80&w=1080",
      permissions: ["view_inquiries", "create_inquiries", "manage_customers"],
    },
    {
      id: "USR-005",
      name: "Khalid Saeed",
      email: "khalid.saeed@zajel.ae",
      phone: "+971 50 567 8901",
      role: "System Admin",
      department: "IT",
      status: "Active",
      lastLogin: "2024-01-27 08:30 AM",
      createdDate: "2023-05-01",
      permissions: ["full_access", "manage_users", "system_settings", "view_audit_logs"],
    },
    {
      id: "USR-006",
      name: "Layla Ahmed",
      email: "layla.ahmed@zajel.ae",
      phone: "+971 50 678 9012",
      role: "Pricing Analyst",
      department: "Finance",
      status: "Inactive",
      lastLogin: "2024-01-15 03:20 PM",
      createdDate: "2023-10-12",
      permissions: ["view_pricing", "create_quotes", "approve_discounts"],
    },
    {
      id: "USR-007",
      name: "Omar Abdullah",
      email: "omar.abdullah@zajel.ae",
      phone: "+971 50 789 0123",
      role: "Driver",
      department: "Operations",
      status: "Locked",
      lastLogin: "2024-01-20 11:00 AM",
      createdDate: "2023-11-18",
      permissions: ["view_assignments", "update_trip_status"],
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
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Locked", label: "Locked" },
      ],
    },
    {
      id: "role",
      label: "Role",
      type: "select",
      values: [],
      options: [
        { value: "System Admin", label: "System Admin" },
        { value: "Operations Manager", label: "Operations Manager" },
        { value: "Finance User", label: "Finance User" },
        { value: "Customer Service", label: "Customer Service" },
        { value: "Driver", label: "Driver" },
        { value: "Pricing Analyst", label: "Pricing Analyst" },
      ],
    },
    {
      id: "department",
      label: "Department",
      type: "select",
      values: [],
      options: [
        { value: "Operations", label: "Operations" },
        { value: "Finance", label: "Finance" },
        { value: "Customer Support", label: "Customer Support" },
        { value: "IT", label: "IT" },
      ],
    },
  ];

  // Apply filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    const statusFilter = filters.find((f) => f.id === "status");
    const matchesStatus =
      !statusFilter || statusFilter.values.length === 0 || statusFilter.values.includes(user.status);

    const roleFilter = filters.find((f) => f.id === "role");
    const matchesRole =
      !roleFilter || roleFilter.values.length === 0 || roleFilter.values.includes(user.role);

    const departmentFilter = filters.find((f) => f.id === "department");
    const matchesDepartment =
      !departmentFilter || departmentFilter.values.length === 0 || departmentFilter.values.includes(user.department);

    return matchesSearch && matchesStatus && matchesRole && matchesDepartment;
  });

  // Apply sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "email") {
      comparison = a.email.localeCompare(b.email);
    } else if (sortField === "role") {
      comparison = a.role.localeCompare(b.role);
    } else if (sortField === "lastLogin") {
      comparison = a.lastLogin.localeCompare(b.lastLogin);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "warning";
      case "Locked":
        return "error";
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
                : getStatusColor(status) === "error"
                  ? "bg-error-500"
                  : "bg-neutral-400"
            }`}
        ></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{status}</span>
      </span>
    );
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowPermissionsModal(true);
    setOpenActionMenuId(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormRole(user.role);
    setFormDepartment(user.department);
    setFormStatus(user.status);
    setFormAvatar(user.avatar || "");
    setFormPermissions(user.permissions);
    setShowUserModal(true);
    setOpenActionMenuId(null);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setOpenActionMenuId(null);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      toast.success(`User ${selectedUser.name} deleted successfully`);
    }
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleLockUnlock = (user: User) => {
    const newStatus = user.status === "Locked" ? "Active" : "Locked";
    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    toast.success(`User ${user.name} ${newStatus === "Locked" ? "locked" : "unlocked"}`);
    setOpenActionMenuId(null);
  };

  const handleCopyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    toast.success("User ID copied to clipboard");
  };

  const handleAddNewUser = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormRole("");
    setFormDepartment("");
    setFormStatus("Active");
    setFormAvatar("");
    setFormPermissions([]);
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
              ...u,
              name: formName,
              email: formEmail,
              phone: formPhone,
              role: formRole,
              department: formDepartment,
              status: formStatus,
              avatar: formAvatar || undefined,
              permissions: formPermissions,
            }
            : u
        )
      );
      toast.success(`User ${formName} updated successfully`);
    } else {
      // Add new user
      const newUser: User = {
        id: `USR-${String(users.length + 1).padStart(3, "0")}`,
        name: formName,
        email: formEmail,
        phone: formPhone,
        role: formRole,
        department: formDepartment,
        status: formStatus,
        avatar: formAvatar || undefined,
        lastLogin: "Never",
        createdDate: new Date().toISOString().split("T")[0],
        permissions: formPermissions,
      };
      setUsers([...users, newUser]);
      toast.success(`User ${formName} created successfully`);
    }
    setShowUserModal(false);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAllPermissions = () => {
    setFormPermissions(availablePermissions.map((p) => p.id));
  };

  const handleDeselectAllPermissions = () => {
    setFormPermissions([]);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarDisplay = (user: User) => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
        />
      );
    }
    return (
      <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
        {getInitials(user.name)}
      </span>
    );
  };

  const stats = [
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "Active").length,
      icon: "CheckCircle",
      subtitle: "Currently active",
    },
    {
      label: "Inactive",
      value: users.filter((u) => u.status === "Inactive").length,
      icon: "Clock",
      subtitle: "Not logged in recently",
    },
    {
      label: "Locked",
      value: users.filter((u) => u.status === "Locked").length,
      icon: "XCircle",
      subtitle: "Access restricted",
    },
    {
      label: "Total Users",
      value: users.length,
      icon: "Users",
      subtitle: "All users",
    },
  ];

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="User & Role Management"
          subtitle="Manage user accounts, roles, and permissions"
          breadcrumbs={[
            { label: "Admin", href: "#" },
            { label: "User & Role Management", current: true },
          ]}
          primaryAction={{
            label: "+ Add User",
            onClick: handleAddNewUser,
          }}
          moreMenu={{

            onPrint: () => window.print(),
            sortOptions: [
              {
                value: "name",
                label: "Name (A-Z)",
                direction: "asc",
              },
              {
                value: "name",
                label: "Name (Z-A)",
                direction: "desc",
              },
              {
                value: "email",
                label: "Email (A-Z)",
                direction: "asc",
              },
              {
                value: "role",
                label: "Role (A-Z)",
                direction: "asc",
              },
              {
                value: "lastLogin",
                label: "Last Login (Recent)",
                direction: "desc",
              },
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
              placeholder="Search users..."
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
              {paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md hover:border-primary-600 dark:hover:border-primary-400 transition-all cursor-pointer relative"
                  onClick={() => handleViewDetails(user)}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                        {getAvatarDisplay(user)}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {user.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(user.status)}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === user.id ? null : user.id
                            );
                          }}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === user.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(user);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditUser(user);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Edit className="w-4 h-4" />
                              Edit User
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLockUnlock(user);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              {user.status === "Locked" ? (
                                <>
                                  <Unlock className="w-4 h-4" />
                                  Unlock User
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4" />
                                  Lock User
                                </>
                              )}
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUserId(user.id);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Copy className="w-4 h-4" />
                              Copy User ID
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{user.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Building2 className="w-4 h-4 flex-shrink-0" />
                      <span>{user.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Last Login
                    </div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">
                      {user.lastLogin}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {getAvatarDisplay(user)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            {user.name}
                          </h3>
                          <button
                            onClick={() => handleCopyUserId(user.id)}
                            className="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                            title="Copy user ID"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {getStatusBadge(user.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <Shield className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{user.role}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            <span>{user.department}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>Last: {user.lastLogin}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(
                            openActionMenuId === user.id ? null : user.id
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionMenuId === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          <button
                            onClick={() => handleEditUser(user)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Edit className="w-4 h-4" />
                            Edit User
                          </button>

                          <button
                            onClick={() => handleLockUnlock(user)}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                          >
                            {user.status === "Locked" ? (
                              <>
                                <Unlock className="w-4 h-4" />
                                Unlock User
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                Lock User
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              handleCopyUserId(user.id);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Copy className="w-4 h-4" />
                            Copy User ID
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="w-full px-4 py-2.5 text-left text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete User
                          </button>
                        </div>
                      )}
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
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer relative"
                        onClick={() => handleViewDetails(user)}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                                  {getInitials(user.name)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {user.role}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {user.department}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {user.email}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {user.lastLogin}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === user.id ? null : user.id
                                );
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === user.id && (
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(user);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditUser(user);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit User
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLockUnlock(user);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                >
                                  {user.status === "Locked" ? (
                                    <>
                                      <Unlock className="w-4 h-4" />
                                      Unlock User
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-4 h-4" />
                                      Lock User
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyUserId(user.id);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy User ID
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete User
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
          {filteredUsers.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12">
              <div className="text-center">
                <Users className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {searchQuery || filters.some((f) => f.values.length > 0)
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first user"}
                </p>
                <button
                  onClick={handleAddNewUser}
                  className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {/* Add/Edit User Modal */}
        <FormModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title={editingUser ? "Edit User" : "Add New User"}
          description={editingUser ? `Update ${editingUser.name}'s details and permissions` : "Create a new user account with role-based permissions"}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="name" required>
                  Full Name
                </FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter full name"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="email" required>
                  Email Address
                </FormLabel>
                <FormInput
                  id="email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="user@zajel.ae"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="phone" required>
                  Phone Number
                </FormLabel>
                <FormInput
                  id="phone"
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="role" required>
                  Role
                </FormLabel>
                <FormSelect
                  id="role"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                >
                  <option value="">Select role</option>
                  <option value="System Admin">System Admin</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Finance User">Finance User</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Driver">Driver</option>
                  <option value="Pricing Analyst">Pricing Analyst</option>
                </FormSelect>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="department" required>
                  Department
                </FormLabel>
                <FormSelect
                  id="department"
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                >
                  <option value="">Select department</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="IT">IT</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="status" required>
                  Status
                </FormLabel>
                <FormSelect
                  id="status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "Active" | "Inactive" | "Locked")}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Locked">Locked</option>
                </FormSelect>
              </FormField>
            </div>

            <FormField>
              <FormLabel htmlFor="avatar">
                Avatar URL (Optional)
              </FormLabel>
              <FormInput
                id="avatar"
                type="url"
                value={formAvatar}
                onChange={(e) => setFormAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Enter a URL for the user's profile picture. If left empty, initials will be displayed.
              </p>
            </FormField>

            {/* Permissions Section */}
            <FormSection title="Permissions" description="Select the permissions for this user">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {formPermissions.length} of {availablePermissions.length} permissions selected
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Select All
                    </button>
                    <span className="text-neutral-300 dark:text-neutral-700">|</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllPermissions}
                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Group permissions by category */}
                {["Customer", "Operations", "Finance", "General", "Admin"].map((category) => {
                  const categoryPermissions = availablePermissions.filter(
                    (p) => p.category === category
                  );
                  if (categoryPermissions.length === 0) return null;

                  return (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categoryPermissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formPermissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="w-4 h-4 text-primary-600 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500 dark:focus:ring-primary-600 focus:ring-2"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {permission.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FormSection>
          </div>

          <FormFooter>
            <button
              onClick={() => setShowUserModal(false)}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveUser}
              className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
            >
              {editingUser ? <Edit className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {editingUser ? "Update User" : "Create User"}
            </button>
          </FormFooter>
        </FormModal>

        {/* User Details/Permissions Modal */}
        {selectedUser && (
          <FormModal
            isOpen={showPermissionsModal}
            onClose={() => setShowPermissionsModal(false)}
            title="User Details & Permissions"
            description={`${selectedUser.name} - ${selectedUser.id}`}
            maxWidth="max-w-4xl"
          >
            <div className="space-y-6">
              {/* User Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                      {getInitials(selectedUser.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {selectedUser.email}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    ID: {selectedUser.id}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Role
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedUser.role}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Department
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedUser.department}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedUser.email}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedUser.phone}
                  </p>
                </div>
              </div>

              {/* Activity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Last Login
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedUser.lastLogin}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Account Created
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {selectedUser.createdDate}
                  </p>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Permissions ({selectedUser.permissions.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-400 flex-shrink-0" />
                      <span className="text-sm text-success-900 dark:text-success-300">
                        {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <FormFooter>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPermissionsModal(false);
                  handleEditUser(selectedUser);
                }}
                className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit User
              </button>
            </FormFooter>
          </FormModal>
        )}

        {/* Delete User Modal */}
        {selectedUser && (
          <FormModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete User"
            description={`Are you sure you want to delete ${selectedUser.name}?`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-sm text-error-900 dark:text-error-400">
                  This action cannot be undone. All user data and access will be permanently removed.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                        {getInitials(selectedUser.name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {selectedUser.name}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Role:</span>{" "}
                    <span className="text-neutral-900 dark:text-white">{selectedUser.role}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Department:</span>{" "}
                    <span className="text-neutral-900 dark:text-white">{selectedUser.department}</span>
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
                onClick={confirmDeleteUser}
                className="px-4 py-2 text-sm text-white bg-error-500 hover:bg-error-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    </div>
  );
}
