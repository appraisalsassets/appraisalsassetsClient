"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import ServiceAdminForm, {
  initialServiceForm,
} from "@/components/services/ServiceAdminForm";
import { buildServiceFormData } from "@/lib/serviceForm";

export default function NewServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
      const response = await api.createService(data);
      if (!response.success) {
        toast.error(response.message || "Failed to create service");
        return;
      }
      toast.success("Service created");
      router.push("/admin/services");
    } catch {
      toast.error("Failed to create service");
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-slate-900">Add service</h1>
        </div>
        <Button
          type="submit"
          form="service-form"
          disabled={saving}
          className="bg-[#C1A06E] hover:bg-[#a88b5e]"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save service
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
        />
      </form>
    </div>
  );
}
