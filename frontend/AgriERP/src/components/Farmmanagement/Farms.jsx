import { useDispatch, useSelector } from "react-redux";
import Farm from "./Farm";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router";
import Spinner from "./Spinner";
import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authContext, isActive } from "../../contextStore/contextstore";
import AddFirstFarm from "./AddFirstFarm";

function Farms() {
  //const { err, data, isLoading } = useSelector((store) => store.FarmData);
  //const dispatch = useDispatch();

  const { setFarmData } = useContext(authContext);
  const navigate = useNavigate();
  const { error, data, isLoading } = useQuery({
    queryKey: ["FetchFarmData"],
    queryFn: async () => {
      const res = await fetch("/api/farmer/farms", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("No data found!");
      }
      setFarmData(data);
      console.log(data);
      return data;
    },
  });
  console.log(data);

  return (
    <>
      {isLoading && <Spinner></Spinner>}
      {!isLoading && error && <AddFirstFarm></AddFirstFarm>}
      <div className="farm-container h-screen mb-8 mt-28 px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px  w-full bg-white flex flex-col gap-2 pb-2 overflow-y-auto">
        {!isLoading &&
          !error &&
          data &&
          data.farms
            .sort((a, b) => Number(b.isActive) - Number(a.isActive))
            .map((farm) => {
              return <Farm farm={farm} key={farm._id} />;
            })}

        <button
          className="fixed right-2 lg:right-9 bottom-4 bg-black border-1 border-white text-white rounded-full p-3 hover:bg-gray-800"
          onClick={() => {
            navigate("/farms/addfarm");
          }}
        >
          <FiPlus className="text-4xl font-bold text-white" />
        </button>
      </div>
    </>
  );
}
export default Farms;
