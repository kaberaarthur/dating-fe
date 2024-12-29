"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Store, { persistor } from "../app/Redux/Store"; // Import persistor
import React from "react";
import { useSelector, Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import { RootState } from "../app/Redux/Store";

const DebugRedux: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  return (
    <div>
      <h2>Redux Debug Info:</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

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
      <body className="antialiased Panchang" style={{ fontFamily: 'ClashDisplay' }}>
        <Provider store={Store}>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            {/*<h1 className="py-4">This is the Outer Wrapper</h1>
            <DebugRedux />*/}
            {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
