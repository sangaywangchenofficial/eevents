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
  Heart
} from 'lucide-react';
import PublicLayout from '../publiclayout/PublicLayout';
import { getUserId } from '../utils/auth';
import { api } from '../utils/api';

// Fallback removed to show real event data from backend

const EventDetail = () => {
  const userId = getUserId();

  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/event-detail/${id}/`);
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

      if (response.ok) {
        toast.success(response.data?.message || '🎉 Event booked successfully! Your QR ticket is ready.');
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

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-[#FAF8FF] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#6B21A8] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-[#475569]">Loading event details...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-[#FAF8FF] flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl shadow-purple-900/5 border border-[#E9D5FF] max-w-md">
            <h2 className="text-2xl font-poppins font-bold text-[#1E1B4B] mb-3">Event Not Found</h2>
            <p className="text-[#475569] font-inter text-sm mb-6">We couldn't find the details for this event. It may have been removed or the link might be broken.</p>
            <button 
              onClick={() => navigate('/events')} 
              className="px-6 py-2.5 bg-[#6B21A8] hover:bg-[#581C87] text-white font-poppins font-semibold text-sm rounded-xl shadow-md transition-all"
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




  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FAF8FF] py-10 font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-poppins font-semibold text-[#1E1B4B] hover:text-[#6B21A8] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Events</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2.5 rounded-full border transition-all ${isBookmarked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-[#E9D5FF] text-[#475569] hover:text-[#6B21A8]'
                  }`}
                aria-label="Bookmark"
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-600' : ''}`} />
              </button>
              <button
                onClick={() => toast.info('Event link copied to clipboard!')}
                className="p-2.5 rounded-full bg-white border border-[#E9D5FF] text-[#475569] hover:text-[#6B21A8] transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="bg-white rounded-3xl border border-[#E9D5FF] shadow-2xl shadow-purple-900/5 overflow-hidden">
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
                      <span className="bg-white/90 backdrop-blur-md text-[#1E1B4B] text-xs font-poppins font-bold px-3.5 py-1.5 rounded-full shadow-md">
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
                    <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-purple-300">
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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6B21A8] text-xs font-poppins font-semibold uppercase tracking-wide mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Verified Event Pass</span>
                    </div>

                    <h1 className="font-poppins font-extrabold text-3xl text-[#1E1B4B] leading-tight">
                      {event.event_name}
                    </h1>
                  </div>

                  {/* Key Details Rows */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF8FF] border border-[#E9D5FF]">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6B21A8] flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Date & Day</p>
                        <p className="text-xs font-poppins font-bold text-[#1E1B4B] mt-0.5">{formatDate(event.event_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6B21A8] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Event Time</p>
                        <p className="text-xs font-poppins font-bold text-[#1E1B4B] mt-0.5">{event.event_time || '09:00 AM onwards'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6B21A8] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Location</p>
                        <p className="text-xs font-poppins font-bold text-[#1E1B4B] mt-0.5">{event.event_location || 'Thimphu, Bhutan'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6B21A8] flex items-center justify-center flex-shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Price per Ticket</p>
                        <p className="text-xs font-poppins font-bold text-[#6B21A8] mt-0.5">{formatPrice(event.event_price)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Event Description */}
                  <div className="space-y-2">
                    <h3 className="font-poppins font-bold text-base text-[#1E1B4B]">About This Experience</h3>
                    <p className="text-sm text-[#475569] leading-relaxed font-inter">
                      {event.event_description || 'Join us for this exciting cultural event in the Kingdom of Bhutan.'}
                    </p>
                  </div>
                </div>

                {/* Booking Box */}
                <div className="pt-6 border-t border-[#E9D5FF] space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-poppins font-semibold text-sm text-[#1E1B4B]">Select Quantity:</label>
                    <div className="flex items-center gap-3 bg-purple-50 p-1.5 rounded-2xl border border-[#E9D5FF]">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-8 h-8 rounded-xl bg-white text-[#1E1B4B] font-bold shadow-sm hover:bg-[#6B21A8] hover:text-white transition-colors flex items-center justify-center"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-poppins font-bold text-sm text-[#1E1B4B]">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-8 h-8 rounded-xl bg-white text-[#1E1B4B] font-bold shadow-sm hover:bg-[#6B21A8] hover:text-white transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/60 border border-[#E9D5FF]">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Total Amount</p>
                      <p className="font-poppins font-extrabold text-2xl text-[#6B21A8]">{totalPriceFormatted}</p>
                    </div>

                    <button
                      onClick={handleBookNow}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#6B21A8] to-[#8B5CF6] hover:from-[#581C87] hover:to-[#6B21A8] text-white font-poppins font-bold text-sm rounded-2xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Book Tickets Now</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Instant Digital QR Ticket Delivery • Local Bank Gateway Supported</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
};

export default EventDetail;