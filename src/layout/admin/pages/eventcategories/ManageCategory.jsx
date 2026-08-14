import React from 'react'
import { useState, useEffect } from 'react'
import { AdminLayout } from '../../AdminLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiSearch, FiEdit, FiTrash2, FiRefreshCw, FiDownload } from 'react-icons/fi'
import { CSVLink } from 'react-csv';

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]); // to store all categories during search

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/view-categories/')
            .then(res => res.json()) // Convert the response to JSON format
            .then(data => {
                console.log("Django API Response Data:", data);
                const categoriesArray = Array.isArray(data) ? data : (data.data || data.results || []);
                setCategories(categoriesArray);
                setAllCategories(categoriesArray);
            })
            .catch(err => console.error("API Error:", err))
    }, [])

    // to filter with input
    const handleSearch = (searchCategory) => {
        const keywords = searchCategory.toLowerCase(); // to convert the input value to lower case

        if (!keywords.trim()) { // FIXED: Added .trim() to handle empty spaces
            setCategories(allCategories);
            return;
        }
        else {
            const filteredCategories = allCategories.filter((category) => {
                const categoryName = category.name || category.category_name || category.title || "";
                return categoryName.toLowerCase().includes(keywords);
            });

            console.log(filteredCategories);
            setCategories(filteredCategories); // set the filtered categories to the state
        }
    };

    return (
        <>
            <AdminLayout>
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />

                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Category</h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="w-full sm:w-auto bg-gray-100 dark:bg-stone-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-stone-700 transition-colors">
                            <span className="text-gray-600 dark:text-stone-300 text-sm font-medium">
                                Total Categories: <strong className="text-gray-900 dark:text-stone-100">{categories ? categories.length : 0}</strong>
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="w-full sm:w-72 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FiSearch className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by category name..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-stone-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>

                            <CSVLink
                                data={categories}
                                filename={'categories.csv'}
                                headers={[
                                    { label: 'Category Name', key: 'name' },
                                    { label: 'Creation Date', key: 'created_at' },
                                ]}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <FiDownload className="w-4 h-4" />
                                Download CSV
                            </CSVLink>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm transition-colors">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-stone-800/50 border-b border-gray-200 dark:border-stone-700 text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase">
                                    <th className="px-6 py-3 text-center w-20">Sr.No</th>
                                    <th className="px-6 py-3">Category Name</th>
                                    <th className="px-6 py-3">Creation Date</th>
                                    <th className="px-6 py-3 text-center w-40">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-stone-700 text-sm text-gray-700 dark:text-stone-300">
                                {categories && categories.map((category, index) => (
                                    <tr key={category.id || category.pk || index} className="hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors">
                                        <td className="px-6 py-3 text-center font-medium text-gray-500 dark:text-stone-400">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-stone-100">
                                            {category.name || category.category_name || category.title || "No Name Found"}
                                        </td>
                                        <td className="px-6 py-3 text-gray-500 dark:text-stone-400">
                                            {category.created_at || category.createdAt || category.created || "N/A"}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-center gap-3">
                                                <button title="Update" className="text-amber-600 hover:text-amber-700 transition-colors">
                                                    <FiRefreshCw className="w-4 h-4" />
                                                </button>
                                                <button title="Edit" className="text-blue-600 hover:text-blue-700 transition-colors">
                                                    <FiEdit className="w-4 h-4" />
                                                </button>
                                                <button title="Delete" className="text-red-600 hover:text-red-700 transition-colors">
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AdminLayout>
        </>
    )
}

export default ManageCategory