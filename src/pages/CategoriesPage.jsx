// CategoriesPage.jsx - Updated with Full Width Images
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../publiclayout/PublicLayout';
import {
    FaSearch,
    FaArrowRight,
    FaMusic,
    FaTheaterMasks,
    FaUtensils,
    FaFootballBall,
    FaLaptop,
    FaPalette,
    FaBook,
    FaFilm,
    FaHeart,
    FaStar,
    FaUsers,
    FaClock,
    FaTicketAlt,
    FaChevronRight,
    FaFilter,
    FaThLarge,
    FaList,
    FaTree,
    FaFire,
    FaTimes,
    FaSlidersH,
    FaSortAmountDown,
    FaSortAmountUp,
    FaThumbsUp,
    FaEye,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTag,
    FaAward,
    FaRocket,
    FaRegHeart,
    FaShareAlt,
    FaBriefcase,
    FaGlassCheers,
    FaChild,
    FaPaw,
    FaChurch,
    FaWhatsapp,
    FaFacebookF,
    FaTwitter,
    FaTelegramPlane,
    FaLinkedinIn,
    FaEnvelope,
    FaCopy,
    FaCheck,
    FaExternalLinkAlt
} from 'react-icons/fa';
import { MdCategory, MdTrendingUp, MdNewReleases, MdEvent } from 'react-icons/md';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import { API_BASE_URL, getMediaUrl, APP_NAME_CAPITALIZED, APP_URL } from '../utils/auth';

const Categories = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [shareModalCategory, setShareModalCategory] = useState(null);
    const [copied, setCopied] = useState(false);

    // Color palette for categories
    const colorPalette = [
        { bg: 'bg-[#E6F9F6] dark:bg-[#1C2B27]', text: 'text-[#1E352F] dark:text-[#E8F5F2]', border: 'border-[#E6E1D8] dark:border-[#2A3D38]', hover: 'hover:bg-[#C8EDE8] dark:bg-[#2A3D38]', gradient: 'from-[#FDFDF7] dark:from-[#0F1A17] to-[#E6F9F6]' },
        { bg: 'bg-[#FDF3E1]', text: 'text-[#1E352F] dark:text-[#E8F5F2]', border: 'border-[#F8DFB4]', hover: 'hover:bg-[#F8DFB4]', gradient: 'from-[#FDFDF7] dark:from-[#0F1A17] to-[#FDF3E1]' },
        { bg: 'bg-[#FEF0E4]', text: 'text-[#1E352F] dark:text-[#E8F5F2]', border: 'border-[#FCD3B3]', hover: 'hover:bg-[#FCD3B3]', gradient: 'from-[#FDFDF7] dark:from-[#0F1A17] to-[#FEF0E4]' },
        { bg: 'bg-[#E4F0EE]', text: 'text-[#1E352F] dark:text-[#E8F5F2]', border: 'border-[#C4DDD8]', hover: 'hover:bg-[#C4DDD8]', gradient: 'from-[#FDFDF7] dark:from-[#0F1A17] to-[#E4F0EE]' },
        { bg: 'bg-[#F4F3EC] dark:bg-[#162019]', text: 'text-[#1E352F] dark:text-[#E8F5F2]', border: 'border-[#E6E1D8] dark:border-[#2A3D38]', hover: 'hover:bg-[#EAE8DE]', gradient: 'from-[#FDFDF7] dark:from-[#0F1A17] to-[#F4F3EC] dark:to-[#0F1A17]' },
    ];

    // Icon mapping for categories
    const iconMapping = {
        'Music': FaMusic,
        'Concert': FaMusic,
        'Theatre': FaTheaterMasks,
        'Arts': FaPalette,
        'Food': FaUtensils,
        'Dining': FaUtensils,
        'Sports': FaFootballBall,
        'Fitness': FaBriefcase,
        'Workout': FaBriefcase,
        'Gym': FaBriefcase,
        'Technology': FaLaptop,
        'Tech': FaLaptop,
        'Art': FaPalette,
        'Culture': FaPalette,
        'Education': FaBook,
        'Film': FaFilm,
        'Media': FaFilm,
        'Wellness': FaHeart,
        'Health': FaHeart,
        'Business': FaBriefcase,
        'Networking': FaUsers,
        'Community': FaUsers,
        'Social': FaUsers,
        'Outdoor': FaTree,
        'Adventure': FaTree,
        'Nature': FaTree,
    };

    // Get icon for category
    const getCategoryIcon = (name) => {
        for (const [key, Icon] of Object.entries(iconMapping)) {
            if (name.toLowerCase().includes(key.toLowerCase())) {
                return Icon;
            }
        }
        return MdCategory;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/view-categories/`);
                if (response.ok) {
                    const result = await response.json();
                    const fetchedCategories = (result.data || []).map((cat, index) => {
                        const color = colorPalette[index % colorPalette.length];
                        const Icon = getCategoryIcon(cat.category_name);
                        return {
                            id: cat.id,
                            name: cat.category_name,
                            image: getMediaUrl(cat.image) || null,
                            color: color,
                            description: cat.description || 'Discover amazing events in this category.',
                            eventCount: Math.floor(Math.random() * 50) + 5,
                            popular: index < 6,
                            featured: index < 3,
                            trending: index >= 6 && index < 9,
                            new: index >= 9 && index < 12,
                            icon: Icon,
                            subCategories: cat.sub_categories || ['Events', 'Workshops', 'Meetups'],
                            created_at: cat.created_at || new Date().toISOString()
                        };
                    });
                    setCategories(fetchedCategories);
                    setFilteredCategories(fetchedCategories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Filter and sort categories
    useEffect(() => {
        let result = [...categories];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(cat =>
                cat.name.toLowerCase().includes(term) ||
                cat.description.toLowerCase().includes(term) ||
                cat.subCategories.some(sub => sub.toLowerCase().includes(term))
            );
        }

        result.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'eventCount':
                    comparison = a.eventCount - b.eventCount;
                    break;
                case 'popularity':
                    comparison = (a.popular ? 1 : 0) - (b.popular ? 1 : 0);
                    break;
                default:
                    comparison = a.name.localeCompare(b.name);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredCategories(result);
    }, [searchTerm, sortBy, sortOrder, categories]);

    // Toggle favorite
    const toggleFavorite = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
        toast.success(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites');
    };

    // Share category modal opener
    const shareCategory = (category, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setShareModalCategory(category);
        setCopied(false);
    };

    // Get category stats
    const getCategoryStats = useCallback(() => {
        const total = categories.length;
        const popular = categories.filter(c => c.popular).length;
        const featured = categories.filter(c => c.featured).length;
        const trending = categories.filter(c => c.trending).length;
        return { total, popular, featured, trending };
    }, [categories]);

    const stats = useMemo(() => getCategoryStats(), [getCategoryStats]);

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-white dark:bg-[#1C2B27] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#29BBA3] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-6 text-gray-500 dark:text-[#7AA49D] font-medium">Loading categories...</p>
                        <div className="mt-2 flex justify-center gap-1">
                            <div className="w-2 h-2 bg-[#F4F3EC] dark:bg-[#162019]0 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-[#F4F3EC] dark:bg-[#162019]0 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-[#F4F3EC] dark:bg-[#162019]0 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <>
            <PublicLayout>
                <SEO
                    title={`Event Categories | ${APP_NAME_CAPITALIZED}`}
                    description={`Explore event categories across Bhutan on ${APP_NAME_CAPITALIZED}. Browse Cultural Festivals, Music, Technology, Sports, Workshops, and Community Gatherings.`}
                    canonical={`${APP_URL}/categories`}
                    breadcrumbs={[
                        { name: 'Home', item: '/' },
                        { name: 'Categories', item: '/categories' }
                    ]}
                />
                <div className="min-h-screen bg-white dark:bg-[#1C2B27]">
                    {/* Hero Section */}
                    <section className="relative py-12 md:py-16 bg-white dark:bg-[#1C2B27] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFDF7] dark:from-[#0F1A17]/30 via-white dark:via-[#162019] to-[#F4F3EC] dark:to-[#0F1A17]/30"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E6F9F6] dark:bg-[#1C2B27]/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#C8EDE8] dark:bg-[#2A3D38]/20 rounded-full blur-3xl"></div>

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-3xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 bg-[#F4F3EC] dark:bg-[#162019] border border-[#E6F9F6] rounded-full px-4 py-1.5 mb-5">
                                    <MdCategory className="text-[#29BBA3] text-xs" />
                                    <span className="text-xs font-medium text-[#1E352F] dark:text-[#E8F5F2] tracking-wider uppercase">
                                        Categories
                                    </span>
                                </div>

                                <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 dark:text-[#E8F5F2] mb-4">
                                    Explore Event <span className="bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] bg-clip-text text-transparent">Categories</span>
                                </h1>

                                <p className="text-gray-600 dark:text-[#7AA49D] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                                    Discover events that match your interests. From music to technology,
                                    find the perfect event for you.
                                </p>

                                <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
                                    <span className="inline-flex items-center gap-2 text-gray-500 dark:text-[#7AA49D]">
                                        <span className="text-lg">📁</span>
                                        <span className="font-medium text-gray-700 dark:text-[#A8C4BE]">{stats.total}</span> Categories
                                    </span>
                                    <span className="w-px h-6 bg-gray-300 dark:bg-[#2A3D38]"></span>
                                    <span className="inline-flex items-center gap-2 text-gray-500 dark:text-[#7AA49D]">
                                        <FaFire className="text-amber-500" />
                                        <span className="font-medium text-gray-700 dark:text-[#A8C4BE]">{stats.popular}</span> Popular
                                    </span>
                                    <span className="w-px h-6 bg-gray-300 dark:bg-[#2A3D38]"></span>
                                    <span className="inline-flex items-center gap-2 text-gray-500 dark:text-[#7AA49D]">
                                        <FaAward className="text-[#29BBA3]" />
                                        <span className="font-medium text-gray-700 dark:text-[#A8C4BE]">{stats.featured}</span> Featured
                                    </span>
                                    <span className="w-px h-6 bg-gray-300 dark:bg-[#2A3D38]"></span>
                                    <span className="inline-flex items-center gap-2 text-gray-500 dark:text-[#7AA49D]">
                                        <MdTrendingUp className="text-emerald-500" />
                                        <span className="font-medium text-gray-700 dark:text-[#A8C4BE]">{stats.trending}</span> Trending
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Search and Filter Bar */}
                    <section className="py-4 bg-white dark:bg-[#1C2B27] border-y border-gray-100 dark:border-[#2A3D38] sticky top-0 z-10 backdrop-blur-sm bg-white dark:bg-[#1C2B27]/95">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                                <div className="relative w-full md:w-96">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="text-gray-400 dark:text-[#66756F] text-sm" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search categories..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-lg text-gray-900 dark:text-[#E8F5F2] placeholder-gray-400 text-sm focus:outline-none focus:border-[#1E8B7A] focus:ring-2 focus:ring-[#E6F9F6] transition-all duration-300"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-[#66756F] hover:text-gray-600 dark:text-[#7AA49D]"
                                        >
                                            <FaTimes className="text-sm" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                                    <div className="flex bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${viewMode === 'grid'
                                                ? 'bg-[#1E8B7A] text-white shadow-sm'
                                                : 'text-gray-500 dark:text-[#7AA49D] hover:text-gray-700 dark:text-[#A8C4BE]'
                                                }`}
                                            aria-label="Grid view"
                                        >
                                            <FaThLarge />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${viewMode === 'list'
                                                ? 'bg-[#1E8B7A] text-white shadow-sm'
                                                : 'text-gray-500 dark:text-[#7AA49D] hover:text-gray-700 dark:text-[#A8C4BE]'
                                                }`}
                                            aria-label="List view"
                                        >
                                            <FaList />
                                        </button>
                                    </div>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2.5 bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-lg text-sm text-gray-700 dark:text-[#A8C4BE] focus:outline-none focus:border-[#1E8B7A] focus:ring-2 focus:ring-[#E6F9F6]"
                                    >
                                        <option value="name">Sort by Name</option>
                                        <option value="eventCount">Sort by Events</option>
                                        <option value="popularity">Sort by Popularity</option>
                                    </select>

                                    <button
                                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                        className="px-3 py-2.5 bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-lg text-gray-600 dark:text-[#7AA49D] hover:bg-gray-100 dark:bg-[#162019] transition-colors duration-200"
                                    >
                                        {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                                    </button>

                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`px-3 py-2.5 border rounded-lg transition-colors duration-200 flex items-center gap-2 ${showFilters ? 'bg-[#F4F3EC] dark:bg-[#162019] border-[#E6E1D8] dark:border-[#2A3D38] text-[#29BBA3]' : 'bg-gray-50 dark:bg-[#0F1A17] border-gray-200 dark:border-[#2A3D38] text-gray-600 dark:text-[#7AA49D] hover:bg-gray-100 dark:bg-[#162019]'
                                            }`}
                                    >
                                        <FaSlidersH className="text-sm" />
                                        <span className="hidden sm:inline">Filters</span>
                                    </button>
                                </div>
                            </div>

                            {showFilters && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2A3D38] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-[#7AA49D] mb-1.5">Category Type</label>
                                        <select className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-lg text-sm text-gray-700 dark:text-[#A8C4BE] focus:outline-none focus:border-[#1E8B7A]">
                                            <option value="all">All Types</option>
                                            <option value="popular">Popular</option>
                                            <option value="featured">Featured</option>
                                            <option value="trending">Trending</option>
                                            <option value="new">New</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-[#7AA49D] mb-1.5">Min Events</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-lg text-sm text-gray-700 dark:text-[#A8C4BE] focus:outline-none focus:border-[#1E8B7A]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-[#7AA49D] mb-1.5">Max Events</label>
                                        <input
                                            type="number"
                                            placeholder="100"
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-lg text-sm text-gray-700 dark:text-[#A8C4BE] focus:outline-none focus:border-[#1E8B7A]"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button className="w-full px-4 py-2 bg-[#1E8B7A] text-white rounded-lg hover:bg-[#1E352F] transition-colors duration-200 text-sm font-medium">
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Categories Grid - Updated with Full Width Images */}
                    <section className="py-8 bg-white dark:bg-[#1C2B27]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {filteredCategories.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-gray-500 dark:text-[#7AA49D] text-lg font-medium">No categories found</p>
                                    <p className="text-gray-400 dark:text-[#66756F] text-sm mt-1">Try adjusting your search or filters</p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setShowFilters(false);
                                        }}
                                        className="mt-4 px-6 py-2 bg-[#1E8B7A] text-white rounded-lg hover:bg-[#1E352F] transition-colors duration-200 text-sm font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4 text-sm text-gray-500 dark:text-[#7AA49D]">
                                        Showing <span className="font-medium text-gray-700 dark:text-[#A8C4BE]">{filteredCategories.length}</span> categories
                                    </div>

                                    <div className={viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                        : 'space-y-4'
                                    }>
                                        {filteredCategories.map((category) => {
                                            const Icon = category.icon || MdCategory;
                                            const colorClass = category.color;

                                            if (viewMode === 'grid') {
                                                return (
                                                    <div
                                                        key={category.id}
                                                        className="group bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-[#2A3D38] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-[#E6E1D8] dark:border-[#2A3D38] hover:shadow-teal-900/10 transform hover:-translate-y-1"
                                                    >
                                                        <Link to={`/events?category=${category.id}`} className="block">
                                                            {/* Full Width Image */}
                                                            <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-[#162019]">
                                                                {category.image ? (
                                                                    <img
                                                                        src={category.image}
                                                                        alt={category.name}
                                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FDFDF7] dark:from-[#0F1A17] to-[#F4F3EC] dark:to-[#0F1A17]">
                                                                        <Icon className="text-6xl text-teal-200" />
                                                                    </div>
                                                                )}
                                                                {/* Gradient Overlay */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                                                {/* Badges on Image */}
                                                                <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap justify-end">
                                                                    {category.featured && (
                                                                        <span className="text-[10px] font-semibold text-white bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] px-2.5 py-1 rounded-full shadow-sm">
                                                                            <FaStar className="inline text-yellow-300 mr-1 text-[8px]" />
                                                                            Featured
                                                                        </span>
                                                                    )}
                                                                    {category.popular && (
                                                                        <span className="text-[10px] font-medium text-amber-700 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-200">
                                                                            <FaFire className="inline text-amber-500 mr-1 text-[8px]" />
                                                                            Popular
                                                                        </span>
                                                                    )}
                                                                    {category.trending && (
                                                                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200">
                                                                            <MdTrendingUp className="inline text-emerald-500 mr-1 text-[8px]" />
                                                                            Trending
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Category Name Overlay */}
                                                                <div className="absolute bottom-3 left-3 right-3">
                                                                    <h3 className="text-lg font-serif font-bold text-white drop-shadow-lg">
                                                                        {category.name}
                                                                    </h3>
                                                                </div>
                                                            </div>

                                                            {/* Content Section */}
                                                            <div className="p-4">
                                                                <p className="text-sm text-gray-600 dark:text-[#7AA49D] leading-relaxed mb-3 line-clamp-2">
                                                                    {category.description}
                                                                </p>

                                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[#2A3D38]/60">
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {category.subCategories.slice(0, 3).map((sub, idx) => (
                                                                            <span key={idx} className="text-[10px] text-gray-600 dark:text-[#7AA49D] bg-white dark:bg-[#1C2B27]/70 px-2.5 py-1 rounded-full border border-gray-200 dark:border-[#2A3D38]">
                                                                                {sub}
                                                                            </span>
                                                                        ))}
                                                                        {category.subCategories.length > 3 && (
                                                                            <span className="text-[10px] text-[#1E352F] dark:text-[#E8F5F2] bg-[#E6F9F6] dark:bg-[#1C2B27] px-2.5 py-1 rounded-full border border-[#E6E1D8] dark:border-[#2A3D38]">
                                                                                +{category.subCategories.length - 3}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        {/* Action Buttons */}
                                                        <div className="px-4 py-3 bg-gray-50 dark:bg-[#0F1A17] border-t border-gray-200 dark:border-[#2A3D38] flex items-center justify-between">

                                                            <button
                                                                onClick={(e) => shareCategory(category, e)}
                                                                className="text-gray-400 dark:text-[#66756F] hover:text-[#29BBA3] transition-colors duration-200"
                                                            >
                                                                <FaShareAlt />
                                                            </button>
                                                            <Link
                                                                to={`/events?category=${category.id}`}
                                                                className="text-xs font-medium text-[#29BBA3] hover:text-[#1E352F] dark:text-[#E8F5F2] transition-colors duration-200 flex items-center gap-1"
                                                            >
                                                                <FaEye className="text-xs" />
                                                                View Events
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                // List View with Full Width Image
                                                return (
                                                    <div
                                                        key={category.id}
                                                        className="group bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-[#2A3D38] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-[#E6E1D8] dark:border-[#2A3D38] hover:shadow-teal-900/10 transform hover:-translate-y-1"
                                                    >
                                                        <Link to={`/events?category=${category.id}`} className="block">
                                                            <div className="flex flex-col sm:flex-row">
                                                                {/* Full Width Image on Mobile, Fixed Width on Desktop */}
                                                                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-[#162019]">
                                                                    {category.image ? (
                                                                        <img
                                                                            src={category.image}
                                                                            alt={category.name}
                                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FDFDF7] dark:from-[#0F1A17] to-[#F4F3EC] dark:to-[#0F1A17]">
                                                                            <Icon className="text-5xl text-teal-200" />
                                                                        </div>
                                                                    )}
                                                                    {/* Gradient Overlay */}
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                                                    {/* Badges on Image */}
                                                                    <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap justify-end">
                                                                        {category.featured && (
                                                                            <span className="text-[10px] font-semibold text-white bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] px-2.5 py-1 rounded-full shadow-sm">
                                                                                <FaStar className="inline text-yellow-300 mr-1 text-[8px]" />
                                                                                Featured
                                                                            </span>
                                                                        )}
                                                                        {category.popular && (
                                                                            <span className="text-[10px] font-medium text-amber-700 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-200">
                                                                                <FaFire className="inline text-amber-500 mr-1 text-[8px]" />
                                                                                Popular
                                                                            </span>
                                                                        )}
                                                                        {category.trending && (
                                                                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200">
                                                                                <MdTrendingUp className="inline text-emerald-500 mr-1 text-[8px]" />
                                                                                Trending
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 p-5">
                                                                    <h3 className="text-base font-serif font-bold text-gray-900 dark:text-[#E8F5F2] group-hover:text-[#29BBA3] transition-colors duration-200 mb-1">
                                                                        {category.name}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-600 dark:text-[#7AA49D] leading-relaxed mb-3">
                                                                        {category.description}
                                                                    </p>
                                                                    <div className="flex flex-wrap items-center gap-3">

                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {category.subCategories.slice(0, 3).map((sub, idx) => (
                                                                                <span key={idx} className="text-[10px] text-gray-600 dark:text-[#7AA49D] bg-gray-50 dark:bg-[#0F1A17] px-2.5 py-1 rounded-full border border-gray-200 dark:border-[#2A3D38]">
                                                                                    {sub}
                                                                                </span>
                                                                            ))}
                                                                            {category.subCategories.length > 3 && (
                                                                                <span className="text-[10px] text-[#1E352F] dark:text-[#E8F5F2] bg-[#E6F9F6] dark:bg-[#1C2B27] px-2.5 py-1 rounded-full border border-[#E6E1D8] dark:border-[#2A3D38]">
                                                                                    +{category.subCategories.length - 3}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-[#2A3D38]/60">

                                                                        <button
                                                                            onClick={(e) => shareCategory(category, e)}
                                                                            className="text-gray-400 dark:text-[#66756F] hover:text-[#29BBA3] transition-colors duration-200"
                                                                        >
                                                                            <FaShareAlt />
                                                                        </button>
                                                                        <Link
                                                                            to={`/events?category=${category.id}`}
                                                                            className="text-xs font-medium text-[#29BBA3] hover:text-[#1E352F] dark:text-[#E8F5F2] transition-colors duration-200 flex items-center gap-1"
                                                                        >
                                                                            <FaEye className="text-xs" />
                                                                            View Events
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Popular Categories Highlight */}
                    <section className="py-12 bg-gray-50 dark:bg-[#0F1A17] border-y border-gray-100 dark:border-[#2A3D38]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-3">
                                    <FaFire className="text-amber-500 text-xs" />
                                    <span className="text-xs font-medium text-amber-700 tracking-wider uppercase">
                                        Trending Now
                                    </span>
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-[#E8F5F2]">
                                    Most <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Popular</span> Categories
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-[#7AA49D] mt-1">
                                    Discover the most loved event categories
                                </p>
                                <div className="mt-2.5 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {categories.filter(c => c.popular).map((category) => {
                                    const Icon = category.icon || MdCategory;
                                    const colorClass = category.color;
                                    return (
                                        <Link
                                            key={category.id}
                                            to={`/events?category=${category.id}`}
                                            className="group bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-[#2A3D38] rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:border-[#E6E1D8] dark:border-[#2A3D38] hover:shadow-teal-900/10 transform hover:-translate-y-1"
                                        >
                                            <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2 bg-gray-100 dark:bg-[#162019]">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FDFDF7] dark:from-[#0F1A17] to-[#F4F3EC] dark:to-[#0F1A17]">
                                                        <Icon className="text-3xl text-teal-200" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs font-serif font-semibold text-gray-800 dark:text-[#E8F5F2] group-hover:text-[#29BBA3] transition-colors duration-200">
                                                {category.name}
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-12 bg-white dark:bg-[#1C2B27]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-gradient-to-br from-[#FDFDF7] dark:from-[#0F1A17]/80 via-white dark:via-[#162019] to-[#F4F3EC] dark:to-[#0F1A17]/80 border border-[#E6F9F6] rounded-3xl p-8 md:p-10 text-center max-w-4xl mx-auto shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="inline-flex items-center gap-2 bg-[#E6F9F6] dark:bg-[#1C2B27]/80 border border-[#E6E1D8] dark:border-[#2A3D38] rounded-full px-4 py-1.5 mb-4">
                                    <FaRocket className="text-[#29BBA3] text-xs" />
                                    <span className="text-xs font-medium text-[#1E352F] dark:text-[#E8F5F2] tracking-wider uppercase">
                                        Can't Find What You're Looking For?
                                    </span>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-[#E8F5F2] mb-2">
                                    Suggest a New <span className="bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] bg-clip-text text-transparent">Category</span>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-[#7AA49D] mb-6 max-w-lg mx-auto">
                                    Don't see your favorite event type? Contact us to suggest a new category.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link
                                        to="/events"
                                        className="px-6 py-3 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl hover:from-[#29BBA3] hover:to-[#1E8B7A] transition-all duration-300 text-sm font-medium shadow-md shadow-purple-950/30 hover:shadow-purple-950/50 inline-flex items-center gap-2"
                                    >
                                        Browse All Events
                                        <FaArrowRight className="text-sm" />
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="px-6 py-3 bg-white dark:bg-[#1C2B27] text-gray-700 dark:text-[#A8C4BE] rounded-xl hover:bg-gray-50 dark:bg-[#0F1A17] transition-all duration-300 text-sm font-medium border border-gray-200 dark:border-[#2A3D38] hover:border-[#E6E1D8] dark:border-[#2A3D38] inline-flex items-center gap-2"
                                    >
                                        Suggest a Category
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Share Category Modal */}
                {shareModalCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white dark:bg-[#1C2B27] border border-[#E6E1D8] dark:border-[#2A3D38] rounded-2xl max-w-md w-full p-6 shadow-2xl relative transition-all duration-300">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2A3D38]">
                                <div>
                                    <h3 className="text-lg font-bold text-[#1E352F] dark:text-[#E8F5F2]">
                                        Share Category
                                    </h3>
                                    <p className="text-xs text-[#66756F] dark:text-[#7AA49D]">
                                        Share <span className="font-semibold text-[#1E8B7A]">{shareModalCategory.name}</span> with friends
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShareModalCategory(null)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#0F1A17] text-gray-400 hover:text-gray-600 dark:hover:text-[#E8F5F2] transition-colors"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Social Sharing Buttons Grid */}
                            <div className="grid grid-cols-3 gap-3 my-6">
                                {/* WhatsApp */}
                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${shareModalCategory.name} events on ${APP_NAME_CAPITALIZED}: ${window.location.origin}/events?category=${shareModalCategory.id}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <FaWhatsapp className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium">WhatsApp</span>
                                </a>

                                {/* Facebook */}
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/events?category=${shareModalCategory.id}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <FaFacebookF className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium">Facebook</span>
                                </a>

                                {/* Twitter / X */}
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${shareModalCategory.name} events on ${APP_NAME_CAPITALIZED}!`)}&url=${encodeURIComponent(`${window.location.origin}/events?category=${shareModalCategory.id}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/40 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <FaTwitter className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium">X / Twitter</span>
                                </a>

                                {/* Telegram */}
                                <a
                                    href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/events?category=${shareModalCategory.id}`)}&text=${encodeURIComponent(`Check out ${shareModalCategory.name} events on ${APP_NAME_CAPITALIZED}!`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sky-600 dark:text-sky-400 transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <FaTelegramPlane className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium">Telegram</span>
                                </a>

                                {/* LinkedIn */}
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/events?category=${shareModalCategory.id}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <FaLinkedinIn className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium">LinkedIn</span>
                                </a>

                                {/* Email */}
                                <a
                                    href={`mailto:?subject=${encodeURIComponent(`Check out ${shareModalCategory.name} on ${APP_NAME_CAPITALIZED}`)}&body=${encodeURIComponent(`Hey, check out ${shareModalCategory.name} events on ${APP_NAME_CAPITALIZED}: ${window.location.origin}/events?category=${shareModalCategory.id}`)}`}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-[#1E8B7A] dark:text-[#29BBA3] transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#1E8B7A] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <FaEnvelope className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium">Email</span>
                                </a>
                            </div>

                            {/* Copy Direct Link Input */}
                            <div className="pt-3 border-t border-gray-100 dark:border-[#2A3D38]">
                                <label className="block text-xs font-medium text-[#66756F] dark:text-[#7AA49D] mb-2">
                                    Or copy link
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${window.location.origin}/events?category=${shareModalCategory.id}`}
                                        className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-[#0F1A17] border border-gray-200 dark:border-[#2A3D38] rounded-xl text-gray-700 dark:text-[#A8C4BE] focus:outline-none"
                                    />
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/events?category=${shareModalCategory.id}`);
                                            setCopied(true);
                                            toast.success('Link copied to clipboard!');
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${copied
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-[#29BBA3] hover:bg-[#1E8B7A] text-white'
                                            }`}
                                    >
                                        {copied ? <FaCheck className="w-3.5 h-3.5" /> : <FaCopy className="w-3.5 h-3.5" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </PublicLayout>
        </>
    );
};

export default Categories;