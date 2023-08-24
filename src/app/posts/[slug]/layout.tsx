type PostsLayoutProps = {
  children: React.ReactNode
}

export default function PostsLayout({ children }: PostsLayoutProps) {
  return <div className='flex flex-col gap-8 mt-20 text-lg'>{children}</div>
}
