import { MdNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router";
import { IoIosMore } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import useCloseDropDown from "../../Hooks/useCloseDropDown";

import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { isActive } from "../../contextStore/contextstore";

function Farm({ farm }) {
  const query = useQueryClient();

  const { farm_name, farm_size, measurement_unit, soil_type, _id } = farm;
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useCloseDropDown({ dropdownRef, setOpenMenu });
  const disableFarm = async (isactive) => {
    const res = await fetch(`/api/farmer/farm/${_id}/disable`, {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ isactive: !isactive }),
    });
    const data = await res.json();
    if (res.ok) {
      //toast.success(data.msg);
      query.invalidateQueries(["FetchFarmData"]);
    } else {
      toast.error(data.msg);
    }
  };
  return (
    <>
      <div
        className={`bg-green-50 border-l-4 border-2 shadow-lg rounded-md w-full flex flex-col sm:flex-row justify-between sm:items-center pb-3 relative ${
          !farm.isActive
            ? "bg-gray-100 border-l-yellow-400  "
            : "bg-green-100 border-l-green-500"
        }`}
      >
        <div className="flex flex-col items-start justify-center gap-2 ml-5 sm:ml-8">
          <h1 className="text-2xl mt-2 font-bold text-green-700 text-center">
            {farm_name}
          </h1>
          <p className="text-md text-center text-md  text-green-700">
            <span className="font-semibold"> Area : </span> {farm_size}{" "}
            {measurement_unit}
          </p>
          <p className="text-md text-center text-md  text-green-700">
            <span className="font-semibold"> Land Type :</span> {soil_type}
          </p>
        </div>
        <div className="ml-5 pr-10 sm:mr-8">
          <button
            type="submit"
            className="bg-green-700 mt-2  text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md font-semibold flex justify-center items-center sm:gap-3 "
            id={_id}
            onClick={() => {
              navigate(`/farms/crops?id=${_id}`);
            }}
          >
            View Crops <MdNavigateNext className="text-xl" />
          </button>
        </div>
        <div className="absolute h-full flex items-center sm:h-auto sm:mt-auto right-4">
          <IoIosMore
            className="hover:cursor-pointer hover:bg-green-100 text-lg font-bold rounded-full h-7 w-7 p-1"
            onClick={() => {
              setOpenMenu((prev) => !prev);
            }}
          ></IoIosMore>
        </div>
        {openMenu && (
          <div
            className="absolute right-0 top-24 w-48 bg-white shadow-xl rounded-md border border-gray-200 z-50"
            ref={dropdownRef}
          >
            <ul className="py-1">
              <li
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
                onClick={() => {
                  navigate(`/farms/${_id}/editfarm`);
                  setOpenMenu(false);
                }}
              >
                <span>Edit</span>
              </li>

              <li
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
                onClick={() => {
                  disableFarm(farm.isActive);
                  setOpenMenu(false);
                }}
              >
                {farm.isActive ? (
                  <span>Disable Farm</span>
                ) : (
                  <span>Enable Farm</span>
                )}
              </li>
              <li
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2 text-red-500"
                onClick={() => setOpenMenu(false)}
              >
                <span>Close</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
export default Farm;
