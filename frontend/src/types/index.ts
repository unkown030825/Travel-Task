export interface Experience {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  location: string;
  created_at: string;
}

export interface Slot {
  id: string;
  experience_id: string;
  date: string;
  time: string;
  available_count: number;
  total_count: number;
  created_at: string;
}

export interface Booking {
  id?: string;
  experience_id: string;
  slot_id: string;
  user_name: string;
  user_email: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total_price: number;
  promo_code?: string;
  discount_amount: number;
  reference_id?: string;
  status?: string;
  created_at?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  active: boolean;
  created_at: string;
}

export interface BookingState {
  selectedExperience: Experience | null;
  selectedSlot: Slot | null;
  quantity: number;
  userInfo: {
    name: string;
    email: string;
  };
  promoCode: string;
  discount: number;
  lastBooking: Booking | null;
  loading: boolean;
  error: string | null;
}
