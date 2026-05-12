import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Welth",
  description: "AI finance tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${monaSans.className} antialiased`}>
          {/*header*/}
          <Header />
          <main className={"min-h-screen"}>{children}</main>
          <Toaster richColors />
          {/*footer*/}
          <footer className={"bg-blue-50 py-12"}>
            <div className={"container mx-auto px-4 text-center text-gray-500"}>
              made by John
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
