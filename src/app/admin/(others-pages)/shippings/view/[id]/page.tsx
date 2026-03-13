"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useGetShippingOrderById from "../../../../../../../hooks/useShippingOrder/useGetShippingOrderById";
import Image from "next/image";
import DeleteConfirmationModal from "@/components/modals/ConfirmDeleteOrder/ConfirmDeleteOrder";
import useDeleteDropLocation from "../../../../../../../hooks/useAddDropLocation/useDeleteDropLocation";
import useDeleteShippingOrder from "../../../../../../../hooks/useShippingOrder/useDeleteShippingOrder";

function formatStatus(status:string) {
  let backgroundColor = "";
  let color = "";

  switch (status) {
    case "Pending":
      backgroundColor = "#808080"; // Darker gray
      color = "white";
      break;
    case "Picked up":
      backgroundColor = "#0000b3"; // Darker blue
      color = "white";
      break;
    case "On Hold":
      backgroundColor = "#cc6600"; // Darker orange
      color = "white";
      break;
    case "Out for delivery":
      backgroundColor = "#e0b800"; // Darker yellow
      color = "black";
      break;
    case "In Transit":
      backgroundColor = "#3399cc"; // Darker light blue
      color = "black";
      break;
    case "Enroute":
      backgroundColor = "#006400"; // Darker green
      color = "white";
      break;
    case "Cancelled":
      backgroundColor = "#b30000"; // Darker red
      color = "white";
      break;
    case "Delivered":
      backgroundColor = "#006400"; // Darker green (same as Enroute)
      color = "white";
      break;
    case "Returned":
      backgroundColor = "#800080"; // Darker purple
      color = "white";
      break;
    case "Landed":
      backgroundColor = "#66cc66"; // Darker light green
      color = "black";
      break;
    case "Registered":
      backgroundColor = "#d3d3d3"; // Darker light gray
      color = "black";
      break;
    default:
      backgroundColor = "#808080"; // Default dark gray
      color = "white";
      break;
  }

  return {
    backgroundColor,
    color,
    padding: "2px 10px",
    display: "inline-block",
    marginTop: "4px",
    borderRadius: "0.375rem",
    fontWeight: "600",
  };
}




function ShippingOrderPage() {
    const params = useParams();
    const router = useRouter();

    const shippingId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

    const { shippingOrder, isLoading, error } = useGetShippingOrderById(shippingId || "");

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteShipingOrder, setIsOpenDeleteShipingOrder] = useState(false);
    const [dropIndexToDelete, setDropIndexToDelete] = useState<number | null>(null);
    const [dropLocationName, setDropLocationName] = useState<string | null>(null);

    const { handleDeleteShippingOrder, isDeletingShippingOrder } = useDeleteShippingOrder();

    const {
        isDeleting,
        error: deleteError,
        handleDeleteDropLocation,
    } = useDeleteDropLocation(shippingId || "", dropIndexToDelete === null ? undefined : dropIndexToDelete);

    function openModal(index: number) {
        setDropIndexToDelete(index);
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setDropIndexToDelete(null);
    }



    //  opening of delete shipping order  modal
    function closeDeleteShippingModal() {
        setIsOpenDeleteShipingOrder(false);
    }


    function openDeleteShippingModal() {
        setIsOpenDeleteShipingOrder(true);
    }


    async function confirmDeleteDeleteShippingOrder() {
        if (shippingId === null) return;

        await handleDeleteShippingOrder(shippingId || "");
        router.push(`/admin/shippings`);
        closeDeleteShippingModal();
    }


    async function confirmDelete() {
        if (dropIndexToDelete === null) return;

        const success = await handleDeleteDropLocation();
        if (success) {
            closeModal();
            router.refresh();
        }
    }

    if (!shippingId) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 font-semibold text-lg">Invalid Shipping Order ID</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-medium animate-pulse">Loading Shipping Order...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 font-semibold text-lg">{error}</p>
            </div>
        );
    }

    if (!shippingOrder) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">No shipping order found.</p>
            </div>
        );
    }

    const formattedOrder = {
        ...shippingOrder,
        senderAddress: shippingOrder.senderAddres || "-",
        receiverAddress: shippingOrder.receiverAddres || "-",
        trackingId: shippingOrder.TrackingId || "-",
    };


    const handleInvoiceClick = (shippingId: string | undefined) => {
        if (shippingId) {
            router.push(`/admin/shippings/invoice/${shippingId}`);
        }
    };

    

    const handleEditShipping = (shippingId: string) => {
        router.push(`/admin/shippings/edit/${shippingId}`);
    };

    const handleAddDropLocation = (shippingId: string) => {
        router.push(`/admin/shippings/view/add-drop-locaton/${shippingId}`);
    };

    const handleEditDropLocation = (index: number) => {
        router.push(
            `/admin/shippings/view/edit-drop-location/${shippingId}?dropLocationIndex=${index}`
        );
    };

    return (
        <div className="max-w-6xl mx-auto sm:p-8 bg-white rounded-xl shadow-xl my-12">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
                Shipping Order Details
            </h1>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-14 px-4 sm:px-0">
                <button
                    onClick={() => handleInvoiceClick(shippingOrder.id as string)}
                    className="w-full sm:w-32 px-4 py-2 rounded-full bg-indigo-500 text-white text-sm font-medium shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200"
                >
                    Invoice
                </button>

                <button
                    onClick={() => handleEditShipping(shippingOrder.id as string)}
                    className="w-full sm:w-32 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-medium shadow-md hover:bg-amber-600 hover:shadow-lg transition-all duration-200"
                >
                    Edit
                </button>

                <button
                    onClick={() => openDeleteShippingModal()}
                    className="w-full sm:w-32 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200"
                >
                    Delete
                </button>

                <button
                    onClick={() => handleAddDropLocation(shippingOrder.id as string)}
                    className="w-full sm:w-40 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-200"
                >
                    Add Drop Location
                </button>
            </div>




            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sender Info */}
                    <section className="bg-white rounded-lg shadow-md border border-gray-200 p-2 sm:p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">Sender Information</h3>
                        <dl className="space-y-4">
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-600">Name</dt>
                                <dd className="text-gray-900">{formattedOrder.senderName}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-600">Phone</dt>
                                <dd className="text-gray-900">{formattedOrder.senderPhone}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-600">Email</dt>
                                <dd className="text-gray-900">{formattedOrder.senderEmail}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-600">Address</dt>
                                <dd className="text-gray-900">{formattedOrder.senderAddress}</dd>
                            </div>
                        </dl>
                    </section>

                    {/* Receiver Info */}
                    <section className="bg-white rounded-lg shadow-md border border-gray-200 p-2 sm:p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">Receiver Information</h3>
                        <dl className="space-y-4">
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-600">Name</dt>
                                <dd className="text-gray-900">{formattedOrder.receiverName}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-600">Phone</dt>
                                <dd className="text-gray-900">{formattedOrder.receiverPhone}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-600">Email</dt>
                                <dd className="text-gray-900">{formattedOrder.receiverEmail}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-600">Address</dt>
                                <dd className="text-gray-900">{formattedOrder.receiverAddress}</dd>
                            </div>
                        </dl>
                    </section>

                    {/* Shipment Details */}
                    <section className="bg-white rounded-lg shadow-md border border-gray-200 p-2 sm:p-6 lg:col-span-2">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">Shipment Details</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <FieldPair label="Description" value={formattedOrder.description} />
                            <FieldPair label="Payment Mode" value={formattedOrder.paymentMode} />
                            <FieldPair label="Shipment Mode" value={formattedOrder.shipmentMode} />
                            <FieldPair label="Weight" value={formattedOrder.weight} />
                            <FieldPair label="Carrier Reference" value={formattedOrder.carrierReference || "-"} />
                            <FieldPair label="Tracking ID" value={formattedOrder.trackingId} />
                            <FieldPair label="Destination" value={formattedOrder.destination} />
                            <FieldPair label="Delivery Date" value={formattedOrder.deliveryDate} />
                            <FieldPair label="Pickup Time" value={formattedOrder.pickUpTime} />
                            <FieldPair label="Departure Time" value={formattedOrder.departureTime} />
                            <FieldPair label="Courier Name" value={formattedOrder.courierName} />
                            <FieldPair label="Total Freight" value={formattedOrder.totalFreight} />
                            <FieldPair label="Product" value={formattedOrder.product} />
                            <FieldPair label="Mode" value={formattedOrder.mode} />
                            <FieldPair label="Origin" value={formattedOrder.origin} />
                            <FieldPair label="Quantity" value={formattedOrder.quantity} />
                        </dl>
                    </section>
                </div>

                {/* Metadata */}
                <section className="bg-white rounded-lg shadow-md border border-gray-200 p-6 my-7">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">Metadata</h3>
                    <dl className="space-y-4">
                        <FieldPair
                            label="Created At"
                            value={
                                formattedOrder.created_At
                                    ? new Date(formattedOrder.created_At).toLocaleString()
                                    : "-"
                            }
                        />
                        <FieldPair
                            label="Updated At"
                            value={
                                formattedOrder.updated_At
                                    ? new Date(formattedOrder.updated_At).toLocaleString()
                                    : "-"
                            }
                        />
                        <FieldPair label="Order ID" value={formattedOrder.id || "-"} />
                    </dl>
                </section>
            </div>




            {/* Parcel Images */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 max-w-7xl mx-auto p-2 sm:p-6 my-7">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">Parcel Images</h3>
                {Array.isArray(formattedOrder.imageParcelImages) && formattedOrder.imageParcelImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {formattedOrder.imageParcelImages.map((imgSrc, idx) => (
                            <div
                                key={idx}
                                className="relative w-full h-30 rounded-md overflow-hidden shadow-md border border-gray-300"
                            >
                                <Image
                                    src={imgSrc as any}
                                    alt={`Parcel image ${idx + 1}`}
                                    fill
                                    style={{ objectFit: "contain" }}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority={idx === 0}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No images available.</p>
                )}
            </section>

            {/* Drop Locations */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">Drop Locations</h3>
                {Array.isArray(shippingOrder.shippingDrops) && shippingOrder.shippingDrops.length > 0 ? (
                    shippingOrder.shippingDrops.map((drop, index) => (
                        <div
                            key={index}
                            className="relative border-l-2 border-gray-400 pl-8 mb-10 pb-6"
                        >
                            <div
                                className="absolute -left-4 top-0 flex items-center justify-center rounded-full bg-gray-700 text-white w-7 h-7 font-semibold select-none shadow"
                                aria-label={`Drop location ${index + 1}`}
                            >
                                {index + 1}
                            </div>

                            <div className="space-y-1 text-gray-900">
                                <div>
                                    <span className="font-semibold inline-block pr-1">Country:</span> {drop.country || "-"}
                                </div>
                                <div>
                                    <span className="font-semibold inline-block pr-1">State:</span> {drop.state || "-"}
                                </div>
                                <div>
                                    <span className="font-semibold inline-block pr-1">City:</span> {drop.city || "-"}
                                </div>
                                <div>
                                    <span className="font-semibold inline-block pr-1 align-top">Address:</span> {drop.address || "-"}
                                </div>
                                <div>
                                    <span className="font-semibold inline-block pr-1">Zip Code:</span> {drop.zipCode || "-"}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="font-semibold inline-block pr-1">Status:</span>
                                    <span style={formatStatus(drop.status)}>
                                        {drop.status || "-"}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold inline-block pr-1 align-top">Remarks:</span> {drop.remarks || "-"}
                                </div>
                            </div>

                            <div className="flex gap-4 mt-5">
                                <button
                                    onClick={() => handleEditDropLocation(index)}
                                    className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition w-24"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        openModal(index);
                                        setDropLocationName(drop.country);
                                    }}
                                    className="px-4 py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition w-24"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No drop locations added.</p>
                )}
            </section>



            {/* Delete confirmation modal */}
            <DeleteConfirmationModal
                itemName={
                    dropIndexToDelete !== null ? `Drop location #${dropLocationName}` : "Drop location"
                }
                isLoading={isDeleting}
                onDelete={confirmDelete}
                isOpen={isOpen}
                openModal={() => setIsOpen(true)}
                closeModal={closeModal}
            />


            {/* Delete confirmation modal */}
            <DeleteConfirmationModal
                itemName={shippingOrder.receiverName}
                isLoading={isDeletingShippingOrder}
                onDelete={confirmDeleteDeleteShippingOrder}
                isOpen={isOpenDeleteShipingOrder}
                openModal={() => setIsOpenDeleteShipingOrder(true)}
                closeModal={closeDeleteShippingModal}
            />

            {/* Show delete error if any */}
            {deleteError && (
                <p className="text-red-600 font-semibold text-center mt-4">
                    {deleteError}
                </p>
            )}
        </div>
    );
}

interface FieldPairProps {
    label: string;
    value: string | number | null | undefined;
}
function FieldPair({ label, value }: FieldPairProps) {
    return (
        <div className="flex justify-between border-b border-gray-200 py-2">
            <dt className="font-medium text-gray-600">{label}</dt>
            <dd className="text-gray-900">{value ?? "-"}</dd>
        </div>
    );
}






export default ShippingOrderPage;
