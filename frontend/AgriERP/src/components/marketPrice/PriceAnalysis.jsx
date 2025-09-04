import { useEffect, useState } from "react";
import { states } from "./Data/State.json";
import { LineChart } from "@mui/x-charts/LineChart";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";

function PriceAnalyse() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cropName = params.get("crop");
  const marketName = params.get("market");
  const stateName = params.get("state");
  const [state, setState] = useState(stateName || "");
  const [mandi, setMarket] = useState(marketName || "");
  const [crop, setCrop] = useState(cropName || "");

  const [markets, SetMarkets] = useState([]);
  const [comodity, setComodity] = useState([]);
  const [MarketPriceData, setMarketPriceData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const Api_Url = import.meta.env.VITE_API_URL;
  const Api_Key = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    setState(stateName);
    setMarket(marketName);
    setCrop(cropName);
  }, [location]);

  const [dates, setDates] = useState([
    "10/02/2024",
    "11/02/2003",
    "12/02/2025",
    "13/02/2025",
    "14/02/2025",
    "15/02/2025",
    "16/02/2025",
    "20/02/2025",
  ]);

  const [varietyBaseData, setVarietyBaseData] = useState([
    {
      data: [2880, 2900, 2925, 2910, 2930, 2875, 2900, 2875],
      label: "lokwan",
    },
    {
      data: [2700, 3000, 4000, 2500, 2204, 2834, 2240, 2888],
      label: "lokwan",
    },
  ]);

  const getLast10Days = async () => {
    const dates = [];
    const currentDate = new Date();

    for (let i = 0; i < 10; i++) {
      const pastDate = new Date();
      pastDate.setDate(currentDate.getDate() - i);
      dates.push(pastDate.toLocaleDateString("en-GB")); // Format DD/MM/YYYY
    }

    return dates;
  };

  //   useEffect(() => {
  //     setComodity([]);
  //     fetch(
  //       `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=579b464db66ec23bdd000001f859b82fc6574e0240c7202727aea38f&format=json&limit=1000&filters%5BState.keyword%5D=${state}&filters%5BArrival_Date%5D=03%2F10%2F2024`
  //     )
  //       .then((data) => {
  //         return data.json();
  //       })
  //       .then((data) => {
  //         SetMarkets([
  //           ...new Set(
  //             data.records.map((market) => {
  //               return market.Market;
  //             })
  //           ),
  //         ]);
  //       });
  //   }, [state]);

  useEffect(() => {
    if (!state) return;

    SetMarkets([]); // Reset markets when state changes

    const fetchMarkets = async (date, attemptsLeft = 7) => {
      const formattedDate = date.toLocaleDateString("en-GB"); // dd/mm/yyyy
      const url = `${Api_Url}?api-key=${Api_Key}&format=json&limit=1000&filters%5BState.keyword%5D=${state}&filters%5BArrival_Date%5D=${encodeURIComponent(
        formattedDate
      )}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const marketList = [
          ...new Set(data.records.map((record) => record.Market)),
        ];

        if (marketList.length > 0 || attemptsLeft === 0) {
          SetMarkets(marketList);
        } else {
          const previousDate = new Date(date);
          previousDate.setDate(date.getDate() - 1);
          fetchMarkets(previousDate, attemptsLeft - 1);
        }
      } catch (err) {
        console.error("Error fetching markets:", err);
      }
    };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    fetchMarkets(yesterday);
  }, [state]);

  //   useEffect(() => {
  //     fetch(
  //       `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=579b464db66ec23bdd000001f859b82fc6574e0240c7202727aea38f&format=json&limit=1000&filters%5BState.keyword%5D=${state}&filters%5BArrival_Date%5D=03%2F10%2F2024`
  //     )
  //       .then((data) => {
  //         return data.json();
  //       })
  //       .then((data) => {
  //         setComodity([
  //           ...new Set(
  //             data.records
  //               .filter((market) => {
  //                 return market.Market == mandi;
  //               })
  //               .map((commodity) => {
  //                 return commodity.Commodity;
  //               })
  //           ),
  //         ]);
  //       });
  //   }, [mandi]);
  useEffect(() => {
    if (!mandi || !state) return;

    const fetchData = async (date, attemptsLeft = 7) => {
      const formattedDate = date.toLocaleDateString("en-GB"); // dd/mm/yyyy
      const url = `${Api_Url}?api-key=${Api_Key}&format=json&limit=1000&filters%5BState.keyword%5D=${state}&filters%5BArrival_Date%5D=${encodeURIComponent(
        formattedDate
      )}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const filteredCommodities = [
          ...new Set(
            data.records
              .filter((market) => market.Market === mandi)
              .map((c) => c.Commodity)
          ),
        ];

        if (filteredCommodities.length > 0 || attemptsLeft === 0) {
          setComodity(filteredCommodities);
        } else {
          const previousDate = new Date(date);
          previousDate.setDate(date.getDate() - 1);
          fetchData(previousDate, attemptsLeft - 1); // Try previous day
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    fetchData(yesterday);
  }, [mandi, state]);

  const handelClickEvent = async () => {
    if (state == "") {
      alert("Please Select A State");
    } else if (mandi == "") {
      alert("Please Select A Market Yard");
    } else if (crop == "") {
      alert("Please Select A Commodity");
    } else {
      setFetching(true);
      setError(null);
      let ProductData = [];
      let last10dates = await getLast10Days();

      try {
        await Promise.all(
          last10dates.map((date) => {
            return fetch(
              `${Api_Url}?api-key=${Api_Key}&format=json&limit=1000&filters%5BState.keyword%5D=${state}&filters%5BCommodity.keyword%5D=${crop}&filters%5BArrival_Date%5D=${date}`
            )
              .then((data) => {
                return data.json();
              })
              .then((data) => {
                if (data.records) {
                  data.records
                    .filter((data) => data.Market == mandi)
                    .forEach((data) => {
                      ProductData.push({
                        date: data.Arrival_Date,
                        model_price: data.Modal_Price / 5,
                        min_price: data.Min_Price / 5,
                        Max_Price: data.Max_Price / 5,
                        variety: data.Variety,
                      });
                    });
                }
              });
          })
        );
        setMarketPriceData(ProductData);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
  };

  useEffect(() => {
    if (MarketPriceData.length === 0) return;

    try {
      // Sort data by date
      let sortedData = [...MarketPriceData].sort(
        (a, b) =>
          new Date(a.date.split("/").reverse().join("-")) -
          new Date(b.date.split("/").reverse().join("-"))
      );

      // Get unique dates for x-axis
      const uniqueDates = [...new Set(sortedData.map((item) => item.date))];
      setDates(uniqueDates);

      // Get unique varieties
      const uniqueVarieties = [
        ...new Set(sortedData.map((item) => item.variety)),
      ];

      // Prepare data for each variety
      const processedData = uniqueVarieties.map((variety) => {
        const varietyData = sortedData.filter(
          (item) => item.variety === variety
        );

        // Create an object with date->price mapping
        const datePriceMap = {};
        varietyData.forEach((item) => {
          datePriceMap[item.date] = Number(item.Max_Price);
        });

        // Create data array with values for each date in uniqueDates
        const dataArray = uniqueDates.map((date) => {
          // Use the price if available for this date, otherwise use null/undefined
          return datePriceMap[date] !== undefined ? datePriceMap[date] : null;
        });

        return {
          data: dataArray,
          label: variety || "Unknown",
          // Filter out null values if needed
          connectNulls: true,
        };
      });

      setVarietyBaseData(processedData);
    } catch (err) {
      console.error("Error processing chart data:", err);
      setError("Error processing chart data");
    }
  }, [MarketPriceData]);
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen p-4 pt-28">
      <div className="max-w-7xl mx-auto">
        <div>
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="bg-blue-800 text-white px-2 py-1 rounded-md shadow-md"
          >
            Back
          </button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
            Market Price Analyzer
          </h1>
          <p className="text-gray-600">
            Track agricultural commodity prices across markets
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select State
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-800 appearance-none transition duration-300 ease-in-out hover:border-green-400"
                onChange={(event) => {
                  setState(event.target.value);
                }}
                value={state}
              >
                <option value="">Select a state</option>
                {states.map((state, index) => (
                  <option key={index} value={state.state_name}>
                    {state.state_name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Market
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-800 appearance-none transition duration-300 ease-in-out hover:border-green-400"
                onChange={(event) => {
                  setMarket(event.target.value);
                }}
                value={mandi}
                disabled={markets.length === 0}
              >
                {markets.length === 0 ? (
                  <option value="">No Markets Found</option>
                ) : (
                  <option value="">Select a market</option>
                )}
                {markets.map((market, index) => (
                  <option key={index} value={market}>
                    {market}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Commodity
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-800 appearance-none transition duration-300 ease-in-out hover:border-green-400"
                onChange={(event) => {
                  setCrop(event.target.value);
                }}
                value={crop}
                disabled={comodity.length === 0}
              >
                {comodity.length === 0 ? (
                  <option value="">No Commodities Found</option>
                ) : (
                  <option value="">Select a commodity</option>
                )}
                {comodity.map((comm, index) => (
                  <option key={index} value={comm}>
                    {comm}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-end">
              <button
                className={`w-full px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-4 transition-all duration-300 ${
                  fetching
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/50 focus:ring-green-500/50"
                }`}
                onClick={handelClickEvent}
                disabled={fetching}
              >
                {fetching ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                    Show Chart
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 rounded-lg p-4 mb-8 border border-red-200 text-red-800 flex items-center">
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1V8a1 1 0 012 0v6a1 1 0 01-1 1z"
                clipRule="evenodd"
              ></path>
            </svg>
            {error}
          </div>
        )}

        {MarketPriceData.length > 0 &&
          dates.length > 0 &&
          varietyBaseData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 border border-green-100 transition-all duration-500 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="font-bold text-2xl text-gray-800">
                    Price Trends
                  </h2>
                  <p className="text-gray-600">
                    {crop} prices at {mandi}, {state}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                  {varietyBaseData.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div
                        className="w-3 h-3 rounded-full mr-1"
                        style={{
                          backgroundColor: `hsl(${
                            (index * 60) % 360
                          }, 70%, 50%)`,
                        }}
                      ></div>
                      <span>{item.label || "Unknown"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <div
                  className="min-h-[400px]"
                  style={{ minWidth: Math.max(dates.length * 80, 600) + "px" }}
                >
                  {dates.length === varietyBaseData[0]?.data.length ? (
                    <LineChart
                      height={400}
                      series={varietyBaseData.map((series, index) => ({
                        ...series,
                        curve: "monotoneX",
                        showMark: true,
                        color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
                      }))}
                      xAxis={[
                        {
                          scaleType: "point",
                          data: dates,
                          label: "Date",
                          tickLabelStyle: {
                            angle: 45,
                            textAnchor: "start",
                            fontSize: 12,
                          },
                        },
                      ]}
                      margin={{ top: 20, right: 40, bottom: 80, left: 60 }}
                      sx={{
                        ".MuiLineElement-root": {
                          strokeWidth: 3,
                        },
                        ".MuiMarkElement-root": {
                          stroke: "#fff",
                          scale: "1.2",
                          strokeWidth: 2,
                        },
                        ".MuiChartsAxisHighlight-root": {
                          strokeDasharray: "none", // Makes the hover line solid
                        },
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">
                        Chart data is being processed...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {MarketPriceData.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Variety
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Min Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Modal Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Max Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {MarketPriceData.sort(
                        (a, b) =>
                          new Date(a.date.split("/").reverse().join("-")) -
                          new Date(b.date.split("/").reverse().join("-"))
                      ).map((item, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.variety}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{item.min_price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{item.model_price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{item.Max_Price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        {MarketPriceData.length === 0 &&
          !fetching &&
          (state || mandi || crop) && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-green-100">
              <svg
                className="w-20 h-20 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No data available
              </h3>
              <p className="mt-2 text-gray-600">
                {state && mandi && crop
                  ? `No price data found for ${crop} at ${mandi}, ${state}.`
                  : "Please complete your selection to view price data."}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

export default PriceAnalyse;
