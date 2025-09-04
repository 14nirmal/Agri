import { useQuery } from "@tanstack/react-query";
import FarmCard from "./FarmCard";
import Spinner from "../Farmmanagement/Spinner";

function FinancialManagement() {
  const {
    isLoading,
    data: farmdata,
    isError,
  } = useQuery({
    queryKey: ["fetchFarmFinanceData"],
    queryFn: fetchData,
  });
  async function fetchData() {
    const res = await fetch("/api/farmer/farm/viewfinancials");
    const data = await res.json();
    console.log(data);
    return data;
  }

  return (
    <>
      <div className="w-full min-h-dvh pt-16 sm:pt-20">
        <div className="px-3 mt-4 md:px-10 lg:px-4 xl:px-28 w-full">
          <div className="financials-heading flex justify-between items-center">
            <h1 className="font-semibold text-xl sm:text-2xl">Farm Overview</h1>
            <p className="text-sm sm:text-md text-gray-500">
              {(!isLoading && !isError && farmdata?.data?.length) || 0} farms
            </p>
          </div>
          <div className="max-h-screen overflow-y-auto  mb-8 mt-1">
            {isLoading && <Spinner />}
            {!isLoading &&
              !isError &&
              farmdata?.data?.map((financeData, index) => {
                return <FarmCard financeData={financeData} key={index} />;
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default FinancialManagement;
