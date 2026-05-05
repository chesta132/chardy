import { cn } from "@/libs/utils";
import { Arrow } from "../ui/Arrow";
import { GitHubCalendar } from "react-github-calendar";
import { Globe, WEST_JAVA } from "../ui/Globe";
import { FaGithub } from "react-icons/fa";
import { ChardyLogo } from "../ui/Logo";
import { Button } from "../ui/Button";

const STATS = [
  { name: "Years of Experience", value: "1+" },
  { name: "Projects Completed", value: "10+" },
  { name: "Technologies Used", value: "10+" },
];

export const AboutMe = () => {
  return (
    <section id="about-me" className="size-full flex flex-col gap-8 py-16 px-2 md:px-4">
      <div className="bg-foreground text-background rounded-2xl flex flex-col gap-10 p-10 lg:p-16">
        <div>
          <h2 className="font-supply-mono text-background/60 flex items-center gap-2">
            ( ABOUT ME ) <Arrow className="rotate-90 fill-background/60" />
          </h2>
        </div>
        <div className="flex flex-col-reverse lg:flex-row justify-between gap-8">
          <div className="flex lg:flex-col gap-3 justify-between items-center">
            {STATS.map((stat, idx) => (
              <div
                key={stat.name}
                className={cn(
                  "size-full aspect-square p-px from-background/0 to-primary/60 rounded-lg",
                  idx % 2 === 0 ? "bg-linear-to-tr" : "bg-linear-to-tl",
                )}
              >
                <div className="p-8 text-center size-full items-center flex flex-col justify-center border border-background/10 rounded-lg bg-foreground">
                  <h3 className="text-[clamp(1rem,5vw,2.25rem)] font-neue-montreal">{stat.value}</h3>
                  <p className="text-[clamp(0.2rem,3vw,0.6rem)] text-background/50 font-inter">{stat.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col-reverse lg:flex-col gap-5 justify-start items-center lg:items-start w-full">
            {/* TODO: use Payload CMS */}
            {/* TODO: add year selection, from 5 year before now */}
            <GitHubCalendar username="chesta132" />
            <div className="flex justify-center flex-col lg:flex-row-reverse gap-2 w-full items-center">
              <div className="text-center lg:text-start">
                <h2 className="font-neue-montreal text-[clamp(1rem,5vw,2.25rem)] lg:leading-10 leading-6.5">
                  Based in Bekasi, Jawa Barat, Indonesia
                </h2>
                <h3 className="uppercase font-supply-mono text-text-light/50 text-[clamp(0.2rem,3vw,0.75rem)] mt-2">Available For Worldwide</h3>
              </div>
              <Globe markers={[{ location: WEST_JAVA, size: 0.08 }]} />
            </div>
          </div>
        </div>
        <div className="p-px rounded-xl overflow-hidden bg-linear-to-tl from-background/0 to-background/70">
          <div className="flex flex-col lg:flex-row gap-10 p-4 border border-background/10 rounded-xl bg-foreground">
            <div className="aspect-square w-full h-auto max-w-125 lg:size-125 bg-linear-to-tr from-[#f8a271] to-[#FF652F] rounded-lg">
              <ChardyLogo className="size-full" />
            </div>
            <div className="font-neue-montreal flex flex-col justify-between mb-3 lg:my-10 gap-5">
              <h2 className="text-[clamp(1rem,5vw,2.25rem)]">Chesta Ardiona</h2>
              <p className="text-[clamp(0.3rem,3vw,0.8rem)] whitespace-pre-wrap">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tristique augue in porttitor mattis. Sed ac metus cursus, varius sem eu,
                suscipit est. Etiam commodo cursus nunc, et rhoncus sapien cursus ac. Aenean leo massa, finibus ac aliquet ut, dictum nec tortor. Sed
                felis lorem, lacinia eget interdum id, dignissim vel diam.{"\n\n"}Mauris condimentum, enim sed pretium mollis, ipsum eros pulvinar
                sapien, non tempus neque urna non erat. Cras at ultrices risus. Nullam at nunc pharetra, commodo magna ut, egestas orci. Nulla in
                consectetur odio. Pellentesque rhoncus massa sit amet pulvinar tristique.{"\n\n"}Nulla sagittis efficitur ex, ut mollis nulla
                ullamcorper et. Curabitur euismod posuere eros, auctor fringilla lacus egestas sed. Donec a dapibus leo, in pellentesque quam. Etiam
                dictum dui est, vel fermentum quam tincidunt in.
              </p>
              <Button className="w-fit">Contact Me</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
