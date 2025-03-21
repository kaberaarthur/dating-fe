// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number | null;
  user_id: number;
  email: string;
  password: string;
  name: string;
  gender: string;
  birthday: string;
  phone: string;
  bio: string;
  reason: string;
  county: string;
  town: string;
  interests: string[];
  user_type: string; // Added new field
}

const initialState: UserState = {
  id: null,
  user_id: 0,
  name: '',
  email: '',
  password: '',
  gender: '',
  birthday: '',
  phone: '',
  bio: '',
  reason: '',
  county: '',
  town: '',
  interests: [],
  user_type: '', // Added to initial state
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails(state, action: PayloadAction<Partial<UserState> | undefined>) {
      return { ...state, ...action.payload };
    },
    clearUserDetails() {
      return initialState;
    },
  },
});

// Export the actions
export const { setUserDetails, clearUserDetails } = userSlice.actions;

// Export the reducer to be included in the store
export default userSlice.reducer;