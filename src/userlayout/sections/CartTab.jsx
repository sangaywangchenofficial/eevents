import React from 'react';
import { ShoppingCartIcon, CalendarIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import EmptyState from '../components/EmptyState';

const CartTab = ({ cartItems, cartTotal, updateCartQty, removeCartItem, updatingItemId, navigate, userId, formatDate, formatPrice }) => {
    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        navigate('/payment', {
            state: { cartItems, totalAmount: parseFloat(cartTotal.toFixed(2)), userId }
        });
    };

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 dark:text-[#E8F5F2]">Shopping Cart ({cartItems.length})</h2>
            </div>

            {cartItems.length === 0 ? (
                <EmptyState icon={ShoppingCartIcon} title="Your cart is empty"
                    desc="Browse events and add some tickets!"
                    actionLabel="Browse Events" onAction={() => navigate('/events')} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {cartItems.map((it) => {
                            const price = parseFloat(it.event?.event_price) || 0;
                            const qty = parseInt(it.quantity) || 0;
                            const sub = price * qty;
                            return (
                                <div key={it.id} className={`flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-[#2A3D38] hover:shadow-sm transition-all ${updatingItemId === it.id ? 'opacity-60' : ''
                                    }`}>
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#E6F9F6] dark:from-[#1C2B27] to-[#C8EDE8] dark:to-[#2A3D38] overflow-hidden flex-shrink-0">
                                        {it.event?.event_image && (
                                            <img src={it.event.event_image} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-[#E8F5F2] truncate">{it.event?.event_name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-[#7AA49D] mt-0.5 flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" /> {formatDate(it.event?.event_date)}
                                            </p>
                                            <p className="text-sm font-bold text-[#F0A71E] mt-1">${formatPrice(price)} each</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2 bg-[#F4F3EC] dark:bg-[#162019] rounded-lg p-1">
                                                <button
                                                    onClick={() => updateCartQty(it.id, qty - 1, it)}
                                                    disabled={updatingItemId === it.id || qty <= 1}
                                                    className="w-7 h-7 rounded-md bg-white dark:bg-[#1C2B27] flex items-center justify-center hover:bg-[#E6E1D8] text-[#1E8B7A] disabled:opacity-40"
                                                >
                                                    <MinusIcon className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold text-[#1E352F] dark:text-[#E8F5F2]">{qty}</span>
                                                <button
                                                    onClick={() => updateCartQty(it.id, qty + 1, it)}
                                                    disabled={updatingItemId === it.id}
                                                    className="w-7 h-7 rounded-md bg-white dark:bg-[#1C2B27] flex items-center justify-center hover:bg-[#E6E1D8] text-[#1E8B7A] disabled:opacity-40"
                                                >
                                                    <PlusIcon className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-800 dark:text-[#E8F5F2]">${formatPrice(sub)}</span>
                                                <button
                                                    onClick={() => removeCartItem(it.id)}
                                                    disabled={updatingItemId === it.id}
                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-gradient-to-br from-[#F4F3EC] to-[#FDFDF7] dark:from-[#162019] dark:to-[#1C2B27] rounded-2xl p-6 border border-[#E6E1D8] dark:border-[#2A3D38] h-fit sticky top-24">
                        <h3 className="font-bold text-gray-800 dark:text-[#E8F5F2] mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-[#66756F] dark:text-[#7AA49D]">
                                <span>Items ({cartItems.length})</span>
                                <span>${formatPrice(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-[#66756F] dark:text-[#7AA49D]">
                                <span>Service Fee</span>
                                <span>$0.00</span>
                            </div>
                        </div>
                        <div className="border-t border-[#E6E1D8] dark:border-[#2A3D38] mt-4 pt-4 flex justify-between font-bold text-lg text-gray-800 dark:text-[#E8F5F2]">
                            <span>Total</span>
                            <span className="text-[#F0A71E]">${formatPrice(cartTotal)}</span>
                        </div>
                        <button onClick={handleCheckout}
                            disabled={cartTotal <= 0}
                            className="w-full mt-5 py-3 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartTab;
