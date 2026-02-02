import { useState, useMemo, useEffect } from 'react';
import {
  Package,
  MoreVertical,
  Plus,
  BarChart3,
  RefreshCw,
  Printer,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  Thermometer,
  ShieldAlert,
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

// Cargo Type data interface
interface CargoType {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  category: 'general' | 'fragile' | 'hazardous' | 'perishable' | 'heavy' | 'oversized';
  handlingInstructions: string;
  packagingRequirements?: string;
  temperatureControl: 'required' | 'not-required';
  temperatureRange?: string;
  specialPermits: 'required' | 'not-required';
  insuranceRequired: 'yes' | 'no';
  additionalCharge: string;
  maxWeight?: string;
  status: 'active' | 'inactive';
  description?: string;
  createdDate: string;
}

// Mock data
const mockCargoTypes: CargoType[] = [
  {
    id: '1',
    code: 'CRG-GEN',
    name: 'General Cargo',
    nameArabic: 'بضائع عامة',
    category: 'general',
    handlingInstructions: 'Standard handling procedures',
    packagingRequirements: 'Standard packaging',
    temperatureControl: 'not-required',
    specialPermits: 'not-required',
    insuranceRequired: 'no',
    additionalCharge: 'AED 0',
    status: 'active',
    description: 'Standard non-hazardous cargo',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    code: 'CRG-FRAG',
    name: 'Fragile Items',
    nameArabic: 'أغراض قابلة للكسر',
    category: 'fragile',
    handlingInstructions: 'Handle with extreme care. No stacking.',
    packagingRequirements: 'Double-walled boxes with cushioning',
    temperatureControl: 'not-required',
    specialPermits: 'not-required',
    insuranceRequired: 'yes',
    additionalCharge: 'AED 50',
    maxWeight: '500 kg',
    status: 'active',
    description: 'Breakable and delicate items',
    createdDate: '2024-01-15',
  },
  {
    id: '3',
    code: 'CRG-HAZ',
    name: 'Hazardous Materials',
    nameArabic: 'مواد خطرة',
    category: 'hazardous',
    handlingInstructions: 'Follow IATA dangerous goods regulations',
    packagingRequirements: 'UN-certified hazmat packaging',
    temperatureControl: 'not-required',
    specialPermits: 'required',
    insuranceRequired: 'yes',
    additionalCharge: 'AED 200',
    status: 'active',
    description: 'Flammable, corrosive, or toxic materials',
    createdDate: '2024-01-16',
  },
  {
    id: '4',
    code: 'CRG-PRSH',
    name: 'Perishable Goods',
    nameArabic: 'سلع قابلة للتلف',
    category: 'perishable',
    handlingInstructions: 'Maintain cold chain. Quick delivery required.',
    packagingRequirements: 'Insulated containers',
    temperatureControl: 'required',
    temperatureRange: '2°C to 8°C',
    specialPermits: 'not-required',
    insuranceRequired: 'yes',
    additionalCharge: 'AED 150',
    status: 'active',
    description: 'Food, medicine, and temperature-sensitive items',
    createdDate: '2024-01-17',
  },
  {
    id: '5',
    code: 'CRG-HVY',
    name: 'Heavy Cargo',
    nameArabic: 'بضائع ثقيلة',
    category: 'heavy',
    handlingInstructions: 'Use forklift or crane. Check load capacity.',
    packagingRequirements: 'Reinforced pallets',
    temperatureControl: 'not-required',
    specialPermits: 'not-required',
    insuranceRequired: 'yes',
    additionalCharge: 'AED 100',
    maxWeight: '5000 kg',
    status: 'active',
    description: 'Machinery and heavy equipment',
    createdDate: '2024-01-18',
  },
  {
    id: '6',
    code: 'CRG-OVER',
    name: 'Oversized Cargo',
    nameArabic: 'بضائع ضخمة',
    category: 'oversized',
    handlingInstructions: 'Requires special vehicle and route planning',
    packagingRequirements: 'Custom crating',
    temperatureControl: 'not-required',
    specialPermits: 'required',
    insuranceRequired: 'yes',
    additionalCharge: 'AED 300',
    status: 'inactive',
    description: 'Items exceeding standard dimensions',
    createdDate: '2024-01-19',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function CargoTypeMaster() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<CargoType | null>(null);

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
    'Category': ['General', 'Fragile', 'Hazardous', 'Perishable', 'Heavy', 'Oversized'],
    'Temperature Control': ['Required', 'Not Required'],
    'Special Permits': ['Required', 'Not Required'],
  };

  // Form state
  const [formData, setFormData] = useState<Partial<CargoType>>({
    code: '',
    name: '',
    nameArabic: '',
    category: 'general',
    handlingInstructions: '',
    packagingRequirements: '',
    temperatureControl: 'not-required',
    temperatureRange: '',
    specialPermits: 'not-required',
    insuranceRequired: 'no',
    additionalCharge: '',
    maxWeight: '',
    status: 'active',
    description: '',
  });

  // Filter cargo types
  const filteredCargoTypes = mockCargoTypes.filter(cargo => {
    const matchesSearch = searchQuery === '' ||
      cargo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cargo.nameArabic.includes(searchQuery) ||
      cargo.code.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply advanced filters
    const matchesFilters = filters.every(filter => {
      if (filter.field === 'Status') {
        return filter.values.some(v => {
          const statusMap: Record<string, string> = {
            'Active': 'active',
            'Inactive': 'inactive'
          };
          return statusMap[v] === cargo.status;
        });
      } else if (filter.field === 'Category') {
        return filter.values.some(v => v.toLowerCase() === cargo.category);
      } else if (filter.field === 'Temperature Control') {
        return filter.values.some(v => {
          const tempMap: Record<string, string> = {
            'Required': 'required',
            'Not Required': 'not-required'
          };
          return tempMap[v] === cargo.temperatureControl;
        });
      } else if (filter.field === 'Special Permits') {
        return filter.values.some(v => {
          const permitMap: Record<string, string> = {
            'Required': 'required',
            'Not Required': 'not-required'
          };
          return permitMap[v] === cargo.specialPermits;
        });
      }
      return true;
    });

    return matchesSearch && matchesFilters;
  });

  // Calculate paginated data
  const paginatedCargoTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCargoTypes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCargoTypes, currentPage, itemsPerPage]);

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
      general: { color: 'bg-neutral-500', label: 'General' },
      fragile: { color: 'bg-warning-500', label: 'Fragile' },
      hazardous: { color: 'bg-error-500', label: 'Hazardous' },
      perishable: { color: 'bg-info-500', label: 'Perishable' },
      heavy: { color: 'bg-primary-500', label: 'Heavy' },
      oversized: { color: 'bg-purple-500', label: 'Oversized' },
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
  const handleView = (cargo: CargoType) => {
    setSelectedCargo(cargo);
    console.log('View cargo:', cargo);
  };

  const handleEdit = (cargo: CargoType) => {
    setSelectedCargo(cargo);
    setFormData(cargo);
    setShowEditModal(true);
  };

  const handleDelete = (cargo: CargoType) => {
    if (confirm(`Are you sure you want to delete ${cargo.name}?`)) {
      console.log('Delete cargo:', cargo.id);
    }
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      nameArabic: '',
      category: 'general',
      handlingInstructions: '',
      packagingRequirements: '',
      temperatureControl: 'not-required',
      temperatureRange: '',
      specialPermits: 'not-required',
      insuranceRequired: 'no',
      additionalCharge: '',
      maxWeight: '',
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
          title="Cargo Type Master"
          breadcrumbs={[
            { label: 'Master Data', href: '#' },
            { label: 'Cargo Type Master', current: true },
          ]}
          moreMenu={{
          }}
        >
          <PrimaryButton icon={Plus} onClick={handleAdd}>
            Add Cargo Type
          </PrimaryButton>

          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search cargo types..."
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
            />
          </div>

          <IconButton icon={BarChart3} onClick={() => setShowSummary(!showSummary)} active={showSummary} />

          <IconButton icon={RefreshCw} onClick={() => { }} />



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
                label: 'Total Cargo Types',
                value: mockCargoTypes.length.toString(),
                trend: '+6%',
                trendDirection: 'up',
              },
              {
                label: 'Active',
                value: mockCargoTypes.filter(c => c.status === 'active').length.toString(),
                trend: '+4%',
                trendDirection: 'up',
              },
              {
                label: 'Requires Permits',
                value: mockCargoTypes.filter(c => c.specialPermits === 'required').length.toString(),
                trend: '0%',
                trendDirection: 'neutral',
              },
              {
                label: 'Temperature Control',
                value: mockCargoTypes.filter(c => c.temperatureControl === 'required').length.toString(),
                trend: '+2%',
                trendDirection: 'up',
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
            {paginatedCargoTypes.map((cargo) => (
              <div
                key={cargo.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => handleView(cargo)}>
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-900 dark:text-white font-medium">
                          {cargo.name}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {cargo.nameArabic}
                        </span>
                        {getStatusBadge(cargo.status)}
                        {getCategoryBadge(cargo.category)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>{cargo.code}</span>
                        {cargo.temperatureControl === 'required' && (
                          <span className="flex items-center gap-1">
                            <Thermometer className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Temp Control</span>
                          </span>
                        )}
                        {cargo.specialPermits === 'required' && (
                          <span className="flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Permits Required</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === cargo.id ? null : cargo.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === cargo.id && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(cargo);
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
                            handleEdit(cargo);
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
                            handleDelete(cargo);
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
            {paginatedCargoTypes.map((cargo) => (
              <div
                key={cargo.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer relative"
                onClick={() => handleView(cargo)}
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenuId(openActionMenuId === cargo.id ? null : cargo.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openActionMenuId === cargo.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(cargo);
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
                          handleDelete(cargo);
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
                    <Package className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-white font-medium mb-1">
                    {cargo.name}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {cargo.nameArabic}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(cargo.status)}
                    {getCategoryBadge(cargo.category)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Code:</span>
                    <span className="font-medium">{cargo.code}</span>
                  </div>
                  {cargo.temperatureControl === 'required' && (
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 flex-shrink-0 text-info-500" />
                      <span className="text-xs">{cargo.temperatureRange}</span>
                    </div>
                  )}
                  {cargo.specialPermits === 'required' && (
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0 text-warning-500" />
                      <span className="text-xs">Special Permits Required</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Additional Charge</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{cargo.additionalCharge}</span>
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
                    Requirements
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Add. Charge
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
                {paginatedCargoTypes.map((cargo) => (
                  <tr key={cargo.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                      {cargo.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                      {cargo.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getCategoryBadge(cargo.category)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {cargo.temperatureControl === 'required' && (
                          <Thermometer className="w-4 h-4 text-info-500" />
                        )}
                        {cargo.specialPermits === 'required' && (
                          <ShieldAlert className="w-4 h-4 text-warning-500" />
                        )}
                        {cargo.insuranceRequired === 'yes' && (
                          <AlertTriangle className="w-4 h-4 text-error-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {cargo.additionalCharge}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(cargo.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === cargo.id ? null : cargo.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === cargo.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => {
                                handleView(cargo);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(cargo);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(cargo);
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
          totalPages={Math.ceil(filteredCargoTypes.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={filteredCargoTypes.length}
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
        title={showEditModal ? 'Edit Cargo Type' : 'Add New Cargo Type'}
        description={showEditModal ? 'Update cargo type information' : 'Enter cargo type details to add to the system'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>Cargo Code</FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  placeholder="e.g., CRG-GEN"
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
                  <option value="general">General</option>
                  <option value="fragile">Fragile</option>
                  <option value="hazardous">Hazardous</option>
                  <option value="perishable">Perishable</option>
                  <option value="heavy">Heavy</option>
                  <option value="oversized">Oversized</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="name" required>Cargo Name (English)</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter cargo name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="nameArabic" required>Cargo Name (Arabic)</FormLabel>
                <FormInput
                  id="nameArabic"
                  type="text"
                  placeholder="أدخل اسم البضاعة"
                  value={formData.nameArabic}
                  onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                  required
                  dir="rtl"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="additionalCharge" required>Additional Charge</FormLabel>
                <FormInput
                  id="additionalCharge"
                  type="text"
                  placeholder="e.g., AED 50"
                  value={formData.additionalCharge}
                  onChange={(e) => setFormData({ ...formData, additionalCharge: e.target.value })}
                  required
                />
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

          <FormSection title="Handling Requirements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField className="md:col-span-2">
                <FormLabel htmlFor="handlingInstructions" required>Handling Instructions</FormLabel>
                <FormTextarea
                  id="handlingInstructions"
                  placeholder="Enter handling instructions..."
                  value={formData.handlingInstructions}
                  onChange={(e) => setFormData({ ...formData, handlingInstructions: e.target.value })}
                  rows={2}
                  required
                />
              </FormField>

              <FormField className="md:col-span-2">
                <FormLabel htmlFor="packagingRequirements">Packaging Requirements</FormLabel>
                <FormTextarea
                  id="packagingRequirements"
                  placeholder="Enter packaging requirements..."
                  value={formData.packagingRequirements}
                  onChange={(e) => setFormData({ ...formData, packagingRequirements: e.target.value })}
                  rows={2}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="temperatureControl" required>Temperature Control</FormLabel>
                <FormSelect
                  id="temperatureControl"
                  value={formData.temperatureControl}
                  onChange={(e) => setFormData({ ...formData, temperatureControl: e.target.value as any })}
                  required
                >
                  <option value="not-required">Not Required</option>
                  <option value="required">Required</option>
                </FormSelect>
              </FormField>

              {formData.temperatureControl === 'required' && (
                <FormField>
                  <FormLabel htmlFor="temperatureRange">Temperature Range</FormLabel>
                  <FormInput
                    id="temperatureRange"
                    type="text"
                    placeholder="e.g., 2°C to 8°C"
                    value={formData.temperatureRange}
                    onChange={(e) => setFormData({ ...formData, temperatureRange: e.target.value })}
                  />
                </FormField>
              )}

              <FormField>
                <FormLabel htmlFor="specialPermits" required>Special Permits</FormLabel>
                <FormSelect
                  id="specialPermits"
                  value={formData.specialPermits}
                  onChange={(e) => setFormData({ ...formData, specialPermits: e.target.value as any })}
                  required
                >
                  <option value="not-required">Not Required</option>
                  <option value="required">Required</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="insuranceRequired" required>Insurance Required</FormLabel>
                <FormSelect
                  id="insuranceRequired"
                  value={formData.insuranceRequired}
                  onChange={(e) => setFormData({ ...formData, insuranceRequired: e.target.value as any })}
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="maxWeight">Max Weight (Optional)</FormLabel>
                <FormInput
                  id="maxWeight"
                  type="text"
                  placeholder="e.g., 500 kg"
                  value={formData.maxWeight}
                  onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Additional Details">
            <FormField>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormTextarea
                id="description"
                placeholder="Enter cargo type description..."
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
              {showEditModal ? 'Update Cargo Type' : 'Add Cargo Type'}
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}
