import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchExperienceById } from '../store/experiencesSlice';
import { setSelectedExperience, setSelectedSlot, setQuantity } from '../store/bookingSlice';
import Loader from '../components/Loader';

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentExperience, currentSlots, loading, error } = useAppSelector(
    (state) => state.experiences
  );
  const { quantity } = useAppSelector((state) => state.booking);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = currentExperience ? [currentExperience.image_url] : [];

  useEffect(() => {
    if (id) {
      dispatch(fetchExperienceById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentSlots.length > 0 && !selectedDate) {
      setSelectedDate(currentSlots[0].date);
    }
  }, [currentSlots, selectedDate]);
  console.log(selectedDate);

const uniqueDates = [
  ...new Set(currentSlots.map((slot) => slot.date.slice(0, 10))),
];
const availableTimesForDate = currentSlots.filter(
  (slot) => slot.date.slice(0, 10) === selectedDate
);

const selectedSlotData = currentSlots.find(
  (slot) =>
    slot.date.slice(0, 10) === selectedDate && slot.time === selectedTime
);

  const handleConfirm = () => {
    console.log("object");
    console.log(selectedSlotData,currentExperience);
    if (currentExperience && selectedSlotData) {
      dispatch(setSelectedExperience(currentExperience));
      dispatch(setSelectedSlot(selectedSlotData));
      navigate('/checkout');
    }
  };

  const subtotal = currentExperience ? currentExperience.price * quantity : 0;
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  if (loading) return <Loader />;

  if (error || !currentExperience) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Experience not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
              <img
                src={images[currentImageIndex]}
                alt={currentExperience.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentExperience.title}
            </h1>

            <p className="text-gray-600 mb-8">{currentExperience.description}</p>

           <div className="bg-white rounded-xl p-6 mb-6">
  <h2 className="text-xl font-semibold mb-4">Choose date</h2>
  <div className="flex gap-3 flex-wrap">
    {uniqueDates.map((date) => {
      return (
   <button
  key={date}
  onClick={() => setSelectedDate(date)}
  className={`px-4 py-2 rounded-lg transition-all ${
    selectedDate === date
      ? 'bg-yellow-400 text-black'
      : 'bg-gray-100 hover:bg-gray-200'
  }`}
>
  {new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}
</button>

      )
    })}
  </div>
</div>


            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Choose time</h2>
              <p className="text-sm text-gray-500 mb-4">
                All times are in IST (GMT +5:30)
              </p>
              <div className="flex gap-3 flex-wrap">
                {availableTimesForDate.map((slot,idx) => {
                  const isSoldOut = slot.available_count === 0;
                  const leftCount = slot.available_count;

                  return (
                    <button
                      key={idx}
                      onClick={() => !isSoldOut && setSelectedTime(slot.time)}
                      disabled={isSoldOut}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors relative ${
                        isSoldOut
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTime === slot.time
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div>{slot.time}</div>
                      {!isSoldOut && leftCount <= 5 && (
                        <div className="text-xs text-red-500 font-normal">
                          {leftCount} left
                        </div>
                      )}
                      {isSoldOut && (
                        <div className="text-xs font-normal">Sold out</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 mt-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-sm text-gray-600">
                Scenic routes, trained guides, and safety briefing. Minimum age 10.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded-xl p-6 sticky top-24">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Starts at</span>
                  <span className="text-2xl font-bold">₹{currentExperience.price}</span>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => dispatch(setQuantity(Math.max(1, quantity - 1)))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => dispatch(setQuantity(quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium">₹{taxes}</span>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold">₹{total}</span>
                  </div>

                  <button
                    onClick={handleConfirm}
                    disabled={!selectedTime}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      selectedTime
                        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Confirm
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
