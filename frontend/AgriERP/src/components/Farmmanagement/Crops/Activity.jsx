import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { toast, ToastContainer } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

import { MdDelete } from "react-icons/md";
import LoadingButton from "../LoadingButton";
import { useFormik } from "formik";
import { ActivitySchema } from "../../login/validate";
import useCloseDropDown from "../../../Hooks/useCloseDropDown";

function Activity({ activity, cropId, setReload }) {
  const [showMenu, setShowMenu] = useState(false);
  const [ActivityID, setActivityId] = useState(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const queryClient = useQueryClient();
  const [isPastDate, setPastDate] = useState(false);
  const dropdownRef = useRef(null);
  const deleteActivity = async () => {
    const res = await fetch(
      `/api/crops/${cropId}/activity/${ActivityID}/deleteActivity`,
      { method: "DELETE" }
    );
    const data = await res.json();
    res.ok ? toast.success(data.msg) : toast.error(data.msg);
    return data;
  };
  const mutate = useMutation({
    mutationKey: ["deleteActivity"],
    mutationFn: deleteActivity,
    onSuccess: (data) => {
      setActivityId(null);
      queryClient.invalidateQueries(["activities"]);
      // setReload((prev) => (prev ? false : true));
    },
  });

  const completeActivity = async () => {
    const res = await fetch(
      `/api/crops/${cropId}/activity/${ActivityID}/updateStatus`,
      { method: "PUT" }
    );
    const data = await res.json();
    return data;
  };
  const mutateComplete = useMutation({
    mutationKey: ["completeActivity"],
    mutationFn: completeActivity,
    onSuccess: (data) => {
      setActivityId(null);
      //refetch the queries to update the state
      queryClient.invalidateQueries(["activities"]);
      //setReload((prev) => !prev);
    },
  });

  //form handling for editing activity
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
      activity_type: activity.activity_type,
      activity_date: activity.activity_date,
      activity_description: activity.activity_description,
      activity_status: activity.activity_status,
    },
    validationSchema: ActivitySchema,
    onSubmit: (data) => {
      Mutation.mutate(data);
      document.body.style.overflow = "scroll";
    },
  });
  const Mutation = useMutation({
    mutationKey: ["EditActivity"],
    mutationFn: async (data) => {
      const d = await fetch(
        `/api/crops/${cropId}/activity/${activity._id}/editactivity`,
        {
          method: "PUT",
          headers: { "Content-type": "Application/json" },
          body: JSON.stringify(data),
        }
      );
      const res = await d.json();
      if (d.ok) {
        toast.success(res.msg);
        queryClient.invalidateQueries(["activities", cropId]);
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

  console.log(activity);
  useCloseDropDown({ dropdownRef, setOpenMenu: setShowMenu });
  return (
    <>
      {/* Display the Individual activity with dropdown Menues */}
      <div className="bg-white max-h-auto gap-2  max-w-auto p-4 shadow-lg rounded-md mt-4 flex justify-between ">
        <div className="flex flex-col overflow-hidden fex-1 text-wrap">
          <h1 className="font-semibold text-lg">{activity.activity_type}</h1>
          <h2 className="text-sm font-semibold text-gray-600 break-words overflow-hidden">
            {activity.activity_description}
          </h2>
        </div>
        <div className="flex gap-8">
          <div className="flex items-center flex-col justify-center">
            <h1
              className={`font-semibold text-sm ${
                activity?.activity_status === "Completed"
                  ? "bg-green-200"
                  : "bg-yellow-200"
              } rounded-lg p-1 px-2 text-green-800`}
            >
              {activity.activity_status}
            </h1>
            <h2 className="text-sm font-semibold  text-gray-600 mt-1">
              {activity.activity_date}
            </h2>
          </div>
          <div className="flex justify-center items-center  gap-5">
            <div className="relative inline-block text-left">
              <SlOptions
                onClick={() => {
                  setShowMenu((prev) => (!prev ? true : false));
                }}
                className="hover:cursor-pointer"
              />
              {showMenu && (
                <div
                  className="absolute -right-4 z-10 mt-8 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                  ref={dropdownRef}
                >
                  <div className="py-1" role="none">
                    {activity.activity_status != "Completed" && (
                      <a
                        className=" px-4 py-2 text-sm text-gray-700 flex gap-2 items-center hover:cursor-pointer"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                        onClick={() => {
                          setActivityId(activity._id);
                          mutateComplete.mutate();
                          setShowMenu(false);
                        }}
                      >
                        <TiTick className="text-lg" />
                        Mark as Completed
                      </a>
                    )}
                    <a
                      className=" px-4 py-2 text-sm text-gray-700 flex gap-2 items-center hover:cursor-pointer"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-2"
                      onClick={() => {
                        setShowActivityForm(true);
                      }}
                    >
                      <FaRegEdit className="text-lg" />
                      Edit
                    </a>
                    <a
                      className=" px-4 py-2 text-sm text-gray-700 hover:cursor-pointer flex gap-2 items-center"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-2"
                      onClick={() => {
                        setActivityId(activity._id);
                        mutate.mutate();
                        setShowMenu(false);
                      }}
                    >
                      <MdDelete className="text-lg"></MdDelete>
                      Delete
                    </a>
                    <a
                      href="#"
                      className=" px-4 py-2 text-sm text-gray-700 flex gap-2 items-center"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-2"
                      onClick={() => {
                        setShowMenu(false);
                      }}
                    >
                      <IoMdClose className="text-lg"></IoMdClose>
                      Close
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* for edit an activity Form*/}
      {showActivityForm && (
        <div className="fixed bg-black bg-opacity-20 inset-0 z-50 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-md shadow-md min-w-72 sm:min-w-96 flex flex-col"
          >
            <div className="flex justify-between mb-1">
              <h1 className="font-semibold text-xl ">Edit Activity</h1>
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
                <option value=" ">Select a Status</option>

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
                Edit Activity
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}
export default Activity;
