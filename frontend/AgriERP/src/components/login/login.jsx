import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "./validate";
import { ToastContainer, toast } from "react-toastify";
import useUserAuthorization from "../../Authorization/UserAuthorization";

function Login() {
  const navigate = useNavigate();
  const { isloginUser } = useUserAuthorization();
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
      phone_number: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (data) => {
      const res = await fetch("/api/farmer/login", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      res.status == 200 ? toast.success(resData.msg) : toast.error(resData.msg);
      if (res.status == 200) {
        resetForm();

        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        await isloginUser();
        navigate("/");
      }
    },
  });

  return (
    <>
      <div className="signup-form  px-2 md:px-10 lg:px-4 xl:px-28 2xl:62px w-full h-full flex justify-center items-center mt-36 mb-36">
        <form
          action=""
          className="border-2  rounded-md shadow-md p-4 sm:p-5 lg:p-8 lg:w-2/5 flex flex-col gap-3 sm:w-auto w-[96%]"
          onSubmit={handleSubmit}
        >
          <div className="h-12 flex justify-center -mb-4 ">
            <img
              src="../src/assets/logo.png"
              alt=""
              srcSet=""
              className=" h-full"
            />
          </div>
          <div>
            <h1 className="text-2xl mt-2 font-bold text-green-700 text-center">
              Login to AgriERP
            </h1>
            <p className="text-md text-center text-sm">
              Manage your farm operations with ease by logging into your account
            </p>
          </div>
          <div className="name-field flex flex-col mt-3">
            <label
              htmlFor="mobilenumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mobile Number
            </label>
            <input
              type="number"
              id="mobilenumber"
              className="p-2 rounded-md border-2"
              placeholder="Enter registered mobile number"
              name="phone_number"
              value={values.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.phone_number && errors.phone_number && (
              <p className="text-red-700 text-sm ">{errors.phone_number}</p>
            )}
          </div>
          <div className="name-field flex flex-col ">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              className="p-2 rounded-md border-2"
              placeholder="Enter Your password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <p className="text-red-700 text-sm ">{errors.password}</p>
            )}
          </div>
          <label className="ml-2 block text-sm text-gray-700">
            <Link to="/forgotpassword" className="text-green-600  ">
              Forgot password?
            </Link>{" "}
          </label>
          <button
            type="submit"
            className="bg-green-700 mt-2 text-white px-4 py-2 rounded-md font-semibold"
          >
            Log in
          </button>
          <label className="ml-2 block text-sm text-gray-700 text-center                ">
            Already not have an account?{" "}
            <Link to="/signup" className="text-green-600  ">
              Create an account here
            </Link>
          </label>
        </form>
      </div>
    </>
  );
}
export default Login;
