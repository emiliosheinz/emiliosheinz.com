type PostsLayoutProps = {
  children: React.ReactNode;
};

export default function PostsLayout({ children }: PostsLayoutProps) {
  return (
    <main className="flex flex-col gap-5 sm:gap-8 text-base sm:text-lg pt-14 w-full leading-8">
      {children}
    </main>
  );
}
