import React from "react";
import "../App.css";
import "../index.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DataProvider } from "../context/dataContext";

export const metadata = {
  title: "Summoners Card",
  charset: "UTF-8",
  favicon: "/favicon.ico",
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
          <div id="root">{children}</div>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}
