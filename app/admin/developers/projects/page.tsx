"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Plus, Trash2, X, Building2, MapPin, Home } from "lucide-react";

interface Developer {
  id?: string;
  _id: string;
  name: string;
  slug: string;
}

function developerId(developer: Developer) {
  return String(developer.id ?? developer._id ?? "");
}

function mapPropertyToProject(property: Record<string, any>): DeveloperProject {
  const size = Number(property.sizeSqft) || 0;
  const imageList = (property.images || []).map((img: { url?: string } | string) =>
    typeof img === "string" ? img : img.url || "",
  );

  return {
    _id: String(property.id ?? property._id ?? ""),
    title: property.title || "",
    description: property.description || "",
    developerId: "",
    developerName: property.developerName || "",
    developerSlug: property.developerSlug || "",
    location: property.location || "",
    propertyType: property.propertyType || "",
    price: property.price || { amount: 0, currency: "AED" },
    sizeFrom: size,
    sizeTo: size,
    bedroomsFrom: property.bedrooms,
    bedroomsTo: property.bedrooms,
    status: property.status || "available",
    images: imageList.filter(Boolean),
    featured: Boolean(property.isFeatured),
    completionDate: "",
    handoverDate: "",
    amenities: property.amenities || [],
    email: property.contactEmail || "",
    createdAt: property.createdAt || "",
    updatedAt: property.updatedAt || "",
  };
}

interface DeveloperProject {
  _id: string;
  title: string;
  description: string;
  developerId: string;
  developerName: string;
  developerSlug: string;
  location: string;
  propertyType: string;
  price: {
    amount: number;
    currency: string;
  };
  sizeFrom: number;
  sizeTo: number;
  bedroomsFrom?: number;
  bedroomsTo?: number;
  status: string;
  images: string[];
  featured: boolean;
  completionDate?: string;
  handoverDate?: string;
  amenities: string[];
  email?: string;
  createdAt: string;
  updatedAt: string;
}

const initialForm = {
  title: "",
  description: "",
  developerId: "",
  location: "",
  propertyType: "",
  priceAmount: "",
  currency: "AED",
  sizeFrom: "",
  sizeTo: "",
  bedroomsFrom: "",
  bedroomsTo: "",
  status: "upcoming",
  completionDate: "",
  handoverDate: "",
  amenities: "",
  featured: false,
  email: "",
};

export default function AdminDeveloperProjectsPage() {
  const [projects, setProjects] = useState<DeveloperProject[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, developersRes] = await Promise.all([
        api.getProperties({ category: "off_plan", limit: "500" }),
        api.getDevelopersAdmin(),
      ]);

      if (projectsRes.success) {
        const list = projectsRes.properties || projectsRes.data || [];
        setProjects(
          (Array.isArray(list) ? list : []).map((item) =>
            mapPropertyToProject(item),
          ),
        );
      }

      if (developersRes.success) {
        setDevelopers(developersRes.developers || []);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch data",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFiles([]);
    setImagePreviews([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.developerId) {
      toast.error("Please select a developer");
      return;
    }

    const selectedDeveloper = developers.find(
      (developer) => developerId(developer) === form.developerId,
    );
    if (!selectedDeveloper) {
      toast.error("Selected developer was not found");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      const locationKey =
        form.location
          .trim()
          .toLowerCase()
          .replace(/[\s-]+/g, "_")
          .replace(/[^a-z0-9_]/g, "") || "downtown_dubai";

      const descriptionParts = [form.description.trim()];
      if (form.completionDate) {
        descriptionParts.push(`Completion: ${form.completionDate}`);
      }
      if (form.handoverDate) {
        descriptionParts.push(`Handover: ${form.handoverDate}`);
      }

      const propertyStatus =
        form.status === "sold_out"
          ? "sold"
          : form.status === "upcoming" || form.status === "under_construction"
            ? "available"
            : form.status;

      formData.append("title", form.title.trim());
      formData.append("description", descriptionParts.filter(Boolean).join("\n\n"));
      formData.append("category", "off_plan");
      formData.append("propertyType", form.propertyType === "mixed" ? "apartment" : form.propertyType);
      formData.append("location", locationKey);
      formData.append("status", propertyStatus);
      formData.append("price", form.priceAmount);
      formData.append("sizeSqft", form.sizeFrom || form.sizeTo);
      formData.append("bedrooms", form.bedroomsFrom || form.bedroomsTo || "0");
      formData.append("bathrooms", "0");
      formData.append("developerName", selectedDeveloper.name);
      formData.append("developerSlug", selectedDeveloper.slug);
      formData.append("isFeatured", String(form.featured));
      formData.append("isActive", "true");
      formData.append("phone", "+971500000000");
      formData.append("whatsAppNumber", "+971500000000");
      if (form.email) formData.append("contactEmail", form.email);
      if (form.amenities) {
        form.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .forEach((amenity) => formData.append("amenities", amenity));
      }

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = editingId
        ? await api.updateProperty(editingId, formData)
        : await api.createProperty(formData);

      if (response.success) {
        toast.success(
          editingId
            ? "Project updated successfully"
            : "Project created successfully",
        );
        resetForm();
        fetchData();
      } else {
        toast.error(response.message || "Failed to save project");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save project",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: DeveloperProject) => {
    const linkedDeveloper = developers.find(
      (developer) => developer.slug === project.developerSlug,
    );

    setForm({
      title: project.title,
      description: project.description,
      developerId: linkedDeveloper ? developerId(linkedDeveloper) : project.developerId,
      location: project.location,
      propertyType: project.propertyType,
      priceAmount: String(project.price.amount),
      currency: project.price.currency,
      sizeFrom: String(project.sizeFrom),
      sizeTo: String(project.sizeTo),
      bedroomsFrom: project.bedroomsFrom ? String(project.bedroomsFrom) : "",
      bedroomsTo: project.bedroomsTo ? String(project.bedroomsTo) : "",
      status: project.status,
      completionDate: project.completionDate || "",
      handoverDate: project.handoverDate || "",
      amenities: project.amenities.join(", "),
      featured: project.featured,
      email: project.email || "",
    });
    setImagePreviews(project.images);
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.deleteProperty(id);
      if (response.success) {
        toast.success("Project deleted successfully");
        fetchData();
      } else {
        toast.error(response.message || "Failed to delete project");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project",
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const selectedDeveloper = developers.find((d) => d._id === form.developerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1A06E]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Developer Projects
          </h1>
          <p className="text-slate-600 mt-1">
            Manage developer projects and listings
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No projects found
            </h3>
            <p className="text-slate-600 mb-4">
              Start by adding your first developer project
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Project
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Developer
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Location
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Type
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Price
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {project.images[0] && (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium text-slate-900">
                            {project.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            {project.sizeFrom} - {project.sizeTo} sqft
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-900">
                        {project.developerName}
                      </div>
                      <div className="text-sm text-slate-500">
                        {project.developerSlug}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {project.propertyType}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">
                        {project.price.currency}{" "}
                        {project.price.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === "available"
                            ? "bg-green-100 text-green-700"
                            : project.status === "upcoming"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Project
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {project.title}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingId ? "Edit Project" : "Add New Project"}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Project Title *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Developer *</Label>
                  <Select
                    value={form.developerId}
                    onValueChange={(value) =>
                      setForm({ ...form, developerId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select developer" />
                    </SelectTrigger>
                    <SelectContent>
                      {developers.map((developer) => (
                        <SelectItem
                          key={developerId(developer)}
                          value={developerId(developer)}
                        >
                          {developer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Description *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the project..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Location *</Label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Downtown Dubai, JVC, etc."
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Property Type *</Label>
                  <Select
                    value={form.propertyType}
                    onValueChange={(value) =>
                      setForm({ ...form, propertyType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="mixed">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Price Amount *</Label>
                  <Input
                    type="number"
                    value={form.priceAmount}
                    onChange={(e) =>
                      setForm({ ...form, priceAmount: e.target.value })
                    }
                    placeholder="1000000"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select
                    value={form.currency}
                    onValueChange={(value) =>
                      setForm({ ...form, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm({ ...form, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="sold_out">Sold Out</SelectItem>
                      <SelectItem value="under_construction">
                        Under Construction
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label>Size From (sqft) *</Label>
                  <Input
                    type="number"
                    value={form.sizeFrom}
                    onChange={(e) =>
                      setForm({ ...form, sizeFrom: e.target.value })
                    }
                    placeholder="500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Size To (sqft) *</Label>
                  <Input
                    type="number"
                    value={form.sizeTo}
                    onChange={(e) =>
                      setForm({ ...form, sizeTo: e.target.value })
                    }
                    placeholder="2000"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Bedrooms From</Label>
                  <Input
                    type="number"
                    value={form.bedroomsFrom}
                    onChange={(e) =>
                      setForm({ ...form, bedroomsFrom: e.target.value })
                    }
                    placeholder="1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Bedrooms To</Label>
                  <Input
                    type="number"
                    value={form.bedroomsTo}
                    onChange={(e) =>
                      setForm({ ...form, bedroomsTo: e.target.value })
                    }
                    placeholder="3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Completion Date</Label>
                  <Input
                    type="date"
                    value={form.completionDate}
                    onChange={(e) =>
                      setForm({ ...form, completionDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Handover Date</Label>
                  <Input
                    type="date"
                    value={form.handoverDate}
                    onChange={(e) =>
                      setForm({ ...form, handoverDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Amenities (comma-separated)</Label>
                <Input
                  value={form.amenities}
                  onChange={(e) =>
                    setForm({ ...form, amenities: e.target.value })
                  }
                  placeholder="Swimming Pool, Gym, Parking, Security"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contact@developer.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Project Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="rounded border-slate-300"
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#C1A06E] hover:bg-[#a88b5e] text-white"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Project"
                      : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
