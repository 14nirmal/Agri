import { useQuery } from "@tanstack/react-query";
import { IoMdClose } from "react-icons/io";
import Spinner from "../Farmmanagement/Spinner";
import { toast } from "react-toastify";

function ViewDetail({ farmer_id, setViewDetailId }) {
  const { data: farmerData, isLoading } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/admin/farmer/${farmer_id}/getDetails`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg);
      }
      console.log(data);
      return data;
    },
    queryKey: ["fetchFarmerdeatils"],
  });
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <div className="flex justify-center items-center fixed inset-0 z-50 bg-black bg-opacity-25 py-8 px-2">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-h-full overflow-y-auto">
          {/* Header Section */}
          <div className="border-b pb-2 mb-2 flex justify-between">
            {/* <h2 className="text-2xl font-bold text-green-700">
              {item.item_name}
            </h2> */}
            <IoMdClose
              className="text-2xl cursor-pointer ml-auto"
              onClick={() => setViewDetailId(null)}
            />
          </div>

          {/* Item Details */}
          <div className="space-y-1 text-gray-700 border-b pb-2 mb-2">
            <p>
              {" "}
              <strong>Farmer name:</strong> {farmerData.farmer_name}
            </p>
            {/* <p>
              {" "}
              <strong>email:</strong> {farmerData?.email ?? "-"}
            </p> */}
            <p>
              {" "}
              <strong>phone number:</strong> {farmerData.phone_number}
            </p>
            <p>
              {" "}
              <strong>Total Farms:</strong> {farmerData.total_farms}
            </p>
            <p>
              {" "}
              <strong>Total crops:</strong> {farmerData.total_crops}
            </p>
            <p>
              {" "}
              <strong>Total income:</strong> {farmerData.total_income}
            </p>
            <p>
              {" "}
              <strong>Total expenses:</strong> {farmerData.total_expense}
            </p>
          </div>

          {/* Transactions Table */}
          {/* <h3 className="text-lg font-bold text-green-700 mb-2">
            Transactions
          </h3>
          {isLoading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <p>Error fetching transactions</p>
          ) : Transactions.length === 0 ? (
            <p>No transactions found</p>
          ) : (
            <table className="w-full  border border-gray-300 mb-2 text-sm ">
              <thead>
                <tr className="bg-green-100">
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Note</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {Transactions.sort(
                  (a, b) => new Date(b.Timestamp) - new Date(a.Timestamp)
                )?.map((transaction, index) => (
                  <tr key={index} className="text-center border-b">
                    <td className="p-2  ">
                      {transaction.transaction_type == "add" ? (
                        <FaArrowCircleUp className="text-green-700 m-auto" />
                      ) : (
                        <FaArrowCircleDown className="text-red-700 m-auto" />
                      )}
                    </td>
                    <td className="p-2 border">{transaction.item_quantity}</td>
                    <td className="p-2 border">
                      {new Date(transaction.Timestamp).toLocaleString()}
                    </td>
                    <td className="p-2 border">{transaction.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )} */}
        </div>
      </div>
    </>
  );
}
export default ViewDetail;
