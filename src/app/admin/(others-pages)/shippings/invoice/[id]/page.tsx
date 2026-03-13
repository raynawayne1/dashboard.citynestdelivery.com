"use client";

import React, { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import Barcode from "react-barcode";
import useGetShippingOrderById from "../../../../../../../hooks/useShippingOrder/useGetShippingOrderById";

// Fix TypeScript error for window.google
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export default function ShippingInvoice() {
  const params = useParams();
  const shippingId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : "";

  const { shippingOrder, isLoading, error } = useGetShippingOrderById(shippingId);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice_${shippingOrder?.id}`,
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          margin: 0;
        }
        #google_translate_element {
          display: none !important; /* Hide translate widget when printing */
        }
      }
    `,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (document.getElementById("google-translate-script")) return;

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            multilanguagePage: true,
          },
          "google_translate_element"
        );
      };
    }, 1500); // delay 1.5 seconds

    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading shipping order</p>;
  if (!shippingOrder) return <p>No order found</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen" style={{ fontSize: "12.5px" }}>
      {/* Google Translate Widget Bottom Left */}
      <div
        id="google_translate_element"
        className="fixed bottom-4 left-4 z-50 bg-white   rounded  p-2 flex items-center space-x-2"
        style={{ minHeight: "38px", minWidth: "160px" }}
      ></div>

      {/* Print Button */}
      <div className="mb-4 flex justify-end px-2 sm:px-0">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          Print
        </button>
      </div>

      {/* Invoice container */}
      <div
        ref={printRef}
        className="bg-white p-6 max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
        style={{ position: "relative", fontSize: "12.5px", lineHeight: 1.4 }}
      >
        {/* WATERMARK */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2"
          style={{
            opacity: 0.12,
            userSelect: "none",
            zIndex: 0,
            transform: "translate(-50%, -50%) rotate(-40deg)",
            width: 600,
            height: 600,
          }}
        >
          <img
            src="https://citynestdelivery.com/images/logo.png"
            alt="Quicknest Logistics"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
            }}
            className="select-none"
          />
        </div>

        {/* Invoice content */}
        <div className="relative z-10">
          {/* Logo and Barcode top */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <Image
                src="https://citynestdelivery.com/images/logo.png"
                alt="Quicknest Logistics"
                width={160}
                height={65}
                priority
              />
            </div>
            <div className="text-center">
              <Barcode
                value={shippingOrder.TrackingId as any}
                height={50}
                width={1}
                displayValue={false}
              />
              <p contentEditable={true} suppressContentEditableWarning={true} className="mt-2 font-semibold text-gray-700 text-sm">
                Tracking ID: {shippingOrder.TrackingId}
              </p>
            </div>
          </div>

          {/* Shipping Info & Company Info */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
            <div className="flex-1 p-4 rounded-lg ">
              <h3 contentEditable={true} suppressContentEditableWarning={true} className="text-base font-semibold border-b border-blue-500 pb-2 mb-4 text-blue-700">
                Shipping Info
              </h3>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Reference ID:</span>{" "}
                {shippingOrder.carrierReference ?? "N/A"}
              </p>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Shipment Mode:</span>{" "}
                {shippingOrder.shipmentMode}
              </p>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Payment Mode:</span>{" "}
                {shippingOrder.paymentMode}
              </p>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Destination:</span>{" "}
                {shippingOrder.destination}
              </p>
            </div>

            <div className="flex-1 p-4 rounded-lg  sm:text-right">
              <h3 contentEditable={true} suppressContentEditableWarning={true} className="text-base font-semibold border-b border-blue-500 pb-2 mb-4 text-blue-700">
                Orbit delivery
              </h3>
              <p contentEditable={true} suppressContentEditableWarning={true}>Bdg 553, Shoreham Road East, London Heathrow Hounslow, Middlesex TW6 </p>
              <p>United Kingdom - London</p>
              <p contentEditable={true} suppressContentEditableWarning={true}>Phone: +447511609107</p>
              <p contentEditable={true} suppressContentEditableWarning={true}>Email: citynestdelivery.com</p>
            </div>
          </div>

          {/* Sender & Receiver Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="rounded-md p-4  ">
              <h3 contentEditable={true} suppressContentEditableWarning={true} className="font-semibold text-base border-b border-gray-400 pb-2 mb-4">
                Sender Information
              </h3>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Name:</span> {shippingOrder.senderName}
              </p>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Phone:</span> {shippingOrder.senderPhone}
              </p>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Email:</span> {shippingOrder.senderEmail}
              </p>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Address:</span> {shippingOrder.senderAddres}
              </p>
            </div>

            <div className="rounded-md p-4 sm:text-right">
              <h3 contentEditable={true} suppressContentEditableWarning={true} className="font-semibold text-base border-b border-gray-400 pb-2 mb-4">
                Receiver Information
              </h3>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Name:</span> {shippingOrder.receiverName}
              </p>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Phone:</span> {shippingOrder.receiverPhone}
              </p>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Email:</span> {shippingOrder.receiverEmail}
              </p>
              <p contentEditable={true} suppressContentEditableWarning={true}>
                <span className="font-medium">Address:</span> {shippingOrder.receiverAddres}
              </p>
            </div>
          </div>

          {/* Shipment Details Table */}
          <div className="mb-8 overflow-x-auto">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">Shipment Details</h2>

            <table className="w-full border-collapse shadow-lg rounded-md overflow-hidden text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">Mode</th>
                  <th className="p-2 text-left">Quantity (kg)</th>
                  <th className="p-2 text-left">Total Freight</th>
                  <th className="p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2" contentEditable={true} suppressContentEditableWarning={true}>{shippingOrder.product}</td>
                  <td className="p-2" contentEditable={true} suppressContentEditableWarning={true}>{shippingOrder.mode}</td>
                  <td className="p-2" contentEditable={true} suppressContentEditableWarning={true}>{shippingOrder.quantity}</td>
                  <td className="p-2" contentEditable={true} suppressContentEditableWarning={true}>{shippingOrder.totalFreight ?? "40,00"}</td>
                  <td className="p-2" contentEditable={true} suppressContentEditableWarning={true}>{shippingOrder.description}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-semibold text-base">
                  <td colSpan={3} className="p-2 text-right">
                    Total Amount:
                  </td>
                  <td colSpan={2} className="p-2" contentEditable={true} suppressContentEditableWarning={true} >
                    $40,00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Notes */}
          <div className="space-y-2 text-gray-600 text-xs max-w-3xl">
            <p>
              We would encourage that payment is done once the package has been
              received at our facility.
            </p>
            <p>
              Failure to follow this requirement might result in an extra charge
              from the administration for STORE KEEPING and SECURITY before clearance!!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
