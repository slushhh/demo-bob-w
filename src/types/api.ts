/**
 * Structure of the server response when
 * requesting property data
 */
export type APIProperty = {
  /** Property ID, e.g. 1 */
  id: number

  /** Property name, e.g. `Bob W.` */
  name: string

  /** e.g. `Europe/Tallinn` */
  timezone: string

  /** Arrival time, e.g. `12:00` */
  startTimesLocal: Array<string>

  /** Departure time, e.g. `12:00 */
  endTimesLocal: Array<string>
}

/**
 * Structure of the server response when
 * requesting data about rooms
 */
export type APIRooms = Array<APIRoom>

/**
 * Structure of the server response when
 * requesting data on already booked rooms
 */
export type APIBookings = Array<APIBooking>

/**
 * Structure of the server response when
 * requesting data about additional products
 * or services
 */
export type APIProducts = Array<APIProduct>

/**
 * Room data
 */
export type APIRoom = {
  /** Room ID, e.g. 1 */
  id: number

  /** Room name, e.g. `Cheap room` */
  name: string

  /** e.g. 56 */
  pricePerNightNet: number

  /** e.g. 0.09 */
  priceTaxPercentage: number

  /** Photo of the room, link */
  image: string
}

/**
 * Product data
 */
export type APIProduct = {
  /** Product ID, e.g. 1 */
  id: number

  /** Product name, e.g. `Breakfast` */
  name: string

  /** Product NET price, e.g. 6 */
  priceNet: number

  /** e.g. 0.09 */
  priceTaxPercentage: number

  /** e.g. `nightly` */
  chargeMethod: 'nightly' | 'once-per-booking'

  /** Product photo, link */
  image: string
}

/**
 * Booking data
 */
export type APIBooking = {
  /** Booking ID, e.g. 1 */
  id: number

  /** Room ID, e.g. 2 */
  roomId: number

  /**
   * Booking start date and time,
   * e.g. `2023-05-19T09:00:00.000Z`
   * in UTC
   */
  startDateUtc: string

  /**
   * Booking end date and time,
   * e.g. `2023-05-19T09:00:00.000Z`
   * in UTC
   */
  endDateUtc: string
}

export type APIUserBookings = Array<APIUserBooking>

/**
 * User booking data, what we send
 * to the server and what we get in
 * response to a successful booking
 */
export type APIUserBooking = {
  /** Room ID, e.g. 2 */
  roomId: number

  /**
   * Booking start date and time,
   * e.g. `2023-05-19T09:00:00.000Z`
   * in UTC
   */
  startDateUtc: string

  /**
   * Booking end date and time,
   * e.g. `2023-05-19T09:00:00.000Z`
   * in UTC
   */
  endDateUtc: string

  /**
   * An array of product IDs that the
   * user has selected
   */
  productIds: Array<number>

  /**
   * Booking ID, set automatically by
   * the server
   */
  id?: number
}

export type APISummaryUserBooking = {
  roomName: string
  startDateUtc: string
  endDateUtc: string
  roomPricePerNightNet: number
  roomPriceTaxPercentage: number
  products: Array<APIProduct>
}
