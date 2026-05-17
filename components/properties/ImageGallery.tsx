"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  normalizePropertyImageUrls,
  type PropertyImageInput,
} from "@/lib/propertyImages";

interface ImageGalleryProps {
  images?: PropertyImageInput[] | null;
}

function GalleryImage({
  src,
  alt,
  className,
  onBroken,
}: {
  src: string;
  alt: string;
  className?: string;
  onBroken?: (src: string) => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-200 text-slate-400 ${className || ""}`}
      >
        <Building2 className="h-12 w-12" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        setFailed(true);
        onBroken?.(src);
      }}
    />
  );
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const normalizedImages = useMemo(
    () => normalizePropertyImageUrls(images ?? []),
    [images],
  );
  const [brokenUrls, setBrokenUrls] = useState<string[]>([]);
  const displayImages = useMemo(
    () => normalizedImages.filter((url) => !brokenUrls.includes(url)),
    [normalizedImages, brokenUrls],
  );
  const markBroken = (url: string) => {
    setBrokenUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const safeIndex =
    displayImages.length > 0
      ? Math.min(currentIndex, displayImages.length - 1)
      : 0;
  const currentImage = displayImages[safeIndex] || "";

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  if (displayImages.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <div className="flex aspect-video items-center justify-center text-slate-500">
          No images uploaded for this property
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative aspect-video bg-slate-100">
          <GalleryImage
            src={currentImage}
            alt={`Property image ${safeIndex + 1}`}
            className="h-full w-full object-cover"
            onBroken={markBroken}
          />

          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            {safeIndex + 1} / {displayImages.length}
          </div>

          <button
            type="button"
            onClick={() => setShowFullscreen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm text-white transition-colors hover:bg-black/80"
          >
            <Maximize2 className="h-4 w-4" />
            View All
          </button>
        </div>

        {displayImages.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {displayImages.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ${
                  safeIndex === index ? "ring-2 ring-[#C1A06E]" : "opacity-80"
                }`}
              >
                <GalleryImage
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                  onBroken={markBroken}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <button
              type="button"
              onClick={() => setShowFullscreen(false)}
              className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Close gallery"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            <div className="flex h-full items-center justify-center p-4">
              <GalleryImage
                src={currentImage}
                alt={`Property image ${safeIndex + 1}`}
                className="max-h-full max-w-full object-contain"
                onBroken={markBroken}
              />
            </div>

            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
              <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                {displayImages.map((src, index) => (
                  <button
                    key={`fs-${src}-${index}`}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg ${
                      safeIndex === index
                        ? "ring-2 ring-[#C1A06E]"
                        : "opacity-60"
                    }`}
                  >
                    <GalleryImage
                      src={src}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      onBroken={markBroken}
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
