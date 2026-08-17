import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiArrowLeft, FiSave, FiX, FiLoader } from 'react-icons/fi';

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');

    // State variables
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('active');
    const [parentCategory, setParentCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [parentCategories, setParentCategories] = useState([]);
    const [errors, setErrors] = useState({});

    // Check authentication
    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }
        fetchCategoryDetails();
        fetchParentCategories();
    }, [id, adminUser]); // Added dependencies

    // Fetch category details
    const fetchCategoryDetails = () => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/api/v1/category-details/${id}/`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Category Details:', data);
                setCategoryName(data.name || data.category_name || '');
                setDescription(data.description || data.category_description || '');
                setStatus(data.status || 'active');
                setParentCategory(data.parent_category || data.parent_id || '');
            })
            .catch(err => {
                console.error("Error fetching category:", err);
                toast.error(err.message || "Failed to load category details");
                navigate('/manage-category');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Fetch parent categories
    const fetchParentCategories = () => {
        fetch('http://127.0.0.1:8000/api/v1/view-categories/')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                const categoriesArray = Array.isArray(data) ? data : (data.data || data.results || []);
                // Filter out current category to prevent self-referencing
                const filteredCategories = categoriesArray.filter(cat =>
                    (cat.id !== parseInt(id)) && (cat.pk !== parseInt(id))
                );
                setParentCategories(filteredCategories);
            })
            .catch(err => {
                console.error("Error fetching parent categories:", err);
            });
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!categoryName.trim()) {
            newErrors.categoryName = 'Category name is required';
        } else if (categoryName.trim().length < 2) {
            newErrors.categoryName = 'Category name must be at least 2 characters';
        } else if (categoryName.trim().length > 50) {
            newErrors.categoryName = 'Category name must be less than 50 characters';
        }

        if (description && description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission - UPDATE category
    const handleUpdate = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.warning('Please fix the errors before submitting');
            return;
        }

        setSaving(true);

        // Prepare data for update
        const updateData = {
            name: categoryName.trim(),
            description: description.trim(),
            status: status,
            parent_category: parentCategory || null,
        };

        fetch(`http://127.0.0.1:8000/api/v1/category-details/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(errData => {
                        throw new Error(errData.message || errData.error || `HTTP error! status: ${res.status}`);
                    });
                }
                return res.json();
            })
            .then(data => {
                toast.success(data.message || "Category updated successfully!");
                setTimeout(() => {
                    navigate('/manage-category');
                }, 1500);
            })
            .catch(err => {
                console.error("Update Error:", err);
                toast.error(err.message || "Failed to update category");
            })
            .finally(() => {
                setSaving(false);
            });
    };

    // Handle cancel
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Any changes will be lost.')) {
            navigate('/manage-category');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <FiLoader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-stone-400">Loading category details...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Edit Category
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-stone-400 mt-1">
                            Update category details
                        </p>
                    </div>
                    <Link
                        to="/manage-category"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-gray-700 dark:text-stone-300 text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Categories
                    </Link>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm">
                    <form onSubmit={handleUpdate} className="p-6 space-y-6">
                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => {
                                    setCategoryName(e.target.value);
                                    if (errors.categoryName) {
                                        setErrors(prev => ({ ...prev, categoryName: '' }));
                                    }
                                }}
                                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors
                                    ${errors.categoryName
                                        ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
                                        : 'border-gray-300 dark:border-stone-700 focus:ring-blue-500 dark:focus:ring-blue-400'
                                    }
                                    bg-white dark:bg-stone-800 text-gray-900 dark:text-stone-100
                                `}
                                placeholder="Enter category name"
                            />
                            {errors.categoryName && (
                                <p className="mt-1 text-sm text-red-500">{errors.categoryName}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    if (errors.description) {
                                        setErrors(prev => ({ ...prev, description: '' }));
                                    }
                                }}
                                rows="4"
                                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors
                                    ${errors.description
                                        ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
                                        : 'border-gray-300 dark:border-stone-700 focus:ring-blue-500 dark:focus:ring-blue-400'
                                    }
                                    bg-white dark:bg-stone-800 text-gray-900 dark:text-stone-100
                                `}
                                placeholder="Enter category description (optional)"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500 dark:text-stone-400">
                                {description.length}/500 characters
                            </p>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                                Status
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="active"
                                        checked={status === 'active'}
                                        onChange={() => setStatus('active')}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-stone-700"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-stone-300">Active</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="inactive"
                                        checked={status === 'inactive'}
                                        onChange={() => setStatus('inactive')}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-stone-700"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-stone-300">Inactive</span>
                                </label>
                            </div>
                        </div>

                        {/* Parent Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                                Parent Category
                            </label>
                            <select
                                value={parentCategory}
                                onChange={(e) => setParentCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors bg-white dark:bg-stone-800 text-gray-900 dark:text-stone-100"
                            >
                                <option value="">None (Top Level)</option>
                                {parentCategories.map(category => (
                                    <option
                                        key={category.id || category.pk}
                                        value={category.id || category.pk}
                                    >
                                        {category.name || category.category_name || category.title}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-stone-400">
                                Select a parent category to create a sub-category
                            </p>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-stone-700">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {saving ? (
                                    <>
                                        <FiLoader className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="w-4 h-4" />
                                        Update Category
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-gray-700 dark:text-stone-300 text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                                <FiX className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Information Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                        ℹ️ Information
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                        • Category ID: {id}<br />
                        • All fields marked with <span className="text-red-500">*</span> are required<br />
                        • Category name must be unique and at least 2 characters long
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditCategory;