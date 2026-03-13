"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import Skeleton from "../Skeleton/Skeleton";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart({
  orders,
  isLoadingOrders,
}: {
  orders: any;
  isLoadingOrders: boolean;
}) {
  // Define the month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize an array to hold the monthly quantities (12 months, initially set to 0)
  const monthlyQuantities = new Array(12).fill(0);

  // Color mapping for different statuses
  const statusColors: Record<string, string> = {
    completed: "#28a745", // Green for completed
    canceled: "#dc3545", // Red for canceled
    processing: "#ffc107", // Yellow for processing
    "in progress": "#17a2b8", // Blue for in progress
    pending: "#007bff", // Primary Blue
    partial: "#fd7e14", // Orange for partial
  };

  // Function to convert Firestore timestamp to JavaScript Date
  const convertFirestoreTimestampToDate = (timestamp: any) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000); // Convert Firestore timestamp to JavaScript Date
    }
    return new Date(timestamp); // Handle regular ISO string timestamps
  };

  // Filter orders based on the selected status
  const [statusFilter, setStatusFilter] = useState<string>('completed');

  const filteredOrders = orders?.filter((order: any) => order.status === statusFilter);

  // Function to process the orders and accumulate quantities for each month
  filteredOrders.forEach((order: any) => {
    const orderDate = convertFirestoreTimestampToDate(order.createdAt); // Get the date of the order
    const monthIndex = orderDate.getMonth(); // Get the month index (0 = Jan, 1 = Feb, etc.)

    // Add the order quantity to the corresponding month if it's a valid month index
    if (monthIndex >= 0 && monthIndex < 12) {
      monthlyQuantities[monthIndex] += order.quantity;
    }
  });

  // Prepare the series data for the chart with colors for each status
  const series = [
    {
      name: `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders`,
      data: monthlyQuantities, // Monthly quantities for each month
    },
  ];

  // Chart options
  const options: ApexOptions = {
    colors: [statusColors[statusFilter]], // Dynamic color based on the selected status
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: monthNames, // X-axis will show the month names
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: [statusColors[statusFilter]], // Change legend color
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {`${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders`}
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            {Object.keys(statusColors).map((status) => (
              <DropdownItem
                key={status}
                onItemClick={() => { setStatusFilter(status); closeDropdown(); }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      </div>

      {isLoadingOrders  ? <div className="py-5">
        <Skeleton />
      </div>
        :
        <>
          {
            orders?.length ? <div className="max-w-full overflow-x-auto custom-scrollbar">
              <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="bar"
                  height={180}
                />
              </div>
            </div>
              : <div className="container mx-auto p-4">
                <div className="flex flex-wrap justify-center gap-6">
                  {/* Empty Order UI */}
                  <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 lg:w-1/2 border border-dashed border-[rgb(70,95,255)]">
                    <h2 className="text-2xl font-semibold text-[rgb(70,95,255)] mb-4 text-center">
                      No Orders Found
                    </h2>
                    <p className="text-gray-800 text-center">
                      It looks like there's no orders data available at the moment.
                    </p>
                  </div>
                </div>
              </div>
          }
        </>
      }

    </div>
  );
}
