import { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Building2,
  Globe,
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
  Map,
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
} from '../components/hb/common/Form';
import { SecondaryButton } from '../components/hb/listing';

// Location data interface
interface Location {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  type: 'emirate' | 'city' | 'area' | 'zone';
  country: string;
  emirate: string;
  city?: string;
  parentLocation?: string;
  latitude?: string;
  longitude?: string;
  postalCode?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  status: 'active' | 'inactive';
  createdDate: string;
}

// Mock data
const mockLocations: Location[] = [
  {
    id: '1',
    code: 'DXB',
    name: 'Dubai',
    nameArabic: 'دبي',
    type: 'emirate',
    country: 'United Arab Emirates',
    emirate: 'Dubai',
    latitude: '25.2048',
    longitude: '55.2708',
    contactPerson: 'Ahmed Al Maktoum',
    contactPhone: '+971 4 123 4567',
    contactEmail: 'dubai@zajel.ae',
    status: 'active',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    code: 'AUH',
    name: 'Abu Dhabi',
    nameArabic: 'أبو ظبي',
    type: 'emirate',
    country: 'United Arab Emirates',
    emirate: 'Abu Dhabi',
    latitude: '24.4539',
    longitude: '54.3773',
    contactPerson: 'Mohammed Al Nahyan',
    contactPhone: '+971 2 234 5678',
    contactEmail: 'abudhabi@zajel.ae',
    status: 'active',
    createdDate: '2024-01-15',
  },
  {
    id: '3',
    code: 'SHJ',
    name: 'Sharjah',
    nameArabic: 'الشارقة',
    type: 'emirate',
    country: 'United Arab Emirates',
    emirate: 'Sharjah',
    latitude: '25.3463',
    longitude: '55.4209',
    contactPerson: 'Fatima Al Qasimi',
    contactPhone: '+971 6 345 6789',
    contactEmail: 'sharjah@zajel.ae',
    status: 'active',
    createdDate: '2024-01-15',
  },
  {
    id: '4',
    code: 'DXB-JLT',
    name: 'Jumeirah Lake Towers',
    nameArabic: 'أبراج بحيرات الجميرا',
    type: 'area',
    country: 'United Arab Emirates',
    emirate: 'Dubai',
    city: 'Dubai',
    parentLocation: 'Dubai',
    latitude: '25.0713',
    longitude: '55.1406',
    status: 'active',
    createdDate: '2024-01-20',
  },
  {
    id: '5',
    code: 'DXB-DM',
    name: 'Dubai Marina',
    nameArabic: 'مرسى دبي',
    type: 'area',
    country: 'United Arab Emirates',
    emirate: 'Dubai',
    city: 'Dubai',
    parentLocation: 'Dubai',
    latitude: '25.0801',
    longitude: '55.1396',
    status: 'active',
    createdDate: '2024-01-20',
  },
  {
    id: '6',
    code: 'AJM',
    name: 'Ajman',
    nameArabic: 'عجمان',
    type: 'emirate',
    country: 'United Arab Emirates',
    emirate: 'Ajman',
    latitude: '25.4052',
    longitude: '55.5136',
    contactPerson: 'Hassan Al Nuaimi',
    contactPhone: '+971 6 456 7890',
    contactEmail: 'ajman@zajel.ae',
    status: 'active',
    createdDate: '2024-01-15',
  },
  {
    id: '7',
    code: 'RAK',
    name: 'Ras Al Khaimah',
    nameArabic: 'رأس الخيمة',
    type: 'emirate',
    country: 'United Arab Emirates',
    emirate: 'Ras Al Khaimah',
    latitude: '25.7896',
    longitude: '55.9433',
    contactPerson: 'Sara Al Qasimi',
    contactPhone: '+971 7 567 8901',
    contactEmail: 'rak@zajel.ae',
    status: 'inactive',
    createdDate: '2024-01-15',
  },
  {
    id: '8',
    code: 'FUJ',
    name: 'Fujairah',
    nameArabic: 'الفجيرة',
    type: 'emirate',
    country: 'United Arab Emirates',
    emirate: 'Fujairah',
    latitude: '25.1288',
    longitude: '56.3265',
    contactPerson: 'Omar Al Sharqi',
    contactPhone: '+971 9 678 9012',
    contactEmail: 'fujairah@zajel.ae',
    status: 'active',
    createdDate: '2024-01-15',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function LocationMaster() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
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
    'Type': ['Emirate', 'City', 'Area', 'Zone'],
    'Emirate': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Location>>({
    code: '',
    name: '',
    nameArabic: '',
    type: 'city',
    country: 'United Arab Emirates',
    emirate: '',
    city: '',
    parentLocation: '',
    latitude: '',
    longitude: '',
    postalCode: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    status: 'active',
  });

  // Filter locations
  const filteredLocations = mockLocations.filter(loc => {
    const matchesSearch = searchQuery === '' ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.nameArabic.includes(searchQuery) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply advanced filters
    const matchesFilters = filters.every(filter => {
      if (filter.field === 'Status') {
        return filter.values.some(v => {
          const statusMap: Record<string, string> = {
            'Active': 'active',
            'Inactive': 'inactive'
          };
          return statusMap[v] === loc.status;
        });
      } else if (filter.field === 'Type') {
        return filter.values.some(v => v.toLowerCase() === loc.type);
      } else if (filter.field === 'Emirate') {
        return filter.values.includes(loc.emirate);
      }
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

  // Calculate paginated data
  const paginatedLocations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLocations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLocations, currentPage, itemsPerPage]);

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

  // Type badge helper
  const getTypeBadge = (type: string) => {
    const typeConfig = {
      emirate: { color: 'bg-primary-500', label: 'Emirate' },
      city: { color: 'bg-info-500', label: 'City' },
      area: { color: 'bg-warning-500', label: 'Area' },
      zone: { color: 'bg-neutral-500', label: 'Zone' },
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  // Handle actions
  const handleView = (location: Location) => {
    setSelectedLocation(location);
    // Navigate to detail view or open modal
    console.log('View location:', location);
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setFormData(location);
    setShowEditModal(true);
  };

  const handleDelete = (location: Location) => {
    if (confirm(`Are you sure you want to delete ${location.name}?`)) {
      console.log('Delete location:', location.id);
    }
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      nameArabic: '',
      type: 'city',
      country: 'United Arab Emirates',
      emirate: '',
      city: '',
      parentLocation: '',
      latitude: '',
      longitude: '',
      postalCode: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      status: 'active',
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
          title="Location Master"
          breadcrumbs={[
            { label: 'Master Data', href: '#' },
            { label: 'Location Master', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search locations..."
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
            Add Location
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
                label: 'Total Locations',
                value: mockLocations.length.toString(),
                trend: '+8%',
                trendDirection: 'up',
              },
              {
                label: 'Active',
                value: mockLocations.filter(l => l.status === 'active').length.toString(),
                trend: '+5%',
                trendDirection: 'up',
              },
              {
                label: 'Emirates',
                value: mockLocations.filter(l => l.type === 'emirate').length.toString(),
                trend: '0%',
                trendDirection: 'neutral',
              },
              {
                label: 'Inactive',
                value: mockLocations.filter(l => l.status === 'inactive').length.toString(),
                trend: '-2%',
                trendDirection: 'down',
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
            {paginatedLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => handleView(location)}>
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-900 dark:text-white font-medium">
                          {location.name}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {location.nameArabic}
                        </span>
                        {getStatusBadge(location.status)}
                        {getTypeBadge(location.type)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{location.code}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{location.emirate}</span>
                        </span>
                        {location.contactPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{location.contactPhone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === location.id ? null : location.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === location.id && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(location);
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
                            handleEdit(location);
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
                            console.log('View on Map');
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <Map className="w-4 h-4" />
                          View on Map
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(location);
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
            {paginatedLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer relative"
                onClick={() => handleView(location)}
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenuId(openActionMenuId === location.id ? null : location.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openActionMenuId === location.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(location);
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
                          console.log('View on Map');
                          setOpenActionMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                      >
                        <Map className="w-4 h-4" />
                        View on Map
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(location);
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
                    <MapPin className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-white font-medium mb-1">
                    {location.name}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {location.nameArabic}
                  </p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(location.status)}
                    {getTypeBadge(location.type)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{location.code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{location.emirate}</span>
                  </div>
                  {location.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{location.contactPhone}</span>
                    </div>
                  )}
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
                    Name (Arabic)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Emirate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Contact
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
                {paginatedLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                      {location.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                      {location.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {location.nameArabic}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getTypeBadge(location.type)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {location.emirate}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {location.contactPhone || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(location.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === location.id ? null : location.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === location.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => {
                                handleView(location);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(location);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(location);
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
          totalPages={Math.ceil(filteredLocations.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={filteredLocations.length}
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
        title={showEditModal ? 'Edit Location' : 'Add New Location'}
        description={showEditModal ? 'Update location information' : 'Enter location details to add to the system'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>Location Code</FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  placeholder="e.g., DXB"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="type" required>Location Type</FormLabel>
                <FormSelect
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  required
                >
                  <option value="emirate">Emirate</option>
                  <option value="city">City</option>
                  <option value="area">Area</option>
                  <option value="zone">Zone</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="name" required>Location Name (English)</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter location name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="nameArabic" required>Location Name (Arabic)</FormLabel>
                <FormInput
                  id="nameArabic"
                  type="text"
                  placeholder="أدخل اسم الموقع"
                  value={formData.nameArabic}
                  onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                  required
                  dir="rtl"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="country" required>Country</FormLabel>
                <FormInput
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="emirate" required>Emirate</FormLabel>
                <FormSelect
                  id="emirate"
                  value={formData.emirate}
                  onChange={(e) => setFormData({ ...formData, emirate: e.target.value })}
                  required
                >
                  <option value="">Select emirate</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Fujairah">Fujairah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="city">City</FormLabel>
                <FormInput
                  id="city"
                  type="text"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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

          <FormSection title="Coordinates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField>
                <FormLabel htmlFor="latitude">Latitude</FormLabel>
                <FormInput
                  id="latitude"
                  type="text"
                  placeholder="25.2048"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="longitude">Longitude</FormLabel>
                <FormInput
                  id="longitude"
                  type="text"
                  placeholder="55.2708"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                <FormInput
                  id="postalCode"
                  type="text"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField>
                <FormLabel htmlFor="contactPerson">Contact Person</FormLabel>
                <FormInput
                  id="contactPerson"
                  type="text"
                  placeholder="Enter contact name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="contactPhone">Contact Phone</FormLabel>
                <FormInput
                  id="contactPhone"
                  type="tel"
                  placeholder="+971 4 123 4567"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="contactEmail">Contact Email</FormLabel>
                <FormInput
                  id="contactEmail"
                  type="email"
                  placeholder="location@zajel.ae"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </FormField>
            </div>
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
              {showEditModal ? 'Update Location' : 'Add Location'}
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}