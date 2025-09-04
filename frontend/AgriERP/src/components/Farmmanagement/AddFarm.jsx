import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { FarmSchema } from "../login/validate";
import { ToastContainer, toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "./LoadingButton";

function AddFarm() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: ["addfarm"],
    mutationFn: (data, resetForm) => {
      return fetch("/api/farmer/addFarm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: async (data) => {
      const d = await data.json();
      if (data.ok) {
        toast.success(d.msg);
        resetForm();
        new Promise((resolve, reject) => {
          setTimeout(() => {
            navigate("/farms");
          }, 2000);
        });
      } else {
        toast.error(d.msg);
      }
    },
  });

  const {
    handleChange,
    handleBlur,
    values,
    errors,
    handleSubmit,
    resetForm,
    touched,
  } = useFormik({
    initialValues: {
      farm_name: "",
      farm_size: "",
      measurement_unit: "",
      soil_type: "",
    },
    validationSchema: FarmSchema,
    onSubmit: async (data) => {
      mutation.mutate(data, resetForm);
    },
  });

  return (
    <>
      <div className="signup-form mt-8 min-h-dvh  px-2 md:px-10 lg:px-4 xl:px-28 2xl:62px w-full  flex justify-center items-center ">
        <form
          action=""
          className="border-2  rounded-md shadow-md p-4 sm:p-5 lg:p-8 lg:w-2/5 flex flex-col gap-3 sm:w-auto w-[96%]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl mt-2 font-bold text-green-700 text-center">
            Add Farm
          </h1>
          <div className="farm-name-field flex flex-col mt-3">
            <label
              htmlFor="farmname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Farm name
            </label>
            <input
              type="text"
              id="farmname"
              className="p-2 rounded-md border-2"
              placeholder="Enter your farm name"
              name="farm_name"
              value={values.farm_name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.farm_name && errors.farm_name && (
              <p className="text-red-700 text-sm ">{errors.farm_name}</p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="farm-name-field flex flex-col mt-3 flex-1">
              <label
                htmlFor="farmarea"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Area
              </label>
              <input
                type="number"
                id="farm_size"
                className="p-2 rounded-md border-2"
                placeholder="Enter the area of farm"
                name="farm_size"
                value={values.farm_size}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.farm_size && errors.farm_size && (
                <p className="text-red-700 text-sm ">{errors.farm_size}</p>
              )}
            </div>
            <div className="farm-name-field flex flex-col mt-3 flex-1">
              <label
                htmlFor="measurement_unit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit
              </label>
              <select
                name="measurement_unit"
                id=""
                className="p-2 rounded-md border-2"
                value={values.measurement_unit}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select unit</option>
                <option value="Guntha">Guntha</option>
                <option value="Bigha">Bigha</option>
                <option value="Acre">Acre</option>
                <option value="Hectare">Hectare</option>
                <option value="Square feet">Square feet</option>
                <option value="Square meter">Square meter</option>
              </select>
              {touched.measurement_unit && errors.measurement_unit && (
                <p className="text-red-700 text-sm ">
                  {errors.measurement_unit}
                </p>
              )}
            </div>
          </div>
          <div className="farm-name-field flex flex-col mt-3 flex-1">
            <label
              htmlFor="measurement_unit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Soil type
            </label>
            <select
              name="soil_type"
              id=""
              className="p-2 rounded-md border-2"
              value={values.soil_type}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select soil type</option>

              <option value="Black Soil">Black Soil (Regur Soil)</option>
              <option value="Sandy Soil">Sandy Soil</option>
              <option value="Loamy Soil">Loamy Soil</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Saline and Alkaline Soil">
                Saline and Alkaline Soil
              </option>
              <option value="Red Soil">Red Soil</option>
              <option value="Laterite Soil">Laterite Soil</option>
            </select>
            {touched.soil_type && errors.soil_type && (
              <p className="text-red-700 text-sm ">{errors.soil_type}</p>
            )}
          </div>

          {!mutation.error && !mutation.isLoading ? (
            <button
              type="submit"
              disabled={!mutation.error && mutation.isLoading}
              className="bg-green-700 mt-2 text-white px-4 py-2 rounded-md font-semibold flex justify-center"
            >
              Add Farm
            </button>
          ) : (
            <LoadingButton />
          )}
        </form>
      </div>
    </>
  );
}
export default AddFarm;
