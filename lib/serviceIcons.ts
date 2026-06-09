import {
  Building2,
  ChartNoAxesCombined,
  FileSearch,
  Handshake,
  KeyRound,
  Briefcase,
  Home,
  Shield,
  Scale,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  building2: Building2,
  chartnoaxescombined: ChartNoAxesCombined,
  filesearch: FileSearch,
  handshake: Handshake,
  keyround: KeyRound,
  briefcase: Briefcase,
  home: Home,
  shield: Shield,
  scale: Scale,
};

export const SERVICE_ICON_OPTIONS = [
  { value: "building2", label: "Building" },
  { value: "chartNoAxesCombined", label: "Investment" },
  { value: "fileSearch", label: "Valuation" },
  { value: "handshake", label: "Management" },
  { value: "keyRound", label: "Leasing" },
  { value: "briefcase", label: "Business" },
  { value: "home", label: "Residential" },
  { value: "shield", label: "Advisory" },
  { value: "scale", label: "Legal" },
];

export function getServiceIcon(iconName?: string): LucideIcon {
  const key = String(iconName || "building2")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return ICON_MAP[key] || Building2;
}
