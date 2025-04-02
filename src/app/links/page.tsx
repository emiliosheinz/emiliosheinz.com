import { MailIcon, PaperclipIcon } from "lucide-react";
import { Image } from "~/components/image";
import { socialMedias } from "~/data/social-medias";

export default async function LinksPage() {
  return (
    <main className="flex flex-col w-full items-center gap-8 pt-14 self-center">
      <div className="flex flex-col w-full max-w-xl">
        <div className="flex flex-row w-full gap-3 border bg-accent/75 px-5 py-3 rounded-lg">
          <Image
            src="/images/profile.png"
            width={50}
            height={50}
            className="rounded-full"
            alt="Emilio Heinzmann's picture in black and white with a blue background"
          />
          <div>
            <h2 className="font-bold text-lg">
              Emilio {"  "}
              <span className="text-sm font-normal text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </h2>
            <p className="text-base">
              I&apos;m happy to have you around! Here you can find links to
              everything I do online. I hope you find something useful!
            </p>
          </div>
        </div>
        <a href="mailto:emiliosheinz@gmail.com" target="_blank">
          <div className="flex flex-row items-center gap-5 border bg-accent/75 px-5 py-3 rounded-lg mt-4 transition-transform hover:scale-105">
            <MailIcon className="w-5 h-5" />
            <p className="text-base">Send me an email</p>
          </div>
        </a>
        <a href="/files/resume.pdf" target="_blank">
          <div className="flex flex-row items-center gap-5 border bg-accent/75 px-5 py-3 rounded-lg mt-4 transition-transform hover:scale-105">
            <PaperclipIcon className="w-5 h-5" />
            <p className="text-base">Check out my resume</p>
          </div>
        </a>
        {socialMedias.map(({ url, Icon, name }) => (
          <a key={name} href={url} target="_blank">
            <div className="flex flex-row items-center gap-5 border bg-accent/75 px-5 py-3 rounded-lg mt-4 transition-transform hover:scale-105">
              <Icon className="w-5 h-5" />
              <p className="text-base">{name}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
