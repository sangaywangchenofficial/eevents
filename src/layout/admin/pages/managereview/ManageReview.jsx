import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FiSearch,
    FiTrash2,
    FiDownload,
    FiStar,
    FiUser,
    FiCalendar,
    FiMessageSquare,
    FiMoreVertical,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi';
import { CSVLink } from 'react-csv';
import { API_BASE_URL } from '../../../../utils/auth';

const ManageReview = () => {
    const [reviews, setReviews] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const navigate = useNavigate();

    const adminUser = localStorage.getItem('adminUser');

    // Check authentication
    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }
        fetchReviews();
    }, [adminUser, navigate]);

    // Fetch all reviews
    const fetchReviews = () => {
        setIsLoading(true);
        fetch(`${API_BASE_URL}/event-reviews/`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log("Reviews API Response:", data);
                // Handle possible nested structure: data.data, data.results, or direct array
                const reviewsArray = Array.isArray(data) ? data : (data.data || data.results || []);
                setReviews(reviewsArray);
                setAllReviews(reviewsArray);
            })
            .catch(err => {
                console.error("API Error:", err);
                toast.error("Failed to load reviews");
            })
            .finally(() => setIsLoading(false));
    };

    // Search filter
    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        const keywords = searchTerm.toLowerCase().trim();

        if (!keywords) {
            setReviews(allReviews);
            return;
        }

        const filtered = allReviews.filter(review => {
            const eventName = (review.event?.event_name || '').toLowerCase();
            const userName = ((review.user?.first_name || '') + ' ' + (review.user?.last_name || '')).toLowerCase();
            const comment = (review.review_comment || '').toLowerCase();
            const rating = review.rating?.toString() || '';

            return eventName.includes(keywords) ||
                userName.includes(keywords) ||
                comment.includes(keywords) ||
                rating.includes(keywords);
        });

        setReviews(filtered);
    };

    // Delete single review
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        setIsLoading(true);
        fetch(`${API_BASE_URL}/event-reviews/${id}/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                toast.success(data.message || "Review deleted successfully!");
                fetchReviews();
            })
            .catch(err => {
                console.error("Delete Error:", err);
                toast.error(err.message || "Failed to delete review");
            })
            .finally(() => setIsLoading(false));
    };

    // Bulk delete
    const handleBulkDelete = () => {
        if (selectedReviews.length === 0) {
            toast.warning("Please select reviews to delete");
            return;
        }
        if (!window.confirm(`Are you sure you want to delete ${selectedReviews.length} review(s)?`)) return;

        setIsLoading(true);
        const deletePromises = selectedReviews.map(id =>
            fetch(`${API_BASE_URL}/event-reviews/${id}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
        );

        Promise.all(deletePromises)
            .then(() => {
                toast.success(`${selectedReviews.length} review(s) deleted successfully!`);
                setSelectedReviews([]);
                fetchReviews();
            })
            .catch(err => {
                console.error("Bulk Delete Error:", err);
                toast.error("Failed to delete some reviews");
            })
            .finally(() => setIsLoading(false));
    };

    // Toggle selection
    const toggleReviewSelection = (id) => {
        setSelectedReviews(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedReviews.length === reviews.length) {
            setSelectedReviews([]);
        } else {
            setSelectedReviews(reviews.map(r => r.id || r.pk));
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render star rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FiStar
                    key={i}
                    className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-stone-600'}`}
                />
            );
        }
        return stars;
    };

    // Compute average rating
    const avgRating = allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length).toFixed(1)
        : 0;

    return (
        <>
            <AdminLayout>
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />

                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Manage Reviews
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-stone-400 mt-1">
                                Manage all user reviews for events
                            </p>
                        </div>
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                            <FiStar className="w-4 h-4" />
                            View Events
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Total Reviews</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {allReviews.length}
                                    </p>
                                </div>
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                    <FiMessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Average Rating</p>
                                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                        {avgRating}
                                    </p>
                                </div>
                                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                                    <FiStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">5-Star Reviews</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {allReviews.filter(r => r.rating === 5).length}
                                    </p>
                                </div>
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                    <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Low Ratings (≤2)</p>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {allReviews.filter(r => r.rating <= 2).length}
                                    </p>
                                </div>
                                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                                    <FiXCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="w-full sm:w-80 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FiSearch className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by event, user, or comment..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-stone-700 bg-white dark:bg-[#1C2B27] text-gray-900 dark:text-stone-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            {selectedReviews.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    Delete Selected ({selectedReviews.length})
                                </button>
                            )}

                            <CSVLink
                                filename={'reviews.csv'}
                                data={reviews.map(r => ({
                                    event: r.event?.event_name,
                                    user: `${r.user?.first_name || ''} ${r.user?.last_name || ''}`,
                                    rating: r.rating,
                                    comment: r.review_comment,
                                    date: new Date(r.review_date).toLocaleDateString()
                                }))}
                                headers={[
                                    { label: 'Event', key: 'event' },
                                    { label: 'User', key: 'user' },
                                    { label: 'Rating', key: 'rating' },
                                    { label: 'Comment', key: 'comment' },
                                    { label: 'Date', key: 'date' },
                                ]}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                <FiDownload className="w-4 h-4" />
                                Download CSV
                            </CSVLink>
                        </div>
                    </div>

                    {/* Reviews Table */}
                    <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm transition-colors">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                                    <p className="mt-4 text-gray-500 dark:text-stone-400">Loading reviews...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-stone-800/50 border-b border-gray-200 dark:border-stone-700 text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase">
                                            <th className="px-4 py-3 text-center w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedReviews.length === reviews.length && reviews.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-4 py-3 w-12">#</th>
                                            <th className="px-4 py-3">Event</th>
                                            <th className="px-4 py-3 hidden md:table-cell">User</th>
                                            <th className="px-4 py-3">Rating</th>
                                            <th className="px-4 py-3 hidden lg:table-cell">Comment</th>
                                            <th className="px-4 py-3 hidden xl:table-cell">Date</th>
                                            <th className="px-4 py-3 text-center w-24">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-stone-700 text-sm text-gray-700 dark:text-stone-300">
                                        {reviews && reviews.length > 0 ? (
                                            reviews.map((review, index) => (
                                                <tr key={review.id || review.pk || index} className="hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors">
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedReviews.includes(review.id || review.pk)}
                                                            onChange={() => toggleReviewSelection(review.id || review.pk)}
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-medium text-gray-500 dark:text-stone-400">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900 dark:text-stone-100">
                                                                {review.event?.event_name || 'Unknown Event'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 hidden md:table-cell">
                                                        <div className="flex items-center gap-2">
                                                            <FiUser className="w-3 h-3 text-gray-400" />
                                                            {review.user?.first_name} {review.user?.last_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-0.5">
                                                            {renderStars(review.rating)}
                                                            <span className="ml-1 text-xs text-gray-500 dark:text-stone-400">
                                                                ({review.rating})
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 hidden lg:table-cell max-w-xs truncate">
                                                        {review.review_comment || 'No comment'}
                                                    </td>
                                                    <td className="px-4 py-3 hidden xl:table-cell text-gray-500 dark:text-stone-400">
                                                        {formatDate(review.review_date)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleDelete(review.id || review.pk)}
                                                                title="Delete"
                                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                                                <td colSpan="8" className="px-6 py-8 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FiMessageSquare className="w-12 h-12 text-gray-400" />
                                                        <p className="text-gray-500 dark:text-stone-400 font-medium">
                                                            No reviews found
                                                        </p>
                                                        <p className="text-sm text-gray-400 dark:text-stone-500">
                                                            {searchTerm ? 'Try adjusting your search' : 'Reviews will appear here once users submit them'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {reviews && reviews.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-stone-400">
                            <p>
                                Showing <span className="font-medium">{reviews.length}</span> of{' '}
                                <span className="font-medium">{allReviews.length}</span> reviews
                            </p>
                            {selectedReviews.length > 0 && (
                                <p className="text-blue-600 dark:text-blue-400">
                                    {selectedReviews.length} review(s) selected
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
};

export default ManageReview;