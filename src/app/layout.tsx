import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@assets/styles/globals.css";
import { Header, Footer } from "@components/index";
import FavIcon from "@images/icons/favicon.ico";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi-Modal ChatBot - Encode AI Bootcamp (Q3 2024)",
  description: "Creating a Multi-Modal Chat Bot",
  icons: {
    icon: FavIcon.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen ">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
