import { useParams } from "react-router";
import CropCard from "./CropCard";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Farmmanagement/Spinner";
import { useState } from "react";
import AddFirstCrop from "../Farmmanagement/Crops/AddFirstCrop";

function CropFinancials() {
  const { f_id } = useParams();

  const {
    data: cropFinancials,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetchCropCardFinancials", f_id],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  async function fetchData() {
    const res = await fetch(`/api/farmer/farm/viewfinancials?farm_id=${f_id}`);
    const data = await res.json();
    if (res.ok) {
      return data;
    }
  }

  return (
    <>
      {isLoading && <Spinner />}
      <div className="w-full min-h-dvh pt-16 sm:pt-20">
        <div className="px-3 mt-4 md:px-10 lg:px-4 xl:px-28 w-full">
          <div className="financials-heading flex justify-between items-center">
            <h1 className="font-semibold text-lg sm:text-2xl ">
              {cropFinancials?.farm_name} : Crop Overview
            </h1>
            <p className="text-sm sm:text-md text-gray-500 text-nowrap">
              {cropFinancials?.cropdata?.length} Crops
            </p>
          </div>

          <div className="max-h-screen custom-scrollbar  overflow-y-auto  mb-8 mt-1">
            {!isLoading &&
              !isError &&
              cropFinancials?.cropdata?.length == 0 && (
                <AddFirstCrop></AddFirstCrop>
              )}
            {!isLoading &&
              !isError &&
              cropFinancials?.cropdata?.map((cropData, index) => {
                console.log("cropData : " + cropData.crop_id);
                return <CropCard cropData={cropData} key={cropData.crop_id} />;
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default CropFinancials;
