"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

import useEditShippingOrder from "../../../hooks/useShippingOrder/useEditShippingOrder";
import DropzoneComponent from "../form/input/DropZone";
import { IUploadImage } from "../Interface";
import useGetShippingOrderById from "../../../hooks/useShippingOrder/useGetShippingOrderById";
import { useParams } from "next/navigation";

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

export default function EditShippingForm() {
  const params = useParams();
  const shippingId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const { shippingOrder, isLoading } = useGetShippingOrderById(shippingId || "");
  const { isEditingShippingOrder, handleUseEditShippingOrder } = useEditShippingOrder();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {},
  });

  const [uploadImages, setUploadImages] = useState<IUploadImage[]>([]);

  useEffect(() => {
    if (shippingOrder) {
      reset({
        senderName: shippingOrder.senderName,
        senderPhone: shippingOrder.senderPhone,
        senderEmail: shippingOrder.senderEmail,
        senderAddres: shippingOrder.senderAddres,

        receiverName: shippingOrder.receiverName,
        receiverPhone: shippingOrder.receiverPhone,
        receiverEmail: shippingOrder.receiverEmail,
        receiverAddres: shippingOrder.receiverAddres,

        shipmentMode: shippingOrder.shipmentMode,
        destination: shippingOrder.destination,
        weight: shippingOrder.weight,
        deliveryDate: shippingOrder.deliveryDate,
        pickUpTime: shippingOrder.pickUpTime,
        departureTime: shippingOrder.departureTime,
        courierName: shippingOrder.courierName,
        totalFreight: shippingOrder.totalFreight,
        product: shippingOrder.product,
        mode: shippingOrder.mode,
        origin: shippingOrder.origin,
        quantity: shippingOrder.quantity,

        description: shippingOrder.description,
        paymentMode: shippingOrder.paymentMode,
      });

      if (shippingOrder.imageParcelImages?.length) {
        const existingImages = shippingOrder.imageParcelImages.map((img: string, idx: number) => ({
          file: null as any,
          preview: img,
          progress: 100,
          uploaded: true,
          id: idx,
        }));
        setUploadImages(existingImages);
      }
    }
  }, [shippingOrder, reset]);

  function onFilesAdded(files: File[]) {
    const maxSize = 100 * 1024; // 100KB limit
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
  }

  function handleDeleteImage(preview: string) {
    setUploadImages((curr) => curr.filter((img) => img.preview !== preview));
  }

  async function onSubmit(data: ShippingFormData) {
    try {
      const base64Images = await Promise.all(
        uploadImages.map(async (img) => {
          if (img.file) {
            return await fileToBase64(img.file);
          }
          return img.preview;
        })
      );

      const payload = {
        ...data,
        imageParcelImages: base64Images,
      };

      const success = await handleUseEditShippingOrder(shippingId || "", payload as any);
      if (success) {
        alert("Shipping order updated successfully");
      }
    } catch (error) {
      console.error("Error converting images to base64:", error);
      alert("Failed to process images. Please try again.");
    }
  }

  if (isLoading) return <p>Loading shipping order...</p>;

  // Group fields for rendering:

  const senderFields = [
    { id: "senderName", label: "Sender Name", placeholder: "Sender Name", type: "text" },
    { id: "senderPhone", label: "Sender Phone", placeholder: "Sender Phone", type: "text" },
    { id: "senderEmail", label: "Sender Email", placeholder: "Sender Email", type: "email" },
    { id: "senderAddres", label: "Sender Address", placeholder: "Sender Address", type: "text" },
  ];

  const receiverFields = [
    { id: "receiverName", label: "Receiver Name", placeholder: "Receiver Name", type: "text" },
    { id: "receiverPhone", label: "Receiver Phone", placeholder: "Receiver Phone", type: "text" },
    { id: "receiverEmail", label: "Receiver Email", placeholder: "Receiver Email", type: "email" },
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
    { id: "deliveryDate", label: "Expected Delivery Date", placeholder: "YYYY-MM-DD", type: "date" },
    { id: "pickUpTime", label: "Pick-up Time", placeholder: "1:00 AM", type: "time" },
    { id: "departureTime", label: "Departure Time", placeholder: "2:00 PM", type: "time" },
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
    <ComponentCard title="Edit Shipping Form" className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Sender Information</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {senderFields.map(({ id, label, placeholder, type }) => (
              <div key={id} className="flex flex-col">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  {...register(id)}
                  placeholder={placeholder}
                  type={type}
                  error={!!errors[id]}
                />
                {errors[id] && <p className="text-red-600 text-sm mt-1">{errors[id]?.message?.toString()}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-semibold mb-3">Receiver Information</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {receiverFields.map(({ id, label, placeholder, type }) => (
              <div key={id} className="flex flex-col">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  {...register(id)}
                  placeholder={placeholder}
                  type={type}
                  error={!!errors[id]}
                />
                {errors[id] && <p className="text-red-600 text-sm mt-1">{errors[id]?.message?.toString()}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-semibold mb-3">Shipment Details</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {shipmentFields.map(({ id, label, placeholder, type, options }) => {
              if (type === "select") {
                return (
                  <div key={id} className="flex flex-col">
                    <Label htmlFor={id}>{label}</Label>
                    <select
                      id={id}
                      {...register(id)}
                      className={`border rounded px-2 py-1 ${
                        errors[id] ? "border-red-600" : "border-gray-300"
                      }`}
                      defaultValue=""
                    >
                      {options?.map((opt) => (
                        <option key={opt} value={opt === "Select mode" || opt === "Select payment mode" ? "" : opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors[id] && <p className="text-red-600 text-sm mt-1">{errors[id]?.message?.toString()}</p>}
                  </div>
                );
              }

              return (
                <div key={id} className="flex flex-col">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    {...register(id)}
                    placeholder={placeholder}
                    type={type}
                    error={!!errors[id]}
                  />
                  {errors[id] && <p className="text-red-600 text-sm mt-1">{errors[id]?.message?.toString()}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-semibold mb-3">Description</h2>
          <div className="flex flex-col">
            <textarea
              {...register("description")}
              rows={4}
              className={`border rounded px-2 py-1 resize-none ${
                errors.description ? "border-red-600" : "border-gray-300"
              }`}
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message?.toString()}</p>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-semibold mb-3">Parcel Images (max size 100KB each)</h2>
          <DropzoneComponent onFilesAdded={onFilesAdded} />
          <div className="mt-4 flex flex-wrap gap-3">
            {uploadImages.map((img, idx) => (
              <div
                key={img.preview + idx}
                className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden"
              >
                <img
                  src={img.preview}
                  alt="Parcel preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.preview)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  aria-label="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={isEditingShippingOrder}
          className={`w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50`}
        >
          {isEditingShippingOrder ? "Updating..." : "Update Shipping Order"}
        </button>
      </form>
    </ComponentCard>
  );
}

// Helper for converting file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject("Failed to read file");
    };
    reader.onerror = (error) => reject(error);
  });
}
