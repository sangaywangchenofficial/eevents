import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi';

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search page with query parameter
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleTagClick = (tag) => {
        setSearchQuery(tag);
        // Navigate to search page with tag.
        navigate(`/search?q=${encodeURIComponent(tag)}`);
    };

    return (
        <div className="relative min-h-[80vh] flex items-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-purple-950/70"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        <span className="text-xs font-medium text-purple-300 tracking-wider uppercase">
                            Discover Amazing Events
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                        Find Your Next
                        <span className="block bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Unforgettable Experience
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Discover, connect, and experience the best events in your city. From conferences to concerts, find what moves you.
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
                        <div className="bg-zinc-900/90 backdrop-blur-md border border-stone-800 rounded-2xl shadow-2xl shadow-purple-950/20 p-2 md:p-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <HiSearch className="w-5 h-5 text-stone-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search events, venues, or artists..."
                                        className="w-full pl-11 pr-4 py-3 bg-stone-950/40 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-purple-950/40 min-w-[120px]"
                                >
                                    <HiSearch className="w-5 h-5" />
                                    <span>Search</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Popular Tags */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <span className="text-sm text-stone-400 mr-2">Popular:</span>
                        {['Music', 'Tech', 'Art', 'Business', 'Food'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className="px-3 py-1 text-xs bg-stone-800/50 hover:bg-purple-600/20 text-stone-300 hover:text-purple-300 rounded-full border border-stone-700 hover:border-purple-500/50 transition-all duration-200"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;