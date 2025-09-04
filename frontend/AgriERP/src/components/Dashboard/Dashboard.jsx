import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import Feedback from "./Feedback";
import Spinner from "../Farmmanagement/Spinner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function FarmersDashboard() {
  const {
    data: dataOfDashboard,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetchDashboardData"],
    queryFn: async () => {
      const res = await fetch("/api/farmer/dashboard");
      const data = await res.json();
      return data;
    },
  });

  const [showFeedbackForm, setShowFeedback] = useState(false);
  if (isLoading) {
    return <Spinner></Spinner>;
  }
  return (
    <>
      <div className="bg-green-50 hero-section pt-36 w-full px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px    pb-9">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Farm Owner Header */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Farmer's Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Comprehensive Agricultural Management
              </p>
            </div>
            <div className="text-center sm:text-right">
              <h2 className="text-base sm:text-lg font-semibold">
                {dataOfDashboard.farmerData.first_name} &nbsp;
                {dataOfDashboard.farmerData.last_name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                {dataOfDashboard.farmerData.phone_number}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {dataOfDashboard.farmerData.email}
              </p>
            </div>
          </div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: "Total Farms", value: dataOfDashboard.total_farm },
              {
                label: "Total Active Crops",
                value: dataOfDashboard.total_active_crops,
              },
              {
                label: "Total Income",
                value: `₹${dataOfDashboard.total_income?.toLocaleString()}`,
              },
              {
                label: "Total Expense",
                value: `₹${dataOfDashboard.total_expense?.toLocaleString()}`,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-2 sm:p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Farm Summary */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Farm Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {dataOfDashboard.farmData.map((farm, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-base sm:text-xl font-semibold mb-2">
                    {farm.farm_name}
                  </h3>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-700">
                    <p>
                      <strong>Area:</strong> {farm.farm_size}
                      {farm.measurement_unit}
                    </p>
                    <p>
                      <strong>Soil type :</strong> {farm.soil_type}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {farm.isActive ? "Active" : "Disabled"}
                    </p>
                    <p>
                      <strong>Total crop:</strong> {farm.total_crops}
                    </p>
                    {/* <p className="font-bold text-green-600">
                    Profitability: ${farm.profitability.toLocaleString()}
                  </p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inventory Overview */}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Inventory Overview
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs sm:text-sm text-gray-700">
                    Total Inventory Items
                  </span>
                  <span className="text-sm sm:text-base font-bold">
                    {dataOfDashboard.inventory.total_items}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs sm:text-sm text-gray-700">
                    Total Inventory Value
                  </span>
                  <span className="text-sm sm:text-base font-bold text-green-600">
                    ₹{" "}
                    {dataOfDashboard.inventory.inventory_value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Inventory Categories */}
            <div className="bg-white shadow-md rounded-lg p-1 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Inventory Categories
              </h2>

              {dataOfDashboard.inventory.inventories &&
              dataOfDashboard.inventory.inventories.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={250}
                  className="sm:h-[300px]"
                >
                  <PieChart width={400} height={400}>
                    <Pie
                      data={dataOfDashboard.inventory.inventories}
                      dataKey="total_value"
                      nameKey="item_category"
                      cx="50%"
                      cy="50%"
                      innerRadius="40%"
                      outerRadius="70%"
                      paddingAngle={2}
                      label={({ name, percent }) =>
                        ` ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {dataOfDashboard.inventory.inventories.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => {
                        const foundItem =
                          dataOfDashboard.inventory.inventories.find(
                            (c) => c.item_category === name
                          );
                        return [
                          `₹${value.toLocaleString()}`,
                          `${name} (${foundItem?.numberofItems || 0} items)`,
                        ];
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconSize={10}
                      wrapperStyle={{ fontSize: "0.7rem" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center pb-6">
                  No inventory data available
                </p>
              )}
            </div>
          </div>

          {/* Financial Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Income Streams */}
            <div className="bg-white shadow-md rounded-lg p-1 sm:p-6">
              <div className="w-full h-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                  <BarChart
                    data={dataOfDashboard.farmWiseFinancialData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="farm_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total_income"
                      fill="#4CAF50"
                      name="Total Income"
                    />
                    <Bar
                      dataKey="total_expense"
                      fill="#FF5722"
                      name="Total Expense"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
              onClick={() => setShowFeedback(true)}
            >
              Give Feedback
            </button>
          </div>
        </div>
      </div>
      {showFeedbackForm && (
        <Feedback setShowFeedback={setShowFeedback}></Feedback>
      )}
    </>
  );
}
