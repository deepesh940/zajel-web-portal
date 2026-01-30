import { useState, useMemo, useEffect } from 'react';
import {
  Truck,
  MoreVertical,
  Plus,
  BarChart3,
  RefreshCw,
  Upload,
  Download,
  Printer,
  Eye,
  Edit2,
  Trash2,
  Package,
  Gauge,
  Weight,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SummaryWidgets, ViewModeSwitcher, AdvancedSearchPanel, FilterChips, SearchBar, Pagination } from '../components/hb/listing';
import type { FilterCondition } from '../components/hb/listing';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
  FormSelect,
  FormTextarea,
} from '../components/hb/common/Form';
import { SecondaryButton } from '../components/hb/listing';

// Vehicle Type data interface
interface VehicleType {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  category: 'truck' | 'van' | 'pickup' | 'trailer' | 'refrigerated';
  capacity: string;
  weightLimit: string;
  dimensions: string;
  fuelType: 'diesel' | 'petrol' | 'electric' | 'hybrid';
  features: string[];
  baseRate: string;
  perKmRate: string;
  status: 'active' | 'inactive';
  description?: string;
  createdDate: string;
}

// Mock data
const mockVehicleTypes: VehicleType[] = [
  {
    id: '1',
    code: 'TRK-10T',
    name: '10 Ton Truck',
    nameArabic: 'شاحنة ٠٠ طن',
    category: 'truck',
    capacity: '10 Tons',
    weightLimit: '10,000 kg',
    dimensions: '6.0m × 2.4m × 2.4m',
    fuelType: 'diesel',
    features: ['GPS Tracking', 'Air Conditioning', 'Hydraulic Lift'],
    baseRate: 'AED 500',
    perKmRate: 'AED 3.5',
    status: 'active',
    description: 'Standard 10-ton truck for general cargo',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    code: 'VAN-3T',
    name: '3 Ton Van',
    nameArabic: 'شاحنة صغيرة ٣ طن',
    category: 'van',
    capacity: '3 Tons',
    weightLimit: '3,000 kg',
    dimensions: '4.2m × 1.8m × 1.9m',
    fuelType: 'diesel',
    features: ['GPS Tracking', 'Air Conditioning'],
    baseRate: 'AED 250',
    perKmRate: 'AED 2.0',
    status: 'active',
    description: 'Compact van for small deliveries',
    createdDate: '2024-01-15',
  },
  {
    id: '3',
    code: 'PKP-1T',
    name: '1 Ton Pickup',
    nameArabic: 'بيك آب ٢ طن',
    category: 'pickup',
    capacity: '1 Ton',
    weightLimit: '1,000 kg',
    dimensions: '2.4m × 1.6m × 0.5m',
    fuelType: 'petrol',
    features: ['GPS Tracking'],
    baseRate: 'AED 150',
    perKmRate: 'AED 1.5',
    status: 'active',
    description: 'Light pickup for small items',
    createdDate: '2024-01-20',
  },
  {
    id: '4',
    code: 'REF-5T',
    name: '5 Ton Refrigerated',
    nameArabic: 'شاحنة مبردة ٥ طن',
    category: 'refrigerated',
    capacity: '5 Tons',
    weightLimit: '5,000 kg',
    dimensions: '5.0m × 2.2m × 2.2m',
    fuelType: 'diesel',
    features: ['GPS Tracking', 'Temperature Control', 'Dual Zone Cooling'],
    baseRate: 'AED 650',
    perKmRate: 'AED 4.5',
    status: 'active',
    description: 'Temperature-controlled truck for perishables',
    createdDate: '2024-01-18',
  },
  {
    id: '5',
    code: 'TRL-20T',
    name: '20 Ton Trailer',
    nameArabic: 'مقطورة ٢٠ طن',
    category: 'trailer',
    capacity: '20 Tons',
    weightLimit: '20,000 kg',
    dimensions: '12.0m × 2.4m × 2.6m',
    fuelType: 'diesel',
    features: ['GPS Tracking', 'Air Suspension', 'Container Lock'],
    baseRate: 'AED 1200',
    perKmRate: 'AED 6.0',
    status: 'active',
    description: 'Heavy-duty trailer for large shipments',
    createdDate: '2024-01-10',
  },
  {
    id: '6',
    code: 'VAN-1.5T',
    name: '1.5 Ton Van',
    nameArabic: 'شاحنة صغيرة ٢.٥ طن',
    category: 'van',
    capacity: '1.5 Tons',
    weightLimit: '1,500 kg',
    dimensions: '3.5m × 1.7m × 1.8m',
    fuelType: 'diesel',
    features: ['GPS Tracking'],
    baseRate: 'AED 200',
    perKmRate: 'AED 1.8',
    status: 'inactive',
    description: 'Small van for urban deliveries',
    createdDate: '2024-01-12',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function VehicleTypeMaster() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Action menu state
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Summary widgets toggle state (default closed)
  const [showSummary, setShowSummary] = useState(false);

  // Filter options for the AdvancedSearchPanel
  const filterOptions = {
    'Status': ['Active', 'Inactive'],
    'Category': ['Truck', 'Van', 'Pickup', 'Trailer', 'Refrigerated'],
    'Fuel Type': ['Diesel', 'Petrol', 'Electric', 'Hybrid'],
  };

  // Form state
  const [formData, setFormData] = useState<Partial<VehicleType>>({
    code: '',
    name: '',
    nameArabic: '',
    category: 'truck',
    capacity: '',
    weightLimit: '',
    dimensions: '',
    fuelType: 'diesel',
    features: [],
    baseRate: '',
    perKmRate: '',
    status: 'active',
    description: '',
  });

  // Filter vehicles
  const filteredVehicles = mockVehicleTypes.filter(vehicle => {
    const matchesSearch = searchQuery === '' ||
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.nameArabic.includes(searchQuery) ||
      vehicle.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply advanced filters
    const matchesFilters = filters.every(filter => {
      if (filter.field === 'Status') {
        return filter.values.some(v => {
          const statusMap: Record<string, string> = {
            'Active': 'active',
            'Inactive': 'inactive'
          };
          return statusMap[v] === vehicle.status;
        });
      } else if (filter.field === 'Category') {
        return filter.values.some(v => v.toLowerCase() === vehicle.category);
      } else if (filter.field === 'Fuel Type') {
        return filter.values.some(v => v.toLowerCase() === vehicle.fuelType);
      }
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

  // Calculate paginated data
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVehicles, currentPage, itemsPerPage]);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-success-500', label: 'Active' },
      inactive: { color: 'bg-error-500', label: 'Inactive' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  // Category badge helper
  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      truck: { color: 'bg-primary-500', label: 'Truck' },
      van: { color: 'bg-info-500', label: 'Van' },
      pickup: { color: 'bg-warning-500', label: 'Pickup' },
      trailer: { color: 'bg-neutral-500', label: 'Trailer' },
      refrigerated: { color: 'bg-success-500', label: 'Refrigerated' },
    };
    const config = categoryConfig[category as keyof typeof categoryConfig];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  // Handle actions
  const handleView = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    console.log('View vehicle:', vehicle);
  };

  const handleEdit = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    setFormData(vehicle);
    setShowEditModal(true);
  };

  const handleDelete = (vehicle: VehicleType) => {
    if (confirm(`Are you sure you want to delete ${vehicle.name}?`)) {
      console.log('Delete vehicle:', vehicle.id);
    }
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      nameArabic: '',
      category: 'truck',
      capacity: '',
      weightLimit: '',
      dimensions: '',
      fuelType: 'diesel',
      features: [],
      baseRate: '',
      perKmRate: '',
      status: 'active',
      description: '',
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  return (
    <div className="px-6 py-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Vehicle Type Master"
          breadcrumbs={[
            { label: 'Master Data', href: '#' },
            { label: 'Vehicle Types', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search vehicle types..."
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
            />
          </div>

          <PrimaryButton icon={Plus} onClick={handleAdd}>
            Add Vehicle Type
          </PrimaryButton>

          <IconButton icon={BarChart3} onClick={() => setShowSummary(!showSummary)} active={showSummary} />

          <IconButton icon={RefreshCw} onClick={() => {}} />

          <div className="relative">
            <IconButton 
              icon={MoreVertical} 
              onClick={() => setShowMoreDropdown(!showMoreDropdown)}
            />

            {showMoreDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                <button className="w-full px-4 py-2 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Import</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  <span className="text-sm">Print</span>
                </button>
              </div>
            )}
          </div>

          <ViewModeSwitcher 
            currentMode={viewMode}
            onChange={setViewMode}
          />
        </PageHeader>

        {/* ========== SUMMARY WIDGETS ========== */}
        {showSummary && (
          <SummaryWidgets
            widgets={[
              {
                label: 'Total Vehicle Types',
                value: mockVehicleTypes.length.toString(),
                trend: '+12%',
                trendDirection: 'up',
              },
              {
                label: 'Active',
                value: mockVehicleTypes.filter(v => v.status === 'active').length.toString(),
                trend: '+8%',
                trendDirection: 'up',
              },
              {
                label: 'Trucks',
                value: mockVehicleTypes.filter(v => v.category === 'truck').length.toString(),
                trend: '+5%',
                trendDirection: 'up',
              },
              {
                label: 'Inactive',
                value: mockVehicleTypes.filter(v => v.status === 'inactive').length.toString(),
                trend: '0%',
                trendDirection: 'neutral',
              },
            ]}
          />
        )}

        {/* ========== ACTIVE FILTER CHIPS ========== */}
        {filters.filter(f => f.values.length > 0).length > 0 && (
          <FilterChips
            filters={filters.filter(f => f.values.length > 0)}
            onRemove={(id) => setFilters(filters.filter(f => f.id !== id))}
            onClearAll={() => setFilters([])}
          />
        )}

        {/* ========== LIST VIEW ========== */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => handleView(vehicle)}>
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-900 dark:text-white font-medium">
                          {vehicle.name}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {vehicle.nameArabic}
                        </span>
                        {getStatusBadge(vehicle.status)}
                        {getCategoryBadge(vehicle.category)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{vehicle.capacity}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Weight className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{vehicle.weightLimit}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{vehicle.fuelType}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === vehicle.id ? null : vehicle.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === vehicle.id && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(vehicle);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(vehicle);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(vehicle);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========== GRID VIEW ========== */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer relative"
                onClick={() => handleView(vehicle)}
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenuId(openActionMenuId === vehicle.id ? null : vehicle.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openActionMenuId === vehicle.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(vehicle);
                          setOpenActionMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(vehicle);
                          setOpenActionMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center text-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center mb-3">
                    <Truck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-white font-medium mb-1">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {vehicle.nameArabic}
                  </p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(vehicle.status)}
                    {getCategoryBadge(vehicle.category)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4 flex-shrink-0" />
                      <span>Capacity</span>
                    </span>
                    <span className="font-medium">{vehicle.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Weight className="w-4 h-4 flex-shrink-0" />
                      <span>Weight Limit</span>
                    </span>
                    <span className="font-medium">{vehicle.weightLimit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-4 h-4 flex-shrink-0" />
                      <span>Fuel</span>
                    </span>
                    <span className="font-medium capitalize">{vehicle.fuelType}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Base Rate</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{vehicle.baseRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========== TABLE VIEW ========== */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Base Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                      {vehicle.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                      {vehicle.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getCategoryBadge(vehicle.category)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {vehicle.capacity}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                      {vehicle.fuelType}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {vehicle.baseRate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(vehicle.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === vehicle.id ? null : vehicle.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === vehicle.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => {
                                handleView(vehicle);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(vehicle);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(vehicle);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
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
        )}

        {/* ========== PAGINATION ========== */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredVehicles.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={filteredVehicles.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* ========== ADD/EDIT MODAL ========== */}
      <FormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        title={showEditModal ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}
        description={showEditModal ? 'Update vehicle type information' : 'Enter vehicle type details to add to the system'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>Vehicle Code</FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  placeholder="e.g., TRK-10T"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="category" required>Category</FormLabel>
                <FormSelect
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  required
                >
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="pickup">Pickup</option>
                  <option value="trailer">Trailer</option>
                  <option value="refrigerated">Refrigerated</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="name" required>Vehicle Name (English)</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter vehicle name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="nameArabic" required>Vehicle Name (Arabic)</FormLabel>
                <FormInput
                  id="nameArabic"
                  type="text"
                  placeholder="أدخل اسم المركبة"
                  value={formData.nameArabic}
                  onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                  required
                  dir="rtl"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="capacity" required>Capacity</FormLabel>
                <FormInput
                  id="capacity"
                  type="text"
                  placeholder="e.g., 10 Tons"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="weightLimit" required>Weight Limit</FormLabel>
                <FormInput
                  id="weightLimit"
                  type="text"
                  placeholder="e.g., 10,000 kg"
                  value={formData.weightLimit}
                  onChange={(e) => setFormData({ ...formData, weightLimit: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="dimensions" required>Dimensions (L × W × H)</FormLabel>
                <FormInput
                  id="dimensions"
                  type="text"
                  placeholder="e.g., 6.0m × 2.4m × 2.4m"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="fuelType" required>Fuel Type</FormLabel>
                <FormSelect
                  id="fuelType"
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
                  required
                >
                  <option value="diesel">Diesel</option>
                  <option value="petrol">Petrol</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="status" required>Status</FormLabel>
                <FormSelect
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Pricing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="baseRate" required>Base Rate</FormLabel>
                <FormInput
                  id="baseRate"
                  type="text"
                  placeholder="e.g., AED 500"
                  value={formData.baseRate}
                  onChange={(e) => setFormData({ ...formData, baseRate: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="perKmRate" required>Per KM Rate</FormLabel>
                <FormInput
                  id="perKmRate"
                  type="text"
                  placeholder="e.g., AED 3.5"
                  value={formData.perKmRate}
                  onChange={(e) => setFormData({ ...formData, perKmRate: e.target.value })}
                  required
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Additional Details">
            <FormField>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormTextarea
                id="description"
                placeholder="Enter vehicle description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </FormField>
          </FormSection>

          <FormFooter>
            <SecondaryButton
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit">
              {showEditModal ? 'Update Vehicle Type' : 'Add Vehicle Type'}
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}