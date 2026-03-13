"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Pagination from "@/components/tables/Pagination";
import AllShippingOrdersTable from "@/components/tables/AllShippingOrdersTable";
import useGetShippingOrdersForAdmin from "../../hooks/useShippingOrder/useGetShippingOrders";

function Page() {
  const {
    shippingOrders,
    isLoadingShippingOrders,
    error,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  } = useGetShippingOrdersForAdmin(10);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      if (page > currentPage) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
  };


  return (
    <div>
      <PageBreadcrumb pageTitle="Shipping Orders" />
      <div>
        <ComponentCard title="Shipping Orders">
          <AllShippingOrdersTable
            shippingOrders={shippingOrders}
            isLoadingOrders={isLoadingShippingOrders}
            errorMessage={error || "No shipping orders available."}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}

export default Page;
