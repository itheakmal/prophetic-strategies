export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-l-4 border-amber-500 pl-4'>
      <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800'>
        Admin
      </p>
      {children}
    </div>
  );
}
