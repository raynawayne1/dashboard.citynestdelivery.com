"use client"
import React from "react";



import { useRouter } from "next/navigation";

const page = () => {
    const router = useRouter();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Check Your Email</h1>
                <p className="text-gray-600 mb-6">
                    A verification link has been sent to your email. Please check your inbox and verify your email address before logging in.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-600 transition duration-300"
                >
                    Go Back to Home
                </button>
            </div>
        </div>
    );
};

export default page;
