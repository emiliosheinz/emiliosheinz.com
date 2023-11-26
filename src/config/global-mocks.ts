jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: jest.fn(() => '/'),
}))
