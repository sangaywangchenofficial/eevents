import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Added useNavigate
import { AdminLayout } from '../../AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiSearch, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi'
import { CSVLink } from 'react-csv';

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const navigate = useNavigate(); // For navigation

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setIsLoading(true);
        fetch('http://127.0.0.1:8000/api/v1/view-categories/')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("Django API Response Data:", data);
                const categoriesArray = Array.isArray(data) ? data : (data.data || data.results || []);
                setCategories(categoriesArray);
                setAllCategories(categoriesArray);
            })
            .catch(err => {
                console.error("API Error:", err);
                toast.error("Failed to load categories");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Search filter
    const handleSearch = (searchCategory) => {
        const keywords = searchCategory.toLowerCase().trim(); // FIXED: Added trim()

        if (!keywords) {
            setCategories(allCategories);
            return;
        }

        const filteredCategories = allCategories.filter((category) => {
            const categoryName = category.name || category.category_name || category.title || "";
            return categoryName.toLowerCase().includes(keywords);
        });

        console.log("Filtered Categories:", filteredCategories);
        setCategories(filteredCategories);
    };

    // Delete category
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this Category?")) {
            return;
        }

        setIsLoading(true);
        fetch(`http://127.0.0.1:8000/api/v1/category-details/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',

            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                toast.success(data.message || "Category deleted successfully!");
                fetchCategories();
            })
            .catch(err => {
                console.error("Delete Error:", err);
                toast.error(err.message || "Failed to delete category");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <AdminLayout>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    theme="dark"
                />

                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Manage Category
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="w-full sm:w-auto bg-gray-100 dark:bg-stone-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-stone-700 transition-colors">
                            <span className="text-gray-600 dark:text-stone-300 text-sm font-medium">
                                Total Categories: <strong className="text-gray-900 dark:text-stone-100">
                                    {categories ? categories.length : 0}
                                </strong>
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
                                    { label: 'Creation Date', key: 'creation_date' },
                                ]}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <FiDownload className="w-4 h-4" />
                                Download CSV
                            </CSVLink>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm transition-colors">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-gray-500 dark:text-stone-400">Loading...</div>
                            </div>
                        ) : (
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
                                    {categories && categories.length > 0 ? (
                                        categories.map((category, index) => (
                                            <tr key={category.id || category.pk || index} className="hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors">
                                                <td className="px-6 py-3 text-center font-medium text-gray-500 dark:text-stone-400">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-3 font-medium text-gray-900 dark:text-stone-100">
                                                    {category.name || category.category_name || category.title || "No Name Found"}
                                                </td>
                                                <td className="px-6 py-3 text-gray-500 dark:text-stone-400">
                                                    {category.creation_date ? new Date(category.creation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <Link to={`/edit-category/${category.id || category.pk}`} >
                                                            <button
                                                                title="Edit"
                                                                className="text-blue-600 hover:text-blue-700 transition-colors"
                                                                disabled={isLoading}
                                                            >
                                                                <FiEdit className="w-4 h-4" />
                                                            </button>
                                                        </Link>

                                                        <button
                                                            onClick={() => handleDelete(category.id || category.pk)}
                                                            title="Delete"
                                                            className="text-red-600 hover:text-red-700 transition-colors"
                                                            disabled={isLoading}
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-stone-400">
                                                No categories found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </>
    );
};

export default ManageCategory;