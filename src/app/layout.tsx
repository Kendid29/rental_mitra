import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { MotionProvider } from '@/components/providers/motion-provider';
import { LenisProvider } from '@/components/providers/lenis-provider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'RentalinAja Partner Portal — Sistem Manajemen Operasional Mitra',
  description:
    'SaaS portal manajemen armada kendaraan, jadwal ketersediaan, serah terima, pengembalian, dan laporan keuangan multi-mitra RentalinAja.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-[#F8FAFC] text-[#191C1E]">
        <AuthProvider>
          <MotionProvider>
            <LenisProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: '#102447',
                    color: '#ffffff',
                    fontSize: '13px',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 8px 24px rgba(16,36,71,0.2)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#00C48C',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#FF4D4D',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </LenisProvider>
          </MotionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
