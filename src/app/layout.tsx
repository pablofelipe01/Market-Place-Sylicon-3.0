import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Box } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Sylicon",
  description: "Tokenización y fraccionamiento: transformando el mercado inmobiliario en colombia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh", margin: 0 }}>
        <Providers>
          <Navbar />
          <Box flex="1" display="flex" flexDirection="column">
            {children}
          </Box>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
