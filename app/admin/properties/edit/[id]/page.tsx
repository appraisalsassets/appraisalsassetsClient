'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Upload, 
  X,
  Building2,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FALLBACK_PROPERTY_OPTIONS,
  normalizeSelectOptions,
  SelectOption,
  withCurrentSelectOption,
} from "@/constants/form-options";
import { isOffPlanCategory } from "@/lib/propertyCategory";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ url: string; isCover: boolean }>>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingPdf, setExistingPdf] = useState<{ url: string; fileName: string } | null>(null);
  const [removePdf, setRemovePdf] = useState(false);
  const [developers, setDevelopers] = useState<
    Array<{ _id: string; name: string; slug: string }>
  >([]);
  const [formOptions, setFormOptions] = useState<{
    categories: SelectOption[];
    propertyTypes: SelectOption[];
    statuses: SelectOption[];
    amenities: SelectOption[];
    locations: SelectOption[];
  }>({
    categories: FALLBACK_PROPERTY_OPTIONS.categories,
    propertyTypes: FALLBACK_PROPERTY_OPTIONS.propertyTypes,
    statuses: FALLBACK_PROPERTY_OPTIONS.statuses,
    amenities: FALLBACK_PROPERTY_OPTIONS.amenities,
    locations: FALLBACK_PROPERTY_OPTIONS.locations,
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'for_sale',
    propertyType: 'apartment',
    location: 'downtown_dubai',
    status: 'available',
    price: '',
    sizeSqft: '',
    bedrooms: '',
    bathrooms: '',
    referenceNumber: '',
    isFeatured: false,
    isActive: true,
    phone: '',
    whatsAppNumber: '',
    contactEmail: '',
    developerName: '',
    developerSlug: '',
    amenities: [] as string[],
  });

  useEffect(() => {
  if (!id) return;
  fetchDevelopers();
  fetchProperty();
}, [id]);

  const fetchDevelopers = async () => {
    try {
      const [developersResponse, optionsResponse] = await Promise.all([
        api.getDevelopersAdmin(),
        api.getPropertyFormOptions(),
      ]);
      if (developersResponse.success && developersResponse.developers) {
        setDevelopers(developersResponse.developers);
      }
      if (optionsResponse.success && optionsResponse.data) {
        const data = optionsResponse.data;
        setFormOptions({
          categories: normalizeSelectOptions(
            data.categories,
            FALLBACK_PROPERTY_OPTIONS.categories,
          ),
          propertyTypes: normalizeSelectOptions(
            data.propertyTypes,
            FALLBACK_PROPERTY_OPTIONS.propertyTypes,
          ),
          statuses: normalizeSelectOptions(
            data.statuses,
            FALLBACK_PROPERTY_OPTIONS.statuses,
          ),
          amenities: normalizeSelectOptions(
            data.amenities,
            FALLBACK_PROPERTY_OPTIONS.amenities,
          ),
          locations: normalizeSelectOptions(
            data.locations,
            FALLBACK_PROPERTY_OPTIONS.locations,
          ),
        });
      }
    } catch (error) {
      console.error("Failed to fetch form options:", error);
    }
  };

  const fetchProperty = async () => {
    try {
      const response = await api.getProperty(id);
      if (response.success) {
        const p = response.data || response.property;
        if (!p) {
          toast.error("Property not found");
          return;
        }
        setFormData({
          title: p.title || '',
          description: p.description || '',
          category: p.category || 'for_sale',
          propertyType: p.propertyType || 'apartment',
          location: p.location || 'downtown_dubai',
          status: p.status || 'available',
          price: p.price?.amount?.toString() || '',
          sizeSqft: p.sizeSqft?.toString() || '',
          bedrooms: p.bedrooms?.toString() || '',
          bathrooms: p.bathrooms?.toString() || '',
          referenceNumber: p.referenceNumber || '',
          isFeatured: p.isFeatured || false,
          isActive: p.isActive || true,
          phone: p.phone || '',
          whatsAppNumber: p.whatsAppNumber || '',
          contactEmail: p.contactEmail || '',
          developerName: p.developerName || '',
          developerSlug: p.developerSlug || '',
          amenities: p.amenities || [],
        });
        setExistingImages(
  (p.images || []).map((img: any) =>
    typeof img === "string"
      ? { url: img, isCover: false }
      : img
  )
);
        if (p.documentPdf?.url) {
          setExistingPdf({
            url: p.documentPdf.url,
            fileName: p.documentPdf.fileName || "property-brochure.pdf",
          });
        } else {
          setExistingPdf(null);
        }
        setRemovePdf(false);
        setPdfFile(null);
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
      toast.error('Failed to load property details');
      router.push('/admin/properties');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "category" && !isOffPlanCategory(value)) {
        next.developerName = "";
        next.developerSlug = "";
      }
      return next;
    });
  };

  const handleDeveloperSelect = (value: string) => {
    if (value === "none") {
      setFormData((prev) => ({
        ...prev,
        developerName: "",
        developerSlug: "",
      }));
      return;
    }
    const selected = developers.find((developer) => developer.slug === value);
    setFormData((prev) => ({
      ...prev,
      developerSlug: value,
      developerName: selected?.name || "",
      category: "off_plan",
    }));
    toast.info(
      "Category set to Off-Plan so this property appears under the developer.",
    );
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "category" && !isOffPlanCategory(value)) {
      setFormData((prev) => ({
        ...prev,
        category: value,
        developerName: "",
        developerSlug: "",
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      toast.error("Please enter a valid image URL (http/https)");
      return;
    }
    setImageUrls((prev) => [...prev, url]);
    setImageUrlInput("");
  };

  const removeImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isOffPlanCategory(formData.category) && !formData.developerSlug) {
        toast.error("Please select a developer for off-plan properties");
        setLoading(false);
        return;
      }

      const data = new FormData();
      
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'amenities' && Array.isArray(value)) {
          value.forEach((item) => data.append('amenities', item));
          return;
        }
        data.append(key, String(value));
      });
      // Append new images
      images.forEach(image => {
        data.append('images', image);
      });
      if (imageUrls.length > 0) {
        data.append("imageUrls", JSON.stringify(imageUrls));
      }
      if (pdfFile) {
        data.append("documentPdf", pdfFile);
      }
      if (removePdf) {
        data.append("removeDocumentPdf", "true");
      }

      const response = await api.updateProperty(id, data);
      
      if (response.success) {
        toast.success('Property updated successfully');
        router.push('/admin/properties');
      } else {
        toast.error(response.message || 'Failed to update property');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C1A06E]"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
         <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/properties">
              <ArrowLeft className="w-5 h-5" />
            </Link>
         </Button>
         <h1 className="text-2xl font-bold text-slate-900">Edit Property</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
            
            <div className="space-y-2">
              <Label>Property Title *</Label>
              <Input 
                name="title" 
                placeholder="e.g. Luxury 3BR Apartment in Dubai Marina" 
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <textarea 
                name="description" 
                className="w-full min-h-[120px] rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1A06E]/20 focus:border-[#C1A06E]"
                placeholder="Detailed property description..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-semibold text-slate-900">Category *</Label>
                <Input
                  name="category"
                  placeholder="e.g. for_sale or For Sale"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-900">Property Type *</Label>
                <Input
                  name="propertyType"
                  placeholder="e.g. apartment or Apartment"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-900">
                  Developer
                  {isOffPlanCategory(formData.category) ? " *" : " (optional)"}
                </Label>
                <Select
                  value={formData.developerSlug || "none"}
                  onValueChange={handleDeveloperSelect}
                >
                  <SelectTrigger className="w-full bg-white border-slate-200">
                    <SelectValue placeholder="Select Developer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No developer</SelectItem>
                    {developers.map((developer) => (
                      <SelectItem key={developer._id} value={developer.slug}>
                        {developer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {developers.length === 0 && (
                  <p className="text-xs text-amber-700">
                    No developers found. Add one under Admin → Developers.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-900">Location *</Label>
                <Input
                  name="location"
                  placeholder="e.g. downtown_dubai or Downtown Dubai"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-900">Status</Label>
                <Input
                  name="status"
                  placeholder="e.g. Available, Sold, Under Offer"
                  value={formData.status}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (AED) *</Label>
                <Input 
                  name="price" 
                  type="number" 
                  placeholder="0" 
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Size (sqft)</Label>
                <Input 
                  name="sizeSqft" 
                  type="number" 
                  placeholder="0" 
                  value={formData.sizeSqft}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Reference Number</Label>
                <Input 
                  name="referenceNumber" 
                  placeholder="Auto-generated if empty" 
                  value={formData.referenceNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input 
                  name="bedrooms" 
                  type="number" 
                  placeholder="0" 
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Input 
                  name="bathrooms" 
                  type="number" 
                  placeholder="0" 
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  name="phone" 
                  placeholder="+971 50 000 0000" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>WhatsApp Number</Label>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, whatsAppNumber: prev.phone }))}
                    className="text-xs text-[#C1A06E] hover:underline font-medium"
                  >
                    Same as Phone
                  </button>
                </div>
                <Input 
                  name="whatsAppNumber" 
                  placeholder="+971 50 000 0000" 
                  value={formData.whatsAppNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-slate-900">Contact Email</Label>
                <Input
                  name="contactEmail"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Amenities</h2>
            
            <div className="flex flex-wrap gap-2">
              {formOptions.amenities.map((amenity) => (
                <button
                  key={amenity.value}
                  type="button"
                  onClick={() => {
                     const isSelected = formData.amenities.includes(amenity.value);
                     setFormData(prev => ({
                       ...prev,
                       amenities: isSelected 
                        ? prev.amenities.filter(a => a !== amenity.value)
                        : [...prev.amenities, amenity.value]
                     }));
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.amenities.includes(amenity.value)
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {amenity.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Images</h2>
            
             {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Existing Images</p>
                <div className="grid grid-cols-3 gap-2">
                   {existingImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden">
                      <img src={img.url} alt="Existing" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Click to upload new images</p>
            </div>

            {previews.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-2">New Images</p>
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden group">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Add Image via URL
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/property-image.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={addImageUrl}>
                  Add
                </Button>
              </div>
              {imageUrls.length > 0 && (
                <div className="mt-3 space-y-2">
                  {imageUrls.map((url, idx) => (
                    <div
                      key={`${url}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2"
                    >
                      <span className="text-xs text-slate-600 truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeImageUrl(idx)}
                        className="text-red-500 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Property brochure (PDF)
            </h2>
            {existingPdf && !removePdf && !pdfFile && (
              <div className="mb-3 flex items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2">
                <span className="text-xs text-slate-600 truncate flex items-center gap-2">
                  <FileText className="w-4 h-4 shrink-0 text-[#C1A06E]" />
                  {existingPdf.fileName}
                </span>
                <button
                  type="button"
                  onClick={() => setRemovePdf(true)}
                  className="text-red-500 text-xs font-medium shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative">
              <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  setPdfFile(e.target.files?.[0] || null);
                  setRemovePdf(false);
                }}
              />
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">
                {existingPdf && !removePdf ? "Replace PDF" : "Upload PDF (max 15MB)"}
              </p>
            </div>
            {pdfFile && (
              <div className="mt-3 flex items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2">
                <span className="text-xs text-slate-600 truncate">{pdfFile.name}</span>
                <button
                  type="button"
                  onClick={() => setPdfFile(null)}
                  className="text-red-500 text-xs font-medium shrink-0"
                >
                  Clear new file
                </button>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="cursor-pointer">Featured Property</Label>
                <div 
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-1 ${formData.isFeatured ? 'bg-[#C1A06E]' : 'bg-slate-200'}`}
                  onClick={() => handleSwitchChange('isFeatured', !formData.isFeatured)}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.isFeatured ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active" className="cursor-pointer">Active Listing</Label>
                <div 
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-1 ${formData.isActive ? 'bg-[#C1A06E]' : 'bg-slate-200'}`}
                  onClick={() => handleSwitchChange('isActive', !formData.isActive)}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-[#C1A06E] hover:bg-[#a88b5e] text-white py-6 text-base"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Property'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full py-6 text-base"
              onClick={() => router.back()}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
