import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AgriPlatform from "./components/AgriHome.jsx";
import Login from "./components/login/login.jsx";
import Signup from "./components/login/signup.jsx";
import Forgotpassword from "./components/login/Forgotpassword.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FarmManagement from "./components/Farmmanagement/FarmManagement.jsx";
import InventoryManagement from "./components/inventoryManagement/inventoryManagement.jsx";
import FinancialManagement from "./components/FinancialManagement/FinancialManagement.jsx";
import ProtectedRoutes from "./Routes/protectedRoutes/ProtectedRoutes.jsx";
import ContextProvider from "./contextStore/ContextStore.jsx";
import CommonRoute from "./Routes/CommonRoutes/CommonRoute.jsx";
import AddFarm from "./components/Farmmanagement/AddFarm.jsx";
import { Provider } from "react-redux";
import { store } from "./Store/store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Crops from "./components/Farmmanagement/Crops/Crops.jsx";
import AddCrop from "./components/Farmmanagement/Crops/AddCrop.jsx";
import MarketForm from "./components/marketPrice/marketPrice.jsx";
import WheatherComponents from "./components/Wheather/WheatherComponents.jsx";
import CropFinancials from "./components/FinancialManagement/CropFinancials.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import EditCrop from "./components/Farmmanagement/Crops/EditCrop.jsx";
import EditFarm from "./components/Farmmanagement/EditFarm.jsx";
import AdminLogin from "./components/Admin/Adminlogin.jsx";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import NotFound from "./PageNotFound.jsx";
import ResetPass from "./components/login/ResetPass.jsx";
import PriceAnalyse from "./components/marketPrice/PriceAnalysis.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <AgriPlatform />,
      },
      {
        path: "/marketPrice",
        element: <MarketForm />,
      },
      {
        path: "/market-trends",
        element: <PriceAnalyse></PriceAnalyse>,
      },
      {
        path: "/wheather",
        element: <WheatherComponents />,
      },
      {
        path: "/",
        element: <CommonRoute />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <Signup />,
          },
        ],
      },
      {
        path: "/forgotpassword",
        element: <Forgotpassword />,
      },

      {
        path: "/",
        element: <ProtectedRoutes />,

        children: [
          {
            path: "/farms",
            element: <FarmManagement />,
          },
          {
            path: "/farms/addfarm",
            element: <AddFarm />,
          },
          {
            path: "/farms/:farm_id/editfarm",
            element: <EditFarm />,
          },
          {
            path: "/farms/crops",
            element: <Crops />,
          },
          {
            path: "/farms/crops/addcrop",
            element: <AddCrop />,
          },
          {
            path: "/farms/:farm_id/crops/:cropid/editcrop",
            element: <EditCrop />,
          },
          {
            path: "/inventory",
            element: <InventoryManagement />,
          },
          {
            path: "/financials",
            element: <FinancialManagement />,
          },
          {
            path: "/financials/:f_id/crops",
            element: <CropFinancials />,
          },
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "/resetpass/:token",
    element: <ResetPass />,
  },
  {
    path: "*",
    element: <NotFound></NotFound>,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
]);

const queryclient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryclient}>
      <ContextProvider>
        <Provider store={store}>
          <RouterProvider router={router}>
            <App></App>
          </RouterProvider>
        </Provider>
      </ContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
