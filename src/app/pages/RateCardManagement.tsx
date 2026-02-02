import { useState, useMemo, useEffect } from 'react';
import {
  DollarSign,
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
  MapPin,
  Truck,
  Copy,
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

interface RateCard {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  originEmirate: string;
  destinationEmirate: string;
  vehicleType: string;
  serviceType: 'standard' | 'express' | 'same-day' | 'economy';
  baseRate: string;
  perKmRate: string;
  minimumCharge: string;
  fuelSurcharge: string;
  tollCharges?: string;
  waitingCharges?: string;
  validFrom: string;
  validUntil: string;
  currency: 'AED' | 'USD' | 'EUR';
  status: 'active' | 'inactive' | 'draft';
  priority: number;
  description?: string;
  createdDate: string;
}

const mockRateCards: RateCard[] = [
  {
    id: '1',
    code: 'RC-DXB-AUH-TRK',
    name: 'Dubai to Abu Dhabi - Truck',
    nameArabic: 'دبي إلى أبو ظبي - شاحنة',
    originEmirate: 'Dubai',
    destinationEmirate: 'Abu Dhabi',
    vehicleType: '10 Ton Truck',
    serviceType: 'standard',
    baseRate: 'AED 800',
    perKmRate: 'AED 4.50',
    minimumCharge: 'AED 500',
    fuelSurcharge: '8%',
    tollCharges: 'AED 25',
    waitingCharges: 'AED 50/hour',
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    currency: 'AED',
    status: 'active',
    priority: 1,
    description: 'Standard rate for 10-ton truck from Dubai to Abu Dhabi',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    code: 'RC-DXB-SHJ-VAN',
    name: 'Dubai to Sharjah - Van',
    nameArabic: 'دبي إلى الشارقة - فان',
    originEmirate: 'Dubai',
    destinationEmirate: 'Sharjah',
    vehicleType: '3 Ton Van',
    serviceType: 'express',
    baseRate: 'AED 350',
    perKmRate: 'AED 2.50',
    minimumCharge: 'AED 200',
    fuelSurcharge: '6%',
    tollCharges: 'AED 10',
    waitingCharges: 'AED 40/hour',
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    currency: 'AED',
    status: 'active',
    priority: 2,
    description: 'Express delivery van service Dubai to Sharjah',
    createdDate: '2024-01-16',
  },
  {
    id: '3',
    code: 'RC-AUH-DXB-PKP',
    name: 'Abu Dhabi to Dubai - Pickup',
    nameArabic: 'أبو ظبي إلى دبي - بيك أب',
    originEmirate: 'Abu Dhabi',
    destinationEmirate: 'Dubai',
    vehicleType: '1 Ton Pickup',
    serviceType: 'same-day',
    baseRate: 'AED 250',
    perKmRate: 'AED 2.00',
    minimumCharge: 'AED 150',
    fuelSurcharge: '5%',
    tollCharges: 'AED 20',
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    currency: 'AED',
    status: 'active',
    priority: 3,
    description: 'Same-day pickup truck service',
    createdDate: '2024-01-17',
  },
  {
    id: '4',
    code: 'RC-DXB-RAK-TRL',
    name: 'Dubai to Ras Al Khaimah - Trailer',
    nameArabic: 'دبي إلى رأس الخيمة - مقطورة',
    originEmirate: 'Dubai',
    destinationEmirate: 'Ras Al Khaimah',
    vehicleType: '20 Ton Trailer',
    serviceType: 'standard',
    baseRate: 'AED 1500',
    perKmRate: 'AED 7.00',
    minimumCharge: 'AED 1000',
    fuelSurcharge: '10%',
    tollCharges: 'AED 40',
    waitingCharges: 'AED 100/hour',
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    currency: 'AED',
    status: 'active',
    priority: 1,
    description: 'Heavy-duty trailer for long distance',
    createdDate: '2024-01-18',
  },
  {
    id: '5',
    code: 'RC-SHJ-AJM-VAN',
    name: 'Sharjah to Ajman - Van',
    nameArabic: 'الشارقة إلى عجمان - فان',
    originEmirate: 'Sharjah',
    destinationEmirate: 'Ajman',
    vehicleType: '1.5 Ton Van',
    serviceType: 'economy',
    baseRate: 'AED 180',
    perKmRate: 'AED 1.50',
    minimumCharge: 'AED 120',
    fuelSurcharge: '4%',
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    currency: 'AED',
    status: 'draft',
    priority: 5,
    description: 'Economy service for short distance',
    createdDate: '2024-01-19',
  },
  {
    id: '6',
    code: 'RC-DXB-FUJ-REF',
    name: 'Dubai to Fujairah - Refrigerated',
    nameArabic: 'دبي إلى الفجيرة - مبرد',
    originEmirate: 'Dubai',
    destinationEmirate: 'Fujairah',
    vehicleType: '5 Ton Refrigerated',
    serviceType: 'express',
    baseRate: 'AED 1200',
    perKmRate: 'AED 5.50',
    minimumCharge: 'AED 800',
    fuelSurcharge: '12%',
    tollCharges: 'AED 35',
    waitingCharges: 'AED 80/hour',
    validFrom: '2024-06-01',
    validUntil: '2024-12-31',
    currency: 'AED',
    status: 'inactive',
    priority: 2,
    description: 'Temperature-controlled express delivery',
    createdDate: '2024-01-20',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function RateCardManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRateCard, setSelectedRateCard] = useState<RateCard | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const filterOptions = {
    'Status': ['Active', 'Inactive', 'Draft'],
    'Service Type': ['Standard', 'Express', 'Same Day', 'Economy'],
    'Origin': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'],
    'Destination': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'],
  };

  const [formData, setFormData] = useState<Partial<RateCard>>({
    code: '',
    name: '',
    nameArabic: '',
    originEmirate: '',
    destinationEmirate: '',
    vehicleType: '',
    serviceType: 'standard',
    baseRate: '',
    perKmRate: '',
    minimumCharge: '',
    fuelSurcharge: '',
    tollCharges: '',
    waitingCharges: '',
    validFrom: '',
    validUntil: '',
    currency: 'AED',
    status: 'draft',
    priority: 1,
    description: '',
  });

  const filteredRateCards = mockRateCards.filter(rc => {
    const matchesSearch = searchQuery === '' ||
      rc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rc.nameArabic.includes(searchQuery) ||
      rc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rc.originEmirate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rc.destinationEmirate.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = filters.every(filter => {
      if (filter.field === 'Status') {
        return filter.values.some(v => v.toLowerCase() === rc.status);
      } else if (filter.field === 'Service Type') {
        return filter.values.some(v => v.toLowerCase().replace(' ', '-') === rc.serviceType);
      } else if (filter.field === 'Origin') {
        return filter.values.includes(rc.originEmirate);
      } else if (filter.field === 'Destination') {
        return filter.values.includes(rc.destinationEmirate);
      }
      return true;
    });

    return matchesSearch && matchesFilters;
  });

  const paginatedRateCards = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRateCards.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRateCards, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-success-500', label: 'Active' },
      inactive: { color: 'bg-error-500', label: 'Inactive' },
      draft: { color: 'bg-neutral-500', label: 'Draft' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  const getServiceTypeBadge = (serviceType: string) => {
    const typeConfig: Record<string, { color: string; label: string }> = {
      standard: { color: 'bg-neutral-500', label: 'Standard' },
      express: { color: 'bg-primary-500', label: 'Express' },
      'same-day': { color: 'bg-warning-500', label: 'Same Day' },
      economy: { color: 'bg-info-500', label: 'Economy' },
    };
    const config = typeConfig[serviceType];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  const handleView = (rateCard: RateCard) => {
    setSelectedRateCard(rateCard);
    console.log('View rate card:', rateCard);
  };

  const handleEdit = (rateCard: RateCard) => {
    setSelectedRateCard(rateCard);
    setFormData(rateCard);
    setShowEditModal(true);
  };

  const handleDelete = (rateCard: RateCard) => {
    if (confirm(`Are you sure you want to delete ${rateCard.name}?`)) {
      console.log('Delete rate card:', rateCard.id);
    }
  };

  const handleDuplicate = (rateCard: RateCard) => {
    const duplicateData = { ...rateCard, code: `${rateCard.code}-COPY`, status: 'draft' as const };
    setFormData(duplicateData);
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      nameArabic: '',
      originEmirate: '',
      destinationEmirate: '',
      vehicleType: '',
      serviceType: 'standard',
      baseRate: '',
      perKmRate: '',
      minimumCharge: '',
      fuelSurcharge: '',
      tollCharges: '',
      waitingCharges: '',
      validFrom: '',
      validUntil: '',
      currency: 'AED',
      status: 'draft',
      priority: 1,
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
        <PageHeader
          title="Rate Card Management"
          breadcrumbs={[
            { label: 'Master Data', href: '#' },
            { label: 'Rate Cards', current: true },
          ]}
        >
          <PrimaryButton icon={Plus} onClick={handleAdd}>
            Add Rate Card
          </PrimaryButton>

          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search rate cards..."
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

        {showSummary && (
          <SummaryWidgets
            widgets={[
              {
                label: 'Total Rate Cards',
                value: mockRateCards.length.toString(),
                trend: '+7%',
                trendDirection: 'up',
              },
              {
                label: 'Active',
                value: mockRateCards.filter(r => r.status === 'active').length.toString(),
                trend: '+5%',
                trendDirection: 'up',
              },
              {
                label: 'Express Service',
                value: mockRateCards.filter(r => r.serviceType === 'express').length.toString(),
                trend: '+3%',
                trendDirection: 'up',
              },
              {
                label: 'Draft',
                value: mockRateCards.filter(r => r.status === 'draft').length.toString(),
                trend: '0%',
                trendDirection: 'neutral',
              },
            ]}
          />
        )}

        {filters.filter(f => f.values.length > 0).length > 0 && (
          <FilterChips
            filters={filters.filter(f => f.values.length > 0)}
            onRemove={(id) => setFilters(filters.filter(f => f.id !== id))}
            onClearAll={() => setFilters([])}
          />
        )}

        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedRateCards.map((rateCard) => (
              <div
                key={rateCard.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => handleView(rateCard)}>
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-900 dark:text-white font-medium">{rateCard.name}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{rateCard.nameArabic}</span>
                        {getStatusBadge(rateCard.status)}
                        {getServiceTypeBadge(rateCard.serviceType)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>{rateCard.code}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {rateCard.originEmirate} → {rateCard.destinationEmirate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          {rateCard.vehicleType}
                        </span>
                        <span className="font-medium text-primary-600 dark:text-primary-400">{rateCard.baseRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === rateCard.id ? null : rateCard.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === rateCard.id && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(rateCard);
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
                            handleEdit(rateCard);
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
                            handleDuplicate(rateCard);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(rateCard);
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

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedRateCards.map((rateCard) => (
              <div
                key={rateCard.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer relative"
                onClick={() => handleView(rateCard)}
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenuId(openActionMenuId === rateCard.id ? null : rateCard.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openActionMenuId === rateCard.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(rateCard);
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
                          handleDuplicate(rateCard);
                          setOpenActionMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(rateCard);
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
                    <DollarSign className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-white font-medium mb-1">{rateCard.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{rateCard.nameArabic}</p>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(rateCard.status)}
                    {getServiceTypeBadge(rateCard.serviceType)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{rateCard.originEmirate} → {rateCard.destinationEmirate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{rateCard.vehicleType}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Base Rate</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">{rateCard.baseRate}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Per KM</span>
                      <span className="font-medium">{rateCard.perKmRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Service Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Base Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Per KM</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedRateCards.map((rateCard) => (
                  <tr key={rateCard.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{rateCard.code}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {rateCard.originEmirate} → {rateCard.destinationEmirate}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{rateCard.vehicleType}</td>
                    <td className="px-4 py-3 text-sm">{getServiceTypeBadge(rateCard.serviceType)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400">{rateCard.baseRate}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{rateCard.perKmRate}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(rateCard.status)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === rateCard.id ? null : rateCard.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === rateCard.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => {
                                handleView(rateCard);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(rateCard);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDuplicate(rateCard);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(rateCard);
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

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredRateCards.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={filteredRateCards.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      <FormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        title={showEditModal ? 'Edit Rate Card' : 'Add New Rate Card'}
        description={showEditModal ? 'Update rate card information' : 'Enter rate card details to add to the system'}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>Rate Card Code</FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  placeholder="e.g., RC-DXB-AUH-TRK"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="serviceType" required>Service Type</FormLabel>
                <FormSelect
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                  required
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="same-day">Same Day</option>
                  <option value="economy">Economy</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="name" required>Rate Card Name (English)</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter rate card name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="nameArabic" required>Rate Card Name (Arabic)</FormLabel>
                <FormInput
                  id="nameArabic"
                  type="text"
                  placeholder="أدخل اسم بطاقة الأسعار"
                  value={formData.nameArabic}
                  onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                  required
                  dir="rtl"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Route & Vehicle">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="originEmirate" required>Origin Emirate</FormLabel>
                <FormSelect
                  id="originEmirate"
                  value={formData.originEmirate}
                  onChange={(e) => setFormData({ ...formData, originEmirate: e.target.value })}
                  required
                >
                  <option value="">Select origin</option>
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
                <FormLabel htmlFor="destinationEmirate" required>Destination Emirate</FormLabel>
                <FormSelect
                  id="destinationEmirate"
                  value={formData.destinationEmirate}
                  onChange={(e) => setFormData({ ...formData, destinationEmirate: e.target.value })}
                  required
                >
                  <option value="">Select destination</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Fujairah">Fujairah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                </FormSelect>
              </FormField>

              <FormField className="md:col-span-2">
                <FormLabel htmlFor="vehicleType" required>Vehicle Type</FormLabel>
                <FormInput
                  id="vehicleType"
                  type="text"
                  placeholder="e.g., 10 Ton Truck"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  required
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Pricing">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField>
                <FormLabel htmlFor="baseRate" required>Base Rate</FormLabel>
                <FormInput
                  id="baseRate"
                  type="text"
                  placeholder="e.g., AED 800"
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
                  placeholder="e.g., AED 4.50"
                  value={formData.perKmRate}
                  onChange={(e) => setFormData({ ...formData, perKmRate: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="minimumCharge" required>Minimum Charge</FormLabel>
                <FormInput
                  id="minimumCharge"
                  type="text"
                  placeholder="e.g., AED 500"
                  value={formData.minimumCharge}
                  onChange={(e) => setFormData({ ...formData, minimumCharge: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="fuelSurcharge" required>Fuel Surcharge (%)</FormLabel>
                <FormInput
                  id="fuelSurcharge"
                  type="text"
                  placeholder="e.g., 8%"
                  value={formData.fuelSurcharge}
                  onChange={(e) => setFormData({ ...formData, fuelSurcharge: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="tollCharges">Toll Charges</FormLabel>
                <FormInput
                  id="tollCharges"
                  type="text"
                  placeholder="e.g., AED 25"
                  value={formData.tollCharges}
                  onChange={(e) => setFormData({ ...formData, tollCharges: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="waitingCharges">Waiting Charges</FormLabel>
                <FormInput
                  id="waitingCharges"
                  type="text"
                  placeholder="e.g., AED 50/hour"
                  value={formData.waitingCharges}
                  onChange={(e) => setFormData({ ...formData, waitingCharges: e.target.value })}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Validity & Status">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="validFrom" required>Valid From</FormLabel>
                <FormInput
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="validUntil" required>Valid Until</FormLabel>
                <FormInput
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="currency" required>Currency</FormLabel>
                <FormSelect
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                  required
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
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
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="priority" required>Priority</FormLabel>
                <FormInput
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  required
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Description">
            <FormField>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormTextarea
                id="description"
                placeholder="Enter rate card description..."
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
              {showEditModal ? 'Update Rate Card' : 'Add Rate Card'}
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}
