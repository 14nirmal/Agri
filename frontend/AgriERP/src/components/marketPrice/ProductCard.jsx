// import { IoLocationOutline } from "react-icons/io5";
// import { MdDateRange } from "react-icons/md";
// function ProductCard({ marketPriceData }) {
//   return (
//     <>
//       <div className="border-2 max-h-min w-full  rounded-xl p-4 shadow-lg shadow-gray-200">
//         <div className="top-heading flex justify-between items-center pb-3 border-b-2">
//           <div>
//             <h2 className="text-lg  font-bold">{marketPriceData.Commodity}</h2>
//             <h4>Variety : {marketPriceData.Variety}</h4>
//           </div>
//           <div
//             className={`${
//               marketPriceData.Grade == "FAQ" ? "bg-green-100" : "bg-blue-100"
//             } text-xs rounded-xl py-[6px] px-2 font-semibold`}
//           >
//             Grade {marketPriceData.Grade}
//           </div>
//         </div>

//         <div className="mt-4">
//           <div className="flex gap-2 items-center">
//             {" "}
//             <IoLocationOutline className="text-blue-800 font-extrabold text-2xl" />
//             <div className="flex flex-col gap-0">
//               <h2 className="font-semibold text-lg -mb-1">
//                 {marketPriceData.Market}
//               </h2>
//               <h4 className="text-md text-gray-500 ">
//                 {marketPriceData.District}
//               </h4>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-2 mt-4">
//           <MdDateRange className="text-blue-800 font-extrabold text-xl" />
//           <p className="text-gray-500 font-semibold">
//             {marketPriceData.Arrival_Date}
//           </p>
//         </div>
//         <div className="flex justify-between text-center gap-3 mt-5  ">
//           <div className="bg-green-50  flex-1 p-2 rounded-lg  border-1">
//             <h1 className="text-sm">
//               <strong className="text-gray-500">minimum price</strong>
//             </h1>
//             <p className="text-md font-bold text-red-700">
//               &#8377; {marketPriceData.Min_Price / 5}
//             </p>
//           </div>
//           <div className="bg-green-50  flex-1 p-2 rounded-lg border-1  ">
//             <h1 className="text-sm">
//               {" "}
//               <strong className="text-gray-500">model price</strong>
//             </h1>
//             <p className="text-md font-bold text-blue-600">
//               &#8377; {marketPriceData.Modal_Price / 5}
//             </p>
//           </div>
//           <div className="bg-green-50  flex-1 p-2 rounded-lg border-1 ">
//             <h1 className="text-sm">
//               {" "}
//               <strong className="text-gray-500">maximum price</strong>
//             </h1>
//             <p className="text-md font-bold text-green-600">
//               &#8377; {marketPriceData.Max_Price / 5}
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// export default ProductCard;

import { IoLocationOutline } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { Link } from "react-router-dom";
import { BiBarChartAlt2 } from "react-icons/bi";

function ProductCard({ marketPriceData }) {
  const queryParams = new URLSearchParams({
    crop: marketPriceData.Commodity,
    market: marketPriceData.Market,
    state: marketPriceData.State,
  }).toString();

  return (
    <>
      <div className="border-2 max-h-min w-full rounded-xl p-4 shadow-lg shadow-gray-200 relative">
        <div className="top-heading flex justify-between items-center pb-3 border-b-2">
          <div>
            <h2 className="text-lg font-bold">{marketPriceData.Commodity}</h2>
            <h4>Variety : {marketPriceData.Variety}</h4>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`${
                marketPriceData.Grade === "FAQ" ? "bg-green-100" : "bg-blue-100"
              } text-xs rounded-xl py-[6px] px-2 font-semibold`}
            >
              Grade {marketPriceData.Grade}
            </div>
            <Link
              to={`/market-trends?${queryParams}`}
              className="text-sm text-blue-600 hover:underline text-nowrap flex items-center"
            >
              <BiBarChartAlt2 />
              View Trend
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex gap-2 items-center">
            <IoLocationOutline className="text-blue-800 font-extrabold text-2xl" />
            <div className="flex flex-col gap-0">
              <h2 className="font-semibold text-lg -mb-1">
                {marketPriceData.Market}
              </h2>
              <h4 className="text-md text-gray-500">
                {marketPriceData.District}
              </h4>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <MdDateRange className="text-blue-800 font-extrabold text-xl" />
          <p className="text-gray-500 font-semibold">
            {marketPriceData.Arrival_Date}
          </p>
        </div>

        <div className="flex justify-between text-center gap-3 mt-5">
          <div className="bg-green-50 flex-1 p-2 rounded-lg border-1">
            <h1 className="text-sm">
              <strong className="text-gray-500">minimum price</strong>
            </h1>
            <p className="text-md font-bold text-red-700">
              ₹ {marketPriceData.Min_Price / 5}
            </p>
          </div>
          <div className="bg-green-50 flex-1 p-2 rounded-lg border-1">
            <h1 className="text-sm">
              <strong className="text-gray-500">model price</strong>
            </h1>
            <p className="text-md font-bold text-blue-600">
              ₹ {marketPriceData.Modal_Price / 5}
            </p>
          </div>
          <div className="bg-green-50 flex-1 p-2 rounded-lg border-1">
            <h1 className="text-sm">
              <strong className="text-gray-500">maximum price</strong>
            </h1>
            <p className="text-md font-bold text-green-600">
              ₹ {marketPriceData.Max_Price / 5}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
