import { configureStore } from '@reduxjs/toolkit'

import roomsSlice from '@/store/roomsSlice'
import productsSlice from '@/store/productsSlice'
import bookingsSlice from '@/store/bookingsSlice'
import propertySlice from '@/store/propertySlice'
import userBookingSlice from '@/store/userBookingSlice'

export const store = configureStore({
  reducer: {
    roomsSlice,
    productsSlice,
    bookingsSlice,
    propertySlice,
    userBookingSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
