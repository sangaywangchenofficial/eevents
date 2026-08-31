import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Tag,
  Ticket,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  Clock,
  Share2,
  Heart,
  Star,
  Edit,
  Trash2,
  MessageSquare
} from 'lucide-react';
import PublicLayout from '../publiclayout/PublicLayout';
import SEO from '../components/SEO';
import { getUserId, APP_URL, APP_NAME_CAPITALIZED, buildEventSchema, getMediaUrl } from '../utils/auth';
import RatingBadge from '../components/RatingBadge';
import { api } from '../utils/api'; // Keep for other endpoints (booking, etc.)
import { useCart } from '../context/CartContext';

const EventDetail = () => {
  const userId = getUserId();
  const { fetchCartCount } = useCart();

  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // --- Review States ---
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Fetch Event Detail ---
  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  // --- Fetch Reviews ---
  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  const fetchEventDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/event-detail/${id}/`);
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      const eventData = data.data || data;
      if (eventData && eventData.event_name) {
        setEvent(eventData);
      } else {
        setEvent(null);
      }
    } catch (err) {
      console.warn("API Error fetching event detail:", err);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Review API Calls using fetch ---
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${API_BASE_URL}/event-reviews/?event_id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      const allReviews = data?.data || data || [];
      setReviews(allReviews);
      // Find current user's review
      if (userId) {
        const myReview = allReviews.find(
          r => r.user?.id === parseInt(userId) || r.user === parseInt(userId)
        );
        setUserReview(myReview || null);
        if (myReview) {
          setRating(myReview.rating);
          setComment(myReview.review_comment || '');
        } else {
          setRating(0);
          setComment('');
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error('Could not load reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  const submitReview = async () => {
    if (!userId) {
      toast.info('Please log in to submit a review');
      navigate('/login');
      return;
    }
    if (rating === 0) {
      toast.warning('Please select a star rating');
      return;
    }
    if (!comment.trim()) {
      toast.warning('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        event_id: id,
        user_id: userId,
        rating,
        comment: comment.trim()
      };
      const response = await fetch(`${API_BASE_URL}/event-reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Review submitted successfully!');
        setRating(0);
        setComment('');
        await fetchReviews();
      } else {
        toast.error(data?.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const updateReview = async () => {
    if (!userReview) return;
    if (rating === 0) {
      toast.warning('Please select a star rating');
      return;
    }
    if (!comment.trim()) {
      toast.warning('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        rating,
        comment: comment.trim()
      };
      const response = await fetch(`${API_BASE_URL}/event-reviews/${userReview.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Review updated!');
        setIsEditing(false);
        await fetchReviews();
      } else {
        toast.error(data?.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update review error:', err);
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async () => {
    if (!userReview) return;
    if (!window.confirm('Are you sure you want to delete your review?')) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/event-reviews/${userReview.id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Review deleted');
        setUserReview(null);
        setRating(0);
        setComment('');
        await fetchReviews();
      } else {
        const data = await response.json();
        toast.error(data?.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete review error:', err);
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Helpers ---
  const handleQuantityChange = (delta) => {
    const maxQty = event?.event_quantity || 10;
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= maxQty) {
      setQuantity(newQty);
    }
  };

  const handleBookNow = async () => {
    if (!userId) {
      toast.info('Please log in to book your tickets');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/book/add/', {
        user_id: userId,
        event_id: id,
        quantity: quantity,
      });

      if (response.status === 200 || response.ok || response.data) {
        toast.success(response.data?.message || 'Event booked successfully! Your QR ticket is ready.');
        fetchCartCount();
        setTimeout(() => {
          navigate('/cart');
        }, 2000);
      } else {
        toast.error(response.data?.message || 'Failed to book event');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num) || num === 0) return 'Free Entry';
    return `Nu. ${num.toLocaleString()}`;
  };

  // Helper to render stars
  const renderStars = (ratingValue, interactive = false, onChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= ratingValue;
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && onChange && onChange(i)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          disabled={!interactive}
        >
          <Star
            className={`w-5 h-5 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        </button>
      );
    }
    return stars;
  };

  // --- Loading / Not Found ---
  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-[#FDFDF7] dark:bg-[#0F1A17] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#29BBA3] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-[#4A5C57] dark:text-[#A8C4BE]">Loading event details...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-[#FDFDF7] dark:bg-[#0F1A17] flex items-center justify-center">
          <div className="text-center p-8 bg-white dark:bg-[#1C2B27] rounded-2xl shadow-xl shadow-teal-900/5 border border-[#E6E1D8] dark:border-[#2A3D38] max-w-md">
            <h2 className="text-2xl font-poppins font-bold text-[#1E352F] dark:text-[#E8F5F2] mb-3">Event Not Found</h2>
            <p className="text-[#4A5C57] dark:text-[#A8C4BE] font-inter text-sm mb-6">We couldn't find the details for this event. It may have been removed or the link might be broken.</p>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-2.5 bg-[#1E8B7A] hover:bg-[#1E352F] dark:bg-[#29BBA3] dark:hover:bg-[#1E8B7A] text-white font-poppins font-semibold text-sm rounded-xl shadow-md transition-all"
            >
              Browse All Events
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const priceVal = Number(event?.event_price) || 0;
  const totalPriceFormatted = priceVal === 0 ? 'Free' : `Nu. ${(priceVal * quantity).toLocaleString()}`;

  const eventSchema = buildEventSchema(event, `${APP_URL}/event/${id}`);
  const eventImageUrl = event?.event_image ? getMediaUrl(event.event_image) : null;

  // --- Render ---
  return (
    <PublicLayout>
      <SEO
        title={`${event.event_name} | ${APP_NAME_CAPITALIZED}`}
        description={
          event.event_description
            ? `${event.event_description.slice(0, 155)}... Book tickets for ${event.event_name} in ${event.event_location || 'Bhutan'}.`
            : `Book tickets for ${event.event_name} in ${event.event_location || 'Bhutan'} on ${APP_NAME_CAPITALIZED}.`
        }
        canonical={`${APP_URL}/event/${id}`}
        ogType="event"
        ogImage={eventImageUrl}
        schema={eventSchema}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Events', item: '/events' },
          { name: event.event_name, item: `/event/${id}` }
        ]}
      />
      <div className="min-h-screen bg-[#FDFDF7] dark:bg-[#0F1A17] py-10 font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-poppins font-semibold text-[#1E352F] dark:text-[#E8F5F2] hover:text-[#29BBA3] dark:hover:text-[#29BBA3] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Events</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2.5 rounded-full border transition-all ${isBookmarked
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                  : 'bg-white dark:bg-[#1C2B27] border-[#E6E1D8] dark:border-[#2A3D38] text-[#66756F] dark:text-[#A8C4BE] hover:text-[#29BBA3] dark:hover:text-[#29BBA3]'
                  }`}
                aria-label="Bookmark"
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-600 dark:fill-rose-400' : ''}`} />
              </button>
              <button
                onClick={() => toast.info('Event link copied to clipboard!')}
                className="p-2.5 rounded-full bg-white dark:bg-[#1C2B27] border border-[#E6E1D8] dark:border-[#2A3D38] text-[#66756F] dark:text-[#A8C4BE] hover:text-[#29BBA3] dark:hover:text-[#29BBA3] transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="bg-white dark:bg-[#1C2B27] rounded-3xl border border-[#E6E1D8] dark:border-[#2A3D38] shadow-2xl shadow-teal-900/5 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

              {/* Left Side: High-Res Image & Overlay Badges (Col 6) */}
              <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-[500px] bg-slate-900 overflow-hidden">
                <img
                  src={event.event_image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop'}
                  alt={event.event_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-6 flex flex-col justify-between">

                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    {(event.category_name || event.category) && (
                      <span className="bg-white dark:bg-[#1C2B27]/90 backdrop-blur-md text-[#1E352F] dark:text-[#E8F5F2] text-xs font-poppins font-bold px-3.5 py-1.5 rounded-full shadow-md">
                        {event.category_name || event.category}
                      </span>
                    )}

                    {event.is_event_available !== false ? (
                      <span className="bg-emerald-500/90 text-white backdrop-blur-md text-xs font-poppins font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tickets Available</span>
                      </span>
                    ) : (
                      <span className="bg-rose-500/90 text-white backdrop-blur-md text-xs font-poppins font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                        <XCircle className="w-4 h-4" />
                        <span>Event Completed</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="text-white space-y-1">
                    <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-teal-200">
                      {event.organizer || 'Official Bhutan Event'}
                    </p>
                    <h2 className="font-poppins font-extrabold text-2xl sm:text-3xl leading-tight">
                      {event.event_name}
                    </h2>
                  </div>

                </div>
              </div>

              {/* Right Side: Details & Instant Booking Panel (Col 6) */}
              <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">

                <div className="space-y-6">
                  {/* Title & Badge */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F9F6] dark:bg-[#29BBA3]/10 text-[#29BBA3] text-xs font-poppins font-semibold uppercase tracking-wide mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Verified Event Pass</span>
                    </div>

                    <h1 className="font-poppins font-extrabold text-3xl text-[#1E352F] dark:text-[#E8F5F2] leading-tight">
                      {event.event_name}
                    </h1>

                    <RatingBadge
                      averageRating={event.average_rating}
                      totalReviews={event.total_reviews}
                      distribution={event.rating_distribution}
                      size="large"
                    />
                  </div>

                  {/* Key Details Rows */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FDFDF7] dark:bg-[#0F1A17] border border-[#E6E1D8] dark:border-[#2A3D38]">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E6F9F6] dark:bg-[#162019] text-[#29BBA3] flex items-center justify-center flex-shrink-0 border border-transparent dark:border-[#2A3D38]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-[#66756F] dark:text-[#7AA49D] font-medium">Date & Day</p>
                        <p className="text-xs font-poppins font-bold text-[#1E352F] dark:text-[#E8F5F2] mt-0.5">{formatDate(event.event_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E6F9F6] dark:bg-[#162019] text-[#29BBA3] flex items-center justify-center flex-shrink-0 border border-transparent dark:border-[#2A3D38]">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-[#66756F] dark:text-[#7AA49D] font-medium">Event Time</p>
                        <p className="text-xs font-poppins font-bold text-[#1E352F] dark:text-[#E8F5F2] mt-0.5">{event.event_time || '09:00 AM onwards'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E6F9F6] dark:bg-[#162019] text-[#29BBA3] flex items-center justify-center flex-shrink-0 border border-transparent dark:border-[#2A3D38]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-[#66756F] dark:text-[#7AA49D] font-medium">Location</p>
                        <p className="text-xs font-poppins font-bold text-[#1E352F] dark:text-[#E8F5F2] mt-0.5">{event.event_location || 'Thimphu, Bhutan'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E6F9F6] dark:bg-[#162019] text-[#29BBA3] flex items-center justify-center flex-shrink-0 border border-transparent dark:border-[#2A3D38]">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-[#66756F] dark:text-[#7AA49D] font-medium">Price per Ticket</p>
                        <p className="text-xs font-poppins font-bold text-[#29BBA3] mt-0.5">{formatPrice(event.event_price)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Event Description */}
                  <div className="space-y-2">
                    <h3 className="font-poppins font-bold text-base text-[#1E352F] dark:text-[#E8F5F2]">About This Experience</h3>
                    <p className="text-sm text-[#4A5C57] dark:text-[#A8C4BE] leading-relaxed font-inter">
                      {event.event_description || 'Join us for this exciting cultural event in the Kingdom of Bhutan.'}
                    </p>
                  </div>
                </div>

                {/* Booking Box */}
                <div className="pt-6 border-t border-[#E6E1D8] dark:border-[#2A3D38] space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-poppins font-semibold text-sm text-[#1E352F] dark:text-[#E8F5F2]">Select Quantity:</label>
                    <div className="flex items-center gap-3 bg-[#F4F3EC] dark:bg-[#162019] p-1.5 rounded-2xl border border-[#E6E1D8] dark:border-[#2A3D38]">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C2B27] text-[#1E352F] dark:text-[#E8F5F2] font-bold shadow-sm hover:bg-[#1E8B7A] dark:hover:bg-[#29BBA3] hover:text-white transition-colors flex items-center justify-center"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-poppins font-bold text-sm text-[#1E352F] dark:text-[#E8F5F2]">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C2B27] text-[#1E352F] dark:text-[#E8F5F2] font-bold shadow-sm hover:bg-[#1E8B7A] dark:hover:bg-[#29BBA3] hover:text-white transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F3EC] dark:bg-[#162019]/60 border border-[#E6E1D8] dark:border-[#2A3D38]">
                    <div>
                      <p className="text-xs text-[#66756F] dark:text-[#7AA49D] font-medium">Total Amount</p>
                      <p className="font-poppins font-extrabold text-2xl text-[#29BBA3]">{totalPriceFormatted}</p>
                    </div>

                    <button
                      onClick={handleBookNow}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] hover:from-[#1E8B7A] hover:to-[#1E352F] text-white font-poppins font-bold text-sm rounded-2xl shadow-lg shadow-teal-900/30 transition-all flex items-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Book Tickets Now</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-[#66756F] dark:text-[#A8C4BE] pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#29BBA3]" />
                    <span>Instant Digital QR Ticket Delivery • Local Bank Gateway Supported</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ======================== REVIEWS SECTION ======================== */}
          <div className="mt-12 bg-white dark:bg-[#1C2B27] rounded-3xl border border-[#E6E1D8] dark:border-[#2A3D38] shadow-xl shadow-teal-900/5 p-6 sm:p-10">
            <h2 className="font-poppins font-bold text-2xl text-[#1E352F] dark:text-[#E8F5F2] mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#29BBA3]" />
              Reviews & Ratings
              <span className="ml-2 text-sm font-normal text-[#66756F] dark:text-[#7AA49D]">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </h2>

            {loadingReviews ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-[#29BBA3] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* --- Review List --- */}
                {reviews.length === 0 ? (
                  <p className="text-center text-sm text-[#66756F] dark:text-[#A8C4BE] py-4">
                    No reviews yet. Be the first to share your experience!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((rev) => {
                      const isOwn = userId && (rev.user?.id === parseInt(userId) || rev.user === parseInt(userId));
                      return (
                        <div key={rev.id} className="border-b border-[#E6E1D8] dark:border-[#2A3D38] pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-poppins font-semibold text-sm text-[#1E352F] dark:text-[#E8F5F2]">
                                  {rev.user_name || rev.user?.username || 'Anonymous'}
                                </span>
                                <span className="text-xs text-slate-400 dark:text-[#7AA49D]">
                                  {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 mt-1">
                                {renderStars(rev.rating)}
                              </div>
                            </div>
                            {isOwn && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setIsEditing(true);
                                    setRating(rev.rating);
                                    setComment(rev.review_comment || '');
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-[#E6F9F6] dark:hover:bg-[#162019] text-[#29BBA3] transition-colors"
                                  aria-label="Edit review"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={deleteReview}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors"
                                  aria-label="Delete review"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-[#4A5C57] dark:text-[#A8C4BE] leading-relaxed">
                            {rev.review_comment || 'No comment provided.'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* --- Review Form --- */}
                {userId ? (
                  <div className="mt-8 pt-6 border-t border-[#E6E1D8] dark:border-[#2A3D38]">
                    <h4 className="font-poppins font-semibold text-base text-[#1E352F] dark:text-[#E8F5F2] mb-4">
                      {userReview && !isEditing ? 'Your Review' : (isEditing ? 'Edit Your Review' : 'Write a Review')}
                    </h4>

                    {userReview && !isEditing ? (
                      <div className="text-sm text-[#66756F] dark:text-[#A8C4BE]">
                        You have already reviewed this event. You can edit or delete your review using the buttons above.
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (isEditing) {
                            updateReview();
                          } else {
                            submitReview();
                          }
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-[#1E352F] dark:text-[#E8F5F2] mb-1">
                            Your Rating
                          </label>
                          <div className="flex items-center gap-1">
                            {renderStars(rating, true, (val) => setRating(val))}
                            <span className="ml-2 text-sm text-[#66756F] dark:text-[#7AA49D]">
                              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select stars'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="review-comment" className="block text-sm font-medium text-[#1E352F] dark:text-[#E8F5F2] mb-1">
                            Your Comment
                          </label>
                          <textarea
                            id="review-comment"
                            rows="3"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E6E1D8] dark:border-[#2A3D38] bg-[#FDFDF7] dark:bg-[#0F1A17] text-[#1E352F] dark:text-[#E8F5F2] placeholder:text-sm placeholder-slate-400 dark:placeholder-[#7AA49D] focus:ring-2 focus:ring-[#29BBA3] focus:outline-none transition"
                            placeholder="Share your experience with this event..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={submitting}
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            disabled={submitting || rating === 0 || !comment.trim()}
                            className="px-6 py-2.5 bg-[#29BBA3] hover:bg-[#1E8B7A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-poppins font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                          >
                            {submitting ? 'Saving...' : (isEditing ? 'Update Review' : 'Submit Review')}
                          </button>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditing(false);
                                if (userReview) {
                                  setRating(userReview.rating);
                                  setComment(userReview.review_comment || '');
                                } else {
                                  setRating(0);
                                  setComment('');
                                }
                              }}
                              className="px-4 py-2.5 text-sm text-[#66756F] dark:text-[#A8C4BE] hover:text-[#1E352F] dark:hover:text-[#E8F5F2] transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="mt-8 pt-6 border-t border-[#E6E1D8] dark:border-[#2A3D38] text-center">
                    <p className="text-sm text-[#66756F] dark:text-[#A8C4BE]">
                      <button
                        onClick={() => navigate('/login')}
                        className="text-[#29BBA3] hover:underline font-medium"
                      >
                        Log in
                      </button> to leave a review.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </PublicLayout>
  );
};

export default EventDetail;