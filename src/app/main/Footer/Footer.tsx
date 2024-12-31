import React from "react";
import joto from '../../../../public/joto.png';
import socialpendo from '../../../../public/socialpendo.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Company Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Press</a></li>
              <li><a href="#" className="hover:underline">Ad Choices</a></li>
            </ul>
          </div>

          {/* Conditions Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Conditions</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Privacy</a></li>
              <li><a href="#" className="hover:underline">Cookies – Manage preferences</a></li>
              <li><a href="#" className="hover:underline">Terms</a></li>
              <li><a href="#" className="hover:underline">Community Guidelines</a></li>
              <li><a href="#" className="hover:underline">Consumer Health Data Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Colorado Safety Policy Information</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Support</a></li>
              <li><a href="#" className="hover:underline">Security</a></li>
              <li><a href="#" className="hover:underline">Safety Tips</a></li>
              <li><a href="#" className="hover:underline">Impressum</a></li>
            </ul>
          </div>

          {/* Follow Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Tech Blog</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 text-center border-t border-gray-700 pt-4 flex flex-col items-center">
            <img src={socialpendo.src} alt="Joto Logo" className="h-24 w-auto mb-2" />
            <p className="text-sm text-gray-500">&copy; SocialPendo {currentYear}</p>
            <p className="text-sm text-gray-500">
                from <span className="font-semibold text-gray-400">SocialPendoGroup</span>
            </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
