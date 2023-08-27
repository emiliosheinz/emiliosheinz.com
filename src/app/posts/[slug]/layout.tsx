type PostsLayoutProps = {
  children: React.ReactNode
}

export default function PostsLayout({ children }: PostsLayoutProps) {
  return (
    <main className='flex flex-col gap-5 sm:gap-8 text-sm sm:text-lg'>
      {children}
    </main>
  )
}
