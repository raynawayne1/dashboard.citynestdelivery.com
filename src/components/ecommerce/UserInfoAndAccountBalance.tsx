import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import Skeleton from "../Skeleton/Skeleton";
import { formatAmount } from "../lib/helpers/FormateAmount/Formatemount";
import useGetAllUsersAtOnce from "../../../hooks/useUser/useGetAllUsersAtOnce";

// Helper function to get the current month in YYYY-MM format
const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
};

// Function to format a timestamp or date object to 'YYYY-MM'
const formatDateToMonth = (date: any) => {
  const validDate = date instanceof Date ? date : new Date(date.seconds * 1000); // Convert Firestore timestamp to Date if needed
  const year = validDate.getFullYear();
  const month = validDate.getMonth() + 1; // Months are 0-indexed, so we add 1
  return `${year}-${month < 10 ? '0' + month : month}`;
};

// Types for user, payment, and order
type Payment = {
  amount?: number | string;
};

type Order = {
  amount?: number | string;
  status?: string; // Added status field to determine if the order is completed
  completedAt?: string | null; // Added completedAt field to track order completion date
  createdAt: any; // 'createdAt' could be a Firestore timestamp or a Date object
};

type User = {
  payment?: Payment[];
  orders?: Order[];
};

export const UserInfoAndAccountBalance = () => {
  const { users = [], isLoading: isLoadingAllUser } = useGetAllUsersAtOnce();

  // Get the current month in YYYY-MM format (e.g., "2025-05")
  const currentMonth = getCurrentMonth();

  // Calculate the total number of completed orders this month
  const completedOrdersThisMonth: number = users.reduce((acc: number, user: User) => {
    const completedOrders = user.orders?.filter(order => {
      const orderMonth = formatDateToMonth(order.createdAt);  // Use the formatDateToMonth function
      return (order.status === 'completed' || order.completedAt) && orderMonth === currentMonth;
    }) || [];
    return acc + completedOrders.length;
  }, 0);

  // Calculate the total number of orders this month
  const totalOrdersThisMonth: number = users.reduce((acc: number, user: User) => {
    const totalOrders = user.orders?.filter(order => {
      const orderMonth = formatDateToMonth(order.createdAt);  // Use the formatDateToMonth function
      return orderMonth === currentMonth;
    }) || [];
    return acc + totalOrders.length;
  }, 0);

  // Calculate the percentage of completed orders
  const completedOrdersPercentage = totalOrdersThisMonth > 0 ? (completedOrdersThisMonth / totalOrdersThisMonth) * 100 : 0;

  // Total Deposit (from all payments across users)
  const totalDeposit: number = users.reduce((acc: number, user: User) => {
    const userDeposit = user.payment?.reduce((sum, pay) => sum + Number(pay.amount || 0), 0) || 0;
    return acc + userDeposit;
  }, 0);

  // Total Amount Spent (from all orders across users)
  const totalSpent: number = users.reduce((acc: number, user: User) => {
    const userSpent = user.orders?.reduce((sum, order) => sum + Number(order.amount || 0), 0) || 0;
    return acc + userSpent;
  }, 0);


  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Amount Spent */}
      {isLoadingAllUser ? <Skeleton /> : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total User Expenditure
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {formatAmount(totalSpent)}
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              11.01%
            </Badge>
          </div>
        </div>
      )}

      {/* Total Deposit */}
      {isLoadingAllUser ? <Skeleton /> : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total User Deposit
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {formatAmount(totalDeposit)}
              </h4>
            </div>
            <Badge color="error">
              <ArrowDownIcon className="text-error-500" />
              9.05%
            </Badge>
          </div>
        </div>
      )}

     
    </div>
  );
};
