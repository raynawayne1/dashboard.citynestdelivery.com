"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import useUserById from "../../../hooks/useUser/useUserById";
import { useAuth } from "../../../Authcontext/AuthContext";
import PageLoader from "../Spinner/PageLoader";

export default function UserInfoCard() {

  const { user } = useAuth();
  const { user: userInfo, isLoadingUser } = useUserById(user.uid);

  // Simulate fetching the user info (you can adjust this logic if fetching data is asynchronous)

  if (isLoadingUser) {
    return <PageLoader />;
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>




          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userInfo?.fullName}
              </p>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userInfo.email}
              </p>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userInfo.phoneNumber || "Not provided"}
              </p>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                zip
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userInfo.zip || "Not found"}
              </p>
            </div>

          </div>



        </div>

      </div>
    </div>
  );
}
