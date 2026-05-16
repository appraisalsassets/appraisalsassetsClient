import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trusted Partners | Dubai Off-Plan Developers",
  description:
    "Explore our trusted off-plan developer partners in Dubai. Logos represent developers we work with for premium property opportunities.",
};

export default function TrustedPartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
