"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Edit, Plus, Trash2, X } from "lucide-react";

interface Developer {
  id?: string;
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  about?: string;
  focus?: string;
  logo?: string;
  heroImage?: string;
  communities?: string[];
  displayOrder?: number;
  isActive?: boolean;
  projectsCount?: number;
}

const initialForm = {
  name: "",
  shortDescription: "",
  about: "",
  focus: "",
  communities: "",
  displayOrder: "0",
  isActive: true,
};

function developerId(developer: Developer) {
  return String(developer.id ?? developer._id ?? "");
}

export default function AdminDevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [form, setForm] = useState(initialForm);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const response = await api.getDevelopersAdmin();
      if (response.success) {
        setDevelopers(response.developers || []);
      }
    } catch (error) {
      console.error("Failed to fetch developers:", error);
      toast.error("Failed to load developers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setLogoFile(null);
    setHeroFile(null);
  };

  const startEdit = (developer: Developer) => {
    setEditingId(developerId(developer));
    setForm({
      name: developer.name || "",
      shortDescription: developer.shortDescription || "",
      about: developer.about || "",
      focus: developer.focus || "",
      communities: (developer.communities || []).join(", "),
      displayOrder: String(developer.displayOrder || 0),
      isActive: developer.isActive !== false,
    });
    setLogoFile(null);
    setHeroFile(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Developer name is required");
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("shortDescription", form.shortDescription);
      data.append("about", form.about);
      data.append("focus", form.focus);
      data.append("communities", form.communities);
      data.append("displayOrder", form.displayOrder || "0");
      data.append("isActive", String(form.isActive));
      if (logoFile) data.append("logo", logoFile);
      if (heroFile) data.append("heroImage", heroFile);

      const response = editingId
        ? await api.updateDeveloper(editingId, data)
        : await api.createDeveloper(data);

      if (!response.success) {
        toast.error(response.message || "Failed to save developer");
        return;
      }

      toast.success(editingId ? "Developer updated" : "Developer created");
      resetForm();
      fetchDevelopers();
    } catch (error) {
      console.error("Save developer error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save developer",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.deleteDeveloper(id);
      if (!response.success) {
        toast.error(response.message || "Failed to delete developer");
        return;
      }
      toast.success("Developer deleted");
      fetchDevelopers();
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Delete developer error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete developer",
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Off-Plan Developers</h1>
        <p className="text-slate-500 mt-1">
          Manage developers shown on public off-plan pages
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Loading developers...</div>
          ) : developers.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              No developers created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-slate-600 font-semibold">Developer</th>
                    <th className="p-4 text-slate-600 font-semibold">Projects</th>
                    <th className="p-4 text-slate-600 font-semibold">Status</th>
                    <th className="p-4 text-right text-slate-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {developers.map((developer) => (
                    <tr key={developerId(developer)} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {developer.logo ? (
                            <img
                              src={developer.logo}
                              alt={developer.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200" />
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{developer.name}</p>
                            <p className="text-xs text-slate-500">/{developer.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-700">{developer.projectsCount || 0}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-medium ${
                            developer.isActive !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {developer.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => startEdit(developer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete developer?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This removes the developer profile. Linked off-plan properties
                                  will remain but lose profile matching.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(developerId(developer))}
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

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit Developer" : "Add Developer"}
            </h2>
            {editingId && (
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Taraf Development"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Short Description</Label>
              <Input
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, shortDescription: e.target.value }))
                }
                placeholder="One-line summary"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Focus</Label>
              <Input
                value={form.focus}
                onChange={(e) => setForm((prev) => ({ ...prev, focus: e.target.value }))}
                placeholder="e.g. Luxury waterfront communities"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Communities (comma separated)</Label>
              <Input
                value={form.communities}
                onChange={(e) => setForm((prev) => ({ ...prev, communities: e.target.value }))}
                placeholder="Downtown Dubai, JVC, Business Bay"
              />
            </div>

            <div className="space-y-1.5">
              <Label>About</Label>
              <textarea
                className="w-full min-h-[90px] rounded-md border border-slate-200 p-3 text-sm"
                value={form.about}
                onChange={(e) => setForm((prev) => ({ ...prev, about: e.target.value }))}
                placeholder="Longer company profile text for the developer detail page"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm w-full"
                  value={String(form.isActive)}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.value === "true" }))
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Logo</Label>
              <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-1.5">
              <Label>Hero Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-[#C1A06E] hover:bg-[#a88b5e] text-white mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : editingId ? "Update Developer" : "Create Developer"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
