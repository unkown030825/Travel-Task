import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { clearBooking } from '../store/bookingSlice';

export default function Result() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { lastBooking } = useAppSelector((state) => state.booking);

  useEffect(() => {
    if (!lastBooking) {
      navigate('/');
    }
  }, [lastBooking, navigate]);

  const handleBackToHome = () => {
    dispatch(clearBooking());
    navigate('/');
  };

  if (!lastBooking) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500 text-white rounded-full p-4">
              <CheckCircle className="w-12 h-12" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed
          </h1>

          <p className="text-gray-600 mb-8">
            Ref ID: {lastBooking.reference_id}
          </p>

          <button
            onClick={handleBackToHome}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
