import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'
import type { APIBooking, APIBookings } from '@/types/api'

export type InitialState = { value: Dictionary<APIBooking> }

const initialState: InitialState = { value: {} }

export const bookingsSlice = createSlice({
  name: 'Bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<APIBookings>) => {
      const hashMap: Dictionary<APIBooking> = {}

      action.payload?.forEach(b => (hashMap[b.roomId] = b))
      state.value = hashMap
    },

    getBookings: state => state,
  },
})

export const { setBookings, getBookings } = bookingsSlice.actions

export default bookingsSlice.reducer
