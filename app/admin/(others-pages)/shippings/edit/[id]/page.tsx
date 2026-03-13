import CreateShippingForm from '@/components/CreateShippingForm/CreateShippingForm'
import EditShippingForm from '@/components/EditShippingForm/EditShippingForm'
import { EditCategorySchema } from '@/components/config/ZodSchema'
import React from 'react'

export default function page() {
    return (
        <div>
            <EditShippingForm />
        </div>
    )
}
