import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shlokaglobaleducation.com"),
  title: "Shloka Global Education | Automation & Manual Testing Training",
  description:
    "Launch your high-paying IT QA career with Shloka Global Education. 45-Day Industry-Focused Automation Testing program at ₹19,000 with 100% FREE Manual Testing Add-On. Online batches, real projects & 100% placement support.",
  keywords: [
    "software testing course hyderabad",
    "automation testing training",
    "manual testing training online",
    "selenium testing course",
    "shloka global education kukatpally",
    "qa tester certification",
    "automation engineer course",
  ],
  icons: {
    icon: "/images/logo.jpg",
  },
  openGraph: {
    title: "Shloka Global Education | Automation & Manual Testing Training",
    description:
      "45-Day Industry-Focused Automation Testing program at ₹19,000 + FREE Manual Testing training. 100% online training with live projects.",
    url: "https://shlokaglobaleducation.com",
    siteName: "Shloka Global Education",
    images: [
      {
        url: "/images/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Shloka Global Education Software Testing Course",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {pixelId && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body className="font-sans min-h-screen bg-white text-slate-800 antialiased">
        {pixelId && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
