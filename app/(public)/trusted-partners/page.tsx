import { redirect } from "next/navigation";

/** Trusted partners are now shown on the main Off-Plan Developers directory. */
export default function TrustedPartnersPage() {
  redirect("/developers");
}
