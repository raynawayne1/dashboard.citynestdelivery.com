"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import useCreateAddDropLocation from "../../../../../../../hooks/useAddDropLocation/useCreateAddDropLocation";
import { useParams } from "next/navigation";
import useGetShippingOrderById from "../../../../../../../hooks/useShippingOrder/useGetShippingOrderById";

// Zod schema for Add Drop
export const addDropSchema = z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    status: z.string().min(1, "Status is required"),
    date: z.string().min(1, "Date is required"),
    remarks: z.string().min(1, "Remarks are required"),
});

export type AddDropFormData = z.infer<typeof addDropSchema>;

export default function AddDropForm() {
    const params = useParams();
    const shippingId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

    // Guard clause: if shippingId is not defined, render fallback UI
    if (!shippingId) {
        return <div>Loading shipping ID...</div>;
    }

    const { shippingOrder, isLoading, error } = useGetShippingOrderById(shippingId);

    const { isAddingDrop, addDrop } = useCreateAddDropLocation(
        shippingId,
        shippingOrder?.receiverName || "",
        shippingOrder?.receiverEmail || "");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AddDropFormData>({
        resolver: zodResolver(addDropSchema),
    });

    const onSubmit = async (data: AddDropFormData) => {
        const success = await addDrop(data);
        if (success) reset();
    };

    return (
        <div className="flex justify-center px-4 py-8">
            <div className="w-full max-w-3xl">
                <ComponentCard title="Add Shipping Drop">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <section>
                            <h4 className="font-bold mb-4">Drop Location Details {`${shippingOrder?.receiverName}`}</h4>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        placeholder="Country"
                                        {...register("country")}
                                        error={!!errors.country?.message}
                                        hint={errors.country?.message || ""}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        placeholder="State"
                                        {...register("state")}
                                        error={!!errors.state?.message}
                                        hint={errors.state?.message || ""}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="City"
                                        {...register("city")}
                                        error={!!errors.city?.message}
                                        hint={errors.city?.message || ""}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="Address"
                                        {...register("address")}
                                        error={!!errors.address?.message}
                                        hint={errors.address?.message || ""}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="zipCode">Zip Code</Label>
                                    <Input
                                        id="zipCode"
                                        placeholder="Zip Code"
                                        {...register("zipCode")}
                                        error={!!errors.zipCode?.message}
                                        hint={errors.zipCode?.message || ""}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        {...register("status")}
                                        className={`w-full rounded border px-3 py-2 ${errors.status ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Picked up">Picked up</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Out for delivery">Out for delivery</option>
                                        <option value="In Transit">In Transit</option>
                                        <option value="Enroute">Enroute</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Returned">Returned</option>
                                        <option value="Landed">Landed</option>
                                        <option value="Registered">Registered</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                                    )}
                                </div>


                            </div>
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    placeholder="Select date & time "
                                    {...register("date")}
                                    error={!!errors.date?.message}
                                    hint={errors.date?.message || ""}
                                />
                            </div>
                        </section>

                        <section>
                            <Label htmlFor="remarks">Remarks</Label>
                            <TextArea
                                id="remarks"
                                placeholder="Remarks"
                                {...register("remarks")}
                                error={!!errors.remarks?.message}
                                hint={errors.remarks?.message || ""}
                            />
                        </section>

                        <button
                            type="submit"
                            disabled={isAddingDrop}
                            className="mt-4 w-full rounded bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-70"
                        >
                            {isAddingDrop ? "Adding Drop..." : "Add Drop"}
                        </button>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}
