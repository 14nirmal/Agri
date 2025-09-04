import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Feedback = ({ setShowFeedback }) => {
  const [submitted, setSubmitted] = useState(false);

  // Rating labels
  const ratingLabels = {
    1: "😞 Poor",
    2: "😐 Fair",
    3: "🙂 Good",
    4: "😊 Very Good",
    5: "🤩 Excellent",
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      rating: 0,
      primary_use: "",
      feedback: "",
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, "Rating is required")
        .required("Rating is required"),
      primary_use: Yup.string().required("Please select a primary use"),
      feedback: Yup.string().required("Feedback is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch("/api/feedback/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();
        if (res.status === 200) {
          toast.success("🎉 Feedback submitted successfully!");
          setSubmitted(true);
          setTimeout(() => {
            resetForm();
            setSubmitted(false);
            setShowFeedback(false);
          }, 2000);
        } else {
          toast.error(data.msg || "Something went wrong");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Server error! Try again later.");
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50 transition-opacity animate-fadeIn p-1">
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-6 w-[400px] relative transition-all">
        {/* Close Button */}
        <button
          onClick={() => setShowFeedback(false)}
          className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-red-500 text-lg transition-transform transform hover:scale-110"
        >
          ✖
        </button>

        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="ml-3 text-xl font-bold text-green-700 dark:text-green-400">
            Quick Feedback
          </h1>
        </div>

        {/* Success Message */}
        {submitted ? (
          <div className="bg-green-100 dark:bg-green-800 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg text-center shadow-sm transition-all animate-slideIn">
            🎉 Thank you for your feedback!
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Star Rating (Required) */}
            <div className="text-center">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                How would you rate your experience?
              </label>
              <div className="flex flex-row-reverse justify-center space-x-1 mt-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => formik.setFieldValue("rating", star)}
                    className={`text-3xl transition-all ${
                      formik.values.rating >= star
                        ? "text-yellow-400 scale-105"
                        : "text-gray-400 hover:text-yellow-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {formik.values.rating > 0 && (
                <div className="mt-2 text-green-700 dark:text-green-400 font-semibold text-sm">
                  {ratingLabels[formik.values.rating]}
                </div>
              )}
              {formik.touched.rating && formik.errors.rating && (
                <p className="text-red-600 text-sm">{formik.errors.rating}</p>
              )}
            </div>

            {/* Primary Use (Required) */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                What do you primarily use AgriERP for?
              </label>
              <select
                name="primary_use"
                value={formik.values.primary_use}
                onChange={formik.handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <option value="">--Please select--</option>
                <option value="crop_management">🌾 Crop Management</option>
                <option value="inventory">📦 Inventory Management</option>
                <option value="financial">💰 Financial Management</option>
                <option value="reporting">📊 Market Price</option>
                <option value="other">🔎 Other</option>
              </select>
              {formik.touched.primary_use && formik.errors.primary_use && (
                <p className="text-red-600 text-sm">
                  {formik.errors.primary_use}
                </p>
              )}
            </div>

            {/* Feedback (Required) */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                What could we improve?
              </label>
              <textarea
                name="feedback"
                value={formik.values.feedback}
                onChange={formik.handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg"
                rows="3"
                placeholder="Share your thoughts..."
              ></textarea>
              {formik.touched.feedback && formik.errors.feedback && (
                <p className="text-red-600 text-sm">{formik.errors.feedback}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-white bg-green-700 hover:bg-green-800 shadow-md transition-all"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
