"use client";

import { Building2, House, Search, Construction } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import api from "@/lib/api";
import {
  FALLBACK_PROPERTY_OPTIONS,
  normalizeSelectOptions,
  SelectOption,
} from "@/constants/form-options";

type Listings = "buy" | "rent" | "commercial" | "offplan";

export default function Filter() {
  const router = useRouter();
  const [type, setType] = useState<Listings>("buy");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState<SelectOption[]>(
    FALLBACK_PROPERTY_OPTIONS.locations,
  );

  const tabs: Array<{
    name: Listings;
    icon: typeof House;
    label: string;
  }> = [
    { name: "buy", icon: House, label: "Buy" },
    { name: "rent", icon: Building2, label: "Rent" },
    { name: "commercial", icon: Building2, label: "Commercial" },
    {
      name: "offplan",
      icon: Construction,
      label: "Offplan",
    },
  ];

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await api.getPropertyFormOptions();
        if (response.success && response.data) {
          setLocations(
            normalizeSelectOptions(
              response.data.locations,
              FALLBACK_PROPERTY_OPTIONS.locations,
            ),
          );
        }
      } catch (error) {
        // Use fallback locations when options request fails
      }
    };

    loadOptions();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location && type !== "offplan") {
      params.set("location", location);
    }

    let targetPath = "/properties";

    if (type === "buy") {
      targetPath = "/sale";
    } else if (type === "rent") {
      targetPath = "/rent";
    } else if (type === "commercial") {
      params.set("category", "commercial");
    } else if (type === "offplan") {
      targetPath = "/developers";
    }

    const query = params.toString();
    router.push(query ? `${targetPath}?${query}` : targetPath);
  };

  return (
    <div className="mx-auto w-full max-w-full rounded-2xl bg-white p-4 shadow-lg sm:max-w-6xl sm:p-5 md:rounded-3xl md:p-6">
      {/* Tabs */}
      <div className="mb-4 grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 md:mb-5 md:gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = type === tab.name;

          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => setType(tab.name)}
              className={clsx(
                "flex min-w-0 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-medium transition sm:w-auto sm:px-4 md:gap-2 md:px-5 md:py-3 md:text-sm",
                active
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Row */}
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:gap-4">
        <div className="min-w-0">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            list="hero-location-suggestions"
            placeholder="Enter location (e.g. Downtown Dubai)"
            className="h-12 w-full min-w-0 rounded-lg border border-gray-200 text-sm text-gray-700 md:h-14 md:text-base"
          />

          <datalist id="hero-location-suggestions">
            {locations.map((loc) => (
              <option key={loc.value} value={loc.label} />
            ))}
          </datalist>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-95 md:h-14 md:w-auto md:min-w-[210px] md:rounded-xl md:px-8 md:text-base"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Search Properties</span>
        </button>
      </div>
    </div>
  );
}
