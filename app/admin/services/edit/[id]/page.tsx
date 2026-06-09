"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import ServiceAdminForm, {
  initialServiceForm,
  serviceToFormState,
} from "@/components/services/ServiceAdminForm";
import { buildServiceFormData } from "@/lib/serviceForm";
import type { Service } from "@/types/service";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [form, setForm] = useState(initialServiceForm);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [whyChooseItems, setWhyChooseItems] = useState([
    { title: "", description: "" },
  ]);
  const [offerings, setOfferings] = useState([{ title: "", description: "" }]);
  const [steps, setSteps] = useState([
    { step: "01", title: "", description: "" },
  ]);
  const [coverageAreas, setCoverageAreas] = useState([
    { region: "", locations: "" },
  ]);
  const [pricingRows, setPricingRows] = useState([
    { label: "", validity: "", notes: "" },
  ]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await api.getServicesAdmin();
        if (!response.success) {
          toast.error("Failed to load service");
          return;
        }
        const found = (response.services as Service[]).find(
          (item) => item._id === id,
        );
        if (!found) {
          toast.error("Service not found");
          router.push("/admin/services");
          return;
        }
        setService(found);
        setForm(serviceToFormState(found));
        setWhyChooseItems(
          found.whyChooseItems?.length
            ? found.whyChooseItems
            : [{ title: "", description: "" }],
        );
        setOfferings(
          found.offerings?.length
            ? found.offerings
            : [{ title: "", description: "" }],
        );
        setSteps(
          found.steps?.length
            ? found.steps
            : [{ step: "01", title: "", description: "" }],
        );
        setCoverageAreas(
          found.coverageAreas?.length
            ? found.coverageAreas
            : [{ region: "", locations: "" }],
        );
        setPricingRows(
          found.pricingRows?.length
            ? found.pricingRows
            : [{ label: "", validity: "", notes: "" }],
        );
        setFaqs(
          found.faqs?.length ? found.faqs : [{ question: "", answer: "" }],
        );
      } catch {
        toast.error("Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Service name is required");
      return;
    }

    try {
      setSaving(true);
      const data = buildServiceFormData(form, {
        whyChooseItems,
        offerings,
        steps,
        coverageAreas,
        pricingRows,
        faqs,
        heroFile,
      });
      const response = await api.updateService(id, data);
      if (!response.success) {
        toast.error(response.message || "Failed to update service");
        return;
      }
      toast.success("Service updated");
      router.push("/admin/services");
    } catch {
      toast.error("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#C1A06E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/services"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#a88b5e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Edit {service?.name || "service"}
          </h1>
        </div>
        <Button
          type="submit"
          form="service-form"
          disabled={saving}
          className="bg-[#C1A06E] hover:bg-[#a88b5e]"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save changes
        </Button>
      </div>

      <form id="service-form" onSubmit={handleSubmit}>
        <ServiceAdminForm
          form={form}
          setForm={setForm}
          whyChooseItems={whyChooseItems}
          setWhyChooseItems={setWhyChooseItems}
          offerings={offerings}
          setOfferings={setOfferings}
          steps={steps}
          setSteps={setSteps}
          coverageAreas={coverageAreas}
          setCoverageAreas={setCoverageAreas}
          pricingRows={pricingRows}
          setPricingRows={setPricingRows}
          faqs={faqs}
          setFaqs={setFaqs}
          heroFile={heroFile}
          setHeroFile={setHeroFile}
          existingHero={service?.heroImage}
        />
      </form>
    </div>
  );
}
