// store/stepSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StepState {
  currentStep: number;
}

const initialState: StepState = {
  currentStep: 0,  // Initialize currentStep to 0
};

const stepSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {
    // Action to set the current step
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    // Action to increment the current step
    incrementStep(state) {
      if (state.currentStep < 9) {  // Prevent going beyond the last step (assuming there are 8 steps)
        state.currentStep += 1;
      }
    },
    // Action to decrement the current step
    decrementStep(state) {
      if (state.currentStep > 0) {  // Prevent going below step 0
        state.currentStep -= 1;
      }
    },
  },
});

// Export the actions
export const { setCurrentStep, incrementStep, decrementStep } = stepSlice.actions;

// Export the reducer to be included in the store
export default stepSlice.reducer;
