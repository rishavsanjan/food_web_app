import React from 'react';
import { Trash2, X } from 'lucide-react';
import axios from 'axios';

const DeleteConfirmationModal = ({ deleteSelected, setDeleteModal, setMenu }) => {

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        const response = await axios({
            url: `http://localhost:3000/api/rest/menu`,
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setMenu(prev =>
            prev.map((dish) => {
                if (dish.menu_id !== deleteSelected.menu_id) {
                    return dish;
                }
            })
        );
        setDeleteModal(false);
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-700 to-purple-800 rounded-2xl p-6 max-w-md w-full border border-purple-400/30 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500/20 p-2 rounded-lg">
                            <Trash2 className="w-6 h-6 text-red-400" />
                        </div>
                        <h2 className="text-white text-xl font-semibold">Delete Dish</h2>
                    </div>
                    <button
                        onClick={() => { setDeleteModal(false) }}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-300 mb-4">
                        Are you sure you want to delete this dish?
                    </p>
                    {deleteSelected && (
                        <div className="bg-purple-600/50 rounded-lg p-4 border border-purple-400/20">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-white font-semibold">{deleteSelected.menu_name}</h3>
                                <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                                    {deleteSelected.category === 'veg' ? 'veg' : 'non_veg'}
                                </span>
                            </div>
                            <p className="text-green-400 font-bold">₹{deleteSelected.price}</p>
                        </div>
                    )}
                    <p className="text-red-400 text-sm mt-3">
                        This action cannot be undone.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => { setDeleteModal(false) }}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            handleDelete()

                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;