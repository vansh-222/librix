import './globals.css';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'Librix — Smart Library Management for Modern Institutions',
  description:
    'A multi-tenant SaaS library management system for colleges, universities, and institutions. Manage books, borrowing, fines, and members with ease.',
  keywords: 'library management, SaaS, college library, book borrowing, digital library',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
