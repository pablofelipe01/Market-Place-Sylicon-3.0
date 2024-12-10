import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Box } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Sylicon",
  description: "Tokenización y fraccionamiento: transformando el mercado inmobiliario en Colombia",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh", height: "100%", margin: 0 }}>
        <Providers>
          <Navbar />
          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            mt="80px"  // Adjust this value based on your Navbar height
          >
            {children}
          </Box>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
