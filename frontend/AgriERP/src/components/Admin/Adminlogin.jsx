import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { AdminLoginSchema, loginSchema } from "../login/validate";
import { ToastContainer, toast } from "react-toastify";
import useUserAuthorization from "../../Authorization/UserAuthorization";

function AdminLogin() {
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
      email: "",
      password: "",
    },
    validationSchema: AdminLoginSchema,
    onSubmit: async (data) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      res.status == 200 ? toast.success(resData.msg) : toast.error(resData.msg);
      if (res.ok) {
        resetForm();

        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 2300);
        });
        navigate("/admin/dashboard");
      }
    },
  });

  return (
    <>
      <div className="signup-form  px-2 md:px-10 lg:px-4 xl:px-28 2xl:62px w-full h-full flex justify-center items-center mt-36 mb-36">
        <form
          action=""
          className="border-2  rounded-md mt-7 max-w-[26rem] shadow-md p-4 sm:p-5 lg:p-8 lg:w-2/5 flex flex-col gap-3 sm:w-auto w-[96%]"
          onSubmit={handleSubmit}
        >
          {/* <div className="h-12 flex justify-center -mb-4 ">
            <img
              src="../src/assets/logo.png"
              alt=""
              srcSet=""
              className=" h-full"
            />
          </div> */}
          <div>
            <h1 className="text-2xl mt-2 font-bold text-green-700 text-center">
              Admin Login
            </h1>
          </div>
          <div className="name-field flex flex-col mt-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="p-2 rounded-md border-2"
              placeholder="Enter registered email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <p className="text-red-700 text-sm ">{errors.email}</p>
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

          <button
            type="submit"
            className="bg-green-700 mt-2 text-white px-4 py-2 rounded-md font-semibold"
          >
            Log in
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
export default AdminLogin;
