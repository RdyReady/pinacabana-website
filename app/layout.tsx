import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Piña Cabana | Mobile Cocktail Bar in Boracay",
  description: "Proper cocktails and honest service—this level isn't limited to high-end bars. A Tequila & Mezcal mobile bar serving Boracay Island, Aklan.",
  keywords: "mobile bar, Boracay, cocktails, tequila, mezcal, beach weddings, events, bartender",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
