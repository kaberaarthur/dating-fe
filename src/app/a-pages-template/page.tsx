import Footer from "../main/Footer/Footer";
import { BackwardIcon, HomeIcon} from '@heroicons/react/24/solid'
import Link from "next/link";


export default function CookiePreferences() {
    return (
    <>
        <div className="bg-gray-900">
        <div className="px-4 py-12 mx-auto lg:py-8 sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 bg-gray-900">
            {/* Backward Icon positioned above */}
            <div className="relative flex flex-col items-start space-y-4">
            <Link href="/">
                <BackwardIcon className="h-6 w-6 text-white cursor-pointer" />
            </Link>

            {/* Title with Calendar Icon in Background */}
            <div className="relative">
                {/* Calendar Icon as background on the right */}
                <HomeIcon
                className="absolute top-0 right-0 text-white/10 h-24 w-24"
                aria-hidden="true"
                />

                {/* Title */}
                <h1 className="text-4xl font-medium text-white relative z-10">
                Back to Home
                </h1>
            </div>
            </div>
        </div>
        </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <div className="p-8 rounded-lg shadow-lg">
          
        </div>
      </div>
      <Footer/>
    </>
    );
  }
  