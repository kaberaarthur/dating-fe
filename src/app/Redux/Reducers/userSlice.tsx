// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number | null;
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
}

const initialState: UserState = {
  id: null,
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
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails(state, action: PayloadAction<Partial<UserState>>) {
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
