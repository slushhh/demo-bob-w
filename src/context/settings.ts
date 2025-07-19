import { createContext } from 'react'

/**
 * The context of settings, constants and
 * everything that will only be read and
 * will not be changed
 */
export type SettingsContext = {
  /** Percentage discount on room price */
  roomDiscount: number

  /**
   * Minimum number of days to get discounted
   * room rates
   */
  minNightsForRoomDiscount: number

  /**
   * Minimum number of days to get free
   * breakfast
   */
  minNightsForFreeBreakfast: number

  /**
   * Product ID `Breakfast` in the product
   * list
   */
  breakfastId: number
}

/** Settings context data */
export const settingsContext: SettingsContext = {
  roomDiscount: 5,
  minNightsForRoomDiscount: 3,
  minNightsForFreeBreakfast: 28,
  breakfastId: 1,
}

export const SettingsContext = createContext<SettingsContext>(settingsContext)
