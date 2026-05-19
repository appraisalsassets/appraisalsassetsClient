import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trusted Partners | AARE Assets Appraisals",
  description:
    "Explore our trusted partners in Dubai real estate. Partner logos are managed separately from our off-plan developers directory.",
};

export default function TrustedPartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
