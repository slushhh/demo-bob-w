import { useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { Button, Result, Space, Spin } from 'antd'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { SettingsContext } from '@/context'
import { useURLSearchParams, useNetwork, useDateTime } from '@/hooks'
import { priceWithDiscount, priceWithTax } from '@/utils'
import { Routes } from '@/data/routes'
import { Guard404 } from '@/components/guard-404'

import type { RootState } from '@/store'

/**
 * The data structure that we need to
 * use the prices of the products ordered
 * by the user
 */
type ProductData = Array<{
  id: number
  basePrice: number
  totalPrice: number
  finalPrice: number
}>

/**
 * The final booking page, displays summary
 * information about the dates of the booking,
 * the cost of the order, the money saved (if the
 * user was eligible for discounts).
 * The page provides data on user's bookings if the
 * user's booking ID is known
 */
const Success = () => {
  document.title = 'Bob W | Booking: The One And Only'

  const property = useSelector((state: RootState) => state.propertySlice.value)
  const bookingSummary = useSelector((state: RootState) => state.userBookingSlice.value)
  const {
    roomName,
    startDateUtc,
    endDateUtc,
    roomPricePerNightNet,
    roomPriceTaxPercentage,
    products,
  } = bookingSummary

  dayjs.extend(timezone)
  dayjs.extend(utc)
  dayjs.tz.setDefault(property?.timezone)

  const { roomDiscount, minNightsForRoomDiscount, breakfastId, minNightsForFreeBreakfast } =
    useContext(SettingsContext)

  const { params } = useURLSearchParams()
  const { getUserBooking } = useNetwork()
  const { numberOfDays } = useDateTime(startDateUtc, endDateUtc)

  // Here and below we prepare a summary of
  // prices, dates, discounts and so on
  const isValidBoking = !!Object.keys(bookingSummary).length
  const startDate = dayjs(startDateUtc).tz().format('MMM DD YYYY, HH:mm')
  const endDate = dayjs(endDateUtc).tz().format('MMM DD YYYY, HH:mm')
  const bookingId = params.get('bookingId')!

  const isRoomDiscounted = numberOfDays >= minNightsForRoomDiscount
  const roomDiscountedPrice = priceWithDiscount(roomPricePerNightNet, roomDiscount)

  const roomBasePrice = isRoomDiscounted ? roomDiscountedPrice : roomPricePerNightNet
  const roomFullPrice = priceWithTax(roomPricePerNightNet, roomPriceTaxPercentage) * numberOfDays
  const roomFinalPrice = priceWithTax(roomBasePrice, roomPriceTaxPercentage) * numberOfDays

  const isFreeBreakfast = numberOfDays >= minNightsForFreeBreakfast

  /**
   * The price the user will actually pay
   * (the price with all discounts, free breakfast,
   * and so on)
   */
  let priceToPay = 0

  /**
   * The full price the user could pay (price without
   * discounts, free breakfast, etc.)
   */
  let fullPrice = 0

  // Here we store data about products,
  // as they themselves come in an array
  const productsData: ProductData = []

  {
    products?.forEach(p => {
      const basePrice = priceWithTax(p.priceNet, p.priceTaxPercentage)
      const totalPrice = basePrice * numberOfDays
      const finalPrice = p.chargeMethod === 'nightly' ? totalPrice : basePrice

      productsData.push({
        id: p.id,
        basePrice,
        totalPrice,
        finalPrice,
      })
    })
  }

  {
    priceToPay += roomFinalPrice
    fullPrice += roomFullPrice

    productsData?.forEach(p => {
      if (p.id === breakfastId) {
        if (!isFreeBreakfast) priceToPay += p.finalPrice
      } else {
        priceToPay += p.finalPrice
      }

      fullPrice += p.finalPrice
    })
  }

  useEffect(() => {
    // If there is no booking ID, there is
    // no point in sending a network request
    if (!bookingId) return
    return getUserBooking(bookingId)
  }, [])

  return (
    <Guard404 showGuard={!bookingId}>
      {(bookingId && isValidBoking && (
        <Result
          status='success'
          title='Success! You have booked a room!'
          extra={
            <Space direction='vertical' align='start' size='middle'>
              <Space>
                <h3>Details of your reservation:</h3>
              </Space>

              <Space>Your room: {roomName}</Space>

              <Space>Booking start date: {startDate}</Space>

              <Space>Booking end date: {endDate}</Space>

              <Space>Total number of nights: {numberOfDays}</Space>

              <Space>Total price: {priceToPay.toFixed(2)} &euro;</Space>

              <Space>Full price (without discounts): {fullPrice.toFixed(2)} &euro;</Space>

              <Space>You saved: {(fullPrice - priceToPay).toFixed(2)} &euro;</Space>

              <Space
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '15px',
                }}
              >
                <Link to={Routes.Root}>
                  <Button>Book another room</Button>
                </Link>
              </Space>
            </Space>
          }
        />
      )) || <Spin size='large' style={{ position: 'relative', top: '5px', left: '5px' }} />}
    </Guard404>
  )
}

export { Success }
export default Success
