import { PiPlant } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { AiOutlineSchedule } from "react-icons/ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import { ActivitySchema } from "../../login/validate";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import Activities from "./Activities";
import LoadingButton from "../LoadingButton";
import { ChevronDown, Leaf, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";
import { isActive } from "../../../contextStore/contextstore";
import useCloseDropDown from "../../../Hooks/useCloseDropDown";

function Crop({ crop, showActivity, setShowActivity, farm_id }) {
  console.log("farm_id" + farm_id);
  const client = useQueryClient();
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [isPastDate, setPastDate] = useState(false);
  const [toggleMenu, setToggelMenu] = useState(false);
  const isactive = isActive(farm_id);
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues: {
      activity_type: "",
      activity_date: "",
      activity_description: "",
      activity_status: "",
    },
    validationSchema: ActivitySchema,
    onSubmit: (data) => {
      Mutation.mutate(data);
      document.body.style.overflow = "scroll";
    },
  });
  const Mutation = useMutation({
    mutationKey: ["AddActivity"],
    mutationFn: async (data) => {
      const d = await fetch(`/api/farmer/farm/crops/${crop?._id}/addActivity`, {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify(data),
      });
      const res = await d.json();
      if (d.ok) {
        toast.success(res.msg);
        client.invalidateQueries(["activities"]);
        resetForm();

        setShowActivityForm(false);
      } else {
        toast.error(res.msg);
      }
    },
  });
  useMemo(() => {
    const selectedDate = new Date(values.activity_date);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = selectedDate - today;
    setPastDate(diff <= 0 ? true : false);
  }, [values.activity_date]);
  const navigate = useNavigate();

  const completeTheCrop = async (crop, iscomplete) => {
    if (isactive) {
      const d = await fetch(`/api/farmer/farm/crops/${crop?._id}/complete`, {
        method: "PUT",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify({ complete: iscomplete }),
      });
      const res = await d.json();
      if (d.ok) {
        //toast.success(res.msg);
        client.invalidateQueries(["fetchCropFinancials"]);
        client.invalidateQueries(["fetchCropCardFinancials"]);
        client.invalidateQueries(["cropdata"]);
      } else {
        toast.error(res.msg);
      }
    }
  };

  const DeleteCrop = async (crop) => {
    if (window.confirm("Are You Sure To Delete Crop!")) {
      const d = await fetch(
        `/api/farmer/farm/${farm_id}/crops/${crop?._id}/delete`,
        {
          method: "DELETE",
        }
      );
      const res = await d.json();
      if (d.ok) {
        toast.success(res.msg);
        resetForm();
        client.invalidateQueries(["cropdata"]);
        client.invalidateQueries(["fetchCropFinancials"]);
      } else {
        toast.error(res.msg);
      }
    }
  };
  const dropdownRef = useRef(null);
  useCloseDropDown({ dropdownRef, setOpenMenu: setToggelMenu });
  // useEffect(() => {
  //   completeTheCrop(crop, !isactive);
  // }, [isactive]);
  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-md min-w-full max-w-2xl border border-l-4  hover:shadow-lg transition-shadow duration-300 ${
          crop?.complete == "true"
            ? "border-l-yellow-300"
            : "border-l-green-500 "
        } border-gray-200`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-green-50 p-2 rounded-full">
                <Leaf className="text-green-500 h-8 w-8" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                  {crop.crop_name}
                </h2>
                <p className="text-gray-600 text-base mt-1">
                  {" "}
                  {crop.crop_variety}
                </p>
                {crop?.complete == "false" && (
                  <p className="text-gray-600 text-base">
                    {" "}
                    showing day :{" "}
                    {Math.ceil(
                      (new Date() - new Date(crop.planting_date)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setToggelMenu((prev) => !prev)}
                className="py-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="More options"
              >
                <MoreVertical size={24} />
              </button>
              {toggleMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md border border-gray-200 z-80"
                  ref={dropdownRef}
                >
                  <ul className="py-1">
                    {isactive && (
                      <li
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
                        onClick={() => {
                          navigate(
                            `/farms/${farm_id}/crops/${crop._id}/editcrop`
                          );
                          setToggelMenu(false);
                        }}
                      >
                        <span>Edit</span>
                      </li>
                    )}
                    {crop?.complete == "true" ? (
                      <li
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
                        onClick={() => {
                          completeTheCrop(crop, false);
                          setToggelMenu(false);
                        }}
                      >
                        <span>Reopen Crop</span>
                      </li>
                    ) : (
                      <li
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
                        onClick={() => {
                          completeTheCrop(crop, true);
                          setToggelMenu(false);
                        }}
                      >
                        <span>Complete Crop</span>
                      </li>
                    )}
                    {isactive && (
                      <li
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
                        onClick={() => {
                          DeleteCrop(crop);
                          setToggelMenu(false);
                        }}
                      >
                        <span>Delete</span>
                      </li>
                    )}
                    <li
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2 text-red-500"
                      onClick={() => setToggelMenu(false)}
                    >
                      <span>Close</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Collapsible Section */}
          <div
            className="flex justify-between items-center cursor-pointer py-2 px-1 hover:bg-gray-50 rounded-md transition-colors duration-200"
            onClick={() => {
              setShowActivity((prev) => (prev == crop._id ? null : crop._id));
            }}
          >
            <div>
              <h3 className="text-xl font-medium text-gray-800">
                {" "}
                {crop.crop_area} {crop.crop_measurement_unit}
              </h3>
              <p className="text-gray-600 text-base">
                Planted: {crop.planting_date}
              </p>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
              {showActivity ? (
                <ChevronDown size={24} />
              ) : (
                <ChevronDown size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Activity Form For The Crop */}
      {showActivityForm && (
        <div className="fixed bg-black bg-opacity-20 inset-0 z-50 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-md shadow-md min-w-72 sm:min-w-96 flex flex-col"
          >
            <div className="flex justify-between mb-1">
              <h1 className="font-semibold text-xl ">Add Activity</h1>
              <IoMdClose
                className="text-xl font-bold hover:cursor-pointer"
                onClick={() => {
                  setShowActivityForm(false);
                  document.body.style.overflow = "scroll";
                }}
              />
            </div>
            <div className="activity-field flex flex-col mt-3 ">
              <label
                htmlFor="activity_type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Activity Type
              </label>
              <select
                name="activity_type"
                id="activity_type"
                className="p-2 rounded-md border-2"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.activity_type}
              >
                <option value="">Select an Activity type</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Harvesting">Harvesting</option>
                <option value="Fertilizing">Fertilizing</option>
                <option value="Pestisizing">Pestisizing</option>
              </select>
              {touched.activity_type && errors.activity_type && (
                <p className="text-red-700 text-sm ">{errors.activity_type}</p>
              )}
            </div>
            <div className=" flex flex-col mt-3">
              <label
                htmlFor="activity_description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="activity_description"
                className="p-2 rounded-md border-2"
                placeholder="Details About activity"
                name="activity_description"
                value={values.activity_description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.activity_description && errors.activity_description && (
                <p className="text-red-700 text-sm ">
                  {errors.activity_description}
                </p>
              )}
            </div>
            <div className="activity-date-field flex flex-col mt-3">
              <label
                htmlFor="activity_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="actvity_date"
                className="p-2 rounded-md border-2"
                name="activity_date"
                value={values.activity_date}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.activity_date && errors.activity_date && (
                <p className="text-red-700 text-sm ">{errors.activity_date}</p>
              )}
            </div>
            <div className="activity_status flex flex-col mt-3 ">
              <label
                htmlFor="activity_status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Activity Status
              </label>
              <select
                name="activity_status"
                id=""
                className="p-2 rounded-md border-2"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.activity_status}
              >
                <option value="">Select a Status</option>

                {isPastDate ? (
                  <option value="Completed">Completed</option>
                ) : (
                  <>
                    <option value="Schedule">Schedule</option>
                  </>
                )}
              </select>
              {touched.activity_status && errors.activity_status && (
                <p className="text-red-700 text-sm ">
                  {errors.activity_status}
                </p>
              )}
            </div>

            {Mutation.isLoading ? (
              <LoadingButton />
            ) : (
              <button
                type="submit"
                className="bg-green-700 mt-4 text-white w-full px-4 py-2 rounded-md font-semibold flex justify-center"
              >
                Add Activity
              </button>
            )}
          </form>
        </div>
      )}
      {/* Activity Drop Down For a Particular Crop */}
      {showActivity == crop._id && (
        <div className="w-full min-h-96 h-96 max-h-96 overflow-y-auto shadow-md -mt-1 bg-gray-100  rounded-md border-2 p-4">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center">
              <AiOutlineSchedule className="text-xl font-semibold" />
              <h1 className="font-semibold text-lg">Activities</h1>
            </div>
            <div className="flex items-center">
              <button
                className={`bg-green-700 text-white border-2 px-4 p-1 border-gray-500 font-semibold rounded-md flex gap-2 items-center shadow-sm ${
                  !isactive && "bg-opacity-30"
                }`}
                onClick={() => {
                  setShowActivityForm(true);
                  document.body.style.overflow = "hidden";
                }}
                disabled={!isactive}
              >
                <FiPlusCircle className="text-lg" />
                <p>Activity</p>
              </button>
            </div>
          </div>
          <Activities
            crop={crop}
            showActivity={showActivity}
            isSubmitted={Mutation.isSuccess}
          />
        </div>
      )}
    </>
  );
}
export default Crop;

//backup

{
  /* <div
        className="crop-main w-full p-2 sm:p-4 flex  gap-4 border-2 border-gray-300 rounded-md shadow-lg mt-2 hover:cursor-pointer border-l-4 border-l-green-600 flex-wrap items-center"
        onClick={() => {
          setShowActivity((prev) => (prev == crop._id ? null : crop._id));
        }}
      >
        <div className="flex justify-center items-center min-w-14">
          <PiPlant className="text-4xl text-green-600 font-bold" />
        </div>
        <div className="flex flex-col flex-1 text-nowrap">
          <h1 className="font-semibold text-2xl">{crop.crop_name}</h1>
          <h2 className="text-sm font-semibold text-gray-600">
            {crop.crop_variety}
          </h2>
          <h2 className="text-sm font-semibold text-gray-600">
            showing day :{" "}
            {Math.ceil(
              (new Date() - new Date(crop.planting_date)) /
                (1000 * 60 * 60 * 24)
            )}
          </h2>
        </div>
        <div className="flex  gap-3 sm:gap-10 ">
          <div>
            <h1 className="font-semibold text-xl">
              {crop.crop_area} {crop.crop_measurement_unit}
            </h1>

            <h2 className="text-sm text-gray-600">
              Planted: {crop.planting_date}
            </h2>
          </div>

          <div className="flex justify-center items-center  gap-5">
            {showActivity ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
      </div> */
}
