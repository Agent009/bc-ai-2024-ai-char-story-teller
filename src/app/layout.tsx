import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@assets/styles/globals.css";
import { Header, Footer } from "@components/index";
import FavIcon from "@images/icons/favicon.ico";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi-Character AI Story Telling App- Encode AI Bootcamp (Q3 2024)",
  description: "Craft unique tales by adding characters, choosing a genre, and setting the perfect tone.",
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
