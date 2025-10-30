import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import { Booking, BookingState, Experience, Slot } from '../types';

const initialState: BookingState = {
  selectedExperience: null,
  selectedSlot: null,
  quantity: 1,
  userInfo: {
    name: '',
    email: '',
  },
  promoCode: '',
  discount: 0,
  lastBooking: null,
  loading: false,
  error: null,
};

export const validatePromoCode = createAsyncThunk(
  'booking/validatePromo',
  async (code: string) => {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Invalid promo code');

    return data;
  }
);

export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData: Booking) => {
    const referenceId = `${bookingData.experience_id.slice(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        reference_id: referenceId,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('slots')
      .update({
        available_count: supabase.sql`available_count - ${bookingData.quantity}`
      })
      .eq('id', bookingData.slot_id);

    return data as Booking;
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedExperience: (state, action: PayloadAction<Experience>) => {
      state.selectedExperience = action.payload;
    },
    setSelectedSlot: (state, action: PayloadAction<Slot>) => {
      state.selectedSlot = action.payload;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.userInfo = action.payload;
    },
    setPromoCode: (state, action: PayloadAction<string>) => {
      state.promoCode = action.payload;
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    clearBooking: (state) => {
      state.selectedExperience = null;
      state.selectedSlot = null;
      state.quantity = 1;
      state.userInfo = { name: '', email: '' };
      state.promoCode = '';
      state.discount = 0;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validatePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validatePromoCode.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(validatePromoCode.rejected, (state, action) => {
        state.error = action.error.message || 'Invalid promo code';
        state.loading = false;
        state.discount = 0;
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.lastBooking = action.payload;
        state.loading = false;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create booking';
        state.loading = false;
      });
  },
});

export const {
  setSelectedExperience,
  setSelectedSlot,
  setQuantity,
  setUserInfo,
  setPromoCode,
  setDiscount,
  clearBooking,
  clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
