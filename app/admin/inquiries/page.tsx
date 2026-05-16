"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Search, Phone, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

function formatInquiryDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  inquiry_type: string;
  property_title?: string;
  property_reference?: string;
  message?: string;
  created_date: Date | string;
  assigned_to?: string;
}

export default function AdminInquiriesUI() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null);

  const fetchInquiries = useCallback(
    async (search: string, status: string) => {
      try {
        const params: Record<string, string> = { limit: "100" };
        if (search.trim()) params.search = search.trim();
        if (status !== "all") params.status = status;
        const response = await api.getInquiries(params);

        if (response.success) {
          const list = response.data || [];
          setInquiries(list);
          setFilteredInquiries(list);
        }
      } catch (error: unknown) {
        console.error("Failed to fetch inquiries:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load inquiries",
        );
      }
    },
    [],
  );

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    void fetchInquiries(debouncedSearch, filterStatus);
  }, [debouncedSearch, filterStatus, fetchInquiries]);

  const handleStatusUpdate = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await api.updateInquiry(inquiryId, {
        status: newStatus,
      });

      if (response.success) {
        setInquiries(
          inquiries.map((i) =>
            i.id === inquiryId ? { ...i, status: newStatus } : i,
          ),
        );
        setFilteredInquiries(
          filteredInquiries.map((i) =>
            i.id === inquiryId ? { ...i, status: newStatus } : i,
          ),
        );
        toast.success("Inquiry status updated");
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Failed to update inquiry:", error);
      toast.error(error.message || "Failed to update inquiry");
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    setInquiryToDelete(inquiryId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteInquiry = async () => {
    if (!inquiryToDelete) return;

    try {
      const response = await api.deleteInquiry(inquiryToDelete);

      if (response.success) {
        setInquiries(inquiries.filter((i) => i.id !== inquiryToDelete));
        setFilteredInquiries(
          filteredInquiries.filter((i) => i.id !== inquiryToDelete),
        );
        toast.success("Inquiry deleted successfully");
        setDeleteDialogOpen(false);
        setInquiryToDelete(null);
      } else {
        toast.error(response.message || "Failed to delete inquiry");
      }
    } catch (error: any) {
      console.error("Failed to delete inquiry:", error);
      toast.error(error.message || "Failed to delete inquiry");
    }
  };

  // List is already filtered by API (search + status); no second client filter
  return (
    <div className="p-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{inquiries.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">New</p>
            <p className="text-2xl font-bold text-blue-600">
              {inquiries.filter((i: Inquiry) => i.status === "new").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Contacted</p>
            <p className="text-2xl font-bold text-yellow-600">
              {
                inquiries.filter((i: Inquiry) => i.status === "contacted")
                  .length
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Closed</p>
            <p className="text-2xl font-bold text-green-600">
              {inquiries.filter((i: Inquiry) => i.status === "closed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, phone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry: Inquiry) => (
                <TableRow
                  key={inquiry.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedInquiry(inquiry)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{inquiry.name}</p>
                      <p className="text-sm text-gray-500">{inquiry.email}</p>
                      <p className="text-sm text-gray-500">{inquiry.phone}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-gray-600">
                      {inquiry.inquiry_type}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div>
                      <p className="text-sm text-blue-600">
                        {inquiry.property_title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {inquiry.property_reference}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(inquiry.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    {inquiry.created_date
                      ? formatInquiryDate(inquiry.created_date)
                      : "No Date"}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${inquiry.phone}`, "_blank");
                      }}
                    >
                      <Phone className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`mailto:${inquiry.email}`, "_blank");
                      }}
                    >
                      <Mail className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInquiry(inquiry.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog
        open={!!selectedInquiry}
        onOpenChange={() => setSelectedInquiry(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedInquiry.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedInquiry.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedInquiry.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Inquiry Type</p>
                <p className="font-medium">{selectedInquiry.inquiry_type}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Property</p>
                <p className="font-medium">{selectedInquiry.property_title}</p>
                <p className="text-sm text-gray-500">
                  {selectedInquiry.property_reference}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="text-gray-700">{selectedInquiry.message}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Call</Button>
                <Button variant="outline" className="flex-1">
                  Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inquiry? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteInquiry}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
