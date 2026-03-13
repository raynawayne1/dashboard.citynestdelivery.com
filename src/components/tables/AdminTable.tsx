"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/Spinner/PageLoader"; // A loading spinner component (adjust path accordingly)
import formatFullDateTimeWithAMPM from "../lib/helpers/formatFullDateTimeWithAMPM/formatFullDateTimeWithAMPM";

export default function AdminTable({
  admins,
  isLoadingAdmins,
  currentUserId, // Add currentUserId prop to highlight the logged-in admin
}: {
  admins: any;
  isLoadingAdmins: boolean;
  currentUserId: string; // The ID of the currently logged-in admin
}) {
  const router = useRouter();

  const handleViewClick = (adminId: string) => {
    router.push(`/admin/users/view/${adminId}`);
  };

  const handleEditClick = (adminId: string) => {
    router.push(`/admin/remove-admin`);
  };


  // Empty design UI when no admins are found
  const emptyDesign = (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-center gap-6">
        {/* Empty Admin UI */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 lg:w-1/2 border border-dashed border-[rgb(70,95,255)]">
          <h2 className="text-2xl font-semibold text-[rgb(70,95,255)] mb-4 text-center">
            No Admin Found
          </h2>
          <p className="text-gray-800 text-center">
            It looks like there are no admins available at the moment!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          {/* If there are no admins and not loading, show empty design */}
          {admins.length === 0 && !isLoadingAdmins ? (
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
                    Admin Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Role
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
                    Updated At
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Appointed By
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body (show loading spinner if data is loading) */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoadingAdmins ? (
                  <TableRow>
                    {/* Use a plain td here to allow colSpan */}
                    <td colSpan={6} className="text-center py-4">
                      {/* Center the loading spinner */}
                      <div className="flex justify-center items-center">
                        <PageLoader /> {/* Your loading spinner */}
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  // Render table rows once data is loaded
                  admins.map((admin: any) => (
                    <TableRow
                      key={admin.id}
                      className={admin.id === currentUserId ? "bg-blue-100" : ""} // Highlight the current admin
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {admin.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {admin.role}
                      </TableCell>

                      {/* Display formatted createdAt and updatedAt */}
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {admin.createdAt && admin.createdAt !== null
                          ? formatFullDateTimeWithAMPM(new Date(admin.createdAt))
                          : 'N/A'}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {admin.updatedAt && admin.updatedAt !== null
                          ? formatFullDateTimeWithAMPM(new Date(admin.updatedAt))
                          : 'N/A'}

                      </TableCell>

                      {/* Display AppointedAdmin (who made the user an admin) */}
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {admin.AppointedAdmin ? admin.AppointedAdmin : 'N/A'}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <button
                          onClick={() => handleViewClick(admin.id)}
                          className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(admin.id)}
                          className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:bg-yellow-600 hover:shadow-xl transition duration-200 ml-2"
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
      </div>
    </div>
  );
}
