import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'
import type { APISummaryUserBooking } from '@/types/api'

export type InitialState = {
  value: APISummaryUserBooking | Record<string, never>
}

const initialState: InitialState = { value: {} }

export const userBookingSlice = createSlice({
  name: 'User Booking',
  initialState,
  reducers: {
    setUserBooking: (state, action: PayloadAction<APISummaryUserBooking>) => {
      state.value = { ...action.payload }
    },

    getUserBooking: state => state,

    resetUserBooking: state => {
      state.value = {}
    },
  },
})

export const { setUserBooking, getUserBooking, resetUserBooking } = userBookingSlice.actions

export default userBookingSlice.reducer
