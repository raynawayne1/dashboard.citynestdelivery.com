import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import { formatAmount } from "../lib/helpers/FormateAmount/Formatemount";
import { truncateBycharacter } from "../lib/helpers/truncateBycharacter/truncateBycharacter";
import formatFullDateTimeWithAMPM from "../lib/helpers/formatFullDateTimeWithAMPM/formatFullDateTimeWithAMPM";
import useDeleteCategory from "../../../hooks/useCatergory/useDeleteCatergory";
import { useRouter } from "next/navigation";
import PageLoader from "../Spinner/PageLoader";
import Spinner from "../Spinner/Spinner";
import formatFullDateTimeWith from "../lib/helpers/formatFullDateTimeWithAMPM/formatFullDateTimeWith";

export default function CategoriesWithServicesForUserTable({ categories, isLoadingCategory }: { categories: any[], isLoadingCategory:boolean }) {

    const { handleDeleteCategory, isDeletingCategory } = useDeleteCategory();
    const [deleteId, setDeleteId] = useState<string>("");

    const router = useRouter();

    if (isLoadingCategory) {
        return (
            <div className="min-h-[200px] grid w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                <PageLoader />
            </div>
        );
    }

    const emptyDesign = (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-center gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 lg:w-1/2 border border-dashed border-[rgb(70,95,255)]">
                    <h2 className="text-2xl font-semibold text-[rgb(70,95,255)] mb-4 text-center">
                        No Categories Found
                    </h2>
                    <p className="text-gray-800 text-center">
                        It looks like there are no categories available at the moment.
                    </p>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="overflow-auto border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>

                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                            <span className="pr-5 font-semibold">
                                ID
                            </span>
                            <span className="font-semibold">
                               Services
                             </span>
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Amount</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Min</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Max</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Per</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Average Time</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Created At</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Updated At</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Description</TableCell>

                    </TableRow>
                </TableHeader>
                {categories.length === 0 ? emptyDesign : <TableBody>
                    {categories.map((category) => (
                        <React.Fragment key={category.id}>
                            {/* Category Row */}
                            <TableRow className="bg-gray-100">
                                <TableCell colSpan={10} className="font-semibold text-lg px-5 py-2 sm:px-5 text-start">
                                    {category.categoryName}
                                </TableCell>
                            </TableRow>

                            {/* Services Rows */}
                            {category.services.map((service: any, serviceIndex: number) => (
                                <TableRow key={service.id}>
                                    {/* Service Name shown under Category Name column */}
                                    <TableCell className=" py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <span className="pl-4">   {service.id}</span>

                                        <span className="p-3 block md:inline"> {service.serviceName}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {formatAmount(service.amount)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.minimuim}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.maximum}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.per}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.averageTime || "N/A"}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.createdAt
                                            ? formatFullDateTimeWith(new Date(service.createdAt))
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.updatedAt
                                            ? formatFullDateTimeWith(new Date(service.updatedAt))
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                                        {service.description ? truncateBycharacter(service.description, 20) : "No Description"}
                                    </TableCell>
                                   
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>}

              
            </Table>
        </div>
    );
}
