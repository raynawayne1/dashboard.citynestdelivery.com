import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { ICreateOrder } from "../Interface";
import { useRouter } from "next/navigation";

// Assuming you have a loading spinner or component
import PageLoader from "@/components/Spinner/PageLoader"; // A loading spinner component (adjust path accordingly)
import RenderStatusBadge from "../lib/helpers/RenderStatusBadge/RenderStatusBadge";
import trucatText from "../lib/helpers/trucatText/trucatText";
import { formatAmount } from "../lib/helpers/FormateAmount/Formatemount";
import { truncateBycharacter } from "../lib/helpers/truncateBycharacter/truncateBycharacter";
import useDeleteOrder from "../../../hooks/useOrder/useDeleteOrder";
import DeleteConfirmationModal from "../modals/ConfirmDeleteOrder/ConfirmDeleteOrder";
import { useModal } from "@/hooks/useModal";

export default function AllOrdersForAdminTableTable({
  paginatedOrders = [], // Default to an empty array if orders is undefined
  isLoadingOrders,
  errorMessage
}: {
  paginatedOrders: ICreateOrder[];
  isLoadingOrders: boolean;
  errorMessage: string | null
}) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string>("");
  const handleViewClick = (orderId: string) => {
    router.push(`/admin/orders/view/${orderId}`);
  };

  const handleEditClick = (orderId: string) => {
    router.push(`/admin/orders/edit/${orderId}`);
  };

  const [itemToDelete, setItemToDelete] = useState<string | null>(null); // To store the name of the item being deleted
  const { HandledeleteOrder, isDeleting } = useDeleteOrder();
  const [orderIdToDelete, setOrderIdToDelete] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal(); // Manage modal state  



  const handleDelete: any = async () => {
    if (orderIdToDelete) {
      await HandledeleteOrder(orderIdToDelete);
      setOrderIdToDelete(null); // Reset order ID after deletion
    }
  };

  const emptyDesign = (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 lg:w-1/2 border border-dashed border-[rgb(70,95,255)]">
          <h2
            className={`text-2xl font-semibold mb-4 text-center ${errorMessage && paginatedOrders.length === 0
              ? 'text-[rgb(70,95,255)]'
              : 'text-red-600'
              }`}
          >
            {errorMessage && paginatedOrders.length === 0
              ? errorMessage
              : 'No Orders Found'}
          </h2>

          <p className="text-gray-800 text-center max-w-md mx-auto mt-2">
            {errorMessage ? (
              <span
                className={`block text-sm text-center ${errorMessage === "You don't have permission to view this data."
                  ? 'text-red-600'
                  : 'text-gray-600'
                  }`}
              >
                {errorMessage === "You don't have permission to view this data."
                  ? "It looks like your account doesn’t have the required permissions to view this page. Please contact an administrator if you believe this is a mistake."
                  : errorMessage === "You must be logged in to access this data."
                    ? "Please sign in to your account to access orders data."
                    : errorMessage === "Network error occurred. Please try again."
                      ? "We couldn’t fetch the orders due to a network issue. Please check your internet connection and try again."
                      : errorMessage === "No orders found."
                        ? "No orders are available at the moment. Please check back later or adjust your filters."
                        : "Something went wrong. Please try again or contact support if the issue persists."}
              </span>
            ) : (
              <span className="block text-sm text-gray-700 text-center">
                It appears that no orders are currently available. Please check back later or adjust your filters.
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
          {/* If there are no orders and not loading, show empty design */}
          {paginatedOrders.length === 0 && !isLoadingOrders ? (
            emptyDesign
          ) : (
            <Table>
              {/* Table Header (always displayed) */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Order Id
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Name
                  </TableCell>


                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Service Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Category Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Link
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Username
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Average Time
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Amount
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Quantity
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Charge
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Per
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Delete
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    View
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Edit
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body (show loading spinner if data is loading) */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoadingOrders ? (
                  <TableRow>
                    {/* Use a plain `td` here to allow colSpan */}
                    <td colSpan={11} className="text-center py-4">
                      {/* Center the loading spinner */}
                      <div className="flex justify-center items-center">
                        <PageLoader /> {/* Your loading spinner */}
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  // Render table rows once data is loaded
                  paginatedOrders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {order.id}
                      </TableCell>
                      <TableCell className=" px-5 py-4 sm:px-6 text-start">
                        {trucatText(order.fullName, 1)}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {trucatText(order.serviceName, 1)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {trucatText(order.categoryName, 1)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <a href={order.link} target="_blank" rel="noopener noreferrer">
                          {truncateBycharacter(order.link ? order.link : "No Link", 5)}
                        </a>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.username ? order.username : "No Username"}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.averageTime}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatAmount(order?.amount)}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {/* Render badge based on status */}
                        <RenderStatusBadge status={order?.status || ""} />
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.quantity}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.charge.toFixed(2)}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.per}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <button
                          onClick={() => {
                            setItemToDelete(order.serviceName);
                            setOrderIdToDelete(order.id); // Set the order ID to be deleted
                            openModal(); // Open the modal when clicking delete
                          }}
                          disabled={isDeleting} // Disable button if deleting
                          className="bg-red-500 flex text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-red-600 hover:shadow-xl transition duration-200"
                        >
                          Delete
                        </button>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <button
                          onClick={() => handleViewClick(order.id)} // Pass order ID
                          className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-200"
                        >
                          View
                        </button>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <button
                          onClick={() => handleEditClick(order.id)}
                          className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-yellow-600 hover:shadow-xl transition duration-200"
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

        <DeleteConfirmationModal
          itemName={itemToDelete}
          isLoading={isDeleting}
          onDelete={handleDelete} // Pass the delete function to the modal
          isOpen={isOpen}
          openModal={openModal} // Open function passed
          closeModal={closeModal} // Close function passed
        />
      </div>
    </div>
  );
}
