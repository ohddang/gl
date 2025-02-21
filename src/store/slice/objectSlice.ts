import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ObjectState {
  value: number;
}

const initialState: ObjectState = {
  value: 0,
};

export const objectSlice = createSlice({
  name: "object",
  initialState: initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});
