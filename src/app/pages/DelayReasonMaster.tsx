import { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle,
  MoreVertical,
  Plus,
  BarChart3,
  RefreshCw,
  Printer,
  Eye,
  Edit2,
  Trash2,
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

interface DelayReason {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  category: 'traffic' | 'weather' | 'vehicle' | 'driver' | 'customer' | 'customs' | 'operational';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  requiresApproval: 'yes' | 'no';
  requiresEvidence: 'yes' | 'no';
  slaImpact: 'no-impact' | 'partial' | 'full';
  compensationRequired: 'yes' | 'no';
  status: 'active' | 'inactive';
  description?: string;
  createdDate: string;
}

const mockDelayReasons: DelayReason[] = [
  {
    id: '1',
    code: 'DLY-TRF-JAM',
    name: 'Traffic Jam',
    nameArabic: 'ازدحام مروري',
    category: 'traffic',
    severity: 'moderate',
    requiresApproval: 'no',
    requiresEvidence: 'yes',
    slaImpact: 'partial',
    compensationRequired: 'no',
    status: 'active',
    description: 'Heavy traffic congestion causing delays',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    code: 'DLY-WTR-RAIN',
    name: 'Heavy Rain',
    nameArabic: 'أمطار غزيرة',
    category: 'weather',
    severity: 'major',
    requiresApproval: 'no',
    requiresEvidence: 'yes',
    slaImpact: 'no-impact',
    compensationRequired: 'no',
    status: 'active',
    description: 'Weather-related delay due to heavy rainfall',
    createdDate: '2024-01-15',
  },
  {
    id: '3',
    code: 'DLY-VEH-BRK',
    name: 'Vehicle Breakdown',
    nameArabic: 'عطل المركبة',
    category: 'vehicle',
    severity: 'critical',
    requiresApproval: 'yes',
    requiresEvidence: 'yes',
    slaImpact: 'full',
    compensationRequired: 'yes',
    status: 'active',
    description: 'Vehicle mechanical failure or breakdown',
    createdDate: '2024-01-16',
  },
  {
    id: '4',
    code: 'DLY-DRV-ABS',
    name: 'Driver Absence',
    nameArabic: 'غياب السائق',
    category: 'driver',
    severity: 'critical',
    requiresApproval: 'yes',
    requiresEvidence: 'yes',
    slaImpact: 'full',
    compensationRequired: 'yes',
    status: 'active',
    description: 'Assigned driver not available',
    createdDate: '2024-01-17',
  },
  {
    id: '5',
    code: 'DLY-CST-NAVL',
    name: 'Customer Not Available',
    nameArabic: 'العميل غير متاح',
    category: 'customer',
    severity: 'moderate',
    requiresApproval: 'no',
    requiresEvidence: 'yes',
    slaImpact: 'no-impact',
    compensationRequired: 'no',
    status: 'active',
    description: 'Customer not present at pickup/delivery location',
    createdDate: '2024-01-18',
  },
  {
    id: '6',
    code: 'DLY-CUS-CLR',
    name: 'Customs Clearance Delay',
    nameArabic: 'تأخير التخليص الجمركي',
    category: 'customs',
    severity: 'major',
    requiresApproval: 'yes',
    requiresEvidence: 'yes',
    slaImpact: 'no-impact',
    compensationRequired: 'no',
    status: 'active',
    description: 'Delay in customs clearance process',
    createdDate: '2024-01-19',
  },
  {
    id: '7',
    code: 'DLY-OPS-SCH',
    name: 'Operational Scheduling Issue',
    nameArabic: 'مشكلة جدولة تشغيلية',
    category: 'operational',
    severity: 'minor',
    requiresApproval: 'no',
    requiresEvidence: 'no',
    slaImpact: 'partial',
    compensationRequired: 'no',
    status: 'inactive',
    description: 'Internal scheduling or coordination delay',
    createdDate: '2024-01-20',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function DelayReasonMaster() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<DelayReason | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const filterOptions = {
    'Status': ['Active', 'Inactive'],
    'Category': ['Traffic', 'Weather', 'Vehicle', 'Driver', 'Customer', 'Customs', 'Operational'],
    'Severity': ['Minor', 'Moderate', 'Major', 'Critical'],
    'SLA Impact': ['No Impact', 'Partial', 'Full'],
  };

  const [formData, setFormData] = useState<Partial<DelayReason>>({
    code: '',
    name: '',
    nameArabic: '',
    category: 'traffic',
    severity: 'moderate',
    requiresApproval: 'no',
    requiresEvidence: 'no',
    slaImpact: 'partial',
    compensationRequired: 'no',
    status: 'active',
    description: '',
  });

  const filteredReasons = mockDelayReasons.filter(reason => {
    const matchesSearch = searchQuery === '' ||
      reason.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reason.nameArabic.includes(searchQuery) ||
      reason.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = filters.every(filter => {
      if (filter.field === 'Status') {
        return filter.values.some(v => v.toLowerCase() === reason.status);
      } else if (filter.field === 'Category') {
        return filter.values.some(v => v.toLowerCase() === reason.category);
      } else if (filter.field === 'Severity') {
        return filter.values.some(v => v.toLowerCase() === reason.severity);
      } else if (filter.field === 'SLA Impact') {
        const impactMap: Record<string, string> = {
          'No Impact': 'no-impact',
          'Partial': 'partial',
          'Full': 'full',
        };
        return filter.values.some(v => impactMap[v] === reason.slaImpact);
      }
      return true;
    });

    return matchesSearch && matchesFilters;
  });

  const paginatedReasons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReasons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReasons, currentPage, itemsPerPage]);

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

  const getSeverityBadge = (severity: string) => {
    const severityConfig: Record<string, { color: string; label: string }> = {
      minor: { color: 'bg-neutral-500', label: 'Minor' },
      moderate: { color: 'bg-warning-500', label: 'Moderate' },
      major: { color: 'bg-error-500', label: 'Major' },
      critical: { color: 'bg-purple-500', label: 'Critical' },
    };
    const config = severityConfig[severity];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  const handleView = (reason: DelayReason) => {
    setSelectedReason(reason);
    console.log('View delay reason:', reason);
  };

  const handleEdit = (reason: DelayReason) => {
    setSelectedReason(reason);
    setFormData(reason);
    setShowEditModal(true);
  };

  const handleDelete = (reason: DelayReason) => {
    if (confirm(`Are you sure you want to delete ${reason.name}?`)) {
      console.log('Delete delay reason:', reason.id);
    }
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      nameArabic: '',
      category: 'traffic',
      severity: 'moderate',
      requiresApproval: 'no',
      requiresEvidence: 'no',
      slaImpact: 'partial',
      compensationRequired: 'no',
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
          title="Delay Reason Master"
          breadcrumbs={[
            { label: 'Master Data', href: '#' },
            { label: 'Delay Reason Master', current: true },
          ]}
          moreMenu={{
          }}
        >
          <PrimaryButton icon={Plus} onClick={handleAdd}>
            Add Delay Reason
          </PrimaryButton>

          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search delay reasons..."
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
                label: 'Total Delay Reasons',
                value: mockDelayReasons.length.toString(),
                trend: '+4%',
                trendDirection: 'up',
              },
              {
                label: 'Active',
                value: mockDelayReasons.filter(r => r.status === 'active').length.toString(),
                trend: '+2%',
                trendDirection: 'up',
              },
              {
                label: 'Critical Severity',
                value: mockDelayReasons.filter(r => r.severity === 'critical').length.toString(),
                trend: '0%',
                trendDirection: 'neutral',
              },
              {
                label: 'Requires Approval',
                value: mockDelayReasons.filter(r => r.requiresApproval === 'yes').length.toString(),
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
            {paginatedReasons.map((reason) => (
              <div
                key={reason.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => handleView(reason)}>
                    <div className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-950 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-900 dark:text-white font-medium">{reason.name}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{reason.nameArabic}</span>
                        {getStatusBadge(reason.status)}
                        {getSeverityBadge(reason.severity)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>{reason.code}</span>
                        <span className="capitalize">{reason.category}</span>
                        {reason.requiresApproval === 'yes' && (
                          <span className="text-error-600 dark:text-error-400">Requires Approval</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === reason.id ? null : reason.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === reason.id && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(reason);
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
                            handleEdit(reason);
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
                            handleDelete(reason);
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
            {paginatedReasons.map((reason) => (
              <div
                key={reason.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer relative"
                onClick={() => handleView(reason)}
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenuId(openActionMenuId === reason.id ? null : reason.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openActionMenuId === reason.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(reason);
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
                          handleDelete(reason);
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
                  <div className="w-16 h-16 rounded-full bg-warning-100 dark:bg-warning-950 flex items-center justify-center mb-3">
                    <AlertTriangle className="w-8 h-8 text-warning-600 dark:text-warning-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-white font-medium mb-1">{reason.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{reason.nameArabic}</p>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(reason.status)}
                    {getSeverityBadge(reason.severity)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Category</span>
                    <span className="font-medium capitalize">{reason.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">SLA Impact</span>
                    <span className="font-medium capitalize">{reason.slaImpact.replace('-', ' ')}</span>
                  </div>
                  {reason.requiresApproval === 'yes' && (
                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-error-600 dark:text-error-400 text-xs">
                      Requires Approval
                    </div>
                  )}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">SLA Impact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedReasons.map((reason) => (
                  <tr key={reason.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{reason.code}</td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{reason.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 capitalize">{reason.category}</td>
                    <td className="px-4 py-3 text-sm">{getSeverityBadge(reason.severity)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 capitalize">{reason.slaImpact.replace('-', ' ')}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(reason.status)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === reason.id ? null : reason.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === reason.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => {
                                handleView(reason);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(reason);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(reason);
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
          totalPages={Math.ceil(filteredReasons.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={filteredReasons.length}
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
        title={showEditModal ? 'Edit Delay Reason' : 'Add New Delay Reason'}
        description={showEditModal ? 'Update delay reason information' : 'Enter delay reason details to add to the system'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>Delay Code</FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  placeholder="e.g., DLY-TRF-JAM"
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
                  <option value="traffic">Traffic</option>
                  <option value="weather">Weather</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="driver">Driver</option>
                  <option value="customer">Customer</option>
                  <option value="customs">Customs</option>
                  <option value="operational">Operational</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="name" required>Delay Reason (English)</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter delay reason"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="nameArabic" required>Delay Reason (Arabic)</FormLabel>
                <FormInput
                  id="nameArabic"
                  type="text"
                  placeholder="أدخل سبب التأخير"
                  value={formData.nameArabic}
                  onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                  required
                  dir="rtl"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="severity" required>Severity</FormLabel>
                <FormSelect
                  id="severity"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  required
                >
                  <option value="minor">Minor</option>
                  <option value="moderate">Moderate</option>
                  <option value="major">Major</option>
                  <option value="critical">Critical</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="slaImpact" required>SLA Impact</FormLabel>
                <FormSelect
                  id="slaImpact"
                  value={formData.slaImpact}
                  onChange={(e) => setFormData({ ...formData, slaImpact: e.target.value as any })}
                  required
                >
                  <option value="no-impact">No Impact</option>
                  <option value="partial">Partial Impact</option>
                  <option value="full">Full Impact</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="requiresApproval" required>Requires Approval</FormLabel>
                <FormSelect
                  id="requiresApproval"
                  value={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.value as any })}
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="requiresEvidence" required>Requires Evidence</FormLabel>
                <FormSelect
                  id="requiresEvidence"
                  value={formData.requiresEvidence}
                  onChange={(e) => setFormData({ ...formData, requiresEvidence: e.target.value as any })}
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="compensationRequired" required>Compensation Required</FormLabel>
                <FormSelect
                  id="compensationRequired"
                  value={formData.compensationRequired}
                  onChange={(e) => setFormData({ ...formData, compensationRequired: e.target.value as any })}
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
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

          <FormSection title="Description">
            <FormField>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormTextarea
                id="description"
                placeholder="Enter delay reason description..."
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
              {showEditModal ? 'Update Delay Reason' : 'Add Delay Reason'}
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}
