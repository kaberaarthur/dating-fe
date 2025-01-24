import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveLinkState {
  activeLink: string;
}

const initialState: ActiveLinkState = {
  activeLink: 'discover', // Default active link
};

const activeLinkSlice = createSlice({
  name: 'activeLink',
  initialState,
  reducers: {
    setActiveLink: (state, action: PayloadAction<string>) => {
      state.activeLink = action.payload;
    },
  },
});

export const { setActiveLink } = activeLinkSlice.actions;

export default activeLinkSlice.reducer;
