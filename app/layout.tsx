import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BLUESTONIE Investments",
  description:
    "BLUESTONIE Investments — opportunities, activities and financial services.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}