import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'
import type { APIProduct, APIProducts } from '@/types/api'

export type InitialState = { value: Array<APIProduct> }

const initialState: InitialState = { value: [] }

export const roomsSlice = createSlice({
  name: 'Products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<APIProducts>) => {
      state.value = action.payload?.length ? action.payload : []
    },

    getProducts: state => state,
  },
})

export const { setProducts, getProducts } = roomsSlice.actions

export default roomsSlice.reducer
