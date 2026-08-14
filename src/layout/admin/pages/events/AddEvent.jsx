import React, { useState, useEffect, useRef } from 'react';
import { BiCategory, BiPlusCircle, BiLoaderAlt, BiTime, BiMap, BiMoney, BiHash, BiImage } from 'react-icons/bi';
import { MdOutlineEvent } from 'react-icons/md';
import { toast } from 'react-toastify';
import { AdminLayout } from '../../AdminLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Important: Import CSS for toast

const AddEvent = () => {
    // State for event data
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null); // Add ref for file input

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
                const response = await fetch('http://127.0.0.1:8000/api/v1/view-categories/', {
                    headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
                });

                // Check if response is ok before parsing JSON
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Handle different response structures
                if (Array.isArray(data)) {
                    setCategories(data);
                } else if (data.data && Array.isArray(data.data)) {
                    setCategories(data.data);
                } else if (data.results && Array.isArray(data.results)) {
                    setCategories(data.results);
                } else {
                    setCategories([]);
                    console.warn('Unexpected categories data structure:', data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
                setCategories([]); // Set empty array on error
            }
        };
        fetchCategories();
    }, []);

    // Handle input changes for all form fields
    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            const file = files && files[0];
            if (file) {
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    toast.error('File size must be less than 5MB');
                    e.target.value = ''; // Reset file input
                    return;
                }

                // Validate file type
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    toast.error('Please upload a valid image (JPG, PNG, GIF, WEBP)');
                    e.target.value = ''; // Reset file input
                    return;
                }

                setImageFile(file);
                setEventData(prev => ({
                    ...prev,
                    [name]: file
                }));
            }
        } else if (type === 'checkbox') {
            setEventData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (type === 'number') {
            // Handle number inputs
            const numValue = value === '' ? '' : Number(value);
            setEventData(prev => ({
                ...prev,
                [name]: numValue
            }));
        } else {
            setEventData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!selectedCategory) {
            toast.error('Please select an event category');
            return;
        }

        // Check if selected category exists in the categories list
        const categoryExists = categories.some(cat =>
            String(cat.id || cat.pk) === String(selectedCategory)
        );
        if (!categoryExists) {
            toast.error('Selected category is invalid');
            return;
        }

        if (!eventData.event_name || !eventData.event_name.trim()) {
            toast.error('Event name cannot be empty');
            return;
        }

        if (!eventData.event_description || !eventData.event_description.trim()) {
            toast.error('Event description cannot be empty');
            return;
        }

        if (!eventData.event_date) {
            toast.error('Please select an event date');
            return;
        }

        // Validate date is not in the past (optional)
        const selectedDate = new Date(eventData.event_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            toast.warning('Selected date is in the past. Please verify.');
            // You can decide whether to allow past dates or not
        }

        if (!eventData.event_time) {
            toast.error('Please select an event time');
            return;
        }

        if (!eventData.event_location || !eventData.event_location.trim()) {
            toast.error('Please enter an event location');
            return;
        }

        // Parse and validate price
        const price = parseFloat(eventData.event_price);
        if (isNaN(price) || price < 0) {
            toast.error('Please enter a valid event price');
            return;
        }

        // Parse and validate quantity
        const quantity = parseInt(eventData.event_quantity);
        if (isNaN(quantity) || quantity < 1) {
            toast.error('Please enter a valid event quantity (minimum 1)');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('category', selectedCategory);
            formData.append('event_name', eventData.event_name.trim());
            formData.append('event_description', eventData.event_description.trim());
            formData.append('event_date', eventData.event_date);
            formData.append('event_time', eventData.event_time);
            formData.append('event_location', eventData.event_location.trim());
            formData.append('event_price', String(price)); // Ensure it's a string
            formData.append('event_quantity', String(quantity)); // Ensure it's a string
            formData.append('is_event_available', eventData.is_event_available ? 'true' : 'false');

            if (imageFile) {
                formData.append('event_image', imageFile);
            }

            const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
            const response = await fetch('http://127.0.0.1:8000/api/v1/add-event/', {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header when using FormData - browser sets it with boundary
                headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
            });

            // Try to parse JSON response
            let data;
            const textResponse = await response.text();
            try {
                data = JSON.parse(textResponse);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                console.error('Raw Server Response:', textResponse);
                throw new Error('Invalid response from server: ' + textResponse.substring(0, 100));
            }

            if (response.status === 201 || response.status === 200) {
                toast.success(data.message || 'Event item added successfully!');
                // Reset form
                setEventData({
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
                setSelectedCategory('');
                setImageFile(null);
                // Reset file input using ref
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                // If there's a detailed traceback from our backend 500 capture, log it
                if (data.traceback) {
                    console.error('Backend 500 Error Traceback:', data.traceback);
                }
                
                // Handle validation errors from backend
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat().join(' ');
                    toast.error(errorMessages || data.message || 'Failed to add event item');
                } else {
                    toast.error(data.error || data.message || 'Failed to add event item');
                }
            }
        } catch (error) {
            console.error('Error adding event:', error);
            toast.error(error.message || 'Error Connecting to Server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <AdminLayout>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    theme="dark"
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                <div className="max-w-2xl mx-auto mt-8 px-4">

                    {/* Page Navigation Title & Breadcrumb Block */}
                    <div className="mb-6">
                        <h1 className="text-xl font-bold font-serif text-gray-900 dark:text-stone-100 tracking-wide flex items-center gap-2">
                            <MdOutlineEvent className="text-purple-600 dark:text-purple-400" />
                            Add Event Item
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-stone-400 mt-1">
                            Add new event items to your event management system.
                        </p>
                    </div>

                    {/* Main Form Interactive Card */}
                    <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-stone-800/80 rounded-2xl shadow-xl overflow-hidden group/card hover:border-purple-300 dark:hover:border-purple-500/20 transition-all duration-300">
                        <div className="border-b border-gray-200 dark:border-stone-800/60 bg-gray-50 dark:bg-stone-950/40 px-6 py-4 flex items-center gap-2.5">
                            <BiPlusCircle className="text-purple-600 dark:text-purple-400 text-lg" />
                            <h2 className="text-xs font-semibold text-gray-700 dark:text-stone-300 uppercase tracking-wider">
                                Add Event Item
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Event Category Dropdown Select */}
                            <div>
                                <label htmlFor="eventCategory" className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                    Event Category <span className="text-red-400">*</span>
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500 group-focus-within/input:text-purple-600 dark:group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-300">
                                        <BiCategory className="text-lg" />
                                    </div>
                                    <select
                                        id="eventCategory"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        disabled={isSubmitting || categories.length === 0}
                                        className="w-full pl-10 pr-10 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-gray-400 dark:hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm appearance-none"
                                        required
                                    >
                                        <option value="" className="bg-white dark:bg-stone-900 text-gray-400 dark:text-stone-400">
                                            {categories.length === 0 ? 'No categories available' : 'Select Event Category'}
                                        </option>
                                        {categories && categories.map((category) => (
                                            <option
                                                key={category.id || category.pk || Math.random()}
                                                value={category.id || category.pk}
                                                className="bg-white dark:bg-stone-900 text-gray-900 dark:text-stone-100"
                                            >
                                                {category.name || category.category_name || category.title || "Unnamed Category"}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Custom dropdown arrow */}
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {categories.length === 0 && (
                                    <p className="text-xs text-amber-500 dark:text-amber-400 mt-1.5">
                                        No categories available. Please add a category first.
                                    </p>
                                )}
                            </div>

                            {/* Event Name Input */}
                            <div>
                                <label htmlFor="event_name" className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                    Event Name <span className="text-red-400">*</span>
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500 group-focus-within/input:text-purple-600 dark:group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-300">
                                        <MdOutlineEvent className="text-lg" />
                                    </div>
                                    <input
                                        id="event_name"
                                        name="event_name"
                                        type="text"
                                        required
                                        value={eventData.event_name}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-gray-400 dark:hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        placeholder="Enter event name"
                                        maxLength={50}
                                    />
                                </div>
                            </div>

                            {/* Event Description Input */}
                            <div>
                                <label htmlFor="event_description" className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                    Event Description <span className="text-red-400">*</span>
                                </label>
                                <div className="relative group/input">
                                    <textarea
                                        id="event_description"
                                        name="event_description"
                                        required
                                        value={eventData.event_description}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-gray-400 dark:hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm resize-y"
                                        placeholder="Enter event description"
                                        maxLength={200}
                                    />
                                </div>
                                <div className="text-right text-xs text-gray-500 dark:text-stone-500 mt-1">
                                    {eventData.event_description.length}/200
                                </div>
                            </div>

                            {/* Event Date and Time - Two Column Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Event Date Input */}
                                <div>
                                    <label htmlFor="event_date" className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                        Event Date <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative group/input">
                                        <input
                                            id="event_date"
                                            name="event_date"
                                            type="date"
                                            required
                                            value={eventData.event_date}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full px-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-gray-400 dark:hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm [&::-webkit-calendar-picker-indicator]:dark:invert"
                                            min={new Date().toISOString().split('T')[0]} // Prevent past dates (optional)
                                        />
                                    </div>
                                </div>

                                {/* Event Time Input */}
                                <div>
                                    <label htmlFor="event_time" className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                        Event Time <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500 group-focus-within/input:text-purple-600 dark:group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-300">
                                            <BiTime className="text-lg" />
                                        </div>
                                        <input
                                            id="event_time"
                                            name="event_time"
                                            type="time"
                                            required
                                            value={eventData.event_time}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-gray-400 dark:hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm [&::-webkit-calendar-picker-indicator]:dark:invert"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Event Location and Price - Two Column Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Event Location Input */}
                                <div>
                                    <label htmlFor="event_location" className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                        Event Location <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500 group-focus-within/input:text-purple-600 dark:group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-300">
                                            <BiMap className="text-lg" />
                                        </div>
                                        <input
                                            id="event_location"
                                            name="event_location"
                                            type="text"
                                            required
                                            value={eventData.event_location}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-gray-400 dark:hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            placeholder="Enter event location"
                                            maxLength={100}
                                        />
                                    </div>
                                </div>

                                {/* Event Price Input */}
                                <div>
                                    <label htmlFor="event_price" className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                        Event Price (Nu) <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500 group-focus-within/input:text-purple-600 dark:group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-300">
                                            <BiMoney className="text-lg" />
                                        </div>
                                        <input
                                            id="event_price"
                                            name="event_price"
                                            type="number"
                                            required
                                            step="0.01"
                                            min="0"
                                            value={eventData.event_price}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-gray-400 dark:hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Event Quantity and Availability - Two Column Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Event Quantity Input */}
                                <div>
                                    <label htmlFor="event_quantity" className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                        Event Quantity <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500 group-focus-within/input:text-purple-600 dark:group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-300">
                                            <BiHash className="text-lg" />
                                        </div>
                                        <input
                                            id="event_quantity"
                                            name="event_quantity"
                                            type="number"
                                            required
                                            min="1"
                                            value={eventData.event_quantity}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-gray-400 dark:hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            placeholder="Enter quantity"
                                        />
                                    </div>
                                </div>

                                {/* Event Availability Checkbox */}
                                <div className="flex items-center">
                                    <div className="flex items-center gap-3 pt-6">
                                        <input
                                            id="is_event_available"
                                            name="is_event_available"
                                            type="checkbox"
                                            checked={eventData.is_event_available}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-5 h-5 rounded border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-900/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-stone-950"
                                        />
                                        <label htmlFor="is_event_available" className="text-sm text-gray-700 dark:text-stone-300 cursor-pointer">
                                            Event is Available
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Event Image Upload */}
                            <div>
                                <label htmlFor="event_image" className="block text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                                    Event Image
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-stone-500 group-focus-within/input:text-purple-600 dark:group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-300">
                                        <BiImage className="text-lg" />
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        id="event_image"
                                        name="event_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900/40 border border-gray-300 dark:border-stone-800 rounded-xl text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-300 hover:border-gray-400 dark:hover:border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-stone-500 mt-1.5">
                                    Upload an image for your event (JPG, PNG, GIF, WEBP). Max size: 5MB
                                </p>
                                {imageFile && (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                        Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                                    </p>
                                )}
                            </div>

                            {/* Submit Action Execution Tray */}
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || categories.length === 0}
                                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-purple-950/40 active:scale-[0.98] transition-all duration-300 flex items-center gap-2 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <BiLoaderAlt className="animate-spin text-lg" />
                                            <span>Saving Event Item...</span>
                                        </>
                                    ) : (
                                        <>
                                            <BiPlusCircle className="text-base" />
                                            <span>Add Event Item</span>
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

export default AddEvent;