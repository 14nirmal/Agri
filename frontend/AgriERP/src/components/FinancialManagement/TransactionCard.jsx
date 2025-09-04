import { useRef, useState } from "react";
import DetailCard from "./DetailCard";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { isActive } from "../../contextStore/ContextStore";
import useCloseDropDown from "../../Hooks/useCloseDropDown";

export default function TransactionCard({
  transaction,
  openOptions,
  setOpenOptions,
}) {
  // const [openOptions, setOpenOptions] = useState(false);
  const [showDetails, setshowDetails] = useState(false);
  const client = useQueryClient();
  const { f_id } = useParams();
  const isactive = isActive(f_id);

  const handleEdit = () => {
    alert("Edit transaction");
  };

  const handleDelete = async () => {
    const data = await fetch(
      `/api/farmer/farm/${f_id}/crop/transaction/${transaction?._id}/${transaction?.transaction_type}/delete`,
      {
        method: "DELETE",
      }
    );
    const res = await data.json();
    if (data.ok) {
      toast.success(res.msg);
      client.invalidateQueries(["fetchCropFinancials"]);
    } else {
      toast.error(res.msg);
    }
  };

  const handleViewDetails = () => {
    setshowDetails(true);
    setOpenOptions(() => null);
  };
  const dropdownRef = useRef("");
  useCloseDropDown({ dropdownRef, setOpenMenu: setOpenOptions });

  return (
    <>
      <div className="flex items-center border rounded-lg shadow-lg p-4 bg-white w-full  text-sm sm:text-base ">
        <img
          src={`http://localhost:2000/${transaction?.image_url.replace(
            /\\/g,
            "/"
          )}`}
          alt={transaction?.transaction_type}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0 ml-4">
          <div className="flex justify-between text-sm font-medium">
            <span className="capitalize truncate">
              {transaction?.transaction_type === "income"
                ? transaction?.income_type
                : transaction?.expense_type}
            </span>
            <span className="whitespace-nowrap">
              {new Date(transaction?.transaction_date).toLocaleDateString()}
            </span>
          </div>
          <div
            className={`text-lg font-semibold truncate ${
              transaction?.transaction_type == "income"
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {transaction?.transaction_type == "income" ? "+" : "-"} ₹
            {transaction?.amount.toLocaleString()}
          </div>
          {transaction?.note && (
            <div className="text-sm text-gray-500 truncate max-w-full">
              {transaction?.note}
            </div>
          )}
        </div>
        <div className="relative  flex-shrink-0 ml-4">
          <button
            className="text-lg focus:outline-none"
            onClick={() => {
              setOpenOptions((prev) =>
                prev == transaction._id ? null : transaction?._id
              );
            }}
          >
            ⋮
          </button>
          {console.log(openOptions)}
          {openOptions == transaction?._id && (
            <div
              className="absolute -right-4 z-10 mt-4 w-36 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
              role="menu"
              tabIndex="-1"
              ref={dropdownRef}
            >
              <div className="py-1" role="none">
                <a
                  href="#"
                  className=" px-4 py-2 text-sm text-gray-700 flex gap-2 items-center hover:bg-gray-100"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-2"
                  onClick={handleViewDetails}
                >
                  <CiViewList className="text-lg" />
                  View
                </a>
                <a
                  className="px-4 py-2 text-sm text-gray-700 hover:cursor-pointer flex gap-2 items-center  hover:bg-gray-100"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-2"
                  onClick={
                    isactive
                      ? handleDelete
                      : () => {
                          alert("No Action perform becasue farm is disabled!");
                        }
                  }
                >
                  <MdDelete className="text-lg"></MdDelete>
                  Delete
                </a>
                <a
                  href="#"
                  className=" px-4 py-2 text-sm text-gray-700 flex gap-2 items-center  hover:bg-gray-100"
                  role="menuitem"
                  tabIndex="-1"
                  id="menu-item-2"
                  onClick={() => {
                    setOpenOptions(null);
                  }}
                >
                  <IoMdClose className="text-lg"></IoMdClose>
                  Close
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      {showDetails && (
        <DetailCard
          transaction={transaction}
          setshowDetails={setshowDetails}
          key={"Detailed" + transaction._id}
        />
      )}
    </>
  );
}
