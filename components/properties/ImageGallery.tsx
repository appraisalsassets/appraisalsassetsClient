"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images?: string[] | { url: string }[];
}

export default function ImageGallery({ images = [] }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const displayImages = images.length > 0 ? images : [];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  const getImageUrl = (img: string | { url: string }): string => {
    return typeof img === "string" ? img : img.url;
  };

  if (displayImages.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
        <div className="aspect-video flex items-center justify-center text-slate-500">
          No images uploaded for this property
        </div>
      </div>
    );
  }

  const currentImage =
    getImageUrl(displayImages[currentIndex]) || getImageUrl(displayImages[0]);

  return (
    <>
      {/* Main Gallery */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={currentImage}
            alt={`Property image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setShowFullscreen(true)}
            className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-black/80 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            View All
          </button>
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {displayImages.slice(0, 6).map((img, index) => {
              const thumbnailSrc = getImageUrl(img);
              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative w-24 h-16 shrink-0 rounded-lg overflow-hidden ${
                    currentIndex === index ? "ring-2 ring-[#C1A06E]" : ""
                  }`}
                >
                  <Image
                    src={thumbnailSrc}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === 5 && displayImages.length > 6 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-medium">
                      +{displayImages.length - 6}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="h-full flex items-center justify-center p-4">
              <Image
                src={currentImage}
                alt={`Property image ${currentIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}

            {/* Fullscreen Thumbnails */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
              <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                {displayImages.map((img, index) => {
                  const thumbnailSrc = getImageUrl(img);
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative w-16 h-12 shrink-0 rounded-lg overflow-hidden ${
                        currentIndex === index
                          ? "ring-2 ring-[#C1A06E]"
                          : "opacity-60"
                      }`}
                    >
                      <Image
                        src={thumbnailSrc}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
