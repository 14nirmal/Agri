import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProductCard from "./ProductCard";

import { FaSearch } from "react-icons/fa";

const Api_Url = import.meta.env.VITE_API_URL;
const Api_Key = import.meta.env.VITE_API_KEY;
const District = [
  "Ahmedabad",
  "Amreli",
  "Anand",
  "Banaskantha",
  "Bharuch",
  "Bhavnagar",
  "Botad",
  "Chhota Udaipur",
  "Dahod",
  "Devbhumi Dwarka",
  "Gandhinagar",
  "Gir Somnath",
  "Jamnagar",
  "Junagarh",
  "Kachchh",
  "Kheda",
  "Mehsana",
  "Morbi",
  "Narmada",
  "Navsari",
  "Panchmahals",
  "Patan",
  "Porbandar",
  "Rajkot",
  "Sabarkantha",
  "Surat",
  "Surendranagar",
  "Vadodara(Baroda)",
  "Valsad",
];
const getMarketList = async (district) => {
  const response = await fetch(
    `${Api_Url}?api-key=${Api_Key}&format=json&limit=1000&filters%5BState.keyword%5D=Gujarat&filters%5BDistrict.keyword%5D=${
      district != "" ? district : ""
    }&filters%5BArrival_Date%5D=03%2F10%2F2024`
  );
  const Alldata = await response.json();
  return [
    ...new Set(
      Alldata.records
        .map((market) => {
          return market.Market;
        })
        .sort()
    ),
  ];
};
// const getdata = async () => {
//   const response = await fetch(
//     `${Api_Url}?api-key=${Api_Key}&format=json&limit=10000000&filters%5BArrival_Date%5D=03%2F10%2F2024`
//   );
//   const Alldata = await response.json();
//   [
//     ...new Set(
//       Alldata.records.map((comodity) => {
//         return comodity.Commodity;
//       })
//     ),
//   ].map((e) => console.log(e));
// };

const getComodityList = async (Market, district) => {
  // getdata();
  const response = await fetch(
    `${Api_Url}?api-key=${Api_Key}&format=json&limit=1000&filters%5BState.keyword%5D=Gujarat&filters%5BDistrict.keyword%5D=${
      district != "" ? district : ""
    }&filters%5BArrival_Date%5D=03%2F10%2F2024`
  );
  const Alldata = await response.json();
  return [
    ...new Set(
      Alldata.records
        .filter((market) => {
          if (Market != "") {
            return market.Market == Market;
          } else {
            return market.Market != null;
          }
        })
        .map((commodity) => {
          return commodity.Commodity;
        })
        .sort()
    ),
  ];
};

//-------------------------------------------------------------------------------------
const getLast15Days = async () => {
  const dates = [];

  const currentDate = new Date();

  for (let i = 0; i < 15; i++) {
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - i);
    dates.push(pastDate.toLocaleDateString("en-GB"));
  }
  return dates;
};

export const getMarketPriceData = async (district, market, crop) => {
  let date = await getLast15Days();

  let data = [];

  for (let d of date) {
    const response = await fetch(
      `${Api_Url}?api-key=${Api_Key}&format=json&limit=100&filters%5BState.keyword%5D=Gujarat${
        district != "" ? `&filters%5BDistrict.keyword%5D=${district}` : ""
      }${
        crop != "" ? `&filters%5BCommodity.keyword%5D=${crop}` : ""
      }&filters%5BArrival_Date%5D=${d}`
    );
    const Alldata = await response.json();
    if (market != "") {
      data = Alldata.records.filter((data) => data.Market == market);
    } else {
      data = Alldata.records;
    }
    if (data.length != 0) {
      break;
    }
  }

  return data;
};

function MarketForm() {
  const [district, setDistrict] = useState("");
  const [Market, setMarket] = useState("");
  const [crop, setCrop] = useState("");
  // const [fetchData, setFetchData] = useState(false);

  //--------------------------------------------------------------------------------------
  const { data: markets, isLoading: isLoadingMarkets } = useQuery({
    queryKey: ["ListOfMarket", district],
    queryFn: () => {
      return getMarketList(district);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  //--------------------------------------------------------------------------------------
  const { data: comodity, isLoading: isComodityLoading } = useQuery({
    queryKey: ["ComodityList", district, Market],
    queryFn: () => {
      return getComodityList(Market, district);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  //--------------------------------------------------------------------------------------
  const {
    data: MarketPriceData,
    isLoading: isMarketPriceDataLoading,
    isError,
  } = useQuery({
    queryKey: ["fetchalldata", district, Market, crop],
    // queryKey: ["fetchalldata", fetchData],
    queryFn: () => {
      // setFetchData(false);
      return getMarketPriceData(district, Market, crop);
    },

    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
  });
  //--------------------------------------------------------------------------------------
  const selectDistrict = (e) => {
    if (e == "") {
      setDistrict("Rajkot");
      setMarket("");
    } else {
      setDistrict(e.target.value);
    }
  };
  const selectedMarket = (e) => {
    if (e == "") {
      setMarket("");
      setCrop("");
    } else {
      setMarket(e.target.value);
      setCrop("");
    }
  };
  const selectedCrop = (e) => {
    if (e == "") {
      setCrop("");
    } else {
      setCrop(e.target.value);
    }
  };
  console.log(MarketPriceData);
  //--------------------------------------------------------------------------------------
  return (
    <>
      <div className=" mb-8 mt-28 px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px  w-full  flex flex-col gap-2 pb-2 ">
        <div className="mt-6 w-full">
          <div className="flex flex-wrap justify-center items-start gap-5">
            <select
              name=""
              id=""
              className="block  px-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 w-full text-xl"
              onChange={selectDistrict}
            >
              <option value="">{"select district"}</option>
              {District.map((district, index) => {
                return (
                  <option value={district} key={index}>
                    {district}
                  </option>
                );
              })}
            </select>
            <select
              name=""
              id=""
              className="block px-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 w-full text-xl"
              onChange={selectedMarket}
            >
              <option value="">{"select market"}</option>

              {!isLoadingMarkets &&
                markets.map((market, index) => {
                  return (
                    <option value={market} key={index}>
                      {market}
                    </option>
                  );
                })}
            </select>

            <select
              name=""
              id=""
              className="block px-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 w-full text-xl"
              onChange={selectedCrop}
            >
              <option value="">{"select crop"}</option>

              {!isComodityLoading &&
                comodity.map((comodity, index) => {
                  return (
                    <option value={comodity} key={index}>
                      {comodity}
                    </option>
                  );
                })}
            </select>
            <button
              type="submit"
              className={`bg-green-700  text-white px-4 py-[6px] rounded-md font-semibold flex gap-2 justify-center items-center ${
                isMarketPriceDataLoading && "opacity-[0.29]"
              }`}
              // onClick={() => {
              //   setFetchData(true);
              // }}
              disabled={isMarketPriceDataLoading}
            >
              <FaSearch className="text-white text-large font-bold" />
              {isMarketPriceDataLoading ? "Serching..." : "Search"}
            </button>
          </div>
        </div>
        {MarketPriceData && MarketPriceData.length == 0 && (
          <div className="w-full  flex-col flex items-center justify-center text-center">
            <img
              src="clipart-farm-agricultural-production-17.png"
              alt=""
              srcSet=""
              className="w-40 mix-blend-multiply pt-28 -mb-4 "
            />
            {isError ? (
              <h1 className="text-xl text-blue-400">
                The data will be displayed shortly. Please check again later
              </h1>
            ) : (
              <h1 className="text-xl text-blue-400">
                The data will Not Available. Please check again later
              </h1>
            )}
          </div>
        )}
        {(isMarketPriceDataLoading ||
          isComodityLoading ||
          isLoadingMarkets) && (
          <div className="min-h-screen flex justify-center -z-0 items-center fixed inset-0 bg-black bg-opacity-10">
            <div className="border-gray-300 h-10 w-10 z-50 animate-spin rounded-full border-4 m-auto border-t-blue-700 " />
          </div>
        )}
        <div
          className={`flex flex-wrap gap-6 mt-5  h-screen ${
            MarketPriceData?.length >= 2 && "overflow-scroll"
          }`}
        >
          {!isMarketPriceDataLoading &&
            MarketPriceData.map((marketPriceData, index) => {
              return (
                <ProductCard marketPriceData={marketPriceData} key={index} />
              );
            })}
        </div>
      </div>
    </>
  );
}
export default MarketForm;
