"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: string;
  isFeatured?: boolean;
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const params: Record<string, string> = {
        limit: "100",
        sortBy: "publishedAt",
        sortOrder: "desc",
      };
      if (category !== "all") params.category = category;
      const response = await api.getBlogPosts(params);
      if (response.success) {
        const published = (response.data || []).filter(
          (post: BlogPost) => post.status === "published",
        );
        published.sort((a: BlogPost, b: BlogPost) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          const aDate = new Date(a.publishedAt || a.createdAt).getTime();
          const bDate = new Date(b.publishedAt || b.createdAt).getTime();
          return bDate - aDate;
        });
        setPosts(published);
      } else {
        setLoadError(response.message || "Failed to load articles");
        setPosts([]);
      }
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load articles",
      );
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const query = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Blog & Insights"
        description="Stay informed with the latest Dubai real estate news, market trends, and expert investment insights."
        className="h-[360px] sm:h-[400px] lg:h-[420px]"
        contentClassName="max-w-6xl"
      />

      {/* Filters */}
      <section className="bg-white px-4 py-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 border-b border-slate-100 bg-white pb-4 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-10 border-slate-200"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 w-full border-slate-200 sm:w-[220px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="dubai_real_estate_news">
                Dubai Real Estate News
              </SelectItem>
              <SelectItem value="market_trends">Market Trends</SelectItem>
              <SelectItem value="investment_tips">Investment Tips</SelectItem>
              <SelectItem value="area_guides">Area Guides</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="property_management">
                Property Management
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 pb-12 pt-4 sm:pb-16 sm:pt-6">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-slate-500">Loading articles...</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Could not load articles
            </h3>
            <p className="text-slate-500 mb-4">{loadError}</p>
            <Button
              variant="outline"
              onClick={() => void fetchPosts()}
              className="border-slate-200"
            >
              Try again
            </Button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No articles found
            </h3>
            <p className="text-slate-500">Check back soon for new content.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <Link href={`/blog/${featuredPost.slug}`}>
                  <div className="group grid md:grid-cols-2 gap-8 bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-16/10 md:aspect-auto overflow-hidden">
                      {featuredPost.featuredImage ? (
                        <img
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[300px] bg-slate-200 flex items-center justify-center">
                          <FileText className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-3 bg-[#C1A06E]/10 text-[#C1A06E] border-[#C1A06E]/20">
                        {CATEGORY_LABELS[featuredPost.category] ||
                          featuredPost.category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-[#C1A06E] transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-600 mb-4 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(
                            featuredPost.publishedAt || featuredPost.createdAt,
                          )}
                        </div>
                        {featuredPost.createdBy && (
                          <span>by {featuredPost.createdBy.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid */}
            {remainingPosts.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post, idx) => (
                  <motion.div
                    key={post.id || post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                        <div className="aspect-16/10 overflow-hidden">
                          {post.featuredImage ? (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                              <FileText className="w-10 h-10 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <Badge className="mb-3 bg-slate-100 text-slate-600 border-slate-200 text-xs">
                            {CATEGORY_LABELS[post.category] || post.category}
                          </Badge>
                          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-[#C1A06E] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(post.publishedAt || post.createdAt)}
                            </div>
                            <span className="flex items-center gap-1 text-[#C1A06E] font-medium">
                              Read More <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
