import React from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12h18M12 3v18"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Oops! It looks like the crop you're searching for has gone missing
            from our fields.
          </p>

          <div className="flex flex-col space-y-3">
            <button
              onClick={goBack}
              className="inline-flex items-center justify-center px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition duration-200"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
