import { Image } from "~/components/image";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center text-foreground w-full">
      <div className="flex flex-col text-center items-center px-4 space-y-4">
        <Image
          src="/images/void.png"
          width={280}
          height={280}
          className="rounded-full"
          alt="Pixel art of a purple void with a black hole in the middle"
        />
        <p className="text-lg sm:text-xl max-w-md text-foreground/75">
          Oops! This page has <span className="text-foreground">vanished</span>{" "}
          into the <span className="text-foreground">digital void</span>. Go
          back to <span className="text-foreground">safety</span> using the{" "}
          <span className="text-foreground">header</span>.
        </p>
      </div>
    </div>
  );
}
