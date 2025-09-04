import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import Spinner from "../Spinner";
import AddFirstCrop from "./AddFirstCrop";
import { PiFarmThin } from "react-icons/pi";
import { useState } from "react";
import Crop from "./crop";
import { FiPlus } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import YearSelector from "../../YearSelector";

function Crops() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const farmId = queryParams.get("id");
  const navigate = useNavigate();
  console.log(farmId);
  const [year, setYears] = useState([]);
  const onSelectYear = (years) => {
    console.log(years);
    setYears([...years]);
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["cropdata", farmId, JSON.stringify(year)],
    queryFn: async () => {
      const res = await fetch(`/api/farmer/farm/${farmId}/viewCrops`);
      const data = await res.json();
      if (res.status == 403) {
        toast.error(data.msg);
      }
      return data;
    },
  });
  const [showActivity, setShowActivity] = useState(null);

  return (
    <>
      {/* Main ui of Crops Lists */}

      <div className="min-h-dvh h-dvh mt-28 mb-24 ">
        {isLoading && !isError && <Spinner />}
        {!isLoading && !isError && !data?.crops?.length && <AddFirstCrop />}

        {/*crop display section */}

        <div className="mt-24 mb-8  px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px">
          {!isLoading && !isError && (
            <>
              {data?.crops?.length !== 0 && (
                <div className="flex gap-2 justify-between items-center mt-20 mb-4">
                  <div className="flex gap-2 items-center">
                    <PiFarmThin className="text-4xl bg-green-300 text-black rounded-md p-1" />
                    <h1 className=" font-semibold text-3xl ">
                      {data?.farm_name}
                    </h1>
                  </div>
                  <div>
                    <button
                      className="bg-blue-700 text-white px-3 py-1 rounded-md"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
              <div className="max-h-screen h-screen w-full bg-white flex flex-col gap-2 mb-16 overflow-y-auto mt-3">
                {data?.crops
                  ?.sort((a, b) => a?.complete.localeCompare(b?.complete))
                  .map((crop) => (
                    <Crop
                      crop={crop}
                      showActivity={showActivity}
                      setShowActivity={setShowActivity}
                      key={crop._id}
                      farm_id={farmId}
                    />
                  ))}
              </div>
            </>
          )}
          {/* <YearSelector onSelectYear={onSelectYear} /> */}
        </div>
        {!isLoading && !isError && (
          <>
            {data?.crops?.length != 0 && (
              <button
                className="fixed right-2 lg:right-9 bottom-4 bg-black border-1 border-white text-white rounded-full p-3 hover:bg-gray-800"
                onClick={() => {
                  navigate(`addCrop?id=${farmId}`);
                }}
              >
                <FiPlus className="text-4xl font-bold text-white" />
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
export default Crops;
