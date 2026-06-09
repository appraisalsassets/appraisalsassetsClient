"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getServiceIcon, SERVICE_ICON_OPTIONS } from "@/lib/serviceIcons";
import type { Service } from "@/types/service";

type ItemRow = { title: string; description: string };
type StepRow = { step: string; title: string; description: string };
type CoverageRow = { region: string; locations: string };
type PricingRow = { label: string; validity: string; notes: string };
type FaqRow = { question: string; answer: string };

export type ServiceFormState = {
  name: string;
  slug: string;
  shortDescription: string;
  overview: string;
  features: string;
  icon: string;
  displayOrder: string;
  isActive: boolean;
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  offeringsTitle: string;
  offeringsSubtitle: string;
  stepsTitle: string;
  stepsSubtitle: string;
  coverageTitle: string;
  coverageSubtitle: string;
  pricingTitle: string;
  pricingSubtitle: string;
  faqTitle: string;
  faqSubtitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  consultationPhone: string;
  consultationEmail: string;
};

const emptyItem = (): ItemRow => ({ title: "", description: "" });
const emptyStep = (): StepRow => ({ step: "", title: "", description: "" });
const emptyCoverage = (): CoverageRow => ({ region: "", locations: "" });
const emptyPricing = (): PricingRow => ({
  label: "",
  validity: "",
  notes: "",
});
const emptyFaq = (): FaqRow => ({ question: "", answer: "" });

export const initialServiceForm: ServiceFormState = {
  name: "",
  slug: "",
  shortDescription: "",
  overview: "",
  features: "",
  icon: "building2",
  displayOrder: "0",
  isActive: true,
  whyChooseTitle: "Why Choose Us",
  whyChooseSubtitle: "",
  offeringsTitle: "What We Offer",
  offeringsSubtitle: "",
  stepsTitle: "How We Handle It",
  stepsSubtitle: "",
  coverageTitle: "Areas We Serve",
  coverageSubtitle: "",
  pricingTitle: "Cost & Timeline",
  pricingSubtitle: "",
  faqTitle: "Common Questions",
  faqSubtitle: "",
  ctaTitle: "Get Started With Us Today",
  ctaDescription: "",
  ctaButtonText: "Book a Free Consultation",
  consultationPhone: "",
  consultationEmail: "",
};

export function serviceToFormState(service: Service): ServiceFormState {
  return {
    name: service.name || "",
    slug: service.slug || "",
    shortDescription: service.shortDescription || "",
    overview: service.overview || "",
    features: (service.features || []).join("\n"),
    icon: service.icon || "building2",
    displayOrder: String(service.displayOrder ?? 0),
    isActive: service.isActive !== false,
    whyChooseTitle: service.whyChooseTitle || "Why Choose Us",
    whyChooseSubtitle: service.whyChooseSubtitle || "",
    offeringsTitle: service.offeringsTitle || "What We Offer",
    offeringsSubtitle: service.offeringsSubtitle || "",
    stepsTitle: service.stepsTitle || "How We Handle It",
    stepsSubtitle: service.stepsSubtitle || "",
    coverageTitle: service.coverageTitle || "Areas We Serve",
    coverageSubtitle: service.coverageSubtitle || "",
    pricingTitle: service.pricingTitle || "Cost & Timeline",
    pricingSubtitle: service.pricingSubtitle || "",
    faqTitle: service.faqTitle || "Common Questions",
    faqSubtitle: service.faqSubtitle || "",
    ctaTitle: service.ctaTitle || "Get Started With Us Today",
    ctaDescription: service.ctaDescription || "",
    ctaButtonText: service.ctaButtonText || "Book a Free Consultation",
    consultationPhone: service.consultationPhone || "",
    consultationEmail: service.consultationEmail || "",
  };
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

type ServiceAdminFormProps = {
  form: ServiceFormState;
  setForm: React.Dispatch<React.SetStateAction<ServiceFormState>>;
  whyChooseItems: ItemRow[];
  setWhyChooseItems: React.Dispatch<React.SetStateAction<ItemRow[]>>;
  offerings: ItemRow[];
  setOfferings: React.Dispatch<React.SetStateAction<ItemRow[]>>;
  steps: StepRow[];
  setSteps: React.Dispatch<React.SetStateAction<StepRow[]>>;
  coverageAreas: CoverageRow[];
  setCoverageAreas: React.Dispatch<React.SetStateAction<CoverageRow[]>>;
  pricingRows: PricingRow[];
  setPricingRows: React.Dispatch<React.SetStateAction<PricingRow[]>>;
  faqs: FaqRow[];
  setFaqs: React.Dispatch<React.SetStateAction<FaqRow[]>>;
  heroFile: File | null;
  setHeroFile: React.Dispatch<React.SetStateAction<File | null>>;
  existingHero?: string;
};

export default function ServiceAdminForm({
  form,
  setForm,
  whyChooseItems,
  setWhyChooseItems,
  offerings,
  setOfferings,
  steps,
  setSteps,
  coverageAreas,
  setCoverageAreas,
  pricingRows,
  setPricingRows,
  faqs,
  setFaqs,
  heroFile,
  setHeroFile,
  existingHero,
}: ServiceAdminFormProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Basic information">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Service name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Property Valuation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (optional)</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="property-valuation"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <Textarea
            id="shortDescription"
            rows={3}
            value={form.shortDescription}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                shortDescription: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="overview">Service overview</Label>
          <Textarea
            id="overview"
            rows={4}
            value={form.overview}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, overview: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="features">Key features (one per line)</Label>
          <Textarea
            id="features"
            rows={4}
            value={form.features}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, features: e.target.value }))
            }
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select
              value={form.icon}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, icon: value }))
              }
            >
              <SelectTrigger id="icon" className="h-11 w-full border-slate-200 bg-white">
                <span className="flex items-center gap-2">
                  {(() => {
                    const Icon = getServiceIcon(form.icon);
                    return <Icon className="h-4 w-4 shrink-0 text-[#a88b5e]" />;
                  })()}
                  <SelectValue placeholder="Select icon" />
                </span>
              </SelectTrigger>
              <SelectContent>
                {SERVICE_ICON_OPTIONS.map((option) => {
                  const Icon = getServiceIcon(option.value);
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <Icon className="h-4 w-4 text-[#a88b5e]" />
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input
              id="displayOrder"
              type="number"
              value={form.displayOrder}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, displayOrder: e.target.value }))
              }
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              Active on website
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroImage">Hero image (optional)</Label>
          <Input
            id="heroImage"
            type="file"
            accept="image/*"
            onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
          />
          {existingHero ? (
            <p className="text-xs text-slate-500">Current image uploaded</p>
          ) : null}
        </div>
      </SectionCard>

      <RepeatSection
        title="Why choose us"
        subtitleFields={
          <>
            <Input
              placeholder="Section title"
              value={form.whyChooseTitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  whyChooseTitle: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Section subtitle"
              value={form.whyChooseSubtitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  whyChooseSubtitle: e.target.value,
                }))
              }
            />
          </>
        }
        rows={whyChooseItems}
        onAdd={() => setWhyChooseItems((prev) => [...prev, emptyItem()])}
        onRemove={(index) =>
          setWhyChooseItems((prev) => prev.filter((_, i) => i !== index))
        }
        onUpdateRow={(index, row) =>
          setWhyChooseItems((prev) =>
            prev.map((item, i) => (i === index ? row : item)),
          )
        }
        renderRow={(row, index, update) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Title"
              value={row.title}
              onChange={(e) => update(index, { ...row, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              rows={2}
              value={row.description}
              onChange={(e) =>
                update(index, { ...row, description: e.target.value })
              }
            />
          </div>
        )}
      />

      <RepeatSection
        title="What we offer"
        subtitleFields={
          <>
            <Input
              placeholder="Section title"
              value={form.offeringsTitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  offeringsTitle: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Section subtitle"
              value={form.offeringsSubtitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  offeringsSubtitle: e.target.value,
                }))
              }
            />
          </>
        }
        rows={offerings}
        onAdd={() => setOfferings((prev) => [...prev, emptyItem()])}
        onRemove={(index) =>
          setOfferings((prev) => prev.filter((_, i) => i !== index))
        }
        onUpdateRow={(index, row) =>
          setOfferings((prev) =>
            prev.map((item, i) => (i === index ? row : item)),
          )
        }
        renderRow={(row, index, update) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Title"
              value={row.title}
              onChange={(e) => update(index, { ...row, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              rows={2}
              value={row.description}
              onChange={(e) =>
                update(index, { ...row, description: e.target.value })
              }
            />
          </div>
        )}
      />

      <RepeatSection
        title="Process steps"
        subtitleFields={
          <>
            <Input
              placeholder="Section title"
              value={form.stepsTitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, stepsTitle: e.target.value }))
              }
            />
            <Input
              placeholder="Section subtitle"
              value={form.stepsSubtitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  stepsSubtitle: e.target.value,
                }))
              }
            />
          </>
        }
        rows={steps}
        onAdd={() => setSteps((prev) => [...prev, emptyStep()])}
        onRemove={(index) =>
          setSteps((prev) => prev.filter((_, i) => i !== index))
        }
        onUpdateRow={(index, row) =>
          setSteps((prev) =>
            prev.map((item, i) => (i === index ? row : item)),
          )
        }
        renderRow={(row, index, update) => (
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="Step no."
              value={row.step}
              onChange={(e) => update(index, { ...row, step: e.target.value })}
            />
            <Input
              placeholder="Title"
              value={row.title}
              onChange={(e) => update(index, { ...row, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              rows={2}
              value={row.description}
              onChange={(e) =>
                update(index, { ...row, description: e.target.value })
              }
            />
          </div>
        )}
      />

      <RepeatSection
        title="Coverage areas"
        subtitleFields={
          <>
            <Input
              placeholder="Section title"
              value={form.coverageTitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  coverageTitle: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Section subtitle"
              value={form.coverageSubtitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  coverageSubtitle: e.target.value,
                }))
              }
            />
          </>
        }
        rows={coverageAreas}
        onAdd={() => setCoverageAreas((prev) => [...prev, emptyCoverage()])}
        onRemove={(index) =>
          setCoverageAreas((prev) => prev.filter((_, i) => i !== index))
        }
        onUpdateRow={(index, row) =>
          setCoverageAreas((prev) =>
            prev.map((item, i) => (i === index ? row : item)),
          )
        }
        renderRow={(row, index, update) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Region"
              value={row.region}
              onChange={(e) =>
                update(index, { ...row, region: e.target.value })
              }
            />
            <Textarea
              placeholder="Locations (comma-separated)"
              rows={2}
              value={row.locations}
              onChange={(e) =>
                update(index, { ...row, locations: e.target.value })
              }
            />
          </div>
        )}
      />

      <RepeatSection
        title="Pricing table"
        subtitleFields={
          <>
            <Input
              placeholder="Section title"
              value={form.pricingTitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  pricingTitle: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Section subtitle"
              value={form.pricingSubtitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  pricingSubtitle: e.target.value,
                }))
              }
            />
          </>
        }
        rows={pricingRows}
        onAdd={() => setPricingRows((prev) => [...prev, emptyPricing()])}
        onRemove={(index) =>
          setPricingRows((prev) => prev.filter((_, i) => i !== index))
        }
        onUpdateRow={(index, row) =>
          setPricingRows((prev) =>
            prev.map((item, i) => (i === index ? row : item)),
          )
        }
        renderRow={(row, index, update) => (
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="Service"
              value={row.label}
              onChange={(e) => update(index, { ...row, label: e.target.value })}
            />
            <Input
              placeholder="Timeline"
              value={row.validity}
              onChange={(e) =>
                update(index, { ...row, validity: e.target.value })
              }
            />
            <Input
              placeholder="Notes"
              value={row.notes}
              onChange={(e) => update(index, { ...row, notes: e.target.value })}
            />
          </div>
        )}
      />

      <RepeatSection
        title="FAQ"
        subtitleFields={
          <>
            <Input
              placeholder="Section title"
              value={form.faqTitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, faqTitle: e.target.value }))
              }
            />
            <Input
              placeholder="Section subtitle"
              value={form.faqSubtitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  faqSubtitle: e.target.value,
                }))
              }
            />
          </>
        }
        rows={faqs}
        onAdd={() => setFaqs((prev) => [...prev, emptyFaq()])}
        onRemove={(index) =>
          setFaqs((prev) => prev.filter((_, i) => i !== index))
        }
        onUpdateRow={(index, row) =>
          setFaqs((prev) =>
            prev.map((item, i) => (i === index ? row : item)),
          )
        }
        renderRow={(row, index, update) => (
          <div className="space-y-3">
            <Input
              placeholder="Question"
              value={row.question}
              onChange={(e) =>
                update(index, { ...row, question: e.target.value })
              }
            />
            <Textarea
              placeholder="Answer"
              rows={3}
              value={row.answer}
              onChange={(e) =>
                update(index, { ...row, answer: e.target.value })
              }
            />
          </div>
        )}
      />

      <SectionCard title="Consultation & CTA">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>CTA title</Label>
            <Input
              value={form.ctaTitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, ctaTitle: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>CTA button text</Label>
            <Input
              value={form.ctaButtonText}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  ctaButtonText: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>CTA description</Label>
          <Textarea
            rows={3}
            value={form.ctaDescription}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                ctaDescription: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Consultation phone</Label>
            <Input
              value={form.consultationPhone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  consultationPhone: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Consultation email</Label>
            <Input
              value={form.consultationEmail}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  consultationEmail: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function RepeatSection<T>({
  title,
  subtitleFields,
  rows,
  onAdd,
  onRemove,
  onUpdateRow,
  renderRow,
}: {
  title: string;
  subtitleFields: React.ReactNode;
  rows: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdateRow: (index: number, value: T) => void;
  renderRow: (
    row: T,
    index: number,
    update: (index: number, value: T) => void,
  ) => React.ReactNode;
}) {
  return (
    <SectionCard title={title}>
      <div className="space-y-3">{subtitleFields}</div>
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <div className="mb-3 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Remove
              </Button>
            </div>
            {renderRow(row, index, onUpdateRow)}
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={onAdd} className="mt-2">
        <Plus className="mr-2 h-4 w-4" />
        Add item
      </Button>
    </SectionCard>
  );
}
