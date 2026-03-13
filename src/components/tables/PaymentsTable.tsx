import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useRouter } from "next/navigation";

import PageLoader from "@/components/Spinner/PageLoader";
import RenderStatusBadge from "../lib/helpers/RenderStatusBadge/RenderStatusBadge";
import { formatAmount } from "../lib/helpers/FormateAmount/Formatemount";
import DeleteConfirmationModal from "../modals/ConfirmDeleteOrder/ConfirmDeleteOrder";
import { useModal } from "@/hooks/useModal";
import useDeletePaymentByFlwRef from "../../../hooks/useGetAllPaymentsForAdmin/useDeletePaymentByFlwRef";
import trucatText from "../lib/helpers/trucatText/trucatText";
import { truncateBycharacter } from "../lib/helpers/truncateBycharacter/truncateBycharacter";

export default function PaymentsTable({
  paginatedPayments = [],
  isLoadingPayments,
  errorMessage,
}: {
  paginatedPayments: any[];
  isLoadingPayments: boolean;
  errorMessage: string | null;
}) {
  const router = useRouter();

  const handleViewClick = (paymentRef: string) => {
    router.push(`/admin/payment-history/view/${paymentRef}`);
  };

  const [paymentIdToDelete, setPaymentIdToDelete] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { isDeleting, HandledeletePayment } = useDeletePaymentByFlwRef();

  const handleDelete = async () => {
    if (paymentIdToDelete) {
      await HandledeletePayment(paymentIdToDelete);
      setPaymentIdToDelete(null);
    }
  };

  const emptyDesign = (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 lg:w-1/2 border border-dashed border-[rgb(70,95,255)]">
          <h2
            className={`text-2xl font-semibold mb-4 text-center ${errorMessage && paginatedPayments.length === 0
              ? "text-[rgb(70,95,255)]"
              : "text-red-600"
              }`}
          >
            {errorMessage && paginatedPayments.length === 0
              ? errorMessage
              : "No Payments Found"}
          </h2>
          <p className="text-gray-800 text-center max-w-md mx-auto mt-2">
            {errorMessage ? (
              <span
                className={`block text-sm text-center ${errorMessage === "You don't have permission to view this data."
                  ? "text-red-600"
                  : "text-gray-600"
                  }`}
              >
                {errorMessage === "You don't have permission to view this data."
                  ? "It looks like your account doesn’t have the required permissions to view this page. Please contact an administrator if you believe this is a mistake."
                  : errorMessage === "You must be logged in to access this data."
                    ? "Please sign in to your account to access payments data."
                    : errorMessage === "Network error occurred. Please try again."
                      ? "We couldn’t fetch the payments due to a network issue. Please check your internet connection and try again."
                      : errorMessage === "No payments found."
                        ? "No payments are available at the moment. Please check back later or adjust your filters."
                        : "Something went wrong. Please try again or contact support if the issue persists."}
              </span>
            ) : (
              <span className="block text-sm text-gray-700 text-center">
                It appears that no payments are currently available. Please check back later or adjust your filters.
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
          {paginatedPayments.length === 0 && !isLoadingPayments ? (
            emptyDesign
          ) : (
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User Full Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Transaction ID / Reference
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
                    Created At
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
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoadingPayments ? (
                  <TableRow>
                    <td colSpan={8} className="text-center py-4">
                      <div className="flex justify-center items-center">
                        <PageLoader />
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  paginatedPayments.map((payment, index) => {
                    // Use flw_ref or payment_reference or reference for IDs
                    const paymentRef =
                      payment.flw_ref || payment.payment_reference || payment.reference || "";

                    // Use transaction_id if present, otherwise fallback to paymentRef
                    const transactionOrRef =
                      payment.transaction_id || paymentRef || "N/A";

                    // Prefer charged_amount if available else amount
                    const amount = payment.charged_amount ?? payment.amount ?? 0;

                    // Normalize status display (optional)
                    const status = payment.status?.toLowerCase() || "unknown";

                    return (
                      <TableRow key={index}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          {payment.userFullName || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          {truncateBycharacter(payment.userEmail, 30) || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          {truncateBycharacter(transactionOrRef, 15)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {formatAmount(amount)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <RenderStatusBadge status={status} />
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {new Date(payment.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <button
                            onClick={() => {
                              setItemToDelete(payment.userEmail);
                              setPaymentIdToDelete(payment.flw_ref);
                              openModal();
                            }}
                            disabled={isDeleting}
                            className="bg-red-500 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-red-600 hover:shadow-xl transition duration-200"
                          >
                            Delete
                          </button>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <button
                            onClick={() => handleViewClick(payment.flw_ref)}
                            className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-200"
                          >
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <DeleteConfirmationModal
          itemName={itemToDelete}
          isLoading={isDeleting}
          onDelete={handleDelete}
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
        />
      </div>
    </div>
  );
}
