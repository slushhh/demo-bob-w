import type {
  APIBookings,
  APIProduct,
  APIProducts,
  APIProperty,
  APIRoom,
  APIRooms,
  APIUserBooking,
} from '@/types/api'

type RequestOptions = {
  signal?: AbortSignal
  body?: BodyInit
  method?: RequestInit['method']
  id?: string | number
}

const APIPort = import.meta.env.VITE_API_PORT

/**
 * Performs a network request
 */
const Request = (url: string, options: RequestOptions): Promise<Response> => {
  const { signal, method, body } = options
  const headers: Dictionary = {}

  if (method === 'POST') {
    headers['Content-Type'] = 'application/json'
  }

  // Here we emulate a random network delay
  // of up to two seconds to approximate real
  // conditions
  return new Promise(res => {
    setTimeout(
      () => {
        res(
          fetch(`http://localhost:${APIPort}/${url}`, {
            signal,
            method,
            body,
            headers,
          }),
        )
      },
      Math.round(Math.random() * 2000),
    )
  })
}

/**
 * Requests property data from the server
 */
export const apiGetProperty = async (options: RequestOptions): Promise<APIProperty> => {
  const { signal } = options

  const req = await Request('property', { signal })
  return await req.json()
}

/**
 * Requests a list of rooms from the server
 */
export const apiGetRooms = async (options: RequestOptions): Promise<APIRooms> => {
  const { signal } = options

  const req = await Request('rooms', { signal })
  return await req.json()
}

/**
 * Requests data about a specific room
 * from the server
 */
export const apiGetRoom = async (options: RequestOptions): Promise<APIRoom | Array<APIRoom>> => {
  const { signal, id } = options

  const req = await Request('rooms/' + id, { signal })
  return await req.json()
}

/**
 * Requests from the server a list of
 * products that the user can order after
 * selecting a room
 */
export const apiGetProducts = async (options: RequestOptions): Promise<APIProducts> => {
  const { signal } = options

  const req = await Request('products', { signal })
  return await req.json()
}

/**
 * Requests data about a specific product
 * from the server
 */
export const apiGetProduct = async (
  options: RequestOptions,
): Promise<APIProduct | Array<APIProduct>> => {
  const { signal, id } = options

  const req = await Request('products/' + id, { signal })
  return await req.json()
}

/**
 * Requests a list of already booked
 * rooms from the server
 */
export const apiGetBookings = async (options: RequestOptions): Promise<APIBookings> => {
  const { signal } = options

  const req = await Request('bookings', { signal })
  return await req.json()
}

/**
 * Send data to the server with the user's
 * booking data in order to book a room
 */
export const apiBookRoom = async (
  options: RequestOptions,
): Promise<APIUserBooking | Array<APIUserBooking>> => {
  const { signal, body } = options

  const req = await Request('booking', { signal, body, method: 'POST' })
  return await req.json()
}

/**
 * Requests data about a specific user
 * booking from the server
 */
export const apiGetUserBooking = async (options: RequestOptions): Promise<APIUserBooking> => {
  const { signal, id } = options

  const req = await Request('booking/' + id, { signal })
  return await req.json()
}
