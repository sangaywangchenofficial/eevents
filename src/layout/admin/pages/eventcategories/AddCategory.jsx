import React, { useState } from 'react';
import { BiCategory, BiPlusCircle, BiLoaderAlt } from 'react-icons/bi';
import { MdOutlineFastfood } from 'react-icons/md';
import { toast } from 'react-toastify';
import { AdminLayout } from '../../AdminLayout';
import { ToastContainer } from 'react-toastify';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic trim check to prevent submission of whitespace strings
        if (!categoryName.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        setIsSubmitting(true);

        try {
            // Updated API endpoint for event category
            const response = await fetch('http://127.0.0.1:8000/api/v1/add-category/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category_name: categoryName.trim() })

            });

            const data = await response.json();

            if (response.status === 201 || response.status === 200) {
                toast.success(data.message || 'Event category added successfully!');
                setCategoryName('');
            } else {
                toast.error(data.message || 'Failed to create event category');
            }
        } catch (error) {
            toast.error('Error Connecting to Server');
            console.error(error)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <AdminLayout>
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />

                <div className="max-w-2xl mx-auto mt-8 px-4">

                    {/* Page Navigation Title & Breadcrumb Block */}
                    <div className="mb-6">
                        <h1 className="text-xl font-bold font-serif text-stone-100 tracking-wide flex items-center gap-2">
                            <MdOutlineFastfood className="text-purple-400" />
                            Event Category
                        </h1>
                        <p className="text-xs text-stone-400 mt-1">
                            Create new event category classifications for your event management system.
                        </p>
                    </div>

                    {/* Main Form Interactive Card */}
                    <div className="bg-zinc-950 border border-stone-800/80 rounded-2xl shadow-xl overflow-hidden group/card hover:border-purple-500/20 transition-all duration-300">
                        <div className="border-b border-stone-800/60 bg-stone-950/40 px-6 py-4 flex items-center gap-2.5">
                            <BiPlusCircle className="text-purple-400 text-lg" />
                            <h2 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                                Add New Category
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Category Input Field Block */}
                            <div>
                                <label htmlFor="categoryName" className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                    Category Name
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-300">
                                        <BiCategory className="text-lg" />
                                    </div>
                                    <input
                                        id="categoryName"
                                        type="text"
                                        required
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        disabled={isSubmitting}
                                        className="w-full pl-10 pr-4 py-3 bg-stone-900/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        placeholder="e.g., Conference, Workshop, Seminar, Gala"
                                        maxLength={50}
                                    />
                                </div>
                            </div>

                            {/* Submit Action Execution Tray */}
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-purple-950/40 active:scale-[0.98] transition-all duration-300 flex items-center gap-2 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <BiLoaderAlt className="animate-spin text-lg" />
                                            <span>Saving Category...</span>
                                        </>
                                    ) : (
                                        <>
                                            <BiPlusCircle className="text-base" />
                                            <span>Add Category</span>
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </AdminLayout>

        </>
    );
};

export default AddCategory;