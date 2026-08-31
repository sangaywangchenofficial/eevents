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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const paymentMethods = {
        'Bhutan Banks': [
            { id: 'bob', label: 'Bank of Bhutan (BoB)', icon: '/images/bob.png' },
            { id: 'bnb', label: 'Bhutan National Bank (BNB)', icon: '/images/bnb.jpeg' },
            { id: 'druk_pnb', label: 'Druk PNB Bank', icon: '/images/druk_pnb.jpeg' },
            { id: 'tbank', label: 'T-Bank (Bhutan)', icon: '/images/tashibank.jpeg' },
            { id: 'epay', label: 'ePay Bhutan Development Bank', icon: '/images/epay.jpeg' },
            { id: 'dk', label: 'Digital Kidu', icon: '/images/dkbank.png' },
        ],
        'Cards': [
            { id: 'visa', label: 'Visa Card', icon: '/images/visa.jpeg' },
            { id: 'mastercard', label: 'Mastercard', icon: '/images/mastercard.jpg' },
        ],
        'Cash': [
            { id: 'cash', label: 'Cash Payment', icon: '/images/cash.png' },
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
            setTimeout(() => navigate('/userdashboard'), 2000);
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
            <ToastContainer position="top-right" autoClose={3000} theme="dark" newestOnTop />
            <div className="p-5 max-w-6xl mx-auto min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-[#1E1B4B] dark:text-[#E8F5F2]">Checkout and Payment</h1>

                <div className="bg-white dark:bg-[#1C2B27] p-8 rounded-xl shadow-lg border border-gray-100 dark:border-[#2A3D38] max-w-3xl mx-auto">

                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4 text-[#1E1B4B] dark:text-[#E8F5F2]">Order Summary</h3>
                        <div className="p-4 bg-gray-50 dark:bg-[#162019] rounded-lg border border-gray-200 dark:border-[#2A3D38]">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                Total Amount: <span className="text-[#29BBA3]">Nu. {totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'}</span>
                            </p>
                            {userId && (
                                <p className="text-sm text-gray-600 dark:text-[#7AA49D] mt-2">
                                    <span className="font-semibold">User ID:</span> {userId}
                                </p>
                            )}
                            {cartItems && cartItems.length > 0 && (
                                <p className="text-sm text-gray-600 dark:text-[#7AA49D] mt-1">
                                    <span className="font-semibold">Items:</span> {cartItems.length} item(s)
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4 text-[#1E1B4B] dark:text-[#E8F5F2]">Select Payment Method</h3>
                        <div className="mb-4 relative">
                            <label className="block mb-2 font-medium text-gray-700 dark:text-[#A8C4BE]">
                                Choose your payment method:
                            </label>

                            {/* Custom Dropdown */}
                            <div className="relative">
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full p-3 min-h-[52px] border-2 border-gray-200 dark:border-[#2A3D38] rounded-lg bg-white dark:bg-[#162019] text-gray-900 dark:text-white flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#29BBA3] transition-all"
                                >
                                    {selectedMethod ? (
                                        <div className="flex items-center gap-3">
                                            <img src={selectedMethod.icon} alt={selectedMethod.label} className="w-8 h-8 object-contain rounded-md bg-white border border-gray-100" />
                                            <span>{selectedMethod.label}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">-- Select Payment Method --</span>
                                    )}
                                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-[#2A3D38] rounded-lg shadow-xl max-h-[300px] overflow-y-auto">
                                        {Object.entries(paymentMethods).map(([category, methods]) => (
                                            <div key={category}>
                                                <div className="px-4 py-2 bg-gray-50 dark:bg-[#162019] font-bold text-sm text-gray-500 dark:text-[#A8C4BE] border-y border-gray-100 dark:border-[#2A3D38] sticky top-0">
                                                    {category}
                                                </div>
                                                {methods.map((method) => (
                                                    <div
                                                        key={method.id}
                                                        onClick={() => {
                                                            handlePaymentMethodChange({ target: { value: method.id } });
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="px-4 py-3 flex items-center gap-3 hover:bg-[#E6F9F6] dark:hover:bg-[#29BBA3]/10 cursor-pointer transition-colors border-b border-gray-50 dark:border-[#2A3D38]/50 last:border-0"
                                                    >
                                                        <img src={method.icon} alt={method.label} className="w-8 h-8 object-contain rounded-md bg-white border border-gray-100" />
                                                        <span className="text-gray-800 dark:text-[#E8F5F2]">{method.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedMethod && (
                            <div className="p-4 bg-[#E6F9F6] dark:bg-teal-900/20 rounded-lg border-2 border-[#29BBA3]/50 flex items-center gap-4 mt-6">
                                <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <img src={selectedMethod.icon} alt={selectedMethod.label} className="w-12 h-12 object-contain" />
                                </div>
                                <div>
                                    <div className="font-semibold text-[#1E8B7A] dark:text-[#29BBA3]">
                                        {selectedMethod.label}
                                    </div>
                                    <div className="text-xs text-[#1E8B7A]/80 dark:text-[#29BBA3]/80 mt-0.5">
                                        Category: {selectedMethod.category}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 px-6 border-2 border-[#1E8B7A] dark:border-[#29BBA3] text-[#1E8B7A] dark:text-[#29BBA3] font-bold rounded-xl hover:bg-[#E6F9F6] dark:hover:bg-[#29BBA3]/10 transition-colors"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isButtonDisabled}
                            className={`flex-[2] py-3 px-6 font-bold rounded-xl text-white transition-all ${isButtonDisabled
                                ? 'bg-gray-400 cursor-not-allowed opacity-60'
                                : 'bg-gradient-to-r from-[#1E8B7A] to-[#29BBA3] hover:shadow-lg cursor-pointer'
                                }`}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>

                    {!userId && (
                        <div className="mt-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-center font-medium">
                            ⚠️ Please login to place an order
                        </div>
                    )}

                    {totalAmount <= 0 && userId && cartItems.length === 0 && (
                        <div className="mt-6 p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-center font-medium">
                            ⚠️ Your cart is empty. Please add items before proceeding.
                        </div>
                    )}

                    {paymentMethod && userId && totalAmount > 0 && cartItems.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-center text-sm">
                            ℹ️ You are about to pay Nu. {totalAmount.toFixed(2)} via {selectedMethod?.label}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default PaymentPage;
