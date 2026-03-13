"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import Skeleton from "../Skeleton/Skeleton";
import { formatAmount } from "../lib/helpers/FormateAmount/Formatemount";
import { formatNumber } from "../lib/helpers/formatNumber/formatNumber";
import useGetAllOrdersForAdminAtOnce from "../../../hooks/useGetAllOrdersForAdmin/useGetAllOrdersForAdminAtOnce";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const { orders: allorders, isLoadingOrders: isLoadingAllOrders } = useGetAllOrdersForAdminAtOnce();

  const now = new Date();

  // Filter orders by the current month (completed)
  const completedOrdersThisMonth = allorders.filter((order: any) => {
    const orderDate = new Date(
      order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt
    );
    return (
      order.status === "completed" &&
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() === now.getFullYear()
    );
  });

  const totalOrdersThisMonth = allorders.filter((order: any) => {
    const orderDate = new Date(
      order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt
    );
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  });

  const totalOrders = totalOrdersThisMonth.length || 0;
  const completedOrdersCount = completedOrdersThisMonth.length || 0;



  // Standard progress calculation
  let progress = 0;

  if (totalOrders > 0) {
    // Calculate the percentage of completed orders
    progress = (completedOrdersCount / totalOrders) * 100;

    // Ensure that the progress doesn't exceed 100%
    progress = Math.min(progress, 100); // Caps at 100%
  }


  const series = [progress];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val) => val.toFixed(0) + "%",
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Monthly Order Progress (Completed)
              </h3>
              <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                Showing completed orders this month as a percentage of total orders this month.
              </p>
            </div>
            <div className="relative inline-block">
              <button onClick={toggleDropdown} className="dropdown-toggle">
                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
              <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="w-40 p-2"
              >
                <DropdownItem
                  tag="a"
                  onItemClick={closeDropdown}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  View More
                </DropdownItem>
                <DropdownItem
                  tag="a"
                  onItemClick={closeDropdown}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Delete
                </DropdownItem>
              </Dropdown>
            </div>
          </div>

          {isLoadingAllOrders ? (
            <div className="mt-10">
              <Skeleton />
              <div className="mt-4 text-center">
                <Skeleton />
                <Skeleton />
              </div>
            </div>
          ) : (
            <>
              <div className="relative mt-8">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="radialBar"
                  height={330}
                />

                <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
                  +{progress.toFixed(0)}%
                </span>
              </div>

              <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
                {completedOrdersCount} out of {totalOrders} orders were completed this month.
              </p>
            </>
          )}
        </div>

        {!isLoadingAllOrders && (
          <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
            <div>
              <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                Total Orders
              </p>
              <p className="text-lg font-semibold text-center text-gray-800 dark:text-white/90">
                {formatNumber(totalOrders)}
              </p>
            </div>

            <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />

            <div>
              <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                Total Amount (All Orders)
              </p>
              <p className="text-lg font-semibold text-center text-gray-800 dark:text-white/90">
                {formatAmount(allorders.reduce((total: number, order: any) => total + Number(order.amount || 0), 0))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
