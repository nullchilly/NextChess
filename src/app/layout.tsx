import "./globals.css";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar/Navbar";
import {UserProvider} from "@/context/UserContext";

export const metadata: Metadata = {
  title: "Next-Chess",
  description: "NextJS Chess Game",
};

type LayoutType = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutType) => {
  return (
    <UserProvider>
      <html lang="en">
        <body>
          <ThemeProvider attribute="class" defaultTheme="light">
            <div style={{display: 'flex', minHeight: '100vh'}}>
              <Navbar />
              <div style={{flexGrow: 9, backgroundColor: '#57903C'}}>
                {children}
              </div>
            </div>
          </ThemeProvider>
       </body>
     </html>
    </UserProvider>
  );
};

export default Layout;
