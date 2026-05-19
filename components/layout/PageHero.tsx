import Image from "next/image";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  backgroundImage?: string;
  backgroundAlt?: string;
  className?: string;
  contentClassName?: string;
  children?: React.ReactNode;
};

export default function PageHero({
  title,
  description,
  badge,
  backgroundImage,
  backgroundAlt = "",
  className,
  contentClassName,
  children,
}: PageHeroProps) {
  return (
    <div
      className={cn(
        "bg-secondary relative flex h-[48vh] items-center justify-center sm:h-[52vh] lg:h-[60vh] py-10",
        className,
      )}
    >
      {backgroundImage ? (
        <div className="absolute inset-0 overflow-hidden opacity-20" aria-hidden>
          <Image
            src={backgroundImage}
            alt={backgroundAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : null}
      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8",
          contentClassName,
        )}
      >
        {badge ? (
          <div className="mb-4 flex justify-center">{badge}</div>
        ) : null}
        <h1 className="mb-2 mt-28 max-w-4xl text-xl font-bold text-white sm:mb-3 sm:mt-32 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto max-w-2xl text-center text-xs text-gray-300 sm:text-sm md:text-base lg:text-lg">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
