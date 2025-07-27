import type { Metadata } from "next";
import '@mantine/core/styles.css';
import { MantineProvider } from "@mantine/core";
import { ColorSchemeScript } from "@mantine/core";
import "./globals.css";

export const metadata: Metadata = {
  title: "Library UI",
  description: "Next.js + Mantine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </head>
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
