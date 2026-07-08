import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniVoucher Sphere Starter',
  description: 'Digital voucher marketplace starter using Unicity Sphere Connect.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
