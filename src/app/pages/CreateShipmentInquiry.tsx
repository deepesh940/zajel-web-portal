import { useState } from "react";
import {
  Package,
  MapPin,
  Calendar,
  Truck,
  FileText,
  Plus,
  X,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  Info,
  Upload,
  Thermometer,
  AlertTriangle,
  Box,
  Weight,
  Ruler,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormSection,
  FormTextarea,
  FormSelect,
} from "../components/hb/common/Form";
import { toast } from "sonner";

interface CargoItem {
  id: string;
  description: string;
  quantity: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  value: number;
}

export default function CreateShipmentInquiry() {
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [inquiryNumber, setInquiryNumber] = useState("");

  // Step 1: Basic Information
  const [basicInfo, setBasicInfo] = useState({
    serviceType: "standard",
    pickupDate: "",
    pickupTime: "",
    deliveryDate: "",
    urgency: "normal",
  });

  // Step 2: Pickup Details
  const [pickupDetails, setPickupDetails] = useState({
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    city: "",
    emirate: "Dubai",
    landmark: "",
    instructions: "",
  });

  // Step 3: Delivery Details
  const [deliveryDetails, setDeliveryDetails] = useState({
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    city: "",
    emirate: "Dubai",
    landmark: "",
    instructions: "",
  });

  // Step 4: Cargo Details
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      value: 0,
    },
  ]);

  const [cargoType, setCargoType] = useState("general");
  const [specialHandling, setSpecialHandling] = useState({
    fragile: false,
    refrigerated: false,
    hazardous: false,
    oversized: false,
  });

  // Step 5: Additional Information
  const [additionalInfo, setAdditionalInfo] = useState({
    insuranceRequired: false,
    insuranceValue: "",
    packagingRequired: false,
    packagingType: "",
    notes: "",
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  const handleAddCargoItem = () => {
    setCargoItems([
      ...cargoItems,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        value: 0,
      },
    ]);
  };

  const handleRemoveCargoItem = (id: string) => {
    if (cargoItems.length > 1) {
      setCargoItems(cargoItems.filter((item) => item.id !== id));
    }
  };

  const handleCargoItemChange = (id: string, field: string, value: any) => {
    setCargoItems(
      cargoItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getTotalWeight = () => {
    return cargoItems.reduce(
      (sum, item) => sum + item.weight * item.quantity,
      0
    );
  };

  const getTotalValue = () => {
    return cargoItems.reduce(
      (sum, item) => sum + item.value * item.quantity,
      0
    );
  };

  const getTotalVolume = () => {
    return cargoItems.reduce(
      (sum, item) =>
        sum + (item.length * item.width * item.height * item.quantity) / 1000000,
      0
    );
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!basicInfo.serviceType || !basicInfo.pickupDate) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 2:
        if (
          !pickupDetails.contactName ||
          !pickupDetails.contactPhone ||
          !pickupDetails.address ||
          !pickupDetails.city
        ) {
          toast.error("Please fill in all required pickup details");
          return false;
        }
        return true;
      case 3:
        if (
          !deliveryDetails.contactName ||
          !deliveryDetails.contactPhone ||
          !deliveryDetails.address ||
          !deliveryDetails.city
        ) {
          toast.error("Please fill in all required delivery details");
          return false;
        }
        return true;
      case 4:
        const hasInvalidItems = cargoItems.some(
          (item) => !item.description || item.weight <= 0
        );
        if (hasInvalidItems) {
          toast.error("Please complete all cargo item details");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSaveDraft = () => {
    toast.success("Inquiry saved as draft");
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      const newInquiryNumber = `INQ-2024-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;
      setInquiryNumber(newInquiryNumber);
      setShowSuccessModal(true);
    }
  };

  const handleStartNew = () => {
    setShowSuccessModal(false);
    setStep(1);
    // Reset all forms
    setBasicInfo({
      serviceType: "standard",
      pickupDate: "",
      pickupTime: "",
      deliveryDate: "",
      urgency: "normal",
    });
    setPickupDetails({
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      address: "",
      city: "",
      emirate: "Dubai",
      landmark: "",
      instructions: "",
    });
    setDeliveryDetails({
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      address: "",
      city: "",
      emirate: "Dubai",
      landmark: "",
      instructions: "",
    });
    setCargoItems([
      {
        id: "1",
        description: "",
        quantity: 1,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        value: 0,
      },
    ]);
    setCargoType("general");
    setSpecialHandling({
      fragile: false,
      refrigerated: false,
      hazardous: false,
      oversized: false,
    });
    setAdditionalInfo({
      insuranceRequired: false,
      insuranceValue: "",
      packagingRequired: false,
      packagingType: "",
      notes: "",
    });
    setAttachments([]);
  };

  const handlePrefill = () => {
    // Generate dates relative to today
    const today = new Date();
    const pickupDate = new Date(today);
    pickupDate.setDate(today.getDate() + 2);
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5);

    setBasicInfo({
      serviceType: "express",
      pickupDate: pickupDate.toISOString().split("T")[0],
      pickupTime: "10:00",
      deliveryDate: deliveryDate.toISOString().split("T")[0],
      urgency: "high",
    });

    setPickupDetails({
      contactName: "John Doe",
      contactPhone: "+971 50 123 4567",
      contactEmail: "john.doe@example.com",
      address: "Building 5, Street 12, Business Bay",
      city: "Business Bay",
      emirate: "Dubai",
      landmark: "Near Metro Station",
      instructions: "Call upon arrival",
    });

    setDeliveryDetails({
      contactName: "Jane Smith",
      contactPhone: "+971 55 987 6543",
      contactEmail: "jane.smith@example.com",
      address: "Villa 12, Corniche Road",
      city: "Al Khalidiya",
      emirate: "Abu Dhabi",
      landmark: "Opposite Mall",
      instructions: "Leave at security gate",
    });

    setCargoItems([
      {
        id: "1",
        description: "High-end Electronics",
        quantity: 5,
        weight: 25.5,
        length: 50,
        width: 40,
        height: 30,
        value: 15000,
      },
      {
        id: Date.now().toString(),
        description: "Accessories Box",
        quantity: 2,
        weight: 5,
        length: 20,
        width: 20,
        height: 15,
        value: 2000,
      }
    ]);

    setCargoType("electronics");

    setSpecialHandling({
      fragile: true,
      refrigerated: false,
      hazardous: false,
      oversized: false,
    });

    setAdditionalInfo({
      insuranceRequired: true,
      insuranceValue: "17000",
      packagingRequired: true,
      packagingType: "bubble",
      notes: "Please handle with extra care as these are expensive items.",
    });

    toast.success("Form prefilled with sample data");
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[
          { num: 1, label: "Basic Info" },
          { num: 2, label: "Pickup" },
          { num: 3, label: "Delivery" },
          { num: 4, label: "Cargo" },
          { num: 5, label: "Review" },
        ].map((s, index) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step === s.num
                  ? "bg-primary-500 text-white"
                  : step > s.num
                    ? "bg-success-500 text-white"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  }`}
              >
                {step > s.num ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`text-xs mt-2 ${step >= s.num
                  ? "text-neutral-900 dark:text-white font-medium"
                  : "text-neutral-500 dark:text-neutral-500"
                  }`}
              >
                {s.label}
              </span>
            </div>
            {index < 4 && (
              <div
                className={`h-1 flex-1 mx-2 rounded transition-colors ${step > s.num
                  ? "bg-success-500"
                  : "bg-neutral-200 dark:bg-neutral-800"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <FormSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField>
            <FormLabel htmlFor="serviceType" required>
              Service Type
            </FormLabel>
            <FormSelect
              id="serviceType"
              value={basicInfo.serviceType}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, serviceType: e.target.value })
              }
            >
              <option value="standard">Standard Delivery</option>
              <option value="express">Express Delivery</option>
              <option value="same-day">Same Day Delivery</option>
              <option value="scheduled">Scheduled Delivery</option>
            </FormSelect>
          </FormField>

          <FormField>
            <FormLabel htmlFor="urgency" required>
              Urgency Level
            </FormLabel>
            <FormSelect
              id="urgency"
              value={basicInfo.urgency}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, urgency: e.target.value })
              }
            >
              <option value="normal">Normal</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </FormSelect>
          </FormField>

          <FormField>
            <FormLabel htmlFor="pickupDate" required>
              Pickup Date
            </FormLabel>
            <FormInput
              id="pickupDate"
              type="date"
              value={basicInfo.pickupDate}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, pickupDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="pickupTime">Preferred Pickup Time</FormLabel>
            <FormInput
              id="pickupTime"
              type="time"
              value={basicInfo.pickupTime}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, pickupTime: e.target.value })
              }
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="deliveryDate">
              Expected Delivery Date
            </FormLabel>
            <FormInput
              id="deliveryDate"
              type="date"
              value={basicInfo.deliveryDate}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, deliveryDate: e.target.value })
              }
              min={basicInfo.pickupDate || new Date().toISOString().split("T")[0]}
            />
          </FormField>
        </div>
      </FormSection>

      <div className="p-4 bg-info-50 dark:bg-info-900/30 rounded-lg border border-info-200 dark:border-info-800">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-info-600 dark:text-info-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-info-900 dark:text-info-300">
              Service Type Guide
            </p>
            <ul className="text-sm text-info-700 dark:text-info-400 mt-2 space-y-1">
              <li>• <strong>Standard:</strong> 2-3 business days delivery</li>
              <li>• <strong>Express:</strong> 1 business day delivery</li>
              <li>• <strong>Same Day:</strong> Pickup and delivery within same day</li>
              <li>• <strong>Scheduled:</strong> Delivery on specific date and time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Pickup Location Details
        </h3>
      </div>

      <FormSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField>
            <FormLabel htmlFor="pickupContactName" required>
              Contact Name
            </FormLabel>
            <FormInput
              id="pickupContactName"
              type="text"
              placeholder="Enter contact name"
              value={pickupDetails.contactName}
              onChange={(e) =>
                setPickupDetails({
                  ...pickupDetails,
                  contactName: e.target.value,
                })
              }
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="pickupContactPhone" required>
              Contact Phone
            </FormLabel>
            <FormInput
              id="pickupContactPhone"
              type="tel"
              placeholder="+971 XX XXX XXXX"
              value={pickupDetails.contactPhone}
              onChange={(e) =>
                setPickupDetails({
                  ...pickupDetails,
                  contactPhone: e.target.value,
                })
              }
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="pickupContactEmail">Contact Email</FormLabel>
            <FormInput
              id="pickupContactEmail"
              type="email"
              placeholder="contact@example.com"
              value={pickupDetails.contactEmail}
              onChange={(e) =>
                setPickupDetails({
                  ...pickupDetails,
                  contactEmail: e.target.value,
                })
              }
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="pickupEmirate" required>
              Emirate
            </FormLabel>
            <FormSelect
              id="pickupEmirate"
              value={pickupDetails.emirate}
              onChange={(e) =>
                setPickupDetails({
                  ...pickupDetails,
                  emirate: e.target.value,
                })
              }
            >
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Fujairah">Fujairah</option>
            </FormSelect>
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel htmlFor="pickupCity" required>
              City / Area
            </FormLabel>
            <FormInput
              id="pickupCity"
              type="text"
              placeholder="Enter city or area"
              value={pickupDetails.city}
              onChange={(e) =>
                setPickupDetails({ ...pickupDetails, city: e.target.value })
              }
            />
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel htmlFor="pickupAddress" required>
              Street Address
            </FormLabel>
            <FormTextarea
              id="pickupAddress"
              rows={3}
              placeholder="Enter complete street address"
              value={pickupDetails.address}
              onChange={(e) =>
                setPickupDetails({ ...pickupDetails, address: e.target.value })
              }
            />
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel htmlFor="pickupLandmark">Nearby Landmark</FormLabel>
            <FormInput
              id="pickupLandmark"
              type="text"
              placeholder="e.g., Near Metro Station, Behind Mall"
              value={pickupDetails.landmark}
              onChange={(e) =>
                setPickupDetails({ ...pickupDetails, landmark: e.target.value })
              }
            />
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel htmlFor="pickupInstructions">
              Special Instructions
            </FormLabel>
            <FormTextarea
              id="pickupInstructions"
              rows={3}
              placeholder="Any special instructions for pickup"
              value={pickupDetails.instructions}
              onChange={(e) =>
                setPickupDetails({
                  ...pickupDetails,
                  instructions: e.target.value,
                })
              }
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-success-600 dark:text-success-400" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Delivery Location Details
        </h3>
      </div>

      <FormSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField>
            <FormLabel htmlFor="deliveryContactName" required>
              Contact Name
            </FormLabel>
            <FormInput
              id="deliveryContactName"
              type="text"
              placeholder="Enter contact name"
              value={deliveryDetails.contactName}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  contactName: e.target.value,
                })
              }
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="deliveryContactPhone" required>
              Contact Phone
            </FormLabel>
            <FormInput
              id="deliveryContactPhone"
              type="tel"
              placeholder="+971 XX XXX XXXX"
              value={deliveryDetails.contactPhone}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  contactPhone: e.target.value,
                })
              }
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="deliveryContactEmail">Contact Email</FormLabel>
            <FormInput
              id="deliveryContactEmail"
              type="email"
              placeholder="contact@example.com"
              value={deliveryDetails.contactEmail}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  contactEmail: e.target.value,
                })
              }
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="deliveryEmirate" required>
              Emirate
            </FormLabel>
            <FormSelect
              id="deliveryEmirate"
              value={deliveryDetails.emirate}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  emirate: e.target.value,
                })
              }
            >
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Fujairah">Fujairah</option>
            </FormSelect>
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel htmlFor="deliveryCity" required>
              City / Area
            </FormLabel>
            <FormInput
              id="deliveryCity"
              type="text"
              placeholder="Enter city or area"
              value={deliveryDetails.city}
              onChange={(e) =>
                setDeliveryDetails({ ...deliveryDetails, city: e.target.value })
              }
            />
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel htmlFor="deliveryAddress" required>
              Street Address
            </FormLabel>
            <FormTextarea
              id="deliveryAddress"
              rows={3}
              placeholder="Enter complete street address"
              value={deliveryDetails.address}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  address: e.target.value,
                })
              }
            />
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel htmlFor="deliveryLandmark">Nearby Landmark</FormLabel>
            <FormInput
              id="deliveryLandmark"
              type="text"
              placeholder="e.g., Near Metro Station, Behind Mall"
              value={deliveryDetails.landmark}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  landmark: e.target.value,
                })
              }
            />
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel htmlFor="deliveryInstructions">
              Special Instructions
            </FormLabel>
            <FormTextarea
              id="deliveryInstructions"
              rows={3}
              placeholder="Any special instructions for delivery"
              value={deliveryDetails.instructions}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  instructions: e.target.value,
                })
              }
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Cargo Details
          </h3>
        </div>
        <button
          onClick={handleAddCargoItem}
          className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <FormSection>
        <FormField>
          <FormLabel htmlFor="cargoType" required>
            Cargo Type
          </FormLabel>
          <FormSelect
            id="cargoType"
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value)}
          >
            <option value="general">General Cargo</option>
            <option value="documents">Documents</option>
            <option value="electronics">Electronics</option>
            <option value="food">Food & Beverages</option>
            <option value="furniture">Furniture</option>
            <option value="machinery">Machinery & Equipment</option>
            <option value="chemicals">Chemicals</option>
            <option value="other">Other</option>
          </FormSelect>
        </FormField>

        <FormField>
          <FormLabel>Special Handling Requirements</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={specialHandling.fragile}
                onChange={(e) =>
                  setSpecialHandling({
                    ...specialHandling,
                    fragile: e.target.checked,
                  })
                }
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-warning-600" />
                Fragile
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={specialHandling.refrigerated}
                onChange={(e) =>
                  setSpecialHandling({
                    ...specialHandling,
                    refrigerated: e.target.checked,
                  })
                }
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                <Thermometer className="w-4 h-4 text-info-600" />
                Refrigerated
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={specialHandling.hazardous}
                onChange={(e) =>
                  setSpecialHandling({
                    ...specialHandling,
                    hazardous: e.target.checked,
                  })
                }
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-error-600" />
                Hazardous
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={specialHandling.oversized}
                onChange={(e) =>
                  setSpecialHandling({
                    ...specialHandling,
                    oversized: e.target.checked,
                  })
                }
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                <Box className="w-4 h-4 text-primary-600" />
                Oversized
              </span>
            </label>
          </div>
        </FormField>
      </FormSection>

      <div className="space-y-4">
        {cargoItems.map((item, index) => (
          <div
            key={item.id}
            className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Item {index + 1}
              </h4>
              {cargoItems.length > 1 && (
                <button
                  onClick={() => handleRemoveCargoItem(item.id)}
                  className="p-1 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <FormLabel>Description *</FormLabel>
                <FormInput
                  type="text"
                  placeholder="e.g., Electronics - Laptops"
                  value={item.description}
                  onChange={(e) =>
                    handleCargoItemChange(item.id, "description", e.target.value)
                  }
                />
              </div>

              <div>
                <FormLabel>Quantity *</FormLabel>
                <FormInput
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleCargoItemChange(
                      item.id,
                      "quantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                />
              </div>

              <div>
                <FormLabel>Weight (kg) *</FormLabel>
                <FormInput
                  type="number"
                  min="0"
                  step="0.1"
                  value={item.weight}
                  onChange={(e) =>
                    handleCargoItemChange(
                      item.id,
                      "weight",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>

              <div>
                <FormLabel>Value (AED) *</FormLabel>
                <FormInput
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.value}
                  onChange={(e) =>
                    handleCargoItemChange(
                      item.id,
                      "value",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>

              <div>
                <FormLabel>Length (cm)</FormLabel>
                <FormInput
                  type="number"
                  min="0"
                  step="0.1"
                  value={item.length}
                  onChange={(e) =>
                    handleCargoItemChange(
                      item.id,
                      "length",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>

              <div>
                <FormLabel>Width (cm)</FormLabel>
                <FormInput
                  type="number"
                  min="0"
                  step="0.1"
                  value={item.width}
                  onChange={(e) =>
                    handleCargoItemChange(
                      item.id,
                      "width",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>

              <div>
                <FormLabel>Height (cm)</FormLabel>
                <FormInput
                  type="number"
                  min="0"
                  step="0.1"
                  value={item.height}
                  onChange={(e) =>
                    handleCargoItemChange(
                      item.id,
                      "height",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cargo Summary */}
      <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
        <h4 className="text-sm font-semibold text-primary-900 dark:text-primary-300 mb-3">
          Cargo Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Box className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-xs text-primary-700 dark:text-primary-400">
                Total Items
              </span>
            </div>
            <p className="text-lg font-semibold text-primary-900 dark:text-primary-300">
              {cargoItems.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Weight className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-xs text-primary-700 dark:text-primary-400">
                Total Weight
              </span>
            </div>
            <p className="text-lg font-semibold text-primary-900 dark:text-primary-300">
              {getTotalWeight().toFixed(2)} kg
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Ruler className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-xs text-primary-700 dark:text-primary-400">
                Total Volume
              </span>
            </div>
            <p className="text-lg font-semibold text-primary-900 dark:text-primary-300">
              {getTotalVolume().toFixed(2)} m³
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-xs text-primary-700 dark:text-primary-400">
                Total Value
              </span>
            </div>
            <p className="text-lg font-semibold text-primary-900 dark:text-primary-300">
              AED {getTotalValue().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Additional Information & Review
        </h3>
      </div>

      <FormSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="insuranceRequired"
                checked={additionalInfo.insuranceRequired}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    insuranceRequired: e.target.checked,
                  })
                }
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
              />
              <FormLabel htmlFor="insuranceRequired" className="mb-0">
                Insurance Required
              </FormLabel>
            </div>
            {additionalInfo.insuranceRequired && (
              <FormInput
                type="number"
                placeholder="Insurance coverage amount (AED)"
                value={additionalInfo.insuranceValue}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    insuranceValue: e.target.value,
                  })
                }
                className="mt-2"
              />
            )}
          </FormField>

          <FormField>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="packagingRequired"
                checked={additionalInfo.packagingRequired}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    packagingRequired: e.target.checked,
                  })
                }
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-primary-500"
              />
              <FormLabel htmlFor="packagingRequired" className="mb-0">
                Packaging Service Required
              </FormLabel>
            </div>
            {additionalInfo.packagingRequired && (
              <FormSelect
                value={additionalInfo.packagingType}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    packagingType: e.target.value,
                  })
                }
                className="mt-2"
              >
                <option value="">Select packaging type</option>
                <option value="standard">Standard Packaging</option>
                <option value="bubble">Bubble Wrap</option>
                <option value="wooden">Wooden Crate</option>
                <option value="custom">Custom Packaging</option>
              </FormSelect>
            )}
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel htmlFor="notes">Additional Notes</FormLabel>
            <FormTextarea
              id="notes"
              rows={4}
              placeholder="Any additional information or special requirements"
              value={additionalInfo.notes}
              onChange={(e) =>
                setAdditionalInfo({ ...additionalInfo, notes: e.target.value })
              }
            />
          </FormField>

          <FormField className="md:col-span-2">
            <FormLabel>Attachments (Optional)</FormLabel>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Upload documents, photos, or packing lists
                    </span>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {file.name}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormField>
        </div>
      </FormSection>

      {/* Summary Review */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
          Inquiry Summary
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h5 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Service Details
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Service Type:
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {basicInfo.serviceType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Pickup Date:
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {basicInfo.pickupDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Urgency:
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {basicInfo.urgency}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h5 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Route
            </h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  From:
                </span>
                <p className="text-neutral-900 dark:text-white font-medium">
                  {pickupDetails.city}, {pickupDetails.emirate}
                </p>
              </div>
              <div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  To:
                </span>
                <p className="text-neutral-900 dark:text-white font-medium">
                  {deliveryDetails.city}, {deliveryDetails.emirate}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h5 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Cargo Summary
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Total Items:
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {cargoItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Total Weight:
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {getTotalWeight().toFixed(2)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Cargo Type:
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {cargoType}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h5 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Additional Services
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {additionalInfo.insuranceRequired ? (
                  <CheckCircle className="w-4 h-4 text-success-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-neutral-400" />
                )}
                <span className="text-neutral-900 dark:text-white">
                  Insurance
                </span>
              </div>
              <div className="flex items-center gap-2">
                {additionalInfo.packagingRequired ? (
                  <CheckCircle className="w-4 h-4 text-success-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-neutral-400" />
                )}
                <span className="text-neutral-900 dark:text-white">
                  Packaging Service
                </span>
              </div>
              <div className="flex items-center gap-2">
                {attachments.length > 0 ? (
                  <CheckCircle className="w-4 h-4 text-success-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-neutral-400" />
                )}
                <span className="text-neutral-900 dark:text-white">
                  {attachments.length} Attachment(s)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Create Shipment Inquiry
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Fill in the details below to request a shipment quote
            </p>
          </div>
          <button
            onClick={handlePrefill}
            className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Prefill Form
          </button>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="px-6 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <FormModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Inquiry Submitted Successfully!"
        maxWidth="max-w-md"
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            Your inquiry has been submitted
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Your inquiry number is:{" "}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {inquiryNumber}
            </span>
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            We will review your request and send you a quote within 2-4 hours.
            You will receive a notification once the quote is ready.
          </p>
        </div>

        <FormFooter>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            View My Inquiries
          </button>
          <button
            onClick={handleStartNew}
            className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
          >
            Create New Inquiry
          </button>
        </FormFooter>
      </FormModal>
    </div>
  );
}
