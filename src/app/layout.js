import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AlertProvider } from "./scripts/Alert.context";
import { AlertContainer } from "./components/container/Alert.container";
import { ConfirmProvider } from "./scripts/Confirm.context";
import { ConfirmContainer } from "./components/container/Confirm.container";
import { TooltipProvider } from "./scripts/Tooltip.context";
import { TooltipContainer } from "./components/container/Tooltip.container";
import { ContentProvider } from "./scripts/Content.context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Metronique Docs - Simplify your speed work environment",
  description: "Integrated with Anthropic and OpenAI will help you for speed and smart working.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfirmProvider>
          <AlertProvider>
            <ContentProvider>
              <TooltipProvider>
                <TooltipContainer />
                <ConfirmContainer />
                <AlertContainer />
                {children}
              </TooltipProvider>
            </ContentProvider>
          </AlertProvider>
        </ConfirmProvider>
      </body>
    </html>
  );
}