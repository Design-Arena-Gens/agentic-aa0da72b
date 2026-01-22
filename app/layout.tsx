import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Macro Bot Ultimate",
  description: "Advanced macro automation studio with AI-assisted documentation"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
