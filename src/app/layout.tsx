import "./globals.css";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "Next-Chess",
  description: "NextJS Chess Game",
};

type LayoutType = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutType) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div style={{display: 'flex', height: '100vh'}}>
            <Navbar />
            <div style={{flexGrow: 9, backgroundColor: '#57903C'}}>
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
