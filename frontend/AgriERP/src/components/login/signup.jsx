import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import signupSchema from "./validate";
import { ToastContainer, toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirmpassword: "",
      image_url: null,
      privacypolicy: false,
    },
    validationSchema: signupSchema,

    onSubmit: async (data) => {
      console.log(data);
      const formdata = new FormData();
      for (let key in data) {
        formdata.append(key, data[key]);
      }
      try {
        const res = await fetch("/api/farmer/signup", {
          method: "POST",
          body: formdata,
        });
        const jsonFormat = await res.json();
        res.status == 200
          ? toast.success(jsonFormat.msg)
          : toast.error(jsonFormat.msg);
        if (res.status == 200) {
          resetForm();
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, 2000);
          });
          navigate("/login");
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  return (
    <>
      <div className="signup-form px-2 md:px-10 lg:px-4 xl:px-28 2xl:62px w-full h-full flex justify-center items-center mt-32 mb-36">
        <form
          action=""
          className="border-2 rounded-md shadow-md p-4 sm:p-5 lg:p-8 lg:w-2/5 flex flex-col gap-4  sm:w-auto w-[96%]"
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
            <h1 className="text-2xl font-bold text-green-700 text-center">
              Create Your AgriERP Account
            </h1>
            <p className="text-md text-center text-sm">
              Join thousands of farmers managing their operations efficiently
            </p>
          </div>
          <div className="name-field flex flex-col mt-3">
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="first_name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.first_name}
              className="p-2 rounded-md border-2"
              placeholder="Enter your first name"
            />
            {touched.first_name && errors.first_name && (
              <p className="text-red-700 text-sm ">{errors.first_name}</p>
            )}
          </div>
          <div className="name-field flex flex-col">
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="last_name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.last_name}
              className="p-2 rounded-md border-2"
              placeholder="Enter your last name"
            />
            {touched.last_name && errors.last_name && (
              <p className="text-red-700 text-sm ">{errors.last_name}</p>
            )}
          </div>
          <div className="name-field flex flex-col">
            <label
              htmlFor="phonenumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="number"
              id="phonenumber"
              name="phone_number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone_number}
              className="p-2 rounded-md border-2"
              placeholder="Enter your Phone number"
            />
            {touched.phone_number && errors.phone_number && (
              <p className="text-red-700 text-sm ">{errors.phone_number}</p>
            )}
          </div>
          <div className="name-field flex flex-col">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              className="p-2 rounded-md border-2"
              placeholder="Enter your Phone number"
            />
            {touched.email && errors.email && (
              <p className="text-red-700 text-sm ">{errors.email}</p>
            )}
          </div>
          <div className="name-field flex flex-col">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              className="p-2 rounded-md border-2"
              placeholder="create your password"
            />
            {touched.password && errors.password && (
              <p className="text-red-700 text-sm ">{errors.password}</p>
            )}
          </div>
          <div className="name-field flex flex-col">
            <label
              htmlFor="confirmpassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="text"
              id="confirmpassword"
              name="confirmpassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmpassword}
              className="p-2 rounded-md border-2"
              placeholder="Confirm your password"
            />
            {touched.confirmpassword && errors.confirmpassword && (
              <p className="text-red-700 text-sm ">{errors.confirmpassword}</p>
            )}
          </div>
          <div className="name-field flex flex-col">
            <label
              htmlFor="img"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="img"
              name="image_url"
              accept="image/*"
              onChange={(e) => setFieldValue("image_url", e.target.files[0])}
              onBlur={handleBlur}
              // value={values.img_url}
              className="p-2 rounded-md border-2"
              placeholder="Confirm your password"
            />
            {touched.img_url && errors.img_url && (
              <p className="text-red-700 text-sm ">{errors.img_url}</p>
            )}
          </div>
          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="privacypolicy"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.privacypolicy}
                className={` ${
                  errors.privacypolicy && "border-red-700 border-2 p-7  "
                } h-3 w-3`}
              />
              <label className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <a href="/login" className="text-green-600  ">
                  Terms of Service
                </a>{" "}
                and
                <a href="/login" className="text-green-600  ">
                  Privacy Policy
                </a>{" "}
              </label>
            </div>
            {errors.privacypolicy && (
              <p className="text-red-700 text-sm ">{errors.privacypolicy}</p>
            )}
          </div>
          <button
            className="bg-green-700 mt-2 text-white px-4 py-2 rounded-md font-semibold"
            type="submit"
          >
            Create Account
          </button>
          <label className="ml-2 block text-sm text-gray-700 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600  ">
              Sign in here
            </Link>
          </label>
        </form>
      </div>
    </>
  );
}
export default Signup;
