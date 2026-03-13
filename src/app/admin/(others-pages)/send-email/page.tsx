"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import useSendEmail from "../../../../../hooks/useSendEmail/useSendEmail";

// import useSendShippingOrderEmail from "../../../../../../../../hooks/useSendShippingOrderEmail"; // adjust path

const sendEmailSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required"),
    name: z.string().min(1, "Name is required"),
    purpose: z.string().min(1, "Purpose is required"),
});

export type SendEmailFormData = z.infer<typeof sendEmailSchema>;

export default function SendShippingOrderEmailForm() {
    const { handleSendEmail, isSending } = useSendEmail();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SendEmailFormData>({
        resolver: zodResolver(sendEmailSchema),
    });

    const onSubmit = async (data: SendEmailFormData) => {
        await handleSendEmail(data);

    };

    return (
        <div className="flex justify-center px-4 py-8">
            <div className="w-full max-w-3xl">
                <ComponentCard title="Send Email">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div>
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                placeholder="Your Name"
                                {...register("name")}
                                error={!!errors.name?.message}
                                hint={errors.name?.message || ""}
                            />
                        </div>


                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="Subject"
                                {...register("subject")}
                                error={!!errors.subject?.message}
                                hint={errors.subject?.message || ""}
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Recipient Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Recipient Email"
                                {...register("email")}
                                error={!!errors.email?.message}
                                hint={errors.email?.message || ""}
                            />
                        </div>

                        

                        

                        <div>
                            <Label htmlFor="purpose">Purpose</Label>
                            <Input
                                id="purpose"
                                placeholder="Purpose of Email"
                                {...register("purpose")}
                                error={!!errors.purpose?.message}
                                hint={errors.purpose?.message || ""}
                            />
                        </div>

                        <div>
                            <Label htmlFor="message">Message</Label>
                            <TextArea
                                id="message"
                                placeholder="Your message"
                                rows={8}
                                {...register("message")}
                                error={!!errors.message?.message}
                                hint={errors.message?.message || ""}
                            />
                        </div>


                        <button
                            type="submit"
                            disabled={isSending}
                            className="mt-4 w-full rounded bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-70"
                        >
                            {isSending ? "Sending Email..." : "Send Email"}
                        </button>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}
