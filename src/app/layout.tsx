import './globals.css';
import type { Metadata } from 'next';

import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar/Navbar';

export const metadata: Metadata = {
  title: 'Next-Chess',
  description: 'NextJS Chess Game',
};

type LayoutType = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutType) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
