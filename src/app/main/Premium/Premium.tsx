import { useState } from "react";

const Premium = () => {
  const [activeTab, setActiveTab] = useState("premium");

  const features = [
    { icon: "❤️", title: "Send unlimited likes", description: "Increase your matches with unlimited likes." },
    { icon: "⚙️", title: "Dealbreakers", description: "Filter out the people who don’t fit exactly what you’re looking for." },
    { icon: "🔄", title: "Unlimited Rewinds", description: "Undo your passes as many times as you want." },
    { icon: "📨", title: "Unlock your intros", description: "Skip the wait & view all the intros you’ve received at once." },
    { icon: "🛡️", title: "Never see ads", description: "Like and match without the ads." },
  ];

  const prices = [
    { duration: "6 months", price: "KES 1,938.65 / month", discount: "Save 50%", popular: true },
    { duration: "3 months", price: "KES 2,584.72 / month", discount: "Save 33%" },
    { duration: "1 month", price: "KES 3,876.44 / month" },
  ];

  return (
    <div className="text-center py-4 px-2">
      <div className="bg-black text-white py-4 px-2 text-lg font-medium">
        Amazing OkCupid features you can’t live without.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 justify-center mt-6 font-normal">
        <button
          className={`px-6 py-2 border ${
            activeTab === "basic"
              ? "bg-[#2E0549] text-[#EE2481] border-gray-100"
              : "bg-gray-100 text-[#2E0549] border-[#2E0549]"
          }`}
          onClick={() => setActiveTab("basic")}
        >
          OKCUPID BASIC
        </button>
        <button
          className={`px-6 py-2 border ${
            activeTab === "premium"
              ? "bg-[#2E0549] text-[#EE2481] border-gray-100"
              : "bg-gray-100 text-[#2E0549] border-[#2E0549]"
          }`}
          onClick={() => setActiveTab("premium")}
        >
          OKCUPID PREMIUM
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Features Column */}
        <div className="space-y-4 text-left">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <span className="text-2xl mr-4">{feature.icon}</span>
              <div>
                <h4 className="text-lg font-bold">{feature.title}</h4>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prices Column */}
        <div>
          {prices.map((price, index) => (
            <div
              key={index}
              className={`border p-4 mb-4 ${
                price.popular ? "border-purple-500 bg-purple-50" : "border-gray-300"
              }`}
            >
              {price.popular && (
                <span className="bg-purple-500 text-white text-xs uppercase px-2 py-1 inline-block mb-2">
                  Most Popular
                </span>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold">{price.duration}</h4>
                  <p className="text-gray-700">{price.price}</p>
                </div>
                <p className="text-purple-500 font-semibold">{price.discount}</p>
              </div>
            </div>
          ))}
          <button className="w-full bg-blue-600 text-white py-3 font-bold rounded mt-4">
            Subscribe
          </button>
          <button className="w-full border border-gray-300 text-blue-600 py-3 font-bold rounded mt-2">
            Subscribe with PayPal
          </button>
          <p className="text-gray-500 text-sm mt-2">This is a secure page</p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
