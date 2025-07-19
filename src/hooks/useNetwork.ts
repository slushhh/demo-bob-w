import { useDispatch, useSelector } from 'react-redux'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { useDateTime, useURLSearchParams } from '@/hooks'

import type { APIProduct, APIRoom, APISummaryUserBooking, APIUserBooking } from '@/types/api'
import type { RootState } from '@/store'

import * as api from '@/services/api'
import * as propertyActions from '@/store/propertySlice'
import * as roomsActions from '@/store/roomsSlice'
import * as bookingsActions from '@/store/bookingsSlice'
import * as productsActions from '@/store/productsSlice'
import * as userBookingActions from '@/store/userBookingSlice'

/**
 * Hook for handling network requests, setting
 * states on their results, error handling, and so on
 */
const useNetwork = () => {
  const dispatch = useDispatch()
  const { userBookingToDayJs } = useDateTime()
  const { params } = useURLSearchParams()

  const property = useSelector((state: RootState) => state.propertySlice.value)

  dayjs.extend(timezone)
  dayjs.extend(utc)
  dayjs.tz.setDefault(property?.timezone)

  /**
   * Getting property data from the server
   * and setting the appropriate state
   */
  const getProperty = () => {
    const controller = new AbortController()
    const signal = controller.signal

    ;(async () => {
      try {
        const property = await api.apiGetProperty({ signal })

        dispatch(userBookingActions.resetUserBooking())
        if (property) dispatch(propertyActions.setProperty(property))
      } catch (error) {
        const { name } = error as Error
        if (name === 'AbortError') {
          // Here and further on in similar queries,
          // we do nothing, the exception is expected
          // if the network request was canceled by the signal
        } else {
          console.error(error)
        }
      }
    })()

    return () => controller.abort()
  }

  /**
   * Sends two parallel requests to get the
   * list of rooms and data about already booked
   * rooms
   */
  const getRoomsAndBooking = () => {
    const controller = new AbortController()
    const signal = controller.signal

    ;(async () => {
      try {
        // We run it in parallel
        const [rooms, bookings] = await Promise.all([
          api.apiGetRooms({ signal }),
          api.apiGetBookings({ signal }),
        ])

        if (rooms) dispatch(roomsActions.setRooms(rooms))
        if (bookings) dispatch(bookingsActions.setBookings(bookings))
      } catch (error) {
        const { name } = error as Error
        if (name === 'AbortError') {
          // Do nothing
        } else {
          console.error(error)
        }
      }
    })()

    return () => controller.abort()
  }

  /**
   * Gets the list of products from the server
   */
  const getProducts = () => {
    const controller = new AbortController()
    const signal = controller.signal

    ;(async () => {
      try {
        const products = await api.apiGetProducts({ signal })
        if (products) dispatch(productsActions.setProducts(products))
      } catch (error) {
        const { name } = error as Error
        if (name === 'AbortError') {
          // Do nothing
        } else {
          console.error(error)
        }
      }
    })()

    return () => controller.abort()
  }

  /**
   * Sends a request to the server to book a room
   */
  const bookRoom = async () => {
    const { userBookingStart, userBookingEnd } = userBookingToDayJs()
    const roomId = +params.get('roomId')!
    const productIds = params.get('productIds') || ''
    let productIdsNum: Array<number>

    {
      const iDsString = productIds.split('-').filter(Boolean)
      productIdsNum = iDsString.map(id => +id)
    }

    // Compose the body of the request
    const body: APIUserBooking = {
      startDateUtc: userBookingStart.format(),
      endDateUtc: userBookingEnd.format(),
      roomId,
      productIds: productIdsNum,
    }

    const apiBody = JSON.stringify(body)
    const request = api.apiBookRoom({ body: apiBody })

    return request
  }

  /**
   * Gets data about a specific user's booking.
   * This is only needed to display the summary
   * on the `Success` page if the user goes there
   * and reloads the page.
   * This could be solved more elegantly (by using
   * the cache), but let it be
   */
  const getUserBooking = (id: string | number) => {
    const controller = new AbortController()
    const signal = controller.signal

    ;(async () => {
      try {
        const userBooking = await api.apiGetUserBooking({ signal, id })
        const { roomId, productIds } = userBooking
        const productsString = productIds.map(id => 'id=' + id).join('&')

        const results = await Promise.all([
          api.apiGetRoom({ signal, id: roomId }),
          api.apiGetProduct({ signal, id: '?' + (productsString || 'id=-1') }),
        ])

        const room = results[0] as APIRoom
        const products = results[1] as Array<APIProduct>

        // This is what we need to display the data
        const bookingSummary: APISummaryUserBooking = {
          startDateUtc: userBooking.startDateUtc,
          endDateUtc: userBooking.endDateUtc,
          roomName: room.name,
          roomPricePerNightNet: room.pricePerNightNet,
          roomPriceTaxPercentage: room.priceTaxPercentage,
          products,
        }

        if (results) dispatch(userBookingActions.setUserBooking(bookingSummary))
      } catch (error) {
        const { name } = error as Error
        if (name === 'AbortError') {
          // Do nothing
        } else {
          console.log(error)
        }
      }
    })()

    return () => controller.abort()
  }

  return {
    getProperty,
    getRoomsAndBooking,
    getProducts,
    bookRoom,
    getUserBooking,
  }
}

export { useNetwork }
