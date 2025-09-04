import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Calendar, Filter, User, Phone, Leaf } from "lucide-react";
import Spinner from "../Farmmanagement/Spinner";

const FeedbackManagement = () => {
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date

  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["fetchFeedback"],
    queryFn: async () => {
      const res = await fetch("/api/feedbacks");
      return res.ok ? res.json() : [];
    },
  });

  if (isLoading) return <Spinner />;

  // Sorting logic
  const sortedFeedbacks = feedbacks?.slice().sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating; // High to low rating
    if (sortBy === "date") return new Date(b.date) - new Date(a.date); // Newest first
    if (sortBy === "primary_use")
      return a.primary_use.localeCompare(b.primary_use); // Alphabetical order
    return 0;
  });

  return (
    <div className="p-4">
      {/* Header & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-0 sm:space-y-0">
        <h2 className="text-xl font-bold sm:pb-0 pb-2">User Feedback</h2>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter size={20} className="text-gray-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md p-2 text-gray-700 bg-white shadow-sm w-full sm:w-auto"
          >
            <option value="date">📅 Newest First</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="primary_use">🌾 Primary Use (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="grid gap-4">
        {sortedFeedbacks?.length === 0 ? (
          <p className="text-gray-500 text-center">No feedback available.</p>
        ) : (
          sortedFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 transition-all hover:shadow-lg"
            >
              {/* Primary Use & Rating */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <p className="text-gray-700 font-semibold flex items-center">
                  <Leaf className="text-green-500 mr-2" size={18} />
                  {feedback.primary_use}
                </p>
                <p className="text-sm text-gray-500 flex items-center mt-1 sm:mt-0">
                  <Star className="text-yellow-500 mr-1" size={18} />
                  {feedback.rating} / 5
                </p>
              </div>

              {/* Feedback Text */}
              <p className="mt-2 text-gray-700 text-sm sm:text-base">
                {feedback.feedback}
              </p>

              {/* User Info */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500 flex items-center">
                  <User className="mr-1 text-gray-600" size={16} />
                  {feedback.farmer_name}
                </p>
                <a
                  href={`tel:+91${feedback.phone_number}`}
                  className="text-sm text-blue-500 flex items-center mt-1 sm:mt-0 hover:underline"
                >
                  <Phone className="mr-1" size={16} /> {feedback.phone_number}
                </a>
              </div>

              {/* Date */}
              <p className="text-sm text-gray-400 flex items-center mt-2">
                <Calendar className="mr-1" size={16} />
                {new Date(feedback.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;
