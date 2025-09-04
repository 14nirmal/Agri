import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import AddFarmer from "./AddFarmer";
import ViewDetail from "./ViewDeatil";

const FarmersManagement = () => {
  // Sample farmers data
  const [farmers, setFarmers] = useState([{}]);
  const [addFarmerForm, setAddFarmerForm] = useState(false);
  const [viewDeatilId, setViewDetailId] = useState(null);
  const query = useQueryClient();

  const { data } = useQuery({
    queryKey: ["fetchFarmerData"],
    queryFn: async () => {
      const res = await fetch("/api/admin/getfarmerdata");
      const data = await res.json();
      setFarmers(data);
      return data;
    },
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Handler for viewing farmer details
  const handleViewDetails = (farmerId) => {
    setViewDetailId(farmerId);
  };

  // Handler for disabling/enabling a farm
  const handleToggleFarmStatus = async (farmerId, status) => {
    const res = await fetch(`/api/admin/farmer/${farmerId}/changeState`, {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        status: status == "active" ? "inactive" : "active",
      }),
    });
    const data = res.json();
    if (res.ok) {
      query.invalidateQueries(["fetchFarmerData"]);
    } else {
      toast.error(data.msg);
    }
  };

  // Sorting handler
  const handleSort = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filtered and sorted farmers
  const filteredFarmers = useMemo(() => {
    let result = farmers.filter((farmer) => {
      // Search logic (case-insensitive search across multiple fields)
      const searchMatch =
        farmer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer?.phone_number?.toString()?.includes(searchTerm);

      // Status filter logic
      const statusMatch =
        statusFilter === "all" || farmer.status === statusFilter;

      return searchMatch && statusMatch;
    });

    // Sorting logic
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [farmers, searchTerm, statusFilter, sortConfig]);

  return (
    <>
      <div className="container mx-auto  py-2">
        <div className="bg-white shadow-md rounded-lg">
          {/* Header with Search and Filters */}
          <div className="px-1 py-4 bg-gray-50 border-b sm:px-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            {/* <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Farmers Management
          </h2> */}

            <div className="flex space-x-1 ml-auto gap-2 w-full sm:w-auto flex-wrap  sm:flex-nowrap">
              {/* Search Input */}
              <div className="flex gap-2">
                <div className="relative  flex-grow">
                  <input
                    type="text"
                    placeholder="Search farmers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Status Filter Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <button
                  className="bg-white-500 bg-opacity-25  hover:bg-gray-400 hover:text-white border-2 rounded-md px-3 py-2 text-nowrap"
                  onClick={() => {
                    setAddFarmerForm(true);
                  }}
                >
                  Add Farmer
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="p-4 text-sm text-gray-600">
            Showing {filteredFarmers.length} of {farmers.length} farmers
          </div>

          {/* Farmers Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("first_name")}
                  >
                    <div className="flex items-center">
                      Name
                      {sortConfig.key === "first_name" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("phone_number")}
                  >
                    <div className="flex items-center">
                      Phone Number
                      {sortConfig.key === "phone_number" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center flex justify-center  text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center m-auto ">
                      Email
                      {sortConfig.key === "email" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("total_farm")}
                  >
                    <div className="flex items-center">
                      Total Farms
                      {sortConfig.key === "total_farm" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "status" && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFarmers.map((farmer, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {farmer.first_name} {farmer.last_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {farmer.phone_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center ">
                      {farmer.email ?? "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {farmer?.total_farm}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          farmer?.status == "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {farmer?.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(farmer._id)}
                          className="text-blue-600 hover:text-blue-900 hover:bg-blue-100 p-2 rounded-full transition duration-200"
                          title="View Details"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            handleToggleFarmStatus(farmer._id, farmer.status)
                          }
                          className={`
                          p-2 rounded-full transition duration-200 
                          ${
                            farmer.status === "active"
                              ? "text-red-600 hover:text-red-900 hover:bg-red-100"
                              : "text-green-600 hover:text-green-900 hover:bg-green-100"
                          }
                        `}
                          title={
                            farmer.status === "active"
                              ? "Disable Farmer"
                              : "Enable Farmer"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-4 bg-gray-50 border-t flex justify-between items-center sm:px-6">
            <p className="text-xs sm:text-sm text-gray-600">
              Total Farmers: {farmers.length}
            </p>
          </div>
        </div>
      </div>
      {addFarmerForm && (
        <AddFarmer setAddFarmerForm={setAddFarmerForm}></AddFarmer>
      )}

      {viewDeatilId && (
        <ViewDetail
          farmer_id={viewDeatilId}
          setViewDetailId={setViewDetailId}
        />
      )}
    </>
  );
};

export default FarmersManagement;
