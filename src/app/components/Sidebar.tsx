import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  Settings,
  Key,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  User,
} from "lucide-react";
import logo from "@/assets/f564cf890f443da9bfb1483c7e6b48a878d5d763.png";
import { getNavigationData, UserRole } from "../../mockAPI/navigationData";
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormSection,
} from "./hb/common/Form";

interface SidebarProps {
  onLogout?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentPage?: string;
  onNavigate?: (pageId: string) => void;
  currentRole?: UserRole;
}

export function Sidebar({
  onLogout,
  isCollapsed,
  onToggleCollapse,
  currentPage = "dashboard",
  onNavigate,
  currentRole = "customer",
}: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showProfileDrawer, setShowProfileDrawer] =
    useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] =
    useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileDrawer(false);
      }
    };

    if (showProfileDrawer) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [showProfileDrawer]);

  const toggleMenu = (menuId: string) => {
    if (isCollapsed) {
      // Don't toggle when collapsed
      return;
    }

    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId],
    );
  };

  // Get navigation data from mockAPI based on current role
  const menuItems = getNavigationData(
    currentPage,
    onNavigate || (() => { }),
    currentRole,
  );

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 z-40 ${isCollapsed ? "w-16" : "w-64"
        }`}
    >
      {/* Logo at Top - 48px height to match GlobalHeader */}
      <div
        className={`h-12 flex-shrink-0 px-4 border-b border-neutral-200 dark:border-neutral-800 ${isCollapsed ? "flex justify-center items-center" : "flex items-center justify-between"}`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="ZAJEL Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-lg text-neutral-900 dark:text-white">
              ZAJEL
            </span>
          </div>
        )}

        {/* Hamburger Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          aria-label={
            isCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Scrollable Menu */}
      <div
        className={`overflow-y-auto overflow-x-hidden h-[calc(100vh-96px)] py-2 transition-all ${isHoveringMenu
          ? "scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent"
          : "[&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-transparent"
          }`}
        onMouseEnter={() => setIsHoveringMenu(true)}
        onMouseLeave={() => setIsHoveringMenu(false)}
      >
        <div className="space-y-1 px-2">
          {menuItems.map((menuItem) => {
            const Icon = menuItem.icon;
            const isExpanded = expandedMenus.includes(
              menuItem.id,
            );
            const hasActiveSubItem = menuItem.subItems?.some(
              (sub) => sub.active,
            );

            return (
              <div key={menuItem.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => {
                    if (
                      menuItem.subItems &&
                      menuItem.subItems.length > 0
                    ) {
                      toggleMenu(menuItem.id);
                    } else if (menuItem.onClick) {
                      menuItem.onClick();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors focus:outline-none ${hasActiveSubItem || menuItem.active
                    ? "bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? menuItem.label : ""}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {Icon && (
                      <Icon className="w-5 h-5 flex-shrink-0" />
                    )}
                    {!isCollapsed && (
                      <span className="text-sm truncate">
                        {menuItem.label}
                      </span>
                    )}
                  </div>
                  {!isCollapsed &&
                    menuItem.subItems &&
                    menuItem.subItems.length > 0 && (
                      <span className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                </button>

                {/* Sub Menu Items */}
                {!isCollapsed &&
                  menuItem.subItems &&
                  menuItem.subItems.length > 0 &&
                  isExpanded && (
                    <div className="mt-1 ml-8 mr-2 space-y-1">
                      {menuItem.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={subItem.onClick}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none ${subItem.active
                            ? "bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white"
                            }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                          <span className="truncate">
                            {subItem.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      {/* User Profile Section at Bottom */}
      <div
        ref={profileRef}
        className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
      >
        <button
          onClick={() =>
            setShowProfileDrawer(!showProfileDrawer)
          }
          className={`w-full p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors focus:outline-none ${isCollapsed ? "flex justify-center" : ""}`}
        >
          {isCollapsed ? (
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm">
              JD
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                JD
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm text-neutral-900 dark:text-white truncate">
                  John Doe
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  john.doe@zajel.com
                </div>
              </div>
              <ChevronUp
                className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform ${showProfileDrawer ? "rotate-180" : ""}`}
              />
            </div>
          )}
        </button>

        {/* Profile Popover */}
        {showProfileDrawer && !isCollapsed && (
          <div className="absolute bottom-full left-0 right-0 mb-2 mx-2">
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden">
              {/* User Info Header */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">
                      John Doe
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      john.doe@zajel.com
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">
                      Logistics Manager
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-1">
                <button
                  onClick={() => {
                    setShowProfileDrawer(false);
                    // Handle profile click
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileDrawer(false);
                    setShowChangePasswordModal(true);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileDrawer(false);
                    // Handle settings click
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileDrawer(false);
                    // Handle help click
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </button>
              </div>

              {/* Logout */}
              <div className="p-1 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => {
                    setShowProfileDrawer(false);
                    onLogout?.();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 rounded transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
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
            console.log(
              "Password change submitted:",
              passwordForm,
            );
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
    </aside>
  );
}