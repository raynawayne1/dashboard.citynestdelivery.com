import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import Skeleton from "../Skeleton/Skeleton";
import { formatAmount } from "../lib/helpers/FormateAmount/Formatemount";

// Update to accept props as an object
export const UserInfoAndAccountBalance = ({ user, isLoadingUser }: { user: any, isLoadingUser: boolean }) => {

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      {isLoadingUser ? <Skeleton /> :
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Welcome to the panel!
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 capitalize">
                {user?.fullName ?? "..."}
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              11.01%
            </Badge>
          </div>
        </div>
      }
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      {isLoadingUser ? <Skeleton /> :
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Account balance
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {formatAmount(user?.balance)}
              </h4>
            </div>

            <Badge color="error">
              <ArrowDownIcon className="text-error-500" />
              9.05%
            </Badge>
          </div>
        </div>
      }
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
