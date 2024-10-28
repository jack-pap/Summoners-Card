import React from "react";
import "../App.css";
import "../index.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DataProvider } from "../context/dataContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Summoners Card",
  description: "A stats viewing web application using the Riot API",
  charset: "UTF-8",
  favicon: "/favicon.ico",
  openGraph: {
    images: "/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          {" "}
          <div id="root">
            <Analytics />
            <SpeedInsights />
            {children}
            <Footer />
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
