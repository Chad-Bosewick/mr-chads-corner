import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "@/styles/globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Temi Adekunle",
    default: "Temi Adekunle — Product Design Portfolio",
  },
  description:
    "Product designer who thinks in systems and delivers polished, intentional digital experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${lora.variable}`}
    >
      <body
        className="min-h-screen font-sans"
        style={{
          backgroundImage: 'url(/paper-texture.webp)',
          backgroundRepeat: 'repeat',
        }}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
