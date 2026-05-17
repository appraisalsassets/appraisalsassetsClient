"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getDeveloperAboutText } from "@/lib/developerContent";

const PREVIEW_LENGTH = 420;

type DeveloperAboutSectionProps = {
  name: string;
  about?: string;
  shortDescription?: string;
};

export default function DeveloperAboutSection({
  name,
  about,
  shortDescription,
}: DeveloperAboutSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const body = getDeveloperAboutText(about, shortDescription);
  const needsToggle = body.length > PREVIEW_LENGTH;
  const displayText =
    needsToggle && !expanded ? `${body.slice(0, PREVIEW_LENGTH).trim()}…` : body;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary-dark sm:text-4xl">
          About {name}
        </h2>
        {body ? (
          <>
            <p className="mt-6 text-left text-base leading-relaxed text-slate-600 sm:text-center sm:text-lg">
              {displayText}
            </p>
            {needsToggle ? (
              <Button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-8 rounded-full bg-[#C1A06E] px-8 text-white hover:bg-[#a88b5e]"
              >
                {expanded ? "Show Less" : "Show More"}
              </Button>
            ) : null}
          </>
        ) : (
          <p className="mt-6 text-slate-500 italic">
            Add a company profile in Admin → Developers (About field) to display
            it here.
          </p>
        )}
      </div>
    </section>
  );
}
