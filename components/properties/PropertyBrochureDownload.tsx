"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getPropertyBrochureDownloadUrl } from "@/lib/propertyBrochure";

type PropertyBrochureDownloadProps = {
  propertyId: string;
  fileName?: string;
  className?: string;
};

export default function PropertyBrochureDownload({
  propertyId,
  fileName = "property-brochure.pdf",
  className,
}: PropertyBrochureDownloadProps) {
  const [loading, setLoading] = useState(false);

  const safeFileName = fileName.toLowerCase().endsWith(".pdf")
    ? fileName
    : `${fileName}.pdf`;

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(getPropertyBrochureDownloadUrl(propertyId));
      if (!response.ok) {
        let message = "Could not download brochure";
        try {
          const data = await response.json();
          if (data?.message) message = data.message;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = safeFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not download brochure";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Download brochure (PDF)
    </Button>
  );
}
