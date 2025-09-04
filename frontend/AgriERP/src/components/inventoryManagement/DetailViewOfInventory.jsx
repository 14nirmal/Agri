import { useQueries, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaArrowCircleUp } from "react-icons/fa";
import { FaArrowCircleDown } from "react-icons/fa";

// Detail Card Component
export default function InventoryDetailCard({ item, setShowDetails }) {
  const {
    data: Transactions,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["fetchDataindetail", item._id],
    queryFn: async () => {
      const res = await fetch(
        `/api/inventories/transactions?activity_id=${item?._id}`
      );
      const data = await res.json();
      if (res.ok) {
        return data;
      }
      return data;
    },
  });

  const itemData = {
    item_name: item.item_name,
    details: {
      Category: item.item_category,
      Quantity: `${item.item_quantity} ${item.item_unit}`,
      "Supplier Name": item.supplier_name || "N/A",
      "Item Value": `Rs ${item.item_value.toLocaleString()}`,
      Note: item.note || "N/A",
      Timestamp: new Date(item.Timestamp).toLocaleString(),
    },
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 z-50 bg-black bg-opacity-25 py-8 px-2">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-h-full overflow-y-auto">
        {/* Header Section */}
        <div className="border-b pb-2 mb-2 flex justify-between">
          <h2 className="text-2xl font-bold text-green-700">
            {item.item_name}
          </h2>
          <IoMdClose
            className="text-2xl cursor-pointer"
            onClick={() => setShowDetails(null)}
          />
        </div>

        {/* Item Details */}
        <div className="space-y-1 text-gray-700 border-b pb-2 mb-2">
          {Object.entries(itemData.details).map(([key, value]) => (
            <p key={key}>
              <span className="font-semibold">{key}:</span> {value}
            </p>
          ))}
        </div>

        {/* Transactions Table */}
        <h3 className="text-lg font-bold text-green-700 mb-2">Transactions</h3>
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
        )}
      </div>
    </div>
  );
}
