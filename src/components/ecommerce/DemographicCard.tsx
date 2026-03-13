"use client";
import Image from "next/image";
import CountryMap from "./CountryMap";
import { useState, useEffect } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { IUser } from "../Interface";
import Skeleton from "../Skeleton/Skeleton";

export default function DemographicCard({
  users,
  isLoadingAllUser,
}: {
  users: IUser[];
  isLoadingAllUser: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [countryFlags, setCountryFlags] = useState<{ [key: string]: string }>({});
  const [isLoadingFlags, setIsLoadingFlags] = useState(true);

  // Function to fetch country flag by country code
  const fetchCountryFlag = async (countryCode: string): Promise<string> => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      const countryData = await response.json();
      return countryData[0]?.flags?.svg || "/images/country/default.svg";
    } catch (error) {
      console.error("Error fetching flag:", error);
      return "/images/country/default.svg";
    }
  };

  // Fetch flags for each country when the users data is available
  useEffect(() => {
    const fetchFlags = async () => {
      const flags: { [key: string]: string } = {};

      for (const user of users) {
        const countryCode = user.countryCode;
        if (!flags[countryCode]) {
          const flagUrl = await fetchCountryFlag(countryCode);
          flags[countryCode] = flagUrl;
        }
      }

      setCountryFlags(flags);
      setIsLoadingFlags(false);
    };

    if (users.length > 0) {
      setIsLoadingFlags(true);
      fetchFlags();
    }
  }, [users]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Group users by country
  const groupedByCountry: { [key: string]: IUser[] } = users.reduce(
    (acc: { [key: string]: IUser[] }, user) => {
      const country = user.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(user);
      return acc;
    },
    {}
  );


  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Number of customers based on country
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className=" py-6 ">
        {isLoadingAllUser ? (
          <Skeleton />
        ) : (
          <>
            {users.length ?
              <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
                <div id="mapOne" className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]">
                  
                  <CountryMap users={users} isLoadingAllUser={isLoadingAllUser} />
                </div>
              </div>
              : null}

          </>
        )}
      </div>
      {/* { && !isLoadingOrders} */}
      {isLoadingAllUser ? <Skeleton /> : <div className="space-y-5">
        {Object.keys(groupedByCountry).length === 0? (
          <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-center gap-6">
              {/* Empty Order UI */}
              <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 lg:w-[90%] border border-dashed border-[rgb(70,95,255)]">
                <h2 className="text-2xl font-semibold text-[rgb(70,95,255)] mb-4 text-center">
                  No User Found
                </h2>
                <p className="text-gray-800 text-center">
                  It looks like there's no user data available at the moment.
                </p>
              </div>
            </div>
          </div>
        ) : (
          Object.keys(groupedByCountry).map((country) => {
            const countryUsers = groupedByCountry[country];
            const numberOfCustomers = countryUsers.length;
            const countryCode = countryUsers[0]?.countryCode;
            const flagImage = countryCode ? countryFlags[countryCode] || "/images/country/default.svg" : "/images/country/default.svg";

            return (

              <div className="flex items-center justify-between" key={country}>
                <div className="flex items-center gap-3">
                  <div className="items-center w-full rounded-full max-w-8">
                    {isLoadingFlags ? (
                      <div className="loader">...</div>
                    ) : (
                      <Image
                        width={48}
                        height={48}
                        src={flagImage}
                        alt={country}
                        className="w-full"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                      {country}
                    </p>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {numberOfCustomers} Customers
                    </span>
                  </div>
                </div>

                <div className="flex w-full max-w-[140px] items-center gap-3">
                  <div className="relative block h-2 w-full p-[7px] max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                    <div
                      className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-[10px] font-medium text-white"
                      style={{ width: `${(numberOfCustomers / users.length) * 100}%` }}
                    >
                      {numberOfCustomers}
                    </div>
                  </div>
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {(numberOfCustomers / users.length * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>}

    </div>
  );
}
