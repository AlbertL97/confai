import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://confai.vercel.app"),
  title: {
    default: "ConfAI",
    template: "%s | ConfAI",
  },
  description:
    "A source-grounded European conference repository for AI, psychology, cognitive science, HCI, and adjacent research fields.",
  openGraph: {
    title: "ConfAI",
    description:
      "Track European scientific conferences, deadlines, fees, and source provenance.",
    siteName: "ConfAI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white text-zinc-950 antialiased">
        {children}
      </body>
    </html>
  );
}
