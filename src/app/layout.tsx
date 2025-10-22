
'use client';

import './globals.css';
import { cn } from "@/lib/utils";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import PageTitle from '@/components/layout/PageTitle';
import { Chatbot } from '@/components/chatbot';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="icon" href="https://res.cloudinary.com/drwi9cpdi/image/upload/v1760517967/weGo_mcux3i.jpg" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")} suppressHydrationWarning>
        <I18nextProvider i18n={i18n}>
          <FirebaseClientProvider>
            <PageTitle />
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster />
            <Chatbot />
          </FirebaseClientProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
