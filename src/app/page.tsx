import { ExperienceCard } from "~/components/experience-card";
import { Link } from "~/components/link";
import { Slider } from "~/components/slider";
import { socialMedias } from "~/data/social-medias";
import { currentExperience } from "~/content/experiences";
import { getLastFivePosts } from "~/content/posts";
import { Image } from "~/components/image";
import { CommandBarTriggerFull } from "~/components/command-bar";
import { Section } from "~/components/section";
import { getYouTubeVideos } from "~/utils/youtube.utils";
import { PostCard } from "~/components/card";
import { YouTubeVideoCard } from "~/components/card/card.component";

/** Revalidate the page once per week */
export const revalidate = 604800;

export default async function HomePage() {
  const { videos } = await getYouTubeVideos({ maxResults: 5 });

  return (
    <main className="flex flex-col space-y-16 sm:space-y-24">
      <div className="flex items-center flex-col lg:flex-row" id="about">
        <Image
          src="/images/profile.png"
          width={225}
          height={225}
          className="rounded-full mb-10 lg:mb-0 lg:mr-10"
          alt="Emilio Heinzmann's picture in black and white with a blue background"
        />
        <div className="flex flex-col space-y-6 sm:space-y-10 items-start">
          <h1 className="font-bold text-4xl sm:text-5xl">
            {"Hello "}
            <span className="text-5xl sm:text-6xl inline-block origin-bottom-right animate-waving-hand">
              👋
            </span>
            {`, I'm Emilio.`}
          </h1>
          <p className="text-lg sm:text-xl lg:max-w-2xl font-extralight leading-8 text-foreground/75">
            I&apos;m an experienced{" "}
            <span className="font-normal text-foreground">Software Engineer</span>{" "}
            with a B.Sc. degree in{" "}
            <span className="font-normal text-foreground">Computer Science</span>, I
            have been building applications that are daily accessed by thousands
            of users for over{" "}
            <span className="font-normal text-foreground">
              {new Date().getFullYear() - 2019} years.
            </span>
            <br />
            <br />
            <span className="text-foreground">
              I bring ideas to life 🧠, I turn coffee into code ☕️
            </span>
          </p>
          <CommandBarTriggerFull className="-ml-4" />
        </div>
      </div>

      {/* <Section title="Experience" id="experience"> */}
      {/*   <ExperienceCard */}
      {/*     {...currentExperience} */}
      {/*     description={currentExperience.body} */}
      {/*   /> */}
      {/*   <Link label="see my full experience history" href="/experiences" /> */}
      {/* </Section> */}
      {/**/}
      {/* <Section title="Blog posts" id="blog"> */}
      {/*   <Slider.Root> */}
      {/*     {getLastFivePosts().map(({ title, url, image, description }) => ( */}
      {/*       <Slider.Item key={title}> */}
      {/*         <PostCard */}
      {/*           url={url} */}
      {/*           image={image} */}
      {/*           title={title} */}
      {/*           description={description} */}
      {/*         /> */}
      {/*       </Slider.Item> */}
      {/*     ))} */}
      {/*   </Slider.Root> */}
      {/*   <Link label="see all posts" href="/posts" /> */}
      {/* </Section> */}
      {/**/}
      {/* <Section title="Videos" id="videos"> */}
      {/*   <Slider.Root> */}
      {/*     {videos.map(({ id, title, description, thumbnail }) => ( */}
      {/*       <Slider.Item key={id}> */}
      {/*         <YouTubeVideoCard */}
      {/*           title={title} */}
      {/*           image={thumbnail} */}
      {/*           description={description} */}
      {/*           url={`https://www.youtube.com/watch?v=${id}`} */}
      {/*         /> */}
      {/*       </Slider.Item> */}
      {/*     ))} */}
      {/*   </Slider.Root> */}
      {/*   <Link label="see all videos" href="/videos" /> */}
      {/* </Section> */}
      {/**/}
      {/* <Section title="Contact me" id="contact"> */}
      {/*   <p className="text-xl sm:text-2xl max-w-3xl"> */}
      {/*     {`I'm always open for a chat!`} */}
      {/*     <br /> */}
      {/*     <br /> */}
      {/*     Send me an email at{" "} */}
      {/*     <a */}
      {/*       className="underline underline-offset-4" */}
      {/*       href="mailto:emiliosheinz@gmail.com" */}
      {/*     > */}
      {/*       emiliosheinz@gmail.com */}
      {/*     </a>{" "} */}
      {/*     or reach me out on social media. */}
      {/*   </p> */}
      {/*   <div className="flex space-x-8"> */}
      {/*     {socialMedias.map(({ Icon, url, name }) => ( */}
      {/*       <a target="_blank" key={name} href={url}> */}
      {/*         <Icon className="w-6 h-6 sm:w-8 sm:h-8 hover:text-dodger-blue hover:cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105" /> */}
      {/*       </a> */}
      {/*     ))} */}
      {/*   </div> */}
      {/* </Section> */}
    </main>
  );
}
