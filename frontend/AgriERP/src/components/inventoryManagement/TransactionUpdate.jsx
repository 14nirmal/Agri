import { useFormik } from "formik";
import { IoMdClock, IoMdClose } from "react-icons/io";
import { atransactionSchema, rtransactionSchema } from "../login/validate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import LoadingButton from "../Farmmanagement/LoadingButton";

function TransactionUpdate({ data, setShowUpdateForm }) {
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
      item_quantity: "",
      supplier_name: "",
      note: "",
      used_for: "",
      transaction_type: data.typeofUpdate,
    },
    onSubmit: (data) => {
      console.log(data);
      Mutation.mutate(data);
      document.body.style.overflow = "scroll";
    },
    validationSchema:
      data.typeofUpdate == "add" ? atransactionSchema : rtransactionSchema,
  });

  const Mutation = useMutation({
    mutationKey: ["updateItem"],
    mutationFn: async (d) => {
      const response = await fetch(`/api/inventory/${data.id}/update`, {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify(d),
      });
      const res = await response.json();
      if (response.ok) {
        toast.success(res.msg);
        client.invalidateQueries(["fetchInventorydata"]);
        client.invalidateQueries(["fetchTransactionData"]);

        resetForm();
        setShowUpdateForm({
          id: null,
          typeofUpdate: null,
          item_quantity: null,
        });
      } else {
        toast.error(res.msg);
      }
    },
  });

  return (
    <>
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
                setShowUpdateForm({ id: null, typeofUpdate: null });
                document.body.style.overflow = "scroll";
              }}
            />
          </div>
          <div className="flex flex-col max-h-96 overflow-y-auto">
            <div className="flex flex-col mt-3">
              <label
                htmlFor="item_quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Item quantity
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

              {data.typeofUpdate == "reduce" &&
                touched.item_quantity &&
                values.item_quantity > data.item_quantity && (
                  <p className="text-red-700 text-sm">
                    Invalid quantity. Available stock: {data.item_quantity}.
                  </p>
                )}
            </div>

            <div className="flex flex-col mt-3">
              {data.typeofUpdate == "add" ? (
                <>
                  <label
                    htmlFor="supplier_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Supplier Name
                  </label>
                  <input
                    id="suplier_name"
                    className="p-2 rounded-md border-2"
                    placeholder="Enter the supplier's name"
                    type="text"
                    name="supplier_name"
                    value={values.supplier_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.supplier_name && errors.supplier_name && (
                    <p className="text-red-700 text-sm">
                      {errors.suplier_name}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <label
                    htmlFor="used_for"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Used for
                  </label>
                  <input
                    id="used_for"
                    className="p-2 rounded-md border-2"
                    placeholder="Where to use Item"
                    type="text"
                    name="used_for"
                    value={values.used_for}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.used_for && errors.used_for && (
                    <p className="text-red-700 text-sm">{errors.used_for}</p>
                  )}
                </>
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
          {Mutation.isLoading ? (
            <LoadingButton />
          ) : (
            <button
              type="submit"
              className="bg-green-700 mt-4 text-white w-full px-4 py-2 rounded-md font-semibold flex justify-center"
            >
              {data.typeofUpdate == "add" ? "Add" : "Reduce"}
            </button>
          )}
        </form>
      </div>
    </>
  );
}
export default TransactionUpdate;
