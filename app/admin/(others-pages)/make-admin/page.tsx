"use client";

import Spinner from "@/components/Spinner/Spinner";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useCreateAdmin from "../../../../hooks/useAdmin/useCreateAdmin";
import { useAuth } from "../../../../Authcontext/AuthContext";

// Define the validation schema using zod
const adminSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
});

type AdminFormData = z.infer<typeof adminSchema>;

export default function Page() {
    const { isCreatingAdmin, handleUseCreateAdmin } = useCreateAdmin();

    console.log("isCreatingAdmin:", isCreatingAdmin); // Debug log to see if state changes

    // Initialize react-hook-form with zod validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AdminFormData>({
        resolver: zodResolver(adminSchema),
    });

    const onSubmit = (data: AdminFormData) => {
        handleUseCreateAdmin(data, reset); // Pass form data to create admin
    };

    const { userRole } = useAuth();


    return (
        <div>
            <ComponentCard title="Make someone admin to help you control your dashboard">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label htmlFor="email">Make Admin</Label>
                        <Input
                            id="email"
                            type="text"
                            placeholder="info@gmail.com"
                            {...register("email")} // Register input with react-hook-form
                            error={errors.email?.message ? true : false} // Display error message
                            hint={errors.email?.message ? errors.email?.message : ""}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        >
                            {isCreatingAdmin ? <Spinner /> : "Submit"}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
}
