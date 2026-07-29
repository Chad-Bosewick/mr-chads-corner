import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "@/styles/globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AsciiShader } from "@/components/effects/AsciiShader";
import { AnimationProvider, GlobalAnimationPauseControl } from "@/components/providers/AnimationProvider";

const inter = Inter({
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mrchad.netlify.app"
  ),
  title: {
    template: "%s | Temi Adekunle",
    default: "Temi Adekunle — Product Design Portfolio",
  },
  description:
    "Product designer who thinks in systems and shapes digital experiences with taste and empathy.",
  openGraph: {
    title: "Temi Adekunle — Product Design Portfolio",
    description:
      "Product designer who thinks in systems and shapes digital experiences with taste and empathy.",
    url: "/",
    siteName: "Temi Adekunle",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/social/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Temi Adekunle, Product Designer — Systems-minded digital experiences shaped with taste and empathy.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Temi Adekunle — Product Design Portfolio",
    description:
      "Product designer who thinks in systems and shapes digital experiences with taste and empathy.",
    images: ["/images/social/og-preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable}`}
    >
      <body
        className="min-h-screen font-sans"
        style={{
          backgroundImage: 'url(/paper-texture.webp)',
          backgroundRepeat: 'repeat',
          backgroundColor: "#f5f2ee",
        }}
      >
        <AnimationProvider>
          <AsciiShader />
          <GlobalAnimationPauseControl />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Nav />
          <main id="main-content">{children}</main>
          <Footer />
        </AnimationProvider>
      </body>
    </html>
  );
}
