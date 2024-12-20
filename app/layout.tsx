import type { Metadata } from "next";
import { Inter, Racing_Sans_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { FeaturesProvider } from "@/contexts/features-context";
import QueryProvider from "@/providers/query-provider";
import { TimezoneProvider } from '@/contexts/timezone-context';

const inter = Inter({ subsets: ["latin"] });
const racingSansOne = Racing_Sans_One({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-racing"
});

export const metadata: Metadata = {
  title: "AKW Racing Academy",
  description: "Premier Karting Academy in Wellington, FL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${racingSansOne.variable} antialiased bg-background text-foreground`} suppressHydrationWarning>
        <TimezoneProvider>
          <ThemeProvider>
            <AuthProvider>
              <FeaturesProvider>
                <QueryProvider>
                  <Navigation />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                  <Toaster />
                </QueryProvider>
              </FeaturesProvider>
            </AuthProvider>
          </ThemeProvider>
        </TimezoneProvider>
      </body>
    </html>
  );
}