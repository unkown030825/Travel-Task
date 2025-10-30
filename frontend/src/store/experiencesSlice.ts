import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import { Experience, Slot } from '../types';

interface ExperiencesState {
  items: Experience[];
  currentExperience: Experience | null;
  currentSlots: Slot[];
  loading: boolean;
  error: string | null;
}

const initialState: ExperiencesState = {
  items: [],
  currentExperience: null,
  currentSlots: [],
  loading: false,
  error: null,
};

export const fetchExperiences = createAsyncThunk(
  'experiences/fetchAll',
  async () => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Experience[];
  }
);

export const fetchExperienceById = createAsyncThunk(
  'experiences/fetchById',
  async (id: string) => {
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (expError) throw expError;

    const { data: slots, error: slotsError } = await supabase
      .from('slots')
      .select('*')
      .eq('experience_id', id)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (slotsError) throw slotsError;

    return { experience: experience as Experience, slots: slots as Slot[] };
  }
);

const experiencesSlice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {
    clearCurrentExperience: (state) => {
      state.currentExperience = null;
      state.currentSlots = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperiences.fulfilled, (state, action: PayloadAction<Experience[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load experiences';
        state.loading = false;
      })
      .addCase(fetchExperienceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperienceById.fulfilled, (state, action) => {
        state.currentExperience = action.payload.experience;
        state.currentSlots = action.payload.slots;
        state.loading = false;
      })
      .addCase(fetchExperienceById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load experience details';
        state.loading = false;
      });
  },
});

export const { clearCurrentExperience } = experiencesSlice.actions;
export default experiencesSlice.reducer;
