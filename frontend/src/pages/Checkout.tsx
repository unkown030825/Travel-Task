import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  setUserInfo,
  setPromoCode,
  setDiscount,
  createBooking,
  clearError,
} from '../store/bookingSlice';
import { validatePromoCode } from '../store/bookingSlice';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    selectedExperience,
    selectedSlot,
    quantity,
    userInfo,
    promoCode,
    discount,
    loading,
    error,
  } = useAppSelector((state) => state.booking);

  const [localPromoCode, setLocalPromoCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!selectedExperience || !selectedSlot) {
    navigate('/');
    return null;
  }

  const subtotal = selectedExperience.price * quantity;
  const taxes = Math.round(subtotal * 0.06);
  const discountAmount = discount;
  const total = subtotal + taxes - discountAmount;

  const handleApplyPromo = async () => {
    if (!localPromoCode.trim()) return;

    try {
      dispatch(clearError());
      const result = await dispatch(validatePromoCode(localPromoCode)).unwrap();

      let discountValue = 0;
      if (result.type === 'percent') {
        discountValue = Math.round((subtotal * result.value) / 100);
      } else if (result.type === 'flat') {
        discountValue = result.value;
      }

      dispatch(setPromoCode(localPromoCode));
      dispatch(setDiscount(discountValue));
      setValidationError('');
    } catch (err) {
      setValidationError('Invalid promo code');
      dispatch(setDiscount(0));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo.name || !userInfo.email) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (!agreedToTerms) {
      setValidationError('Please agree to terms and safety policy');
      return;
    }

    try {
      await dispatch(
        createBooking({
          experience_id: selectedExperience.id,
          slot_id: selectedSlot.id,
          user_name: userInfo.name,
          user_email: userInfo.email,
          quantity,
          subtotal,
          taxes,
          total_price: total,
          promo_code: promoCode || undefined,
          discount_amount: discountAmount,
        })
      ).unwrap();

      navigate('/result');
    } catch (err) {
      setValidationError('Failed to create booking. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Checkout</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={userInfo.name}
                    onChange={(e) =>
                      dispatch(
                        setUserInfo({ ...userInfo, name: e.target.value })
                      )
                    }
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Your name"
                    value={userInfo.email}
                    onChange={(e) =>
                      dispatch(
                        setUserInfo({ ...userInfo, email: e.target.value })
                      )
                    }
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={localPromoCode}
                    onChange={(e) => setLocalPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                {discount > 0 && (
                  <p className="text-green-600 text-sm mt-2">
                    Promo code applied! You saved ₹{discount}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the terms and safety policy
                  </span>
                </label>
              </div>

              {validationError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {validationError}
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{selectedExperience.title}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">
                      {new Date(selectedSlot.date + 'T00:00:00').toLocaleDateString(
                        'en-US',
                        { year: 'numeric', month: '2-digit', day: '2-digit' }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{selectedSlot.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Qty</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium">₹{taxes}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{discount}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold">₹{total}</span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      loading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-400 text-black hover:bg-yellow-500'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Pay and Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
