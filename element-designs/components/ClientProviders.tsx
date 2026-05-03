'use client';

import Cursor from './Cursor';

/*
  Thin client wrapper in layout.tsx so the Server Component root layout
  can remain a server component while still mounting the cursor globally.
*/
export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Cursor />
    </>
  );
}
