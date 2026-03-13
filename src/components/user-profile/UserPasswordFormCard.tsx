"use client";
import React from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import useEditPassword from "../../../hooks/useUser/useEditPassword";
import { useAuth } from "../../../Authcontext/AuthContext";
import { useForm } from "react-hook-form";  // Import from react-hook-form
import { zodResolver } from "@hookform/resolvers/zod";  // Import zodResolver
import { z } from "zod";  // Import zod

// Zod schema for validation
const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password is too long."),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password is too long.")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
})

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function UserPasswordFormCard() {
  const { user } = useAuth(); // Get the current logged-in user

  if (!user) {
    return <div>User not logged in</div>; // Early return if there's no logged-in user
  }

  const userId = user?.uid; // Use the user ID from the authenticated user

  // Use the custom hook for password editing
  const { isUpdatingPassword, handlePasswordUpdate } = useEditPassword({ userId });

  // Use useForm with Zod validation schema
  const {handleSubmit, register, reset, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Handle form submission
  const onSubmit = async (data: PasswordFormData) => {
    // Pass the form data to the hook handler
    await handlePasswordUpdate(data.newPassword, data.confirmPassword);

    // Reset form fields after successful password update
    reset({
      newPassword: '',
      confirmPassword: '',
    });
    // Close the modal after successful password update
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Account Password Change
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Change Password
                  </h5>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="w-full">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="password"
                        {...register("newPassword")}
                        error={errors?.newPassword?.message ? true : false}
                        hint={errors?.newPassword?.message}
                      />

                    </div>

                    <div className="w-full">
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword")}
                        error={errors?.confirmPassword?.message ? true : false}
                        hint={errors?.confirmPassword?.message}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-2 mt-6">
                <Button size="sm" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? 'Updating...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
