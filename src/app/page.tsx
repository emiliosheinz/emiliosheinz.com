import { Image } from "~/components/image";
import { CommandBarTriggerFull } from "~/components/command-bar";

/** Revalidate the page once per week */
export const revalidate = 604800;

export default async function HomePage() {
  return (
    <main className="flex flex-col space-y-16 sm:space-y-24 self-center">
      <div className="flex items-center flex-col lg:flex-row" id="about">
        <Image
          priority
          src="/images/profile.png"
          width={280}
          height={280}
          className="rounded-full mb-10 lg:mb-0 lg:mr-16"
          alt="Emilio Heinzmann's picture in black and white with a blue background"
        />
        <div className="flex flex-col space-y-10 items-start">
          <h1 className="font-bold text-4xl sm:text-5xl">
            {"Hello "}
            <span className="text-5xl sm:text-6xl inline-block origin-bottom-right animate-waving-hand">
              👋
            </span>
            {`, I'm Emilio.`}
          </h1>
          <p className="text-lg sm:text-xl lg:max-w-2xl font-extralight leading-8 text-foreground/75">
            I&apos;m an experienced{" "}
            <span className="font-normal text-foreground">
              Full-stack Software Engineer
            </span>{" "}
            with a B.Sc. degree in{" "}
            <span className="font-normal text-foreground">
              Computer Science.{" "}
            </span>
            With over{" "}
            <span className="font-normal text-foreground">
              {new Date().getFullYear() - 2019} years
            </span>{" "}
            of experience, I build{" "}
            <span className="font-normal text-foreground">scalable</span>{" "}
            applications that prioritize and enhance the{" "}
            <span className="font-normal text-foreground">
              end-user experience
            </span>
            .
            <br />
            <br />
            <span className="text-foreground">
              I bring ideas to life 🧠, I turn coffee into code ☕️
            </span>
          </p>
          <CommandBarTriggerFull className="-ml-4" />
        </div>
      </div>
    </main>
  );
}
