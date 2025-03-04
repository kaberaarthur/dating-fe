import React from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../app/main/Footer/Footer";


// Assuming you have an image asset for the couple
// You can place the image in `public/couple.png` or use a placeholder for now
const CoupleImage = "/couple02.PNG"; // Replace with your actual image path or use a placeholder

export default function Home() {
  return (
    <div>
        <div className="min-h-screen bg-purple-100 flex flex-col items-center justify-center p-4">
        {/* Header */}
        <header className="w-full max-w-4xl flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-black">SocialPendo</h1>
            <Link href="/login">
            <button className="bg-transparent text-black border border-black px-4 py-2 rounded-md hover:bg-gray-200">
                Have an account? Sign In
            </button>
            </Link>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center text-center max-w-4xl w-full">
        <div className=""> 
                <h1
                    className="text-5xl font-bold mb-4"
                    style={{
                        fontSize: "60px",
                        letterSpacing: "0.1em",
                        WebkitTextFillColor: "transparent",
                        WebkitTextStrokeWidth: "1px",
                        WebkitTextStrokeColor: "white",
                        textShadow: "4px 4px #ff1f8f, 8px 8px #000000",
                    }}
                >
                    DATING FOR EVERYONE
                </h1>
            </div>
            <p className="text-lg text-gray-800 mb-2">
            SocialPendo is the only dating app that matches you on what matters to you. Meet them today and find who you’re looking for.
            </p>

            {/* Image of Couple */}
            <div className="mb-8 w-full flex justify-center">
            <Image
                src={CoupleImage}
                alt="Couple on a date"
                width={500} // Adjust based on your image size
                height={300} // Adjust based on your image size
                className="rounded-lg object-cover"
            />
            </div>

            {/* Legal Text */}
            <p className="text-sm text-gray-600 mb-6">
            By clicking Join, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookies Policy.
            </p>

            {/* CTA Button */}
            <Link href="/register" className="bg-black text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-800 mb-6">
            JOIN SOCIALPENDO
            </Link>

            {/* App Store Links */}
            <div className="flex space-x-4 mb-8">
            <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
            >
                <Image
                src="/appstore.svg" // Replace with your Apple Store badge image
                alt="Download on the App Store"
                width={120}
                height={40}
                />
            </a>
            <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
            >
                <Image
                src="/playstore.svg" // Replace with your Google Play badge image
                alt="Get it on Google Play"
                width={120}
                height={40}
                />
            </a>
            </div>
        </main>
        </div>
    

        {/* Footer Section */}
            <Footer />
        {/* Footer Section */}
    </div>
  );
}