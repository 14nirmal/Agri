import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function ResetPass() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams(); // Get token from URL

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirm: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      setError("");

      try {
        const response = await fetch("/api/resetPass", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Something went wrong");
        }
        setSuccess(true);
        toast.success(data.msg);
      } catch (err) {
        toast.error(err.message);
        setError(err.message);
      }
    },
  });

  return (
    <div className="h-dvh w-dvh bg-blue-50 flex justify-center items-center">
      {!success ? (
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4"
        >
          <h2 className="text-xl font-semibold text-center text-blue-700">
            Reset Your Password
          </h2>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              name="password"
              className="w-full mt-1 p-2 border rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              className="w-full mt-1 p-2 border rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirm}
            />
            {formik.touched.confirm && formik.errors.confirm && (
              <p className="text-red-500 text-sm">{formik.errors.confirm}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      ) : (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-600">
            Password Reset Successfully!
          </h2>
          <p className="mt-2 text-gray-700">
            You can now log in with your new password.
          </p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default ResetPass;
