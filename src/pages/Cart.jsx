import { useState, useEffect } from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated, getUserId } from '../utils/auth';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const userId = getUserId();
    const { fetchCartCount } = useCart();
    const [cartItems, setCartItems] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            toast.error('Please login to view your cart');
            return;
        }
        if (userId) {
            fetchCart();
        }
    }, [userId, navigate]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/book/${userId}/`);
            const responseData = response.data;
            const items = responseData && responseData.data ? responseData.data : (Array.isArray(responseData) ? responseData : []);
            setCartItems(items);

            const total = items.reduce((sum, cartItem) => {
                const price = parseFloat(cartItem.event?.event_price) || 0;
                const quantity = parseInt(cartItem.quantity) || 0;
                return sum + (price * quantity);
            }, 0);
            setGrandTotal(total);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityUpdate = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        if (updatingItemId === cartItemId) return;
        if (isNaN(newQuantity) || newQuantity <= 0) {
            toast.error('Invalid quantity');
            return;
        }

        setUpdatingItemId(cartItemId);
        try {
            const response = await api.put('/book/update-quantity/', {
                booking_id: cartItemId,
                quantity: parseInt(newQuantity)
            });
            toast.success(response.data?.message || 'Quantity updated successfully');
            await fetchCart();
            fetchCartCount();
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error(error.message || 'Failed to update quantity');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        const confirmation = window.confirm('Are you sure you want to remove this item from your cart?');
        if (!confirmation) return;

        const itemToRemove = cartItems.find(item => item.id === cartItemId);
        const itemSubtotal = itemToRemove ?
            (parseFloat(itemToRemove.event?.event_price) || 0) * (parseInt(itemToRemove.quantity) || 0) : 0;

        setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
        setGrandTotal(prevTotal => {
            const newTotal = prevTotal - itemSubtotal;
            return newTotal < 0 ? 0 : newTotal;
        });

        try {
            const response = await api.delete(`/book/remove/${cartItemId}/`);
            toast.success(response.data?.message || 'Item removed from cart');
            fetchCartCount();
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error(error.message || 'Failed to remove item');
            await fetchCart();
        }
    };

    const handleCheckout = () => {
        if (!cartItems || cartItems.length === 0) {
            toast.warning('Your cart is empty');
            return;
        }
        if (grandTotal <= 0) {
            toast.warning('Invalid total amount. Please check your cart.');
            return;
        }
        const invalidItems = cartItems.filter(item => {
            const price = parseFloat(item.event?.event_price) || 0;
            return price <= 0;
        });
        if (invalidItems.length > 0) {
            toast.error('Some items in your cart have invalid prices. Please remove them.');
            return;
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        navigate('/payment', {
            state: {
                cartItems: cartItems,
                totalAmount: parseFloat(grandTotal.toFixed(2)),
                userId: userId
            }
        });
    };

    if (loading) {
        return (
            <PublicLayout>
                <div className="text-center py-[50px] text-gray-500 dark:text-[#7AA49D]">
                    <div className="w-10 h-10 border-4 border-[#29BBA3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading your cart...</p>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <ToastContainer position="top-right" autoClose={2000} theme="dark" />
            <div className="max-w-5xl mx-auto px-5 py-8">
                <h1 className="text-[#1E1B4B] dark:text-[#E8F5F2] mb-2 text-3xl font-bold">Shopping Cart</h1>
                <p className="text-[#666] dark:text-[#A8C4BE] mb-6">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </p>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 px-10 bg-gray-50 dark:bg-[#1C2B27] rounded-2xl border border-gray-100 dark:border-[#2A3D38]">
                        <p className="text-lg text-[#666] dark:text-[#A8C4BE]">Your cart is empty</p>
                        <button
                            onClick={() => navigate('/events')}
                            className="mt-4 px-8 py-3 bg-[#6B21A8] hover:bg-[#581C87] text-white rounded-xl font-semibold text-base transition-all duration-200"
                        >
                            Browse Events
                        </button>
                    </div>
                ) : (
                    <div>
                        {cartItems.map((cartItem) => {
                            const price = parseFloat(cartItem.event?.event_price) || 0;
                            const quantity = parseInt(cartItem.quantity) || 0;
                            const subtotal = price * quantity;

                            return (
                                <div
                                    key={cartItem.id}
                                    className="flex items-center p-4 border border-gray-200 dark:border-[#2A3D38] rounded-xl mb-3 gap-5 bg-white dark:bg-[#1C2B27] flex-wrap transition-all duration-200 shadow-sm hover:shadow-md"
                                    style={{ opacity: updatingItemId === cartItem.id ? 0.6 : 1 }}
                                >
                                    <img
                                        src={cartItem.event?.event_image || '/placeholder-image.jpg'}
                                        alt={cartItem.event?.event_name || 'Event'}
                                        className="w-[100px] h-[100px] object-cover rounded-lg flex-shrink-0"
                                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                    />
                                    <div className="flex-1 min-w-[200px]">
                                        <h3 className="mb-1 text-[#1E1B4B] dark:text-[#E8F5F2] font-bold text-base">
                                            {cartItem.event?.event_name || 'Unknown Event'}
                                        </h3>
                                        <p className="my-1 text-[#666] dark:text-[#A8C4BE] text-sm">
                                            Price: ₹{price.toFixed(2)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                                            <label className="font-bold text-[#1E1B4B] dark:text-[#E8F5F2] text-sm">Quantity:</label>
                                            <button
                                                onClick={() => handleQuantityUpdate(cartItem.id, quantity - 1)}
                                                className="px-3 py-1 border border-gray-300 dark:border-[#3D5550] rounded bg-gray-100 dark:bg-[#162019] text-gray-800 dark:text-[#E8F5F2] font-bold hover:bg-gray-200 dark:hover:bg-[#2A3D38] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={quantity <= 1 || updatingItemId === cartItem.id}
                                            >
                                                -
                                            </button>
                                            <span className="min-w-[30px] text-center font-bold text-[#1E1B4B] dark:text-[#E8F5F2]">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityUpdate(cartItem.id, quantity + 1)}
                                                className="px-3 py-1 border border-gray-300 dark:border-[#3D5550] rounded bg-gray-100 dark:bg-[#162019] text-gray-800 dark:text-[#E8F5F2] font-bold hover:bg-gray-200 dark:hover:bg-[#2A3D38] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={updatingItemId === cartItem.id}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="mt-2 font-bold text-[#6B21A8] dark:text-purple-400 text-base">
                                            Subtotal: ₹{subtotal.toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(cartItem.id)}
                                        className="px-5 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-900/40 dark:hover:bg-red-800/60 text-white dark:text-red-200 rounded-lg font-semibold transition-all duration-200 self-start disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={updatingItemId === cartItem.id}
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        })}

                        <div className="mt-8 p-6 border-t-2 border-gray-200 dark:border-[#2A3D38] flex justify-between items-center bg-gray-50 dark:bg-[#162019] rounded-2xl flex-wrap gap-4">
                            <div>
                                <h2 className="m-0 text-[#1E1B4B] dark:text-[#E8F5F2] font-bold text-2xl">
                                    Grand Total: ₹{grandTotal.toFixed(2)}
                                </h2>
                                <p className="m-[5px_0_0_0] text-[#666] dark:text-[#A8C4BE]">
                                    {cartItems.length} items
                                </p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="px-9 py-3.5 bg-[#6B21A8] hover:bg-[#581C87] disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl text-base font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
                                disabled={grandTotal <= 0}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

export default Cart;
