import { useState, useMemo, useEffect } from 'react';
import {
  Clock,
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
  AlertCircle,
  Bell,
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

interface SLAConfiguration {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  category: 'inquiry-response' | 'quote-generation' | 'driver-assignment' | 'pickup' | 'delivery' | 'pod-submission';
  serviceLevel: 'standard' | 'express' | 'same-day' | 'critical';
  targetTime: string;
  warningThreshold: string;
  criticalThreshold: string;
  escalationLevel1: string;
  escalationLevel2: string;
  escalationLevel3: string;
  notificationEnabled: 'yes' | 'no';
  autoEscalation: 'yes' | 'no';
  businessHoursOnly: 'yes' | 'no';
  status: 'active' | 'inactive';
  description?: string;
  createdDate: string;
}

const mockSLAConfigurations: SLAConfiguration[] = [
  {
    id: '1',
    code: 'SLA-INQ-RESP',
    name: 'Inquiry Response Time',
    nameArabic: 'وقت الرد على الاستفسار',
    category: 'inquiry-response',
    serviceLevel: 'standard',
    targetTime: '2 hours',
    warningThreshold: '1.5 hours',
    criticalThreshold: '1.75 hours',
    escalationLevel1: 'Operations Manager',
    escalationLevel2: 'Regional Manager',
    escalationLevel3: 'CEO',
    notificationEnabled: 'yes',
    autoEscalation: 'yes',
    businessHoursOnly: 'yes',
    status: 'active',
    description: 'Time to respond to customer inquiry',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    code: 'SLA-QTE-GEN',
    name: 'Quote Generation Time',
    nameArabic: 'وقت إنشاء عرض السعر',
    category: 'quote-generation',
    serviceLevel: 'standard',
    targetTime: '4 hours',
    warningThreshold: '3 hours',
    criticalThreshold: '3.5 hours',
    escalationLevel1: 'Pricing Manager',
    escalationLevel2: 'Operations Manager',
    escalationLevel3: 'COO',
    notificationEnabled: 'yes',
    autoEscalation: 'yes',
    businessHoursOnly: 'yes',
    status: 'active',
    description: 'Time to generate pricing quote',
    createdDate: '2024-01-15',
  },
  {
    id: '3',
    code: 'SLA-DRV-ASSGN',
    name: 'Driver Assignment Time',
    nameArabic: 'وقت تعيين السائق',
    category: 'driver-assignment',
    serviceLevel: 'express',
    targetTime: '1 hour',
    warningThreshold: '45 minutes',
    criticalThreshold: '55 minutes',
    escalationLevel1: 'Dispatch Manager',
    escalationLevel2: 'Operations Manager',
    escalationLevel3: 'COO',
    notificationEnabled: 'yes',
    autoEscalation: 'yes',
    businessHoursOnly: 'no',
    status: 'active',
    description: 'Time to assign driver to shipment',
    createdDate: '2024-01-16',
  },
  {
    id: '4',
    code: 'SLA-PICKUP',
    name: 'Pickup Time',
    nameArabic: 'وقت الاستلام',
    category: 'pickup',
    serviceLevel: 'same-day',
    targetTime: '6 hours',
    warningThreshold: '5 hours',
    criticalThreshold: '5.5 hours',
    escalationLevel1: 'Operations Supervisor',
    escalationLevel2: 'Operations Manager',
    escalationLevel3: 'Regional Manager',
    notificationEnabled: 'yes',
    autoEscalation: 'yes',
    businessHoursOnly: 'no',
    status: 'active',
    description: 'Time from assignment to pickup',
    createdDate: '2024-01-17',
  },
  {
    id: '5',
    code: 'SLA-DELIVERY',
    name: 'Delivery Time',
    nameArabic: 'وقت التسليم',
    category: 'delivery',
    serviceLevel: 'standard',
    targetTime: '24 hours',
    warningThreshold: '20 hours',
    criticalThreshold: '22 hours',
    escalationLevel1: 'Operations Manager',
    escalationLevel2: 'Regional Manager',
    escalationLevel3: 'COO',
    notificationEnabled: 'yes',
    autoEscalation: 'yes',
    businessHoursOnly: 'no',
    status: 'active',
    description: 'Time from pickup to delivery',
    createdDate: '2024-01-18',
  },
  {
    id: '6',
    code: 'SLA-POD',
    name: 'POD Submission Time',
    nameArabic: 'وقت تقديم إثبات التسليم',
    category: 'pod-submission',
    serviceLevel: 'standard',
    targetTime: '2 hours',
    warningThreshold: '1.5 hours',
    criticalThreshold: '1.75 hours',
    escalationLevel1: 'Operations Supervisor',
    escalationLevel2: 'Operations Manager',
    escalationLevel3: 'COO',
    notificationEnabled: 'yes',
    autoEscalation: 'no',
    businessHoursOnly: 'no',
    status: 'inactive',
    description: 'Time to submit proof of delivery',
    createdDate: '2024-01-19',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function SLAConfiguration() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSLA, setSelectedSLA] = useState<SLAConfiguration | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const filterOptions = {
    'Status': ['Active', 'Inactive'],
    'Category': ['Inquiry Response', 'Quote Generation', 'Driver Assignment', 'Pickup', 'Delivery', 'POD Submission'],
    'Service Level': ['Standard', 'Express', 'Same Day', 'Critical'],
    'Auto Escalation': ['Yes', 'No'],
  };

  const [formData, setFormData] = useState<Partial<SLAConfiguration>>({
    code: '',
    name: '',
    nameArabic: '',
    category: 'inquiry-response',
    serviceLevel: 'standard',
    targetTime: '',
    warningThreshold: '',
    criticalThreshold: '',
    escalationLevel1: '',
    escalationLevel2: '',
    escalationLevel3: '',
    notificationEnabled: 'yes',
    autoEscalation: 'yes',
    businessHoursOnly: 'yes',
    status: 'active',
    description: '',
  });

  const filteredSLAs = mockSLAConfigurations.filter(sla => {
    const matchesSearch = searchQuery === '' ||
      sla.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sla.nameArabic.includes(searchQuery) ||
      sla.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = filters.every(filter => {
      if (filter.field === 'Status') {
        return filter.values.some(v => v.toLowerCase() === sla.status);
      } else if (filter.field === 'Category') {
        const categoryMap: Record<string, string> = {
          'Inquiry Response': 'inquiry-response',
          'Quote Generation': 'quote-generation',
          'Driver Assignment': 'driver-assignment',
          'Pickup': 'pickup',
          'Delivery': 'delivery',
          'POD Submission': 'pod-submission',
        };
        return filter.values.some(v => categoryMap[v] === sla.category);
      } else if (filter.field === 'Service Level') {
        return filter.values.some(v => v.toLowerCase().replace(' ', '-') === sla.serviceLevel);
      } else if (filter.field === 'Auto Escalation') {
        return filter.values.some(v => v.toLowerCase() === sla.autoEscalation);
      }
      return true;
    });

    return matchesSearch && matchesFilters;
  });

  const paginatedSLAs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSLAs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSLAs, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const getStatusBadge = (status: string) => {
    const config = status === 'active'
      ? { color: 'bg-success-500', label: 'Active' }
      : { color: 'bg-error-500', label: 'Inactive' };
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  const getServiceLevelBadge = (level: string) => {
    const levelConfig: Record<string, { color: string; label: string }> = {
      standard: { color: 'bg-neutral-500', label: 'Standard' },
      express: { color: 'bg-primary-500', label: 'Express' },
      'same-day': { color: 'bg-warning-500', label: 'Same Day' },
      critical: { color: 'bg-error-500', label: 'Critical' },
    };
    const config = levelConfig[level];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  const handleView = (sla: SLAConfiguration) => {
    setSelectedSLA(sla);
    console.log('View SLA:', sla);
  };

  const handleEdit = (sla: SLAConfiguration) => {
    setSelectedSLA(sla);
    setFormData(sla);
    setShowEditModal(true);
  };

  const handleDelete = (sla: SLAConfiguration) => {
    if (confirm(`Are you sure you want to delete ${sla.name}?`)) {
      console.log('Delete SLA:', sla.id);
    }
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      nameArabic: '',
      category: 'inquiry-response',
      serviceLevel: 'standard',
      targetTime: '',
      warningThreshold: '',
      criticalThreshold: '',
      escalationLevel1: '',
      escalationLevel2: '',
      escalationLevel3: '',
      notificationEnabled: 'yes',
      autoEscalation: 'yes',
      businessHoursOnly: 'yes',
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
        <PageHeader
          title="SLA Configuration"
          breadcrumbs={[
            { label: 'Master Data', href: '#' },
            { label: 'SLA Configuration', current: true },
          ]}
          moreMenu={{
            onPrint: () => window.print(),
          }}
        >
          <PrimaryButton icon={Plus} onClick={handleAdd}>
            Add SLA Rule
          </PrimaryButton>

          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search SLA configurations..."
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

        {showSummary && (
          <SummaryWidgets
            widgets={[
              {
                label: 'Total SLA Rules',
                value: mockSLAConfigurations.length.toString(),
                trend: '+3%',
                trendDirection: 'up',
              },
              {
                label: 'Active',
                value: mockSLAConfigurations.filter(s => s.status === 'active').length.toString(),
                trend: '+2%',
                trendDirection: 'up',
              },
              {
                label: 'Auto Escalation',
                value: mockSLAConfigurations.filter(s => s.autoEscalation === 'yes').length.toString(),
                trend: '0%',
                trendDirection: 'neutral',
              },
              {
                label: 'Express Service',
                value: mockSLAConfigurations.filter(s => s.serviceLevel === 'express').length.toString(),
                trend: '+1%',
                trendDirection: 'up',
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
            {paginatedSLAs.map((sla) => (
              <div
                key={sla.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => handleView(sla)}>
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-900 dark:text-white font-medium">{sla.name}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{sla.nameArabic}</span>
                        {getStatusBadge(sla.status)}
                        {getServiceLevelBadge(sla.serviceLevel)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>{sla.code}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Target: {sla.targetTime}
                        </span>
                        {sla.autoEscalation === 'yes' && (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-warning-500" />
                            Auto Escalation
                          </span>
                        )}
                        {sla.notificationEnabled === 'yes' && (
                          <span className="flex items-center gap-1">
                            <Bell className="w-3.5 h-3.5 text-info-500" />
                            Notifications
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === sla.id ? null : sla.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === sla.id && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(sla);
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
                            handleEdit(sla);
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
                            handleDelete(sla);
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
            {paginatedSLAs.map((sla) => (
              <div
                key={sla.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer relative"
                onClick={() => handleView(sla)}
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenuId(openActionMenuId === sla.id ? null : sla.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openActionMenuId === sla.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(sla);
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
                          handleDelete(sla);
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
                    <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-white font-medium mb-1">{sla.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{sla.nameArabic}</p>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(sla.status)}
                    {getServiceLevelBadge(sla.serviceLevel)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Target Time</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{sla.targetTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Warning</span>
                    <span className="font-medium text-warning-600 dark:text-warning-400">{sla.warningThreshold}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Critical</span>
                    <span className="font-medium text-error-600 dark:text-error-400">{sla.criticalThreshold}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                    {sla.autoEscalation === 'yes' && (
                      <div className="flex items-center gap-1 text-xs">
                        <AlertCircle className="w-3 h-3 text-warning-500" />
                        <span>Auto</span>
                      </div>
                    )}
                    {sla.notificationEnabled === 'yes' && (
                      <div className="flex items-center gap-1 text-xs">
                        <Bell className="w-3 h-3 text-info-500" />
                        <span>Notify</span>
                      </div>
                    )}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Service Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Target Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Thresholds</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedSLAs.map((sla) => (
                  <tr key={sla.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{sla.code}</td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{sla.name}</td>
                    <td className="px-4 py-3 text-sm">{getServiceLevelBadge(sla.serviceLevel)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{sla.targetTime}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-warning-600 dark:text-warning-400">W: {sla.warningThreshold}</span>
                        <span className="text-xs text-error-600 dark:text-error-400">C: {sla.criticalThreshold}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(sla.status)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === sla.id ? null : sla.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === sla.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => {
                                handleView(sla);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(sla);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(sla);
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
          totalPages={Math.ceil(filteredSLAs.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={filteredSLAs.length}
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
        title={showEditModal ? 'Edit SLA Configuration' : 'Add New SLA Configuration'}
        description={showEditModal ? 'Update SLA configuration details' : 'Enter SLA configuration to add to the system'}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>SLA Code</FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  placeholder="e.g., SLA-INQ-RESP"
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
                  <option value="inquiry-response">Inquiry Response</option>
                  <option value="quote-generation">Quote Generation</option>
                  <option value="driver-assignment">Driver Assignment</option>
                  <option value="pickup">Pickup</option>
                  <option value="delivery">Delivery</option>
                  <option value="pod-submission">POD Submission</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="name" required>SLA Name (English)</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter SLA name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="nameArabic" required>SLA Name (Arabic)</FormLabel>
                <FormInput
                  id="nameArabic"
                  type="text"
                  placeholder="أدخل اسم اتفاقية مستوى الخدمة"
                  value={formData.nameArabic}
                  onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                  required
                  dir="rtl"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="serviceLevel" required>Service Level</FormLabel>
                <FormSelect
                  id="serviceLevel"
                  value={formData.serviceLevel}
                  onChange={(e) => setFormData({ ...formData, serviceLevel: e.target.value as any })}
                  required
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="same-day">Same Day</option>
                  <option value="critical">Critical</option>
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

          <FormSection title="Time Thresholds">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField>
                <FormLabel htmlFor="targetTime" required>Target Time</FormLabel>
                <FormInput
                  id="targetTime"
                  type="text"
                  placeholder="e.g., 2 hours"
                  value={formData.targetTime}
                  onChange={(e) => setFormData({ ...formData, targetTime: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="warningThreshold" required>Warning Threshold</FormLabel>
                <FormInput
                  id="warningThreshold"
                  type="text"
                  placeholder="e.g., 1.5 hours"
                  value={formData.warningThreshold}
                  onChange={(e) => setFormData({ ...formData, warningThreshold: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="criticalThreshold" required>Critical Threshold</FormLabel>
                <FormInput
                  id="criticalThreshold"
                  type="text"
                  placeholder="e.g., 1.75 hours"
                  value={formData.criticalThreshold}
                  onChange={(e) => setFormData({ ...formData, criticalThreshold: e.target.value })}
                  required
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Escalation Levels">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField>
                <FormLabel htmlFor="escalationLevel1" required>Level 1 Escalation</FormLabel>
                <FormInput
                  id="escalationLevel1"
                  type="text"
                  placeholder="e.g., Operations Manager"
                  value={formData.escalationLevel1}
                  onChange={(e) => setFormData({ ...formData, escalationLevel1: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="escalationLevel2" required>Level 2 Escalation</FormLabel>
                <FormInput
                  id="escalationLevel2"
                  type="text"
                  placeholder="e.g., Regional Manager"
                  value={formData.escalationLevel2}
                  onChange={(e) => setFormData({ ...formData, escalationLevel2: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="escalationLevel3" required>Level 3 Escalation</FormLabel>
                <FormInput
                  id="escalationLevel3"
                  type="text"
                  placeholder="e.g., CEO"
                  value={formData.escalationLevel3}
                  onChange={(e) => setFormData({ ...formData, escalationLevel3: e.target.value })}
                  required
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Additional Settings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField>
                <FormLabel htmlFor="notificationEnabled" required>Notifications</FormLabel>
                <FormSelect
                  id="notificationEnabled"
                  value={formData.notificationEnabled}
                  onChange={(e) => setFormData({ ...formData, notificationEnabled: e.target.value as any })}
                  required
                >
                  <option value="yes">Enabled</option>
                  <option value="no">Disabled</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="autoEscalation" required>Auto Escalation</FormLabel>
                <FormSelect
                  id="autoEscalation"
                  value={formData.autoEscalation}
                  onChange={(e) => setFormData({ ...formData, autoEscalation: e.target.value as any })}
                  required
                >
                  <option value="yes">Enabled</option>
                  <option value="no">Disabled</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="businessHoursOnly" required>Business Hours Only</FormLabel>
                <FormSelect
                  id="businessHoursOnly"
                  value={formData.businessHoursOnly}
                  onChange={(e) => setFormData({ ...formData, businessHoursOnly: e.target.value as any })}
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="no">No (24/7)</option>
                </FormSelect>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Description">
            <FormField>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormTextarea
                id="description"
                placeholder="Enter SLA description..."
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
              {showEditModal ? 'Update SLA Configuration' : 'Add SLA Configuration'}
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}
