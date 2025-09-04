import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import TransactionCard from "./TransactionCard";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import { TransactionValidationScheam } from "../login/validate";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingButton from "../Farmmanagement/LoadingButton";
import { toast } from "react-toastify";
import { date } from "yup";
import TransactionNotFound from "./TransactionNotFound";
import { isAction } from "@reduxjs/toolkit";
import { isActive } from "../../contextStore/ContextStore";
import useCloseDropDown from "../../Hooks/useCloseDropDown";

const ExpenseType = [
  "Cultivation",
  "Seeds",
  "Sowing",
  "Seedling",
  "Compost",
  "Fertilizer",
  "Irrigation",
  "Weeding",
  "labour",
  "Fungi side",
  "Pestige Side",
  "Zatka Machine",
  "other",
];
function CropCard({ cropData }) {
  const { crop_id, crop_name } = cropData;
  const [showTransaction, setShowTransaction] = useState(null);
  const [transactionsType, settransactionType] = useState("All");
  const [transactionsData, setTransactionData] = useState([]);
  const query = useQueryClient();
  const { f_id } = useParams();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [openOptions, setOpenOptions] = useState(null);
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    setFieldValue,
    resetForm,
    touched,
    setValues,
  } = useFormik({
    initialValues: {
      transaction_type: "",
      expense_type: "",
      income_type: "",
      scheme_name: "",
      transaction_date: "",
      note: "",
      image_url: "",
      price: "",
      price_unit: "",
      weight: "",
      weight_unit: "",
      amount: "",
      trader_name: "",
    },
    validationSchema: TransactionValidationScheam,
    onSubmit: (data) => {
      const formdata = new FormData();
      for (let key in data) {
        formdata.append(key, data[key]);
      }
      formdata.append("crop_name", crop_name);

      mutation.mutate(formdata);
    },
  });

  const mutation = useMutation({
    mutationKey: ["addTransaction"],
    mutationFn: async (formData) => {
      formData.crop_id = crop_id;
      const res = await fetch(
        `/api/farmer/farm/${f_id}/${
          values.transaction_type == "income" ? "addIncome" : "addExpense"
        }/${crop_id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (res.ok) {
        const data = await res.json();
        query.invalidateQueries(["fetchCropFinancials"]);
        resetForm();
        setShowTransactionForm(false);
        toast.success(data.msg);
        document.body.style.overflow = "scroll";
      } else {
        const data = await res.json();
        toast.error(data.msg);
      }
    },
  });

  const {
    data: Transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetchCropFinancials", crop_id],
    queryFn: fetchDatabyCropId,
    refetchOnWindowFocus: false,
  });
  async function fetchDatabyCropId() {
    const res = await fetch(
      `/api/farmer/farm/viewfinancials?crop_id=${crop_id}`
    );
    const data = await res.json();
    if (res.ok) {
      return data;
    }
  }
  //merging incomes and expenses for display and sort by the date
  useEffect(() => {
    let transactions = [];

    if (Transactions != undefined) {
      if (transactionsType == "All") {
        transactions = [...Transactions.expenses, ...Transactions.incomes];
      }
      if (transactionsType == "Income") {
        transactions = [...Transactions.incomes];
      }
      if (transactionsType == "Expense") {
        transactions = [...Transactions.expenses];
      }
    }
    transactions.sort(
      (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
    );
    setTransactionData(transactions);
  }, [Transactions, transactionsType]);
  useEffect(() => {
    const totalAmount = convertor(
      values.price,
      values.price_unit,
      values.weight,
      values.weight_unit
    );

    setFieldValue("amount", totalAmount);
  }, [values.price, values.weight, values.price_unit, values.weight_unit]);

  const isactive = isActive(f_id);

  return (
    <>
      {/* crop wise financial data */}
      <div className="mt-4 sm:mt-5">
        <div
          className="border-2 rounded-xl shadow-lg min-h-24 p-4 "
          onClick={() => {
            setShowTransaction((prev) => (prev == crop_id ? null : crop_id));
          }}
        >
          <div className="flex justify-between items-center mb-3 sm:mb-0">
            <div className="sm:flex-1 sm:min-w-40">
              <h1 className="font-semibold text-lg sm:text-xl">{crop_name}</h1>
              <p className="text-sm sm:text-md text-gray-500">
                {Transactions?.incomes?.length + Transactions?.expenses?.length}{" "}
                Transactions
              </p>
            </div>

            <div>
              <div className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer transition-colors">
                {showTransaction ? (
                  <FaAngleDown className="text-xl sm:text-2xl" />
                ) : (
                  <FaAngleUp className="text-xl sm:text-2xl" />
                )}
              </div>
            </div>
          </div>

          <div className="w-full sm:flex-1 grid grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-3">
            <div className="flex flex-col justify-center items-center bg-gray-100 py-2 sm:py-3 px-2 sm:px-5 rounded-lg">
              <h1 className="text-base sm:text-lg font-semibold text-green-600 -mb-1 text-nowrap">
                &#8377; {Transactions?.total_income.toLocaleString()}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Income</p>
            </div>

            <div className="flex flex-col justify-center items-center bg-gray-100 py-2 sm:py-3 px-2 sm:px-5 rounded-lg">
              <h1 className="text-base sm:text-lg font-semibold text-red-600 -mb-1 text-nowrap">
                &#8377; {Transactions?.total_expense.toLocaleString()}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Expense</p>
            </div>

            <div className="flex flex-col justify-center items-center bg-gray-100 py-2 sm:py-3 px-2 sm:px-5 rounded-lg">
              <h1 className="text-base sm:text-lg font-semibold text-blue-600 -mb-1 text-nowrap">
                &#8377;{" "}
                {(
                  Transactions?.total_income - Transactions?.total_expense
                ).toLocaleString()}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Profit</p>
            </div>
          </div>
        </div>

        {/* display the transactions */}
        {showTransaction == crop_id && (
          <div className="w-full min-h-96 h-96 max-h-96  shadow-md -mt-1 bg-gray-100  rounded-md border-2 p-4">
            <div className="flex items-center  justify-between">
              <h1 className="font-semibold text-lg">Transactions</h1>
              <button
                className={`bg-green-700 shadow-lg text-white px-4 p-1  font-semibold rounded-md flex gap-2 items-center ${
                  !isactive && "bg-opacity-30"
                }`}
                onClick={() => {
                  setShowTransactionForm(true);
                  document.body.style.overflow = "hidden";
                }}
                disabled={!isactive}
              >
                <FiPlusCircle className="text-lg" />
                <p>Add </p>
              </button>
            </div>
            <div className="transaction-option flex gap-1 mt-4 flex-wrap">
              <button
                className={`bg-gray-500-700 border-2 px-4 p-1  font-semibold rounded-md flex gap-2 items-center ${
                  transactionsType == "All" && "bg-green-200 "
                }`}
                onClick={() => {
                  settransactionType("All");
                }}
              >
                All
              </button>
              <button
                className={`bg-gray-500-700 border-2  px-4 p-1  font-semibold rounded-md flex gap-2 items-center  ${
                  transactionsType == "Income" && "bg-green-200 "
                }`}
                onClick={() => {
                  settransactionType("Income");
                }}
              >
                Incomes
              </button>
              <button
                className={`bg-gray-500-700 border-2  px-4 p-1  font-semibold rounded-md flex gap-2 items-center ${
                  transactionsType == "Expense" && "bg-green-200 "
                }`}
                onClick={() => {
                  settransactionType("Expense");
                }}
              >
                Expenses
              </button>
              {/* <button className="bg-gray-500-700 border-2  px-4 p-1  font-semibold rounded-md flex gap-2 items-center">
                Sell
              </button>
              <button className="bg-gray-500-700 border-2  px-4 p-1  font-semibold rounded-md flex gap-2 items-center">
                Subsidy
              </button> */}
            </div>
            <div className="flex flex-col pb-2 gap-2 mt-2 h-64 custom-scrollbar overflow-y-auto">
              {transactionsData?.length == 0 && <TransactionNotFound />}
              {transactionsData?.map((transaction) => {
                console.log(transaction);
                return (
                  <TransactionCard
                    transaction={transaction}
                    setOpenOptions={setOpenOptions}
                    openOptions={openOptions}
                    key={transaction._id}
                  />
                );
              })}
            </div>
            {/* show the list of the transactions */}
            {/* {Transactions?.map((transactionData) => {
              return <TransactionCard transactionData={transactionData} />;
            })} */}
          </div>
        )}
      </div>

      {/* Transaction Form */}
      {showTransactionForm && (
        <div className="fixed bg-black bg-opacity-20 inset-0 z-50 flex justify-center items-center min-h-dvh overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-md shadow-md min-w-72 sm:min-w-96 flex flex-col"
            encType="multipart/form-data"
            method="POST"
          >
            <div className="flex justify-between mb-1">
              <h1 className="font-semibold text-xl ">Add Transaction</h1>
              <IoMdClose
                className="text-xl font-bold hover:cursor-pointer"
                onClick={() => {
                  setShowTransactionForm(false);
                  document.body.style.overflow = "scroll";
                }}
              />
            </div>
            {/* scrollbar for form */}
            <div
              className={`max-h-96 overflow-y-auto pr-3 thin-scrollbar flex flex-col gap-3`}
            >
              <div className="activity-field flex flex-col  ">
                <label
                  htmlFor="Transaction_type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Transaction type
                </label>
                <select
                  name="transaction_type"
                  id="transaction_type"
                  className="p-2 rounded-md border-2"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.transaction_type}
                >
                  <option value="">Select an transaction type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                {touched.transaction_type && errors.transaction_type && (
                  <p className="text-red-700 text-sm ">
                    {errors.transaction_type}
                  </p>
                )}
              </div>
              {/* expense part of the form */}
              {values.transaction_type == "expense" && (
                <>
                  <div className="expense_type_field flex flex-col ">
                    <label
                      htmlFor="expense_type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Expense type
                    </label>
                    <select
                      name="expense_type"
                      id="expense_type"
                      className="p-2 rounded-md border-2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.expense_type}
                    >
                      <option value="">Select an expense type</option>
                      {ExpenseType?.map((expense, index) => {
                        return (
                          <option
                            value={expense}
                            className="rounded-md"
                            key={index}
                          >
                            {expense}
                          </option>
                        );
                      })}
                    </select>
                    {touched.expense_type && errors.expense_type && (
                      <p className="text-red-700 text-sm ">
                        {errors.expense_type}
                      </p>
                    )}
                  </div>
                  <div className=" flex flex-col">
                    <label
                      htmlFor="expnese_amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Expense amount
                    </label>
                    <input
                      type="number"
                      id="expnese_amount"
                      className="p-2 rounded-md border-2"
                      name="amount"
                      placeholder="Enter expensed amount"
                      value={values.amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.amount && errors.amount && (
                      <p className="text-red-700 text-sm ">{errors.amount}</p>
                    )}
                  </div>
                </>
              )}

              {/* Income part of the Form */}
              {values.transaction_type == "income" && (
                <>
                  <div className="activity-field flex flex-col ">
                    <label
                      htmlFor="income_type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Income type
                    </label>
                    <select
                      name="income_type"
                      id="income_type"
                      className="p-2 rounded-md border-2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.income_type}
                    >
                      <option value="">Select an income type</option>
                      <option value="sell">Sell</option>
                      <option value="subsidy">Subsidy</option>
                    </select>
                    {touched.income_type && errors.income_type && (
                      <p className="text-red-700 text-sm ">
                        {errors.income_type}
                      </p>
                    )}
                  </div>

                  {/* Selling part of the form*/}
                  {values.income_type == "sell" && (
                    <>
                      <div className="flex gap-3 flex-wrap">
                        <div className="price flex flex-col  flex-1">
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Price
                          </label>
                          <input
                            type="number"
                            id="price"
                            className="p-2 rounded-md border-2"
                            placeholder="Enter the price"
                            name="price"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.price}
                          />
                          {touched.price && errors.price && (
                            <p className="text-red-700 text-sm ">
                              {errors.price}
                            </p>
                          )}
                        </div>
                        <div className="price_unit flex flex-col  flex-1">
                          <label
                            htmlFor="price_unit"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Price unit
                          </label>
                          <select
                            name="price_unit"
                            id=""
                            className="p-2 rounded-md border-2"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.price_unit}
                          >
                            <option value="">Select unit</option>
                            <option value="kg">Kg</option>
                            <option value="man">man(20kg)</option>
                            <option value="quintal">Quintal</option>
                            <option value="tone">tone</option>
                          </select>
                          {touched.price_unit && errors.price_unit && (
                            <p className="text-red-700 text-sm ">
                              {errors.price_unit}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <div className="price flex flex-col  flex-1">
                          <label
                            htmlFor="Weight"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Weight
                          </label>
                          <input
                            type="number"
                            id="Weight"
                            className="p-2 rounded-md border-2"
                            placeholder="Enter the weight"
                            name="weight"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.weight}
                          />
                          {touched.weight && errors.weight && (
                            <p className="text-red-700 text-sm ">
                              {errors.weight}
                            </p>
                          )}
                        </div>
                        <div className="weight_unit flex flex-col flex-1">
                          <label
                            htmlFor="weight_unit "
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Weight unit
                          </label>
                          <select
                            name="weight_unit"
                            id="weight_unit "
                            className="p-2 rounded-md border-2"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.weight_unit}
                          >
                            <option value="">select unit</option>
                            <option value="kg">Kg</option>
                            <option value="man">man(20kg)</option>
                            <option value="quintal">Quintal</option>
                            <option value="tone">tone</option>
                          </select>
                          {touched.weight_unit && errors.weight_unit && (
                            <p className="text-red-700 text-sm ">
                              {errors.weight_unit}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className=" flex flex-col">
                        <label
                          htmlFor="amount"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Total amount
                        </label>
                        <input
                          type="number"
                          id="amount"
                          className="p-2 rounded-md border-2"
                          name="amount"
                          placeholder="Enter received amount"
                          value={values.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.amount && errors.amount && (
                          <p className="text-red-700 text-sm ">
                            {errors.amount}
                          </p>
                        )}
                      </div>
                      <div className=" flex flex-col">
                        <label
                          htmlFor="trader_name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Trader name
                        </label>
                        <input
                          type="text"
                          id="trader_name"
                          className="p-2 rounded-md border-2"
                          name="trader_name"
                          placeholder="Enter the trader name"
                          value={values.trader_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.trader_name && errors.trader_name && (
                          <p className="text-red-700 text-sm ">
                            {errors.trader_name}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  {values.income_type == "subsidy" && (
                    <>
                      <div className=" flex flex-col ">
                        <label
                          htmlFor="amount"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Amount
                        </label>
                        <input
                          type="number"
                          id="amount"
                          className="p-2 rounded-md border-2"
                          name="amount"
                          placeholder="Enter the received amount"
                          value={values.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.amount && errors.amount && (
                          <p className="text-red-700 text-sm ">
                            {errors.amount}
                          </p>
                        )}
                      </div>
                      <div className=" flex flex-col">
                        <label
                          htmlFor="scheme_name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Scheme Name
                        </label>
                        <input
                          type="text"
                          id="scheme_name"
                          className="p-2 rounded-md border-2"
                          name="scheme_name"
                          placeholder="Enter the scheme name"
                          value={values.scheme_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.scheme_name && errors.scheme_name && (
                          <p className="text-red-700 text-sm ">
                            {errors.scheme_name}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* common part of the form */}
              <div className="transaction_date flex flex-col  flex-1">
                <label
                  htmlFor="transaction_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Transaction date
                </label>
                <input
                  type="date"
                  id="transaction_date"
                  className="p-2 rounded-md border-2"
                  placeholder="transaction date"
                  name="transaction_date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.transaction_date}
                />
                {touched.transaction_date && errors.transaction_date && (
                  <p className="text-red-700 text-sm ">
                    {errors.transaction_date}
                  </p>
                )}
              </div>
              <div className=" flex flex-col ">
                <label
                  htmlFor="activity_description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="activity_description"
                  className="p-2 rounded-md border-2"
                  placeholder="Details About transaction"
                  name="note"
                  value={values.note}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.note && errors.note && (
                  <p className="text-red-700 text-sm ">{errors.note}</p>
                )}
              </div>
              <div className=" flex flex-col">
                <label
                  htmlFor="img"
                  className="block text-sm font-medium text-gray-700 mb-1"
                ></label>
                <input
                  type="file"
                  id="img"
                  name="image_url"
                  accept="image/*"
                  onChange={(e) =>
                    setFieldValue("image_url", e.target.files[0])
                  }
                  onBlur={handleBlur}
                  className="p-2 rounded-md border-2"
                />
                {touched.image_url && errors.image_url && (
                  <p className="text-red-700 text-sm ">{errors.image_url}</p>
                )}
              </div>
            </div>
            {mutation.isLoading ? (
              <LoadingButton />
            ) : (
              <button
                type="submit"
                className="bg-green-700 mt-4 text-white w-full px-4 py-2 rounded-md font-semibold flex justify-center"
              >
                Add {values.transaction_type}
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}
export default CropCard;

const convertor = (price, punit, weight, wunit) => {
  let totalamount = 0;
  let pricebyKg = 0;
  let weightBykg = 0;
  const units = {
    kg: 1,
    man: 20,
    quintal: 100,
    tone: 1000,
  };
  if (
    punit == "kg" ||
    punit == "man" ||
    punit == "quintal" ||
    punit == "tone"
  ) {
    pricebyKg = price / (units[punit] * units["kg"]);
  }
  if (
    wunit == "kg" ||
    wunit == "man" ||
    wunit == "quintal" ||
    wunit == "tone"
  ) {
    weightBykg = units["kg"] * units[wunit] * weight;
  }
  totalamount = weightBykg * pricebyKg;
  return totalamount;
};
