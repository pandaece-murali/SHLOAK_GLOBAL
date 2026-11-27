import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You for Registering | Shloka Global Education",
  description:
    "Thank you for your enquiry. Our admissions team at Shloka Global Education will connect with you shortly with your free demo class details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
