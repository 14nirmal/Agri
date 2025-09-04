import { useQuery } from "@tanstack/react-query";
import Activity from "./Activity";
import { useState } from "react";
import { isActive } from "../../../contextStore/contextstore";
import { useParams } from "react-router";

function Activities({ crop, isSubmitted }) {
  const [isReload, setReload] = useState(false);
  const {
    data: activityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activities", crop?._id],
    //we use the show activity so it not fetch data when the querykey is false
    queryFn: async () => {
      const res = await fetch(
        `/api/farmer/farm/crops/${crop?._id}/viewActivity`
      );
      const data = await res.json();
      return data.activities;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <>
      {/* Display The List Of Activities */}
      {!error && isLoading && (
        <div className="min-h-full flex justify-center items-center">
          <div className="bg-transparent border-4 border-t-blue-800 rounded-full h-9 w-9 animate-spin"></div>
        </div>
      )}
      {!isLoading && !error && activityData?.length == 0 && (
        <div className="flex justify-center items-center px-2 mt-20 ">
          <div className="  text-black max-w-[30rem] flex flex-col items-center p-5 gap-2 rounded-lg shadow-md shadow-gray-400 border-4 border-spacing-2 border-dotted text-center bg-white ">
            <div className="err-icon flex h-12">
              <img src="../src/assets/logo.png" alt="" className="h-full" />
            </div>
            <p className="text-gray-600">
              You haven't not added any type of ativities yet. Let's get started
              by adding your first activity in your crop!
            </p>
          </div>
        </div>
      )}
      {!isLoading &&
        !error &&
        activityData?.map((activity) => {
          return (
            <Activity
              key={activity._id}
              activity={activity}
              cropId={crop?._id}
              setReload={setReload}
            />
          );
        })}
    </>
  );
}
export default Activities;
