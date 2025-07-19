import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'
import type { APIProperty } from '@/types/api'

export type InitialState = { value: APIProperty | Record<string, never> }

const initialState: InitialState = { value: {} }

export const propertySlice = createSlice({
  name: 'Property',
  initialState,
  reducers: {
    setProperty: (state, action: PayloadAction<APIProperty>) => {
      const data = action.payload
      state.value = Object.keys(data).length ? data : {}
    },

    getProperty: state => state,
  },
})

export const { setProperty, getProperty } = propertySlice.actions

export default propertySlice.reducer
