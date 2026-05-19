"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export const SOCIAL_LINKS = {
  x: "https://x.com/appraisals_real",
  instagram: "https://www.instagram.com/assetsnappraisalsre/",
  facebook: "https://www.facebook.com/assetsnappraisalsre",
  pinterest: "https://www.pinterest.com/assetsnappraisalsre/",
  linkedin: "https://www.linkedin.com/company/assets-appraisal-real-estate-llc/",
};

function PinterestIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 20.5c.8-2.6 1.3-4.7 1.6-6.2" />
      <path d="M10.1 14.3c-.5-.9-.6-2.1-.2-3.4.5-1.7 1.7-2.7 3.1-2.4 1.2.3 1.7 1.5 1.4 2.9-.4 1.9-1.3 3.2-2.8 3-1-.1-1.5-.8-1.5-.8" />
      <path d="M12 22a10 10 0 1 0-5.1-1.4" />
    </svg>
  );
}

const socialItems = [
  { label: "Facebook", href: SOCIAL_LINKS.facebook, Icon: Facebook },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, Icon: Instagram },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: Linkedin },
  { label: "X", href: SOCIAL_LINKS.x, Icon: Twitter },
  { label: "Pinterest", href: SOCIAL_LINKS.pinterest, Icon: PinterestIcon },
];

interface SocialLinksProps {
  linkClassName: string;
  iconClassName: string;
}

export default function SocialLinks({
  linkClassName,
  iconClassName,
}: SocialLinksProps) {
  return (
    <>
      {socialItems.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={linkClassName}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </>
  );
}
