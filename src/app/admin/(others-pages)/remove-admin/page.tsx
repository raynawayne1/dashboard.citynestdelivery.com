"use client";

import Spinner from "@/components/Spinner/Spinner";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../../../Authcontext/AuthContext";
import useRmoveAdmin from "../../../../../hooks/useAdmin/useRmoveAdmin";
import useRemoveRole from "../../../../../hooks/useAdmin/useRmoveAdmin";

// Define the validation schema using zod
const roleSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
    role: z
        .string()
        .min(1, "Role is required")
        .max(50, "Role name too long"), // Optionally define a max length for the role
});

type RoleFormData = z.infer<typeof roleSchema>;

export default function Page() {
    const { isRemovingRole, handleUseRemoveRole } = useRemoveRole();

    // Initialize react-hook-form with zod validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
    });

    const onSubmit = (data: RoleFormData) => {
        handleUseRemoveRole(data, reset); // Pass form data to create or update role
    };

    return (
        <div>
            <ComponentCard title="Modify someone's role on your platform">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label htmlFor="email">Change Role</Label>
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
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
                            type="text"
                            placeholder="Enter role, e.g., 'editor', 'moderator', etc."
                            {...register("role")} // Register input with react-hook-form
                            error={errors.role?.message ? true : false} // Display error message
                            hint={errors.role?.message ? errors.role?.message : ""}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        >
                            {isRemovingRole ? <Spinner /> : "Submit"}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
}
