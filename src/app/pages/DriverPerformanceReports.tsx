import { useState } from "react";
import { Calendar, RefreshCw, BarChart3 } from "lucide-react";
import {
  PageHeader,
  IconButton,
  SummaryWidgets,
  SearchBar,
  Pagination,
  AdvancedSearchPanel,
  FilterChips,
} from "../components/hb/listing";
import type { FilterCondition } from "../components/hb/listing";
import { toast } from "sonner";

export default function DriverPerformanceReports() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sample data for driver performance report
  const reportData = [
    {
      driverId: "DRV-001",
      driverName: "Ahmed Hassan",
      vehicleType: "van-3.5",
      vehicleTypeLabel: "Van - 3.5 Ton",
      totalTrips: 142,
      completedTrips: 139,
      completionRate: "97.9%",
      totalRevenue: "AED 89,500",
      avgRevPerTrip: "AED 644",
      totalDistance: "4,285 km",
      avgRating: "4.8",
      onTimeDeliveries: 135,
      onTimeRate: "97.1%",
      slaCompliance: "96.5%",
    },
    {
      driverId: "DRV-002",
      driverName: "Mohammed Ali",
      vehicleType: "truck-7.5",
      vehicleTypeLabel: "Truck - 7.5 Ton",
      totalTrips: 128,
      completedTrips: 126,
      completionRate: "98.4%",
      totalRevenue: "AED 95,200",
      avgRevPerTrip: "AED 755",
      totalDistance: "5,120 km",
      avgRating: "4.9",
      onTimeDeliveries: 123,
      onTimeRate: "97.6%",
      slaCompliance: "97.2%",
    },
    {
      driverId: "DRV-003",
      driverName: "Khalid Omar",
      vehicleType: "van-3.5",
      vehicleTypeLabel: "Van - 3.5 Ton",
      totalTrips: 118,
      completedTrips: 115,
      completionRate: "97.5%",
      totalRevenue: "AED 78,400",
      avgRevPerTrip: "AED 682",
      totalDistance: "3,890 km",
      avgRating: "4.7",
      onTimeDeliveries: 111,
      onTimeRate: "96.5%",
      slaCompliance: "95.8%",
    },
    {
      driverId: "DRV-004",
      driverName: "Salem Abdullah",
      vehicleType: "truck-10",
      vehicleTypeLabel: "Truck - 10 Ton",
      totalTrips: 105,
      completedTrips: 103,
      completionRate: "98.1%",
      totalRevenue: "AED 102,300",
      avgRevPerTrip: "AED 993",
      totalDistance: "5,650 km",
      avgRating: "4.8",
      onTimeDeliveries: 100,
      onTimeRate: "97.1%",
      slaCompliance: "96.8%",
    },
    {
      driverId: "DRV-005",
      driverName: "Rashid Hamad",
      vehicleType: "van-3.5",
      vehicleTypeLabel: "Van - 3.5 Ton",
      totalTrips: 98,
      completedTrips: 95,
      completionRate: "96.9%",
      totalRevenue: "AED 68,200",
      avgRevPerTrip: "AED 718",
      totalDistance: "3,420 km",
      avgRating: "4.6",
      onTimeDeliveries: 91,
      onTimeRate: "95.8%",
      slaCompliance: "94.9%",
    },
    {
      driverId: "DRV-006",
      driverName: "Youssef Saeed",
      vehicleType: "truck-7.5",
      vehicleTypeLabel: "Truck - 7.5 Ton",
      totalTrips: 92,
      completedTrips: 90,
      completionRate: "97.8%",
      totalRevenue: "AED 71,500",
      avgRevPerTrip: "AED 794",
      totalDistance: "4,280 km",
      avgRating: "4.7",
      onTimeDeliveries: 87,
      onTimeRate: "96.7%",
      slaCompliance: "96.1%",
    },
    {
      driverId: "DRV-007",
      driverName: "Ibrahim Fahad",
      vehicleType: "van-3.5",
      vehicleTypeLabel: "Van - 3.5 Ton",
      totalTrips: 87,
      completedTrips: 84,
      completionRate: "96.6%",
      totalRevenue: "AED 59,800",
      avgRevPerTrip: "AED 712",
      totalDistance: "3,150 km",
      avgRating: "4.5",
      onTimeDeliveries: 80,
      onTimeRate: "95.2%",
      slaCompliance: "94.3%",
    },
    {
      driverId: "DRV-008",
      driverName: "Ali Jassim",
      vehicleType: "truck-10",
      vehicleTypeLabel: "Truck - 10 Ton",
      totalTrips: 79,
      completedTrips: 78,
      completionRate: "98.7%",
      totalRevenue: "AED 82,100",
      avgRevPerTrip: "AED 1,053",
      totalDistance: "4,820 km",
      avgRating: "4.9",
      onTimeDeliveries: 76,
      onTimeRate: "97.4%",
      slaCompliance: "97.6%",
    },
  ];

  const stats = [
    {
      label: "Active Drivers",
      value: 89,
      icon: "Users",
      subtitle: "+5 new this period",
    },
    {
      label: "Avg Completion Rate",
      value: "97.5%",
      icon: "CheckCircle",
      subtitle: "+0.8% improvement",
    },
    {
      label: "Avg On-Time Rate",
      value: "96.7%",
      icon: "Clock",
      subtitle: "+1.2% improvement",
    },
    {
      label: "Avg Rating",
      value: "4.7",
      icon: "Star",
      subtitle: "+0.1 improvement",
    },
  ];

  const filterOptions = {
    'Vehicle Type': ['Van - 3.5 Ton', 'Truck - 7.5 Ton', 'Truck - 10 Ton'],
    'Date Range': ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'],
  };

  const filteredData = reportData.filter(item => {
    const matchesSearch = searchQuery === "" ||
      item.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.driverId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = filters.every(filter => {
      if (filter.values.length === 0) return true;

      if (filter.field === 'Vehicle Type') {
        return filter.values.includes(item.vehicleTypeLabel);
      }
      // Add more filter conditions here as needed for other fields like 'Date Range'
      return true;
    });

    return matchesSearch && matchesFilters;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Driver Performance Reports"
          subtitle="Driver productivity, efficiency and safety metrics"
          breadcrumbs={[
            { label: "Reports", href: "#" },
            { label: "Driver Performance", current: true },
          ]}
          moreMenu={{
            exportOptions: {
              onExportCSV: () => toast.success("Exporting as CSV..."),
              onExportExcel: () => toast.success("Exporting as Excel..."),
              onExportPDF: () => toast.success("Exporting as PDF..."),
            },
            onPrint: () => window.print(),
          }}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search drivers..."
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
            active={showSummary}
            title="Toggle summary"
          />
          <IconButton
            icon={RefreshCw}
            onClick={() => toast.success("Refreshed")}
            title="Refresh"
          />
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
            onClearAll={() => setFilters([])}
          />
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && (
          <SummaryWidgets widgets={stats} />
        )}

        {/* ========== TABULAR REPORT ========== */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Driver ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Driver Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Vehicle Type
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Total Trips
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Avg Rev/Trip
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    On-Time Rate
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    SLA Compliance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((row) => (
                  <tr
                    key={row.driverId}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400">
                      {row.driverId}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {row.driverName}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                      {row.vehicleTypeLabel}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-neutral-700 dark:text-neutral-300">
                      {row.totalTrips}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-success-600 dark:text-success-400 font-medium">
                      {row.completedTrips}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-neutral-700 dark:text-neutral-300 font-medium">
                      {row.completionRate}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-primary-600 dark:text-primary-400 font-semibold">
                      {row.totalRevenue}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-neutral-700 dark:text-neutral-300">
                      {row.avgRevPerTrip}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-neutral-700 dark:text-neutral-300">
                      {row.totalDistance}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-warning-600 dark:text-warning-400 font-medium">
                      ⭐ {row.avgRating}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-success-600 dark:text-success-400 font-medium">
                      {row.onTimeRate}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-success-600 dark:text-success-400 font-medium">
                      {row.slaCompliance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== PAGINATION ========== */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        />
      </div>
    </div>
  );
}
