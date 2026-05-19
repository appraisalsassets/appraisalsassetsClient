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
import { Edit, Trash2 } from "lucide-react";

interface TrustedPartner {
  _id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

const initialForm = {
  name: "",
  websiteUrl: "",
  displayOrder: "0",
  isActive: true,
};

export default function AdminTrustedPartnersPage() {
  const [partners, setPartners] = useState<TrustedPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [form, setForm] = useState(initialForm);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await api.getTrustedPartnersAdmin();
      if (response.success) {
        setPartners(response.partners || []);
      }
    } catch (error) {
      console.error("Failed to fetch trusted partners:", error);
      toast.error("Failed to load trusted partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setLogoFile(null);
  };

  const startEdit = (partner: TrustedPartner) => {
    setEditingId(partner._id);
    setForm({
      name: partner.name || "",
      websiteUrl: partner.websiteUrl || "",
      displayOrder: String(partner.displayOrder ?? 0),
      isActive: partner.isActive !== false,
    });
    setLogoFile(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Partner name is required");
      return;
    }
    if (!editingId && !logoFile) {
      toast.error("Logo image is required");
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("websiteUrl", form.websiteUrl.trim());
      data.append("displayOrder", form.displayOrder || "0");
      data.append("isActive", String(form.isActive));
      if (logoFile) data.append("logo", logoFile);

      const response = editingId
        ? await api.updateTrustedPartner(editingId, data)
        : await api.createTrustedPartner(data);

      if (!response.success) {
        toast.error(response.message || "Failed to save partner");
        return;
      }

      toast.success(editingId ? "Partner updated" : "Partner created");
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error("Save trusted partner error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save partner",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.deleteTrustedPartner(id);
      if (!response.success) {
        toast.error(response.message || "Failed to delete partner");
        return;
      }
      toast.success("Partner deleted");
      if (editingId === id) resetForm();
      fetchPartners();
    } catch (error) {
      toast.error("Failed to delete partner");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Trusted Partners</h1>
        <p className="mt-1 text-slate-600">
          Upload partner logos shown on the public Trusted Partners page only
          (separate from Off-Plan Developers).
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {editingId ? "Edit partner" : "Add partner"}
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Partner name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. RERA, Bank partner"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="logo">Logo *</Label>
              <p className="mb-2 text-xs text-slate-500">
                Square PNG or SVG recommended. Shown on /trusted-partners only.
              </p>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website (optional)</Label>
              <Input
                id="websiteUrl"
                value={form.websiteUrl}
                onChange={(e) =>
                  setForm({ ...form, websiteUrl: e.target.value })
                }
                placeholder="https://"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="displayOrder">Display order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm({ ...form, displayOrder: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                  />
                  Active on site
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#C1A06E] hover:bg-[#a88b5e]"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Add partner"}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Current partners
          </h2>
          {loading ? (
            <p className="text-slate-500">Loading…</p>
          ) : partners.length === 0 ? (
            <p className="text-slate-500">No trusted partners yet.</p>
          ) : (
            <ul className="space-y-3">
              {partners.map((partner) => (
                <li
                  key={partner._id}
                  className="flex items-center gap-4 rounded-lg border border-slate-100 p-3"
                >
                  <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded border bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{partner.name}</p>
                    <p className="text-xs text-slate-500">
                      Order {partner.displayOrder ?? 0}
                      {partner.isActive === false ? " · Hidden" : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => startEdit(partner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete partner?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Remove {partner.name} from the trusted partners
                            page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(partner._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
