"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type CarouselImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ImageCarouselProps = {
  images: CarouselImage[];
};

const ARROW_BUTTON_CLASSES =
  "inline-flex items-center justify-center size-7 rounded-full text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors";

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || images.length <= 1) return;

    const update = () => {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      if (max === 0) {
        setActiveIndex(0);
        return;
      }
      const progress = scroller.scrollLeft / max;
      const index = Math.round(progress * (images.length - 1));
      setActiveIndex(Math.max(0, Math.min(images.length - 1, index)));
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [images.length]);

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller || images.length <= 1) return;
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    scroller.scrollTo({
      left: (index / (images.length - 1)) * max,
      behavior: "smooth",
    });
  };

  const focused = focusedIndex !== null ? images[focusedIndex] : null;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={scrollerRef}
        className="flex gap-3 aspect-square sm:aspect-video w-full overflow-x-auto touch-pan-x overscroll-x-contain p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setFocusedIndex(index)}
            className="relative shrink-0 h-full rounded-lg overflow-hidden cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
            aria-label={`Open image ${index + 1}: ${image.alt}`}
          >
            <NextImage
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 672px, 100vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous image"
          className={ARROW_BUTTON_CLASSES}
        >
          <ChevronLeft className="size-5 -translate-x-[1px]" />
        </button>
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to image ${index + 1}`}
              aria-current={activeIndex === index}
              className={cn(
                "size-2 rounded-full transition-colors",
                activeIndex === index
                  ? "bg-foreground"
                  : "bg-foreground/30 hover:bg-foreground/60",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === images.length - 1}
          aria-label="Next image"
          className={ARROW_BUTTON_CLASSES}
        >
          <ChevronRight className="size-5 translate-x-[1px]" />
        </button>
      </div>
      <Dialog.Root
        open={focused !== null}
        onOpenChange={(open) => {
          if (!open) setFocusedIndex(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/90 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed z-40 inset-0 flex justify-center items-center p-6 sm:p-12 animate-in fade-in duration-300">
            {focused && (
              <NextImage
                src={focused.src}
                alt={focused.alt}
                width={focused.width}
                height={focused.height}
                sizes="100vw"
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
              />
            )}
            <Dialog.Close asChild>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-5 right-5 text-white hover:bg-white/10 hover:text-white"
                aria-label="Close image"
              >
                <X className="size-5" />
              </Button>
            </Dialog.Close>
            <Dialog.Title className="sr-only">
              {focused?.alt ?? "Image preview"}
            </Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
