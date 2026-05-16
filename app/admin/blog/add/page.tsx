"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@tinymce/tinymce-react";

export default function AddBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "dubai_real_estate_news",
    tags: "",
    status: "draft",
    isFeatured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (publishStatus?: string) => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error("Please fill in title, excerpt, and content");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("slug", formData.slug || generateSlug(formData.title));
      data.append("excerpt", formData.excerpt);
      data.append("content", formData.content);
      data.append("category", formData.category);
      data.append("tags", formData.tags);
      data.append("status", publishStatus || formData.status);
      data.append("isFeatured", String(formData.isFeatured));

      if (image) {
        data.append("featuredImage", image);
      }

      const response = await api.createBlogPost(data);

      if (response.success) {
        toast.success("Blog post created successfully");
        router.push("/admin/blog");
      } else {
        toast.error(response.message || "Failed to create blog post");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">New Blog Post</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Blog Post Content
            </h2>

            <div className="space-y-2">
              <Label>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                name="title"
                placeholder="Enter blog post title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                name="slug"
                placeholder="auto-generated-from-title"
                value={formData.slug}
                onChange={handleChange}
              />
              <p className="text-xs text-slate-400">
                Leave empty to auto-generate from title
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                Excerpt <span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="excerpt"
                placeholder="Short description (appears in listings)"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>
                Content <span className="text-red-500">*</span>
              </Label>
              <Editor
                apiKey="no-api-key"
                value={formData.content}
                onEditorChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
                init={{
                  height: 400,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | bold italic underline strikethrough | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | link image media | " +
                    "forecolor backcolor | removeformat | code fullscreen",
                  content_style:
                    "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #334155; }",
                  branding: false,
                  promotion: false,
                  skin: "oxide",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                name="tags"
                placeholder="dubai, real estate, investment (comma separated)"
                value={formData.tags}
                onChange={handleChange}
              />
              <p className="text-xs text-slate-400">
                Separate tags with commas
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Featured Image
            </h2>

            {preview ? (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Upload Image</p>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Settings
            </h2>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, category: val }))
                  }
                >
                  <SelectTrigger className="w-full bg-white border-slate-200">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dubai_real_estate_news">
                      Dubai Real Estate News
                    </SelectItem>
                    <SelectItem value="market_trends">Market Trends</SelectItem>
                    <SelectItem value="investment_tips">
                      Investment Tips
                    </SelectItem>
                    <SelectItem value="area_guides">Area Guides</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="property_management">
                      Property Management
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Post
                </Label>
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isFeatured: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full bg-[#C1A06E] hover:bg-[#a88b5e] text-white py-6 text-base"
              onClick={() => handleSubmit("published")}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Post"}
            </Button>
            <Button
              variant="outline"
              className="w-full py-6 text-base"
              onClick={() => handleSubmit("draft")}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              variant="ghost"
              className="w-full py-6 text-base text-slate-500"
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
