import type { Metadata } from "next";
import "./globals.css";
import StickyTopBar from "../components/StickyTopBar";
import FloatingIGButton from "../components/FloatingIGButton";

export const metadata: Metadata = {
  title: "Piña Cabana | Mobile Cocktail Bar — Opening June 30, 2026 in Boracay",
  description:
    "Proper cocktails and honest service. A premium mobile cocktail bar opening June 30, 2026 on Boracay Island, Aklan. Weddings · Private Events · Beach & Villa Pop-ups · Brand Activations.",
  keywords:
    "mobile bar Boracay, Boracay cocktails, beach wedding bar, private event bar Aklan, Piña Cabana, bartender Boracay",
  openGraph: {
    title: "Piña Cabana — Opening June 30, 2026",
    description:
      "Boracay's premium mobile cocktail bar. Proper cocktails, honest service, Filipino warmth. Inquire & book via Instagram.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StickyTopBar />
        {children}
        <FloatingIGButton />
      </body>
    </html>
  );
}
