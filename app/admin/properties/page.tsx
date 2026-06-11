"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Plus, Search, Edit, Trash2, Eye, Building2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";

interface Property {
  id?: string;
  _id: string;
  title: string;
  referenceNumber: string;
  location: string;
  price: {
    amount: number;
    currency: string;
  };
  images: Array<{ url: string; isCover: boolean }>;
  status: string;
  propertyType: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  createdAt: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.getProperties({ limit: "500" });
      if (response.success) {
        setProperties(response.properties || response.data || []);
      } else {
        toast.error(response.message || "Failed to load properties");
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load properties",
      );
    } finally {
      setLoading(false);
    }
  };

  const propertyId = (p: Property) => String(p.id ?? p._id ?? "").trim();

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;

    try {
      setDeleting(true);
      const response = await api.deleteProperty(deleteTarget.id);
      if (!response.success) {
        toast.error(response.message || "Failed to delete property");
        return;
      }
      setProperties((prev) =>
        prev.filter((p) => propertyId(p) !== deleteTarget.id),
      );
      toast.success("Property deleted successfully");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete property:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete property",
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      property.title?.toLowerCase().includes(q) ||
      (property.referenceNumber ?? "").toLowerCase().includes(q) ||
      (property.location ?? "").toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === "all" || property.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Properties</h1>
          <p className="text-slate-500 mt-1">Manage your property listings</p>
        </div>
        <Button
          asChild
          className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white gap-2"
        >
          <Link href="/admin/properties/add">
            <Plus className="w-4 h-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search properties..."
            className="pl-9 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-50">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border-slate-200">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="for_sale">For Sale</SelectItem>
              <SelectItem value="for_rent">For Rent</SelectItem>
              <SelectItem value="off_plan">Off-Plan</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C1A06E]"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No properties found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Property</th>
                  <th className="p-4 font-semibold text-slate-600">Category</th>
                  <th className="p-4 font-semibold text-slate-600">Location</th>
                  <th className="p-4 font-semibold text-slate-600">
                    Price (AED)
                  </th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600">
                    Date Added
                  </th>
                  <th className="p-4 font-semibold text-slate-600 text-right sticky right-0 z-10 bg-slate-50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProperties.map((property) => {
                  const id = propertyId(property);
                  if (!id) return null;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                            {property.images?.[0]?.url ? (
                              <img
                                src={property.images[0].url}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">
                              {property.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 uppercase">
                              {property.referenceNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${
                            property.category === "for_sale"
                              ? "bg-green-100 text-green-700"
                              : property.category === "for_rent"
                                ? "bg-blue-100 text-blue-700"
                                : property.category === "off_plan"
                                  ? "bg-amber-100 text-amber-700"
                                  : property.category === "commercial"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {property.category
                            ? property.category.replace("_", " ")
                            : "N/A"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 capitalize">
                        {property.location?.replace(/_/g, " ") || "-"}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {(property.price?.amount ?? 0).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                            property.status === "available"
                              ? "bg-green-100 text-green-700"
                              : property.status === "sold"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-sm">
                        {property.createdAt
                          ? new Date(property.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="p-4 text-right sticky right-0 z-10 bg-white group-hover:bg-slate-50">
                        <div className="flex items-center justify-end gap-2">
                          <div className="hidden lg:flex items-center gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link
                                href={`/properties/${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/properties/edit/${id}`}>
                                <Edit className="mr-1 h-4 w-4" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() =>
                                setDeleteTarget({
                                  id,
                                  title: property.title,
                                })
                              }
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              Delete
                            </Button>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="lg:hidden"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/properties/${id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/properties/edit/${id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() =>
                                  setDeleteTarget({
                                    id,
                                    title: property.title,
                                  })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete property?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteTarget?.title}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
