import { useState, useEffect } from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated, getUserId } from '../utils/auth';
import { api } from '../utils/api';

const Cart = () => {
    const userId = getUserId();
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
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div className="spinner">Loading...</div>
                    <p>Loading your cart...</p>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <ToastContainer position="top-right" autoClose={2000} theme="dark" />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ color: '#1E1B4B', marginBottom: '10px' }}>Shopping Cart</h1>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </p>

                {cartItems.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 40px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px'
                    }}>
                        <p style={{ fontSize: '18px', color: '#666' }}>Your cart is empty</p>
                        <button
                            onClick={() => navigate('/events')}
                            style={{
                                padding: '12px 30px',
                                backgroundColor: '#6B21A8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                marginTop: '15px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.target.style.backgroundColor = '#581C87'; }}
                            onMouseLeave={(e) => { e.target.style.backgroundColor = '#6B21A8'; }}
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
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '15px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        marginBottom: '10px',
                                        gap: '20px',
                                        backgroundColor: '#fff',
                                        opacity: updatingItemId === cartItem.id ? 0.6 : 1,
                                        transition: 'all 0.2s',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <img
                                        src={cartItem.event?.event_image || '/placeholder-image.jpg'}
                                        alt={cartItem.event?.event_name || 'Event'}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                    />
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <h3 style={{ margin: '0 0 5px 0', color: '#1E1B4B' }}>
                                            {cartItem.event?.event_name || 'Unknown Event'}
                                        </h3>
                                        <p style={{ margin: '5px 0', color: '#666' }}>
                                            Price: ₹{price.toFixed(2)}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginTop: '10px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <label style={{ fontWeight: 'bold', color: '#1E1B4B' }}>Quantity:</label>
                                            <button
                                                onClick={() => handleQuantityUpdate(cartItem.id, quantity - 1)}
                                                style={{
                                                    padding: '5px 12px',
                                                    cursor: 'pointer',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f8f9fa',
                                                    fontWeight: 'bold',
                                                    transition: 'all 0.2s'
                                                }}
                                                disabled={quantity <= 1 || updatingItemId === cartItem.id}
                                            >
                                                -
                                            </button>
                                            <span style={{
                                                minWidth: '30px',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: '#1E1B4B'
                                            }}>
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityUpdate(cartItem.id, quantity + 1)}
                                                style={{
                                                    padding: '5px 12px',
                                                    cursor: 'pointer',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f8f9fa',
                                                    fontWeight: 'bold',
                                                    transition: 'all 0.2s'
                                                }}
                                                disabled={updatingItemId === cartItem.id}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p style={{
                                            marginTop: '10px',
                                            fontWeight: 'bold',
                                            color: '#6B21A8',
                                            fontSize: '16px'
                                        }}>
                                            Subtotal: ₹{subtotal.toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(cartItem.id)}
                                        style={{
                                            padding: '8px 20px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            alignSelf: 'flex-start'
                                        }}
                                        disabled={updatingItemId === cartItem.id}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#c82333'; }}
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#dc3545'; }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        })}

                        <div style={{
                            marginTop: '30px',
                            padding: '25px',
                            borderTop: '2px solid #e0e0e0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            flexWrap: 'wrap',
                            gap: '15px'
                        }}>
                            <div>
                                <h2 style={{ margin: 0, color: '#1E1B4B' }}>
                                    Grand Total: ₹{grandTotal.toFixed(2)}
                                </h2>
                                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                    {cartItems.length} items
                                </p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                style={{
                                    padding: '14px 35px',
                                    backgroundColor: grandTotal > 0 ? '#6B21A8' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    cursor: grandTotal > 0 ? 'pointer' : 'not-allowed',
                                    fontWeight: 'bold',
                                    opacity: grandTotal > 0 ? 1 : 0.6,
                                    transition: 'all 0.2s'
                                }}
                                disabled={grandTotal <= 0}
                                onMouseEnter={(e) => { if (grandTotal > 0) e.target.style.backgroundColor = '#581C87'; }}
                                onMouseLeave={(e) => { if (grandTotal > 0) e.target.style.backgroundColor = '#6B21A8'; }}
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
