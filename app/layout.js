import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "SamBlog - Modern Blog Platform",
  description:
    "A modern, full-stack blog platform with admin panel, optimized for performance and SEO.",
  keywords: [
    "blog",
    "nextjs",
    "react",
    "mongodb",
    "admin",
    "seo",
    "modern",
    "tailwindcss",
  ],
  metadataBase: new URL("https://samblog.vercel.app"),
  openGraph: {
    title: "SamBlog - Modern Blog Platform",
    description:
      "A modern, full-stack blog platform with admin panel, optimized for performance and SEO.",
    url: "https://samblog.vercel.app/",
    siteName: "SamBlog",
    images: [
      {
        url: "https://res.cloudinary.com/ducp0i8kz/image/upload/v1752470670/samblog/hjrgeqqylb21l1wsqqylv.png",
        width: 1200,
        height: 630,
        alt: "SamBlog Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SamBlog - Modern Blog Platform",
    description:
      "A modern, full-stack blog platform with admin panel, optimized for performance and SEO.",
    site: "@samratavi94",
    creator: "@samratavi94",
    images: [
      {
        url: "https://res.cloudinary.com/ducp0i8kz/image/upload/v1752470670/samblog/hjrgeqqylb21l1wsqqylv.png",
        alt: "SamBlog Preview",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
