import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">You received 6 likes!</h2>
        <div className="flex justify-center space-x-2 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-300"></div>
          <div className="h-12 w-12 rounded-full bg-gray-300"></div>
          <div className="h-12 w-12 rounded-full bg-gray-300"></div>
        </div>
        <p className="text-sm text-gray-900 mb-4">
          Don't keep your matches waiting! Become a Premium member to find out who they are and match today!
        </p>
        <button
            className="bg-[#8207D1] text-white font-medium py-2 px-4 rounded-md hover:bg-[#6a05a7] w-full mb-2 flex items-center justify-center space-x-2"
            onClick={() => alert("Go to Premium!")}
            >
            <span>See Who Likes You</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
            >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
        </button>
        <button
          className="text-gray-700 text-sm hover:underline"
          onClick={onClose}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default Modal;
