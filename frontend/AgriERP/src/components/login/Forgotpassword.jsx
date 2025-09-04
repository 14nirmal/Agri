import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Forgotpassword() {
  const formik = useFormik({
    initialValues: {
      phone_number: "",
    },
    validationSchema: Yup.object({
      phone_number: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await fetch("/api/send-sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Reset link sent successfully!");
          resetForm();
        } else {
          toast.error(data.msg || "Failed to send SMS");
        }
      } catch (error) {
        toast.error("Something went wrong. Try again later.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="signup-form px-4 sm:px-10 lg:px-28 w-full h-full flex justify-center items-center mt-36 mb-36">
      <form
        onSubmit={formik.handleSubmit}
        className="border-2 rounded-md shadow-md p-6 lg:w-1/3 w-[96%] flex flex-col gap-4 bg-white"
      >
        <div className="h-12 flex justify-center">
          <img
            src="../src/assets/logo.png"
            alt="AgriERP Logo"
            className="h-full"
          />
        </div>

        <h1 className="text-2xl font-bold text-green-700 text-center">
          Reset Password
        </h1>

        <div className="flex flex-col">
          <label
            htmlFor="phone_number"
            className="text-sm font-medium text-gray-700"
          >
            Mobile Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="text"
            placeholder="Enter your registered mobile number"
            className="p-2 rounded-md border-2"
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone_number && formik.errors.phone_number ? (
            <span className="text-red-500 text-sm">
              {formik.errors.phone_number}
            </span>
          ) : null}
        </div>

        <button
          type="submit"
          className="bg-green-700 text-white py-2 rounded-md font-semibold"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-sm text-center text-gray-700">
          <Link to="/" className="text-green-600">
            Back to home
          </Link>
        </p>
      </form>

      {/* Toast message container */}
    </div>
  );
}

export default Forgotpassword;
