"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id?: string;
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  status: string;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
  createdBy?: { name: string; email: string };
}

const CATEGORY_LABELS: Record<string, string> = {
  dubai_real_estate_news: "Dubai Real Estate News",
  market_trends: "Market Trends",
  investment_tips: "Investment Tips",
  area_guides: "Area Guides",
  lifestyle: "Lifestyle",
  property_management: "Property Management",
};

function postId(post: BlogPost) {
  return String(post.id ?? post._id ?? "");
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    void fetchPosts(debouncedSearch);
  }, [statusFilter, debouncedSearch]);

  const fetchPosts = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {};
      if (statusFilter !== "all") params.status = statusFilter;
      const q = searchQuery.trim();
      if (q) params.search = q;
      const response = await api.getBlogPosts(params);
      if (response.success) {
        setPosts(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch blog posts");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch blog posts",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.deleteBlogPost(id);
      if (response.success) {
        toast.success("Blog post deleted successfully");
        fetchPosts(debouncedSearch);
      } else {
        toast.error(response.message || "Failed to delete blog post");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete blog post",
      );
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const response = await api.toggleBlogPostStatus(id, newStatus);
      if (response.success) {
        toast.success(
          `Post ${newStatus === "published" ? "published" : "moved to draft"}`,
        );
        fetchPosts(debouncedSearch);
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
        <Button asChild className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white">
          <Link href="/admin/blog/add">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-slate-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-white border-slate-200">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <p className="text-slate-500">Loading...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No blog posts found</p>
          <Button asChild className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white">
            <Link href="/admin/blog/add">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Post
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Post
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={postId(post)}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate max-w-[300px]">
                          {post.title}
                        </p>
                        <p className="text-sm text-slate-500 truncate max-w-[300px]">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-700 font-medium"
                    >
                      {CATEGORY_LABELS[post.category] || post.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleToggleStatus(postId(post), post.status)
                      }
                      className="cursor-pointer"
                    >
                      <Badge
                        className={
                          post.status === "published"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }
                      >
                        {post.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.publishedAt || post.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="w-4 h-4 text-slate-500" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Link href={`/admin/blog/edit/${postId(post)}`}>
                          <Edit className="w-4 h-4 text-slate-500" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{post.title}
                              &quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(postId(post))}
                              className="bg-red-500 hover:bg-red-600"
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
  );
}
