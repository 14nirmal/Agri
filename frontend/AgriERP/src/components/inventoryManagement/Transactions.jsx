import React, { useEffect, useState } from "react";
import { ChevronRight, Clock, ShoppingCart } from "lucide-react";
import { FaBox } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { SlNote } from "react-icons/sl";
import TransactionNotFound from "../FinancialManagement/TransactionNotFound";

const Transactions = ({ setTransactions }) => {
  const [TransactionType, setTransactionType] = useState("All");
  const [filteredTransaction, setFilteredTransaction] = useState([]);

  const {
    data: Transactions,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["fetchTransactionData"],
    queryFn: async () => {
      const res = await fetch("/api/inventories/transactions");
      const data = await res.json();
      if (res.ok) {
        console.log("fetch data");
        setTransactions(data);
      } else {
        setTransactions([]);
      }
      return data;
    },
  });

  useEffect(() => {
    if (Transactions && !Transactions.msg) {
      const sortedTransactions = Transactions.sort(
        (a, b) => new Date(b.Timestamp) - new Date(a.Timestamp)
      );
      if (TransactionType === "All") {
        setFilteredTransaction(sortedTransactions);
      } else {
        setFilteredTransaction(
          sortedTransactions.filter(
            (transaction) => transaction.transaction_type === TransactionType
          )
        );
      }
    } else {
      setFilteredTransaction([]);
    }
  }, [TransactionType, Transactions]);

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions.</div>;

  return (
    <div className="mx-auto p-3 sm:p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
      </div>
      <div className="flex space-x-2 mb-6">
        {["All", "add", "reduce"].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg ${
              TransactionType === type
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700"
            } font-medium shadow-sm transition`}
            onClick={() => setTransactionType(type)}
          >
            {type === "All"
              ? "All"
              : type === "add"
              ? "Additions"
              : "Reductions"}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-col pb-2 max-h-64 overflow-y-auto">
        {!error && isLoading && (
          <div className="min-h-full flex justify-center items-center">
            <div className="bg-transparent border-4 border-t-blue-800 rounded-full h-9 w-9 animate-spin"></div>
          </div>
        )}
        {!isLoading && filteredTransaction.length === 0 && (
          <TransactionNotFound />
        )}
        {filteredTransaction.map((transaction) => (
          <div
            className="p-2 sm:p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
            key={transaction._id}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span
                className={
                  transaction.transaction_type === "add"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {transaction.transaction_type === "add" ? "+" : "-"}{" "}
                {transaction.item_quantity} {transaction.item_data.item_unit}
              </span>
              <span className="font-semibold text-gray-800">
                {transaction.item_data.item_name}
              </span>
            </div>
            <div className="text-gray-500 text-sm mt-2 flex items-center">
              <Clock size={16} className="mr-1" />
              {new Date(transaction.Timestamp).toDateString()}{" "}
              &nbsp;&nbsp;&nbsp;
              {new Date(transaction.Timestamp).toLocaleTimeString()}
            </div>
            <div className="text-sm mt-3 text-gray-600 flex items-center">
              {transaction.transaction_type === "add" ? (
                <>
                  <ShoppingCart size={16} className="mr-1 text-gray-400" />
                  Purchase from {transaction.supplier_name}
                </>
              ) : (
                <>
                  <FaBox className="mr-1 text-gray-400" />
                  Used for {transaction.used_for}
                </>
              )}
            </div>
            {transaction.note && (
              <div className="text-sm mt-2 text-gray-700 ">
                <SlNote className="mr-1 text-md text-gray-400 font-bold  inline-block" />
                {transaction.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
