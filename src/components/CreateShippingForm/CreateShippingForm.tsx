"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";

import { generateReferenceIdUniqueCharacters } from "../lib/helpers/generateReferenceIdUniqueCharacters/generateReferenceIdUniqueCharacters";
import { generateTrackingId } from "../lib/helpers/generateTrackingId/generateTrackingId";
import useCreateShippingOrder from "../../../hooks/useShippingOrder/useCreateShippingOrder";
import DropzoneComponent from "../form/input/DropZone";
import { IUploadImage } from "../Interface";

const shippingSchema = z.object({
    senderName: z.string().min(1, "Sender name is required"),
    senderPhone: z.string().min(1, "Sender phone number is required"),
    senderEmail: z.string().email("Invalid email address"),
    senderAddres: z.string().min(1, "Sender address is required"),

    receiverName: z.string().min(1, "Receiver name is required"),
    receiverPhone: z.string().min(1, "Receiver phone number is required"),
    receiverEmail: z.string().email("Invalid email address"),
    receiverAddres: z.string().min(1, "Receiver address is required"),

    shipmentMode: z.string().min(1, "Shipment mode is required"),
    destination: z.string().min(1, "Destination is required"),
    weight: z.string().min(1, "Weight is required"),
    deliveryDate: z.string().min(1, "Delivery date is required"),
    pickUpTime: z.string().min(1, "Pick-up time is required"),
    departureTime: z.string().min(1, "Departure time is required"),
    courierName: z.string().min(1, "Courier name is required"),
    totalFreight: z.string().min(1, "Total freight is required"),
    product: z.string().min(1, "Product is required"),
    mode: z.string().min(1, "Mode is required"),
    origin: z.string().min(1, "Origin is required"),
    quantity: z.string().min(1, "Quantity is required"),

    description: z.string().min(1, "Description is required"),
    paymentMode: z.string().min(1, "Payment mode is required"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject("Failed to convert file to base64");
            }
        };
        reader.onerror = (error) => reject(error);
    });
}

export default function CreateShippingForm() {
    const { isCreatingShippingOrder, handleUseCreateShippingOrder } = useCreateShippingOrder();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ShippingFormData>({
        resolver: zodResolver(shippingSchema),
    });

    const referenceId = useMemo(() => generateReferenceIdUniqueCharacters(), []);
    const trackingId = useMemo(() => `Stlea-${generateTrackingId(10)}`, []);

    const [uploadImages, setUploadImages] = useState<IUploadImage[]>([]);

    const onFilesAdded = (files: File[]) => {
        const maxSize = 100 * 1024;
        const filteredFiles = files.filter((file) => file.size <= maxSize);
        if (filteredFiles.length < files.length) {
            alert("Some files were too large and have been skipped (max 100 KB).");
        }
        const newUploads = filteredFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
        }));
        setUploadImages((curr) => [...curr, ...newUploads]);
    };

    useEffect(() => {
        if (uploadImages.length === 0) return;

        const interval = setInterval(() => {
            setUploadImages((currUploads) =>
                currUploads.map((img) => {
                    if (img.uploaded) return img;
                    const nextProgress = img.progress + 10;
                    if (nextProgress >= 100) {
                        return { ...img, progress: 100, uploaded: true };
                    }
                    return { ...img, progress: nextProgress };
                })
            );
        }, 300);

        return () => clearInterval(interval);
    }, [uploadImages.length]);

    const handleDeleteImage = (preview: string) => {
        setUploadImages((curr) => curr.filter((img) => img.preview !== preview));
    };

    const onSubmit = async (data: ShippingFormData) => {
        try {
            const base64Images = await Promise.all(uploadImages.map((img) => fileToBase64(img.file)));
          
            const payload = {
                ...data,
                carrierReference: referenceId,
                TrackingId: trackingId,
                imageParcelImages: base64Images,
            };
            await handleUseCreateShippingOrder(payload as any);
            reset();
            setUploadImages([]);
        } catch (error) {
            console.error("Error converting images to base64:", error);
            alert("Failed to process images. Please try again.");
        }
    };

    const senderFields = [
        { id: "senderName", label: "Sender Name", placeholder: "Sender Name", type: "text" },
        { id: "senderPhone", label: "Sender Phone", placeholder: "Sender Phone", type: "text" },
        { id: "senderEmail", label: "Sender Email", placeholder: "Sender Email", type: "text" },
        { id: "senderAddres", label: "Sender Address", placeholder: "Sender Address", type: "text" },
    ];

    const receiverFields = [
        { id: "receiverName", label: "Receiver Name", placeholder: "Receiver Name", type: "text" },
        { id: "receiverPhone", label: "Receiver Phone", placeholder: "Receiver Phone", type: "text" },
        { id: "receiverEmail", label: "Receiver Email", placeholder: "Receiver Email", type: "text" },
        { id: "receiverAddres", label: "Receiver Address", placeholder: "Receiver Address", type: "text" },
    ];

    const shipmentFields = [
        {
            id: "shipmentMode",
            label: "Shipment Mode",
            type: "select",
            options: ["Select mode", "Air Flight", "International Shipping", "Truckload", "Van Move", "Others"],
        },
        { id: "destination", label: "Destination", placeholder: "Destination", type: "text" },
        { id: "weight", label: "Weight", placeholder: "Weight", type: "text" },
        { id: "deliveryDate", label: "Expected Delivery Date", type: "datetime-local" },
        { id: "pickUpTime", label: "Pick-up Time", placeholder: "1:00 AM", type: "datetime-local" },
        { id: "departureTime", label: "Departure Time", placeholder: "2:00 PM", type: "datetime-local" },
        { id: "courierName", label: "Courier", placeholder: "Courier", type: "text" },
        { id: "totalFreight", label: "Total Freight", placeholder: "Total Freight", type: "text" },
        { id: "product", label: "Product", placeholder: "Product", type: "text" },
        { id: "mode", label: "Mode", placeholder: "Mode", type: "text" },
        { id: "origin", label: "Origin", placeholder: "Origin", type: "text" },
        { id: "quantity", label: "Quantity", placeholder: "Quantity", type: "number" },
        {
            id: "paymentMode",
            label: "Payment Mode",
            type: "select",
            options: ["Select payment mode", "Cash", "Transfer", "Cheque", "Cryptocurrency"],
        },
    ];

    return (
        <div className="flex justify-center px-4 py-8">
            <div className="w-full max-w-4xl">
                <ComponentCard title="Create Shipping Order">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <section>
                            <h4 className="font-bold mb-4">Sender's Info</h4>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {senderFields.map(({ id, label, placeholder, type }) => (
                                    <div key={id}>
                                        <Label htmlFor={id}>{label}</Label>
                                        <Input
                                            id={id}
                                            placeholder={placeholder}
                                            type={type}
                                            {...register(id as any)}
                                            error={errors[id as keyof ShippingFormData]?.message ? true : false}
                                            hint={errors[id as keyof ShippingFormData]?.message || ""}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h4 className="font-bold mb-4">Receiver Info</h4>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {receiverFields.map(({ id, label, placeholder, type }) => (
                                    <div key={id}>
                                        <Label htmlFor={id}>{label}</Label>
                                        <Input
                                            id={id}
                                            placeholder={placeholder}
                                            type={type}
                                            {...register(id as any)}
                                            error={errors[id as keyof ShippingFormData]?.message ? true : false}
                                            hint={errors[id as keyof ShippingFormData]?.message || ""}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h4 className="font-bold mb-4">Shipment Information</h4>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {shipmentFields.map(({ id, label, placeholder, type, options }) => (
                                    <div key={id}>
                                        <Label htmlFor={id}>{label}</Label>
                                        {type === "select" ? (
                                            <select
                                                id={id}
                                                {...register(id as any)}
                                                className="block w-full rounded-lg border border-gray-300 p-3 text-sm placeholder-gray-500 focus:border-fuchsia-300"
                                            >
                                                {options?.map((opt, idx) => (
                                                    <option key={idx} value={idx === 0 ? "" : opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <Input
                                                id={id}
                                                placeholder={placeholder}
                                                type={type}
                                                {...register(id as any)}
                                                error={errors[id as keyof ShippingFormData]?.message ? true : false}
                                                hint={errors[id as keyof ShippingFormData]?.message || ""}
                                            />
                                        )}
                                    </div>
                                ))}

                                {/* Carrier Reference (disabled) */}
                                <div>
                                    <Label htmlFor="carrierReference">Carrier Reference</Label>
                                    <Input id="carrierReference" value={referenceId} disabled className="bg-gray-100" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="mb-4">
                                <Label htmlFor="trackingId">Tracking Id</Label>
                                <Input id="trackingId" defaultValue={trackingId} />
                            </div>

                            <div>
                                <Label htmlFor="description">Parcel Description</Label>
                                <TextArea
                                    id="description"
                                    placeholder="Description"
                                    {...register("description")}
                                    error={!!errors.description?.message}
                                    hint={errors.description?.message || ""}
                                />
                            </div>
                        </section>

                        <section>
                            <DropzoneComponent
                                onFilesAdded={onFilesAdded}
                                uploadImages={uploadImages}
                                onDeleteImage={handleDeleteImage}
                            />
                        </section>

                        <button
                            type="submit"
                            disabled={isCreatingShippingOrder}
                            className="mt-4 w-full rounded bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-70"
                        >
                            {isCreatingShippingOrder ? "Creating Order..." : "Create Order"}
                        </button>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}
