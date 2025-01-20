"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Store, { persistor } from "../app/Redux/Store";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { TailSpin } from "react-loading-icons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className="antialiased Panchang"
        style={{ fontFamily: "ClashDisplay" }}
      >
        <Provider store={Store}>
          <PersistGate
            loading={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <TailSpin />
              </div>
            }
            persistor={persistor}
          >
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
