import type { ServiceFormState } from "@/components/services/ServiceAdminForm";

type RepeatPayload = {
  whyChooseItems: { title: string; description: string }[];
  offerings: { title: string; description: string }[];
  steps: { step: string; title: string; description: string }[];
  coverageAreas: { region: string; locations: string }[];
  pricingRows: { label: string; validity: string; notes: string }[];
  faqs: { question: string; answer: string }[];
  heroFile: File | null;
};

function filterItems<T extends Record<string, string>>(
  items: T[],
  requiredKey: keyof T,
) {
  return items.filter((item) => String(item[requiredKey] || "").trim());
}

export function buildServiceFormData(
  form: ServiceFormState,
  payload: RepeatPayload,
) {
  const data = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (key === "isActive") {
      data.append(key, String(value));
    } else {
      data.append(key, String(value ?? ""));
    }
  });

  data.append(
    "whyChooseItems",
    JSON.stringify(filterItems(payload.whyChooseItems, "title")),
  );
  data.append(
    "offerings",
    JSON.stringify(filterItems(payload.offerings, "title")),
  );
  data.append("steps", JSON.stringify(filterItems(payload.steps, "title")));
  data.append(
    "coverageAreas",
    JSON.stringify(filterItems(payload.coverageAreas, "region")),
  );
  data.append(
    "pricingRows",
    JSON.stringify(filterItems(payload.pricingRows, "label")),
  );
  data.append("faqs", JSON.stringify(filterItems(payload.faqs, "question")));

  if (payload.heroFile) {
    data.append("heroImage", payload.heroFile);
  }

  return data;
}
