import { useState, useMemo, useEffect } from 'react';
import {
  FileText,
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
  FileCheck,
  Shield,
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

interface DocumentType {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  category: 'identity' | 'vehicle' | 'shipment' | 'customs' | 'insurance' | 'compliance';
  isMandatory: 'yes' | 'no';
  applicableFor: string[];
  validityPeriod?: string;
  fileFormats: string[];
  maxFileSize: string;
  verificationRequired: 'yes' | 'no';
  status: 'active' | 'inactive';
  description?: string;
  createdDate: string;
}

const mockDocumentTypes: DocumentType[] = [
  {
    id: '1',
    code: 'DOC-EID',
    name: 'Emirates ID',
    nameArabic: 'الهوية الإماراتية',
    category: 'identity',
    isMandatory: 'yes',
    applicableFor: ['Driver', 'Customer'],
    validityPeriod: '2 years',
    fileFormats: ['PDF', 'JPG', 'PNG'],
    maxFileSize: '5 MB',
    verificationRequired: 'yes',
    status: 'active',
    description: 'Government-issued Emirates ID card',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    code: 'DOC-LIC',
    name: 'Driving License',
    nameArabic: 'رخصة القيادة',
    category: 'identity',
    isMandatory: 'yes',
    applicableFor: ['Driver'],
    validityPeriod: '10 years',
    fileFormats: ['PDF', 'JPG', 'PNG'],
    maxFileSize: '5 MB',
    verificationRequired: 'yes',
    status: 'active',
    description: 'Valid UAE driving license',
    createdDate: '2024-01-15',
  },
  {
    id: '3',
    code: 'DOC-MULK',
    name: 'Mulkiya (Vehicle Registration)',
    nameArabic: 'الملكية',
    category: 'vehicle',
    isMandatory: 'yes',
    applicableFor: ['Driver'],
    validityPeriod: '1 year',
    fileFormats: ['PDF', 'JPG'],
    maxFileSize: '5 MB',
    verificationRequired: 'yes',
    status: 'active',
    description: 'Vehicle registration certificate',
    createdDate: '2024-01-15',
  },
  {
    id: '4',
    code: 'DOC-POD',
    name: 'Proof of Delivery',
    nameArabic: 'إثبات التسليم',
    category: 'shipment',
    isMandatory: 'yes',
    applicableFor: ['Driver'],
    fileFormats: ['PDF', 'JPG', 'PNG'],
    maxFileSize: '10 MB',
    verificationRequired: 'no',
    status: 'active',
    description: 'Signed delivery confirmation',
    createdDate: '2024-01-16',
  },
  {
    id: '5',
    code: 'DOC-INS',
    name: 'Insurance Certificate',
    nameArabic: 'شهادة التأمين',
    category: 'insurance',
    isMandatory: 'yes',
    applicableFor: ['Driver', 'Customer'],
    validityPeriod: '1 year',
    fileFormats: ['PDF'],
    maxFileSize: '5 MB',
    verificationRequired: 'yes',
    status: 'active',
    description: 'Vehicle or cargo insurance certificate',
    createdDate: '2024-01-17',
  },
  {
    id: '6',
    code: 'DOC-CUST',
    name: 'Customs Declaration',
    nameArabic: 'البيان الجمركي',
    category: 'customs',
    isMandatory: 'no',
    applicableFor: ['Customer'],
    fileFormats: ['PDF', 'XML'],
    maxFileSize: '10 MB',
    verificationRequired: 'yes',
    status: 'active',
    description: 'Customs declaration for cross-border shipments',
    createdDate: '2024-01-18',
  },
  {
    id: '7',
    code: 'DOC-TL',
    name: 'Trade License',
    nameArabic: 'الرخصة التجارية',
    category: 'compliance',
    isMandatory: 'yes',
    applicableFor: ['Customer'],
    validityPeriod: '1 year',
    fileFormats: ['PDF'],
    maxFileSize: '5 MB',
    verificationRequired: 'yes',
    status: 'inactive',
    description: 'Business trade license',
    createdDate: '2024-01-19',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function DocumentTypeMaster() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const filterOptions = {
    'Status': ['Active', 'Inactive'],
    'Category': ['Identity', 'Vehicle', 'Shipment', 'Customs', 'Insurance', 'Compliance'],
    'Mandatory': ['Yes', 'No'],
    'Verification Required': ['Yes', 'No'],
  };

  const [formData, setFormData] = useState<Partial<DocumentType>>({
    code: '',
    name: '',
    nameArabic: '',
    category: 'identity',
    isMandatory: 'no',
    applicableFor: [],
    validityPeriod: '',
    fileFormats: [],
    maxFileSize: '5 MB',
    verificationRequired: 'no',
    status: 'active',
    description: '',
  });

  const filteredDocuments = mockDocumentTypes.filter(doc => {
    const matchesSearch = searchQuery === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.nameArabic.includes(searchQuery) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = filters.every(filter => {
      if (filter.field === 'Status') {
        return filter.values.some(v => v.toLowerCase() === doc.status);
      } else if (filter.field === 'Category') {
        return filter.values.some(v => v.toLowerCase() === doc.category);
      } else if (filter.field === 'Mandatory') {
        return filter.values.some(v => v.toLowerCase() === doc.isMandatory);
      } else if (filter.field === 'Verification Required') {
        return filter.values.some(v => v.toLowerCase() === doc.verificationRequired);
      }
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDocuments, currentPage, itemsPerPage]);

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

  const getCategoryBadge = (category: string) => {
    const categoryConfig: Record<string, { color: string; label: string }> = {
      identity: { color: 'bg-primary-500', label: 'Identity' },
      vehicle: { color: 'bg-info-500', label: 'Vehicle' },
      shipment: { color: 'bg-success-500', label: 'Shipment' },
      customs: { color: 'bg-warning-500', label: 'Customs' },
      insurance: { color: 'bg-purple-500', label: 'Insurance' },
      compliance: { color: 'bg-error-500', label: 'Compliance' },
    };
    const config = categoryConfig[category];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  const handleView = (doc: DocumentType) => {
    setSelectedDocument(doc);
    console.log('View document:', doc);
  };

  const handleEdit = (doc: DocumentType) => {
    setSelectedDocument(doc);
    setFormData(doc);
    setShowEditModal(true);
  };

  const handleDelete = (doc: DocumentType) => {
    if (confirm(`Are you sure you want to delete ${doc.name}?`)) {
      console.log('Delete document:', doc.id);
    }
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      nameArabic: '',
      category: 'identity',
      isMandatory: 'no',
      applicableFor: [],
      validityPeriod: '',
      fileFormats: [],
      maxFileSize: '5 MB',
      verificationRequired: 'no',
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
          title="Document Type Master"
          breadcrumbs={[
            { label: 'Master Data', href: '#' },
            { label: 'Document Types', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search document types..."
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
            Add Document Type
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

        {showSummary && (
          <SummaryWidgets
            widgets={[
              {
                label: 'Total Document Types',
                value: mockDocumentTypes.length.toString(),
                trend: '+5%',
                trendDirection: 'up',
              },
              {
                label: 'Active',
                value: mockDocumentTypes.filter(d => d.status === 'active').length.toString(),
                trend: '+3%',
                trendDirection: 'up',
              },
              {
                label: 'Mandatory',
                value: mockDocumentTypes.filter(d => d.isMandatory === 'yes').length.toString(),
                trend: '0%',
                trendDirection: 'neutral',
              },
              {
                label: 'Verification Required',
                value: mockDocumentTypes.filter(d => d.verificationRequired === 'yes').length.toString(),
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
            {paginatedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => handleView(doc)}>
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-900 dark:text-white font-medium">{doc.name}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{doc.nameArabic}</span>
                        {getStatusBadge(doc.status)}
                        {getCategoryBadge(doc.category)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>{doc.code}</span>
                        {doc.isMandatory === 'yes' && (
                          <span className="flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-error-500" />
                            <span>Mandatory</span>
                          </span>
                        )}
                        {doc.verificationRequired === 'yes' && (
                          <span className="flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5 text-success-500" />
                            <span>Verification Required</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === doc.id ? null : doc.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === doc.id && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(doc);
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
                            handleEdit(doc);
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
                            handleDelete(doc);
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
            {paginatedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer relative"
                onClick={() => handleView(doc)}
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenuId(openActionMenuId === doc.id ? null : doc.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openActionMenuId === doc.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(doc);
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
                          handleDelete(doc);
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
                    <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-white font-medium mb-1">{doc.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{doc.nameArabic}</p>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(doc.status)}
                    {getCategoryBadge(doc.category)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Code:</span>
                    <span className="font-medium">{doc.code}</span>
                  </div>
                  {doc.isMandatory === 'yes' && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-error-500" />
                      <span className="text-xs">Mandatory</span>
                    </div>
                  )}
                  {doc.verificationRequired === 'yes' && (
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-success-500" />
                      <span className="text-xs">Verification Required</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Max Size</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{doc.maxFileSize}</span>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Requirements</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Max Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{doc.code}</td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{doc.name}</td>
                    <td className="px-4 py-3 text-sm">{getCategoryBadge(doc.category)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {doc.isMandatory === 'yes' && <Shield className="w-4 h-4 text-error-500" />}
                        {doc.verificationRequired === 'yes' && <FileCheck className="w-4 h-4 text-success-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{doc.maxFileSize}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(doc.status)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === doc.id ? null : doc.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === doc.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => {
                                handleView(doc);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(doc);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(doc);
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
          totalPages={Math.ceil(filteredDocuments.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={filteredDocuments.length}
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
        title={showEditModal ? 'Edit Document Type' : 'Add New Document Type'}
        description={showEditModal ? 'Update document type information' : 'Enter document type details to add to the system'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>Document Code</FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  placeholder="e.g., DOC-EID"
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
                  <option value="identity">Identity</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="shipment">Shipment</option>
                  <option value="customs">Customs</option>
                  <option value="insurance">Insurance</option>
                  <option value="compliance">Compliance</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="name" required>Document Name (English)</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter document name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="nameArabic" required>Document Name (Arabic)</FormLabel>
                <FormInput
                  id="nameArabic"
                  type="text"
                  placeholder="أدخل اسم الوثيقة"
                  value={formData.nameArabic}
                  onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                  required
                  dir="rtl"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="isMandatory" required>Is Mandatory</FormLabel>
                <FormSelect
                  id="isMandatory"
                  value={formData.isMandatory}
                  onChange={(e) => setFormData({ ...formData, isMandatory: e.target.value as any })}
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="verificationRequired" required>Verification Required</FormLabel>
                <FormSelect
                  id="verificationRequired"
                  value={formData.verificationRequired}
                  onChange={(e) => setFormData({ ...formData, verificationRequired: e.target.value as any })}
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="maxFileSize" required>Max File Size</FormLabel>
                <FormInput
                  id="maxFileSize"
                  type="text"
                  placeholder="e.g., 5 MB"
                  value={formData.maxFileSize}
                  onChange={(e) => setFormData({ ...formData, maxFileSize: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="validityPeriod">Validity Period</FormLabel>
                <FormInput
                  id="validityPeriod"
                  type="text"
                  placeholder="e.g., 2 years"
                  value={formData.validityPeriod}
                  onChange={(e) => setFormData({ ...formData, validityPeriod: e.target.value })}
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

          <FormSection title="Additional Details">
            <FormField>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormTextarea
                id="description"
                placeholder="Enter document type description..."
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
              {showEditModal ? 'Update Document Type' : 'Add Document Type'}
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}
