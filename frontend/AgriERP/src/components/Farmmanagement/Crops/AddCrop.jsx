import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchfarmdata } from "../../../Store/slices/farmmanagemnetSlice";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useFormik } from "formik";
import { CropSchema } from "../../login/validate";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import LoadingButton from "../LoadingButton";
import { toast, ToastContainer } from "react-toastify";
import { isActive } from "../../../contextStore/contextstore";

const cropsInIndia = [
  "Aloe Vera",
  "Apple",
  "Arecanut",
  "Ashwagandha",
  "Bajra",
  "Banana",
  "Barley",
  "Betel Leaf",
  "Bitter Gourd",
  "Black Pepper",
  "Cabbage",
  "Cardamom",
  "Carrot",
  "Cashew",
  "Castor",
  "Chickpea",
  "Cinnamon",
  "Clove",
  "Coconut",
  "Coffee",
  "Coriander",
  "Cotton",
  "Eggplant",
  "Finger Millet",
  "Ginger",
  "Gram",
  "Grapes",
  "Groundnut",
  "Guava",
  "Holy Basil",
  "Jowar",
  "Jute",
  "Lemongrass",
  "Lentil",
  "Linseed",
  "Maize",
  "Mango",
  "Masoor",
  "Mustard",
  "Onion",
  "Orange",
  "Papaya",
  "Pigeon Pea",
  "Pineapple",
  "Pomegranate",
  "Potato",
  "Ragi",
  "Rice",
  "Sesame",
  "Soybean",
  "Spinach",
  "Sugarcane",
  "Sunflower",
  "Tea",
  "Tomato",
  "Tobacco",
  "Turmeric",
  "Urad",
  "Wheat",
];

function AddCrop() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const client = useQueryClient();
  const farmId = queryParams.get("id");
  const [cropList, setCropList] = useState(null);
  const dispatch = useDispatch();
  const { data: FarmData, isLoading } = useSelector((store) => store.FarmData);
  const isactive = isActive(farmId);
  const handelkeyUp = (e) => {
    const val = cropsInIndia.filter((crop) =>
      crop.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (val.length) {
      setCropList(val);
    } else {
      setCropList(null);
    }
  };

  useEffect(() => {
    dispatch(fetchfarmdata());
  }, []);
  const {
    values,
    setValues,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    errors,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      crop_name: "",
      crop_variety: "",
      crop_area: "",
      crop_measurement_unit: "",
      planting_date: "",
      farm_id: farmId ?? "",
    },
    validationSchema: CropSchema,
    onSubmit: (data) => {
      console.log(data);
      mutation.mutate(data);
    },
  });

  const mutation = useMutation({
    mutationKey: ["cropdata"],
    mutationFn: async (data) => {
      const res = await fetch("/api/farmer/farm/addCrop", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(data),
      });
      const d = await res.json();
      if (res.ok) {
        toast.success(d.msg);
        client.invalidateQueries(["fetchCropFinancials"]);
        client.invalidateQueries(["fetchCropFinancials"]);
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
            navigate(`/farms/crops?id=${farmId}`);
          }, 2000);
        });
      } else {
        toast.error(d.msg);
      }
    },
    onSuccess: (d) => {
      console.log(d);
    },
  });

  return (
    <>
      {/* A Form for adding a Crop */}
      <div className=" min-h-dvh mt-12 px-2 md:px-10 lg:px-4 xl:px-28 2xl:62px w-full  flex justify-center items-center ">
        <form
          action=""
          className="border-2  rounded-md shadow-md p-4 sm:p-5 lg:p-8 lg:w-2/5 flex flex-col gap-4 sm:w-auto w-[96%]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl mt-2 font-bold text-green-700 text-center">
            Add Crop
          </h1>
          <div className="crop-name-field flex flex-col relative">
            <label
              htmlFor="cropname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Crop name
            </label>
            <input
              type="text"
              id="cropname"
              className="p-2 rounded-md border-2 bg-white"
              placeholder="Crop name"
              name="crop_name"
              onKeyUp={handelkeyUp}
              value={values.crop_name}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {cropList && (
              <div className="w-full bg-white mt-1 absolute top-16 rounded-lg shadow-lg border-2 max-h-32 overflow-y-auto z-10 ">
                {cropList.map((c) => {
                  return (
                    <option
                      key={c}
                      value={c}
                      onClick={(e) => {
                        setFieldValue("crop_name", e.target.value);
                        setCropList(null);
                      }}
                      className="bg-blue-50 p-2 mt-[0.10rem]"
                    >
                      {c}
                    </option>
                  );
                })}
              </div>
            )}

            {touched.crop_name && errors.crop_name && (
              <p className="text-red-700 text-sm ">{errors.crop_name}</p>
            )}
          </div>

          <div
            className={`farm-name-field flex flex-col ${
              farmId !== null && "hidden"
            }`}
          >
            <label
              htmlFor="farmname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Farm name
            </label>
            <select
              name="farm_id"
              id="farmname"
              className="p-2 rounded-md border-2 bg-white"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={farmId !== null}
              value={farmId ?? values.farm_id}
            >
              <option value={""}>select a farm</option>
              {!isLoading &&
                FarmData?.farms?.map((farm) => {
                  return (
                    <option value={farm._id} key={farm._id}>
                      {farm.farm_name}
                    </option>
                  );
                })}
            </select>
            {touched.farm_id && errors.farm_id && (
              <p className="text-red-700 text-sm ">{errors.farm_id}</p>
            )}
          </div>

          <div className="crop-variety-field flex flex-col relative">
            <label
              htmlFor="cropvariety"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Crop Variety
            </label>
            <input
              id="cropvariety"
              className="p-2 rounded-md border-2 bg-white"
              placeholder="Crop variety"
              name="crop_variety"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.crop_variety}
            />

            {touched.crop_variety && errors.crop_variety && (
              <p className="text-red-700 text-sm ">{errors.crop_variety}</p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="crop-area-field flex flex-col flex-1">
              <label
                htmlFor="croparea"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Area
              </label>
              <input
                type="number"
                id="crop_area"
                className="p-2 rounded-md border-2"
                placeholder="Enter the area of crop"
                name="crop_area"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.crop_area}
              />
              {touched.crop_area && errors.crop_area && (
                <p className="text-red-700 text-sm ">{errors.crop_area}</p>
              )}
            </div>
            <div className="crop-measurement-field flex flex-col flex-1">
              <label
                htmlFor="crop_measurement_unit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit
              </label>
              <select
                name="crop_measurement_unit"
                id=""
                className="p-2 rounded-md border-2"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.crop_measurement_unit}
              >
                <option value="">Select unit</option>
                <option value="Guntha">Guntha</option>
                <option value="Bigha">Bigha</option>
                <option value="Acre">Acre</option>
                <option value="Hectare">Hectare</option>
                <option value="Square feet">Square feet</option>
                <option value="Square meter">Square meter</option>
              </select>
              {touched.crop_measurement_unit &&
                errors.crop_measurement_unit && (
                  <p className="text-red-700 text-sm ">
                    {errors.crop_measurement_unit}
                  </p>
                )}
            </div>
          </div>
          <div className="crop-palntdate-field flex flex-col flex-1">
            <label
              htmlFor="Planting_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Planting Date
            </label>
            <input
              type="date"
              id="planting_date"
              className="p-2 rounded-md border-2"
              placeholder="planting date"
              name="planting_date"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.planting_date}
            />
            {touched.planting_date && errors.planting_date && (
              <p className="text-red-700 text-sm ">{errors.planting_date}</p>
            )}
          </div>
          {mutation.isLoading && !mutation.isError ? (
            <LoadingButton />
          ) : (
            <button
              type="submit"
              disabled={!isactive}
              className={`bg-green-700 mt-2 text-white px-4 py-2 rounded-md font-semibold flex justify-center ${
                !isactive && "bg-opacity-35"
              }`}
            >
              {!isactive ? "Farm Is Disabled" : "Add Crop"}
            </button>
          )}
        </form>{" "}
      </div>
    </>
  );
}
export default AddCrop;
