import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { IoMdClose } from "react-icons/io";
import { MdDownload } from "react-icons/md";

// Styles
const styles = StyleSheet.create({
  page: { padding: 20, position: "relative" },
  cropName: { color: "green", fontSize: 20, marginBottom: 10 },
  section: { marginBottom: 5, fontSize: 12 },
  image: { marginTop: 10, width: "100%", height: 200 },
  downloadButton: {
    backgroundColor: "green",
    color: "white",
    padding: 10,
    textAlign: "center",
    borderRadius: 5,
    cursor: "pointer",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

// PDF Document Component
const CropPDF = ({ cropData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>Transaction Summary</Text>
      <Text style={styles.cropName}>{cropData.name}</Text>
      {Object.entries(cropData.details).map(([key, value]) => (
        <Text style={styles.section} key={key}>
          <Text style={{ fontWeight: "bold" }}>{key}:</Text> {value}
        </Text>
      ))}
      {cropData.image && <Image style={styles.image} src={cropData.image} />}
    </Page>
  </Document>
);

// Main Component
const DownloadCropPDF = ({ cropData }) => (
  <PDFDownloadLink
    document={<CropPDF cropData={cropData} />}
    fileName="crop-transaction-details.pdf"
  >
    {({ loading }) =>
      loading ? (
        "Loading Document..."
      ) : (
        <button className="bg-green-700 mt-2 text-white px-4 py-2 rounded-md font-semibold flex gap-2 items-center">
          <MdDownload className="text-xl" /> Download
        </button>
      )
    }
  </PDFDownloadLink>
);

// Detail Card Component
export default function DetailCard({ transaction, setshowDetails }) {
  const cropData = {
    name: transaction.crop_name,
    details: {
      "Transaction Type": transaction.transaction_type,
      "Income Type": transaction.income_type || "N/A",
      "Expense Type": transaction.expense_type || "N/A",
      Price: transaction.price
        ? `${transaction.price} / ${transaction.price_unit}`
        : "N/A",
      Weight: transaction.weight
        ? `${transaction.weight} ${transaction.weight_unit}`
        : "N/A",
      Amount: ` Rs ${transaction.amount.toLocaleString()}`,
      "Trader Name": transaction.trader_name || "N/A",
      "Scheme Name": transaction.scheme_name || "N/A",
      "Transaction Date": new Date(
        transaction.transaction_date
      ).toLocaleDateString(),
      Note: transaction.note || "N/A",
    },
    image: transaction.image_url
      ? `http://localhost:2000/${transaction.image_url.replace(/\\/g, "/")}`
      : null,
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 z-50 bg-black bg-opacity-25 py-8 px-2">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-h-full overflow-y-auto ">
        {/* Header Section */}
        <div className="border-b pb-2 mb-2 flex justify-between ">
          <h2 className="text-2xl font-bold text-green-700">
            {transaction.crop_name}
          </h2>
          <IoMdClose
            className="text-2xl cursor-pointer"
            onClick={() => {
              setshowDetails(false);
            }}
          />
        </div>

        {/* Transaction Details Section */}
        <div className="space-y-1 text-gray-700 border-b pb-2 mb-2">
          <p>
            <span className="font-semibold">Transaction Type:</span>{" "}
            {transaction.transaction_type}
          </p>
          <p>
            {transaction.transaction_type == "income" ? (
              <>
                <span className="font-semibold">Income Type:</span>{" "}
                {transaction.income_type}
              </>
            ) : (
              <>
                <span className="font-semibold">Expense Type:</span>{" "}
                {transaction.expense_type}
              </>
            )}
          </p>
        </div>

        {/* Pricing and Weight Section */}
        <div className="space-y-1 text-gray-700 border-b pb-2 mb-2">
          {transaction.transaction_type == "income" &&
            transaction.income_type == "sell" && (
              <>
                <p>
                  <span className="font-semibold">Price:</span>{" "}
                  {transaction.price} / {transaction.price_unit}
                </p>
                <p>
                  <span className="font-semibold">Weight:</span>{" "}
                  {transaction.weight} {transaction.weight_unit}
                </p>
              </>
            )}
          <p>
            <span className="font-semibold">Amount:</span> &#x20b9;
            {transaction.amount.toLocaleString()}
          </p>
        </div>

        {/* Trader and Date Section */}
        <div className="space-y-1 text-gray-700 border-b pb-2 mb-2">
          {transaction.transaction_type == "income" &&
          transaction.income_type == "sell" ? (
            <p>
              <span className="font-semibold">Trader Name:</span>{" "}
              {transaction.trader_name}
            </p>
          ) : (
            transaction.transaction_type == "subsidy" && (
              <p>
                <span className="font-semibold">Scheme Name:</span>{" "}
                {transaction.scheme_name}
              </p>
            )
          )}
          <p>
            <span className="font-semibold">Transaction Date:</span>{" "}
            {new Date(transaction.transaction_date).toLocaleDateString()}
          </p>
        </div>

        {/* Note Section */}
        <div className="space-y-1 text-gray-700 border-b pb-2 mb-2">
          <p>
            <span className="font-semibold">Note:</span> {transaction.note}
          </p>
        </div>

        {/* Image Section */}
        {transaction.image_url && (
          <>
            <p>
              <span className="font-semibold">Image:</span>
            </p>
            <div className="mt-4">
              <a
                href={`http://localhost:2000/${transaction.image_url.replace(
                  /\\/g,
                  "/"
                )}`}
                target="_blank"
              >
                <img
                  src={`http://localhost:2000/${transaction.image_url.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={transaction.transaction_type}
                  className="w-full rounded-lg"
                />
              </a>
            </div>
          </>
        )}

        {/* Download PDF Button */}
        <DownloadCropPDF cropData={cropData} />
      </div>
    </div>
  );
}
