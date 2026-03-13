"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaUserAlt, FaEnvelope, FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaGlobe, FaRegClock, FaWallet, FaUser } from 'react-icons/fa'; // Imported necessary icons
import PageLoader from '@/components/Spinner/PageLoader';
import useUserById from '../../../../../../../hooks/useUser/useUserById';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import formatFullDateTimeWithAMPM from '@/components/lib/helpers/formatFullDateTimeWithAMPM/formatFullDateTimeWithAMPM';
import RenderStatusBadge from '@/components/lib/helpers/RenderStatusBadge/RenderStatusBadge';
import { formatAmount } from '@/components/lib/helpers/FormateAmount/Formatemount';
import OrdersTable from '@/components/tables/OrdersTable';



export default function Page() {
    const params = useParams();
    const id = params?.id ?? ''; // Use optional chaining and a fallback empty string
    const userId = typeof id === 'string' ? id : '';
    const { user, isLoadingUser } = useUserById(userId);


    if (isLoadingUser) {
        return <PageLoader />;
    }

    if (!user) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center">
                    <p className="text-xl text-gray-500">User not found!</p>
                </div>
            </div>
        );
    }


    // Logic to determine the "Completed" status based on email verification and order status
    const getOrderStatus = (orderStatus: string, emailVerified: boolean) => {
        if (orderStatus === 'success' || emailVerified) {
            return 'Completed'; // If the order status is "success" or email is verified, status is "Completed"
        }
        return orderStatus || "Pending"; // Otherwise, keep the existing status
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">User Information</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 mb-5 lg:grid-cols-3 gap-6">
                    {/* User Detail Cards */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaUserAlt className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Full Name</h3>
                                <p className="text-sm text-gray-600">{user.fullName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaUser className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Username</h3>
                                <p className="text-sm text-gray-600">{user.username}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaWallet className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Balance</h3>
                                <p className="text-sm text-gray-600">{formatAmount(user.balance || 0)}</p>
                            </div>
                        </div>
                    </div>


                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaEnvelope className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Email</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                    </div>


                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaMapMarkerAlt className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Country</h3>
                                <p className="text-sm text-gray-600">{user.country}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaPhoneAlt className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                                <p className="text-sm text-gray-600">{user.phone || 'Not Available'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaGlobe className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Timezone</h3>
                                <p className="text-sm text-gray-600">{user.timezone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaRegClock className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Status</h3>
                                {user.emailVerified ?
                                    <span className='text-green-800'>Active</span>
                                    : <span className=' text-yellow-800 '>Not Active</span>}

                            </div>

                        </div>
                    </div>

                    {/* Additional User Information */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaMapMarkerAlt className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Region</h3>
                                <p className="text-sm text-gray-600">{user.regionName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaMapMarkerAlt className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">City</h3>
                                <p className="text-sm text-gray-600">{user.city}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <img src={user.photoURL} alt="User Photo" className="w-12 h-12 rounded-full border" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Profile Picture</h3>
                                <p className="text-sm text-gray-600">User's profile picture from Google</p>
                            </div>
                        </div>
                    </div>

                    {/* Displaying Additional Fields */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Email Verified</h3>
                                <p className="text-sm text-gray-600">{user.emailVerified ? "Yes" : "No"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Role</h3>
                                <p className="text-sm text-gray-600">{user.role || 'Not Available'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">User ID (UID)</h3>

                                <p className="text-sm text-gray-600">{user.uid}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Ip Address</h3>
                                <p className="text-sm text-gray-600">{user.query}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Provider ID</h3>
                                <p className="text-sm text-gray-600">{user.providerId || 'Not Available'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Displaying Created and Updated Dates */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaRegClock className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Created At</h3>
                                <p className="text-sm text-gray-600">{formatFullDateTimeWithAMPM(new Date(user.createdAt.seconds * 1000))}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <FaRegClock className="text-xl text-blue-500" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Updated At</h3>
                                <p className="text-sm text-gray-600">{formatFullDateTimeWithAMPM(new Date(user.updatedAt.seconds * 1000))}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <PageBreadcrumb pageTitle="User Dashboard" />
                <div className="space-y-6">
                    <ComponentCard title="My Orders">
                        <OrdersTable paginatedOrders={user.orders} isLoadingOrders={isLoadingUser} errorMessage={""} />
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}
