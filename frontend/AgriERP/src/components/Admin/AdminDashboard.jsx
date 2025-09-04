import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Tractor,
  PieChart,
  Clipboard,
  DollarSign,
  Warehouse,
  LogOut,
  IndianRupee,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import FarmersManagement from "./FarmersManagement";
import Spinner from "../Farmmanagement/Spinner";
import FeedbackManagement from "./FeedbackManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["fetchDashboardData"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        return data;
      }
    },
  });
  if (isLoading) {
    return <Spinner></Spinner>;
  }
  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Unauthorized Access</h2>
          <p className="mb-4">You do not have permission to view this page.</p>
          <button
            onClick={() => navigate("/admin/login")}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    // Implement logout logic here
    console.log("Logging out");
    const res = await fetch("/api/admin/log-out");
    const data = await res.json();
    if (res.ok) {
      await toast.success(data.msg);
      navigate("/admin/login");
    }
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={<Users className="text-blue-500" />}
              title="Total Farmers"
              value={dashboardStats?.total_farmers}
            />
            <StatCard
              icon={<Tractor className="text-green-500" />}
              title="Total Farms"
              value={dashboardStats?.total_farms}
            />
            <StatCard
              icon={<Clipboard className="text-purple-500" />}
              title="Total Crops"
              value={dashboardStats?.total_crops}
            />
            <StatCard
              icon={<IndianRupee className="text-emerald-500" />}
              title="Total Revenue"
              value={dashboardStats?.total_revenue?.toLocaleString()}
            />
            <StatCard
              icon={<IndianRupee className="text-red-500" />}
              title="Total Expense"
              value={dashboardStats?.total_expense?.toLocaleString()}
            />
          </div>
        );
      case "farmers":
        return <FarmersManagement />;

      case "Feedback":
        return <FeedbackManagement />;

      default:
        return null;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } 
          md:relative md:translate-x-0 
          w-64 bg-white shadow-md 
          transition-transform duration-300 ease-in-out 
          z-50 md:z-0
        `}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-600"
          onClick={toggleSidebar}
        >
          <X size={24} />
        </button>

        <div className="p-5 border-b flex justify-between items-center">
          <img src="/logo.png" className="w-40" alt="" srcSet="" />
        </div>
        <nav className="p-4">
          <SidebarItem
            icon={<LayoutDashboard />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => {
              setActiveTab("dashboard");
              closeSidebar();
            }}
          />
          <SidebarItem
            icon={<Users />}
            label="Farmers"
            active={activeTab === "farmers"}
            onClick={() => {
              setActiveTab("farmers");
              closeSidebar();
            }}
          />
          <SidebarItem
            icon={<MessageCircle />} // Best choice for feedback
            label="Feedback"
            active={activeTab === "Feedback"}
            onClick={() => {
              setActiveTab("Feedback");
              closeSidebar();
            }}
          />

          {/* Logout Button */}
          <div className="mt-4 border-t pt-4">
            <SidebarItem
              icon={<LogOut />}
              label="Logout"
              onClick={handleLogout}
            />
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">AgriERP</h1>
          <button onClick={toggleSidebar} className="text-gray-600">
            <Menu size={24} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
          <div className="bg-white shadow-d rounded-lg p-2 sm:p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-semibold capitalize">
                {activeTab != "Feedback" && activeTab}
              </h2>
              {/* Logout button for desktop */}
            </div>
            {renderDashboardContent()}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
    <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

// Sidebar Item Component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <div
    className={`
      flex items-center p-3 mb-2 cursor-pointer rounded-lg 
      ${
        active
          ? "bg-green-50 text-green-600"
          : "hover:bg-gray-100 text-gray-700"
      }
    `}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium">{label}</span>
  </div>
);

// Placeholder Management Components

export default AdminDashboard;
