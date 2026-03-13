
"use client"

import React from 'react'
import useGetAllUsers from '../../../../hooks/useUser/useGetAllUsers'
import UsersTable from '@/components/tables/UsersTable';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Pagination from '@/components/tables/Pagination';


export default function page() {
  const {
    users,
    isLoading,
    error, // Capture the error returned by the hook
    currentPage,
    totalPages,
    fetchNextPage,
    fetchPreviousPage,
  } = useGetAllUsers(10);

  const handlePageChange = (page: number) => {
    if (page > currentPage) fetchNextPage();
    else if (page < currentPage) fetchPreviousPage();
  };



  return (
    <div>
      <PageBreadcrumb pageTitle="My Users" />
      <div className="space-y-6">
        <ComponentCard title="My Users">
          <UsersTable users={users} error={error} isLoadingUsers={isLoading} />
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
  )
}
