import type { Service } from "@/types/service";

export function getServiceId(service: Pick<Service, "_id" | "id">) {
  return String(service.id ?? service._id ?? "").trim();
}
