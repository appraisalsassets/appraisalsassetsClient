"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, SlidersHorizontal, Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import {
  FALLBACK_PROPERTY_OPTIONS,
  normalizeSelectOptions,
  SelectOption,
} from "@/constants/form-options";

const bedroomOptions = [
  { value: "all", label: "Any Bedrooms" },
  { value: "studio", label: "Studio" },
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4 Bedrooms" },
  { value: "5+", label: "5+ Bedrooms" },
];

const bathroomOptions = [
  { value: "all", label: "Any Bathrooms" },
  { value: "1", label: "1 Bathroom" },
  { value: "2", label: "2 Bathrooms" },
  { value: "3", label: "3 Bathrooms" },
  { value: "4", label: "4 Bathrooms" },
  { value: "5+", label: "5+ Bathrooms" },
];

interface PropertyFiltersProps {
  filters: {
    category: string;
    location: string;
    property_type: string;
    bedrooms: string;
    bathrooms: string;
    minPrice: string;
    maxPrice: string;
    search: string;
  };
  onChange: (filters: any) => void;
  onSearch: () => void;
  hideCategoryFilter?: boolean;
}

export default function PropertyFilters({
  filters,
  onChange,
  onSearch,
  hideCategoryFilter = false,
}: PropertyFiltersProps) {
  const categories = [
    { value: "all", label: "All Categories" },
    ...FALLBACK_PROPERTY_OPTIONS.categories,
  ];
  const locations = [
    { value: "all", label: "All Locations" },
    ...FALLBACK_PROPERTY_OPTIONS.locations,
  ];
  const propertyTypes = [
    { value: "all", label: "All Types" },
    ...FALLBACK_PROPERTY_OPTIONS.propertyTypes,
  ];

  const [dynamicCategories, setDynamicCategories] = useState<SelectOption[]>(categories);
  const [dynamicLocations, setDynamicLocations] = useState<SelectOption[]>(locations);
  const [dynamicPropertyTypes, setDynamicPropertyTypes] =
    useState<SelectOption[]>(propertyTypes);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await api.getPropertyFormOptions();
        if (response.success && response.data) {
          setDynamicCategories([
            { value: "all", label: "All Categories" },
            ...normalizeSelectOptions(
              response.data.categories,
              FALLBACK_PROPERTY_OPTIONS.categories,
            ),
          ]);
          setDynamicLocations([
            { value: "all", label: "All Locations" },
            ...normalizeSelectOptions(
              response.data.locations,
              FALLBACK_PROPERTY_OPTIONS.locations,
            ),
          ]);
          setDynamicPropertyTypes([
            { value: "all", label: "All Types" },
            ...normalizeSelectOptions(
              response.data.propertyTypes,
              FALLBACK_PROPERTY_OPTIONS.propertyTypes,
            ),
          ]);
        }
      } catch (error) {
        // Keep fallback options when backend options are unavailable
      }
    };
    loadOptions();
  }, []);

  const filteredLocations = dynamicLocations.filter(
    (loc) =>
      loc.value !== "all" &&
      loc.label.toLowerCase().includes(locationSearch.toLowerCase()),
  );

  const handleChange = (key: string, value: string) => {
    onChange({ ...filters, [key]: value === "all" ? "" : value });
  };

  const clearFilters = () => {
    onChange({
      category: "",
      location: "",
      property_type: "",
      bedrooms: "",
      bathrooms: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    });
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Main Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {!hideCategoryFilter && (
          <Select
            value={filters.category || "all"}
            onValueChange={(v) => handleChange("category", v)}
          >
            <SelectTrigger className="h-12 border-gray-200 w-full">
              <SelectValue placeholder="Buy / Rent / Commercial" />
            </SelectTrigger>
            <SelectContent>
              {dynamicCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={filters.property_type || "all"}
          onValueChange={(v) => handleChange("property_type", v)}
        >
          <SelectTrigger className="h-12 border-gray-200 w-full">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            {dynamicPropertyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search location..."
              value={locationSearch}
              onChange={(e) => {
                setLocationSearch(e.target.value);
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              className="h-12 pl-10 border-gray-200 w-full"
            />
          </div>
          {showLocationSuggestions && locationSearch && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() => {
                      handleChange("location", loc.value);
                      setLocationSearch(loc.label);
                      setShowLocationSuggestions(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-[#C1A06E]" />
                    {loc.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No locations found
                </div>
              )}
            </div>
          )}
        </div>

        <Select
          value={filters.bedrooms || "all"}
          onValueChange={(v) => handleChange("bedrooms", v)}
        >
          <SelectTrigger className="h-12 border-gray-200 w-full">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            {bedroomOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.bathrooms || "all"}
          onValueChange={(v) => handleChange("bathrooms", v)}
        >
          <SelectTrigger className="h-12 border-gray-200 w-full">
            <SelectValue placeholder="Bathrooms" />
          </SelectTrigger>
          <SelectContent>
            {bathroomOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            className="h-12 border-gray-200 flex-1"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Price
          </Button>
          <Button
            onClick={onSearch}
            className="h-12 bg-[#C1A06E] hover:bg-[#A68B5B] text-white"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Min Price (AED)
                </label>
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice || ""}
                  onChange={(e) => handleChange("minPrice", e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Max Price (AED)
                </label>
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleChange("maxPrice", e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Search
                </label>
                <Input
                  type="text"
                  placeholder="Search by title or reference..."
                  value={filters.search || ""}
                  onChange={(e) => handleChange("search", e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
          <span className="text-sm text-gray-500">Active Filters:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
