import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { inventorySchema } from "../login/validate";
import { toast } from "react-toastify";
import Transactions from "./Transactions";
import Spinner from "../Farmmanagement/Spinner";
import { MdDelete } from "react-icons/md";

import TransactionUpdate from "./TransactionUpdate";
import { FaSpinner } from "react-icons/fa";
import LoadingButton from "../Farmmanagement/LoadingButton";
import InventoryDetailCard from "./DetailViewOfInventory";

const farmingInventoryCategories = [
  "Seeds",
  "Fertilizers",
  "Pesticides",
  "Tools",
  "Machinery",
  "Irrigation Equipment",
  "Animal Feed",
  "Other",
];

function InventoryManagement() {
  const client = useQueryClient();
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues: {
      item_name: "",
      item_category: "",
      item_quantity: "",
      item_unit: "",
      supplier_name: "",
      item_value: "",
      note: "",
    },
    validationSchema: inventorySchema,
    onSubmit: (data) => {
      Mutation.mutate(data);
      document.body.style.overflow = "scroll";
    },
  });

  const Mutation = useMutation({
    mutationKey: ["AddItem"],
    mutationFn: async (data) => {
      const d = await fetch(`/api/inventories/addItem`, {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify(data),
      });
      const res = await d.json();
      if (d.ok) {
        toast.success(res.msg);
        client.invalidateQueries(["fetchInventorydata"]);
        client.invalidateQueries(["fetchTransactionData"]);

        resetForm();
        setshowInventoryForm(false);
      } else {
        toast.error(res.msg);
      }
    },
  });

  //fetching inventory data
  const {
    data: Inventories,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["fetchInventorydata"],
    queryFn: async () => {
      const res = await fetch("/api/inventories");
      const data = await res.json();
      if (res.ok) {
        setCategories([...new Set(data.map((c) => c.item_category))]);
        setLowStockItems(data.filter((c) => c.item_quantity < 5));
        setValueOfItem(
          data.reduce(
            (sum, value) => sum + value.item_value * value.item_quantity,
            0
          )
        );
      } else {
        //because when res is not ok then it store the past response the value so it not update the ui so make it empty
        //when not inventory found!
        setCategories([]);
        setLowStockItems([]);
        setValueOfItem(0);
      }
      return data;
    },
  });

  const [showInventoryForm, setshowInventoryForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [valueOfItem, setValueOfItem] = useState(0);
  const [transaction, setTransactions] = useState([]);
  const [past24Transactions, setPastTransaction] = useState(0);
  const [showInventoryCard, setshowInventorycard] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState({
    id: null,
    typeofUpdate: null,
    item_quantity: 0,
  });

  //delete inventory item
  const DeleteInventory = async (activity_id) => {
    const isConfirm = window.confirm(
      "Are you sure you want to delete this item? (Yes = OK, No = Cancel)"
    );
    if (isConfirm) {
      const res = await fetch(`/api/inventory/${activity_id}/delete`, {
        method: "delete",
      });
      const data = await res.json();
      if (res.ok) {
        await client.invalidateQueries(["fetchTransactionData"]);
        client.invalidateQueries(["fetchInventorydata"]);
        toast.success(data.msg);
      } else {
        toast.error(data.msg);
      }
    }
  };
  useMemo(() => {
    const past24Hours = new Date().getTime() - 1000 * 60 * 60 * 24;
    if (Inventories?.length > 0) {
      setPastTransaction(
        transaction?.filter((t) => {
          return new Date(t.Timestamp).getTime() > past24Hours;
        })?.length
      );
    } else {
      setPastTransaction(0);
    }
  }, [transaction, Inventories]);

  return (
    <>
      <div className=" p-4 min-h-screen pb-8 pt-24 px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px  w-full bg-green-50">
        <h2 className="text-3xl font-bold mb-6 ">Inventory Management</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700">
              Total Items
            </h3>
            <p className="text-2xl font-bold">{Inventories?.length || 0}</p>
            <p>Across {categories?.length || 0} categories</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700">
              Low Stock Items
            </h3>
            <p className="text-2xl font-bold">{lowStockItems.length || 0}</p>
            <p>Below minimum threshold</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700">
              Approximate Value of Inventory
            </h3>
            <p className="text-2xl font-bold">
              ₹ {valueOfItem.toLocaleString() || 0}
            </p>
            <p>Based on current stock</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700">
              Transactions
            </h3>
            <p className="text-2xl font-bold">{past24Transactions}</p>
            <p>In the last 24 Hours</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow mb-8">
          <div className="flex sm:justify-between gap-4 items-center mb-4 flex-wrap justify-center">
            <h2 className="text-xl font-bold">Inventory Items</h2>
            <div className="space-x-2">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => {
                  setshowInventoryForm(true);
                  document.body.style.overflow = "hidden";
                }}
              >
                Add New Item
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Item Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Unit</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Last Updated</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-4 py-2 text-blue-500">Loading...</td>
                  </tr>
                )}
                {!isLoading && !error && Inventories && Inventories.msg && (
                  <tr>
                    <td className="text-nowrap pl-3 font-semibold text-red-600">
                      Inventories Not Found!
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !error &&
                  Inventories.length &&
                  Inventories.map((inventory) => {
                    return (
                      <tr
                        className="border-t border-gray-200 hover:bg-gray-50"
                        key={inventory._id}
                      >
                        <td className="px-4 py-2">{inventory.item_name}</td>
                        <td className="px-4 py-2">{inventory.item_category}</td>
                        <td className="px-4 py-2">{inventory.item_quantity}</td>
                        <td className="px-4 py-2">{inventory.item_unit}</td>
                        {inventory.item_quantity < 5 ? (
                          <td className="px-4 py-2 text-red-600">low Stock</td>
                        ) : (
                          <td className="px-4 py-2 text-green-600">In Stock</td>
                        )}

                        <td className="px-4 py-2">
                          {new Date(inventory.Timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 flex gap-1 justify-center m-auto">
                          <button
                            className="px-2 py-1 bg-green-500 text-white rounded"
                            onClick={() => {
                              setShowUpdateForm({
                                id: inventory._id,
                                typeofUpdate: "add",
                                item_quantity: 0,
                              });
                            }}
                          >
                            Add
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={() => {
                              setShowUpdateForm({
                                id: inventory._id,
                                typeofUpdate: "reduce",
                                item_quantity: inventory.item_quantity,
                              });
                            }}
                          >
                            Reduce
                          </button>
                          <button
                            className="px-2 py-1 bg-gray-300 text-black rounded"
                            onClick={() => {
                              setshowInventorycard(inventory);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="px-2 py-1  rounded"
                            onClick={() => {
                              DeleteInventory(inventory._id);
                            }}
                          >
                            <MdDelete></MdDelete>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        {/* transaction part */}
        <Transactions setTransactions={setTransactions} />
      </div>

      {/*Inventory detail card */}
      {showInventoryCard && (
        <InventoryDetailCard
          item={showInventoryCard}
          setShowDetails={setshowInventorycard}
        />
      )}

      {/* inventory form */}
      {showInventoryForm && (
        <div className="fixed bg-black bg-opacity-20 inset-0 z-50  flex justify-center items-center px-2 sm:px-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-md shadow-md w-80 sm:min-w-96 flex flex-col"
          >
            <div className="flex justify-between mb-1">
              <h1 className="font-semibold text-xl">Add Item</h1>
              <IoMdClose
                className="text-xl font-bold hover:cursor-pointer"
                onClick={() => {
                  setshowInventoryForm(false);
                  document.body.style.overflow = "scroll";
                }}
              />
            </div>
            <div className="flex flex-col max-h-96 overflow-y-auto">
              <div className="flex flex-col mt-3">
                <label
                  htmlFor="item_type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Item Type
                </label>
                <select
                  name="item_category"
                  id="item_type"
                  className="p-2 rounded-md border-2"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.item_type}
                >
                  <option value="">Select the type of item</option>
                  {farmingInventoryCategories.map((category) => {
                    return (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    );
                  })}
                </select>
                {touched.item_category && errors.item_category && (
                  <p className="text-red-700 text-sm">{errors.item_type}</p>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <label
                  htmlFor="item_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Item Name
                </label>
                <input
                  id="item_name"
                  className="p-2 rounded-md border-2"
                  placeholder="Enter the item name"
                  type="text"
                  name="item_name"
                  value={values.item_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.item_name && errors.item_name && (
                  <p className="text-red-700 text-sm">{errors.item_name}</p>
                )}
              </div>

              <div className="flex flex-col mt-3">
                <label
                  htmlFor="item_quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Item Quantity
                </label>
                <input
                  id="item_quantity"
                  className="p-2 rounded-md border-2"
                  type="number"
                  placeholder="Enter the quantity (e.g., 50)"
                  name="item_quantity"
                  value={values.item_quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.item_quantity && errors.item_quantity && (
                  <p className="text-red-700 text-sm">{errors.item_quantity}</p>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <label
                  htmlFor="item_unit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Item Unit
                </label>
                <input
                  id="item_unit"
                  className="p-2 rounded-md border-2"
                  type="text"
                  placeholder="Enter the unit (e.g., kg, liters)"
                  name="item_unit"
                  value={values.item_unit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.item_unit && errors.item_unit && (
                  <p className="text-red-700 text-sm">{errors.item_unit}</p>
                )}
              </div>

              <div className="flex flex-col mt-3">
                <label
                  htmlFor="supplier_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Supplier Name
                </label>
                <input
                  id="supplier_name"
                  className="p-2 rounded-md border-2"
                  placeholder="Enter the supplier's name"
                  type="text"
                  name="supplier_name"
                  value={values.supplier_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.supplier_name && errors.supplier_name && (
                  <p className="text-red-700 text-sm">{errors.supplier_name}</p>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <label
                  htmlFor="item_value"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  item Valuation/cost
                </label>
                <input
                  id="item_value"
                  className="p-2 rounded-md border-2"
                  type="number"
                  placeholder="Enter item cost/valuation (e.g., 500 )"
                  name="item_value"
                  value={values.item_value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.item_value && errors.item_value && (
                  <p className="text-red-700 text-sm">{errors.item_value}</p>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <label
                  htmlFor="item_note"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Note
                </label>
                <textarea
                  id="note"
                  className="p-2 rounded-md border-2"
                  placeholder="Add details about the item or any special notes"
                  name="note"
                  value={values.note}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.note && errors.note && (
                  <p className="text-red-700 text-sm">{errors.note}</p>
                )}
              </div>
            </div>

            {isLoading ? (
              <LoadingButton />
            ) : (
              <button
                type="submit"
                className="bg-green-700 mt-4 text-white w-full px-4 py-2 rounded-md font-semibold flex justify-center"
              >
                Add Item
              </button>
            )}
          </form>
        </div>
      )}

      {/* Inventory Update Form */}
      {showUpdateForm.id != null && (
        <TransactionUpdate
          data={showUpdateForm}
          setShowUpdateForm={setShowUpdateForm}
        />
      )}
    </>
  );
}
export default InventoryManagement;
