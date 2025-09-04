import { LuLeaf } from "react-icons/lu";
import { IoIosCloudOutline } from "react-icons/io";
import { MdOutlineInventory } from "react-icons/md";
import { MdTrendingUp } from "react-icons/md";
import { useTranslation } from "react-i18next";

function Features() {
  const { t } = useTranslation();

  return (
    <>
      <div className="lg:min-h-[28rem] pt-16 pb-28 lg:pt-16 px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px">
        <h1 className="font-bold text-2xl lg:text-3xl xl:text-4xl text-center">
          {t("key_features")} {/* Key Features */}
        </h1>
        <div className="feature-cards flex mt-14 gap-6 flex-wrap">
          <div className="card shadow-lg shadow-gray-300 p-5 rounded-md text-center flex flex-col items-center min-w-[228px] flex-1 bg-gray-50 hover:scale-105 hover:shadow-gray-400">
            <div className="bg-green-200 p-3 rounded-md mt-2">
              <LuLeaf className="text-2xl text-green-700 " />
            </div>
            <h1 className="text-xl font-bold mt-2">
              {t("crop_planning")} {/* Crop Planning */}
            </h1>
            <p className="mt-1">
              {t("crop_planning_desc")}{" "}
              {/* Plan and track your crop cycles with intelligent scheduling and reminders */}
            </p>
          </div>
          <div className="card shadow-lg shadow-gray-300 p-5 rounded-md text-center flex flex-col items-center min-w-[228px] flex-1 bg-gray-50 hover:scale-105 hover:shadow-gray-400">
            <div className="bg-green-200 p-3 rounded-md mt-2">
              <IoIosCloudOutline className="text-2xl text-green-700 " />
            </div>
            <h1 className="text-xl font-bold mt-2">
              {t("weather_monitoring")} {/* Weather Monitoring */}
            </h1>
            <p className="mt-1">
              {t("weather_monitoring_desc")}{" "}
              {/* Get accurate weather forecasts and alerts for better planning. */}
            </p>
          </div>
          <div className="card shadow-lg shadow-gray-300 p-5 rounded-md text-center flex flex-col items-center min-w-[228px] flex-1 bg-gray-50 hover:scale-105 hover:shadow-gray-400">
            <div className="bg-green-200 p-3 rounded-md mt-2">
              <MdOutlineInventory className="text-2xl text-green-700 " />
            </div>
            <h1 className="text-xl font-bold mt-2">
              {t("inventory_management")} {/* Inventory Management */}
            </h1>
            <p className="mt-1">
              {t("inventory_management_desc")}{" "}
              {/* Keep track of seeds, fertilizers, and equipment with real-time inventory updates */}
            </p>
          </div>
          <div className="card shadow-lg shadow-gray-300 p-5 rounded-md text-center flex flex-col items-center min-w-[228px] flex-1 bg-gray-50 hover:scale-105 hover:shadow-gray-400">
            <div className="bg-green-200 p-3 rounded-md mt-2">
              <MdTrendingUp className="text-2xl text-green-700 " />
            </div>
            <h1 className="text-xl font-bold mt-2">
              {t("financial_tracking")} {/* Financial Tracking */}
            </h1>
            <p className="mt-1">
              {t("financial_tracking_desc")}{" "}
              {/* Monitor expenses, revenue, and profitability with detailed financial reports */}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Features;
