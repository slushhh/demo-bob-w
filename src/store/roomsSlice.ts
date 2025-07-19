import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'
import type { APIRoom, APIRooms } from '@/types/api'

export type InitialState = { value: Array<APIRoom> }

const initialState: InitialState = { value: [] }

export const roomsSlice = createSlice({
  name: 'Rooms',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<APIRooms>) => {
      state.value = action.payload?.length ? action.payload : []
    },

    getRooms: state => state,
  },
})

export const { setRooms, getRooms } = roomsSlice.actions

export default roomsSlice.reducer
