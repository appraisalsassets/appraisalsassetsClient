"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  FileText,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: string;
  publishedAt: string | null;
  createdAt: string;
  createdBy?: { name: string };
}

const CATEGORY_LABELS: Record<string, string> = {
  dubai_real_estate_news: "Dubai Real Estate News",
  market_trends: "Market Trends",
  investment_tips: "Investment Tips",
  area_guides: "Area Guides",
  lifestyle: "Lifestyle",
  property_management: "Property Management",
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await api.getBlogPost(slug);
      if (
        response.success &&
        response.data &&
        response.data.status === "published"
      ) {
        setPost(response.data);
      } else {
        router.push("/blog");
      }
    } catch {
      router.push("/blog");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <FileText className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">
          Article not found
        </h2>
        <Link href="/blog">
          <Button variant="outline">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      {post.featuredImage && (
        <div className="w-full h-[400px] md:h-[500px] relative">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#C1A06E] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-[#C1A06E]/10 text-[#C1A06E] border-[#C1A06E]/20">
              {CATEGORY_LABELS[post.category] || post.category}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt || post.createdAt)}
            </div>
            {post.createdBy && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <User className="w-4 h-4" />
                {post.createdBy.name}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-slate-600 mb-8 leading-relaxed border-l-4 border-[#C1A06E] pl-4">
            {post.excerpt}
          </p>

          {/* Share */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-slate-500"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Content */}
          <div
            className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-[#C1A06E] prose-a:no-underline hover:prose-a:underline leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-slate-100 text-slate-600"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </article>
    </div>
  );
}
