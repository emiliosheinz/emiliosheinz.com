import type { Action } from "kbar";
import {
  AtSignIcon,
  BookOpenIcon,
  CodeIcon,
  HomeIcon,
  LightbulbIcon,
  LinkIcon,
  VideoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { socialMedias } from "~/data/social-medias";
import { notify } from "~/utils/toast";

export function useCommandBarActions(): Action[] {
  const router = useRouter();

  const utilActions: Action[] = [
    {
      id: "copy-url",
      name: "Copy URL",
      keywords: "copy url",
      perform: () => {
        navigator.clipboard.writeText(window.location.href);
        notify.success("URL copied to clipboard");
      },
      icon: <LinkIcon className="w-5 h-5 text-accent-foreground" />,
    },
    {
      id: "source-code",
      name: "Source code",
      keywords: "source code",
      perform: () => {
        window.open(
          "https://github.com/emiliosheinz/emiliosheinz.com",
          "_blank",
        );
      },
      icon: <CodeIcon className="w-5 h-5 text-accent-foreground" />,
    },
    {
      id: "email",
      name: "Send me an email",
      keywords: "email",
      perform: () => {
        window.open("mailto:emiliosheinz@gmail.com", "_blank");
      },
      icon: <AtSignIcon className="w-5 h-5 text-accent-foreground" />,
    },
  ].map((action) => ({ ...action, section: "Util" }));

  const socialMediaActions: Action[] = socialMedias.map(
    ({ Icon, url, name }) => ({
      name,
      id: name.toLowerCase(),
      keywords: name.toLocaleLowerCase(),
      perform: () => window.open(url, "_blank"),
      icon: <Icon className="w-5 h-5 text-accent-foreground" />,
      section: "Social Media",
    }),
  );

  const goToActions: Action[] = [
    {
      id: "home",
      name: "Home",
      keywords: "home page start initial",
      perform: () => router.push("/"),
      icon: <HomeIcon className="w-5 h-5 text-accent-foreground" />,
    },
    {
      id: "experience",
      name: "Experience",
      keywords: "experience work jobs",
      perform: () => router.push("/experiences"),
      icon: <LightbulbIcon className="w-5 h-5 text-accent-foreground" />,
    },
    {
      id: "blog-posts",
      name: "Blog Posts",
      keywords: "blog posts articles",
      perform: () => router.push("/posts"),
      icon: <BookOpenIcon className="w-5 h-5 text-accent-foreground" />,
    },
    {
      id: "youtube-videos",
      name: "YouTube Videos",
      keywords: "videos yotube channel",
      perform: () => router.push("/videos"),
      icon: <VideoIcon className="w-5 h-5 text-accent-foreground" />,
    },
    {
      id: "link",
      name: "Links",
      keywords: "links",
      perform: () => router.push("/links"),
      icon: <LinkIcon className="w-5 h-5 text-accent-foreground" />,
    },
  ].map((action) => ({ ...action, section: "Go to" }));

  return [...goToActions, ...socialMediaActions, ...utilActions];
}
