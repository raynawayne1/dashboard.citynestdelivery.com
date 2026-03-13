"use client"

import useGetOrders from '../../../../../hooks/useOrder/useGetOrders';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import AdminTable from '@/components/tables/AdminTable';
import BasicTableOne from '@/components/tables/BasicTableOne';
import OrdersTable from '@/components/tables/OrdersTable';
import React from 'react'
import useGetAllAdmins from '../../../../../hooks/useAdmin/useGetAllAdmins';
import { useAuth } from '../../../../../Authcontext/AuthContext';
function page() {
    const { isLoadingAdmins, admins, currentUserId } = useGetAllAdmins();

    return (
        <div>
            <PageBreadcrumb pageTitle="My Admin (s)" />
            <div className="space-y-6">
                <ComponentCard title="My Admin (s)">
                    <AdminTable admins={admins} isLoadingAdmins={isLoadingAdmins} currentUserId={currentUserId} />
                </ComponentCard>
            </div>
        </div>
    )
}

export default page