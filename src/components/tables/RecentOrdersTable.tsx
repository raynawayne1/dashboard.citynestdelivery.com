import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { ICreateOrder } from "../Interface";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/Spinner/PageLoader"; // A loading spinner component (adjust path accordingly)
import { formatAmount } from "../lib/helpers/FormateAmount/Formatemount"; // Formatting function for amount
import RenderStatusBadge from "../lib/helpers/RenderStatusBadge/RenderStatusBadge";
import trucatText from "../lib/helpers/trucatText/trucatText";
import { truncateBycharacter } from "../lib/helpers/truncateBycharacter/truncateBycharacter";

export default function RecentOrdersTable({
  orders = [], // Default to an empty array if orders is undefined
  isLoadingOrders,
}: {
  orders: ICreateOrder[];
  isLoadingOrders: boolean;
}) {
  const router = useRouter();

  const handleViewClick = (orderId: string) => {
    router.push(`/admin/orders/view/${orderId}`);
  };


  const handleEditClick = (orderId: string) => {
    router.push(`/admin/orders/edit/${orderId}`);
  };

  // Empty design UI
  const emptyDesign = (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-center gap-6">
        {/* Empty Order UI */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 lg:w-1/2 border border-dashed border-[rgb(70,95,255)]">
          <h2 className="text-2xl font-semibold text-[rgb(70,95,255)] mb-4 text-center">
            No Order Found
          </h2>
          <p className="text-gray-800 text-center">
            It looks like there's no order data available at the moment.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>


      <div>
        {orders.length === 0 && !isLoadingOrders ? (
          emptyDesign
        ) : (
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Category Name
                  </TableCell>
                  <TableCell isHeader className="py-3 px-5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Service Name
                  </TableCell>
                  <TableCell isHeader className="py-3 px-5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Amount
                  </TableCell>
                  <TableCell isHeader className="px-5  py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                  {/* Add View and Edit column headers */}
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoadingOrders ? (
                  <TableRow>
                    <td colSpan={5} className="text-center py-4">
                      <div className="flex justify-center items-center">
                        <PageLoader />
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-4 flex items-center gap-3">
                        {truncateBycharacter(order.categoryName, 10)}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {truncateBycharacter(order.serviceName, 10)}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {formatAmount(order?.amount)}
                      </TableCell>

                      <TableCell className=" py-3 text-gray-500 text-theme-sm dark:text-gray-400 ">

                        <RenderStatusBadge status={order?.status || ""} />
                      </TableCell>

                      {/* Actions Column with View and Edit buttons */}
                      <TableCell className="px-4  text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewClick(order.id)}
                            className="bg-blue-300 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-200"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleEditClick(order.id)}
                            className="bg-yellow-300 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-yellow-600 hover:shadow-xl transition duration-200"
                          >
                            Edit
                          </button>
                        </div>
                      </TableCell>


                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
