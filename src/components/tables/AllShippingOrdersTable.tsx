import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import { useRouter } from "next/navigation";
import PageLoader from "@/components/Spinner/PageLoader";
import useDeleteOrder from "../../../hooks/useOrder/useDeleteOrder";
import DeleteConfirmationModal from "../modals/ConfirmDeleteOrder/ConfirmDeleteOrder";
import { IShippingPayload } from "../Interface";
import useDeleteShippingOrder from "../../../hooks/useShippingOrder/useDeleteShippingOrder";
import formatFullDateTimeWithAMPM from "../lib/helpers/formatFullDateTimeWithAMPM/formatFullDateTimeWithAMPM";



export default function AllShippingOrdersTable({
    shippingOrders = [],
    isLoadingOrders,
    errorMessage
}: {
    shippingOrders: IShippingPayload[];
    isLoadingOrders: boolean;
    errorMessage: string | null;
}) {
    const router = useRouter();

    
    const { handleDeleteShippingOrder, isDeletingShippingOrder } = useDeleteShippingOrder();
    const [isOpenDeleteShipingOrder, setIsOpenDeleteShipingOrder] = useState(false);
    const [shippingId, setShippingId] = useState<string | null>(null);
    const [shippingOrderReceiverName, setShippingOrderReceiverName] = useState<string | null>(null);
    

    const handleInvoiceClick = (shippingId: string | undefined) => {
        if (shippingId) {
            router.push(`/admin/shippings/invoice/${shippingId}`);
        }
    };


    const handleViewClick = (shippingId: string | undefined) => {
        if (shippingId) {
            router.push(`/admin/shippings/view/${shippingId}`);
        }
    };

    const handleEditClick = (shippingId: string | undefined) => {
        if (shippingId) {
            router.push(`/admin/shippings/edit/${shippingId}`);
        }
    };




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



    const emptyDesign = (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-center gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 lg:w-1/2 border border-dashed border-[rgb(70,95,255)]">
                    <h2
                        className={`text-2xl font-semibold mb-4 text-center ${errorMessage && shippingOrders.length === 0
                                ? "text-[rgb(70,95,255)]"
                                : "text-red-600"
                            }`}
                    >
                        {errorMessage && shippingOrders.length === 0
                            ? errorMessage
                            : "No Shipping Orders Found"}
                    </h2>

                    <p className="text-gray-800 text-center max-w-md mx-auto mt-2">
                        {errorMessage ? (
                            <span
                                className={`block text-sm text-center ${errorMessage ===
                                        "You don't have permission to view this data."
                                        ? "text-red-600"
                                        : "text-gray-600"
                                    }`}
                            >
                                {errorMessage === "You don't have permission to view this data."
                                    ? "It looks like your account doesn’t have the required permissions to view this page. Please contact an administrator if you believe this is a mistake."
                                    : errorMessage === "You must be logged in to access this data."
                                        ? "Please sign in to your account to access shipping orders data."
                                        : errorMessage === "Network error occurred. Please try again."
                                            ? "We couldn’t fetch the shipping orders due to a network issue. Please check your internet connection and try again."
                                            : errorMessage === "No orders found."
                                                ? "No shipping orders are available at the moment. Please check back later or adjust your filters."
                                                : "Something went wrong. Please try again or contact support if the issue persists."}
                            </span>
                        ) : (
                            <span className="block text-sm text-gray-700 text-center">
                                It appears that no shipping orders are currently available.
                                Please check back later or adjust your filters.
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    {shippingOrders.length === 0 && !isLoadingOrders ? (
                        emptyDesign
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Date
                                        </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Sender Name
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Receiver Name
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Tracking ID
                                    </TableCell>
                                 
                                   

                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Invoice Id
                                        </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Delete
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        View
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Edit
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {isLoadingOrders ? (
                                    <TableRow>
                                        <td colSpan={9} className="text-center py-4">
                                            <div className="flex justify-center items-center">
                                                <PageLoader />
                                            </div>
                                        </td>
                                    </TableRow>
                                ) : (
                                    shippingOrders.map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                {order.created_At
                                                    ? formatFullDateTimeWithAMPM(new Date(order.created_At))
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                {order.senderName}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                {order.receiverName}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                {order.TrackingId || "N/A"}
                                            </TableCell>
                                          
                                          

                                            <TableCell className="px-5 py-4 text-start">
                                                <button
                                                    onClick={() => handleInvoiceClick(order.id)}
                                                    disabled={isDeletingShippingOrder}
                                                    className="bg-indigo-500 flex items-center gap-2 text-white font-medium py-2 px-5 rounded-full shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                                                >
                                                    Invoice
                                                </button>
                                            </TableCell>

                                            <TableCell className="px-5 py-4 text-start">
                                                <button
                                                    onClick={() => {
                                                        setShippingId(order.id || "this order");
                                                        setShippingOrderReceiverName(order.receiverName);
                                                        openDeleteShippingModal();
                                                    }}
                                                    disabled={isDeletingShippingOrder}
                                                    className="bg-red-500 flex items-center gap-2 text-white font-medium py-2 px-5 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </TableCell>

                                            <TableCell className="px-5 py-4 text-start">
                                                <button
                                                    onClick={() => handleViewClick(order.id)}
                                                    className="bg-blue-500 flex items-center gap-2 text-white font-medium py-2 px-5 rounded-full shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200"
                                                >
                                                    View
                                                </button>
                                            </TableCell>

                                            <TableCell className="px-5 py-4 text-start">
                                                <button
                                                    onClick={() => handleEditClick(order.id)}
                                                    className="bg-amber-500 flex items-center gap-2 text-white font-medium py-2 px-5 rounded-full shadow-md hover:bg-amber-600 hover:shadow-lg transition-all duration-200"
                                                >
                                                    Edit
                                                </button>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Delete confirmation modal */}
                <DeleteConfirmationModal
                    itemName={shippingOrderReceiverName}
                    isLoading={isDeletingShippingOrder}
                    onDelete={confirmDeleteDeleteShippingOrder}
                    isOpen={isOpenDeleteShipingOrder}
                    openModal={() => setIsOpenDeleteShipingOrder(true)}
                    closeModal={closeDeleteShippingModal}
                />
            </div>
        </div>
    );
}
