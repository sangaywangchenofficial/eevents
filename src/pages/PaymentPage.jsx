import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserId } from '../utils/auth';
import { api } from '../utils/api';

const PaymentPage = () => {
    const userId = getUserId();
    const [paymentMethod, setPaymentMethod] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedBank, setSelectedBank] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const paymentMethods = {
        'Bhutan Banks': [
            { id: 'bob', label: 'Bank of Bhutan (BoB)', icon: '🏦' },
            { id: 'bnb', label: 'Bhutan National Bank (BNB)', icon: '🏛️' },
            { id: 'druk_pnb', label: 'Druk PNB Bank', icon: '💰' },
            { id: 'tbank', label: 'T-Bank (Bhutan)', icon: '💳' },
            { id: 'mbank', label: 'ePay Bhutan Development Bank', icon: '📱' },
            { id: 'dk', label: 'Digital Kidu', icon: '💰' },
        ],
        'Cards': [
            { id: 'visa', label: 'Visa Card', icon: '💳' },
            { id: 'mastercard', label: 'Mastercard', icon: '💳' },
        ],
        'Cash': [
            { id: 'cash', label: 'Cash Payment', icon: '💵' },
        ],
    };

    const getAllPaymentMethods = () => {
        const allMethods = [];
        Object.entries(paymentMethods).forEach(([category, methods]) => {
            methods.forEach(method => {
                allMethods.push({
                    ...method,
                    category: category
                });
            });
        });
        return allMethods;
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            toast.error("Please login to make a payment");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        console.log('📍 Location state received:', location.state);

        let items = [];
        let total = 0;

        if (location.state?.cartItems) {
            items = location.state.cartItems;
        } else {
            const storedItems = localStorage.getItem('cartItems');
            if (storedItems) {
                try {
                    items = JSON.parse(storedItems);
                } catch (e) {
                    console.error('Error parsing cart items:', e);
                    items = [];
                }
            }
        }

        setCartItems(items);

        if (location.state?.totalAmount) {
            total = parseFloat(location.state.totalAmount);
        } else if (location.state?.grandTotal) {
            total = parseFloat(location.state.grandTotal);
        } else {
            if (items && items.length > 0) {
                total = items.reduce((sum, item) => {
                    const price = parseFloat(item.event?.event_price) || 0;
                    const quantity = parseInt(item.quantity) || 0;
                    return sum + (price * quantity);
                }, 0);
            }
        }

        if (total > 0) {
            setTotalAmount(total);
        } else {
            setTotalAmount(0);
            if (items.length === 0) {
                toast.warning("Your cart is empty. Please add items before proceeding.");
            }
        }
    }, [location, userId, navigate]);

    const handlePlaceOrder = async () => {
        if (!isAuthenticated()) {
            toast.error("Please login to place an order");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        if (!paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }
        if (!totalAmount || totalAmount <= 0) {
            toast.error("Invalid order amount. Please check your cart.");
            return;
        }
        if (!cartItems || cartItems.length === 0) {
            toast.error("Your cart is empty. Please add items to place an order.");
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                user_id: parseInt(userId),
                payment_method: paymentMethod,
                totalAmount: parseFloat(totalAmount.toFixed(2)),
                bank: selectedBank || paymentMethod,
                items: cartItems.map(item => ({
                    eventId: item.event?.id || item.id,
                    title: item.event?.event_name || 'Event',
                    quantity: parseInt(item.quantity || 1),
                    price: parseFloat(item.event?.event_price || 0),
                }))
            };

            await api.post('/place-order', orderData);
            toast.success("Order placed successfully!");
            localStorage.removeItem('cartItems');
            setTimeout(() => navigate('/my-bookings'), 2000);
        } catch (error) {
            console.error('❌ Order placement error:', error);
            toast.error(error.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentMethodChange = (e) => {
        const value = e.target.value;
        setPaymentMethod(value);
        const bankIds = ['bob', 'bnb', 'druk_pnb', 'tbank', 'mbank', 'dk'];
        if (bankIds.includes(value)) {
            setSelectedBank(value);
        } else {
            setSelectedBank("");
        }
    };

    const getSelectedMethodDetails = () => {
        const allMethods = getAllPaymentMethods();
        return allMethods.find(method => method.id === paymentMethod);
    };

    const selectedMethod = getSelectedMethodDetails();
    const isButtonDisabled = loading || !paymentMethod || totalAmount <= 0 || cartItems.length === 0 || !userId;

    return (
        <PublicLayout>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
                newestOnTop
            />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '30px', color: '#1E1B4B' }}>Checkout and Payment</h1>

                <div style={{
                    backgroundColor: '#fff',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#1E1B4B' }}>Order Summary</h3>
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                <strong>Total Amount:</strong> Nu. {totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'}
                            </p>
                            {userId && (
                                <p style={{ fontSize: '14px', color: '#666' }}>
                                    <strong>User ID:</strong> {userId}
                                </p>
                            )}
                            {cartItems && cartItems.length > 0 && (
                                <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                    <strong>Items:</strong> {cartItems.length} item(s)
                                </p>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#1E1B4B' }}>Select Payment Method</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Choose your payment method:
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={handlePaymentMethodChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    fontSize: '16px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    appearance: 'auto'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#6B21A8';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(107, 33, 168, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="">-- Select Payment Method --</option>
                                {Object.entries(paymentMethods).map(([category, methods]) => (
                                    <optgroup key={category} label={category}>
                                        {methods.map((method) => (
                                            <option key={method.id} value={method.id}>
                                                {method.icon} {method.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        {selectedMethod && (
                            <div style={{
                                padding: '12px 15px',
                                backgroundColor: '#f3e8ff',
                                borderRadius: '8px',
                                border: '1px solid #6B21A8',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ fontSize: '24px' }}>{selectedMethod.icon}</span>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#1E1B4B' }}>
                                        {selectedMethod.label}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6B21A8' }}>
                                        Category: {selectedMethod.category}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                padding: '12px 30px',
                                border: '2px solid #6B21A8',
                                borderRadius: '8px',
                                backgroundColor: 'transparent',
                                color: '#6B21A8',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                flex: 1
                            }}
                            onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3e8ff'; }}
                            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
                        >
                            Go Back
                        </button>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isButtonDisabled}
                            style={{
                                padding: '12px 30px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: isButtonDisabled ? '#ccc' : '#6B21A8',
                                color: 'white',
                                fontWeight: '600',
                                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                flex: 2,
                                opacity: isButtonDisabled ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>

                    {!userId && (
                        <div style={{
                            marginTop: '20px',
                            padding: '10px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            ⚠️ Please login to place an order
                        </div>
                    )}

                    {totalAmount <= 0 && userId && cartItems.length === 0 && (
                        <div style={{
                            marginTop: '20px',
                            padding: '10px',
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            ⚠️ Your cart is empty. Please add items before proceeding.
                        </div>
                    )}

                    {paymentMethod && userId && totalAmount > 0 && cartItems.length > 0 && (
                        <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontSize: '14px'
                        }}>
                            ✓ You're about to pay Nu. {totalAmount.toFixed(2)} via {selectedMethod?.label || paymentMethod.toUpperCase()}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default PaymentPage;
