import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/Spinner/PageLoader";
import Image from "next/image";
import { useModal } from "@/hooks/useModal";
import { formatAmount } from "../lib/helpers/FormateAmount/Formatemount";

export default function UsersTable({
  users = [], // Default to an empty array if users is undefined
  isLoadingUsers,
  error
}: {
  users: any[];
  isLoadingUsers: boolean;
  error: string | null;
}) {
  const router = useRouter();

  const handleViewClick = (userId: string) => {
    router.push(`/admin/users/view/${userId}`);
  };




  const emptyDesign = (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 lg:w-1/2 border border-dashed border-[rgb(70,95,255)]">
          <h2
            className={`text-2xl font-semibold mb-4 text-center ${error && users.length === 0 ? 'text-[rgb(70,95,255)]' : 'text-red-600'
              }`}
          >
            {error && users.length === 0 ? error : "No Users Found"}
          </h2>
          <p className="text-gray-800 text-center">
            {error ? (
              <span className={`block text-sm ${error === "You don't have permission to view this data." ? 'text-red-600' : 'text-gray-600'}`}>
                {error === "You don't have permission to view this data."
                  ? "It looks like your account doesn’t have the required permissions to view this page. Please contact an administrator if you believe this is a mistake."
                  : error === "You must be logged in to access this data."
                    ? "Please sign in to your account to access user data."
                    : error === "Network error occurred. Please try again."
                      ? "We couldn’t fetch the user data due to a network issue. Please check your internet connection and try again."
                      : error === "No users found."
                        ? "No users are available at the moment. Please check back later or adjust your filters."
                        : "Something went wrong. Please try again or contact support if the issue persists."}
              </span>
            ) : (
              <span className="block text-sm text-gray-700">
                It appears that no users are currently available. Please check back later or adjust your filters.
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
          {users.length === 0 && !isLoadingUsers ? (
            emptyDesign
          ) : (
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {/* Adding the new fields at the beginning */}
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Country
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Username
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Total Orders
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Balance
                  </TableCell>
                  {/* Original columns */}
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Full Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Email
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Role
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Email verified
                  </TableCell>

                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    View
                  </TableCell>

                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoadingUsers ? (
                  <TableRow>
                    <td colSpan={14} className="text-center py-4">
                      <div className="flex justify-center items-center">
                        <PageLoader />
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const updatedAt = user.updatedAt && user.updatedAt.seconds
                      ? new Date(user.updatedAt.seconds * 1000)
                      : null;
                    const photoURL = user.photoURL || "/images/user/user-20.jpg"; // Fallback if photoURL is not available

                    return (
                      <TableRow key={user.id}>
                        {/* Adding the new fields values in the rows */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 overflow-hidden rounded-full">
                              <Image
                                width={40}
                                height={40}
                                src={photoURL}
                                alt={"profile"}
                              />
                            </div>
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {user.fullName}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400">{user.country}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{user.username}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">  {user.orders?.length ?? 0}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">  {formatAmount(user.balance || 0)}</TableCell>



                        {/* Original row values */}
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{user.fullName}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{user.email}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{user.role}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{user.emailVerified ? <span className='bg-green-100 text-green-800 font-semibold block p-1 rounded text-center'>Verified</span> : <span className='bg-red-100 text-red-800 font-semibold block p-1 rounded text-center'>Not Verified</span>}</TableCell>

                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <button
                            onClick={() => handleViewClick(user.id)}
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



      </div>
    </div>
  );
}
