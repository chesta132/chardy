import { cn } from "@/libs/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Loading = ({ className, ...props }: React.ComponentProps<typeof DotLottieReact>) => {
  return (
    <DotLottieReact
      src="/assets/lotties/loading.lottie"
      className={cn("w-auto h-6", className)}
      autoplay
      loop
      {...props}
    />
  );
};
