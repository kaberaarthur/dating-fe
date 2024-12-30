import joto from '../../../public/joto.png';
import fire from '../../../public/fire.png';
import sampleProfile from '../../../public/sample-profile.jpg';

import Footer from './Footer/Footer';

export default function Home() {
    return (
      <div>
        {/* Navbar */}
        <div className="sticky top-0 z-50 bg-gray-900 shadow-md">
          <div className="max-w-screen-lg mx-auto flex items-center justify-between px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center space-x-6">
                <img src={joto.src} alt="Joto Logo" className="h-10 w-auto" />
              <a href="#" className="text-white text-sm font-medium hover:text-violet-500">
                Discover
              </a>
              <a href="#" className="text-white text-sm font-medium hover:text-violet-500">
                Likes
              </a>
              <a href="#" className="text-white text-sm font-medium hover:text-violet-500">
                Messages
              </a>
            </div>
  
            {/* Right Section */}
            <div className="flex items-center space-x-6">
              <button
                className="bg-[#8207D1] text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-[#6a05a7]"
              >
                Get Premium
              </button>

              <button
                className="bg-orange-500 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-orange-600 flex items-center space-x-2"
              >
                <span>Boost</span>
                <img src={fire.src} alt="Fire Icon" className="h-5 w-5" />
              </button>

              <img
                src={sampleProfile.src}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>
        {/* Navbar */}

        {/* Content Section */}
        <div className="p-6 space-y-6 bg-gray-100 text-gray-900">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tristique libero eu
            turpis dapibus, in dictum massa cursus. Sed accumsan vehicula eros, non feugiat justo
            hendrerit a.
          </p>
          <p>
            Suspendisse potenti. Quisque accumsan nisi ut magna auctor, nec vehicula arcu feugiat.
            Aenean efficitur nisi quis felis vehicula, et vulputate justo ultricies. Fusce
            consectetur, augue in feugiat luctus, justo mi tempor risus, id venenatis velit ex eu
            lorem.
          </p>
          {[...Array(20)].map((_, index) => (
            <p key={index}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a elit velit.
              Pellentesque auctor, sapien in vehicula consectetur, arcu risus scelerisque ipsum,
              non tempus elit arcu non libero.
            </p>
          ))}
        </div>

        {/* Footer Section */}
        <Footer />
        {/* Footer Section */}
      </div>
    );
}
