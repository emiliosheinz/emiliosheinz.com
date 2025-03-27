import { Action } from "kbar";
import { useRouter } from "next/navigation";
import {
  HiOutlineAtSymbol,
  HiOutlineBookOpen,
  HiOutlineCodeBracket,
  HiOutlineHome,
  HiOutlineLightBulb,
  HiOutlineLink,
} from "react-icons/hi2";
import { socialMedias } from "~/data/social-medias";
import { notify } from "~/utils/toast.utils";

export function useActions(): Action[] {
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
      icon: <HiOutlineLink className="w-5 h-5 text-accent-foreground" />,
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
      icon: <HiOutlineCodeBracket className="w-5 h-5 text-accent-foreground" />,
    },
    {
      id: "email",
      name: "Send me an email",
      keywords: "email",
      perform: () => {
        window.open("mailto:emiliosheinz@gmail.com", "_blank");
      },
      icon: <HiOutlineAtSymbol className="w-5 h-5 text-accent-foreground" />,
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
      icon: <HiOutlineHome className="w-5 h-5 text-accent-foreground" />,
    },
    {
      id: "experience",
      name: "Experience",
      keywords: "experience work jobs",
      perform: () => router.push("/experiences"),
      icon: <HiOutlineLightBulb className="w-5 h-5 text-accent-foreground" />,
    },
    {
      id: "blog-posts",
      name: "Blog Posts",
      keywords: "blog posts articles",
      perform: () => router.push("/posts"),
      icon: <HiOutlineBookOpen className="w-5 h-5 text-accent-foreground" />,
    },
  ].map((action) => ({ ...action, section: "Go to" }));

  return [...goToActions, ...socialMediaActions, ...utilActions];
}
