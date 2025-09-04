import * as Yup from "yup";

const fileValidation = Yup.mixed()
  .nullable()
  .test(
    "imageValidation",
    "Image must be in PNG, JPEG, or JPG format",
    (value) => {
      const validExtensions = ["jpg", "png", "jpeg"];
      if (!value) return true;
      return validExtensions.includes(
        value.name.toLowerCase().split(".").pop()
      );
    }
  );

const phoneValidation = Yup.string()
  .length(10, "Phone number must be exactly 10 digits")
  .matches(/^[0-9]+$/, "Phone number must contain only digits")
  .required("Phone number is required");

let signupSchema = Yup.object({
  first_name: Yup.string()
    .min(3, "First name must be at least 3 characters")
    .max(10, "First name must not exceed 10 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(3, "Last name must be at least 3 characters")
    .max(10, "Last name must not exceed 10 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone_number: phoneValidation,
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must not exceed 12 characters")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  image_url: fileValidation,
  privacypolicy: Yup.bool().oneOf([true], "You must accept the privacy policy"),
});

export const loginSchema = Yup.object({
  phone_number: phoneValidation,
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must not exceed 12 characters")
    .required("Password is required"),
});

export const FarmSchema = Yup.object({
  farm_name: Yup.string()
    .min(3, "Farm name must be at least 3 characters")
    .max(10, "Farm name must not exceed 10 characters")
    .required("Farm name is required"),
  farm_size: Yup.number()
    .positive("Farm size must be a positive number")
    .required("Farm size is required"),
  measurement_unit: Yup.string().required("Measurement unit is required"),
  soil_type: Yup.string().required("Soil type is required"),
});

export const CropSchema = Yup.object({
  crop_name: Yup.string()
    .min(3, "Crop name must be at least 3 characters")
    .max(14, "Crop name must not exceed 14 characters")
    .required("Crop name is required"),
  crop_variety: Yup.string()
    .min(3, "Crop variety must be at least 3 characters")
    .max(14, "Crop variety must not exceed 14 characters")
    .required("Crop variety is required"),
  crop_area: Yup.number()
    .positive("Crop area must be a positive number")
    .required("Crop area is required"),
  crop_measurement_unit: Yup.string().required(
    "Crop measurement unit is required"
  ),
  planting_date: Yup.string().required("Planting date is required"),
  farm_id: Yup.string().required("Farm ID is required"),
});
export const CropUpdateSchema = Yup.object({
  crop_name: Yup.string()
    .min(3, "Crop name must be at least 3 characters")
    .max(14, "Crop name must not exceed 14 characters")
    .required("Crop name is required"),
  crop_variety: Yup.string()
    .min(3, "Crop variety must be at least 3 characters")
    .max(14, "Crop variety must not exceed 14 characters")
    .required("Crop variety is required"),
  crop_area: Yup.number()
    .positive("Crop area must be a positive number")
    .required("Crop area is required"),
  crop_measurement_unit: Yup.string().required(
    "Crop measurement unit is required"
  ),
  planting_date: Yup.string().required("Planting date is required"),
});

export const ActivitySchema = Yup.object({
  activity_type: Yup.string().required("Activity type is required"),
  activity_date: Yup.date()
    .min("2020-01-01", "Date cannot be before 2020")
    .max("2060-12-31", "Date cannot be after 2060")
    .required("Activity date is required"),
  activity_description: Yup.string()
    .min(6, "Description must be at least 6 characters")
    .max(50, "Description must not exceed 50 characters")
    .required("Activity description is required"),
  activity_status: Yup.string().required("Activity status is required"),
});

export const TransactionValidationScheam = Yup.object().shape({
  transaction_type: Yup.string().required("Transaction type is required"),
  note: Yup.string().required("Note is required"),
  transaction_date: Yup.date()
    .required("Transaction date is required")
    .max(new Date(), "Transaction date cannot be in the future"),
  amount: Yup.number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  expense_type: Yup.string().when("transaction_type", {
    is: "expense",
    then: (schema) => schema.required("Expense type is required"),
  }),
  income_type: Yup.string().when("transaction_type", {
    is: "income",
    then: (schema) => schema.required("Income type is required"),
  }),
  scheme_name: Yup.string().when("income_type", {
    is: "subsidy",
    then: (schema) => schema.required("Scheme name is required"),
  }),
  price_unit: Yup.string().when("income_type", {
    is: "sell",
    then: (schema) => schema.required("Price unit is required"),
  }),
  trader_name: Yup.string().when("income_type", {
    is: "sell",
    then: (schema) => schema.required("Trader name is required"),
  }),
  weight_unit: Yup.string().when("income_type", {
    is: "sell",
    then: (schema) => schema.required("Weight unit is required"),
  }),
  weight: Yup.number().when("income_type", {
    is: "sell",
    then: (schema) =>
      schema.positive("Weight must be positive").required("Weight is required"),
  }),
  price: Yup.number().when("income_type", {
    is: "sell",
    then: (schema) =>
      schema.positive("Price must be positive").required("Price is required"),
  }),
  image_url: fileValidation,
});

export default signupSchema;

export const inventorySchema = Yup.object().shape({
  item_name: Yup.string()
    .required("Item name is required")
    .max(100, "Item name cannot exceed 100 characters")
    .matches(
      /^[a-zA-Z0-9()\s-]+$/,
      "Item name can only contain letters, numbers, spaces, and hyphens"
    ),

  item_category: Yup.string().required("Item category is required"),

  item_quantity: Yup.number()
    .typeError("Item quantity must be a number")
    .required("Item quantity is required")
    .min(1, "Item quantity must be at least 1")
    .max(1000000, "Item quantity is too high"),

  item_unit: Yup.string()
    .required("Item unit is required")
    .min(2, "Item unit can at least 2 characters")
    .max(20, "Item unit cannot exceed 20 characters")
    .matches(/^[a-zA-Z\s]+$/, "Item unit can only contain letters and spaces"),

  item_value: Yup.number()
    .typeError("Item value must be a number")
    .required("Item value is required")
    .min(0, "Item value must be a positive number")
    .max(1000000, "Item value is too high"),

  note: Yup.string().max(500, "Note cannot exceed 500 characters").required(),

  supplier_name: Yup.string()
    .required("Supplier name is required")
    .min(3, "Supplier name can at least 3 characters")
    .max(100, "Supplier name cannot exceed 100 characters")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Supplier name can only contain letters and spaces"
    ),
});

export const atransactionSchema = Yup.object().shape({
  item_quantity: Yup.number()
    .typeError("Item quantity must be a number")
    .required("Item quantity is required")
    .min(1, "Item quantity must be at least 1")
    .max(1000000, "Item quantity is too high"),

  note: Yup.string().max(500, "Note cannot exceed 500 characters").required(),
  supplier_name: Yup.string()
    .min(3, "Supplier name must be at least 3 characters")
    .max(100, "Supplier name cannot exceed 100 characters")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Supplier name can only contain letters and spaces"
    )
    .required("Supplier name is required"),
});

export const rtransactionSchema = Yup.object().shape({
  item_quantity: Yup.number()
    .typeError("Item quantity must be a number")
    .required("Item quantity is required")
    .min(1, "Item quantity must be at least 1")
    .max(1000000, "Item quantity is too high"),

  note: Yup.string().max(500, "Note cannot exceed 500 characters").required(),

  used_for: Yup.string()
    .min(3, "Used for must be at least 3 characters")
    .max(100, "Used for cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s]+$/, "Used for can only contain letters and spaces")
    .required(),
});

export const AdminLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required!"),
});
//for backup
// import * as Yup from "yup";

// let signupSchema = Yup.object({
//   first_name: Yup.string().min(3).max(10).required(),
//   last_name: Yup.string().min(3).max(10).required(),
//   email: Yup.string().email().required(),
//   phone_number: Yup.string()
//     .min(10, "Invalid phone number")
//     .max(10, "Invalid phone number")
//     .required(),
//   password: Yup.string().min(6).max(12).required(),
//   confirmpassword: Yup.string()
//     .required()
//     .oneOf(
//       [Yup.ref("password")],
//       "confirm password must be match with password"
//     ),
//   image_url: Yup.mixed()
//     .nullable() // Makes the field optional (allows null or undefined)
//     .test(
//       "imageValidation",
//       "image must be in png jpeg or jpg format",
//       (value) => {
//         const validExtensions = ["jpg", "png", "jpeg"];
//         if (!value) {
//           return true;
//         }
//         return (
//           value &&
//           validExtensions.indexOf(value.name.toLowerCase().split(".").pop()) >
//             -1
//         );
//       }
//     ),
//   privacypolicy: Yup.mixed().test(
//     "acceptPolicy",
//     "accept privacy policy",
//     (value) => {
//       return value;
//     }
//   ),
// });

// export const loginSchema = Yup.object({
//   phone_number: Yup.string()
//     .min(10, "Invalid phone number")
//     .max(10, "Invalid phone number")
//     .required(),
//   password: Yup.string().min(6).max(12).required(),
// });

// export const FarmSchema = Yup.object({
//   farm_name: Yup.string().min(3).max(10).required(),
//   farm_size: Yup.number().positive().required(),
//   measurement_unit: Yup.string().required(),
//   soil_type: Yup.string().required(),
// });

// export const CropSchema = Yup.object({
//   crop_name: Yup.string().min(3).max(14).required(),
//   crop_variety: Yup.string().min(3).max(14).required(),
//   crop_area: Yup.number().positive().required(),
//   crop_measurement_unit: Yup.string().required(),
//   planting_date: Yup.string().required(),
//   farm_id: Yup.string().required(),
// });

// export const ActivitySchema = Yup.object({
//   activity_type: Yup.string().required(),
//   activity_date: Yup.date().min("01-01-2020").max("01-01-2060").required(),
//   activity_description: Yup.string().min(6).max(50).required(),
//   activity_status: Yup.string().required(),
// });

// export const TransactionValidationScheam = Yup.object().shape({
//   transaction_type: Yup.string().required(),
//   note: Yup.string().required(),
//   transaction_date: Yup.string().required(),
//   amount: Yup.number().positive().required(),
//   expense_type: Yup.string().when("transaction_type", {
//     is: "expense",
//     then: (scheme) => scheme.required(),
//     otherwise: (scheme) => scheme.notRequired(),
//   }),

//   income_type: Yup.string().when("transaction_type", {
//     is: "income",
//     then: (scheme) => scheme.required(),
//     otherwise: (scheme) => scheme.notRequired(),
//   }),
//   scheme_name: Yup.string().when("income_type", {
//     is: "subsidy",
//     then: (scheme) => scheme.required(),
//     otherwise: (scheme) => scheme.notRequired(),
//   }),
//   price_unit: Yup.string().when("income_type", {
//     is: "sell",
//     then: (scheme) => scheme.required(),
//     otherwise: (scheme) => scheme.notRequired(),
//   }),
//   trader_name: Yup.string().when("income_type", {
//     is: "sell",
//     then: (scheme) => scheme.required(),
//     otherwise: (scheme) => scheme.notRequired(),
//   }),
//   weight_unit: Yup.string().when("income_type", {
//     is: "sell",
//     then: (scheme) => scheme.required(),
//     otherwise: (scheme) => scheme.notRequired(),
//   }),
//   weight: Yup.number().when("income_type", {
//     is: "sell",
//     then: (scheme) => scheme.positive().required(),
//     otherwise: (scheme) => scheme.notRequired(),
//   }),
//   price: Yup.number().when("income_type", {
//     is: "sell",
//     then: (scheme) => scheme.positive().required(),
//     otherwise: (scheme) => scheme.notRequired(),
//   }),
//   image_url: Yup.mixed()
//     .nullable() // Makes the field optional (allows null or undefined)
//     .test(
//       "imageValidation",
//       "image must be in png jpeg or jpg format",
//       (value) => {
//         const validExtensions = ["jpg", "png", "jpeg"];
//         if (!value) {
//           return true;
//         }
//         return (
//           value &&
//           validExtensions.indexOf(value.name.toLowerCase().split(".").pop()) >
//             -1
//         );
//       }
//     ),
// });
