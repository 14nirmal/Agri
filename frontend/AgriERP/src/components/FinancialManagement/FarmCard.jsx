import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router";
function FarmCard({ financeData }) {
  //console.log(financeData);
  const { farm, farm_id, financial_year, total_income, total_expense } =
    financeData;
  const navigate = useNavigate();
  return (
    <>
      <div className="mt-4 sm:mt-5">
        <div className="border-2 rounded-xl shadow-lg min-h-24 p-4">
          <div className="flex justify-between items-center mb-3 sm:mb-0">
            <div className="sm:flex-1 sm:min-w-40">
              <h1 className="font-semibold text-lg sm:text-xl ">
                {(farm.length != 0 && farm[0]?.farm_name) || "farm not found"}
              </h1>
              <p className="text-sm sm:text-md text-gray-500 text-nowrap">
                {farm.length != 0 && farm[0]?.crops.length} crops
              </p>
            </div>

            <div>
              <div className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer transition-colors">
                <FaArrowRight
                  className="text-xl sm:text-2xl"
                  onClick={() => {
                    navigate(`/financials/${farm_id}/crops`);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-full sm:flex-1 grid grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-3">
            <div className="flex flex-col justify-center items-center bg-gray-100 py-2 sm:py-3 px-2 sm:px-5 rounded-lg text-center">
              <h1 className="text-base sm:text-lg font-semibold text-green-600 -mb-1">
                &#8377; {total_income.toLocaleString()}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Income</p>
            </div>

            <div className="flex flex-col justify-center items-center bg-gray-100 py-2 sm:py-3 px-2 sm:px-5 rounded-lg text-center">
              <h1 className="text-base sm:text-lg font-semibold text-red-600 -mb-1">
                &#8377; {total_expense.toLocaleString()}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Expense</p>
            </div>

            <div className="flex flex-col justify-center items-center bg-gray-100 py-2 sm:py-3 px-2 sm:px-5 rounded-lg text-center">
              <h1 className="text-base sm:text-lg font-semibold text-blue-600 -mb-1">
                &#8377; {(total_income - total_expense).toLocaleString()}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Profit</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default FarmCard;
