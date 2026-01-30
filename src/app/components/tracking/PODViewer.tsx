import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  X,
  Check,
  MapPin,
  Clock,
  User,
  Download,
  Eye,
  Pen,
  Image as ImageIcon,
  FileSignature,
} from "lucide-react";
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormTextarea,
} from "../hb/common/Form";
import { toast } from "sonner";

export interface PODPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface PODData {
  id?: string;
  photos: PODPhoto[];
  signature?: string; // Base64 string
  recipientName: string;
  recipientPhone?: string;
  notes?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  deliveredBy?: string;
}

interface PODViewerProps {
  tripId: string;
  isEditable?: boolean;
  initialData?: PODData;
  onSubmit?: (data: PODData) => void;
  onClose?: () => void;
}

export function PODViewer({
  tripId,
  isEditable = false,
  initialData,
  onSubmit,
  onClose,
}: PODViewerProps) {
  const [photos, setPhotos] = useState<PODPhoto[]>(initialData?.photos || []);
  const [signature, setSignature] = useState<string | undefined>(initialData?.signature);
  const [recipientName, setRecipientName] = useState(initialData?.recipientName || "");
  const [recipientPhone, setRecipientPhone] = useState(initialData?.recipientPhone || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState<PODPhoto | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Signature drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#174B7C";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    setSignature(dataUrl);
    setShowSignatureModal(false);
    toast.success("Signature captured successfully!");
  };

  // Photo upload handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto: PODPhoto = {
          id: `photo-${Date.now()}-${Math.random()}`,
          url: event.target?.result as string,
          uploadedAt: new Date().toISOString(),
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });

    toast.success(`${files.length} photo(s) uploaded successfully!`);
  };

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    toast.success("Photo removed");
  };

  // Get current GPS coordinates
  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            // Return mock coordinates if geolocation fails
            resolve({
              latitude: 25.2048,
              longitude: 55.2708,
            });
          }
        );
      } else {
        // Return mock coordinates if geolocation not supported
        resolve({
          latitude: 25.2048,
          longitude: 55.2708,
        });
      }
    });
  };

  const handleSubmit = async () => {
    if (!recipientName.trim()) {
      toast.error("Recipient name is required");
      return;
    }

    if (photos.length === 0) {
      toast.error("At least one photo is required");
      return;
    }

    if (!signature) {
      toast.error("Signature is required");
      return;
    }

    const gpsCoordinates = await getCurrentLocation();

    const podData: PODData = {
      id: initialData?.id || `POD-${Date.now()}`,
      photos,
      signature,
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim() || undefined,
      notes: notes.trim() || undefined,
      gpsCoordinates,
      timestamp: new Date().toISOString(),
      deliveredBy: "Current Driver", // This should come from authenticated user
    };

    if (onSubmit) {
      onSubmit(podData);
    }

    toast.success("Proof of Delivery submitted successfully!");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // View-only mode (POD already submitted)
  if (!isEditable && initialData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 dark:bg-success-900/40 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-success-900 dark:text-success-300">
                Delivery Confirmed
              </p>
              <p className="text-xs text-success-700 dark:text-success-400">
                {formatTimestamp(initialData.timestamp)}
              </p>
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
            Recipient Information
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Name</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {initialData.recipientName}
              </p>
            </div>
            {initialData.recipientPhone && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Phone</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {initialData.recipientPhone}
                </p>
              </div>
            )}
            {initialData.gpsCoordinates && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg col-span-2">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">GPS Coordinates</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {initialData.gpsCoordinates.latitude.toFixed(6)}, {initialData.gpsCoordinates.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photos */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
            Delivery Photos ({initialData.photos.length})
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {initialData.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 cursor-pointer hover:border-primary-500 transition-colors"
                onClick={() => setShowPhotoPreview(photo)}
              >
                <img
                  src={photo.url}
                  alt="Delivery proof"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature */}
        {initialData.signature && (
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Recipient Signature
            </h4>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border-2 border-neutral-200 dark:border-neutral-800">
              <img
                src={initialData.signature}
                alt="Signature"
                className="max-w-xs mx-auto"
              />
            </div>
          </div>
        )}

        {/* Notes */}
        {initialData.notes && (
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Delivery Notes
            </h4>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {initialData.notes}
              </p>
            </div>
          </div>
        )}

        {/* Photo Preview Modal */}
        {showPhotoPreview && (
          <FormModal
            isOpen={true}
            onClose={() => setShowPhotoPreview(null)}
            title="Photo Preview"
            maxWidth="max-w-3xl"
          >
            <img
              src={showPhotoPreview.url}
              alt="Delivery proof"
              className="w-full rounded-lg"
            />
            <FormFooter>
              <button
                onClick={() => setShowPhotoPreview(null)}
                className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </FormFooter>
          </FormModal>
        )}
      </div>
    );
  }

  // Editable mode (Create/Edit POD)
  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="p-4 bg-info-50 dark:bg-info-900/20 rounded-lg border border-info-200 dark:border-info-800">
        <div className="flex items-start gap-3">
          <FileSignature className="w-5 h-5 text-info-600 dark:text-info-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-info-900 dark:text-info-300 mb-1">
              Complete Proof of Delivery
            </p>
            <p className="text-xs text-info-700 dark:text-info-400">
              Please capture delivery photos, collect recipient signature, and confirm delivery details.
            </p>
          </div>
        </div>
      </div>

      {/* Recipient Information */}
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
          Recipient Information
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormLabel required>Recipient Name</FormLabel>
            <FormInput
              name="recipientName"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter recipient name"
              required
            />
          </FormField>
          <FormField>
            <FormLabel>Recipient Phone</FormLabel>
            <FormInput
              name="recipientPhone"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="+971 XX XXX XXXX"
            />
          </FormField>
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
          Delivery Photos <span className="text-danger-600">*</span>
        </h4>
        <div className="grid grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 group"
            >
              <img
                src={photo.url}
                alt="Delivery proof"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-danger-600 hover:bg-danger-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors flex flex-col items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs font-medium">Add Photo</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
          Upload photos of the delivered package and delivery location
        </p>
      </div>

      {/* Signature */}
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
          Recipient Signature <span className="text-danger-600">*</span>
        </h4>
        {signature ? (
          <div className="relative">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border-2 border-neutral-200 dark:border-neutral-800">
              <img src={signature} alt="Signature" className="max-w-xs mx-auto" />
            </div>
            <button
              onClick={() => {
                setSignature(undefined);
                setShowSignatureModal(true);
              }}
              className="absolute top-2 right-2 px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-900 border border-primary-200 dark:border-primary-800 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center gap-1.5"
            >
              <Pen className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSignatureModal(true)}
            className="w-full p-6 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors flex flex-col items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Pen className="w-6 h-6" />
            <span className="text-sm font-medium">Capture Signature</span>
          </button>
        )}
      </div>

      {/* Notes */}
      <FormField>
        <FormLabel>Delivery Notes</FormLabel>
        <FormTextarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes about the delivery..."
          rows={3}
        />
      </FormField>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Submit POD
        </button>
      </div>

      {/* Signature Modal */}
      <FormModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        title="Capture Signature"
        description="Ask the recipient to sign below"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="border-2 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full cursor-crosshair touch-none"
              style={{ touchAction: "none" }}
            />
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
            Draw the signature above using your mouse or finger
          </p>
        </div>

        <FormFooter>
          <button
            onClick={clearSignature}
            className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setShowSignatureModal(false)}
            className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveSignature}
            className="px-4 py-2 text-sm font-medium text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Signature
          </button>
        </FormFooter>
      </FormModal>
    </div>
  );
}
