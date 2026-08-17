import React, { useState, useEffect, useRef } from 'react';
import { BiCategory, BiPlusCircle, BiLoaderAlt, BiTime, BiMap, BiMoney, BiHash, BiImage } from 'react-icons/bi';
import { MdOutlineEvent } from 'react-icons/md';
import { FiArrowLeft, FiSave, FiX, FiLoader, FiEdit } from 'react-icons/fi';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AdminLayout } from '../../AdminLayout';
import 'react-toastify/dist/ReactToastify.css';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [eventData, setEventData] = useState({
        event_name: '',
        event_description: '',
        event_date: '',
        event_time: '',
        event_location: '',
        event_price: '',
        event_quantity: '',
        is_event_available: true,
        event_image: null
    });

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
            const response = await fetch('http://127.0.0.1:8000/api/v1/view-categories/', {
                headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (Array.isArray(data)) setCategories(data);
            else if (data.data && Array.isArray(data.data)) setCategories(data.data);
            else if (data.results && Array.isArray(data.results)) setCategories(data.results);
            else setCategories([]);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    // Fetch Event Details
    const fetchEventDetails = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/event-detail/${id}/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const event = data.data;

            setEventData({
                event_name: event.event_name || event.title || event.name || '',
                event_description: event.event_description || event.description || '',
                event_date: event.event_date || '',
                event_time: event.event_time || '',
                event_location: event.event_location || event.location || '',
                event_price: event.event_price || event.price || '',
                event_quantity: event.event_quantity || event.quantity || '',
                is_event_available: event.is_event_available !== undefined ? event.is_event_available : true,
            });

            setSelectedCategory(event.category || event.category_id || '');
            if (event.event_image) {
                setCurrentImage(`http://127.0.0.1:8000${event.event_image}`);
            }
        } catch (error) {
            console.error('Error fetching event details:', error);
            toast.error('Failed to load event details');
            navigate('/admin/events'); // Or manage-event
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchCategories();
            await fetchEventDetails();
        };
        init();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            const file = files && files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    toast.error('File size must be less than 5MB');
                    e.target.value = '';
                    return;
                }
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    toast.error('Please upload a valid image (JPG, PNG, GIF, WEBP)');
                    e.target.value = '';
                    return;
                }
                setImageFile(file);
            }
        } else if (type === 'checkbox') {
            setEventData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setEventData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setEventData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory) {
            toast.error('Please select an event category');
            return;
        }

        if (!eventData.event_name || !eventData.event_description || !eventData.event_date || !eventData.event_time || !eventData.event_location) {
            toast.error('Please fill out all required text/date fields');
            return;
        }

        const price = parseFloat(eventData.event_price);
        if (isNaN(price) || price < 0) {
            toast.error('Please enter a valid event price');
            return;
        }

        const quantity = parseInt(eventData.event_quantity);
        if (isNaN(quantity) || quantity < 1) {
            toast.error('Please enter a valid event quantity (minimum 1)');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('category', selectedCategory);
            formData.append('event_name', eventData.event_name.trim());
            formData.append('event_description', eventData.event_description.trim());
            formData.append('event_date', eventData.event_date);
            formData.append('event_time', eventData.event_time);
            formData.append('event_location', eventData.event_location.trim());
            formData.append('event_price', String(price));
            formData.append('event_quantity', String(quantity));
            formData.append('is_event_available', eventData.is_event_available ? 'true' : 'false');

            if (imageFile) {
                formData.append('event_image', imageFile);
            }

            const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
            const response = await fetch(`http://127.0.0.1:8000/api/v1/event-detail/${id}/`, {
                method: 'PUT',
                body: formData,
                headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
            });

            const textResponse = await response.text();
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (e) {
                throw new Error('Invalid server response');
            }

            if (response.ok) {
                toast.success(data.message || 'Event updated successfully!');
                setTimeout(() => navigate('/manage-event'), 1500); // adjust this to your event list route
            } else {
                const errMsg = data.errors ? Object.values(data.errors).flat().join(' ') : (data.error || data.message || 'Update failed');
                toast.error(errMsg);
            }
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error('Error connecting to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <FiLoader className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-stone-400">Loading event details...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="max-w-2xl mx-auto mt-8 px-4 pb-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold font-serif text-gray-900 dark:text-stone-100 tracking-wide flex items-center gap-2">
                            <FiEdit className="text-purple-600 dark:text-purple-400" />
                            Edit Event Item
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-stone-400 mt-1">
                            Update event details and availability.
                        </p>
                    </div>
                    <Link
                        to="/manage-event" // Use correct link to manage events
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-gray-700 dark:text-stone-300 text-sm font-medium rounded-lg transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-stone-800/80 rounded-2xl shadow-xl overflow-hidden group/card hover:border-purple-300 dark:hover:border-purple-500/20 transition-all duration-300">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        
                        {/* Event Category Dropdown Select */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                Event Category <span className="text-red-400">*</span>
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500">
                                    <BiCategory className="text-lg" />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    disabled={isSubmitting || categories.length === 0}
                                    className="w-full pl-10 pr-10 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-sm appearance-none"
                                    required
                                >
                                    <option value="" className="text-gray-400">Select Event Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id || category.pk} value={category.id || category.pk}>
                                            {category.name || category.category_name || category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Event Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                Event Name <span className="text-red-400">*</span>
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500">
                                    <MdOutlineEvent className="text-lg" />
                                </div>
                                <input
                                    name="event_name"
                                    type="text"
                                    required
                                    value={eventData.event_name}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-sm"
                                    placeholder="Enter event name"
                                    maxLength={50}
                                />
                            </div>
                        </div>

                        {/* Event Description */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                Event Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                name="event_description"
                                required
                                value={eventData.event_description}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                rows="4"
                                className="w-full px-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-sm resize-y"
                                placeholder="Enter event description"
                                maxLength={200}
                            />
                        </div>

                        {/* Event Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                    Event Date <span className="text-red-400">*</span>
                                </label>
                                <input
                                    name="event_date"
                                    type="date"
                                    required
                                    value={eventData.event_date}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                    Event Time <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500">
                                        <BiTime className="text-lg" />
                                    </div>
                                    <input
                                        name="event_time"
                                        type="time"
                                        required
                                        value={eventData.event_time}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                    Event Location <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500">
                                        <BiMap className="text-lg" />
                                    </div>
                                    <input
                                        name="event_location"
                                        type="text"
                                        required
                                        value={eventData.event_location}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                    Event Price (Nu) <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500">
                                        <BiMoney className="text-lg" />
                                    </div>
                                    <input
                                        name="event_price"
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={eventData.event_price}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quantity & Availability */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                    Event Quantity <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500">
                                        <BiHash className="text-lg" />
                                    </div>
                                    <input
                                        name="event_quantity"
                                        type="number"
                                        required
                                        min="1"
                                        value={eventData.event_quantity}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 dark:text-stone-300">
                                    <input
                                        name="is_event_available"
                                        type="checkbox"
                                        checked={eventData.is_event_available}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-900/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-stone-950"
                                    />
                                    Event is Available
                                </label>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                Event Image (Leave empty to keep current)
                            </label>
                            {currentImage && !imageFile && (
                                <div className="mb-3">
                                    <img src={currentImage} alt="Current" className="h-24 w-auto rounded-lg object-cover shadow" />
                                </div>
                            )}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500">
                                    <BiImage className="text-lg" />
                                </div>
                                <input
                                    ref={fileInputRef}
                                    name="event_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-stone-800/80 gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/manage-event')}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 text-gray-700 dark:text-stone-300 font-medium text-sm rounded-xl transition-all flex items-center gap-2"
                            >
                                <FiX className="text-base" /> Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <><BiLoaderAlt className="animate-spin text-lg" /> Saving...</>
                                ) : (
                                    <><FiSave className="text-base" /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditEvent;