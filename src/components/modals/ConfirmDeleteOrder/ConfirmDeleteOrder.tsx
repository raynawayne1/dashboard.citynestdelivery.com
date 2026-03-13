"use client";
import React from "react";
import { Modal } from "../../ui/modal"; // Assuming you have a modal component
import Button from "../../ui/button/Button"; // Your button component
import Spinner from "@/components/Spinner/Spinner"; // Import the Spinner component

interface DeleteConfirmationModalProps {
    onDelete: () => void; // The function that will be called to delete the item
    isLoading: boolean; // The loading state for the delete action
    itemName: string | null; // The name of the item being deleted (e.g., Order Name)
    isOpen: boolean; // Controlled prop for opening/closing the modal
    openModal: () => void; // Function to open the modal
    closeModal: () => void; // Function to close the modal
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    onDelete,
    isLoading,
    itemName,
    isOpen,
    closeModal
}) => {
    const handleDelete = () => {
        onDelete(); // Trigger the delete action

        // Simulate the deletion process (e.g., API call)
        setTimeout(() => {
            // Simulate successful delete logic
            closeModal(); // Close the modal after successful deletion
        }, 2000); // Simulate some delay (like waiting for API response)
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            showCloseButton={false}
            className="max-w-[507px] p-6 lg:p-10"
        >
            <div className="text-center">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                    Are you sure you want to delete this {itemName}?
                </h4>
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                    This action cannot be undone.
                </p>

                <div className="flex items-center justify-center w-full gap-3 mt-8">
                    {/* Cancel Button */}
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Cancel
                    </Button>

                    {/* Confirm Delete Button */}
                    <Button
                        size="sm"
                        onClick={handleDelete}
                        disabled={isLoading} // Disable button if loading
                        className={`flex items-center gap-2 ${isLoading ? 'bg-gray-300' : 'bg-red-500'} text-white`} // Change button color when loading
                    >
                        {isLoading && <Spinner />} {/* Show spinner when loading */}
                        Confirm Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;
