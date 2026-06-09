export type ServiceTitledItem = {
  title: string;
  description: string;
};

export type ServiceStepItem = {
  step: string;
  title: string;
  description: string;
};

export type ServiceCoverageArea = {
  region: string;
  locations: string;
};

export type ServicePricingRow = {
  label: string;
  validity: string;
  notes: string;
};

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type Service = {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  overview?: string;
  features?: string[];
  icon?: string;
  heroImage?: string;
  whyChooseTitle?: string;
  whyChooseSubtitle?: string;
  whyChooseItems?: ServiceTitledItem[];
  offeringsTitle?: string;
  offeringsSubtitle?: string;
  offerings?: ServiceTitledItem[];
  stepsTitle?: string;
  stepsSubtitle?: string;
  steps?: ServiceStepItem[];
  coverageTitle?: string;
  coverageSubtitle?: string;
  coverageAreas?: ServiceCoverageArea[];
  pricingTitle?: string;
  pricingSubtitle?: string;
  pricingRows?: ServicePricingRow[];
  faqTitle?: string;
  faqSubtitle?: string;
  faqs?: ServiceFaqItem[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  consultationPhone?: string;
  consultationEmail?: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type ServiceCardData = Pick<
  Service,
  | "name"
  | "slug"
  | "shortDescription"
  | "features"
  | "icon"
  | "heroImage"
  | "displayOrder"
>;
