import { Arrow } from "../ui/Arrow";

export type PageTitleProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
};

export const PageTitle = ({ subtitle, title }: PageTitleProps) => {
  return (
    <div className="flex flex-col items-center gap-3 mb-12">
      {subtitle && (
        <h2 className="font-supply-mono text-text-dark/60 flex items-center gap-2 uppercase text-xs tracking-widest">
          <Arrow className="rotate-90 fill-text-dark/60" />( {subtitle} )
          <Arrow className="rotate-90 fill-text-dark/60" />
        </h2>
      )}
      <h1 className="font-neue-montreal text-[clamp(1.8rem,5vw,3.75rem)] font-medium uppercase text-center leading-[1.1] tracking-tight whitespace-pre-wrap">
        {title}
      </h1>
    </div>
  );
};
