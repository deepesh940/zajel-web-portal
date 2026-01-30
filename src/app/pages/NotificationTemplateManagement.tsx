import { useState, useMemo, useEffect } from 'react';
import {
  Bell,
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
  Mail,
  MessageSquare,
  Copy,
  CheckCircle,
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

interface NotificationTemplate {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  category: 'inquiry' | 'shipment' | 'driver' | 'payment' | 'sla' | 'system';
  triggerEvent: string;
  channel: 'email' | 'sms' | 'push' | 'whatsapp' | 'all';
  recipients: string[];
  subject: string;
  subjectArabic: string;
  bodyTemplate: string;
  bodyTemplateArabic: string;
  variables: string[];
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'draft';
  sendImmediately: 'yes' | 'no';
  delayMinutes?: number;
  description?: string;
  createdDate: string;
}

const mockNotificationTemplates: NotificationTemplate[] = [
  {
    id: '1',
    code: 'NTF-INQ-NEW',
    name: 'New Inquiry Created',
    nameArabic: 'إنشاء استفسار جديد',
    category: 'inquiry',
    triggerEvent: 'inquiry_created',
    channel: 'email',
    recipients: ['customer', 'operations'],
    subject: 'New Shipment Inquiry #{inquiry_id} Received',
    subjectArabic: 'تم استلام استفسار شحن جديد #{inquiry_id}',
    bodyTemplate: 'Dear {customer_name},\n\nYour shipment inquiry #{inquiry_id} has been received. Our team will review it and provide a quote within 2 hours.\n\nThank you,\nZAJEL Team',
    bodyTemplateArabic: 'عزيزي {customer_name}،\n\nتم استلام استفسار الشحن #{inquiry_id}. سيقوم فريقنا بمراجعته وتقديم عرض أسعار خلال ساعتين.\n\nشكرًا لك،\nفريق زاجل',
    variables: ['customer_name', 'inquiry_id', 'pickup_location', 'delivery_location'],
    priority: 'high',
    status: 'active',
    sendImmediately: 'yes',
    description: 'Sent when a new inquiry is created by customer',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    code: 'NTF-QTE-GEN',
    name: 'Quote Generated',
    nameArabic: 'تم إنشاء عرض السعر',
    category: 'inquiry',
    triggerEvent: 'quote_generated',
    channel: 'email',
    recipients: ['customer'],
    subject: 'Your Quote #{quote_id} is Ready',
    subjectArabic: 'عرض الأسعار #{quote_id} جاهز',
    bodyTemplate: 'Dear {customer_name},\n\nYour quote #{quote_id} for inquiry #{inquiry_id} is ready.\n\nTotal Amount: {total_amount}\nValid Until: {valid_until}\n\nPlease review and accept at your earliest convenience.\n\nBest regards,\nZAJEL Team',
    bodyTemplateArabic: 'عزيزي {customer_name}،\n\nعرض الأسعار #{quote_id} للاستفسار #{inquiry_id} جاهز.\n\nالمبلغ الإجمالي: {total_amount}\nصالح حتى: {valid_until}\n\nيرجى المراجعة والقبول في أقرب وقت ممكن.\n\nمع أطيب التحيات،\nفريق زاجل',
    variables: ['customer_name', 'quote_id', 'inquiry_id', 'total_amount', 'valid_until'],
    priority: 'high',
    status: 'active',
    sendImmediately: 'yes',
    description: 'Sent when quote is generated and ready for customer review',
    createdDate: '2024-01-16',
  },
  {
    id: '3',
    code: 'NTF-DRV-ASSGN',
    name: 'Driver Assignment Notification',
    nameArabic: 'إشعار تعيين السائق',
    category: 'driver',
    triggerEvent: 'driver_assigned',
    channel: 'push',
    recipients: ['driver', 'customer'],
    subject: 'New Shipment Assignment #{shipment_id}',
    subjectArabic: 'تعيين شحنة جديدة #{shipment_id}',
    bodyTemplate: 'Hi {driver_name},\n\nYou have been assigned to shipment #{shipment_id}.\n\nPickup: {pickup_location} at {pickup_time}\nDelivery: {delivery_location}\n\nPlease confirm acceptance.',
    bodyTemplateArabic: 'مرحبًا {driver_name}،\n\nتم تعيينك لشحنة #{shipment_id}.\n\nالاستلام: {pickup_location} في {pickup_time}\nالتسليم: {delivery_location}\n\nيرجى تأكيد القبول.',
    variables: ['driver_name', 'shipment_id', 'pickup_location', 'pickup_time', 'delivery_location'],
    priority: 'critical',
    status: 'active',
    sendImmediately: 'yes',
    description: 'Sent to driver when assigned to a shipment',
    createdDate: '2024-01-17',
  },
  {
    id: '4',
    code: 'NTF-SLA-WARN',
    name: 'SLA Warning Alert',
    nameArabic: 'تنبيه تحذير اتفاقية مستوى الخدمة',
    category: 'sla',
    triggerEvent: 'sla_warning_threshold',
    channel: 'all',
    recipients: ['operations_manager'],
    subject: 'SLA Warning: {sla_type} for {shipment_id}',
    subjectArabic: 'تحذير SLA: {sla_type} لـ {shipment_id}',
    bodyTemplate: 'ALERT: SLA warning threshold reached.\n\nShipment: {shipment_id}\nSLA Type: {sla_type}\nTime Remaining: {time_remaining}\n\nImmediate attention required.',
    bodyTemplateArabic: 'تنبيه: تم الوصول إلى عتبة تحذير SLA.\n\nالشحنة: {shipment_id}\nنوع SLA: {sla_type}\nالوقت المتبقي: {time_remaining}\n\nمطلوب اهتمام فوري.',
    variables: ['shipment_id', 'sla_type', 'time_remaining', 'target_time'],
    priority: 'critical',
    status: 'active',
    sendImmediately: 'yes',
    description: 'Sent when SLA warning threshold is reached',
    createdDate: '2024-01-18',
  },
  {
    id: '5',
    code: 'NTF-PAY-CONF',
    name: 'Payment Confirmation',
    nameArabic: 'تأكيد الدفع',
    category: 'payment',
    triggerEvent: 'payment_received',
    channel: 'email',
    recipients: ['customer'],
    subject: 'Payment Received - Invoice #{invoice_id}',
    subjectArabic: 'تم استلام الدفع - فاتورة #{invoice_id}',
    bodyTemplate: 'Dear {customer_name},\n\nWe confirm receipt of your payment.\n\nInvoice: #{invoice_id}\nAmount: {amount}\nPayment Method: {payment_method}\nDate: {payment_date}\n\nThank you for your business!\n\nZAJEL Team',
    bodyTemplateArabic: 'عزيزي {customer_name}،\n\nنؤكد استلام دفعتك.\n\nالفاتورة: #{invoice_id}\nالمبلغ: {amount}\nطريقة الدفع: {payment_method}\nالتاريخ: {payment_date}\n\nشكرًا لتعاملكم معنا!\n\nفريق زاجل',
    variables: ['customer_name', 'invoice_id', 'amount', 'payment_method', 'payment_date'],
    priority: 'normal',
    status: 'active',
    sendImmediately: 'no',
    delayMinutes: 5,
    description: 'Sent when payment is received and confirmed',
    createdDate: '2024-01-19',
  },
  {
    id: '6',
    code: 'NTF-POD-SUB',
    name: 'Proof of Delivery Submitted',
    nameArabic: 'تم تقديم إثبات التسليم',
    category: 'shipment',
    triggerEvent: 'pod_submitted',
    channel: 'email',
    recipients: ['customer', 'operations'],
    subject: 'Delivery Completed - Shipment #{shipment_id}',
    subjectArabic: 'تم التسليم - شحنة #{shipment_id}',
    bodyTemplate: 'Dear {customer_name},\n\nYour shipment #{shipment_id} has been successfully delivered.\n\nDelivered at: {delivery_time}\nReceived by: {receiver_name}\nSignature: Available in portal\n\nThank you for choosing ZAJEL!',
    bodyTemplateArabic: 'عزيزي {customer_name}،\n\nتم تسليم شحنتك #{shipment_id} بنجاح.\n\nوقت التسليم: {delivery_time}\nاستلمها: {receiver_name}\nالتوقيع: متاح في البوابة\n\nشكرًا لاختيارك زاجل!',
    variables: ['customer_name', 'shipment_id', 'delivery_time', 'receiver_name'],
    priority: 'high',
    status: 'draft',
    sendImmediately: 'yes',
    description: 'Sent when proof of delivery is submitted',
    createdDate: '2024-01-20',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function NotificationTemplateManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const filterOptions = {
    'Status': ['Active', 'Inactive', 'Draft'],
    'Category': ['Inquiry', 'Shipment', 'Driver', 'Payment', 'SLA', 'System'],
    'Channel': ['Email', 'SMS', 'Push', 'WhatsApp', 'All'],
    'Priority': ['Low', 'Normal', 'High', 'Critical'],
  };

  const [formData, setFormData] = useState<Partial<NotificationTemplate>>({
    code: '',
    name: '',
    nameArabic: '',
    category: 'inquiry',
    triggerEvent: '',
    channel: 'email',
    recipients: [],
    subject: '',
    subjectArabic: '',
    bodyTemplate: '',
    bodyTemplateArabic: '',
    variables: [],
    priority: 'normal',
    status: 'draft',
    sendImmediately: 'yes',
    delayMinutes: 0,
    description: '',
  });

  const filteredTemplates = mockNotificationTemplates.filter(template => {
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.nameArabic.includes(searchQuery) ||
      template.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = filters.every(filter => {
      if (filter.field === 'Status') {
        return filter.values.some(v => v.toLowerCase() === template.status);
      } else if (filter.field === 'Category') {
        return filter.values.some(v => v.toLowerCase() === template.category);
      } else if (filter.field === 'Channel') {
        return filter.values.some(v => v.toLowerCase() === template.channel);
      } else if (filter.field === 'Priority') {
        return filter.values.some(v => v.toLowerCase() === template.priority);
      }
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTemplates, currentPage, itemsPerPage]);

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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { color: string; label: string }> = {
      low: { color: 'bg-neutral-500', label: 'Low' },
      normal: { color: 'bg-info-500', label: 'Normal' },
      high: { color: 'bg-warning-500', label: 'High' },
      critical: { color: 'bg-error-500', label: 'Critical' },
    };
    const config = priorityConfig[priority];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, any> = {
      email: Mail,
      sms: MessageSquare,
      push: Bell,
      whatsapp: MessageSquare,
      all: CheckCircle,
    };
    const Icon = icons[channel] || Bell;
    return <Icon className="w-4 h-4" />;
  };

  const handleView = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    console.log('View template:', template);
  };

  const handleEdit = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setFormData(template);
    setShowEditModal(true);
  };

  const handleDelete = (template: NotificationTemplate) => {
    if (confirm(`Are you sure you want to delete ${template.name}?`)) {
      console.log('Delete template:', template.id);
    }
  };

  const handleDuplicate = (template: NotificationTemplate) => {
    const duplicateData = { ...template, code: `${template.code}-COPY`, status: 'draft' as const };
    setFormData(duplicateData);
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      nameArabic: '',
      category: 'inquiry',
      triggerEvent: '',
      channel: 'email',
      recipients: [],
      subject: '',
      subjectArabic: '',
      bodyTemplate: '',
      bodyTemplateArabic: '',
      variables: [],
      priority: 'normal',
      status: 'draft',
      sendImmediately: 'yes',
      delayMinutes: 0,
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
          title="Notification Template Management"
          subtitle="Manage email, SMS, and push notification templates"
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Notification Templates', current: true },
          ]}
          primaryAction={{
            label: '+ Add Template',
            onClick: handleAdd,
            icon: Plus,
          }}
          moreMenu={{
            onImport: () => console.log('Import'),
            exportOptions: {
              onExportCSV: () => console.log('Export CSV'),
              onExportExcel: () => console.log('Export Excel'),
              onExportPDF: () => console.log('Export PDF'),
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
              placeholder="Search templates..."
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
            Add Template
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
                label: 'Total Templates',
                value: mockNotificationTemplates.length.toString(),
                trend: '+6%',
                trendDirection: 'up',
              },
              {
                label: 'Active',
                value: mockNotificationTemplates.filter(t => t.status === 'active').length.toString(),
                trend: '+4%',
                trendDirection: 'up',
              },
              {
                label: 'Critical Priority',
                value: mockNotificationTemplates.filter(t => t.priority === 'critical').length.toString(),
                trend: '+2%',
                trendDirection: 'up',
              },
              {
                label: 'Email Channel',
                value: mockNotificationTemplates.filter(t => t.channel === 'email' || t.channel === 'all').length.toString(),
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
            {paginatedTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => handleView(template)}>
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-900 dark:text-white font-medium">{template.name}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{template.nameArabic}</span>
                        {getStatusBadge(template.status)}
                        {getPriorityBadge(template.priority)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>{template.code}</span>
                        <span className="flex items-center gap-1">
                          {getChannelIcon(template.channel)}
                          <span className="capitalize">{template.channel}</span>
                        </span>
                        <span className="capitalize">{template.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === template.id ? null : template.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === template.id && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(template);
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
                            handleEdit(template);
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
                            handleDuplicate(template);
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
                            handleDelete(template);
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
            {paginatedTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer relative"
                onClick={() => handleView(template)}
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenuId(openActionMenuId === template.id ? null : template.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openActionMenuId === template.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(template);
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
                          handleDuplicate(template);
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
                          handleDelete(template);
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
                    <Bell className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-white font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{template.nameArabic}</p>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(template.status)}
                    {getPriorityBadge(template.priority)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Category</span>
                    <span className="font-medium capitalize">{template.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Channel</span>
                    <span className="flex items-center gap-1 font-medium capitalize">
                      {getChannelIcon(template.channel)}
                      {template.channel}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                    {template.sendImmediately === 'yes' ? 'Send Immediately' : `Delay: ${template.delayMinutes}min`}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{template.code}</td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{template.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 capitalize">{template.category}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center gap-1 capitalize">
                        {getChannelIcon(template.channel)}
                        {template.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{getPriorityBadge(template.priority)}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(template.status)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === template.id ? null : template.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === template.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => {
                                handleView(template);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(template);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDuplicate(template);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(template);
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
          totalPages={Math.ceil(filteredTemplates.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={filteredTemplates.length}
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
        title={showEditModal ? 'Edit Notification Template' : 'Add New Notification Template'}
        description={showEditModal ? 'Update notification template' : 'Create a new notification template'}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="code" required>Template Code</FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  placeholder="e.g., NTF-INQ-NEW"
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
                  <option value="inquiry">Inquiry</option>
                  <option value="shipment">Shipment</option>
                  <option value="driver">Driver</option>
                  <option value="payment">Payment</option>
                  <option value="sla">SLA</option>
                  <option value="system">System</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="name" required>Template Name (English)</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter template name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="nameArabic" required>Template Name (Arabic)</FormLabel>
                <FormInput
                  id="nameArabic"
                  type="text"
                  placeholder="أدخل اسم القالب"
                  value={formData.nameArabic}
                  onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                  required
                  dir="rtl"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="channel" required>Channel</FormLabel>
                <FormSelect
                  id="channel"
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                  required
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="all">All Channels</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="priority" required>Priority</FormLabel>
                <FormSelect
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  required
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="triggerEvent" required>Trigger Event</FormLabel>
                <FormInput
                  id="triggerEvent"
                  type="text"
                  placeholder="e.g., inquiry_created"
                  value={formData.triggerEvent}
                  onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })}
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
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Message Content">
            <div className="grid grid-cols-1 gap-4">
              <FormField>
                <FormLabel htmlFor="subject" required>Subject (English)</FormLabel>
                <FormInput
                  id="subject"
                  type="text"
                  placeholder="Email subject line"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="subjectArabic" required>Subject (Arabic)</FormLabel>
                <FormInput
                  id="subjectArabic"
                  type="text"
                  placeholder="سطر موضوع البريد الإلكتروني"
                  value={formData.subjectArabic}
                  onChange={(e) => setFormData({ ...formData, subjectArabic: e.target.value })}
                  required
                  dir="rtl"
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="bodyTemplate" required>Body Template (English)</FormLabel>
                <FormTextarea
                  id="bodyTemplate"
                  placeholder="Message body with variables like {customer_name}"
                  value={formData.bodyTemplate}
                  onChange={(e) => setFormData({ ...formData, bodyTemplate: e.target.value })}
                  rows={6}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="bodyTemplateArabic" required>Body Template (Arabic)</FormLabel>
                <FormTextarea
                  id="bodyTemplateArabic"
                  placeholder="نص الرسالة مع المتغيرات مثل {customer_name}"
                  value={formData.bodyTemplateArabic}
                  onChange={(e) => setFormData({ ...formData, bodyTemplateArabic: e.target.value })}
                  rows={6}
                  required
                  dir="rtl"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Delivery Settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="sendImmediately" required>Send Immediately</FormLabel>
                <FormSelect
                  id="sendImmediately"
                  value={formData.sendImmediately}
                  onChange={(e) => setFormData({ ...formData, sendImmediately: e.target.value as any })}
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="no">No (Delay)</option>
                </FormSelect>
              </FormField>

              {formData.sendImmediately === 'no' && (
                <FormField>
                  <FormLabel htmlFor="delayMinutes">Delay (Minutes)</FormLabel>
                  <FormInput
                    id="delayMinutes"
                    type="number"
                    min="1"
                    placeholder="e.g., 5"
                    value={formData.delayMinutes}
                    onChange={(e) => setFormData({ ...formData, delayMinutes: parseInt(e.target.value) })}
                  />
                </FormField>
              )}
            </div>
          </FormSection>

          <FormSection title="Description">
            <FormField>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormTextarea
                id="description"
                placeholder="Enter template description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
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
              {showEditModal ? 'Update Template' : 'Add Template'}
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}